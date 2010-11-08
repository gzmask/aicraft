package main

import (
	"http"
	//"io"
	//"os"
	"websocket"
)

// Echo the data received on the Web Socket.
func GetPos(ws *websocket.Conn) {
	var msg = make([]byte, 10)

	for n, err := ws.Read(msg); err == nil; ws.Write(msg[0:n]) {
		n, err = ws.Read(msg)
	}

	ws.Close();
}

func main() {
	http.Handle("/getpos", websocket.Handler(GetPos));
	err := http.ListenAndServe(":12345", nil);
	if err != nil {
		panic("ListenAndServe: " + err.String())
	}
}

