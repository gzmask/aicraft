var app = require('express').createServer()
  , io = require('socket.io').listen(app);

app.listen(8000);

app.get('/', function (req, res) {
  res.sendfile(__dirname + '/socketiotest.html');
});

io.sockets.on('connection', function (socket) {
  socket.emit('news', { hello: 'world' });
  socket.on('my other event', function (data) {
    console.log(data);
  });
});
