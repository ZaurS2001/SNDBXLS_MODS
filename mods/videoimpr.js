{
    let currentVideoFrames = [];
    let videoFrame = 0;
    let processed = 0;
    let started = false;
    let videoWidth = 0;
    let videoHeight = 0;
    let FPS = tps / 2;
    
    let videoAudio = null;
    let totalPixels = 0;
    let glitchInterval = null;
    let freezeTime = null; // Tracks where the audio "froze"

    const splitHex = (hex) => hex.slice(1).match(/../g).map(a => Math.floor(parseInt(a, 16)));
    const hexify = (rgb) => "#" + rgb.map(a => Math.floor(a).toString(16).padStart(2, "0")).join("");

    elements.video_pixel = {
        color: "#ffffff",
        hidden: true,
        category: "special",
        canPlace: false,
	tempHigh: 1538,
	breakInto: "glass_shard",
        tool: () => {},
        tick: (pixel) => {
            if (started && pixelTicks % (tps / FPS) == 0) {
                processed++;
                if (processed >= videoWidth * videoHeight) {
                    videoFrame++;
                    processed = 0;
                }
                if (videoFrame >= currentVideoFrames.length) {
                    videoFrame = 0;
                    processed = 0;
                }
                pixel.color = currentVideoFrames[videoFrame][pixel.y][pixel.x - Math.floor((width - videoWidth) / 2)];
            }
        }
    }

    function applyGlitch() {
        if (!started || !videoAudio) return;

        // 1. Count remaining pixels
        let currentCount = 0;
        for (let x = 0; x < width; x++) {
            for (let y = 0; y < height; y++) {
                if (pixelMap[x][y] && pixelMap[x][y].element === "video_pixel") {
                    currentCount++;
                }
            }
        }

        // 2. BSOD logic (Zero pixels left)
        if (currentCount === 0) {
            if (freezeTime === null) freezeTime = videoAudio.currentTime;
            
            // Rapidly reset to the freeze point to create a "buzz"
            videoAudio.currentTime = freezeTime;
            videoAudio.playbackRate = 1.2; // Slightly higher pitch for the "error" sound
            videoAudio.volume = 1;
            return; 
        }

        // Reset freeze point if pixels are added back/exist
        freezeTime = null;

        // 3. Normal Glitch logic
        let corruption = 1 - (currentCount / totalPixels);

        if (corruption > 0.02) {
            // Pitch/Speed Glitch
            if (Math.random() < corruption) {
                videoAudio.playbackRate = 1 + (Math.random() - 0.5) * (corruption * 3);
            } else {
                videoAudio.playbackRate = 1;
            }

            // Stutter
            if (Math.random() < corruption * 0.3) {
                videoAudio.currentTime -= 0.1 * corruption;
            }

            // Audio Dropout
            if (Math.random() < corruption * 0.5) {
                videoAudio.volume = Math.random() > corruption ? 1 : 0;
            } else {
                videoAudio.volume = 1;
            }
        } else {
            videoAudio.playbackRate = 1;
            videoAudio.volume = 1;
        }
    }

    const chunk = (arr, size) => arr.map((_, i) => i % size == 0 ? arr.slice(i, i + size) : null).filter(a => a)

    elements.video = {
        color: ["#78bbff","#5bb81a"],
        onSelect: () => {
            if (!localStorage.getItem("video.js/tutorial")) {
                alert("Loading video... Delete pixels to glitch audio!");
                localStorage.setItem("video.js/tutorial", true);
            }
            const file = document.createElement("input");
            file.type = "file";
            file.accept = "video/*";
            file.click();
            file.onchange = () => {
                setTimeout(() => {
                    const video = document.createElement("video");
                    video.preload = "auto";
                    const url = URL.createObjectURL(file.files[0]);
                    video.src = url;
                    video.load();

                    let canvas = document.createElement("canvas", { willReadFrequently: true });
                    let ctx = canvas.getContext("2d");
                    
                    video.onloadeddata = async () => {
                        const w = video.videoWidth;
                        const h = video.videoHeight;
                        const newHeight = height;
                        const newWidth = Math.floor((w / h) * newHeight);
                        canvas.width = video.videoWidth;
                        canvas.height = video.videoHeight;
                        videoWidth = newWidth;
                        videoHeight = newHeight;
                        
                        const videoLength = video.duration * FPS;
                        const seekBy = video.duration / videoLength;
                        totalPixels = newWidth * newHeight;

                        for (let i = 0; i < newWidth; i++) {
                            for (let y = 0; y < newHeight; y++) {
                                const x = Math.floor((width - newWidth) / 2) + i;
                                if (pixelMap[x][y]) deletePixel(x, y);
                                createPixel("video_pixel", x, y);
                            }
                        };

                        currentVideoFrames = [];
                        video.currentTime = 0;

                        video.onseeked = () => {
                            ctx.drawImage(video, 0, 0, newWidth, newHeight);
                            const imageData = chunk(chunk(Array.from(ctx.getImageData(0, 0, newWidth, newHeight).data), 4), newWidth);
                            const frame = [];
                            for (let y = 0; y < newHeight; y++) {
                                frame[y] = [];
                                for (let x = 0; x < newWidth; x++) {
                                    frame[y][x] = `#${imageData[y][x].slice(0, 3).map(a => a.toString(16).padStart(2, "0")).join("")}`
                                }
                            }
                            currentVideoFrames.push(frame);

                            if (currentVideoFrames.length >= videoLength) {
                                if (videoAudio) { videoAudio.pause(); }
                                if (glitchInterval) { clearInterval(glitchInterval); }

                                videoAudio = new Audio();
                                videoAudio.src = url;
                                videoAudio.loop = true;
                                videoAudio.play();
            
                                started = true;
                                videoFrame = 0;
                                freezeTime = null;

                                // Engine set to 30ms for a high-speed "BSOD" buzzing sound
                                glitchInterval = setInterval(applyGlitch, 30);
                            } else {
                                video.currentTime += seekBy;
                            }
                        }
                    }
                }, 500);
            }
        },
        tool: () => {},
        category: "special"
    }
}