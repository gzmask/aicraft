/** @fileoverview  GameOject class
 */

/**
 * @class GameObjects in the scenes
 * @constructor x,y,z are positions and qx, qy, qz, qw are quaternion for rotations
 */
AICRAFT.GameObject = function (x,y,z, qx, qy, qz, qw) {
	this.position = new Object();
	this.position.x = parseFloat(x); 
	this.position.y = parseFloat(y); 
	this.position.z = parseFloat(z); 
	this.quaternion = new Object();
	this.quaternion.x = qx || 0;
	this.quaternion.y = qy || 0;
	this.quaternion.z = qz || 0;
	if (qw === undefined) {
		this.quaternion.w = 1 ;
	} else {
		this.quaternion.w = qw;
	}
	this.quaternion.x = parseFloat(this.quaternion.x);
	this.quaternion.y = parseFloat(this.quaternion.y);
	this.quaternion.z = parseFloat(this.quaternion.z);
	this.quaternion.w = parseFloat(this.quaternion.w);
	this.mesh = undefined;
	this.width = 8;
	this.height = 8;
	this.depth = 8;
	this.radius = 5;
	this.mass = 1;
	this.friction = 3;
	this.angularFactor = 0;
	this.hp = 100;
	this.IsClient = false;
	this.IsMoving = false;
};

AICRAFT.GameObject.prototype = {

	constructor: AICRAFT.GameObject,

	//called by client
	buildMesh: function(THREE, scene, color) {
		/*
		this.mesh = new THREE.Mesh(
			new THREE.CubeGeometry(this.width,this.height,this.depth),
			new THREE.MeshLambertMaterial({color: 0xffffff})	
		);
		*/
		/*
		this.mesh = new THREE.Mesh(
			new THREE.CylinderGeometry(this.radius,this.radius,this.height),
			new THREE.MeshLambertMaterial({color: 0xffffff})	
		);
		*/
		this.mesh = new THREE.Mesh(
			new THREE.SphereGeometry(this.radius),
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
	},	

	//sets the physic states of this object
	setPos: function(AmmoIn,x,y,z,qx,qy,qz,qw,vx,vy,vz) {
		x = parseFloat(x);
		y = parseFloat(y);
		z = parseFloat(z);
		qx = parseFloat(qx);
		qy = parseFloat(qy);
		qz = parseFloat(qz);
		qw = parseFloat(qw);
		vx = parseFloat(vx);
		vy = parseFloat(vy);
		vz = parseFloat(vz);
		if (AmmoIn !== undefined) {
			Ammo = AmmoIn;
		};
		var objTransform = new Ammo.btTransform();	
		objTransform.setIdentity();
		objTransform.setOrigin(new Ammo.btVector3(x, y, z));
		objTransform.setRotation(new Ammo.btQuaternion(qx, qy, qz, qw));
		this.position.x = x;
		this.position.y = y;
		this.position.z = z;
		this.quaternion.x = qx;
		this.quaternion.y = qy;
		this.quaternion.z = qz;
		this.quaternion.w = qw;
	},

	//called by client
	physicAndGraphicUpdate: function() {
		this.mesh.position.x = this.position.x;
		this.mesh.position.y = this.position.y;
		this.mesh.position.z = this.position.z;
		this.mesh.quaternion.x = this.quaternion.x;
		this.mesh.quaternion.y = this.quaternion.y;
		this.mesh.quaternion.z = this.quaternion.z;
		this.mesh.quaternion.w = this.quaternion.w;
	}

};
