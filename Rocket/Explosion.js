var Explosion = function(gameInst,pos){
	
	var framesForPic = 2,
		game = gameInst,
		cxt = game.cxt,
		_this = this;
		
	this.expAnimFrame = 0;
	this.currentFrame = 0;
	
	this.sound = new Audio('Rocket/sound/exp_3.mp3');
	
	this.sound.volume = 0.5;
	this.sound.play();

	this.pos = pos;

	this.id = new Date().getTime()+'_'+randomFromInterval(1,99999);
	
	this.draw = function() {
		if(this.disabled){
			cxt.save();
			new Circle(this.pos.x,this.pos.y,10,'#f99','#000').draw();
			cxt.restore();
			return;
		}

		var expTileY = Math.floor(this.expAnimFrame / 3);
		var expTileX = this.expAnimFrame % 3;
		
		game.expTiles.drawTile({x:expTileX,y:expTileY},pos.x - 128,pos.y-64);
		
		if( this.currentFrame == 0) {
			if( this.expAnimFrame == 0) {
				//this.sound.volume = 0.2;
				//this.sound.play();
			}
			this.expAnimFrame++;
			if( this.expAnimFrame > 15) {

				setTimeout(function(){
					var newExplosions = [];
					for(var i in game.explosions ) {
						if( game.explosions[i].id !== _this.id){
							newExplosions.push(game.explosions[i]);
						}
					}
					delete(_this);
					game.explosions = newExplosions;
				},10);
			}
		}
		this.currentFrame++;
		if( this.currentFrame >= framesForPic ) this.currentFrame = 0;
	}

}