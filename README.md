Tasks:

============ To-Do:  ==============
	Use Express and Tree.JS to reconstruct basic game loop
    Remake server side part with NodeJS

============ backlog ==============
	
	Smooth out the movement, lower the network bandwidth
	Websocket done wrong. It should be "full duplex" connection without reconnecting for every packet.
	Load an image as the background onto canvas
	Get an image, make it bigger than the canvas using ctx.scale(), draw part of it onto the canvas
	Produce "Moving Effect" by moving the background in reverse directions, not the player.
	Load a sprite animation as the player
	Load a sprite animation as the A.I
	Make the Map local web storage
	Implement map hash to check for updates
	Ranger A.I follows the player, only allow to move within some R from the player as the centre
	Defender A.I is stationary, only allowed to move within some R from the deployed point.
	Virus A.I is non-physical, capable to remotely control opposite's physical form A.I for a limited peroid of time.
	Winner captures the source code(A.I). Captured A.I only lives for 1 hour or so.
	Choose Collision detection algorithm - OctTree for 3D, QuadTree for 2D
	Implement Map flooding tool using selected CD algorithm above, gives Octree/QuadTree in JSON
	Implement CD function in JS, reads the JSON above as input

============== WebGL Version ===============

	Implement height map in webGL version
	Implement Tiled map with height info.

============== done ===============

Nov 8th, 2010
	a server folder, a client folder
	Figure out a way to get channel info, and get more than one packet
	A Go player class, A Go A.I class
	A JS player class, A JS A.I class
	Seperate WebSocket from main package
	A golang websocket service that tells client 12 times per second about every unit's positions using json array

Nov 9th, 2010
	Add Canvas to html page
	Design a very simple Player Avatar
	Design a very simple A.I Avatar
	Add Player to Canvas
	Add A.I to Canvas 

Nov 10th, 2010
	Sync position of Go player and JS player, through websocket.
	Animate Go Player positions

Nov 11st, 2010
	Construct a single char name 'wasd', where the rightmost 4 bits is the movement, as the order of 'wasd', ie. 0010 means 's' is pressed. leftmost 12 bits are reserved.
	Test what GetPos() of socketserver.go is getting from ws.js
	Send 'wasd' char (8bits) to socketserver.go
	Move player and ai according to the wasd char
	Add control to JS player movement control with six moving directions.
