
function ws_connect()
{
	socket = new WebSocket("ws://localhost:12345/getpos");

	socket.onopen = function(evt) {
		var timestamp1 = Number(new Date());
		//writeToScreen(timestamp1);
		//setInterval("socket.send('p')", msPF);
		if (socket.readyState == 1)
		{
			try {  
				socket.send(' '+String.fromCharCode(wasd));
			} catch(exception) {  
				writeToScreen(exception);
			}  
			
		}
		//setInterval("socket.send('p')", 2000);
		/*for (i=0;i<=12;i=i+1)
		{
			socket.send("p");
		}*/
		//writeToScreen("Connected!");
	};

	socket.onmessage = function(evt) {
		//evt.data is the json array from socketserver.go
		//var json_obj = {"positions":[{"name":"player1", "x":"0", "y":"0"},{"name":"ai1", "x":"10", "y":"10"},{"name":"player2", "x":"250", "y":"250"},{"name":"ai2", "x":"240", "y":"240"}]};
		var json_obj = JSON.parse(evt.data);
		p1.x = json_obj.units[0].x;
		p1.y = json_obj.units[0].y;
		a1.x = json_obj.units[1].x;
		a1.y = json_obj.units[1].y;
		//var timestamp2 = Number(new Date());
		//writeToScreen(timestamp2);
		socket.close();
	};

	socket.onclose = function(evt) {
		//writeToScreen("Disconnected!");
	};
}


function ws_init() {
	setInterval(ws_connect, msPF);
	//ws_connect();
}
