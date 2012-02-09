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

	//THREE = require('./public/js/three.js');
	Ammo = require('./public/js/ammo.js');
	everyone.now.logStuff = function(msg){
		console.log(msg);
	};
  
}).call(this);
