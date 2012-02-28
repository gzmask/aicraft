AICRAFT.Ai = function (x,y,z,qx,qy,qz,qw) {
	this.maxSpeed = 20;
	this.acceleration = 18;
	AICRAFT.GameObject.call(this,x,y,z,qx,qy,qz,qw);
};

AICRAFT.Ai.prototype = new AICRAFT.GameObject();
AICRAFT.Ai.prototype.constructor = AICRAFT.Ai;

AICRAFT.Ai.prototype.ahead = function(units, Ammo) {
	var self = this;
	var velocity = self.phybody.getLinearVelocity();
	var absVelocity = Math.sqrt(velocity.getX()*velocity.getX() + velocity.getY()*velocity.getY() + velocity.getZ()*velocity.getZ()); 

	self.phybody.activate();
	//var quat = new Ammo.btQuaternion( self.quaternion.x, self.quaternion.y, self.quaternion.z, self.quaternion.w);
	var quat = self.phybody.getOrientation();

	var transform = new Ammo.btTransform();
	transform.setIdentity();
	transform.setRotation(quat);

	var frontVector = new Ammo.btVector3(0,0,-1);
	frontVector = transform.op_mul(frontVector);

	for (var i=0; i<self.acceleration; i++) {
		frontVector.setX(frontVector.getX()*1.1);
		frontVector.setY(frontVector.getY()*1.1);
		frontVector.setZ(frontVector.getZ()*1.1);
	};

	if (absVelocity < self.maxSpeed) {
		self.phybody.applyCentralImpulse(frontVector);};

	setTimeout( function(){
		self.ahead(units-1, Ammo);
	}, 400);

};
