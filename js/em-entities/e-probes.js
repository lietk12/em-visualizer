// Gets the E Field for a point in the universe
var EField = new Class({
	Extends: PointEntity,
	
	initialize: function(properties, universe) { // Object, Universe
		// Send up to parent
		this.parent(properties, universe);
		// Handle e-field-probe-specific constants
		this.getType().push("E Field");
		// Handle e-field-probe-specific variables
	},
	
	measure: function(universe) { // Universe
		return universe.findElectricFieldAt(this.getLocation()); // vector as Vector
	}
});

// Gets the E Field vector for a point in the universe
var EFieldVector = new Class({
	Extends: EField,
	
	initialize: function(properties, universe) { // Object, Universe
		// Send up to parent
		this.parent(properties, universe);
		// Handle e-field-probe-specific constants
		this.getType().push("Vector");
		// Handle e-field-probe-specific variables
	},
	initializeGraphics: function(universe) { // Universe
		this.parent(universe);
		// Set up storage
		this.getGroup().arrow = {
			group: new Group()
		};
		this.getGroup().group.appendBottom(this.getArrow().group);
		// Draw the arrowhead
		var arrowhead = new Path.RegularPolygon(this.getCanvasCoordinates(), 3, 3.5);
		arrowhead.style = {
			fillColor: "black",
			strokeColor: "black",
			strokeWidth: 2
		};
		arrowhead.rotate(-150);
		// Draw the arrowtail
		var arrowtail = new Path.Line(this.getCanvasCoordinates(), this.getCanvasCoordinates());
		arrowtail.style = {
			strokeColor: "black",
			strokeWidth: 2
		};
		// Commit graphics
		//// Add the arrowhead
		this.getArrow().arrowhead = arrowhead;
		this.getArrow().group.appendTop(arrowhead);
		//// Add the arrowtail
		this.getArrow().arrowtail = arrowtail;
		this.getArrow().group.appendBottom(arrowtail);
		// Initialize other stuff
		this.getGraphics().arrow = {
			magnitude: 0,
			angle: 0
		};
		this.refreshGraphics(universe);
	},
	
	// Handles graphical display of the entity
	getArrow: function() {
		return this.getGroup().arrow; // Object
	},
	refreshGraphics: function(universe) { // Universe
		// Update label
		var decimalPrecision = universe.getDecimalPrecision();
		this.getMainLabel().text.content = parseFloat(this.measure(universe).modulus().toPrecision(decimalPrecision)) + "N/C";
		// Prepare for updating the vector arrow
		var vectorData = this.measure(universe).to3D();
		// Determine information about vector arrow
		var vectorMagnitude = vectorData.modulus() * universe.getVectorScaling();
		if (vectorMagnitude < 1 || vectorMagnitude > Math.pow(10, 20)) { // If the electric field is effectively zero or too large to handle
			vectorMagnitude = 0;
			vectorAngle = 0;
		} else {
			var vectorOrientation = -1 * Vector.i.cross(vectorData).toUnitVector().e(3); // Direction of 1 means the arrow is clockwise from j; direction of -1 means the arrow is counterclockwise from j
			var vectorAngle = vectorOrientation * vectorData.angleFrom(Vector.i) * 180 / Math.PI;
		}
		var previousMagnitude = this.getGraphics().arrow.magnitude;
		var previousAngle = this.getGraphics().arrow.angle;
		// Modify the graphics
		if (vectorMagnitude == 0) { // if want to make the direction vector indicate no field
			// Make a new endpoint
			this.getArrow().arrowtail.lastSegment.point = this.getCanvasCoordinates();
			this.getArrow().arrowtail.firstSegment.point = this.getCanvasCoordinates();
			// Move the arrowhead
			this.getArrow().arrowhead.position = this.getCanvasCoordinates();
		} else {
			if (previousMagnitude == 0) { // the vector was previously drawn as zero, but it no longer should be
				// Make a new endpoint
				this.getArrow().arrowtail.lastSegment.point = (new Point(vectorMagnitude, 0)).add(this.getCanvasCoordinates());
				this.getArrow().arrowtail.firstSegment.point = this.getCanvasCoordinates();
				// Move the arrowhead
				this.getArrow().arrowhead.position = this.getArrow().arrowtail.lastSegment.point;
			} else {
				// Scale the vector
				var newVector = this.getArrow().arrowtail.lastSegment.point.subtract(this.getArrow().arrowtail.firstSegment.point).multiply(vectorMagnitude / previousMagnitude);
				this.getArrow().arrowtail.firstSegment.point = this.getCanvasCoordinates();
				this.getArrow().arrowtail.lastSegment.point = newVector.add(this.getCanvasCoordinates());
				this.getArrow().arrowhead.position = this.getArrow().arrowtail.lastSegment.point;
			}
		}
		if (vectorMagnitude != 0 || previousMagnitude != 0) { // i.e. the graphics must be changed
			// Rotate the arrow accordingly
			this.getArrow().group.rotate(vectorAngle - previousAngle, this.getArrow().arrowtail.firstSegment.point);
			// Store info for next graphics update
			this.getGraphics().arrow.magnitude = vectorMagnitude;
			this.getGraphics().arrow.angle = vectorAngle;
			return true; // bool
		}
	},
});

// Gets the E Field direction vector for a point in the universe
var EFieldDirection = new Class({
	Extends: EField,
	
	initialize: function(properties, universe) { // Object, Universe
		// Send up to parent
		this.parent(properties, universe);
		// Handle e-field-direction-probe-specific constants
		this.getType().push("Direction Vector");
		// Handle e-field-direction-probe-specific variables
	},
	initializeGraphics: function(universe) { // Universe
		this.parent(universe);
		this.getMainLabel().text.content = "";
		// Set up storage
		this.getGroup().arrow = {
			group: new Group()
		};
		this.getGroup().group.appendBottom(this.getArrow().group);
		// Draw the arrowhead for the vector
		var arrowhead = new Path.RegularPolygon(this.getCanvasCoordinates(), 3, 3.5);
		arrowhead.style = {
			fillColor: "black",
			strokeColor: "black",
			strokeWidth: 2
		};
		arrowhead.rotate(-150);
		// Draw the arrowtail for the vector
		var arrowtail = new Path.Line(this.getCanvasCoordinates(), this.getCanvasCoordinates());
		arrowtail.style = {
			strokeColor: "black",
			strokeWidth: 2
		};
		// Commit graphics
		//// Add the arrowhead
		this.getArrow().arrowhead = arrowhead;
		this.getArrow().group.appendTop(arrowhead);
		//// Add the arrowtail
		this.getArrow().arrowtail = arrowtail;
		this.getArrow().group.appendBottom(arrowtail);
		// Initialize other stuff
		this.getGraphics().arrow = {
			magnitude: 0,
			angle: 0
		};
		this.refreshGraphics(universe);
	},
	
	measure: function(universe) { // Universe
		return this.parent(universe).toUnitVector(); // vector as Vector
	},
	
	// Handles graphical display of the entity
	getArrow: function() {
		return this.getGroup().arrow; // Object
	},
	refreshGraphics: function(universe) { // Universe
		// Prepare for updating the vector arrow
		var vectorData = this.measure(universe).to3D();
		// Determine information about vector arrow
		var vectorMagnitude = vectorData.modulus();
		if (vectorMagnitude < Math.pow(10, -9)) { // If the electric field is effectively zero
			vectorMagnitude = 0;
			vectorAngle = 0;
		} else {
			var vectorOrientation = -1 * Vector.i.cross(vectorData).toUnitVector().e(3); // Direction of 1 means the arrow is clockwise from j; direction of -1 means the arrow is counterclockwise from j
			var vectorAngle = vectorOrientation * vectorData.angleFrom(Vector.i) * 180 / Math.PI;
		}
		var previousMagnitude = this.getGraphics().arrow.magnitude;
		var previousAngle = this.getGraphics().arrow.angle;
		// Modify the graphics
		if (vectorMagnitude == 0) { // if want to make the direction vector indicate no field
			this.getArrow().arrowtail.lastSegment.point = this.getCanvasCoordinates();
			this.getArrow().arrowtail.firstSegment.point = this.getCanvasCoordinates();
			// Move the arrowhead
			this.getArrow().arrowhead.position = this.getCanvasCoordinates();
		} else {
			if (previousMagnitude == 0) { // the vector was previously drawn as zero, but it no longer should be
				this.getArrow().arrowtail.lastSegment.point = (new Point(12, 0)).add(this.getCanvasCoordinates());
				this.getArrow().arrowtail.firstSegment.point = (new Point(-12, 0)).add(this.getCanvasCoordinates());
				// Move the arrowhead
				this.getArrow().arrowhead.position = this.getArrow().arrowtail.lastSegment.point;
			}
		}
		if (vectorMagnitude != 0 || previousMagnitude != 0) { // i.e. the graphics must be changed
			// Rotate the arrow accordingly
			var midpoint = this.getArrow().arrowtail.firstSegment.point.add(this.getArrow().arrowtail.lastSegment.point.subtract(this.getArrow().arrowtail.firstSegment.point).multiply(0.5));
			this.getArrow().group.rotate(vectorAngle - previousAngle, midpoint);
			// Store info for next graphics update
			this.getGraphics().arrow.magnitude = vectorMagnitude;
			this.getGraphics().arrow.angle = vectorAngle;
			return true; // bool
		}
	}
});

// Gets the E Field magnitude for a point in the universe
var EFieldMagnitude = new Class({
	Extends: EField,
	
	initialize: function(properties, universe) { // Object, Universe
		// Send up to parent
		this.parent(properties, universe);
		// Handle e-field-magnitude-probe-specific constants
		this.getType().push("Magnitude");
		// Handle e-field-magnitude-probe-specific variables
	},
	initializeGraphics: function(universe) { // Universe
		this.parent(universe);
		this.refreshGraphics(universe);
	},
	
	measure: function(universe) { // Universe
		return this.parent(universe).modulus(); // double
	},
	
	// Handles graphical display of the entity
	refreshGraphics: function(universe) { // Universe
		var decimalPrecision = universe.getDecimalPrecision();
		this.getMainLabel().text.content = parseFloat(this.measure(universe).toPrecision(decimalPrecision)) + "N/C";
		return true; // bool
	},
});

// Draws the E Field line from a given point
var EFieldLine = new Class({
	Extends: EField,
	
	initialize: function(properties, universe) { // Object, Universe
		// Send up to parent
		this.parent(properties, universe);
		// Initialize e-field-line-probe-specific properties container
		this.properties.curve = new Object();
		// Handle e-field-line-probe-specific constants
		this.getType().push("Line");
		// Handle e-field-line-probe-specific variables
		this.properties.curve.observedUniverse = {
			outerRadius: universe.getObservedUniverseOuterRadius(universe),
			innerRadius: universe.getObservedUniverseInnerRadius(universe)
		};
	},
	initializeGraphics: function(universe) { // Universe
		this.parent(universe);
		// Initialize the curve
		var curve = new Path();
		curve.style = {
			strokeColor: "black",
			strokeWidth: 1
		};
		this.getGroup().curve = curve;
		this.getGroup().group.appendBottom(curve);
		this.refreshGraphics(universe);
	},
	
	measure: function(universe) {
		// Approximation parameters
		var stepSize = 0.005;
		var vectorMultiplier = Math.pow(10, 8);
		var observedUniverseInnerRadius = this.getObservedUniverseInnerRadius();
		var observedUniverseOuterRadius = this.getObservedUniverseOuterRadius();
		// Iteration variables
		var locationCorrectors = new Array();
		var locationPredictors = new Array();
		var locationIterator = this.getLocation();
		var approximationVertices = [locationIterator];
		var eFieldIterator = this.parent(universe).multiply(vectorMultiplier);
		var hasEndedAtEntity = false;
		var chargedEntities = universe.getChargedEntities();
		// Iterate forwards
		while (observedUniverseInnerRadius < locationIterator.modulus() && locationIterator.modulus() < observedUniverseOuterRadius && !eFieldIterator.eql(Vector.Zero(3)) && !hasEndedAtEntity) { // the field line has not hit an e-entity or the edge of the observed universe or a location where the e field is 0
			// Approximate to the next vertex with the fourth-order Runge-Kutta method
			locationCorrectors[0] = eFieldIterator.multiply(stepSize);
			locationPredictors[0] = universe.findElectricFieldAt(locationIterator.add(locationCorrectors[0].multiply(0.5)));
			locationCorrectors[1] = locationPredictors[0].multiply(stepSize);
			locationPredictors[1] = universe.findElectricFieldAt(locationIterator.add(locationCorrectors[1].multiply(0.5)));
			locationCorrectors[2] = locationPredictors[1].multiply(stepSize);
			locationPredictors[2] = universe.findElectricFieldAt(locationIterator.add(locationCorrectors[2]));
			locationCorrectors[3] = locationPredictors[2].multiply(stepSize);
			locationIterator = locationIterator.add(locationCorrectors[0].add(locationCorrectors[1].multiply(2)).add(locationCorrectors[2].multiply(2)).add(locationCorrectors[3]).multiply(1 / 6));
			//locationIterator = locationIterator.add(eFieldIterator.multiply(stepSize));
			approximationVertices.push(locationIterator);
			// Iterate forwards
			eFieldIterator = universe.findElectricFieldAt(locationIterator).multiply(vectorMultiplier);;
			// Check if we've ended at a charged entity
			hasEndedAtEntity = chargedEntities.some(function(entity) {
				var closeEnough = entity.getLocation().eql(locationIterator);
				if (closeEnough) {
					approximationVertices.push(entity.getLocation());
				}
				return closeEnough;
			});
		}
		// Iterate backwards
		locationIterator = this.getLocation();
		var eFieldIterator = this.parent(universe).multiply(-1).multiply(vectorMultiplier);
		hasEndedAtEntity = false;
		while (observedUniverseInnerRadius < locationIterator.modulus() && locationIterator.modulus() < observedUniverseOuterRadius && !eFieldIterator.eql(Vector.Zero(3)) && !hasEndedAtEntity) { // the field line has not hit an e-entity or the edge of the observed universe or a location where the e field is 0
			// Approximate to the next vertex with the fourth-order Runge-Kutta method
			locationCorrectors[0] = eFieldIterator.multiply(stepSize);
			locationPredictors[0] = universe.findElectricFieldAt(locationIterator.add(locationCorrectors[0].multiply(0.5)));
			locationCorrectors[1] = locationPredictors[0].multiply(stepSize);
			locationPredictors[1] = universe.findElectricFieldAt(locationIterator.add(locationCorrectors[1].multiply(0.5)));
			locationCorrectors[2] = locationPredictors[1].multiply(stepSize);
			locationPredictors[2] = universe.findElectricFieldAt(locationIterator.add(locationCorrectors[2]));
			locationCorrectors[3] = locationPredictors[2].multiply(stepSize);
			locationIterator = locationIterator.add(locationCorrectors[0].add(locationCorrectors[1].multiply(2)).add(locationCorrectors[2].multiply(2)).add(locationCorrectors[3]).multiply(1 / 6));
			//locationIterator = locationIterator.add(eFieldIterator.multiply(stepSize));
			approximationVertices.unshift(locationIterator);
			// Iterate forwards
			eFieldIterator = universe.findElectricFieldAt(locationIterator).multiply(-1).multiply(vectorMultiplier);
			// Check if we've ended at a charged entity
			hasEndedAtEntity = chargedEntities.some(function(entity) {
				var closeEnough = entity.getLocation().eql(locationIterator);
				if (closeEnough) {
					approximationVertices.unshift(entity.getLocation());
				}
				return closeEnough;
			});
		}
		this.properties.curve.approximation = approximationVertices;
		return approximationVertices;
	},
	
	// Tracks the observed universe
	setObservedUniverseOuterRadius: function(outerRadius) { // double
		this.getProperties().curve.observedUniverse.outerRadius = outerRadius;
		return true; // boolean
	},
	getObservedUniverseOuterRadius: function() {
		return this.getProperties().curve.observedUniverse.outerRadius; // double
	},
	setObservedUniverseInnerRadius: function(innerRadius) { // double
		this.getProperties().curve.observedUniverse.innerRadius = innerRadius;
		return true; // boolean
	},
	getObservedUniverseInnerRadius: function() {
		return this.getProperties().curve.observedUniverse.innerRadius; // double
	},
	// Handles graphical display of the entity
	refreshGraphics: function(universe) { // Universe
		var decimalEpsilonPrecision = universe.getDecimalEpsilonPrecision();
		var coordinates = this.getLocation().elements.map(function(coordinate) {
			var rounded = parseFloat(coordinate.toPrecision(decimalEpsilonPrecision));
			if (Math.abs(rounded) < universe.getLocationPrecision()) {
				return 0;
			} else {
				return rounded;
			}
		});
		this.getMainLabel().text.content = "(" + coordinates[0] + "m," + coordinates[1] + "m)";
		this.measure(universe);
		this.getGroup().curve.segments = this.getProperties().curve.approximation.map(function(location) {
			return new Segment(universe.findCanvasCoordinates(location));
		});
		this.getGroup().curve.simplify();
	},
	refreshCanvasPosition: function(universe) { // Universe
		this.parent(universe);
		this.getGroup().curve.segments = this.getProperties().curve.approximation.map(function(location) {
			return new Segment(universe.findCanvasCoordinates(location));
		});
		this.getGroup().curve.simplify();
		return true; // bool
	}
});

// Gets the E Potential for a point in the universe
var EPotential = new Class({
	Extends: PointEntity,
	
	initialize: function(properties, universe) { // Object, Universe
		// Send up to parent
		this.parent(properties, universe);
		// Handle e-field-magnitude-probe-specific constants
		this.getType().push("E Potential");
		// Handle e-field-magnitude-probe-specific variables
	},
	initializeGraphics: function(universe) { // Universe
		this.parent(universe);
		this.refreshGraphics(universe);
	},
	
	measure: function(universe) { // Universe
		return universe.findElectricPotentialAt(this.getLocation()); // double
	},
	
	// Handles graphical display of the entity
	refreshGraphics: function(universe) { // Universe
		var decimalPrecision = universe.getDecimalPrecision();
		this.getMainLabel().text.content = parseFloat(this.measure(universe).toPrecision(decimalPrecision)) + "V";
		return true; // bool
	},
});
