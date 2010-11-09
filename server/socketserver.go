package socketserver

import (
	"http"
	"websocket"
	"fmt"
	"./player"
	"./ai"
)

var p1 player.Player
var p2 player.Player
var a1 ai.Ai
var a2 ai.Ai

func init() {
	p1.X, p1.Y = 0, 0
	a1.X, a1.Y = 10, 10
	p2.X, p2.Y = 250, 250
	a2.X, a2.Y = 240, 240
}


//websocket service telling all units' positions 
func GetPos(ws *websocket.Conn) {
	var msg_rev = make([]byte, 1)
	var json_str string = 
	"["+
		"{name:player1, x:"+fmt.Sprint(p1.X)+", y:"+fmt.Sprint(p1.Y)+"},"+
		"{name:ai1, x:"+fmt.Sprint(a1.X)+", y:"+fmt.Sprint(a1.Y)+"},"+
		"{name:player2, x:"+fmt.Sprint(p2.X)+", y:"+fmt.Sprint(p2.Y)+"},"+
		"{name:ai2, x:"+fmt.Sprint(a2.X)+", y:"+fmt.Sprint(a2.Y)+"},"+
	"]"
	var msg_sent = []byte(json_str)

	for _, err := ws.Read(msg_rev); err == nil; ws.Write(msg_sent[0:len(msg_sent)]) {
		_, err = ws.Read(msg_rev)
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

