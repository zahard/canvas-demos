PlantWallNut = function() {
	Plant.apply(this,arguments);
	this.color = 'brown';
	this.price = 50;
	this.health = 500;
	this.y = 40;
	this.w = 40;
	this.image = $('img-wallnut');
}
extend(PlantWallNut,Plant);

PlantWallNut.prototype.update = function() {
	var t = new Date().getTime();
	this.checkDamage(t);
}

PlantWallNut.prototype.draw = function() {
	
	cxt.drawImage( this.image, this.x - this.w , this.y -60, 80,80)
	
}
