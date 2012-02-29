AICRAFT.Ai = function (x,y,z,qx,qy,qz,qw, AmmoIn) {
	AICRAFT.GameObject.call(this,x,y,z,qx,qy,qz,qw);
	if (AmmoIn !== undefined) {
		this.Ammo = AmmoIn;
	} else {
		this.Ammo = Ammo;
	}

	this.sight = new Array();
	this.sightQuaternion = new Object();
	this.sightQuaternion.x = 0;
	this.sightQuaternion.y = 0;
	this.sightQuaternion.z = 0;
	this.sightQuaternion.w = 1;
	this.clientSight = undefined;
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
	//build clientSight ray
	var clientSightGeo = new THREE.Geometry();
	clientSightGeo.vertices.push (
		AICRAFT.v(0,0,0), AICRAFT.v(-84.5,0,-260),
		AICRAFT.v(0,0,0), AICRAFT.v(-47.6,0,-267.8),
		AICRAFT.v(0,0,0), AICRAFT.v(0,0,-273),
		AICRAFT.v(0,0,0), AICRAFT.v(47.6,0,-267.8),
		AICRAFT.v(0,0,0), AICRAFT.v(84.5,0,-260)
	);
	var clientSightMat = new THREE.LineBasicMaterial({color: 0x33ff33, lineWidth:1});
	this.clientSight = new THREE.Line(clientSightGeo, clientSightMat);
	this.clientSight.type = THREE.Lines;
	this.clientSight.useQuaternion = true;
	this.clientSight.position.x = this.position.x;
	this.clientSight.position.y = this.position.y;
	this.clientSight.position.z = this.position.z;
	this.clientSight.quaternion.x = this.quaternion.x;
	this.clientSight.quaternion.y = this.quaternion.y;
	this.clientSight.quaternion.z = this.quaternion.z;
	this.clientSight.quaternion.w = this.quaternion.w;
	scene.add(this.clientSight);
};

AICRAFT.Ai.prototype.buildPhysic = function(AmmoIn) {
	AICRAFT.GameObject.prototype.buildPhysic.call(this,AmmoIn);
	this.sight.push( [AICRAFT.bv(0,0,0), AICRAFT.bv(-84.5,0,-260)],
		[AICRAFT.bv(0,0,0), AICRAFT.bv(-47.6,0,-267.8)],
		[AICRAFT.bv(0,0,0), AICRAFT.bv(0,0,-273)],
		[AICRAFT.bv(0,0,0), AICRAFT.bv(47.6,0,-267.8)],
		[AICRAFT.bv(0,0,0), AICRAFT.bv(84.5,0,-260)]);
};

AICRAFT.Ai.prototype.setPos = function(AmmoIn,x,y,z,qx,qy,qz,qw,sqx,sqy,sqz,sqw,vx,vy,vz) {
	AICRAFT.GameObject.prototype.setPos.call(this,AmmoIn,x,y,z,qx,qy,qz,qw,vx,vy,vz);
	this.sightQuaternion.x = sqx;
	this.sightQuaternion.y = sqy;
	this.sightQuaternion.z = sqz;
	this.sightQuaternion.w = sqw;
	this.clientSight.quaternion.x = this.sightQuaternion.x;
	this.clientSight.quaternion.y = this.sightQuaternion.y;
	this.clientSight.quaternion.z = this.sightQuaternion.z;
	this.clientSight.quaternion.w = this.sightQuaternion.w;
};

//override physic and graphic update method
AICRAFT.Ai.prototype.physicAndGraphicUpdate = function(dynamicsWorld) {
	AICRAFT.GameObject.prototype.physicAndGraphicUpdate.call(this, dynamicsWorld);
	this.clientSight.position.x = this.position.x;
	this.clientSight.position.y = this.position.y;
	this.clientSight.position.z = this.position.z;
	this.clientSight.quaternion.x = this.sightQuaternion.x;
	this.clientSight.quaternion.y = this.sightQuaternion.y;
	this.clientSight.quaternion.z = this.sightQuaternion.z;
	this.clientSight.quaternion.w = this.sightQuaternion.w;
};

//controlling apis for intelligent part

AICRAFT.Ai.prototype.lookAt = function(degree, cb) {
	degree = Math.abs(degree);
	var quat = new this.Ammo.btQuaternion();
	var ori_quat = new this.Ammo.btQuaternion(this.sightQuaternion.x,
			this.sightQuaternion.y,
			this.sightQuaternion.z,
			this.sightQuaternion.w);
	quat = AICRAFT.quatFromEuler(degree,0,0);
	quat = AICRAFT.quatMul(ori_quat, quat);
	this.sightQuaternion.x = quat.getX();
	this.sightQuaternion.y = quat.getY();
	this.sightQuaternion.z = quat.getZ();
	this.sightQuaternion.w = quat.getW();
};

AICRAFT.Ai.prototype.back = function(units, cb) {
	AICRAFT.Ai.move(units, cb, false, this);
};

AICRAFT.Ai.prototype.ahead = function(units, cb) {
	AICRAFT.Ai.move(units, cb, true, this);
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

AICRAFT.Ai.move = function(units, cb, IsAhead, self) {
	if (units < 1 || self.hp < 1 || self.codeUploading) {
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

	if (!IsAhead) {
		frontVector.setX(frontVector.getX()*-1);
		frontVector.setY(frontVector.getY()*-1);
		frontVector.setZ(frontVector.getZ()*-1);
	};

	if (absVelocity < self.maxSpeed && !self.aheadLock) {
		self.phybody.applyCentralImpulse(frontVector);};

	setTimeout( function(){
		AICRAFT.Ai.move(units-1, cb, IsAhead, self);
	}, 500);
}
