/**
 * @fileoverview This file contains the server engine.
 */

/**
 * @class Engine runs the physics part of ai and players on server side
 * @constructor inits the game entities.
 */
AICRAFT.Engine = function () {
	//global vars
	this.dynamicsWorld = undefined;
	this.totalPlayers = 2;
	this.players = new Array();
	this.ais = new Array();
	this.objs = new Array();
	this.animateFPS = 60;
	this.posFPS = 20;
	this.phyFPS = 30;
	this.aiEngine = undefined;

};

//object methods
AICRAFT.Engine.prototype = {

	/**
	 * inits the game entities
	 */
	constructor: AICRAFT.Engine,

	/**
	 * initialize the game engine, generates the player/ai positions, construct the scene with needed collisions
	 * @param expressApp require express framework app instance
	 * @param Ammo require BulletPhysics module
	 * @requires express.js ammo.js
	 */
	init: function(expressApp, Ammo, aiEngine) {

		var self = this;

		self.aiEngine = aiEngine;
		
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
        AICRAFT.Engine.initScene(self, Ammo);
		
		//init game characters
		(function() { 
			var objArray = new Array();
			var tmp_counter = 0;
			for (var i=0; i< self.totalPlayers; i++) {
			//construct player
			quat = AICRAFT.quatFromEuler(0,0,0, Ammo);
			self.players[i] = new AICRAFT.Player( -150 + Math.random()*301, 
				0, 
				-150 + Math.random()*301, 
				quat.getX(),quat.getY(),quat.getZ(),quat.getW(), Ammo);
			self.players[i].buildPhysic(Ammo, self.dynamicsWorld);
			self.players[i].phybody.setUserPointer(tmp_counter);
			objArray.push(self.players[i]);
			self.players[i].objects = objArray;
			tmp_counter++;
			
			//construct ai
			quat = AICRAFT.quatFromEuler(360*Math.random(),0,0,Ammo);
			self.ais[i] = new AICRAFT.Ai(self.players[i].position.x,
				0,
				self.players[i].position.z - 25,
				quat.getX(),quat.getY(),quat.getZ(),quat.getW(), Ammo);
			self.ais[i].buildPhysic(Ammo, self.dynamicsWorld);
			self.ais[i].owner = self.players[i];
			self.ais[i].phybody.setUserPointer(tmp_counter);
			objArray.push(self.ais[i]);
			self.ais[i].objects = objArray;
			tmp_counter++;
		}})();

	},

	/** Network initialization
	 * Tells the clients all necessary information for game engine initializations
	 * @requires socket.io
	 * @param socket a opened socket 
	 */
	networkInit: function(socket) {
		var self = this;
		var connectingPnum = AICRAFT.Engine.getNextAvailablePnum(self.players);
		if (connectingPnum !== -1)
			self.players[connectingPnum].connecting = true;
		//tell client total players
		socket.emit('totalPlayers', self.totalPlayers);
		//tell client connected players
		socket.emit('connect', connectingPnum);
		socket.on('connected', function(data) {
			var Pnum = data[0];
			self.ais[Pnum].name = data[1];
			if (self.players[Pnum].connected || self.players[Pnum] === undefined) {
				return false;
			};
			console.log("Conected players:" + Pnum);
			self.players[Pnum].connected = true;
			self.players[Pnum].connecting = false;
			self.aiEngine.initAI(self.ais[Pnum], self.ais[Pnum].name);
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
		//code emitter init
		socket.emit('emitterInit', self.aiEngine.templateStr);
		//code emitter opened by player
		socket.on('code', function(){
			socket.get('Pnum', function(err, Pnum) {
				self.ais[Pnum].codeUploading = true;
				self.players[Pnum].codeUploading = true;
			});
		});
		//code emitter sent in new code by player
		socket.on('coded', function(data){
			socket.get('Pnum', function(err, Pnum) {
				self.ais[Pnum].codeUploading = false;
				self.players[Pnum].codeUploading = false;
				self.aiEngine.loadAI(data, self.ais[Pnum].name);
			});
		});
	},

	/**
	 *  Sync AI and Player status in a timely basis
	 *  @requires socket.io
	 *  @param socket needs the opened socket
	 */
	syncPos: function(socket) {
		var self = this;
		AICRAFT.requestPosFrame(function(){self.syncPos(socket);}, self.posFPS);
		//broadcast a compressed packet to all clients every frame
		socket.emit('p', AICRAFT.Engine.encryptedPacket(self.players));
		socket.emit('a', AICRAFT.Engine.encryptedPacket(self.ais));
	},

	/**
	 * Sync from clients for all their keyboard inputs. Only executes when players press something
	 * @param socket an opened socket
	 * @param Ammo Ammo.js
	 */
	syncKey: function(socket, Ammo) {
		var self = this;
		socket.on("k", function(keycode) {
			socket.get('Pnum', function(err, Pnum) {
				self.players[Pnum].keycode = keycode;
				self.players[Pnum].updateInput(Ammo);
			});
		});
		/*mouse disabled
		socket.on("m", function(deltaX) {
			socket.get('Pnum', function(err, Pnum) {
				self.players[Pnum].rotate(deltaX);
			});
		});
		*/
	},

	/** Animate the scene and all entities with Ammo.js physic simulations
	 * @requires requestAnimationFrame() defined the frame per second
	 */
	animate: function() {
		var self = this; //closure var, without the assignment, 'this' is animate() next call
		AICRAFT.requestAnimationFrame(function(){self.animate();}, self.animateFPS);

		//wait till game is full
		if (AICRAFT.Engine.getNextAvailablePnum(self.players) !== -1) {
			return;}
		
		//update physics
		self.dynamicsWorld.stepSimulation(1/self.phyFPS, 10);
		self.players.forEach( (function(player) {
			player.physicUpdate();
		}));
		self.ais.forEach( (function(ai) {
			ai.physicUpdate();
		}));
	}
	
};

/*static functions
 * These funcitons can be shared with either client or server sides
 */

/**returns a compressed string. 
 * @requires extractPacket() to extract the info
 * @param xs is a gameobject array
 * @return an array contains position, quaternion, velocity
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
		if (s.sight !== undefined) {
			result.push(s.sight.quaternion.x);
			result.push(s.sight.quaternion.y);
			result.push(s.sight.quaternion.z);
			result.push(s.sight.quaternion.w);
		}
		//last three are velocity
		result.push(s.phybody.getAngularVelocity().getX());
		result.push(s.phybody.getAngularVelocity().getY());
		result.push(s.phybody.getAngularVelocity().getZ());
		result.push(s.IsMoving);
		result.push(s.hp);
	});
	return result;
};

/**returns human readable json object
 * containing position, quats and velocity
 * @param packet the array generated by encryptedPackt function
 * @return an JSON object containing all the informations
 */
AICRAFT.Engine.extractPacket = function(packet){
	var player_len = 12;
	var ai_len = 16;
	if (packet.length % player_len == 0) {
		var json_text = '({"bindings":[';
		for (var i=0; i<packet.length; i+=player_len) {
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
				packet[i+9]+'],';
			json_text += '"IsMoving":';
			json_text += '['+packet[i+10]+'],'
			json_text += '"hp":';
			json_text += '['+packet[i+11]+']'
			json_text += '},';
		};
		json_text += ']})';
		return eval(json_text);
	} else if(packet.length % ai_len == 0) {
		var json_text = '({"bindings":[';
		for (var i=0; i<packet.length; i+=ai_len) {
			json_text += '{"position":';
			json_text += '['+packet[i]+','+
				packet[i+1]+','+
				packet[i+2]+'],';
			json_text += '"quaternion":';
			json_text += '['+packet[i+3]+','+
				packet[i+4]+','+
				packet[i+5]+','+
				packet[i+6]+'],';
			json_text += '"sightQuaternion":';
			json_text += '['+packet[i+7]+','+
				packet[i+8]+','+
				packet[i+9]+','+
				packet[i+10]+'],';
			json_text += '"velocity":';
			json_text += '['+packet[i+11]+','+
				packet[i+12]+','+
				packet[i+13]+'],';
			json_text += '"IsMoving":';
			json_text += '['+packet[i+14]+'],'
			json_text += '"hp":';
			json_text += '['+packet[i+15]+']'
			json_text += '},';
		};
		json_text += ']})';
		return eval(json_text);
	};
};

/**
 * This function returns the next available slot number. If returns -1, game's full
 * @param players an array of player slots
 * @return the available index for the player array, or -1 if nothing available
 */
AICRAFT.Engine.getNextAvailablePnum = function(players) {
	/*if (players === undefined) {
		return -1;}*/
	for (var i = 0; i<players.length; i++) {
		if (!players[i].connected && !players[i].connecting) {
			return i;
		}
	}
	return -1;
};

/** returns a json obj. 
 * @param xs needs to be a gameobjects array
 */
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

/** initializing the scene
 *
 */
AICRAFT.Engine.initScene = function(self, Ammo){
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
            ground_phybody.setUserPointer(-1);
			self.dynamicsWorld.addRigidBody(ground_phybody);

			//north wall
			var NWallShape = new Ammo.btBoxShape(new Ammo.btVector3(200,200,0.5));
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
            NWall_phybody.setUserPointer(-1);
			self.dynamicsWorld.addRigidBody(NWall_phybody);
			//east wall
			var EWallShape = new Ammo.btBoxShape(new Ammo.btVector3(0.5,200,200));
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
            EWall_phybody.setUserPointer(-1);
			self.dynamicsWorld.addRigidBody(EWall_phybody);
			//south wall
			var SWallShape = new Ammo.btBoxShape(new Ammo.btVector3(200,200,0.5));
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
            SWall_phybody.setUserPointer(-1);
			self.dynamicsWorld.addRigidBody(SWall_phybody);
			//west wall
			var WWallShape = new Ammo.btBoxShape(new Ammo.btVector3(0.5,200,200));
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
            WWall_phybody.setUserPointer(-1);
			self.dynamicsWorld.addRigidBody(WWall_phybody);
};
