//entry point
(function() {
  var app, express;
  express = require('express');
  //var io = require('socket.io');

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

  app.get('/mp_demo', function(request, response) {
    return response.render('game/mp_demo');
  });

  app.listen(3003);
  console.log("Express server started on port %s", app.address().port);
  
  //game server
	var nowjs = require("now");
	var everyone = nowjs.initialize(app);

	everyone.now.logStuff = function(msg){
		console.log(msg);
	}
  //io = io.listen(app);
  //io.sockets.on('connection', function (socket) {
//	  socket.emit('news', { hello: 'world' });
//	  socket.on('my other event', function (data) {
//	    console.log(data);
//	  });
//	});
  
}).call(this);
