function SandTank(gameInstance, position){	
	Tank.apply(this,arguments);
	this.setSkin = function() {
		this.skin = gameInstance.g['sand_tank'];
	}
	this.speed = 0.5;
	this.init();
}
extend(SandTank,Tank);