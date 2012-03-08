AICRAFT.CameraControl = function(camera, gameObj, domElement) {
	this.camera	= camera;
	this.camera.useQuaternion = true;
	this.camera.lookAt(new THREE.Vector3(0,0,-1));
	this.domElement	= domElement || document;
	this.gameObj	= gameObj;
	this.target	= new THREE.Vector3(0, 0, 0);
	this.mouseX = 0;
	this.prevMouseX = 0;
	this.deltaX = 0;
	this.mouseY = 0;
	this.prevMouseY = 0;
	this.deltaY = 0;
	this.mouseDragOn = false;
	this.speed = 100;
	if ( this.domElement === document ) {
		this.viewHalfX = window.innerWidth / 2;
		this.viewHalfY = window.innerHeight / 2;
	} else {
		this.viewHalfX = this.domElement.offsetWidth / 2;
		this.viewHalfY = this.domElement.offsetHeight / 2;
		this.domElement.setAttribute( 'tabindex', -1 );}
	this.domElement.addEventListener( 'mousemove', AICRAFT.bind( this, this.onMouseMove ), false );
	this.domElement.addEventListener( 'mousedown', AICRAFT.bind( this, this.onMouseDown ), false );
	this.domElement.addEventListener( 'mouseup', AICRAFT.bind( this, this.onMouseUp ), false );
};

AICRAFT.CameraControl.prototype.constructor = AICRAFT.CameraControl;

AICRAFT.CameraControl.prototype.update = function() {
	this.camera.position.x = this.gameObj.position.x;
	this.camera.position.y = this.gameObj.position.y;
	this.camera.position.z = this.gameObj.position.z;
	var tailVector = this.tailVector();
	this.camera.position.x += tailVector.x;
	this.camera.position.y += tailVector.y;
	this.camera.position.z += tailVector.z;
	this.camera.position.y += 10;
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
	//flip Y axis
	this.mouseY = this.mouseY*-1;
	//convert to percentage
	this.mouseX = this.mouseX / this.viewHalfX;
	this.mouseY = this.mouseY / this.viewHalfY;
	this.deltaX = this.mouseX - this.prevMouseX;
	this.deltaY = this.mouseY - this.prevMouseY;

	//insert code to mouse look
	/*
	if (this.mouseDragOn === true) {
		this.gameObj.rotate(deltaX*this.speed, true);}
		*/


	this.prevMouseX = this.mouseX;
	this.prevMouseY = this.mouseY;
};

AICRAFT.CameraControl.prototype.onMouseDown = function(event) {
	if ( this.domElement !== document ) {
		this.domElement.focus();
	}
	event.preventDefault();
	event.stopPropagation();
	this.mouseDragOn = true;
};

AICRAFT.CameraControl.prototype.onMouseUp = function(event) {
		event.preventDefault();
		event.stopPropagation();
		this.mouseDragOn = false;
};

AICRAFT.CameraControl.prototype.pitch = function(degree, IsUp) {
};

AICRAFT.CameraControl.prototype.tailVector = function() {
	return AICRAFT.CameraControl.setVector(this, 20, false);
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

