//server engine runs on node.js 
//this engine runs the physics part of ai and players
AICRAFT.Engine = function () {
	//global vars
	this.dynamicsWorld = undefined;
	this.totalPlayers = 2;
	this.players = new Array();
	this.ais = new Array();
	this.animateFPS = 60;
	this.posFPS = 20;
	this.phyFPS = 30;

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
		
		//scene construction
		(function(){
			//ground
			var groundShape = new Ammo.btBoxShape(new Ammo.btVector3(200, 0.5, 200));
			var groundTransform = new Ammo.btTransform();
			groundTransform.setIdentity();
			groundTransform.setOrigin(new Ammo.btVector3(0,-5.5,0));
			var mass = 0;
			var isDynamic = (mass != 0);
			var localInertia = new Ammo.btVector3(0, 0, 0);

			if (isDynamic) {
				groundShape.calculateLocalInertia(mass, localInertia);
			}
			var myMotionState = new Ammo.btDefaultMotionState(groundTransform);
			var rbInfo = new Ammo.btRigidBodyConstructionInfo(mass, myMotionState, groundShape, localInertia);
			var ground_phybody = new Ammo.btRigidBody(rbInfo);
			self.dynamicsWorld.addRigidBody(ground_phybody);

			//north wall
			var NWallShape = new Ammo.btBoxShape(new Ammo.btVector3(200,15,0.5));
			var NWallTransform = new Ammo.btTransform();
			NWallTransform.setIdentity();
			NWallTransform.setOrigin(new Ammo.btVector3(0,-5.5,-200));
			mass = 0;
			isDynamic = (mass != 0);
			localInertia = new Ammo.btVector3(0, 0, 0);
			if (isDynamic) {
				NWallShape.calculateLocalInertia(mass, localInertia);
			}
			myMotionState = new Ammo.btDefaultMotionState(NWallTransform);
			rbInfo = new Ammo.btRigidBodyConstructionInfo(mass, myMotionState, NWallShape, localInertia);
			var NWall_phybody = new Ammo.btRigidBody(rbInfo);
			self.dynamicsWorld.addRigidBody(NWall_phybody);
			//east wall
			var EWallShape = new Ammo.btBoxShape(new Ammo.btVector3(0.5,15,200));
			var EWallTransform = new Ammo.btTransform();
			EWallTransform.setIdentity();
			EWallTransform.setOrigin(new Ammo.btVector3(200,-5.5,0));
			mass = 0;
			isDynamic = (mass != 0);
			localInertia = new Ammo.btVector3(0, 0, 0);
			if (isDynamic) {
				EWallShape.calculateLocalInertia(mass, localInertia);
			}
			myMotionState = new Ammo.btDefaultMotionState(EWallTransform);
			rbInfo = new Ammo.btRigidBodyConstructionInfo(mass, myMotionState, EWallShape, localInertia);
			var EWall_phybody = new Ammo.btRigidBody(rbInfo);
			self.dynamicsWorld.addRigidBody(EWall_phybody);
			//south wall
			var SWallShape = new Ammo.btBoxShape(new Ammo.btVector3(200,15,0.5));
			var SWallTransform = new Ammo.btTransform();
			SWallTransform.setIdentity();
			SWallTransform.setOrigin(new Ammo.btVector3(0,-5.5,200));
			mass = 0;
			isDynamic = (mass != 0);
			localInertia = new Ammo.btVector3(0, 0, 0);
			if (isDynamic) {
				SWallShape.calculateLocalInertia(mass, localInertia);
			}
			myMotionState = new Ammo.btDefaultMotionState(SWallTransform);
			rbInfo = new Ammo.btRigidBodyConstructionInfo(mass, myMotionState, SWallShape, localInertia);
			var SWall_phybody = new Ammo.btRigidBody(rbInfo);
			self.dynamicsWorld.addRigidBody(SWall_phybody);
			//west wall
			var WWallShape = new Ammo.btBoxShape(new Ammo.btVector3(0.5,15,200));
			var WWallTransform = new Ammo.btTransform();
			WWallTransform.setIdentity();
			WWallTransform.setOrigin(new Ammo.btVector3(-200,-5.5,0));
			mass = 0;
			isDynamic = (mass != 0);
			localInertia = new Ammo.btVector3(0, 0, 0);
			if (isDynamic) {
				WWallShape.calculateLocalInertia(mass, localInertia);
			}
			myMotionState = new Ammo.btDefaultMotionState(WWallTransform);
			rbInfo = new Ammo.btRigidBodyConstructionInfo(mass, myMotionState, WWallShape, localInertia);
			var WWall_phybody = new Ammo.btRigidBody(rbInfo);
			self.dynamicsWorld.addRigidBody(WWall_phybody);
		})();
		
		//init game characters
		var quat = new Ammo.btQuaternion();
		(function() { 
			for (var i=0; i< self.totalPlayers; i++) {
			//construct player
			quat.setEuler(0,20,-30);
			self.players[i] = new AICRAFT.Player( -150 + Math.floor(Math.random()*301), 
				0, 
				-150 + Math.floor(Math.random()*301), 
				quat.getX(),quat.getY(),quat.getZ(),quat.getW());
			self.players[i].buildPhysic(Ammo);
			self.dynamicsWorld.addRigidBody(self.players[i].phybody);
			
			//construct ai
			quat.setEuler(0,20,30);
			self.ais[i] = new AICRAFT.Ai(self.players[i].position.x,
				0,
				self.players[i].position.z - 5,
				quat.getX(),quat.getY(),quat.getZ(),quat.getW(), Ammo);
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
		socket.on('connected', function(Pnum) {
			if (self.players[Pnum].connected) {
				return false;
			};
			console.log("Conected players:" + Pnum);
			self.players[Pnum].connected = true;
			socket.set("Pnum", Pnum);
		});
		//tell client player states
		socket.emit('pi', AICRAFT.Engine.encryptedPacket(this.players));
		//tell client ai states
		socket.emit('ai', AICRAFT.Engine.encryptedPacket(this.ais));
		//disconnect peers
		socket.on('disconnect', function(){
			socket.get('Pnum', function(err,Pnum) {
				if (Pnum !== undefined) {
					self.players[Pnum].connected = false;}
			});
		});
	},

	syncPos: function(socket) {
		var self = this;
		AICRAFT.requestPosFrame(function(){self.syncPos(socket)}, self.posFPS);
		//broadcast a compressed packet to all clients every frame
		socket.emit('p', AICRAFT.Engine.encryptedPacket(self.players));
		socket.emit('a', AICRAFT.Engine.encryptedPacket(self.ais));
	},

	syncKey: function(socket, Ammo) {
		var self = this;
		socket.on("k", function(keycode) {
			socket.get('Pnum', function(err, Pnum) {
				self.players[Pnum].keycode = keycode;
				self.players[Pnum].updateInput(Ammo);
			});
		});
	},

	animate: function() {
		var self = this; //closure var, without the assignment, 'this' is animate() next call
		AICRAFT.requestAnimationFrame(function(){self.animate();}, self.animateFPS);

		//update physics
		self.dynamicsWorld.stepSimulation(1/self.phyFPS, 10);
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

//returns the next available slot number. If returns -1, game's full
AICRAFT.Engine.getNextAvailablePnum = function(players) {
	for (var i = 0; i<players.length; i++) {
		if (!players[i].connected) {
			return i;
		}
	}
	return -1;
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


