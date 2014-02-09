function Tank( gameInstance, position ) {
	
	var game = gameInstance,w,h;
	
	this.pos = position;
	
	this.trackAnimationFrame = 0;
	
	this.frame = 0;
	
	this.alive = true;
	
	this.setSkin = function() {
		this.skin = game.g['sand_tank'];
	}
	
	this.init = function() {
		this.setSkin();
		w = this.skin.width;
		h = this.skin.height;
	}
	
	this.id = new Date().getTime()+'_'+randomFromInterval(1,99999);
	
	this.die = function() {
		this.alive = false;
	}
	
	this.draw = function() {
		if( ! this.alive )
			return;

		if (game.DEBUG)
			new Circle(this.pos.x,this.pos.y,40,'#222','#cfa').draw();
	
		game.cxt.drawImage( this.skin, this.pos.x-w/2, this.pos.y-h/2);
		
		game.trackTiles.drawTile( {x:this.trackAnimationFrame,y:0}, this.pos.x-w/2, this.pos.y-h/2);
		
		/*
		this.frame++;
		if(this.frame>4)
			this.frame = 0;
		
		if( this.frame == 0) {
			this.trackAnimationFrame++;
			if(this.trackAnimationFrame>2)
				this.trackAnimationFrame = 0;
		}*/
		
		
		
		if (game.DEBUG)
			new Circle(this.pos.x,this.pos.y, 5,'#222','#ACF').draw();
	}
	
	
	this.update = function() {
		this.pos.x = this.pos.x - this.speed;
	}
	
	this.init();
	
}