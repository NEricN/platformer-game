var PhysicalObject = function(prop) {
	if(prop.shape === "circle") {
		this.physicsObject = PhysicsManager.createCircle(prop.x, prop.y, prop.r, prop);
	} else {
		this.physicsObject = PhysicsManager.createBox(prop.x, prop.y, prop.width, prop.height, prop);
	}
}

//collision reaction
PhysicalObject.prototype.reactBegin = function(object) {

}

PhysicalObject.prototype.reactEnd = function(object) {

}

PhysicalObject.prototype.reactPost = function(object, impulse) {

}