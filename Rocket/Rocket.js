var Rocket = function( gameInstance, targetCoords, startCoords, damageRange){
	var game = gameInstance,
		cxt = game.cxt,
		tiles = new Tileset(game.g['rocket_flame_tile'], 31, 80, 0 , cxt),
		framesForPic = 5,
		_this = this;

	this.t = 0;
	this.expAnimFrame = 0;
	this.currentFrame = 0;
	this.id = new Date().getTime()+'_'+randomFromInterval(1,99999);
	this.targetPos = targetCoords;
	this.startPos = startCoords;
	this.pos = startCoords;
	this.angle = 0;
	this.drawBack = false;
	this.damageRange = damageRange || 40;
	
	var pxPerFrame = 0.005;
	var fullDistance = pointsDistance(startCoords,targetCoords);
	this.speed = pxPerFrame * 1000/fullDistance;

	var _this  = this;
	this.clearAnimation = function(){
		expAnimFrame = 0;
	}
	

	var P0 = this.startPos,
		P2 = this.targetPos,
		P1;

	// Calculate Control Point for Curve
	P1 = {
		x:  parseInt( (P2.x - P0.x ) /3.5  + P0.x),
		y: P2.y - 250
	}
	//Normalize it for better rocket path
	if( P0.y - P1.y < 300) {
		P1.y = P0.y - 300;
	}
	
	game.launchSound.currentTime = 0;
	game.launchSound.volume = 0.05 	;
	game.launchSound.play();

	this.update = function(){
		var t = this.t;
		
		//This is current point of rocket  T = func(t);
		T = {}
		T.x = Math.pow((1-t), 2) * P0.x + 2 * (1-t) * t * P1.x + Math.pow(t, 2) * P2.x; 
		T.y = Math.pow((1-t), 2) * P0.y + 2 * (1-t) * t * P1.y + Math.pow(t, 2) * P2.y; 
		
		var distance = pointsDistance(P0,P1);
		
		//proportioanl segments
		var L = t/ (1-t);
		
		var D1 = {};
		var D2 = {};
		//First point 
		D1.x = ( P0.x + L*P1.x ) / ( 1 + L );
		D1.y = ( P0.y + L*P1.y ) / ( 1 + L );
		//Second point 
		D2.x = ( P1.x + L*P2.x ) / ( 1 + L );
		D2.y = ( P1.y + L*P2.y ) / ( 1 + L );

		//Build 3rd point to get triabgle
		D3 = {
			y: D1.y,
			x: D2.x
		}
		
		this.angleFigurePoints = [D1,D2,D3];

		//Get angle of gipotenuse
		var angleRad = Math.acos( pointsDistance(D1,D3) / pointsDistance(D1,D2) );
		var angle = (180/Math.PI)*angleRad;
		if( D2.y < D1.y ) {
			angle = - angle;
		}
	
		this.t += this.speed;
		if( this.t > 0.99 ) {

			game.fireEvent('explosion',this.targetPos, this.damageRange);	
			setTimeout(function(){
				var newrockets = [];
				for (var i in game.rockets) {
					if( game.rockets[i].id !== _this.id) {
						newrockets.push(game.rockets[i])
					}
				}
				game.rockets = newrockets;
				delete(_this);
			},10)		
		}
		
		_this.pos = T;
		_this.angle = angle;
	}
	
	
	this.draw = function(){
		
		if (game.DEBUG) {

			//Draw Rocket Path Curve
			cxt.beginPath();
				cxt.moveTo(P0.x, P0.y);
				cxt.quadraticCurveTo(P1.x, P1.y, P2.x, P2.y)
				cxt.strokeStyle = 'red';
				cxt.lineWidth = 1;
				cxt.stroke();
			cxt.closePath();

			//Draw outer triangle
			cxt.beginPath();
				cxt.moveTo(P0.x, P0.y);
				cxt.lineTo(P1.x, P1.y);
				cxt.lineTo(P2.x, P2.y);
				cxt.lineTo(P0.x, P0.y);
				cxt.strokeStyle = 'green';
				cxt.lineWidth = 1;
				cxt.stroke();
			cxt.closePath();

			//Draw angle defined triangle
			var d1 = this.angleFigurePoints[0],
			    d2 = this.angleFigurePoints[1],
			    d3 = this.angleFigurePoints[2];
			cxt.beginPath();
				cxt.moveTo(d1.x, d1.y);
				cxt.lineTo(d2.x, d2.y);
				cxt.lineTo(d3.x, d3.y);
				cxt.lineTo(d1.x, d1.y);
				cxt.strokeStyle = 'blue';
				cxt.lineWidth = 1;
				cxt.stroke();
			cxt.closePath();
			
		}


		cxt.save();
		var w = 31;
		var h = 80;
		cxt.translate( this.pos.x, this.pos.y );
		cxt.rotate( radian(this.angle) )
		
		var expTileY = Math.floor(this.expAnimFrame / 5);
		var expTileX = this.expAnimFrame % 5;
		
		tiles.drawTile({x: expTileX, y:expTileY}, -w/2, -h/2);
		
		if( this.currentFrame == 0) {
			this.expAnimFrame++;
			if( this.expAnimFrame > 9) {
				this.expAnimFrame = 9;
			}
		}
		this.currentFrame++;
		if( this.currentFrame >= framesForPic ) this.currentFrame = 0;
		cxt.restore();

		if (game.DEBUG) {
			cxt.save();
				new Circle(this.targetPos.x,this.targetPos.y,3,'#ccc','#f00').draw();
				new Circle(this.targetPos.x,this.targetPos.y,this.damageRange,undefined,'rgba(255,150,150,0.4)').draw();
			cxt.restore();
		}
		
	}
	
	function radian( angle ) {
		if( _this.drawBack ) {
			angle -= 180;
		}
		return (Math.PI/180)*(angle+90);
	}
	
	function pointsDistance(P0,P1){
		return Math.sqrt( Math.pow( (P1.x - P0.x) , 2 ) + Math.pow( (P1.y - P0.y), 2 ) );
	}
	
}