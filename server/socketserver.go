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
	p1.Name = "player1"
	a1.X, a1.Y = 10, 10
	a1.Name = "ai1"
	p2.X, p2.Y = 250, 250
	p2.Name = "player2"
	a2.X, a2.Y = 240, 240
	a2.Name = "ai2"
}


//websocket service telling all units' positions 
func GetPos(ws *websocket.Conn) {
	var msg_rev = make([]byte, 1)
	var json_str string = 
	"{\"positions\":["+
		"{\"name\":\""+p1.Name+"\", \"x\":\""+fmt.Sprint(p1.X)+"\", \"y\":\""+fmt.Sprint(p1.Y)+"\"},"+
		"{\"name\":\""+a1.Name+"\", \"x\":\""+fmt.Sprint(a1.X)+"\", \"y\":\""+fmt.Sprint(a1.Y)+"\"},"+
		"{\"name\":\""+p2.Name+"\", \"x\":\""+fmt.Sprint(p2.X)+"\", \"y\":\""+fmt.Sprint(p2.Y)+"\"},"+
		"{\"name\":\""+a2.Name+"\", \"x\":\""+fmt.Sprint(a2.X)+"\", \"y\":\""+fmt.Sprint(a2.Y)+"\"}"+
	"]}"
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

