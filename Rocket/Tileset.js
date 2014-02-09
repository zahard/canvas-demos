/**
 * Tileset Class
 */

var Tileset = function( image , tileSizeWidth, tileSizeHeight, borderWidth , context , tilesNameMapping) { 
	
	this.cxt = context;
	this.tileImage  = image;
	this.tileSizeWidth  = tileSizeWidth;
	this.tileSizeHeight = tileSizeHeight;
	this.tileBorder  = borderWidth;
	
	if( typeof borderWidth === 'undefined' ) {
		borderWidth = 0;
	}  
	
	var width = this.tileImage.width,
		height = this.tileImage.height,
		tilesWidth = Math.floor( (width + borderWidth ) / (tileSizeWidth + borderWidth ) ),
		tilesHeight = Math.floor( (height + borderWidth ) / (tileSizeHeight + borderWidth ) );
		
	this.tiles = [];
	
	this.tileNames = typeof tilesNameMapping != 'undefined' ? tilesNameMapping : {};
		
	
	this.drawTile = function(tile, x, y ) {
		
		var tilePos  = this.getTileCoordinates(tile);
		
		if( tilePos.y >= tilesHeight || tilePos.x >= tilesWidth ) {
			return false;
		}
		
		
		this.cxt.drawImage( this.tileImage,  
							this.tileSizeWidth*tilePos.x, this.tileSizeHeight*tilePos.y, 
							this.tileSizeWidth,this.tileSizeHeight, 
							x, y, 
							this.tileSizeWidth,this.tileSizeHeight 
		);
		
		return true;
	}
	
	this.getTileCoordinates = function(tile){
		var position = {x:0,y:0};
		if( typeof tile === 'string' ) {
			var coord= this.tileNames[tile];
			position = {x:coord[0],y:coord[1]};
		} else if( typeof tile === 'object' ) {
			position = tile;
		}
		return position;
	}
	
		
}