package main

import (
	"http"
	"websocket"
	"fmt"
	"./player"
	"./ai"
)

//websocket service telling all units' positions 
func GetPos(ws *websocket.Conn) {
	var msg = make([]byte, 10)

	for n, err := ws.Read(msg); err == nil; ws.Write(msg[0:n]) {
		n, err = ws.Read(msg)
	}

	ws.Close();
}

func main() {

	//test player class
	var p1 player.Player
	p1.X = 7
	p1.Y = 23.4
	fmt.Printf(p1.Foo())

	//test ai class
	var a1 ai.Ai
	a1.X = 7
	a1.Y = 23.4
	fmt.Printf(a1.Foo())

	//server
	http.Handle("/getpos", websocket.Handler(GetPos));
	err := http.ListenAndServe(":12345", nil);
	if err != nil {
		panic("ListenAndServe: " + err.String())
	}
}

