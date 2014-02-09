PlantTallNut = function() {
	Plant.apply(this,arguments);
	this.color = '#333';
	this.price = 150;
	this.h = 90;
	this.health = 900;
	this.image = $('img-tallnut');
}
extend(PlantTallNut,Plant);

PlantTallNut.prototype.update = function() {
	var t = new Date().getTime();
	this.checkDamage(t);
}

PlantTallNut.prototype.draw = function() {
	
	cxt.drawImage( this.image, this.x - this.w + 10 , this.y - 70, 60,90)
	
}