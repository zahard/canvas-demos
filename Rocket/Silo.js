function Silo ( gameInstance, position ) {
	
	this.game = gameInstance,
	this.w = gameInstance.g['silo'].width,  // 79 tile image width
	this.h = gameInstance.g['silo'].height, // 54 tile image height
	
	this.x = position.x;
	this.y = position.y;
	
	this.id = new Date().getTime()+'_'+randomFromInterval(1,99999);
}

Silo.prototype.draw = function() {
	cxt.save();
	cxt.drawImage( this.game.g['silo'], this.x-this.w/2,this.y-this.h/2);
	cxt.restore();

	if( this.game.DEBUG)
		new Circle(this.x,this.y,3,'#acf','#7cf').draw();
}
