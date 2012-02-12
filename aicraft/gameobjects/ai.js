AICRAFT.Ai = function (x,y,z,qx,qy,qz,qw) {
	AICRAFT.GameObject.call(this,x,y,z,qx,qy,qz,qw);
};

AICRAFT.Ai.prototype = new AICRAFT.GameObject();
AICRAFT.Ai.prototype.constructor = AICRAFT.Ai;
