/** @fileoverview AICRAFT.Ai class
 */

/** @class physical part of an A.I.
 * init to be facing north
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
	this.sight.lines = new Array();
	this.sight.quaternion = new Object();
	this.sight.quaternion.x = 0;
	this.sight.quaternion.y = 0;
	this.sight.quaternion.z = 0;
	this.sight.quaternion.w = 1;
	this.sight.range = 80;
	this.maxSpeed = 10;
	this.acceleration = 28;
	this.codeUploading = false;
	this.rotateLock = false;
	this.lookAtLock = false;
	this.raycastLock = false;
	this.weaponLock = false;
	this.weaponRange = 100;
	this.weaponForce = 20;
	this.weaponDelay = 1000;
    this.weaponDamage = 10;
	this.name = undefined;
	/*
	 * points to the player after init
	 */
	this.owner = undefined;
	/*
	 * user defined function, not existed at init
	 */
	this.onSightFound = undefined;
};

AICRAFT.Ai.prototype = new AICRAFT.GameObject();
AICRAFT.Ai.prototype.constructor = AICRAFT.Ai;

AICRAFT.Ai.prototype.buildPhysic = function(AmmoIn, dynamicsWorld) {
	//calls super method to build a basic collision shape, such as a sphere
	AICRAFT.GameObject.prototype.buildPhysic.call(this,AmmoIn, dynamicsWorld);
	this.sight.quaternion.x = this.quaternion.x;
	this.sight.quaternion.y = this.quaternion.y;
	this.sight.quaternion.z = this.quaternion.z;
	this.sight.quaternion.w = this.quaternion.w;
	this.sight.lines = AICRAFT.Ai.getSight(0,0,0, 0,0,-1, this.sight.range, 60, 10, this.Ammo, true);
};

/**
 * updates the physical body, the sight, and checks for enemy using raycasting
 * 
 */
AICRAFT.Ai.prototype.physicUpdate = function() {
	var self = this;
    if (self.hp < 1) {
        return;}
	AICRAFT.GameObject.prototype.physicUpdate.call(self, self.dynamicsWorld);
	//matches the current sight position
	var sight_quat = new self.Ammo.btQuaternion(self.sight.quaternion.x,
			self.sight.quaternion.y,
			self.sight.quaternion.z,
			self.sight.quaternion.w);
	var trans = new self.Ammo.btTransform();
	trans.setIdentity();
	trans.setRotation(sight_quat);
	var targetV3 = new self.Ammo.btVector3(0,0,-1);
	targetV3 = trans.op_mul(targetV3);
	self.sight.lines = AICRAFT.Ai.getSight(self.position.x,self.position.y,self.position.z, 
			targetV3.getX()+self.position.x,targetV3.getY()+self.position.y,targetV3.getZ()+self.position.z, 
			80, 60, 10, self.Ammo, true);
	

	self.raycast(1000);
	self.Ammo.destroy(trans);
	self.Ammo.destroy(sight_quat);
};

/**
 * using raycast to check if enemy is insight. if enemy is found, stop checking for delay value in ms
 */
AICRAFT.Ai.prototype.raycast = function(delay) {
	if (this.raycastLock === true) {return;}
	var self = this;
	for (var i=0; i < self.sight.lines.length; i=i+2) {
		var start = self.sight.lines[i];
		var end = self.sight.lines[i+1];
		var cb = new self.Ammo.ClosestRayResultCallback(start, end);
		this.dynamicsWorld.rayTest(start, end, cb);
		if (cb.hasHit()) {
			self.raycastLock = true;
			self.found(cb.get_m_hitPointWorld().getX(),
					cb.get_m_hitPointWorld().getY(),
					cb.get_m_hitPointWorld().getZ(), cb.get_m_collisionObject().getUserPointer());
			setTimeout(function(){
				self.raycastLock = false;
			}, delay);
		}
	}
};


/**
 * fire at target
 * Ray cast is used to calculate if it's hit.
 * if hits, apply force to the target, reduce its HP
 */
AICRAFT.Ai.prototype.fireAt = function(x,y,z, fn_cb) {
	if (this.weaponLock === true) {return;}
	var self = this;
	var start = new self.Ammo.btVector3(self.position.x, self.position.y, self.position.z);
	var end = new self.Ammo.btVector3(x - self.position.x,
			y - self.position.y,
			z - self.position.z);
	end.normalize();
	end.op_mul(self.weaponRange);
	end.op_add(start);
	console.log('fire from'+start.getX()+','+start.getZ()+' to '+end.getX()+','+end.getZ());
	var cb = new self.Ammo.ClosestRayResultCallback(start, end);
	self.dynamicsWorld.rayTest(start,end,cb);
	if (cb.hasHit()) {
		self.weaponLock = true;
        var ptrInd = cb.get_m_collisionObject().getUserPointer();
		//insert bullet hit stuff
        AICRAFT.Ai.charge(self, start, end, function(){
            self.objects[ptrInd].phybody.activate();
            self.objects[ptrInd].phybody.applyCentralImpulse(self.feedbackVector(start,end).op_mul(1.5));
            self.objects[ptrInd].hp-=self.weaponDamage;
            if (self.objects[ptrInd].hp < 1) {
                self.objects[ptrInd].phybody.setUserPointer(-1);
                return;
            };
            //console.log('hit! getUserPointer:'+ ptrInd);
            //console.log('it has hp of:'+self.objects[ptrInd].hp);
        }, 300);
		setTimeout(function(){
			self.weaponLock = false;
			if (fn_cb !== undefined) {fn_cb();}
		}, self.weaponDelay);
	}
};

/**
 * charge function
 */
AICRAFT.Ai.charge = function(self, start, end, cb, delay) {
    self.phybody.activate();
    self.phybody.applyCentralImpulse(self.feedbackVector(start, end).op_mul(1.1));
    setTimeout(function(){
        cb();
    },delay);
};

/**
 * fire force feedback Vector caculator
 */
AICRAFT.Ai.prototype.feedbackVector = function(start, end) {
    var result = end.op_sub(start);
    result.normalize();
    result.op_mul(this.weaponForce);
    result.setY(result.getY()+0.2*this.weaponForce);
    return result;
};

/**
 * binds the user found function to this instance
 */
AICRAFT.Ai.prototype.found = function(x,y,z, tag) {
	if (tag===-1){return;}
	//if (tag===this.owner.phybody.getIslandTag()) {return;}
	if (tag===this.owner.phybody.getUserPointer()) {return;}
	event = new Object();
	event.position = [x, y, z];
	event.tag = tag;
	try {
		this.onSightFound(event);
	} catch(err) {
		return;
	}
};

/** push the body of the AI forward
 * @param units this can not be negative
 */
AICRAFT.Ai.prototype.ahead = function(units, cb) {
	units = Math.abs(units);
	AICRAFT.Ai.move(this, units, cb, true, 400);
};

/** push the body of the AI backward
 * @param units this can not be negative
 */
AICRAFT.Ai.prototype.back = function(units, cb) {
	units = Math.abs(units);
	AICRAFT.Ai.move(this, units, cb, false, 600);
};

/** turns the sight of the AI to the left
 * @param degree this can not be negative
 */
AICRAFT.Ai.prototype.lookLeft = function(degree, cb) {
	AICRAFT.Ai.lookRotate(this, degree, cb, true);
};

/** turns the sight of the AI to the right
 * @param degree this can not be negative
 */
AICRAFT.Ai.prototype.lookRight = function(degree, cb) {
	AICRAFT.Ai.lookRotate(this, degree, cb, false);
};

/** set the sight to a degree related to the front of the AI instantely. Only allow once per period of time
 * @param to degree that needs to be rotated.
 * @cb callback function to execute after the lookAt lock is release
 */
AICRAFT.Ai.prototype.lookAt = function(degree, cb) {
	var self = this;
	if (self.lookAtLock === true) {
		return;}	
	if (degree > 360) {
		degree = degree % 360;}
	var front_quat = self.phybody.getOrientation();
	var target_quat = AICRAFT.quatFromEuler(degree,0,0,self.Ammo);
	var sight_quat = AICRAFT.quatMul(target_quat,front_quat);
	self.sight.quaternion.x = sight_quat.getX();
	self.sight.quaternion.y = sight_quat.getY();
	self.sight.quaternion.z = sight_quat.getZ();
	self.sight.quaternion.w = sight_quat.getW();
	self.lookAtLock = true;
	setTimeout(function(){
		self.lookAtLock = false;
		if (cb !== undefined) {
			cb();}
	}, 3000);
};


/** turns the body of the AI to the right
 * @param degree this can not be negative
 */
AICRAFT.Ai.prototype.turnRight = function(degree, cb) {
	AICRAFT.Ai.rotate(this, degree, cb, false, true, true, 40);
};

/** turns the body of the AI to the left
 * @param degree this can not be negative
 */
AICRAFT.Ai.prototype.turnLeft = function(degree, cb) {
	AICRAFT.Ai.rotate(this, degree, cb, true, true, true, 40);
};

/** Controls the sight of the AI
 * @param degree this can not be negative
 */
AICRAFT.Ai.lookRotate = function(self, degree, cb, IsLeft) {
	AICRAFT.Ai.rotate(self, degree, cb, IsLeft, false, true, 30);
};

/** Rotates the body to a degree related to the front of the AI or
 * Rotates the sight to a degree related to the front of the Sight
 * @param degree degrees that needs to be rotated.
 */
AICRAFT.Ai.rotate = function(self, degree, cb, IsLeft, IsBody, IsSight, delay) {
	if (degree < 1 || self.hp < 1 || self.codeUploading || self.rotateLock === true) {
		if (cb !== undefined && self.codeUploading !== true) {
			cb();}
		console.log('quiting rotate');
		return false;
	}
	self.rotateLock = true;
	if (degree > 360) {
		degree = degree % 360;}
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
	if (IsSight === true) {
		result_quat = AICRAFT.quatMul(sight_quat, quat);
		self.sight.quaternion.x = result_quat.getX();
		self.sight.quaternion.y = result_quat.getY();
		self.sight.quaternion.z = result_quat.getZ();
		self.sight.quaternion.w = result_quat.getW();
	} 
	setTimeout(function(){
		self.rotateLock = false;
		AICRAFT.Ai.rotate(self, degree-1, cb, IsLeft, IsBody, IsSight, delay);
	}, delay);
};

AICRAFT.Ai.move = function(self, units, cb, IsAhead, delay) {
	if (units < 1 || self.hp < 1 || self.codeUploading || self.IsMoving === true) {
		if (cb !== undefined && self.codeUploading !== true) {
			cb();}
		console.log('quiting move');
		return false;
	}
	self.IsMoving = true;
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

	if (absVelocity < self.maxSpeed) {
		self.phybody.applyCentralImpulse(frontVector);};

	setTimeout( function(){
		self.IsMoving = false;
		AICRAFT.Ai.move(self, units-1, cb, IsAhead, delay);
	}, delay);
};

/** returns the array of sight lines
 * @param x position x
 * @param y position y
 * @param z position z
 * @param tx target position x
 * @param ty target position y
 * @param tz target position z
 * @param length length of the line
 * @param fov fov in degrees
 * @param degreePerLine determines the density of the lines
 * @param Ammo
 * @param IsAmmo If the return array are Ammo vertices or ThreeJS vertices
 */
AICRAFT.Ai.getSight = function(x,y,z, tx,ty,tz, length, fov, degreePerLine, Ammo, IsAmmo) {
	//console.log('==========');
	var resultAr = new Array();
	//make local coords
	tx -= x;
	ty -= y;
	tz -= z;
	
	//calculate first target vector from the left
	var frontV = new Ammo.btVector3(tx,ty,tz);
	var quatRot = AICRAFT.quatFromEuler(fov/2, 0, 0, Ammo);
	var transRot = new Ammo.btTransform();
	transRot.setRotation(quatRot);
	frontV = transRot.op_mul(frontV);
	frontV.normalize();
	frontV.op_mul(length);
	
	do {
		//console.log('x:'+frontV.getX(), 'y:'+frontV.getY(), 'z:'+frontV.getZ());
		resultAr.push(
				AICRAFT.v( x,y,z, IsAmmo),
				AICRAFT.v( frontV.getX()+x, frontV.getY()+y, frontV.getZ()+z, IsAmmo));
		quatRot = AICRAFT.quatFromEuler(-1*degreePerLine, 0, 0, Ammo);
		transRot.setRotation(quatRot);
		frontV = transRot.op_mul(frontV);
		frontV.normalize();
		frontV.op_mul(length);
		fov -= degreePerLine;
	} while (fov >= 0);
	
	Ammo.destroy(quatRot);
	Ammo.destroy(transRot);
	return resultAr;
};
