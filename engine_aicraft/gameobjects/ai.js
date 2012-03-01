/** @fileoverview AICRAFT.Ai class
 */

/** @class physical part of an A.I.
 * @extends AICRAFT.GameObject
 * @requires Ammo.js
 */
AICRAFT.Ai = function (x,y,z,qx,qy,qz,qw, AmmoIn) {
	AICRAFT.GameObject.call(this,x,y,z,qx,qy,qz,qw);
	if (AmmoIn !== undefined) {
		this.Ammo = AmmoIn;
	} else {
		this.Ammo = Ammo;
	}

	this.sight = new Object();
	this.sight.lock = true;
	this.sight.lines = new Array();
	this.sight.quaternion = new Object();
	this.sight.quaternion.x = 0;
	this.sight.quaternion.y = 0;
	this.sight.quaternion.z = 0;
	this.sight.quaternion.w = 1;
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
	this.sight.quaternion.x = this.quaternion.x;
	this.sight.quaternion.y = this.quaternion.y;
	this.sight.quaternion.z = this.quaternion.z;
	this.sight.quaternion.w = this.quaternion.w;
	this.sight.lines.push( [AICRAFT.bv(0,0,0), AICRAFT.bv(-84.5,0,-260)],
		[AICRAFT.bv(0,0,0), AICRAFT.bv(-47.6,0,-267.8)],
		[AICRAFT.bv(0,0,0), AICRAFT.bv(0,0,-273)],
		[AICRAFT.bv(0,0,0), AICRAFT.bv(47.6,0,-267.8)],
		[AICRAFT.bv(0,0,0), AICRAFT.bv(84.5,0,-260)]);
};

AICRAFT.Ai.prototype.setPos = function(AmmoIn,x,y,z,qx,qy,qz,qw,sqx,sqy,sqz,sqw,vx,vy,vz) {
	AICRAFT.GameObject.prototype.setPos.call(this,AmmoIn,x,y,z,qx,qy,qz,qw,vx,vy,vz);
	this.sight.quaternion.x = sqx;
	this.sight.quaternion.y = sqy;
	this.sight.quaternion.z = sqz;
	this.sight.quaternion.w = sqw;
	this.clientSight.quaternion.x = this.sight.quaternion.x;
	this.clientSight.quaternion.y = this.sight.quaternion.y;
	this.clientSight.quaternion.z = this.sight.quaternion.z;
	this.clientSight.quaternion.w = this.sight.quaternion.w;
};

//override physic and graphic update method
AICRAFT.Ai.prototype.physicAndGraphicUpdate = function(dynamicsWorld) {
	AICRAFT.GameObject.prototype.physicAndGraphicUpdate.call(this, dynamicsWorld);
	this.clientSight.position.x = this.position.x;
	this.clientSight.position.y = this.position.y;
	this.clientSight.position.z = this.position.z;
	this.clientSight.quaternion.x = this.sight.quaternion.x;
	this.clientSight.quaternion.y = this.sight.quaternion.y;
	this.clientSight.quaternion.z = this.sight.quaternion.z;
	this.clientSight.quaternion.w = this.sight.quaternion.w;
};

//controlling apis for intelligent part

AICRAFT.Ai.prototype.back = function(units, cb) {
	AICRAFT.Ai.move(this, units, cb, false, 600);
};

AICRAFT.Ai.prototype.ahead = function(units, cb) {
	AICRAFT.Ai.move(this, units, cb, true, 400);
};

/** turns the sight of the AI to the left
 * @param degree this can not be negative
 */
AICRAFT.Ai.prototype.lookLeft = function(degree, cb) {
	AICRAFT.Ai.look(this, degree, cb, true);
};

/** turns the sight of the AI to the right
 * @param degree this can not be negative
 */
AICRAFT.Ai.prototype.lookRight = function(degree, cb) {
	AICRAFT.Ai.look(this, degree, cb, false);
};

AICRAFT.Ai.prototype.turnRight = function(degree, cb) {
	AICRAFT.Ai.turn(this, degree, cb, false);
};

AICRAFT.Ai.prototype.turnLeft = function(degree, cb) {
	AICRAFT.Ai.turn(this, degree, cb, true);
};


/** Controls the sight of the AI
 * @param degree this can not be negative
 */
AICRAFT.Ai.look = function(self, degree, cb, IsLeft) {
	AICRAFT.Ai.rotate(self, degree, cb, IsLeft, false, true, 20);
};

AICRAFT.Ai.turn = function(self, degree, cb, IsLeft) {
	AICRAFT.Ai.rotate(self, degree, cb, IsLeft, true, false, 40);
};

AICRAFT.Ai.rotate = function(self, degree, cb, IsLeft, IsBody, IsSight, delay) {
	if (degree < 1 || self.hp < 1 || self.codeUploading) {
		if (cb !== undefined) {
			cb();}
		return false;
	}
	var ori_quat = self.phybody.getOrientation();
	var sight_quat = new self.Ammo.btQuaternion(self.sight.quaternion.x,
		self.sight.quaternion.y,
		self.sight.quaternion.z,
		self.sight.quaternion.w);
	var quat = new self.Ammo.btQuaternion();
	if (IsLeft === true) {
		quat = AICRAFT.quatFromEuler(1,0,0);
	} else {
		quat = AICRAFT.quatFromEuler(-1,0,0);
	}
	var result_quat;
	if (IsBody === true) {
		result_quat = AICRAFT.quatMul(ori_quat, quat);
		self.quaternion.x = result_quat.getX();
		self.quaternion.y = result_quat.getY();
		self.quaternion.z = result_quat.getZ();
		self.quaternion.w = result_quat.getW();
		var trans = new self.Ammo.btTransform();	
		trans.setIdentity();
		trans.setOrigin(new self.Ammo.btVector3(self.position.x, self.position.y, self.position.z));
		trans.setRotation(result_quat);
		self.phybody.activate();
		self.phybody.getMotionState().setWorldTransform(trans);
		self.phybody.setCenterOfMassTransform(trans);
	} 
	if (IsSight === true || self.sight.lock === true) {
		result_quat = AICRAFT.quatMul(sight_quat, quat);
		self.sight.quaternion.x = result_quat.getX();
		self.sight.quaternion.y = result_quat.getY();
		self.sight.quaternion.z = result_quat.getZ();
		self.sight.quaternion.w = result_quat.getW();
	} 
	setTimeout(function(){
		AICRAFT.Ai.rotate(self, degree-1, cb, IsLeft, IsBody, IsSight, delay);
	}, delay);
};

AICRAFT.Ai.move = function(self, units, cb, IsAhead, delay) {
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
		AICRAFT.Ai.move(self, units-1, cb, IsAhead, delay);
	}, delay);
};

