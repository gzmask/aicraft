AICRAFT.CameraControl = function(camera, gameObj, domElement) {
	this.camera	= camera;
	this.camera.useQuaternion = true;
	this.camera.lookAt(new THREE.Vector3(0,0,-1));
	this.domElement	= domElement || document;
	this.gameObj	= gameObj;
	this.target	= new THREE.Vector3(0, 0, 0);
	this.mouseX = 0;
	this.mouseY = 0;
	if ( this.domElement === document ) {
		this.viewHalfX = window.innerWidth / 2;
		this.viewHalfY = window.innerHeight / 2;
	} else {
		this.viewHalfX = this.domElement.offsetWidth / 2;
		this.viewHalfY = this.domElement.offsetHeight / 2;
		this.domElement.setAttribute( 'tabindex', -1 );
	}

	this.domElement.addEventListener( 'mousemove', AICRAFT.bind( this, this.onMouseMove ), false );
};

AICRAFT.CameraControl.prototype.constructor = AICRAFT.CameraControl;

AICRAFT.CameraControl.prototype.update = function() {
	this.camera.position.x = this.gameObj.position.x;
	this.camera.position.y = this.gameObj.position.y;
	this.camera.position.y += 5;
	this.camera.position.z = this.gameObj.position.z;
	this.camera.quaternion.x = this.gameObj.quaternion.x;
	this.camera.quaternion.y = this.gameObj.quaternion.y;
	this.camera.quaternion.z = this.gameObj.quaternion.z;
	this.camera.quaternion.w = this.gameObj.quaternion.w;
};

AICRAFT.CameraControl.prototype.onMouseMove = function(event) {
	if ( this.domElement === document ) {
		this.mouseX = event.pageX - this.viewHalfX;
		this.mouseY = event.pageY - this.viewHalfY;
	} else {
		this.mouseX = event.pageX - this.domElement.offsetLeft - this.viewHalfX;
		this.mouseY = event.pageY - this.domElement.offsetTop - this.viewHalfY;
	}
	this.mouseY = this.mouseY*-1;
	//convert to percentage
	this.mouseX = this.mouseX / this.viewHalfX;
	this.mouseY = this.mouseY / this.viewHalfY;
};

AICRAFT.CameraControl.prototype.tailVector = function() {
	return AICRAFT.CameraControl.setVector(this, 10, false);
};

AICRAFT.CameraControl.prototype.frontVector = function() {
	return AICRAFT.CameraControl.setVector(this, 1, true);
};

AICRAFT.CameraControl.setVector = function(self, distance, IsFront) {
	if (IsFront === true) { var k = -1; } else { var k = 1;}
	var vector = new Ammo.btVector3(0,0,k);
	var quat = self.gameObj.phybody.getOrientation();
	var transform = new Ammo.btTransform();
	transform.setIdentity();
	transform.setRotation(quat);
	vector = transform.op_mul(vector);
	return new THREE.Vector3(vector.getX()*distance,
			vector.getY()*distance,
			vector.getZ()*distance);
};


