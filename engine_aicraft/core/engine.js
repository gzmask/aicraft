//server engine runs on node.js 
AICRAFT.Engine = function () {
	//global vars
	this.everyone = undefined;
	this.dynamicsWorld = undefined;
	this.totalPlayers = 2;
	this.players = new Array();
	this.ais = new Array();
};

AICRAFT.Engine.prototype = {

	constructor: AICRAFT.Engine,

	init: function(expressApp, Nowjs, Ammo) {


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
		var self = this;
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

		//network
		//test now.js connection
		this.everyone = Nowjs.initialize(expressApp);
		this.everyone.now.logStuff = function(msg){
			console.log(msg);
			console.log(this.now.a);
		};

		//save totalPlayers
		this.everyone.now.totalPlayers = this.totalPlayers;

		//broadcast player states using now and json
		this.everyone.now.players = eval(this._makeJson(this.players));
		this.everyone.now.ais = eval(this._makeJson(this.ais));

	},

	animate: function() {
		var self = this; //closure var, without the assignment, 'this' is animate() next call
		AICRAFT.requestAnimationFrame(function(){self.animate();});
		this.dynamicsWorld.stepSimulation(1/30, 10);
		this.players.forEach( (function(player) {
			player.physicUpdate(this.dynamicsWorld);
		}), this);
		this.ais.forEach( (function(ai) {
			ai.physicUpdate(this.dynamicsWorld);
		}), this);
	},

	_makeJson: function(xs){
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
		return json_text;
	}

};
