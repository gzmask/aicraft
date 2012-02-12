AICRAFT.Player = function (x,y,z,qx,qy,qz,qw) {
	this.maxSpeed = 20;
	this.acceleration = 4;
	AICRAFT.GameObject.call(this,x,y,z,qx,qy,qz,qw);
};

AICRAFT.Player.prototype = new AICRAFT.GameObject();
AICRAFT.Player.prototype.constructor = AICRAFT.Player;
