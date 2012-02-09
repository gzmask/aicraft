//entry point
(function() {
	var app, express, nowjs;
	express = require('express');
	nowjs = require("now");

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
	var everyone = nowjs.initialize(app);
	//var THREE = require('./public/js/three.js');
	var Ammo = require('./public/js/ammo.js');
	var v3 = new Ammo.Ammo.btVector3(1,2,3);
	everyone.now.logStuff = function(msg){
		console.log(this.now.v3 + msg);
	};
  
}).call(this);
