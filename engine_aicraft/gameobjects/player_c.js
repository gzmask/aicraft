/** @fileoverview AICRAFT.Player class
 */

/** @class Player class controls the player models, physic collision bodies and user inputs
 * init to be facing north
 * @extends AICRAFT.GameObject
 * @requires Ammo.js
 */
AICRAFT.Player = function (x,y,z,qx,qy,qz,qw, AmmoIn) {
	AICRAFT.GameObject.call(this,x,y,z,qx,qy,qz,qw);
	if (AmmoIn !== undefined) {
		this.Ammo = AmmoIn;
	} else {
		this.Ammo = Ammo;
	}
	this.maxSpeed = 20;
	this.acceleration = 4;
	this.connected = false;
	this.keycode = 0;
	this.codeUploading = false;
	this.mesh_w = undefined;
	this.mesh_t = undefined;
};

AICRAFT.Player.prototype = new AICRAFT.GameObject();
AICRAFT.Player.prototype.constructor = AICRAFT.Player;

//called by client
AICRAFT.Player.prototype.buildMesh = function(THREE, scene, color) {
	var self = this;
	
	//calls super method
	//AICRAFT.GameObject.prototype.buildMesh.call(this,THREE, scene);
	self.mesh = AICRAFT.Player.JSONloader(self,"asset/rat_turn.js", self.mesh_t, scene, color, THREE, false, function(){
		self.mesh_t = self.mesh;
		console.log("turn:"+self.mesh_t);
	});
	self.mesh = AICRAFT.Player.JSONloader(self,"asset/rat_walk.js", self.mesh_w, scene, color, THREE, true, function(){
		self.mesh_w = self.mesh;
		console.log("walk:"+self.mesh_w);
	});

};

AICRAFT.Player.prototype.physicAndGraphicUpdate = function(delta) {
	if (this.mesh === undefined) {
		return;}
	//get deltaPos
	this.applyAnimation(this.mesh_t, this.mesh_w);

	this.mesh.position.x = this.position.x;
	this.mesh.position.y = this.position.y;
	this.mesh.position.z = this.position.z;
	
	this.mesh.quaternion.x = this.quaternion.x;
	this.mesh.quaternion.y = this.quaternion.y;
	this.mesh.quaternion.z = this.quaternion.z;
	this.mesh.quaternion.w = this.quaternion.w;
	this.mesh.updateAnimation(1000*delta);
};

AICRAFT.Player.prototype.applyAnimation = function(mesh_t, mesh_w){
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

AICRAFT.Player.prototype.handleKeyDown = function(event, self) {
	if (String.fromCharCode(event.keyCode) == "W") {
		self.keycode = self.keycode | 8;
	} else if (String.fromCharCode(event.keyCode) == "A") {
		self.keycode = self.keycode | 4;
	} else if (String.fromCharCode(event.keyCode) == "S") {
		self.keycode = self.keycode | 2;
	} else if (String.fromCharCode(event.keyCode) == "D") {
		self.keycode = self.keycode | 1;
	} else if (String.fromCharCode(event.keyCode) == "E") {
		self.keycode = self.keycode | 16;
	} else if (String.fromCharCode(event.keyCode) == "Q") {
		self.keycode = self.keycode | 32;
	} else if (event.keyCode == 18/*control key*/) {
		self.keycode = self.keycode | 64;
	};
};

AICRAFT.Player.prototype.handleKeyUp = function(event, self) {
	if (String.fromCharCode(event.keyCode) == "W") {
		self.keycode = self.keycode ^ 8;
	} else if (String.fromCharCode(event.keyCode) == "A") {
		self.keycode = self.keycode ^ 4;
	} else if (String.fromCharCode(event.keyCode) == "S") {
		self.keycode = self.keycode ^ 2;
	} else if (String.fromCharCode(event.keyCode) == "D") {
		self.keycode = self.keycode ^ 1;
	} else if (String.fromCharCode(event.keyCode) == "E") {
		self.keycode = self.keycode ^ 16;
	} else if (String.fromCharCode(event.keyCode) == "Q") {
		self.keycode = self.keycode ^ 32;
	} else if (event.keyCode == 18/*alt key*/) {
		self.keycode = self.keycode ^ 64;
	};
};

AICRAFT.Player.prototype.updateInput = function(codeEmitter) {
	if (AICRAFT.ClientEngine.key(this.keycode,"code")) {
			codeEmitter.fire();}
};

AICRAFT.Player.JSONloader = function(self, url, mesh, scene, color, THREE, visible, cb) {
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

