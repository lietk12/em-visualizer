// Get a reference to the canvas object
paper.install(window);
var canvas = document.getElementById('myCanvas');
// Create an empty project and a view for the canvas:
paper.setup(canvas);
debug.info("Set up canvas view of", view.viewSize);

var currentUniverse = new Universe({
	id: 0,
	name: "Test Universe",
	physicalConstants: {
		vacuumPermittivity: 1.0 / (4 * Math.Pi * Math.pow(10, -7) * Math.pow(299792458, 2)),
		vacuumPermeability: 4 * Math.Pi * Math.pow(10, -7)
	},
	entities: {
		
	},
	graphics: {
		locationOfCenterOfCanvas: Vector.create([0, 0]),
		canvasZoom: Math.log(500)
	},
	text: {
		decimalPrecision: 10
	}
});
entity0Preset = {
	id: currentUniverse.getNextEntityId(),
	name: "Second Location",
	point: {
		location: Vector.create([1, 0])
	},
	graphics: {
		canvasCoordinates: currentUniverse.findCanvasCoordinates(Vector.create([1, 0]))
	}
};
currentUniverse.addEntity(new UniverseLocation(entity0Preset, currentUniverse));
entity1Preset = {
	id: currentUniverse.getNextEntityId(),
	name: "Third Location",
	point: {
		location: Vector.create([-1, 0])
	},
	graphics: {
		canvasCoordinates: currentUniverse.findCanvasCoordinates(Vector.create([-1, 0]))
	}
};
currentUniverse.addEntity(new UniverseLocation(entity1Preset, currentUniverse));
currentUniverse.getEntity(1).updateLocation(new Point(50, 50), currentUniverse);
currentUniverse.getEntity(2).updateLocation(new Point(50, 50), currentUniverse);
currentUniverse.getEntity(2).updateLocationByOffset(new Point(50, 50), currentUniverse);
debug.debug("Test universe now looks like", currentUniverse);

// Set up view
view.onFrame = function(event) {
	//currentUniverse.getEntity(2).updateLocationByOffset(new Point(5, 5), currentUniverse);
};
// TODO: Add proper onResize handler