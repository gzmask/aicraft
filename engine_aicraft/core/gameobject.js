//x,y,z are positions and qx, qy, qz, qw are quaternion for rotations
AICRAFT.GameObject = function (x,y,z, qx, qy, qz, qw) {
	this.position = new Object();
	this.position.x = x; 
	this.position.y = y; 
	this.position.z = z; 
	this.quaternion = new Object();
	this.quaternion.x = qx || 0;
	this.quaternion.y = qy || 0;
	this.quaternion.z = qz || 0;
	this.quaternion.w !== undefined ? qw : 1 ;
	this.mesh = undefined;
	this.phybody = undefined;
	this.width = 8;
	this.height = 1;
	this.depth = 8;
	this.radius = 5;
	this.mass = 1;
};

AICRAFT.GameObject.prototype = {

	constructor: AICRAFT.GameObject,

	//called by client
	buildMesh: function(THREE) {
		this.mesh = new THREE.Mesh(
			new THREE.CubeGeometry(this.width,this.height,this.depth),
			new THREE.MeshLambertMaterial({color: 0xffffff})	
		);
		/*this.mesh = new THREE.Mesh(
			new THREE.CylinderGeometry(this.radius,this.radius,this.height),
			new THREE.MeshLambertMaterial({color: 0xffffff})	
		);*/
		/*this.mesh = new THREE.Mesh(
			new THREE.SphereGeometry(this.radius),
			new THREE.MeshLambertMaterial({color: 0xffffff})	
		);*/
		this.mesh.castShadow = true;
		this.mesh.receiveShadow = true;
		this.mesh.position.x = this.position.x;
		this.mesh.position.y = this.position.y;
		this.mesh.position.z = this.position.z;
		this.mesh.useQuaternion = true;
		this.mesh.quaternion.set(this.quaternion.x, this.quaternion.y, this.quaternion.z, this.quaternion.w);
	},	

	//called by client and server
	buildPhysic: function(Ammo) {
		var objShape = new Ammo.btBoxShape(new Ammo.btVector3(this.width/2,this.height/2,this.depth/2));
		//var objShape = new Ammo.btSphereShape(this.radius);
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
		this.phybody.setFriction(3);
	},

	//called by client
	physicAndGraphicUpdate: function(dynamicsWorld) {
		if (this.phybody.getMotionState()) {
			this.phybody.getMotionState().getWorldTransform(dynamicsWorld.trans);
			this.position.x = this.mesh.position.x = dynamicsWorld.trans.getOrigin().x().toFixed(2);
			this.position.y = this.mesh.position.y = dynamicsWorld.trans.getOrigin().y().toFixed(2);
			this.position.z = this.mesh.position.z = dynamicsWorld.trans.getOrigin().z().toFixed(2);
			this.quaternion.x = this.mesh.quaternion.x = dynamicsWorld.trans.getRotation().x();
			this.quaternion.y = this.mesh.quaternion.y = dynamicsWorld.trans.getRotation().y();
			this.quaternion.z = this.mesh.quaternion.z = dynamicsWorld.trans.getRotation().z();
			this.quaternion.w = this.mesh.quaternion.w = dynamicsWorld.trans.getRotation().w();
		}
	},

	//called by server
	physicUpdate: function(dynamicsWorld) {
		if (this.phybody.getMotionState()) {
			this.phybody.getMotionState().getWorldTransform(dynamicsWorld.trans);
			this.position.x = dynamicsWorld.trans.getOrigin().x().toFixed(2);
			this.position.y = dynamicsWorld.trans.getOrigin().y().toFixed(2);
			this.position.z = dynamicsWorld.trans.getOrigin().z().toFixed(2);
			this.quaternion.x = dynamicsWorld.trans.getRotation().x();
			this.quaternion.y = dynamicsWorld.trans.getRotation().y();
			this.quaternion.z = dynamicsWorld.trans.getRotation().z();
			this.quaternion.w = dynamicsWorld.trans.getRotation().w();
		}
	}
};
