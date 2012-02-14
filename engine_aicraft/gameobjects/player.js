AICRAFT.Player = function (x,y,z,qx,qy,qz,qw) {
	this.maxSpeed = 20;
	this.acceleration = 4;
	//first player joins the game isFirst === true
	this.isFirst = false;
	//last player joins the game isLast === true, then the game starts
	this.isLast = false;
	//other players will be isMiddle === ture.
	this.isMiddle = false;
	AICRAFT.GameObject.call(this,x,y,z,qx,qy,qz,qw);
};

AICRAFT.Player.prototype = new AICRAFT.GameObject();
AICRAFT.Player.prototype.constructor = AICRAFT.Player;
