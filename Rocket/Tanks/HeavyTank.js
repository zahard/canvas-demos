function HeavyTank(gameInstance, position){
	Tank.apply(this,arguments);
	this.setSkin = function() {
		this.skin = gameInstance.g['heavy_tank'];
	}
	this.speed = 0.3;
	this.init();
}
extend(HeavyTank,Tank);