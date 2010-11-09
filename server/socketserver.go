package socketserver

import (
	"http"
	"websocket"
	"./player"
	"./ai"
)

var p1 player.Player
var p2 player.Player
var a1 ai.Ai
var a2 ai.Ai

func init() {
	p1.X, p1.Y = 0.0, 0.0
	p2.X, p2.Y = 5.0, 5.0
	a1.X, a1.Y = 1.0, 1.0
	a2.X, a2.Y = 4.0, 4.0
}


//websocket service telling all units' positions 
func GetPos(ws *websocket.Conn) {
	var msg = make([]byte, 10)

	for n, err := ws.Read(msg); err == nil; ws.Write(msg[0:n]) {
		n, err = ws.Read(msg)
	}

	ws.Close();
}


//websocket server
func SocketServer() {
	http.Handle("/getpos", websocket.Handler(GetPos));
	err := http.ListenAndServe(":12345", nil);
	if err != nil {
		panic("ListenAndServe: " + err.String())
	}
}

