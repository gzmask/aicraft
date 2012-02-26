#!/usr/bin/env node


(function() {
	var io, Ammo, Express, AICRAFT;
	var aiengine, app;


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
	aiengine = new AICRAFT.Engine();
	aiengine.init(app, Ammo);
	io.sockets.on('connection', function (socket) {
		aiengine.networkInit(socket);
		aiengine.syncKey(socket, Ammo);
	});
	aiengine.syncPos(io.sockets);
	aiengine.animate();
	
}).call(this);

