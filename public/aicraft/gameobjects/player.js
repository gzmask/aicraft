AICRAFT.Player = function () {
	AICRAFT.GameObject.call(this);
};

AICRAFT.Player.prototype = new AICRAFT.GameObject();
AICRAFT.Player.constructor = AICRAFT.Player;
