/**
 * Basic math vector representaion
 */
Vector = function(x,y) {
	this.x = x || 0;
	this.y = y || 0;
}
Vector.prototype.set = function(x,y) { 
	this.x = x;
	this.y = y;
}
Vector.prototype.add = function(vector) {
	this.x += vector.x;
	this.y += vector.y;
}
Vector.prototype.getMagnitude = function () { 
	return Math.sqrt(this.x * this.x + this.y * this.y);
};
Vector.prototype.getAngle = function () {
	return Math.atan2(this.y,this.x);
};

