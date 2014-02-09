function NavyTank(gameInstance, position){
	Tank.apply(this,arguments);
	this.setSkin = function() {
		this.skin = gameInstance.g['navy_tank'];
	}
	this.speed = 0.4;
	this.init();
}
extend(NavyTank,Tank);