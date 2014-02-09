
/**
 * Bounce Ball 
 */	
BounceBall = function(x, y, r, gameInstance) {

	this.app = gameInstance;
	this.radius = r;

	this.fillColor = '#F33';
	this.borderColor = '#555';

	this.speedX = 5;
	this.gravity = 0.5;

	this.fallSpeedUp = 5;
	this.jumpSpeed = -15;
	this.inJump = true;

	this.position = new Vector(x,y);
	this.velocity = new Vector(0,0);
	this.acceleration = new Vector(0,0);

	this.acceleration.y = this.gravity;
}

BounceBall.prototype.draw = function() {
	cxt.save();
	cxt.beginPath();
	cxt.arc(this.position.x, this.position.y, this.radius,  rad(0) , rad(360), false );
	cxt.fillStyle = this.borderColor;
	cxt.fill();
	cxt.closePath();
	
	cxt.beginPath();
	cxt.arc(this.position.x, this.position.y, this.radius-1,  rad(0) , rad(360), false );
	cxt.fillStyle = this.fillColor;
	cxt.fill();
	cxt.closePath();
	
	cxt.restore();
}

BounceBall.prototype.update = function() {

	if( LEFT_PRESSED && RIGHT_PRESSED )
		LEFT_PRESSED = false;

	
	if( LEFT_PRESSED ) {
		this.velocity.x = -this.speedX;
	} else if( RIGHT_PRESSED ) {
		this.velocity.x = this.speedX;
	}
	
	if( RIGHT_RELEASE ) {
		RIGHT_RELEASE = false;
		this.velocity.x = 0;
	}

	if( LEFT_RELEASE ) {
		LEFT_RELEASE = false;
		this.velocity.x = 0;
	}

	//Make a jump if button pressed and ball not already in the air
	if( JUMP_PRESSED && ! this.inJump ) {
		this.velocity.y += this.jumpSpeed;
		this.acceleration.y = this.gravity;
		this.inJump = true;
	}

	var isOnEdge = ! this.inJump && this.ground && 
		(this.position.x + this.radius/3 < this.ground.x || this.position.x - this.radius/3 > this.ground.x + this.ground.width);

	if( isOnEdge ) {
		this.acceleration.y = this.gravity;
		this.position.x += ( LEFT_PRESSED ) ? -this.fallSpeedUp : this.fallSpeedUp;
		this.inJump = true;
	}

	var old_velocity = {x:this.velocity.x,y:this.velocity.y};
	
	this.velocity.add(this.acceleration);
	this.position.add(this.velocity);

	if (this.velocity.x || this.velocity.y) {
		var box,i;
		for( i =0; i < this.app.objects.length; i++ ) {

			box = this.app.objects[i];

			if (box.checkCollision(this)) {
				
				var type = collisionType(box,this,old_velocity);
				if(type == 'bottom') {
					var a = 3;
				}
				switch( type ) {
					case 'left':
						this.position.x = box.x - this.radius;
						this.acceleration.x = 0;
						this.velocity.x = 0;
						break;

					case 'top':
						this.position.y = box.y - this.radius;
						this.acceleration.y = 0;
						this.velocity.y = 0;
						this.inJump = false;
						this.ground = box;
						break;
					
					case 'right':
						this.position.x = box.x + box.width + this.radius;
						this.acceleration.x = 0;
						this.velocity.x = 0;
						break;

					case 'bottom':
						this.position.y = box.y + box.height + this.radius;
						this.acceleration.y = 0.4;
						this.velocity.y = 0;
						break;
				}
			}
		}

		
		for( i =0; i < this.app.rings.length; i++ ) {
			var ring = this.app.rings[i];
			if (ring.checkCollision(this)) {
				ring.setCollected(this.app);
			}
		}

		if ( this.app.exit.active && this.app.exit.checkCollision(this)) {
			window.location.reload();
		}
	
		/*
		for( i =0; i < this.app.spikes.length; i++ ) {
			var spike = this.app.spikes[i];
			if (spike.checkCollision(this)) {
				alert('Game Over. You are blow up')
			}
		}*/
		
	}

}

function collisionType(o,b,v) {
	var p = b.position;
	var res  = [];

	if( p.x + b.radius > o.x &&  p.x - b.radius < o.x )
		res.push('left');

	if( p.x + b.radius > o.x + o.width &&  p.x - b.radius < o.x + o.width )
		res.push('right');

	if( p.y + b.radius > o.y &&  p.y - b.radius < o.y )
		res.push('top');

	if( p.y + b.radius > o.y + o.height &&  p.y - b.radius < o.y + o.height )
		res.push('bottom');

	var type = '';
	if( res.length ) {
		if( res.length == 1) {
			type = res[0];
		} else if( res.length == 2 ) {
			var collision = {};
			for( var i=0; i < res.length; i++ ) {
				collision[res[i]] = true;
			}

			//Check all possible variation with 4 corners of block
			if( collision.top && collision.left ) { //TOP LEFT
				type = ( v.y > 0 && v.y >  v.x && ! o.disabledCorners['tl'] ) ? 'top' : 'left'; 
			} else if ( collision.top && collision.right ) { //TOP RIGHT
				type = ( v.y > 0 && v.y > -v.x && ! o.disabledCorners['tr'] ) ? 'top' : 'right'; 
			} else if( collision.bottom && collision.right ) { //BOTTOM RIGHT
				type = ( v.y < 0 && v.y <  v.x && ! o.disabledCorners['br'] ) ? 'bottom' : 'right';
			} else if( collision.bottom && collision.left ) { //BOTTOM LEFT
				type = ( v.y < 0 && v.y < -v.x && ! o.disabledCorners['bl'] ) ? 'bottom' : 'left';
			} else {
				type = res[0];
			}

		}
	}

	return type;
}





