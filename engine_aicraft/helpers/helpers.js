/** @fileoverview helper functions for computing vectors/quaternions/rotations etc.
 */

AICRAFT.v = function(x,y,z) {
	return new THREE.Vertex(new THREE.Vector3(x,y,z));
};

AICRAFT.bv = function(x,y,z) {
	return new Ammo.btVector3(x,y,z);
};

AICRAFT.quatMul=function(q1,q2){
	var q3 = new Ammo.btQuaternion(
		q1.getW()*q2.getX() + q1.getX()*q2.getW() + q1.getY()*q2.getZ() - q1.getZ()*q2.getY(),
		q1.getW()*q2.getY() + q1.getY()*q2.getW() + q1.getZ()*q2.getX() - q1.getX()*q2.getZ(),	
		q1.getW()*q2.getZ() + q1.getZ()*q2.getW() + q1.getX()*q2.getY() - q1.getY()*q2.getX(),	
		q1.getW()*q2.getW() - q1.getX()*q2.getX() - q1.getY()*q2.getY() - q1.getZ()*q2.getZ());
	return q3;
};

AICRAFT.quatFromEuler = function (pitch, yaw, roll, AmmoIn){
	if (AmmoIn !== undefined) {
		this.Ammo = AmmoIn;
	} else {
		this.Ammo = Ammo;
	}
	// Basically we create 3 Quaternions, one for pitch, one for yaw, one for roll
	// and multiply those together.
	// the calculation below does the same, just shorter
 
	var p = pitch * Math.PI/360;
	var y = yaw * Math.PI/360;
	var r = roll * Math.PI/360;
 
	var sinp = Math.sin(p);
	var siny = Math.sin(y);
	var sinr = Math.sin(r);
	var cosp = Math.cos(p);
	var cosy = Math.cos(y);
	var cosr = Math.cos(r);
 
	var quat = new this.Ammo.btQuaternion(
		sinr * cosp * cosy - cosr * sinp * siny,
		cosr * sinp * cosy + sinr * cosp * siny,
		cosr * cosp * siny - sinr * sinp * cosy,
		cosr * cosp * cosy + sinr * sinp * siny);
 
	return quat.normalize();
};

/**
 * binds a 'this' to a function
 * @param scope this
 * @param fn function
 */
AICRAFT.bind = function( scope, fn ) {
	return function () {
		fn.apply( scope, arguments );
	};
};

