#!/usr/bin/env node

(function() {
	var app, express, now;
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
	var Ammo = require('./public/js/ammo.js').Ammo;
	var AICRAFT = require('./engine_aicraft/build/aicraft.js').AICRAFT;
	var v3 = new Ammo.btVector3(1,2,3);
	var player1 = new AICRAFT.GameObject(1,2,3);
	var nowjs = require("now");
	var everyone = nowjs.initialize(app);
	everyone.now.logStuff = function(msg){
		console.log(msg);
		console.log(this.now.a);
	}
	
  
}).call(this);
