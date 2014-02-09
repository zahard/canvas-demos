
window.addEventListener('load', function() {
	window.Bounce = new BounceGame();
	Bounce.init();
}, false);

//GLOBALS
var RIGHT_PRESSED = false,
	RIGHT_RELEASE = false,
	LEFT_PRESSED  = false,
	LEFT_RELEASE  = false,
	JUMP_PRESSED  = false,
	MOUSE;

function BounceGame() {	
	var _this = this;

	this.width = 1600;
	this.height = 600;
	this.viewportWidth = 500;
	this.viewportHeight = 300;

	/**
	 * Level Objects
	 */
	this.objects = [];

	this.animate = function() {
		_this.update();
		_this.draw();
		requestAnimationFrame(window.Bounce.animate)
	}

	this.update = function() {
		this.ball.update(); 

		//Update Viewport
		this.updateViewport();
	}

	this.updateViewport = function() {
		var offset = this.viewportWidth / 2 - this.ball.position.x;
		if( offset > 0 )
			offset = 0;

		if( offset < -(this.width - this.viewportWidth) )
			offset = -(this.width - this.viewportWidth);

	//	offset = -700;

		this.levelOffset = offset;

		var levelStyle = $('level').style;
		levelStyle.marginLeft = offset + 'px';

		if( true || false ) {
			if(this.ball.position.y > 295) {
				levelStyle.marginTop = -300 + 'px';
			} else {
				levelStyle.marginTop = 0 + 'px';
			}
		}
	}

	this.draw = function() {
		this.clearCanvas();
		this.ball.draw();
		if( MOUSE) {
			cxt.save();
			cxt.fillText( 'x: '+ (MOUSE.x + -this.levelOffset) + ', y: '+ MOUSE.y,  (MOUSE.x + -this.levelOffset) + 10, MOUSE.y);
			cxt.restore();
		}
	}

	this.clearCanvas = function() {
		cxt.clearRect(0, 0, this.width, this.height);
	}

	this.initLevelObjects = function() {
		
		this.objects = getLevelObjects(this);

		this.spikes = [
			//new Spike(500,285)
		];

		this.rings = [
			new Ring(225,240),
			new Ring(1140,90),
			new Ring(500,375),
			new Ring(1300,535),
		];

		this.ringsCollected = 0;

		this.exit = new Exit(1500,585);
	}

	this.collectRing = function(){
		this.ringsCollected++;
		if( this.ringsCollected >= this.rings.length ) {
			this.exit.active = true;
			this.exit.draw();
		}
	}

	this.drawLevel = function() {
		mCxt.clearRect(0, 0, this.width, this.height);
		
		var showGrid = 0;
		if( showGrid ) {
			mCxt.save();
			for( var y = 15; y < this.height; y += 30 ) {
				mCxt.moveTo(0, y);
				mCxt.lineTo(this.width, y);
			}
			for( var x = 15; x < this.width; x += 30 ) {
				mCxt.moveTo(x, 0);
				mCxt.lineTo(x, this.height)			
			}
			mCxt.stroke();
			mCxt.restore();
		}

		for (var i in this.objects) {
			this.objects[i].draw();
		}
		for (var i in this.spikes) {
			this.spikes[i].draw();
		}
		for (var i in this.rings) {
			this.rings[i].draw();
		}

		this.exit.draw();
	}

	window.addEventListener('keydown',function(e) {
		switch( e.keyCode ) {
			case 39: //RIGHT
				RIGHT_PRESSED = true;
				RIGHT_RELEASE = false;
				break;
			case 37: //LEFT
				LEFT_PRESSED = true;
				LEFT_RELEASE = false;
				break;
			case 38: //SPACE | Jump
				JUMP_PRESSED = true;
				break;
				
		}
	});
	
	window.addEventListener('keyup',function(e) {
		switch( e.keyCode ) {
			case 39: //RIGHT
				RIGHT_PRESSED = false;
				RIGHT_RELEASE = true;
				break;
			case 37: //LEFT
				LEFT_PRESSED = false;
				LEFT_RELEASE = true;
				break;
			case 38: //UP | Jump
				JUMP_PRESSED = false;
				break;
		}
	});

	window.addEventListener('mousemove',function(e) {
		MOUSE = {
			x: e.clientX,
			y: e.clientY
		}
	});

	this.init = function() {

		var theCanvas = $("canvas");
		theCanvas.width = this.width;
		theCanvas.height = this.height;
		window.cxt = theCanvas.getContext("2d");

		var mapCanvas = $("mapCanvas");
		mapCanvas.width = this.width;
		mapCanvas.height = this.height;
		mapCanvas.style.top = '-' + this.height + 'px';
		window.mCxt = mapCanvas.getContext("2d");


		var ringsCanvas = $("ringsCanvas");
		ringsCanvas.width = this.width;
		ringsCanvas.height = this.height;
		ringsCanvas.style.top = '-' + this.height*2 + 'px';
		window.rCxt = ringsCanvas.getContext("2d");

		var viewport = $('viewport');
		viewport.style.width =  this.viewportWidth + 'px';
		viewport.style.height = this.viewportHeight + 'px';

		this.initLevelObjects();
		this.drawLevel();

		this.ball = new BounceBall(50, 150, 16, this);

		this.animate();		
	}
}