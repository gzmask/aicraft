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
};

AICRAFT.Player.prototype = new AICRAFT.GameObject();
AICRAFT.Player.prototype.constructor = AICRAFT.Player;

//called by client
/*
AICRAFT.Player.prototype.buildMesh = function(THREE, scene, color) {
	this.mesh = new THREE.Mesh(
		new THREE.CubeGeometry(this.width,this.height,this.depth),
		new THREE.MeshLambertMaterial({color: color})	
	);
	this.mesh.castShadow = true;
	this.mesh.receiveShadow = true;
	this.mesh.position.x = this.position.x;
	this.mesh.position.y = this.position.y;
	this.mesh.position.z = this.position.z;
	this.mesh.useQuaternion = true;
	this.mesh.quaternion.set(this.quaternion.x, this.quaternion.y, this.quaternion.z, this.quaternion.w);
	scene.add(this.mesh);
};
*/


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
	} else if (event.keyCode == 17/*control key*/) {
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
	} else if (event.keyCode == 17/*control key*/) {
		self.keycode = self.keycode ^ 64;
	};
};

AICRAFT.Player.prototype.updateInput = function(codeEmitter) {
	if (AICRAFT.ClientEngine.key(this.keycode,"ctl")) {
			codeEmitter.fire();}
};
