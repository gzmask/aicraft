Tasks:

=========== To-Do:  ==============
	
	implement ai on server side
	sync the ai part of the game engine
	Use gpl.internetconnection.net/vi/ for code emittor 
	Use Dnode to reconstruct and server/client communication
	Submit first level by Feb 28th at http://www.indiecade.com/submissions 

============== done ===============

	disconnection needs to be handle
	sync velocity
	sync the players part of the game engine
	replace now.js with socket.io
	The physics simulation is reasonably deterministic given the same initial state and inputs, therefore sync physic states and inputs	
	implement the ai part of the game engine at server side
	Player1 needs to wait for player2, when player2 enters the game, call init on server
	get the game engine running on Node.JS at server side
	Now.js running
	Construct two boxes to represent players, add control to these boxes
	Use ammo.js for physics
	Use Express and Tree.JS to reconstruct basic game loop
	Construct a ground, a helper function to display axis
	Construct a light, shadow and two boxes to represent A.I 

============ backlog ==============

	make THREE.js works in node.js
	players sync per frame, Ais sync per second(something like that)
