AICRAFT.Ai = function (x,y,z,qx,qy,qz,qw, AmmoIn) {
	AICRAFT.GameObject.call(this,x,y,z,qx,qy,qz,qw);
	if (AmmoIn !== undefined) {
		this.Ammo = AmmoIn;
	} else {
		this.Ammo = Ammo;
	}

	this.sight = undefined;
	this.maxSpeed = 20;
	this.acceleration = 25;
	this.codeUploading = false;
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
		AICRAFT.v(0,0,0), 
		AICRAFT.v(-65,0,-200),
		AICRAFT.v(0,0,0), 
		AICRAFT.v(65,0,-200),
		AICRAFT.v(-65,0,-200),
		AICRAFT.v(65,0,-200));
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
AICRAFT.Ai.prototype.ahead = function(units) {
	var self = this;
	if (units < 1 || 
		self.hp < 1 ||
		self.codeUploading) {
		return false;}
	var velocity = self.phybody.getLinearVelocity();
	var absVelocity = Math.sqrt(velocity.getX()*velocity.getX() + velocity.getY()*velocity.getY() + velocity.getZ()*velocity.getZ()); 

	self.phybody.activate();
	//var quat = new Ammo.btQuaternion( self.quaternion.x, self.quaternion.y, self.quaternion.z, self.quaternion.w);
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

	if (absVelocity < self.maxSpeed) {
		self.phybody.applyCentralImpulse(frontVector);};

	setTimeout( function(){
		self.ahead(units-1);
	}, 500);

};
