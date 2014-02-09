/**
 *
 */

 Snake = function(x,y,cellSize,cWidth,cHeight) {

 	this.cellSize = cellSize;
 	this.cWidth = cWidth;
 	this.cHeight = cHeight;
 	this.head = [x,y];
 	this.length = 6;
 	
 	this.blocks = [
 		[x,y],
 		[x,y+1],
 		[x,y+2],
 		[x,y+3],
 		[x+1,y+3],
 		[x+1,y+2]
 	]

 	this.draw = function(inverted) {
 		cxt.save();
		cxt.fillStyle = inverted ? '#22e':'#ee2';
		cxt.strokeStyle = inverted ? 'eee':'#222';
		cxt.strokeWidth = 1;
 		for( var i = 0; i < this.length; i++) {
 			if( i == 1 ) cxt.fillStyle  = inverted ? '#888':'#777';
 			var b = this.blocks[i];
		 	cxt.fillRect( b[0] * this.cellSize+1, b[1] * this.cellSize+1, this.cellSize-2, this.cellSize-2 );
		 	cxt.strokeRect( b[0] * this.cellSize+2, b[1] * this.cellSize+2, this.cellSize-3, this.cellSize-3 );
 		}
 		cxt.restore();
 	}

 	this.move = function(direction, food) {
 		var newBlocks = [];
 
 		switch( direction ) {
 			case 'up':
 				this.head[1] += -1;
 				if( this.head[1] < 0 )
 					this.head[1] = this.cHeight - 1;
 				break;

 			case 'down':
 				this.head[1] += 1;
 				if( this.head[1] > this.cHeight - 1 )
 					this.head[1] = 0;
 				break;

 			case 'left':
 				this.head[0] += -1;
 				if( this.head[0] < 0 )
 					this.head[0] = this.cWidth - 1;
 				break;

 			case 'right':
 				this.head[0] += 1;
 				if( this.head[0] > this.cWidth - 1 )
 					this.head[0] = 0;
 				break;
 		}

 		for( var i = 3; i < this.length; i += 1 ) {
 			if( this.head.toString() == this.blocks[i].toString() )
 				return true;
 		}

 		newBlocks.push( this.head.slice() );

 		var copyTo = this.length;
 		if( this.head.toString() == food.toString() )
 			copyTo += 1;

 		for( var i = 1; i < copyTo; i++) {
 			newBlocks.push( this.blocks[i-1] );
 		}

		this.blocks = newBlocks.slice();

		this.updateLength();

		return false;
 	}

 	this.updateLength = function() {
 		this.length = this.blocks.length;
 	}
 }

