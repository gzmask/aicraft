AICRAFT.Player = function () {
	AICRAFT.GameObject.call(this);
	this.maxSpeed = 20;
	this.acceleration = 4;
};

AICRAFT.Player.prototype = new AICRAFT.GameObject();
AICRAFT.Player.prototype.constructor = AICRAFT.Player;
