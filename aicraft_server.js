#!/usr/bin/env node

var app, express, nowjs, Ammo, everyone;
var player1, player2, ai1, ai2;
var AICRAFT;
var dynamicsWorld; 

(function() {
	express = require('express');

	//web server
	app = express.createServer();
	app.set('views',__dirname+'/views');
	app.set('view engine', 'ejs');

	app.use(express.static(__dirname + '/public'));

	app.get('/', function(request, response) {
		return response.render('index');
	});

	app.get('/game', function(request, response) {
		return response.render('game/index');
	});

	app.listen(3003);
	console.log("Express server started on port %s", app.address().port);
	  
	//game server
	/*io = require('socket.io').listen(app)
	//var THREE = require('./public/js/three.js');
	var Ammo = require('./public/js/ammo.js');
	var v3 = new Ammo.Ammo.btVector3(1,2,3);
	io.sockets.on('connection', function (socket) {
		socket.emit('news', { hello: 'world' });
		socket.on('my other event', function (data) {
			console.log(data);
		});
	});*/

	//game server using now
	nowjs = require("now");
	Ammo = require('./engine_aicraft/vendor/ammo.js').Ammo;
	AICRAFT = require('./engine_aicraft/build/aicraft.js').AICRAFT;
	everyone = nowjs.initialize(app);
	everyone.now.logStuff = function(msg){
		console.log(msg);
		console.log(this.now.a);
	};
	
	init();
	animate();
	
}).call(this);

function init () {
	//start physics
	(function(){
		var collisionConfiguration = new Ammo.btDefaultCollisionConfiguration();
		var dispatcher = new Ammo.btCollisionDispatcher(collisionConfiguration);
		var overlappingPairCache = new Ammo.btDbvtBroadphase();
		var solver = new Ammo.btSequentialImpulseConstraintSolver();
		dynamicsWorld = new Ammo.btDiscreteDynamicsWorld(dispatcher, overlappingPairCache, solver, collisionConfiguration);
		dynamicsWorld.setGravity(new Ammo.btVector3(0,-9.82,0));
		dynamicsWorld.trans = new Ammo.btTransform();
		dynamicsWorld.trans.setIdentity();})();
	
	//ground construction
	(function() {
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
		dynamicsWorld.addRigidBody(ground_phybody);
	})();
	
	//init game characters
	var quat = new Ammo.btQuaternion();
	//construct player1
	quat.setEuler(0,20,-30);
	player1 = new AICRAFT.Player(100, 125, 5, quat.getX(),quat.getY(),quat.getZ(),quat.getW());
	player1.buildPhysic(Ammo);
	dynamicsWorld.addRigidBody(player1.phybody);
	
	//construct ai1
	quat.setEuler(0,20,30);
	ai1 = new AICRAFT.Ai(100,5,-5,quat.getX(),quat.getY(),quat.getZ(),quat.getW());
	ai1.buildPhysic(Ammo);
	dynamicsWorld.addRigidBody(ai1.phybody);

	//construct player2
	quat.setEuler(0,-20,-30);
	player2 = new AICRAFT.Player(-100,25,5,quat.getX(),quat.getY(),quat.getZ(),quat.getW());
	player2.buildPhysic(Ammo);
	dynamicsWorld.addRigidBody(player2.phybody);

	//construct ai2
	quat.setEuler(0,-20,30);
	ai2 = new AICRAFT.Ai(-100,135,-5,quat.getX(),quat.getY(),quat.getZ(),quat.getW());
	ai2.buildPhysic(Ammo);
	dynamicsWorld.addRigidBody(ai2.phybody);

};

function animate () {
	AICRAFT.requestAnimationFrame(animate);
	// update physics
	dynamicsWorld.stepSimulation(1/30, 10);
	player1.physicUpdate(dynamicsWorld);
	ai1.physicUpdate(dynamicsWorld);
	player2.physicUpdate(dynamicsWorld);
	ai2.physicUpdate(dynamicsWorld);
};