function ws_init()
{
	output = document.getElementById("output");
	socket = new WebSocket("ws://localhost:12345/getpos");

	socket.onopen = function(evt) {
		var timestamp1 = Number(new Date());
		writeToScreen(timestamp1);
		//setInterval("socket.send('p')", 83);
		setInterval("socket.send('p')", 2000);
		/*for (i=0;i<=12;i=i+1)
		{
			socket.send("p");
		}*/
		writeToScreen("Connected!");
	};

	socket.onmessage = function(evt) {
		writeToScreen(evt.data);
		var timestamp2 = Number(new Date());
		writeToScreen(timestamp2);
		//socket.close();
	};

	socket.onclose = function(evt) {
		writeToScreen("Disconnected!");
	};

	//test player and ai class
	var p1 = new Player("gzmask");
	var a1 = new Ai("minime");
	writeToScreen(p1.getInfo());
	writeToScreen(a1.getInfo());

}

