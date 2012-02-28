#!/usr/bin/env node


(function() {
	var io, Ammo, Express, AICRAF;
	var engine, aiengine, app;


	//web server
	Express = require('express');
	app = Express.createServer();
	app.set('views',__dirname+'/views');
	app.set('view engine', 'ejs');

	app.use(Express.static(__dirname + '/public'));

	app.get('/', function(request, response) {
		return response.render('index');
	});

	app.get('/game', function(request, response) {
		return response.render('game/index');
	});

	app.listen(3003);
	console.log("Express server started on port %s", app.address().port);
	  
	//game server 
	io = require('socket.io').listen(app);
	io.set('log level', 0);
	Ammo = require('./engine_aicraft/vendor/ammo.js').Ammo;
	AICRAFT = require('./engine_aicraft/build/aicraft.js').AICRAFT;
	engine = new AICRAFT.Engine();
	engine.init(app, Ammo);
	io.sockets.on('connection', function (socket) {
		engine.networkInit(socket);//async
		engine.syncKey(socket, Ammo);//async
	});
	engine.syncPos(io.sockets);//async
	engine.animate();//async

	//ai server
	var fs = require('fs');
	var templateAI = fs.readFileSync('engine_aicraft/aijail/templateAI.js').toString();
	aiengine = new AICRAFT.AIEngine();
	aiengine.templateStr = templateAI;
	aiengine.loadAI('', engine.ais[0], "killer");
	aiengine.loadAI('', engine.ais[1], "saver");
	aiengine.stepSimulation();
}).call(this);

