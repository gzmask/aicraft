/** @fileoverview AICRAFT.Player class
 */

/** @class Player class controls the player models, physic collision bodies and user inputs
 * init to be facing north
 * @extends AICRAFT.GameObject
 * @requires Ammo.js
 */
AICRAFT.Player = function (x,y,z,qx,qy,qz,qw, AmmoIn) {
	AICRAFT.GameObject.call(this,x,y,z,qx,qy,qz,qw);
	if (AmmoIn !== undefined) {
		this.Ammo = AmmoIn;
	} else {
		this.Ammo = Ammo;
	}
	this.maxSpeed = 20;
	this.acceleration = 4;
	this.connected = false;
	this.keycode = 0;
};

AICRAFT.Player.prototype = new AICRAFT.GameObject();
AICRAFT.Player.prototype.constructor = AICRAFT.Player;

AICRAFT.Player.prototype.handleKeyDown = function(event, self) {
	if (String.fromCharCode(event.keyCode) == "W") {
		self.keycode = self.keycode | 8;
	} else if (String.fromCharCode(event.keyCode) == "A") {
		self.keycode = self.keycode | 4;
	} else if (String.fromCharCode(event.keyCode) == "S") {
		self.keycode = self.keycode | 2;
	} else if (String.fromCharCode(event.keyCode) == "D") {
		self.keycode = self.keycode | 1;
	} else if (String.fromCharCode(event.keyCode) == "E") {
		self.keycode = self.keycode | 16;
	};
};

AICRAFT.Player.prototype.handleKeyUp = function(event, self) {
	if (String.fromCharCode(event.keyCode) == "W") {
		self.keycode = self.keycode ^ 8;
	} else if (String.fromCharCode(event.keyCode) == "A") {
		self.keycode = self.keycode ^ 4;
	} else if (String.fromCharCode(event.keyCode) == "S") {
		self.keycode = self.keycode ^ 2;
	} else if (String.fromCharCode(event.keyCode) == "D") {
		self.keycode = self.keycode ^ 1;
	} else if (String.fromCharCode(event.keyCode) == "E") {
		self.keycode = self.keycode ^ 16;
	};
};

AICRAFT.Player.prototype.updateInput = function(AmmoIn) {
	if (AmmoIn !== undefined) {
		Ammo = AmmoIn;
	};
	var self = this;

	var impulse;
	var velocity = this.phybody.getLinearVelocity();
	var absVelocity = Math.sqrt(velocity.getX()*velocity.getX() + velocity.getY()*velocity.getY() + velocity.getZ()*velocity.getZ()); 
	if (AICRAFT.ClientEngine.key(this.keycode,"w") && absVelocity < this.maxSpeed && this.position.y < 1) {
		/*
		this.phybody.activate();
		impulse = new Ammo.btVector3(0,0,0-this.acceleration); 
		this.phybody.applyCentralImpulse(impulse);
		*/
		AICRAFT.Player.ahead(this, true);
	}
	if (AICRAFT.ClientEngine.key(this.keycode,"a") && absVelocity < this.maxSpeed && this.position.y < 1) {
		/*
		this.phybody.activate();
		impulse = new Ammo.btVector3(0-this.acceleration,0,0); 
		this.phybody.applyCentralImpulse(impulse);
		*/
		AICRAFT.Player.side(this, true);
	}
	if (AICRAFT.ClientEngine.key(this.keycode,"s") &&  absVelocity < this.maxSpeed && this.position.y < 1) {
		/*
		this.phybody.activate();
		impulse = new Ammo.btVector3(0,0,this.acceleration); 
		this.phybody.applyCentralImpulse(impulse);
		*/
		AICRAFT.Player.ahead(this, false);
	}
	if (AICRAFT.ClientEngine.key(this.keycode,"d") &&  absVelocity < this.maxSpeed && this.position.y < 1) {
		/*
		this.phybody.activate();
		impulse = new Ammo.btVector3(this.acceleration,0,0); 
		this.phybody.applyCentralImpulse(impulse);
		*/
		AICRAFT.Player.side(this, false);
	}
	if (AICRAFT.ClientEngine.key(this.keycode,"e") && this.position.y < 0.1) {
		this.phybody.activate();
		impulse = new Ammo.btVector3(0,1,0); 
		this.phybody.applyCentralImpulse(impulse);
	}
};

AICRAFT.Player.side = function(self, IsLeft) {
	if (IsLeft === true) {
		var frontVector = new self.Ammo.btVector3(-1,0,0);
	} else {
		var frontVector = new self.Ammo.btVector3(1,0,0);
	}
	AICRAFT.Player.move(self, frontVector);
};

AICRAFT.Player.ahead = function(self, IsAhead) {
	if (IsAhead === true) {
		var frontVector = new self.Ammo.btVector3(0,0,-1);
	} else {
		var frontVector = new self.Ammo.btVector3(0,0,1);
	}
	AICRAFT.Player.move(self, frontVector);
};

AICRAFT.Player.move = function(self, frontVector) {
	self.phybody.activate();
	var quat = self.phybody.getOrientation();
	var transform = new self.Ammo.btTransform();
	transform.setIdentity();
	transform.setRotation(quat);
	frontVector = transform.op_mul(frontVector);
	for (var i=0; i<self.acceleration; i++) {
		frontVector.setX(frontVector.getX()*1.1);
		frontVector.setY(frontVector.getY()*1.1);
		frontVector.setZ(frontVector.getZ()*1.1);
	};
	self.phybody.applyCentralImpulse(frontVector);
};
