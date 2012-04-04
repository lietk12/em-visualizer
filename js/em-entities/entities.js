// Definitions for all objects in the universe by shape

// Models any object in the universe
var Entity = new Class({
	initialize: function(properties) { // Object
		this.id = properties.id;
		this.type = ["Object"];
		this.setName(properties.name);
		this.setAnchored(properties.anchored);
		this.setMass(properties.mass);
	},
	
	getId: function() {
		return this.id; // int
	},
	getType: function() {
		return this.type; // String
	},
	
	// Handles the entity's name
	setName: function(name) { // String
		this.name = name;
	},
	getName: function() {
		return this.name; // String
	},
	
	// Handles whether or not the entity is mobile
	setAnchored: function(anchored) { // bool
		this.anchored = anchored;
	},
	isAnchored: function() {
		return this.anchored; // bool
	},
	
	// Handles the entity's mass
	setMass: function(mass) { // double
		this.mass = mass;
	},
	getMass: function() {
		return this.mass; // double
	}
});

// Models any point object in the universe
var PointEntity = new Class({
	Extends: Entity,
	
	initialize: function(properties) { // Object
		this.parent(properties);
		this.type.push("Point");
		this.setLocation(properties.location);
	},
	
	// Handles the entity's location
	setLocation: function(location) { // point as Vector
		this.location = location;
	},
	getLocation: function() {
		return this.location; // point as Vector
	},

	// Returns a vector from the location of the point entity to the given location
	findVectorTo: function(location) { // point as Vector
		return location.subtract(this.location); // vector as Vector
	}
});

// Models any line object in the universe
var LineEntity = new Class({
	Extends: Entity,
	
	initialize: function(properties) { // Object
		this.parent(properties);
		this.type.push("Line");
		this.setLine(properties.line);
	},
	
	// Handles the entity's location and direction
	setLine: function(line) { // Line
		this.line = line;
	},
	getLine: function() {
		return this.line; // Line
	},
	
	// Returns the smallest-magnitude vector from the line entity to the given location
	findVectorTo: function(location) {
		return location.subtract(this.line.pointClosestTo(location)); // vector as Vector
	}
});

// Models any ray object in the universe
// TODO: determine how to store the ray: maybe as a line, with the anchor as the starting point?
var RayEntity = new Class({
	Extends: LineEntity,
	
	initialize: function(properties) { //Object
		this.parent(properties);
		this.type.push("Ray");
		this.setRay(properties.ray);
	}
});

// Models any line segment object in the universe
// TODO: determine how to store the line segment; maybe as a line, with the anchor and dir vector as the endpoints?
var LineSegmentEntity = new Class({
	Extends: LineEntity,
	
	initialize: function(properties) { // Object
		this.parent(properties);
		this.type.push("Segment");
		this.setLineSegment(properties.lineSegment);
	}
});

// Models any solid object in the universe
// TODO: determine how to store the solid object
var SolidEntity = new Class({
	Extends: Entity,
	
	initialize: function(properties) { // Object
		this.parent(properties);
		this.type.push("Solid");
	}
});