package socketserver

import (
	"http"
	"websocket"
)

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

