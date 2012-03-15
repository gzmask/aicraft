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
	this.sightMesh = undefined;
	this.maxSpeed = 10;
	this.acceleration = 28;
	this.codeUploading = false;
	this.moveLock = false;
	this.rotateLock = false;
	this.lookAtLock = false;
	this.hp = 100;
	this.walkMesh = undefined;
	this.name = undefined;
};

AICRAFT.Ai.prototype = new AICRAFT.GameObject();
AICRAFT.Ai.prototype.constructor = AICRAFT.Ai;

/**Overriding buildMesh method, called by client only
 */
AICRAFT.Ai.prototype.buildMesh = function(THREE, scene) {
	var self = this;
	//calls super method
	//AICRAFT.GameObject.prototype.buildMesh.call(this,THREE, scene);
	AICRAFT.Ai.JSONloader(self,"asset/rat_walk.js", self.walkMesh, scene, THREE);

	//build sightMesh ray
	var sightMeshGeo = new THREE.Geometry();
	sightMeshGeo.vertices = AICRAFT.Ai.getSight(0,0,0, 0,0,-1, 80, 60, 10, this.Ammo, false);
	var sightMeshMat = new THREE.LineBasicMaterial({color: 0x33ff33, lineWidth:1});
	this.sightMesh = new THREE.Line(sightMeshGeo, sightMeshMat);
	this.sightMesh.type = THREE.Lines;
	this.sightMesh.useQuaternion = true;
	this.sightMesh.position.x = this.position.x;
	this.sightMesh.position.y = this.position.y;
	this.sightMesh.position.z = this.position.z;
	this.sightMesh.quaternion.x = this.quaternion.x;
	this.sightMesh.quaternion.y = this.quaternion.y;
	this.sightMesh.quaternion.z = this.quaternion.z;
	this.sightMesh.quaternion.w = this.quaternion.w;
	scene.add(this.sightMesh);
};



AICRAFT.Ai.prototype.buildPhysic = function(AmmoIn) {
	//calls super method to build a basic collision shape, such as a sphere
	AICRAFT.GameObject.prototype.buildPhysic.call(this,AmmoIn);
	this.sight.quaternion.x = this.quaternion.x;
	this.sight.quaternion.y = this.quaternion.y;
	this.sight.quaternion.z = this.quaternion.z;
	this.sight.quaternion.w = this.quaternion.w;
	this.sight.lines = AICRAFT.Ai.getSight(0,0,0, 0,0,-1, 80, 60, 10, this.Ammo, true);
};



//override physic and graphic update method
AICRAFT.Ai.prototype.physicAndGraphicUpdate = function(dynamicsWorld, delta) {
	if (this.mesh === undefined) {
		return;}
	//AICRAFT.GameObject.prototype.physicAndGraphicUpdate.call(this, dynamicsWorld);
	this.physicUpdate.call(this, dynamicsWorld);
	this.sightMesh.position.x = this.mesh.position.x = this.position.x;
	this.sightMesh.position.y = this.mesh.position.y = this.position.y;
	this.sightMesh.position.z = this.mesh.position.z = this.position.z;
	this.mesh.quaternion.x = this.quaternion.x;
	this.mesh.quaternion.y = this.quaternion.y;
	this.mesh.quaternion.z = this.quaternion.z;
	this.mesh.quaternion.w = this.quaternion.w;
	this.sightMesh.quaternion.x = this.sight.quaternion.x;
	this.sightMesh.quaternion.y = this.sight.quaternion.y;
	this.sightMesh.quaternion.z = this.sight.quaternion.z;
	this.sightMesh.quaternion.w = this.sight.quaternion.w;
	this.mesh.updateAnimation(1000*delta);
};

/**
 * updates the physical body, the sight, and checks for enemy using raycasting
 * 
 */
AICRAFT.Ai.prototype.physicUpdate = function(dynamicsWorld) {
	var self = this;
	AICRAFT.GameObject.prototype.physicUpdate.call(self, dynamicsWorld);
	//matches the current sight position
	var sight_quat = new self.Ammo.btQuaternion(self.sight.quaternion.x,
			self.sight.quaternion.y,
			self.sight.quaternion.z,
			self.sight.quaternion.w);
	var trans = new self.Ammo.btTransform();
	trans.setIdentity();
	//trans.setOrigin(new self.Ammo.btVector3(self.position.x, self.position.y, self.position.z));
	trans.setRotation(sight_quat);
	var targetV3 = new self.Ammo.btVector3(0,0,-1);
	targetV3 = trans.op_mul(targetV3);
	self.sight.lines = AICRAFT.Ai.getSight(self.position.x,self.position.y,self.position.z, 
			targetV3.getX()+self.position.x,targetV3.getY()+self.position.y,targetV3.getZ()+self.position.z, 
			80, 60, 10, self.Ammo, true);
	
	//raycast
	for (var i=0; i < self.sight.lines.length; i=i+2) {
		var start = self.sight.lines[i];
		var end = self.sight.lines[i+1];
		var cb = new self.Ammo.ClosestRayResultCallback(start, end);
		dynamicsWorld.rayTest(start, end, cb);
		if (cb.hasHit()) {
			//console.log(cb.get_m_hitPointWorld());
			console.log(cb.get_m_collisionObject().getIslandTag());
		}
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
	AICRAFT.Ai.rotate(this, degree, cb, false, true, false, 40);
};

/** turns the body of the AI to the left
 * @param degree this can not be negative
 */
AICRAFT.Ai.prototype.turnLeft = function(degree, cb) {
	AICRAFT.Ai.rotate(this, degree, cb, true, true, false, 40);
};

/**
 * set position of current ai
 */
AICRAFT.Ai.prototype.setPos = function(AmmoIn,x,y,z,qx,qy,qz,qw,sqx,sqy,sqz,sqw,vx,vy,vz) {
	x = parseFloat(x);
	y = parseFloat(y);
	z = parseFloat(z);
	qx = parseFloat(qx);
	qy = parseFloat(qy);
	qz = parseFloat(qz);
	qw = parseFloat(qw);
	sqx = parseFloat(sqx);
	sqy = parseFloat(sqy);
	sqz = parseFloat(sqz);
	sqw = parseFloat(sqw);
	vx = parseFloat(vx);
	vy = parseFloat(vy);
	vz = parseFloat(vz);
	AICRAFT.GameObject.prototype.setPos.call(this,AmmoIn,x,y,z,qx,qy,qz,qw,vx,vy,vz);
	this.sight.quaternion.x = sqx;
	this.sight.quaternion.y = sqy;
	this.sight.quaternion.z = sqz;
	this.sight.quaternion.w = sqw;
	this.sightMesh.quaternion.x = this.sight.quaternion.x;
	this.sightMesh.quaternion.y = this.sight.quaternion.y;
	this.sightMesh.quaternion.z = this.sight.quaternion.z;
	this.sightMesh.quaternion.w = this.sight.quaternion.w;
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
	if (units < 1 || self.hp < 1 || self.codeUploading || self.moveLock === true) {
		if (cb !== undefined && self.codeUploading !== true) {
			cb();}
		console.log('quiting move');
		return false;
	}
	self.moveLock = true;
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
		self.moveLock = false;
		AICRAFT.Ai.move(self, units-1, cb, IsAhead, delay);
	}, delay);
};

//animation loader
AICRAFT.Ai.JSONloader = function(self, url, mesh, scene, THREE) {
	var loader = new THREE.JSONLoader();
	loader.load( url, function(geometry){
		var material = geometry.materials[ 0 ];
		material.morphTargets = true;
		material.color.setHex( 0xaaaaaa );
		material.ambient.setHex( 0x222222 );
		var faceMaterial = new THREE.MeshFaceMaterial();
		var morph = new THREE.MorphAnimMesh( geometry, faceMaterial );
		morph.duration = 1000;
		morph.time = 0; //stands for when I am at in the duration
		mesh = morph;
		mesh.castShadow = true;
		mesh.receiveShadow = true;
		mesh.position.x = self.position.x;
		mesh.position.y = self.position.y;
		mesh.position.z = self.position.z;
		mesh.useQuaternion = true;
		mesh.quaternion.set(self.quaternion.x, self.quaternion.y, self.quaternion.z, self.quaternion.w);
		mesh.scale.set(5, 5, 5);
		self.mesh = mesh;
		scene.add( mesh );
	}); 
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
	
	return resultAr;
};