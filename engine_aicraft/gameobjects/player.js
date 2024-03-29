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
	this.connecting = false;
	this.keycode = 0;
	this.codeUploading = false;
};

AICRAFT.Player.prototype = new AICRAFT.GameObject();
AICRAFT.Player.prototype.constructor = AICRAFT.Player;

//called by client
/*
AICRAFT.Player.prototype.buildMesh = function(THREE, scene, color) {
	this.mesh = new THREE.Mesh(
		new THREE.CubeGeometry(this.width,this.height,this.depth),
		new THREE.MeshLambertMaterial({color: color})	
	);
	this.mesh.castShadow = true;
	this.mesh.receiveShadow = true;
	this.mesh.position.x = this.position.x;
	this.mesh.position.y = this.position.y;
	this.mesh.position.z = this.position.z;
	this.mesh.useQuaternion = true;
	this.mesh.quaternion.set(this.quaternion.x, this.quaternion.y, this.quaternion.z, this.quaternion.w);
	scene.add(this.mesh);
};
*/

/**
 * This function got called by server and client
 */
AICRAFT.Player.prototype.updateInput = function(AmmoIn) {
	if (this.codeUploading === true) {
		return;}
	if (AmmoIn !== undefined) {
		Ammo = AmmoIn;};
	var self = this;
    self.IsMoving = false;
	var velocity = this.phybody.getLinearVelocity();
	var absVelocity = Math.sqrt(velocity.getX()*velocity.getX() + velocity.getY()*velocity.getY() + velocity.getZ()*velocity.getZ()); 
	if (AICRAFT.ClientEngine.key(this.keycode,"w") && absVelocity < this.maxSpeed && this.position.y < 1) {
        self.IsMoving = true;
		AICRAFT.Player.ahead(this, true);}
	if (AICRAFT.ClientEngine.key(this.keycode,"a") && absVelocity < this.maxSpeed && this.position.y < 1) {
        self.IsMoving = true;
		AICRAFT.Player.side(this, true);}
	if (AICRAFT.ClientEngine.key(this.keycode,"s") &&  absVelocity < this.maxSpeed && this.position.y < 1) {
        self.IsMoving = true;
		AICRAFT.Player.ahead(this, false);}
	if (AICRAFT.ClientEngine.key(this.keycode,"d") &&  absVelocity < this.maxSpeed && this.position.y < 1) {
        self.IsMoving = true;
		AICRAFT.Player.side(this, false);}
	if (AICRAFT.ClientEngine.key(this.keycode,"e") && this.position.y < 0.1) {
		this.rotate(2);}
	if (AICRAFT.ClientEngine.key(this.keycode,"q") && this.position.y < 0.1) {
		this.rotate(2, true);}
};

AICRAFT.Player.prototype.rotate = function(degree,IsInverted) {
	if (this.codeUploading === true) {
		return;}
	var self = this;
	if (IsInverted === undefined) {
		IsInverted = false;}
	var ori_quat = self.phybody.getOrientation();
	var quat = new self.Ammo.btQuaternion();
	if (IsInverted === true) {
		quat = AICRAFT.quatFromEuler(degree,0,0);
	} else {
		quat = AICRAFT.quatFromEuler(-1*degree,0,0);
	}
	var result_quat;
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
};

AICRAFT.Player.side = function(self, IsLeft) {
	var frontVector;
	if (IsLeft === true) {
		frontVector = new self.Ammo.btVector3(-1,0,0);
	} else {
		frontVector = new self.Ammo.btVector3(1,0,0);
	}
	AICRAFT.Player.move(self, frontVector);
};

AICRAFT.Player.ahead = function(self, IsAhead) {
	var frontVector;
	if (IsAhead === true) {
		frontVector = new self.Ammo.btVector3(0,0,-1);
	} else {
		frontVector = new self.Ammo.btVector3(0,0,1);
	}
	AICRAFT.Player.move(self, frontVector);
};

AICRAFT.Player.move = function(self, frontVector) {
	if (this.codeUploading === true) {
		return;}
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

