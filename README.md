Tasks:

=========== To-Do:  ==============
	
	make player view first personal, and narrow the field of view to be about the same as what AI sees using fogs
	can anyone explain to me the rough idea of how to combine character animations of walking and headbobing ? chandlerp: gzmask: if you have the two morph targets setup you can animate them separately: material.morphTargetInfluences[0] = .5 // walking chandlerp: material.morphTargetInfluences[1] = .2 // head bobbing chandlerp: animate the influence values between 0 and 1 at whatever pace fits
	reduce network load for area where player and ai can not see
	sighting onScanned event can make use of rayCastTest only client side
	raycast with delay can be used for bullets: http://bulletphysics.org/mediawiki-1.5.8/index.php/Using_RayTest
	implement ai interface on client side
	eval of user ai code can not crash the core engines. First insigh is try...catch..., but this may need web workers.
	ai event loops need to be terminated once newer version of user code is commited. Probably use class variables
	code emittor options: gpl.internetconnection.net/vi/ or ssh or GateOne
	Submit first level by Feb 28th at http://www.indiecade.com/submissions 

============== done ===============

	Implement lookAt AI call
	AI needs another mesh, thus need to override the buildMesh and graphic update method in AI class
	need walls, can be invisible therefore don't need THREE.js code
	disconnection needs to be handle
	sync velocity
	sync the players part of the game engine
	sync the ai part of the game engine
	keyboard event syncs per 2 frames, position syncs per 3 frames
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
	Use Dnode to reconstruct and server/client communication
