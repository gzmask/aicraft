function ws_init()
{
	output = document.getElementById("output");
	socket = new WebSocket("ws://localhost:12345/getpos");

	socket.onopen = function(evt) {
		var timestamp1 = Number(new Date());
		writeToScreen(timestamp1);
		setInterval("socket.send('p')", msPF);
		//setInterval("socket.send('p')", 2000);
		/*for (i=0;i<=12;i=i+1)
		{
			socket.send("p");
		}*/
		writeToScreen("Connected!");
	};

	socket.onmessage = function(evt) {
		//evt.data is the json array from socketserver.go
		var json_obj = JSON.parse(evt.data);
		//var json_obj = {"positions":[{"name":"player1", "x":"0", "y":"0"},{"name":"ai1", "x":"10", "y":"10"},{"name":"player2", "x":"250", "y":"250"},{"name":"ai2", "x":"240", "y":"240"}]};
		writeToScreen(json_obj.positions[0].name);
		//writeToScreen(evt.data);
		//var timestamp2 = Number(new Date());
		//writeToScreen(timestamp2);
		//socket.close();
	};

	socket.onclose = function(evt) {
		writeToScreen("Disconnected!");
	};
}


