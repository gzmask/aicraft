AICRAFT.GameObject = function () {
	this.position = undefined; 
	this.quaternion = undefined;
	this.mesh = undefined;
	this.phybody = undefined;
	this.width = 8;
	this.height = 1;
	this.depth = 8;
	this.mass = 1;
};

AICRAFT.GameObject.prototype = {

	constructor: AICRAFT.GameObject,

	buildMesh: function() {
		this.mesh = new THREE.Mesh(
			new THREE.CubeGeometry(this.width,this.height,this.depth),
			new THREE.MeshLambertMaterial({color: 0xffffff})	
		);
		this.mesh.castShadow = true;
		this.mesh.receiveShadow = true;
		this.position = this.mesh.position;
		this.mesh.useQuaternion = true;
		this.quaternion = this.mesh.quaternion;
	},	

	buildPhysic: function() {
		var objShape = new Ammo.btBoxShape(new Ammo.btVector3(this.width/2,this.height/2,this.depth/2));
		//var objShape = new Ammo.btSphereShape(this.width/2);
		var objTransform = new Ammo.btTransform();	
		objTransform.setIdentity();
		objTransform.setOrigin(new Ammo.btVector3(this.position.x,
			this.position.y,
			this.position.z));
		objTransform.setRotation(new Ammo.btQuaternion(
			this.quaternion.x,
			this.quaternion.y,
			this.quaternion.z,
			this.quaternion.w
		));
		var isDynamic = (this.mass != 0);
		var localInertia = new Ammo.btVector3(0,0,0);
		if (isDynamic) {
			objShape.calculateLocalInertia(this.mass,localInertia);}
		var myMotionState = new Ammo.btDefaultMotionState(objTransform);
		var rbInfo = new Ammo.btRigidBodyConstructionInfo(this.mass, myMotionState, objShape, localInertia);
		this.phybody = new Ammo.btRigidBody(rbInfo);
	},

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
	},

};
