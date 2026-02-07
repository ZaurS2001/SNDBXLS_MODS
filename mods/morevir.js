elements.SlowVirus = {
	color: "#11AA11",
	tick: function(pixel) {
		for (var i = 0; i < adjacentCoords.length; i++) {
			var coords = adjacentCoords[i];
			var x = pixel.x + coords[0];
			var y = pixel.y + coords[1];
			if (!isEmpty(x,y,true)) {
				var newPixel = pixelMap[x][y]
				if (elements[newPixel.element].id !== elements.virus.id && elements[newPixel.element].hardness !== 1 && !pixel.heal && elements.virus.ignore.indexOf(newPixel.element) === -1) {
					if (Math.random() < 0.15) { newPixel.origElem = newPixel.element; changePixel(newPixel,"SlowVirus"); }
				}
				else if (elements[newPixel.element].id === elements.virus.id && pixel.heal) { newPixel.heal = true }
			}
		}
		if (pixel.heal && Math.random() < 0.01) {
			if (pixel.origElem) { changePixel(pixel,pixel.origElem); delete pixel.heal; delete pixel.origElem }
			else { deletePixel(pixel.x,pixel.y); return }
		}
		tryMove(pixel,pixel.x,pixel.y+1);
		doDefaults(pixel)
	},
	reactions: {
		"chlorine": { elem1:null },
		"liquid_chlorine": { elem1:null },
		"chlorine_ice": { elem1:null },
		"light": { elem1:null, chance:0.1 },
		"liquid_light": { elem1:null, chance:0.1 },
		"electric": { elem2:"malware" }
	},
	ignore: ["fire","smoke","soap","plague","cancer","plasma","light","loopy","liquid_light","malware","electric","pointer"],
	category: "special",
	state: "solid",
	density: 600,
	excludeRandom: true
},
elements.VerySlowVirus = {
	color: "#AA1111",
	tick: function(pixel) {
		for (var i = 0; i < adjacentCoords.length; i++) {
			var coords = adjacentCoords[i];
			var x = pixel.x + coords[0];
			var y = pixel.y + coords[1];
			if (!isEmpty(x,y,true)) {
				var newPixel = pixelMap[x][y]
				if (elements[newPixel.element].id !== elements.virus.id && elements[newPixel.element].hardness !== 1 && !pixel.heal && elements.virus.ignore.indexOf(newPixel.element) === -1) {
					if (Math.random() < 0.05) { newPixel.origElem = newPixel.element; changePixel(newPixel,"VerySlowVirus"); }
				}
				else if (elements[newPixel.element].id === elements.virus.id && pixel.heal) { newPixel.heal = true }
			}
		}
		if (pixel.heal && Math.random() < 0.01) {
			if (pixel.origElem) { changePixel(pixel,pixel.origElem); delete pixel.heal; delete pixel.origElem }
			else { deletePixel(pixel.x,pixel.y); return }
		}
		tryMove(pixel,pixel.x,pixel.y+1);
		doDefaults(pixel)
	},
	reactions: {
		"chlorine": { elem1:null },
		"liquid_chlorine": { elem1:null },
		"chlorine_ice": { elem1:null },
		"light": { elem1:null, chance:0.1 },
		"liquid_light": { elem1:null, chance:0.1 },
		"electric": { elem2:"malware" }
	},
	ignore: ["fire","smoke","soap","plague","cancer","plasma","light","loopy","liquid_light","malware","electric","pointer"],
	category: "special",
	state: "solid",
	density: 600,
	excludeRandom: true
},
elements.SuperSlowVirus = {
	color: "#1111AA",
	tick: function(pixel) {
		for (var i = 0; i < adjacentCoords.length; i++) {
			var coords = adjacentCoords[i];
			var x = pixel.x + coords[0];
			var y = pixel.y + coords[1];
			if (!isEmpty(x,y,true)) {
				var newPixel = pixelMap[x][y]
				if (elements[newPixel.element].id !== elements.virus.id && elements[newPixel.element].hardness !== 1 && !pixel.heal && elements.virus.ignore.indexOf(newPixel.element) === -1) {
					if (Math.random() < 0.005) { newPixel.origElem = newPixel.element; changePixel(newPixel,"SuperSlowVirus"); }
				}
				else if (elements[newPixel.element].id === elements.virus.id && pixel.heal) { newPixel.heal = true }
			}
		}
		if (pixel.heal && Math.random() < 0.01) {
			if (pixel.origElem) { changePixel(pixel,pixel.origElem); delete pixel.heal; delete pixel.origElem }
			else { deletePixel(pixel.x,pixel.y); return }
		}
		tryMove(pixel,pixel.x,pixel.y+1);
		doDefaults(pixel)
	},
	reactions: {
		"chlorine": { elem1:null },
		"liquid_chlorine": { elem1:null },
		"chlorine_ice": { elem1:null },
		"light": { elem1:null, chance:0.1 },
		"liquid_light": { elem1:null, chance:0.1 },
		"electric": { elem2:"malware" }
	},
	ignore: ["fire","smoke","soap","plague","cancer","plasma","light","loopy","liquid_light","malware","electric","pointer"],
	category: "special",
	state: "solid",
	density: 600,
	excludeRandom: true
}