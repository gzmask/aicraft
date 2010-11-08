package main

import (
	"fmt"
	"websocket"
	//"strings"
)

func main() {
	ws, err := websocket.Dial("ws://142.3.29.153:12345/echo", "", "http://localhost:12345/echo")
	if err != nil {
		panic("Dial: " + err.String())
	}
	if _, err := ws.Write([]byte("hello, world!\n")); err != nil {
		panic("Write: " + err.String())
	}
	var msg = make([]byte, 512)
	n, err := ws.Read(msg)
	if err != nil {
		panic("Read: " + err.String())
	}
	// use msg[0:n]
	fmt.Printf("%s", msg[0:n])
}
