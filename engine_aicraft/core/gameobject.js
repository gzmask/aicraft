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
	this.phybody = undefined;
	this.width = 8;
	this.height = 8;
	this.depth = 8;
	this.radius = 5;
	this.mass = 1;
	this.friction = 3;
	this.angularFactor = 0;
	this.IsClient = false;
	this.dynamicsWorld = undefined;
	this.IsMoving = false;
};

AICRAFT.GameObject.prototype = {

	constructor: AICRAFT.GameObject,

	//called by client and server
	buildPhysic: function(AmmoIn, dynamicsWorld) {
		if (AmmoIn !== undefined) {
			Ammo = AmmoIn;
		};
		//var objShape = new Ammo.btBoxShape(new Ammo.btVector3(this.width/2,this.height/2,this.depth/2));
		var objShape = new Ammo.btSphereShape(this.radius);
		//var objShape = new Ammo.btCylinderShape(new Ammo.btVector3(this.radius,this.height/2,this.radius));
		var objTransform = new Ammo.btTransform();	
		objTransform.setIdentity();
		objTransform.setOrigin(new Ammo.btVector3(this.position.x,
			this.position.y,
			this.position.z));
		objTransform.setRotation(new Ammo.btQuaternion(this.quaternion.x, this.quaternion.y, this.quaternion.z, this.quaternion.w));
		var isDynamic = (this.mass != 0);
		var localInertia = new Ammo.btVector3(0,0,0);
		if (isDynamic) {
			objShape.calculateLocalInertia(this.mass,localInertia);}
		var myMotionState = new Ammo.btDefaultMotionState(objTransform);
		var rbInfo = new Ammo.btRigidBodyConstructionInfo(this.mass, myMotionState, objShape, localInertia);
		this.phybody = new Ammo.btRigidBody(rbInfo);
		this.phybody.setFriction(this.friction);
		this.phybody.setAngularFactor(this.angularFactor);
		this.dynamicsWorld = dynamicsWorld;
		this.dynamicsWorld.addRigidBody(this.phybody);
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
		this.phybody.activate();
		this.phybody.getMotionState().setWorldTransform(objTransform);
		this.phybody.setCenterOfMassTransform(objTransform);
		this.phybody.setAngularVelocity(new Ammo.btVector3(vx,vy,vz));
	},

	//called by server
	physicUpdate: function() {
		if (this.phybody.getMotionState()) {
			this.phybody.getMotionState().getWorldTransform(this.dynamicsWorld.trans);
			this.position.x = parseFloat(this.dynamicsWorld.trans.getOrigin().x().toFixed(2));
			this.position.y = parseFloat(this.dynamicsWorld.trans.getOrigin().y().toFixed(2));
			this.position.z = parseFloat(this.dynamicsWorld.trans.getOrigin().z().toFixed(2));
			this.quaternion.x = parseFloat(this.dynamicsWorld.trans.getRotation().x());
			this.quaternion.y = parseFloat(this.dynamicsWorld.trans.getRotation().y());
			this.quaternion.z = parseFloat(this.dynamicsWorld.trans.getRotation().z());
			this.quaternion.w = parseFloat(this.dynamicsWorld.trans.getRotation().w());
		}
	}
};
