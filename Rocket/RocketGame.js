/**
 * Rocket Game. Launch'em all!
 * @author Zakhar Portyanov
 */
 
var RocketGame = new function(){

	window.theCanvas = document.getElementById("canvas");
	window.cxt = theCanvas.getContext("2d");
	
	this.cxt = cxt;
	
	var	rocket = null,
		tank = null,
		mouseX = 0,
		mouseY = 0,
		prevMouseX = -1,
		prevMouseY = -1,
		_this = this,
		t = 0,
		tInc = true,
		gameImages = {},
		P0 = {x: 50, y: 550},
		P1 = {x: 400, y:  150},
		P2 = {x: 700, y: 350},
		MAX_ENEMIES = 5,
		MAX_ROCKETS = 5;

	
	this.killed = [];

	this.DEBUG = false;
	
	this.gamePaused = false;

	this.explosionSound = new Audio('Rocket/sound/exp_3.mp3');
	this.launchSound = new Audio('Rocket/sound/launch_1.mp3');
	
	this.enemies = [];
	this.rockets = [];
	this.explosions = [];
	this.neutralUnits = [];
	
	this.events = {};
	
	this.g = gameImages;
	
	theCanvas.addEventListener('mousemove',function(e){
		prevMouseX = mouseX;
		prevMouseY = mouseY;
		mouseX = e.clientX;
		mouseY = e.clientY;
	})
	
	theCanvas.addEventListener('click',function(e){
		launchRocket({
			x: e.clientX,
			y: e.clientY
		});
	});
	
	window.addEventListener('keydown',function(e){
		switch( e.keyCode ) {
			case 68:
				_this.DEBUG = ! _this.DEBUG;
				break;
				
			case 27:
				_this.gamePaused = ! _this.gamePaused;
				if ( ! _this.gamePaused ) {
					resumeGame();
				}
		}
	});

	this.start = function() {
		
		this.addEvent('explosion',function(coords){
			_this.addExplosion( new Explosion(_this,coords) );
		});
		
		this.addEvent('explosion',function(coords,damageRange){
			//console.log(damageRange)
			damageRange = damageRange || 40;

			var enemy,distanceToEnemy;
			_this.killed = [];
			//check fo tanks
			for(var i in _this.enemies) {
				enemy = _this.enemies[i];
				if( ! inArray(enemy.id,_this.killed)) {
					distanceToEnemy = pointsDistance(enemy.pos, coords);
					//console.log('Checking ' + i + 'tank',distanceToEnemy)
					if( distanceToEnemy <= damageRange) {
						//console.log('KILL')
						_this.killed.push(enemy.id)
					}
				}
			}
			
		});

		loadImages( [
			{name:'cursor', path:'Rocket/img/cursor.gif'},
			{name:'rocket', path:'Rocket/img/rocket.png'},
			{name:'sand_tank',   path:'Rocket/img/sand_tank.png'},
			{name:'navy_tank', path:'Rocket/img/navy_tank.png'},
			{name:'heavy_tank', path:'Rocket/img/heavy_tank.png'},
			{name:'tracks_tile', path:'Rocket/img/tracks_tile.png'},
			{name:'exp',    path:'Rocket/img/explosion_2.png'},
			{name:'grass',  path:'Rocket/img/gr_2.png'},
			{name:'silo',  path:'Rocket/img/silo.png'},
			{name:'rocket_flame_tile',  path:'Rocket/img/rocket_flame_tile.png'}
			
		] , startGame );
				
	};
	
	
	function startGame(imgs) {
		
		for ( var i =0; i < imgs.length; i++ ) {
			gameImages[imgs[i].name] = imgs[i].img;
		}
		
		_this.expTiles = new Tileset(gameImages['exp'], 256, 128, 0, cxt);
		
		_this.trackTiles = new Tileset(gameImages['tracks_tile'], 79, 54, 0, cxt);
		
		var  baseY = 550,siloY;
		for(var i = 0; i < MAX_ROCKETS ; i++) {
			siloY = baseY-50*i;
			if( siloY >= 50 ) {
				_this.neutralUnits.push( new Silo(_this, {x:35,y:siloY}) );	
			}
		}
		
		_this.lastSilo = -1;
		animate();
	}
	
	function clearCanvas() {
		if (_this.DEBUG) {
			cxt.clearRect(0,0,theCanvas.width, theCanvas.height)
		} else {
			cxt.fillStyle = cxt.createPattern(gameImages['grass'],'repeat');
			cxt.fillRect(0,0,theCanvas.width, theCanvas.height);
		}
	}

	
	function animate() {
		update();
		draw();
		if( ! _this.gamePaused ) {
			requestAnimationFrame(animate);
		} else {
			drawPauseScreen();
		}
	}
	
	function resumeGame() {
		_this.gamePaused = false;
		animate();
	}
	
	function drawPauseScreen(){
		cxt.fillStyle = 'rgba(10,10,10,0.5)';
		cxt.fillRect(0,0,theCanvas.width, theCanvas.height);
	
		cxt.font = "bold 70px Tahoma";
		cxt.fillStyle = '#F0BB41';
		cxt.fillText( 'PAUSED', 400, 200);
		cxt.strokeStyle = '#222';
		cxt.strokeText( 'PAUSED', 400, 200);
		
		cxt.font = "bold 24px Arial";
		cxt.strokeStyle = '#555';
		cxt.strokeText( 'Press ESC to resume game', 390, 250);
		cxt.fillStyle = '#fff';
		cxt.fillText( 'Press ESC to resume game', 390, 250);
	}
	
	function launchRocket(coords) {
		//_this.neutralUnits.length
		_this.lastSilo++;
		if( _this.lastSilo >= _this.neutralUnits.length ) {
			_this.lastSilo = 0;
		}
		var siloNum = _this.lastSilo;
		//var siloNum  = randomFromInterval(0,2);

		//console.log('Launch Rocket from Silo #'+siloNum);
		if(_this.rockets.length < MAX_ROCKETS)
			_this.rockets.push( createRocket(coords,siloNum) );
	}
	
	function update() {
		_this.needRedraw = true;
		
		//Delete Killed Tanks

		if(_this.killed.length){
			var newTanks = [];
			for (var i in _this.enemies) {
				var isKilled = false;
				for(var j=0;j<_this.killed.length;j++) {
					if( _this.enemies[i].id == _this.killed[j]) {
						isKilled = true;
						break;
					}
				}
				if( ! isKilled ) {
					newTanks.push(_this.enemies[i])
				}
			}
			_this.killed = [];
			_this.enemies = newTanks;
		}
		
		if( _this.enemies.length  ) {
			for (var i in _this.enemies ) {
				_this.enemies[i].update();
			}
		}
		
		
		if( _this.enemies.length < MAX_ENEMIES ) {
			_this.needRedraw = true;
			_this.enemies.push( createTank() );
		}
		
		if( _this.rockets.length  ) {
			for (var i in _this.rockets ) {
				_this.rockets[i].update();
			}
		}
		
	}
	
	function createRocket(targetCoords, siloNum){
		if( _this.neutralUnits[siloNum] !== 'undefined') {
			var silo = _this.neutralUnits[siloNum];
			return new Rocket( _this,targetCoords,{
				x:silo.x,
				y:silo.y
			},40);
		}
	}
	
	function createTank() {
		var pos = getFreePosition(1),
		    tankTypes = ['Sand','Navy','Heavy'],
			type = tankTypes[randomFromInterval(0,tankTypes.length-1)];
		
		switch(type) {
			case 'Sand':
				return new SandTank(_this,pos);
				break;
			case 'Navy':
				return new NavyTank(_this,pos);
				break;
			case 'Heavy':
				return new HeavyTank(_this,pos);
				break;
			default:
				return new SandTank(_this,pos);
				break;
		}
		
	}
	
	function getFreePosition(n) {
		var p = {
			x: randomFromInterval(750,950),
			y: randomFromInterval(50,350)
		};
		
		if( n > 100 ) {
			return p;
		}
		
		for (var i in _this.enemies ) {
			if ( 
				_this.enemies[i].pos.x < p.x - 65 || 
				_this.enemies[i].pos.x > p.x + 65 &&
				_this.enemies[i].pos.y < p.y - 45 || 
				_this.enemies[i].pos.y > p.y + 45
			) {
				//
			} else {
				return getFreePosition(n+1);
			}
 		}
		return p;
	}
	
	
	this.fireEvent = function(){
		var firedEvent = arguments[0];
		    args = Array.prototype.slice.call(arguments, 1);
		
		if (typeof this.events[firedEvent] !== 'undefined') {
			for (var i in this.events[firedEvent]) {

				this.events[firedEvent][i].apply(_this,args);
			}
		}
	}
	
	this.addEvent = function(event,callback){
		if (typeof this.events[event] === 'undefined') {
			this.events[event] = [];
		}
		this.events[event].push(callback);
	}
	
	this.addExplosion = function(e){
		this.explosions.push(e);
	}
	
	function draw() {
		//if (!_this.needRedraw)
		//	return;
		
		clearCanvas();
		
		
		//Draw Silo
		for (var i in _this.neutralUnits ) {
			_this.neutralUnits[i].draw();
		}

		//Draw Enemies
		for (var i in _this.enemies ) {
			_this.enemies[i].draw();
		}
		
		for (var i in _this.explosions ) {
			_this.explosions[i].draw();
		}
		
		for (var i in _this.rockets ) {
			_this.rockets[i].draw();
		}
		
	}
	
	function drawScene() {
		clearCanvas();
		
		cxt.drawImage( gameImages['silo'], P0.x-25,P0.y);
		
		
		for( var o in this.sceneObjects ) {
			o.draw();
		}
		
		tank.pos = P2;
		tank.draw();
		
		if( typeof _this.explosion !== 'undefined' ) {
			_this.explosion.update();
		}
		
		
		cxt.beginPath();
		//cxt.moveTo(P0.x, P0.y);
		//cxt.quadraticCurveTo(P1.x, P1.y, P2.x, P2.y)
		//cxt.strokeStyle = '#333';
		//cxt.stroke();
		cxt.closePath();
		
		var cr = 5;
		new Circle(P0.x,P0.y,cr,'#555','#CFA').draw();
		new Circle(P1.x,P1.y,cr,'#555','#CFA').draw();
		new Circle(P2.x,P2.y,cr,'#555','#CFA').draw();
		
		T = {}
		T.x = Math.pow((1-t), 2) * P0.x + 2 * (1-t) * t * P1.x + Math.pow(t, 2) * P2.x; 
		T.y = Math.pow((1-t), 2) * P0.y + 2 * (1-t) * t * P1.y + Math.pow(t, 2) * P2.y; 
		//new Circle(T.x,T.y,5,'#777','red').draw();
		
		var distance = pointsDistance(P0,P1);
		
		var L = t/ (1-t);
		
		var D1 = {};
		var D2 = {};
		
		D1.x = ( P0.x + L*P1.x ) / ( 1 + L );
		D1.y = ( P0.y + L*P1.y ) / ( 1 + L );

		D2.x = ( P1.x + L*P2.x ) / ( 1 + L );
		D2.y = ( P1.y + L*P2.y ) / ( 1 + L );

		//new Circle(D1.x,D1.y,5,'#222','#ACF').draw();
		//new Circle(D2.x,D2.y,5,'#222','#ACF').draw();
		
		
		cxt.beginPath();
		//cxt.moveTo(D1.x, D1.y);
		//cxt.lineTo(D2.x, D2.y);
		//cxt.strokeStyle = 'blue';
		//cxt.stroke();
		cxt.closePath();
		
		
		D3 = {
			y: D1.y,
			x: D2.x
		}
		
		//new Circle(D3.x,D3.y,5,'#222','#ACF').draw();
		
		
		var angleRad = Math.acos( pointsDistance(D1,D3) / pointsDistance(D1,D2) );
		var angle = (180/Math.PI)*angleRad;
		
		if( D2.y < D1.y ) {
			angle = - angle;
		}
		
		//cxt.font = "bold 16px Arial";
		//cxt.fillText(angle.toFixed(0), 50, 100);
		
		
		if( t == 0 && rocket) {
			_this.launchSound.currentTime = 0;
			_this.launchSound.volume = 0.2;
			_this.launchSound.play();
		}
		
		
		var t_i = 0.01;
		if( P2.x < 500) {
			t_i = 0.0125
		}
		
		t += t_i;
		if( t > 0.99 ) {
			_this.explosion = new Explosion(T,_this, cxt);
			t = 0;
			
			
			P2 = {
				x: randomFromInterval(350,950), 
				y: randomFromInterval(50,550)
			}
			P1 = {
				x:  parseInt( (P2.x - P0.x ) /3.5  + P0.x),
				y: P2.y - 250
			}
			
			if( P0.y  - P1.y < 300) {
				P1.y = P0.y - 300;
			}
			
		}
		
		if( typeof rocket != 'undefined') {
			if( t == 0 ) {
				rocket.clearAnimation();
			}
			rocket.drawBack = ! tInc;
			rocket.angle = angle;
			rocket.pos = T;
			rocket.draw();
		}
		
		//drawCursor();
	}
	
	
	function pointsDistance(P0,P1){
		return Math.sqrt( Math.pow( (P1.x - P0.x) , 2 ) + Math.pow( (P1.y - P0.y), 2 ) );
	}
	
	function mouseMoved() {
		return ( prevMouseY != mouseY || prevMouseX != mouseX );
	}
	
	function drawCursor() {
		
		//cxt.drawImage( gameImages['cursor'], mouseX,mouseY);
			
	}
	
	
	function loadImages( images, loadedCallback ) {
		var imgs=[];
		
		for(var i = 0; i < images.length; i++ ) {
			var sourceImage = images[i];
			var img = new Image;
			var name  = sourceImage.name;
			img.onload = loaderFactory(name,imgs,images,loadedCallback)
			img.src = sourceImage.path;
		}
		
	}
	
	function loaderFactory(name,imgs,images,loadedCallback) {
		return function(){
		  imgs.push({
			name : name,
			img : this
		  });
		  
		  if (imgs.length == images.length) {
			loadedCallback(imgs);
		  }
		}
	}
	
	
}