/** @fileoverview AICRAFT.Ai class
 */

/** @class physical part of an A.I.
 * init to be facing north
 * @extends AICRAFT.GameObject
 * @requires Ammo.js
 */
AICRAFT.Ai = function (x,y,z,qx,qy,qz,qw, AmmoIn) {
	AICRAFT.GameObject.call(this,x,y,z,qx,qy,qz,qw);
	if (AmmoIn !== undefined) {
		this.Ammo = AmmoIn;
	} else {
		this.Ammo = Ammo;
	}

	this.sight = new Object();
	this.sight.lines = new Array();
	this.sight.quaternion = new Object();
	this.sight.quaternion.x = 0;
	this.sight.quaternion.y = 0;
	this.sight.quaternion.z = 0;
	this.sight.quaternion.w = 1;
	this.sight.range = 80;
	this.sightMesh = undefined;
	this.maxSpeed = 10;
	this.acceleration = 28;
	this.codeUploading = false;
	this.moveLock = false;
	this.rotateLock = false;
	this.lookAtLock = false;
	this.raycastLock = false;
	this.weaponLock = false;
	this.weaponRange = 100;
	this.weaponDelay = 1000;
	this.hp = 100;
	this.name = undefined;
};

AICRAFT.Ai.prototype = new AICRAFT.GameObject();
AICRAFT.Ai.prototype.constructor = AICRAFT.Ai;

/**Overriding buildMesh method, called by client only
 */
AICRAFT.Ai.prototype.buildMesh = function(THREE, scene, color) {
	var self = this;
	
	//calls super method
	//AICRAFT.GameObject.prototype.buildMesh.call(this,THREE, scene);
	AICRAFT.Ai.JSONloader(self,"asset/rat_walk.js", scene, color, THREE, function(){
			self.mesh.visible = true;
	});

	//build sightMesh ray
	var sightMeshGeo = new THREE.Geometry();
	sightMeshGeo.vertices = AICRAFT.Ai.getSight(0,0,0, 0,0,-1, self.sight.range, 60, 10, this.Ammo, false);
	//var sightMeshMat = new THREE.LineBasicMaterial({color: 0x33ff33, lineWidth:1});
	var sightMeshMat = new THREE.LineBasicMaterial({color: color, lineWidth:1});
	this.sightMesh = new THREE.Line(sightMeshGeo, sightMeshMat);
	this.sightMesh.type = THREE.Lines;
	this.sightMesh.useQuaternion = true;
	this.sightMesh.position.x = this.position.x;
	this.sightMesh.position.y = this.position.y;
	this.sightMesh.position.z = this.position.z;
	this.sightMesh.quaternion.x = this.quaternion.x;
	this.sightMesh.quaternion.y = this.quaternion.y;
	this.sightMesh.quaternion.z = this.quaternion.z;
	this.sightMesh.quaternion.w = this.quaternion.w;
	scene.add(this.sightMesh);
};


//override physic and graphic update method
AICRAFT.Ai.prototype.physicAndGraphicUpdate = function(delta) {
	if (this.mesh === undefined) {
		return;}
	this.sightMesh.position.x = this.mesh.position.x = this.position.x;
	this.sightMesh.position.y = this.mesh.position.y = this.position.y;
	this.sightMesh.position.z = this.mesh.position.z = this.position.z;
	
	this.mesh.quaternion.x = this.quaternion.x;
	this.mesh.quaternion.y = this.quaternion.y;
	this.mesh.quaternion.z = this.quaternion.z;
	this.mesh.quaternion.w = this.quaternion.w;
	this.sightMesh.quaternion.x = this.sight.quaternion.x;
	this.sightMesh.quaternion.y = this.sight.quaternion.y;
	this.sightMesh.quaternion.z = this.sight.quaternion.z;
	this.sightMesh.quaternion.w = this.sight.quaternion.w;
	this.mesh.updateAnimation(1000*delta);
};

/**
 * set position of current ai
 */
AICRAFT.Ai.prototype.setPos = function(AmmoIn,x,y,z,qx,qy,qz,qw,sqx,sqy,sqz,sqw,vx,vy,vz) {
	x = parseFloat(x);
	y = parseFloat(y);
	z = parseFloat(z);
	qx = parseFloat(qx);
	qy = parseFloat(qy);
	qz = parseFloat(qz);
	qw = parseFloat(qw);
	sqx = parseFloat(sqx);
	sqy = parseFloat(sqy);
	sqz = parseFloat(sqz);
	sqw = parseFloat(sqw);
	vx = parseFloat(vx);
	vy = parseFloat(vy);
	vz = parseFloat(vz);
	AICRAFT.GameObject.prototype.setPos.call(this,AmmoIn,x,y,z,qx,qy,qz,qw,vx,vy,vz);
	this.sight.quaternion.x = sqx;
	this.sight.quaternion.y = sqy;
	this.sight.quaternion.z = sqz;
	this.sight.quaternion.w = sqw;
	this.sightMesh.quaternion.x = this.sight.quaternion.x;
	this.sightMesh.quaternion.y = this.sight.quaternion.y;
	this.sightMesh.quaternion.z = this.sight.quaternion.z;
	this.sightMesh.quaternion.w = this.sight.quaternion.w;
};

//animation loader
AICRAFT.Ai.JSONloader = function(self, url, scene, color, THREE, cb) {
	var loader = new THREE.JSONLoader();
	loader.load( url, function(geometry){
		var mesh;
		var material = geometry.materials[ 0 ];
		material.morphTargets = true;
		material.color.setHex( color );
		material.ambient.setHex( 0x222222 );
		var faceMaterial = new THREE.MeshFaceMaterial();
		var morph = new THREE.MorphAnimMesh( geometry, faceMaterial );
		morph.duration = 1000;
		morph.time = 0; //stands for when I am at in the duration
		mesh = morph;
		mesh.castShadow = true;
		mesh.receiveShadow = true;
		mesh.position.x = self.position.x;
		mesh.position.y = self.position.y;
		mesh.position.z = self.position.z;
		mesh.useQuaternion = true;
		mesh.quaternion.set(self.quaternion.x, self.quaternion.y, self.quaternion.z, self.quaternion.w);
		mesh.scale.set(5, 5, 5);
		self.mesh = mesh;
		scene.add( mesh );
		mesh.visible = false;
		if (cb !== undefined) {cb();}
	}); 
};

/** returns the array of sight lines
 * @param x position x
 * @param y position y
 * @param z position z
 * @param tx target position x
 * @param ty target position y
 * @param tz target position z
 * @param length length of the line
 * @param fov fov in degrees
 * @param degreePerLine determines the density of the lines
 * @param Ammo
 * @param IsAmmo If the return array are Ammo vertices or ThreeJS vertices
 */
AICRAFT.Ai.getSight = function(x,y,z, tx,ty,tz, length, fov, degreePerLine, Ammo, IsAmmo) {
	//console.log('==========');
	var resultAr = new Array();
	//make local coords
	tx -= x;
	ty -= y;
	tz -= z;
	
	//calculate first target vector from the left
	var frontV = new Ammo.btVector3(tx,ty,tz);
	var quatRot = AICRAFT.quatFromEuler(fov/2, 0, 0, Ammo);
	var transRot = new Ammo.btTransform();
	transRot.setRotation(quatRot);
	frontV = transRot.op_mul(frontV);
	frontV.normalize();
	frontV.op_mul(length);
	
	do {
		//console.log('x:'+frontV.getX(), 'y:'+frontV.getY(), 'z:'+frontV.getZ());
		resultAr.push(
				AICRAFT.v( x,y,z, IsAmmo),
				AICRAFT.v( frontV.getX()+x, frontV.getY()+y, frontV.getZ()+z, IsAmmo));
		quatRot = AICRAFT.quatFromEuler(-1*degreePerLine, 0, 0, Ammo);
		transRot.setRotation(quatRot);
		frontV = transRot.op_mul(frontV);
		frontV.normalize();
		frontV.op_mul(length);
		fov -= degreePerLine;
	} while (fov >= 0);
	
	Ammo.destroy(quatRot);
	Ammo.destroy(transRot);
	return resultAr;
};
