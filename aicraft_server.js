#!/usr/bin/env node


(function() {
	var Nowjs, Ammo, Express, AICRAFT;
	var aiengine, app;

	Express = require('express');

	//web server
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
	Nowjs = require("now");
	Ammo = require('./engine_aicraft/vendor/ammo.js').Ammo;
	AICRAFT = require('./engine_aicraft/build/aicraft.js').AICRAFT;
	aiengine = new AICRAFT.Engine();
	aiengine.init(app, Nowjs, Ammo);
	aiengine.animate();
	
}).call(this);

