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
	this.name = undefined;
	this.mesh_w = undefined;
	this.mesh_t = undefined;
};

AICRAFT.Ai.prototype = new AICRAFT.GameObject();
AICRAFT.Ai.prototype.constructor = AICRAFT.Ai;

/**Overriding buildMesh method, called by client only
 */
AICRAFT.Ai.prototype.buildMesh = function(THREE, scene, color) {
	var self = this;
	
	self.mesh = AICRAFT.Ai.JSONloader(self,"asset/rat_turn.js", self.mesh_t, scene, color, THREE, false, function(){
		self.mesh_t = self.mesh;
		//console.log("turn:"+self.mesh_t);
	});
	self.mesh = AICRAFT.Ai.JSONloader(self,"asset/rat_walk.js", self.mesh_w, scene, color, THREE, true, function(){
		self.mesh_w = self.mesh;
		//console.log("walk:"+self.mesh_w);
        //calls super method
        AICRAFT.GameObject.prototype.buildMesh.call(self,THREE, scene, color);
	});

	//build sightMesh ray
	var sightMeshGeo = new THREE.Geometry();
	sightMeshGeo.vertices = AICRAFT.Ai.getSight(0,0,0, 0,0,-1, self.sight.range, 60, 10, self.Ammo, false);
	//var sightMeshMat = new THREE.LineBasicMaterial({color: 0x33ff33, lineWidth:1});
	var sightMeshMat = new THREE.LineBasicMaterial({color: color, lineWidth:1});
	self.sightMesh = new THREE.Line(sightMeshGeo, sightMeshMat);
	self.sightMesh.type = THREE.Lines;
	self.sightMesh.useQuaternion = true;
	self.sightMesh.position.x = self.position.x;
	self.sightMesh.position.y = self.position.y;
	self.sightMesh.position.z = self.position.z;
	self.sightMesh.quaternion.x = self.quaternion.x;
	self.sightMesh.quaternion.y = self.quaternion.y;
	self.sightMesh.quaternion.z = self.quaternion.z;
	self.sightMesh.quaternion.w = self.quaternion.w;
	//scene.add(self.sightMesh);

};


//override physic and graphic update method
AICRAFT.Ai.prototype.physicAndGraphicUpdate = function(delta) {
	if (this.mesh === undefined) {
		return;}
    if (this.hp < 1) {
        return;}
	//get deltaPos
	this.applyAnimation(this.mesh_t, this.mesh_w);

	this.sightMesh.position.x  = this.position.x;
	this.sightMesh.position.y  = this.position.y;
	this.sightMesh.position.z  = this.position.z;
	
    AICRAFT.GameObject.prototype.physicAndGraphicUpdate.call(this);
	this.sightMesh.quaternion.x = this.sight.quaternion.x;
	this.sightMesh.quaternion.y = this.sight.quaternion.y;
	this.sightMesh.quaternion.z = this.sight.quaternion.z;
	this.sightMesh.quaternion.w = this.sight.quaternion.w;
	this.mesh.updateAnimation(1000*delta);
};

AICRAFT.Ai.prototype.applyAnimation = function(mesh_t, mesh_w){
	var self = this;
	if (self.IsMoving === true) {
		//apply walking
		mesh_t.visible = false;
		mesh_w.visible = true;
		this.mesh = mesh_w;
	} else {
		//apply turnning
		mesh_t.visible = true;
		mesh_w.visible = false;
		this.mesh = mesh_t;
	}
};

/**
 * how much model has moved since last frame
 */
AICRAFT.Ai.prototype.deltaPos = function(px,x,pz,z){
	var d = Math.abs(px - x) +
		Math.abs(pz - z);
	return d;
};

/**
 * set position of current ai
 */
AICRAFT.Ai.prototype.setPos = function(AmmoIn,x,y,z,qx,qy,qz,qw,sqx,sqy,sqz,sqw,vx,vy,vz,im,hp) {
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
	AICRAFT.GameObject.prototype.setPos.call(this,AmmoIn,x,y,z,qx,qy,qz,qw,vx,vy,vz,im,hp);
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
AICRAFT.Ai.JSONloader = function(self, url, mesh, scene, color, THREE, visible, cb) {
	var loader = new THREE.JSONLoader();
	loader.load( url, function(geometry){
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
		mesh.visible = visible;
		if (cb !== undefined) {cb();}
		return mesh;
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
