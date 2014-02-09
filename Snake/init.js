/**
 * Alias for get element by id
 */
function $(id) {
	return document.getElementById(id);	
} 


window.addEventListener('load', function() {
	window.theSnake = new SnakeGame();
	theSnake.init();
}, false);

//GLOBALS
var RIGHT_PRESSED = false,
	RIGHT_RELEASE = false,
	LEFT_PRESSED  = false,
	LEFT_RELEASE  = false,
	JUMP_PRESSED  = false;

function SnakeGame() {	
	var _this = this,
		gameOver = false;

	this.width = 480;
	this.height = 480;
	this.cellSize = 24;

	this.direction = 'up';

	this.changeDirection = 'up';

	this.cellsWidth  = this.width  / this.cellSize;
	this.cellsHeight = this.height / this.cellSize;

	// From 1 to 10
	this.gameSpeed = 4;
	this.maxSpeed = 10;


	this.food = null;

	this.animate = function() {
		_this.update();
		if( ! gameOver ) {
			_this.draw();
			setTimeout(function(){
				_this.animate();
			}, 40 * (11 - this.gameSpeed ) );
		} else {
			this.showGameOverAnimation();
		}

	}

	this.update = function() {
		_this.direction = _this.changeDirection;
		var fail = this.snake.move( _this.direction, this.food );
		if( fail ) {
			gameOver = true;
			return;
		}
		//Food collision
		if( this.snake.head.toString() == this.food.toString() ) {
			this.snake.updateLength();
			this.food = this.dropFood();

			//Increase speed
			if( this.gameSpeed < this.maxSpeed) this.gameSpeed++;
		}
	}

	this.draw = function() {
		this.clearCanvas();
		this.drawFood();
		this.snake.draw();
	}

	this.drawFood = function(inverted) {
		cxt.save();
		cxt.fillStyle  = inverted ? '#2e2':'#e2e';
		cxt.strokeStyle  = inverted ? '#eee':'#222';
		cxt.strokeWidth  = 1
		cxt.fillRect( this.food[0] * this.cellSize+1, this.food[1] * this.cellSize+1, this.cellSize-2, this.cellSize-2 );
		cxt.strokeRect( this.food[0] * this.cellSize+2, this.food[1] * this.cellSize+2, this.cellSize-3, this.cellSize-3 );
 		cxt.restore();
	}

	this.clearCanvas = function(inverted) {
		cxt.save();
		cxt.fillStyle = inverted ? '#222': '#eee';
		cxt.fillRect(0, 0, this.width, this.height);
		cxt.restore();
	}


	window.addEventListener('keydown',function(e) {
		switch( e.keyCode ) {
			case 37:
				if( _this.direction != 'right')
					_this.changeDirection = 'left';
				break;
			case 38:
				if( _this.direction != 'down')
					_this.changeDirection = 'up';
				break;
			case 39:
				if( _this.direction != 'left')
					_this.changeDirection = 'right';
				break;
			case 40:
				if( _this.direction != 'up')
					_this.changeDirection = 'down';
				break;
		}
	});
	
	function gameOver() {

	}

	this.init = function() {

		var theCanvas = $("canvas");
		theCanvas.width = this.width;
		theCanvas.height = this.height;
		window.cxt = theCanvas.getContext("2d");

		//Add snake itself
		this.snake = new Snake(12,12,this.cellSize,20,20);

		//Generate first food piece 
		this.food = this.dropFood();

		this.animate();		
	}

	this.isPartOfSnake = function(x,y){
		var b,i;
		for( i = 0; i < _this.snake.length; i++) {
 			b = _this.snake.blocks[i];
		 	if( b[0] == x && b[1] == y )
		 		return true;
 		}
 		return false;
	}

	this.dropFood = function() {
		var x = Math.floor(Math.random() * this.cellsWidth);
		var y = Math.floor(Math.random() * this.cellsHeight);
		if( ! this.isPartOfSnake(x,y) ) {
			return [x,y];
		} else {
			return this.dropFood();
		}
	}


	this.showGameOverAnimation = function() {
		this.clearCanvas(true);
		this.drawFood(true);
		this.snake.draw(true);
		var text = 'Game Over',
			x = 75,
			y = 250;

		cxt.fillStyle = '#fff';
		cxt.font = '60px Arial'
		cxt.fillText(text,x,y);

		window.addEventListener('keydown',function(e) {
			if( e.keyCode  == 13) {
				window.location.reload();
			}
		});
	
		

	}
}



