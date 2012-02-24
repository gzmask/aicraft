AICRAFT.Player = function (x,y,z,qx,qy,qz,qw) {
	this.maxSpeed = 20;
	this.acceleration = 4;
	this.connected = false;
	this.keycode = 0;
	AICRAFT.GameObject.call(this,x,y,z,qx,qy,qz,qw);
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

AICRAFT.Player.prototype.updateInput = function() {
	var self = this;

	var impulse;
	var velocity = this.phybody.getLinearVelocity();
	var absVelocity = Math.sqrt(velocity.getX()*velocity.getX() + velocity.getY()*velocity.getY() + velocity.getZ()*velocity.getZ()); 
	if (AICRAFT.ClientEngine.key(this.keycode,"w") && absVelocity < this.maxSpeed && this.position.y < 1) {
		this.phybody.activate()
		impulse = new Ammo.btVector3(0,0,0-this.acceleration); 
		this.phybody.applyCentralImpulse(impulse);
	}
	if (AICRAFT.ClientEngine.key(this.keycode,"a") && absVelocity < this.maxSpeed && this.position.y < 1) {
		this.phybody.activate()
		impulse = new Ammo.btVector3(0-this.acceleration,0,0); 
		this.phybody.applyCentralImpulse(impulse);
	}
	if (AICRAFT.ClientEngine.key(this.keycode,"s") &&  absVelocity < this.maxSpeed && this.position.y < 1) {
		this.phybody.activate()
		impulse = new Ammo.btVector3(0,0,this.acceleration); 
		this.phybody.applyCentralImpulse(impulse);
	}
	if (AICRAFT.ClientEngine.key(this.keycode,"d") &&  absVelocity < this.maxSpeed && this.position.y < 1) {
		this.phybody.activate()
		impulse = new Ammo.btVector3(this.acceleration,0,0); 
		this.phybody.applyCentralImpulse(impulse);
	}
	if (AICRAFT.ClientEngine.key(this.keycode,"e") && this.position.y < 0.1) {
		this.phybody.activate()
		impulse = new Ammo.btVector3(0,1,0); 
		this.phybody.applyCentralImpulse(impulse);
	}
};
