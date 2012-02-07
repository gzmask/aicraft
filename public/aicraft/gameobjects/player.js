AICRAFT.Player = function () {
	AICRAFT.GameObject.call(this);
};

AICRAFT.Player.prototype = new AICRAFT.GameObject();
AICRAFT.Player.prototype.constructor = AICRAFT.Player;
