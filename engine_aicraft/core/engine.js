//this function runs on node.js side
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

		//now
		this.everyone = Nowjs.initialize(expressApp);
		this.everyone.now.logStuff = function(msg){
			console.log(msg);
			console.log(this.now.a);
		};

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
		//construct player1
		quat.setEuler(0,20,-30);
		var player1 = new AICRAFT.Player(100, 125, 5, quat.getX(),quat.getY(),quat.getZ(),quat.getW());
		player1.buildPhysic(Ammo);
		this.dynamicsWorld.addRigidBody(player1.phybody);
		this.players.push(player1);
		
		//construct ai1
		quat.setEuler(0,20,30);
		ai1 = new AICRAFT.Ai(100,5,-5,quat.getX(),quat.getY(),quat.getZ(),quat.getW());
		ai1.buildPhysic(Ammo);
		this.dynamicsWorld.addRigidBody(ai1.phybody);
		this.ais.push(ai1);

		//construct player2
		quat.setEuler(0,-20,-30);
		var player2 = new AICRAFT.Player(-100,25,5,quat.getX(),quat.getY(),quat.getZ(),quat.getW());
		player2.buildPhysic(Ammo);
		this.dynamicsWorld.addRigidBody(player2.phybody);
		this.players.push(player2);

		//construct ai2
		quat.setEuler(0,-20,30);
		ai2 = new AICRAFT.Ai(-100,135,-5,quat.getX(),quat.getY(),quat.getZ(),quat.getW());
		ai2.buildPhysic(Ammo);
		this.dynamicsWorld.addRigidBody(ai2.phybody);
		this.ais.push(ai2);

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
	}
};
