/**
 * Level Box object
 */
Box = function(x,y,width,height,disabledCorners) {
	this.x = x;
	this.y = y;
	this.width = width;	
	this.height = height;
	this.disabledCorners = disabledCorners || {};

	if(disabledCorners){
		//console.log(this.disabledCorners)
	}
}
Box.prototype.draw = function(){
	var c = mCxt;
	c.save();
	
	c.fillStyle = '#CA3131';
	c.fillRect(this.x,this.y,this.width,this.height);
	
	c.strokeStyle = '#222';
	c.lineWidth = 1;
	c.strokeRect(this.x,this.y,this.width,this.height);
	
	c.restore();
}

Box.prototype.checkCollision = function(Ball) {
	if (Ball.position.x + Ball.radius > this.x && Ball.position.x - Ball.radius < this.x + this.width) 
	{
		if (Ball.position.y + Ball.radius >  this.y  && Ball.position.y - Ball.radius < this.y + this.height)  
		{
			return true;
		}
	}
	return false;
}


/**
 * Spike object
 */
Spike = function(placeX,placeY) {
	this.width = 20;
	this.height = 30;
	this.x = placeX;
	this.y = placeY - this.height;
}

Spike.prototype.draw = function(){
	var c = mCxt;
	c.save();
	
	c.fillStyle = 'green';
	c.fillRect(this.x,this.y,this.width,this.height);
	
	c.restore();
}

Spike.prototype.checkCollision = function(Ball) {
	if (Ball.position.x + Ball.radius > this.x && Ball.position.x - Ball.radius < this.x + this.width) 
	{
		if (Ball.position.y + Ball.radius >  this.y  && Ball.position.y - Ball.radius < this.y + this.height)  
		{
			return true;
		}
	}
	return false;
}


/**
 * Exit object
 */
Exit = function(placeX,placeY) {
	this.width = 70;
	this.height = 80;
	this.active = false;
	this.x = placeX;
	this.y = placeY - this.height;
}

Exit.prototype.draw = function(){
	var c = mCxt;
	c.save();
	
	c.fillStyle = this.active ? 'green':'#555';
	c.fillRect(this.x,this.y,this.width,this.height);
	
	c.restore();
}

Exit.prototype.checkCollision = function(Ball) {
	if (Ball.position.x + Ball.radius > this.x && Ball.position.x - Ball.radius < this.x + this.width) 
	{
		if (Ball.position.y + Ball.radius >  this.y  && Ball.position.y - Ball.radius < this.y + this.height)  
		{
			return true;
		}
	}
}



/**
 * Spike object
 */
Ring = function(x,y) {
	
	var collected = false;
	this.width = 20;
	this.height = 100;
	this.center = {
		x: x,
		y: y
	}
	this.x = x - this.width/2;
	this.y = y - this.height/2;

	this.setCollected = function(app) {
		if( ! collected ) {
			collected = true;
			this.draw();
			app.collectRing();
		}
	}

	this.getCollected = function() {
		return collected;
	}
}


Ring.prototype.draw = function(){
	
	var color = ( this.getCollected() ) ? '#994422' : '#ffff33';
	mCxt.save();
	drawEllipseByCenter(mCxt,this.center.x,this.center.y, this.width,this.height,color);
	mCxt.restore();
}

Ring.prototype.checkCollision = function(Ball) {
	if (Ball.position.x + Ball.radius > this.x && Ball.position.x - Ball.radius < this.x + this.width) 
	{
		if (Ball.position.y + Ball.radius >  this.y  && Ball.position.y - Ball.radius < this.y + this.height)  
		{
			return true;
		}
	}
	return false;	
}


function drawEllipseByCenter(ctx, cx, cy, w, h,color) {
  drawEllipse(ctx, cx - w/2.0, cy - h/2.0, w, h,color);
}

function drawEllipse(ctx, x, y, w, h,color) {
  var kappa = .5522848,
      ox = (w / 2) * kappa, // control point offset horizontal
      oy = (h / 2) * kappa, // control point offset vertical
      xe = x + w,           // x-end
      ye = y + h,           // y-end
      xm = x + w / 2,       // x-middle
      ym = y + h / 2;       // y-middle

  ctx.lineWidth = 5;
  ctx.strokeStyle = color;
  ctx.beginPath();
  ctx.moveTo(xm, y);
  ctx.bezierCurveTo(xm + ox, y, xe, ym - oy, xe, ym);
  ctx.bezierCurveTo(xe, ym + oy, xm + ox, ye, xm, ye);
  ctx.stroke();


  rCxt.lineWidth = 5;
  rCxt.strokeStyle = color;
  rCxt.beginPath();
  rCxt.moveTo(xm, ye); 
  rCxt.bezierCurveTo(xm - ox, ye, x, ym + oy, x, ym);
  rCxt.bezierCurveTo(x, ym - oy, xm - ox, y, xm, y);
  rCxt.stroke();
  

	x -= 3;
	w += 6;
	y -= 3;
	h += 6;
	ox = (w / 2) * kappa, // control point offset horizontal
	oy = (h / 2) * kappa, // control point offset vertical
	xe = x + w,           // x-end
	ye = y + h,           // y-end
	xm = x + w / 2,       // x-middle
	ym = y + h / 2;       // y-middle


color = '#cc9933'
	ctx.lineWidth = 2;
  ctx.strokeStyle = color;
  ctx.beginPath();
  ctx.moveTo(xm, y);
  ctx.bezierCurveTo(xm + ox, y, xe, ym - oy, xe, ym);
  ctx.bezierCurveTo(xe, ym + oy, xm + ox, ye, xm, ye);
  ctx.stroke();


  rCxt.lineWidth = 2;
  rCxt.strokeStyle = color;
  rCxt.beginPath();
  rCxt.moveTo(xm, ye); 
  rCxt.bezierCurveTo(xm - ox, ye, x, ym + oy, x, ym);
  rCxt.bezierCurveTo(x, ym - oy, xm - ox, y, xm, y);
  rCxt.stroke();
  

  	
}