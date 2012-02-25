//server engine runs on node.js 
AICRAFT.Engine = function () {
	//global vars
	this.dynamicsWorld = undefined;
	this.totalPlayers = 2;
	this.players = new Array();
	this.ais = new Array();
	//this.io = undefined;
	

};

//object methods
AICRAFT.Engine.prototype = {

	constructor: AICRAFT.Engine,

	init: function(expressApp, Ammo) {

		var self = this;

		//start physics
		var collisionConfiguration = new Ammo.btDefaultCollisionConfiguration();
		var dispatcher = new Ammo.btCollisionDispatcher(collisionConfiguration);
		var overlappingPairCache = new Ammo.btDbvtBroadphase();
		var solver = new Ammo.btSequentialImpulseConstraintSolver();
		this.dynamicsWorld = new Ammo.btDiscreteDynamicsWorld(dispatcher, overlappingPairCache, solver, collisionConfiguration);
		this.dynamicsWorld.setGravity(new Ammo.btVector3(0,-9.82,0));
		this.dynamicsWorld.trans = new Ammo.btTransform();
		this.dynamicsWorld.trans.setIdentity();
		
		//ground construction
		var groundShape = new Ammo.btBoxShape(new Ammo.btVector3(400, 0.5, 400));
		var groundTransform = new Ammo.btTransform();
		groundTransform.setIdentity();
		groundTransform.setOrigin(new Ammo.btVector3(0,-5.5,0));
		var mass = 0;
		var isDynamic = (mass != 0);
		var localInertia = new Ammo.btVector3(0, 0, 0);

		if (isDynamic) {
			groundShape.calculateLocalInertia(mass, localInertia);}
		var myMotionState = new Ammo.btDefaultMotionState(groundTransform);
		var rbInfo = new Ammo.btRigidBodyConstructionInfo(mass, myMotionState, groundShape, localInertia);
		var ground_phybody = new Ammo.btRigidBody(rbInfo);
		this.dynamicsWorld.addRigidBody(ground_phybody);
		
		//init game characters
		var quat = new Ammo.btQuaternion();
		(function() { 
			for (var i=0; i< self.totalPlayers; i++) {
			//construct player
			quat.setEuler(0,20,-30);
			self.players[i] = new AICRAFT.Player( -200 + Math.floor(Math.random()*401), 
				25, 
				-200 + Math.floor(Math.random()*301), 
				quat.getX(),quat.getY(),quat.getZ(),quat.getW());
			self.players[i].buildPhysic(Ammo);
			self.dynamicsWorld.addRigidBody(self.players[i].phybody);
			
			//construct ai
			quat.setEuler(0,20,30);
			self.ais[i] = new AICRAFT.Ai(self.players[i].position.x,
				5,
				self.players[i].position.z - 5,
				quat.getX(),quat.getY(),quat.getZ(),quat.getW());
			self.ais[i].buildPhysic(Ammo);
			self.dynamicsWorld.addRigidBody(self.ais[i].phybody);
		}})();

	},

	//network
	networkInit: function(socket) {
		var self = this;
		//tell client total players
		socket.emit('totalPlayers', this.totalPlayers);
		//tell client connected players
		socket.emit('connect', AICRAFT.Engine.getNextAvailablePnum(this.players));
		socket.on('connected', function(data) {
			if (data) {
				self.players[AICRAFT.Engine.getNextAvailablePnum(self.players)].connected = true;
				console.log("Conected players:"+AICRAFT.Engine.getNextAvailablePnum(self.players));
			}
		});
		//tell client player states
		socket.emit('pi', AICRAFT.Engine.encryptedPacket(this.players));
		//tell client ai states
		socket.emit('ai', AICRAFT.Engine.encryptedPacket(this.ais));
	},

	syncPos: function(socket) {
		var self = this;
		AICRAFT.requestNetworkFrame(function(){self.syncPos(socket)});
		//broadcast a compressed packet to all clients every frame
		socket.emit('p', AICRAFT.Engine.encryptedPacket(self.players));
		socket.emit('a', AICRAFT.Engine.encryptedPacket(self.ais));
	},

	syncKey: function(socket) {
		var self = this;
		for (var i = 0; i < self.totalPlayers; i++) {
			var j = i;
			socket.on('k'+j, function(data) {
				self.players[j].keycode = data;
			});
		};
	},

	animate: function() {
		var self = this; //closure var, without the assignment, 'this' is animate() next call
		AICRAFT.requestAnimationFrame(function(){self.animate();});
		self.dynamicsWorld.stepSimulation(1/30, 10);
		self.players.forEach( (function(player) {
			player.physicUpdate(self.dynamicsWorld);
		}));
		self.ais.forEach( (function(ai) {
			ai.physicUpdate(self.dynamicsWorld);
		}));
	}
	
};

/*static functions
 * These funcitons can be shared with either client or server sides
 */

/*returns a compressed string. 
 * input: xs is a gameobject array
 * output: contains position, quaternion, velocity
 * needs extractPacket() to extract the info
 */
AICRAFT.Engine.encryptedPacket = function(xs){
	var result = new Array();
	xs.forEach( function(s) {
		//first three floatings are position
		result.push(parseFloat(s.position.x));
		result.push(parseFloat(s.position.y));
		result.push(parseFloat(s.position.z));
		//next four are quats
		result.push(s.quaternion.x);
		result.push(s.quaternion.y);
		result.push(s.quaternion.z);
		result.push(s.quaternion.w);
		//last three are velocity
		result.push(s.phybody.getAngularVelocity().getX());
		result.push(s.phybody.getAngularVelocity().getY());
		result.push(s.phybody.getAngularVelocity().getZ());
	});
	return result;
};

/*returns human readable json object
 * containing position, quats and velocity
 */
AICRAFT.Engine.extractPacket = function(packet){
	if (packet.length % 10 != 0) {
		return;
	};
	var json_text = '({"bindings":[';
	for (var i=0; i<packet.length; i+=10) {
		json_text += '{"position":';
		json_text += '['+packet[i]+','+
			packet[i+1]+','+
			packet[i+2]+'],';
		json_text += '"quaternion":';
		json_text += '['+packet[i+3]+','+
			packet[i+4]+','+
			packet[i+5]+','+
			packet[i+6]+'],';
		json_text += '"velocity":';
		json_text += '['+packet[i+7]+','+
			packet[i+8]+','+
			packet[i+9]+']';
		json_text += '},';
	};
	json_text += ']})';
	return eval(json_text);
};

//returns a json obj. xs needs to be a gameobjects array
AICRAFT.Engine.makeJson = function(xs){
	var json_text = '({"bindings":[';
	xs.forEach( (function(s) {
		json_text += '{"position":';
		json_text += '['+s.position.x+','+
			s.position.y+','+
			s.position.z+'],';
		json_text += '"quaternion":';
		json_text += '['+s.quaternion.x+','+
			s.quaternion.y+','+
			s.quaternion.z+','+
			s.quaternion.w+'],';
		json_text += '"velocity":';
		json_text += '['+s.phybody.getAngularVelocity().getX()+','+
			s.phybody.getAngularVelocity().getY()+','+
			s.phybody.getAngularVelocity().getZ()+']';
		json_text += '},';
	}));
	json_text += ']})';
	return eval(json_text);
};

//returns the next available slot number. If returns -1, game's full
AICRAFT.Engine.getNextAvailablePnum = function(players) {
	for (var i = 0; i<players.length; i++) {
		if (!players[i].connected) {
			return i;
		}
	}
	return -1;
};
