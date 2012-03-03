AICRAFT.CameraControl = function(camera, gameObj, domElement) {
	this.camera	= camera;
	this.camera.useQuaternion = true;
	this.camera.lookAt(new THREE.Vector3(0,0,-1));
	this.domElement	= domElement || document;
	this.gameObj	= gameObj;
	this.target	= new THREE.Vector3(0, 0, 0);
};

AICRAFT.CameraControl.prototype.constructor = AICRAFT.CameraControl;

AICRAFT.CameraControl.prototype.update = function() {
	this.camera.position.x = this.gameObj.position.x;
	this.camera.position.y = this.gameObj.position.y;
	this.camera.position.z = this.gameObj.position.z;
	this.camera.quaternion.x = this.gameObj.quaternion.x;
	this.camera.quaternion.y = this.gameObj.quaternion.y;
	this.camera.quaternion.z = this.gameObj.quaternion.z;
	this.camera.quaternion.w = this.gameObj.quaternion.w;
	/*
	var obj_quat = new THREE.Quaternion(this.gameObj.quaternion.x,
			this.gameObj.quaternion.y,
			this.gameObj.quaternion.z,
			this.gameObj.quaternion.w);
	var trans = new THREE.Matrix4();
	trans.identity();
	trans.setTranslation(this.camera.position.x,
			this.camera.position.y,
			this.camera.position.z);
	trans.setRotationFromQuaternion(obj_quat);
	this.camera.rotation.setRotationFromMatrix(trans);
	*/
};
