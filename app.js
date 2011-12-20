//entry point
(function() {
  var app, express, io;
  express = require('express');
  io = require('socket.io');

  app = express.createServer();
  app.set('views',__dirname+'/views');
  app.set('view engine', 'ejs');

  app.use(express.static(__dirname + '/public'));
  app.get('/', function(request, response) {
    return response.render('index');
  });
  app.listen(3000);
  io = io.listen(app);
  console.log("Express server started on port %s", app.address().port);
  
  io.sockets.on('connection', function (socket) {
	  socket.emit('news', { hello: 'world' });
	  socket.on('my other event', function (data) {
	    console.log(data);
	  });
	});
  
}).call(this);