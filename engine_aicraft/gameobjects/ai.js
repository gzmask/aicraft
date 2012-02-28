AICRAFT.Ai = function (x,y,z,qx,qy,qz,qw, AmmoIn) {
	AICRAFT.GameObject.call(this,x,y,z,qx,qy,qz,qw);
	if (AmmoIn !== undefined) {
		this.Ammo = AmmoIn;
	} else {
		this.Ammo = Ammo;
	}

	this.sight = undefined;
	this.maxSpeed = 10;
	this.acceleration = 28;
	this.codeUploading = false;
	this.aheadLock = false;
	this.turnLock = false;
	this.hp = 100;
};

AICRAFT.Ai.prototype = new AICRAFT.GameObject();
AICRAFT.Ai.prototype.constructor = AICRAFT.Ai;

//override buildMesh method
AICRAFT.Ai.prototype.buildMesh = function(THREE, scene) {
	//calls super method
	AICRAFT.GameObject.prototype.buildMesh.call(this,THREE, scene);
	//build sight ray
	var sightGeo = new THREE.Geometry();
	sightGeo.vertices.push (
		AICRAFT.v(0,0,0), AICRAFT.v(-84.5,0,-260),
		AICRAFT.v(0,0,0), AICRAFT.v(-47.6,0,-267.8),
		AICRAFT.v(0,0,0), AICRAFT.v(0,0,-273),
		AICRAFT.v(0,0,0), AICRAFT.v(47.6,0,-267.8),
		AICRAFT.v(0,0,0), AICRAFT.v(84.5,0,-260)
	);
	var sightMat = new THREE.LineBasicMaterial({color: 0x33ff33, lineWidth:1});
	this.sight = new THREE.Line(sightGeo, sightMat);
	this.sight.type = THREE.Lines;
	this.sight.useQuaternion = true;
	this.sight.position.x = this.position.x;
	this.sight.position.y = this.position.y;
	this.sight.position.z = this.position.z;
	this.sight.quaternion.x = this.quaternion.x;
	this.sight.quaternion.y = this.quaternion.y;
	this.sight.quaternion.z = this.quaternion.z;
	this.sight.quaternion.w = this.quaternion.w;
	scene.add(this.sight);
};

//override physic and graphic update method
AICRAFT.Ai.prototype.physicAndGraphicUpdate = function(dynamicsWorld) {
	AICRAFT.GameObject.prototype.physicAndGraphicUpdate.call(this, dynamicsWorld);
	this.sight.position.x = this.position.x;
	this.sight.position.y = this.position.y;
	this.sight.position.z = this.position.z;
	this.sight.quaternion.x = this.quaternion.x;
	this.sight.quaternion.y = this.quaternion.y;
	this.sight.quaternion.z = this.quaternion.z;
	this.sight.quaternion.w = this.quaternion.w;
};

//controlling apis for intelligent part
AICRAFT.Ai.prototype.ahead = function(units, cb) {
	var self = this;
	if (units < 1 || 
		self.hp < 1 ||
		self.codeUploading) {
		if (cb !== undefined) {
			cb();}
		return false;
	}
	var velocity = self.phybody.getLinearVelocity();
	var absVelocity = Math.sqrt(velocity.getX()*velocity.getX() + velocity.getY()*velocity.getY() + velocity.getZ()*velocity.getZ()); 

	self.phybody.activate();
	var quat = self.phybody.getOrientation();

	var transform = new self.Ammo.btTransform();
	transform.setIdentity();
	transform.setRotation(quat);

	var frontVector = new self.Ammo.btVector3(0,0,-1);
	frontVector = transform.op_mul(frontVector);

	for (var i=0; i<self.acceleration; i++) {
		frontVector.setX(frontVector.getX()*1.1);
		frontVector.setY(frontVector.getY()*1.1);
		frontVector.setZ(frontVector.getZ()*1.1);
	};

	if (absVelocity < self.maxSpeed && !self.aheadLock) {
		self.phybody.applyCentralImpulse(frontVector);};

	setTimeout( function(){
		self.ahead(units-1, cb);
	}, 500);

};

AICRAFT.Ai.prototype.turnRight = function(degree, cb) {
	if (degree > 0) {
		AICRAFT.Ai.turn(degree, cb, false, this);
	} else {
		AICRAFT.Ai.turn(-1*degree, cb, true, this);
	}
};

AICRAFT.Ai.prototype.turnLeft = function(degree, cb) {
	if (degree > 0) {
		AICRAFT.Ai.turn(degree, cb, true, this);
	} else {
		AICRAFT.Ai.turn(-1*degree, cb, false, this);
	}
};

//static functions
AICRAFT.Ai.turn = function(degree, cb, IsLeft, self) {
	self.phybody.setFriction(self.friction);
	self.aheadLock = false;
	if (degree < 1 || self.hp < 1 || self.codeUploading) {
		if (cb !== undefined) {
			cb();}
		return false;
	}
	var sign;
	if (IsLeft == true) {
		sign = 1;
	} else {
		sign = -1;
	};
	self.phybody.activate();
	self.phybody.setAngularVelocity(new self.Ammo.btVector3(0,0,0));
	self.phybody.setLinearVelocity(new self.Ammo.btVector3(0,0,0));
	self.aheadLock = true;
	self.phybody.setFriction(0);
	if (!self.turnLock) {
		self.phybody.applyTorqueImpulse(new self.Ammo.btVector3(0, 4*sign, 0));
	}
	setTimeout( function(){
		AICRAFT.Ai.turn(degree-2, cb, IsLeft, self);
	}, 50);
};

