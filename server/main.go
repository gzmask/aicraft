package main

import (
	"fmt"
	"time"
	"./player"
	"./ai"
	"./socketserver"
)

func main() {

	go socketserver.SocketServer()

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

	//server runs for an hour
	time.Sleep(60*60*1e9)

}

