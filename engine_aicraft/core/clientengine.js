//client engine runs in browsers
AICRAFT.ClientEngine = function () {
	this.stats = undefined;
	this.scene = undefined; 
	this.renderer = undefined;
	this.camera = undefined;
   	this.cameraControl = undefined;
	this.ground = undefined;
	this.dynamicsWorld = undefined;
	this.totalPlayers = undefined;
	//number represents my player in player array
	this.myPnum = undefined;
	this.players = new Array();
	this.ais = new Array();
};

//proto methods
AICRAFT.ClientEngine.prototype = {

	constructor: AICRAFT.ClientEngine,

	init: function(socket) {
		var self = this;
		if( Detector.webgl ){
			this.renderer = new THREE.WebGLRenderer({
				antialias		: true,	// to get smoother output
				preserveDrawingBuffer	: true	// to allow screenshot
			});
			this.renderer.setClearColorHex( 0xBBBBBB, 1 );
		} else {
			Detector.addGetWebGLMessage();
			return true;
		}
		this.renderer.setSize( window.innerWidth, window.innerHeight );
		this.renderer.shadowMapEnabled = true;
		document.getElementById('container').appendChild(this.renderer.domElement);

		this.stats = new Stats();
		this.stats.domElement.style.position	= 'absolute';
		this.stats.domElement.style.bottom	= '0px';
		document.body.appendChild( this.stats.domElement );

		// create a scene
		this.scene = new THREE.Scene();

		//start physics
		(function(){
			var collisionConfiguration = new Ammo.btDefaultCollisionConfiguration();
			var dispatcher = new Ammo.btCollisionDispatcher(collisionConfiguration);
			var overlappingPairCache = new Ammo.btDbvtBroadphase();
			var solver = new Ammo.btSequentialImpulseConstraintSolver();
			self.dynamicsWorld = new Ammo.btDiscreteDynamicsWorld(dispatcher, overlappingPairCache, solver, collisionConfiguration);
			self.dynamicsWorld.setGravity(new Ammo.btVector3(0,-9.82,0));
			self.dynamicsWorld.trans = new Ammo.btTransform();
			self.dynamicsWorld.trans.setIdentity();})();

		// put a camera in the scene
		this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 10000 );
		this.camera.position.set(0, 0, 200);
		this.scene.add(this.camera);

		// create a camera contol
		this.cameraControls	= new THREEx.DragPanControls(this.camera)



		// transparently support window resize
		THREEx.WindowResize.bind(this.renderer, this.camera);
		// allow 'p' to make screenshot
		THREEx.Screenshot.bindKey(this.renderer);
		// allow 'f' to go fullscreen where this feature is supported
		if( THREEx.FullScreen.available() ){
			THREEx.FullScreen.bindKey();
			document.getElementById('inlineDoc').innerHTML	+= "- <i>f</i> for fullscreen";
		}

		//construct a light
		var light = new THREE.SpotLight();
		light.position.set(170,330,-160);
		light.castShadow = true;
		this.scene.add(light);

		//construct a ground
		var groundGeo = new THREE.PlaneGeometry(400, 400, 10, 10);
		//var groundGeo = new THREE.CubeGeometry(400, 0.1, 400);
		var groundMat = new THREE.MeshLambertMaterial({color: 0xffffff});
		this.ground = new THREE.Mesh(groundGeo, groundMat);
		this.ground.rotation.x = -Math.PI/2;
		this.ground.position.y = -5;
		this.ground.receiveShadow = true;
		this.scene.add(this.ground);
		//ammo part
		(function() {
			var groundShape = new Ammo.btBoxShape(new Ammo.btVector3(400, 0.5, 400));
			var groundTransform = new Ammo.btTransform();
			groundTransform.setIdentity();
			groundTransform.setOrigin(new Ammo.btVector3(0,-5.5,0));
			var mass = 0;
			var isDynamic = (mass != 0);
			var localInertia = new Ammo.btVector3(0, 0, 0);

			if (isDynamic) {
				groundShape.calculateLocalInertia(mass, localInertia);}
			var myMotionState = new Ammo.btDefaultMotionState(groundTransform);
			var rbInfo = new Ammo.btRigidBodyConstructionInfo(mass, myMotionState, groundShape, localInertia);
			self.ground.phybody = new Ammo.btRigidBody(rbInfo);
			self.dynamicsWorld.addRigidBody(self.ground.phybody);
		})();


		var quat = new THREE.Quaternion();
		
		(function() { for (var i=0; i<self.totalPlayers; i++) {
			//construct players
			quat.setFromEuler(new THREE.Vector3(-30, -20, 0));
			self.players[i] = new AICRAFT.Player(
					socket.players.bindings[i].position[0], 
					socket.players.bindings[i].position[1], 
					socket.players.bindings[i].position[2], 
					socket.players.bindings[i].quaternion[0], 
					socket.players.bindings[i].quaternion[1], 
					socket.players.bindings[i].quaternion[2], 
					socket.players.bindings[i].quaternion[3]);
			self.players[i].buildMesh(THREE);
			self.scene.add(self.players[i].mesh);
			self.players[i].buildPhysic(Ammo);
			self.dynamicsWorld.addRigidBody(self.players[i].phybody);

			//construct ais
			quat.setFromEuler(new THREE.Vector3(30, -20, 0));
			self.ais[i] = new AICRAFT.Ai(
					socket.ais.bindings[i].position[0], 
					socket.ais.bindings[i].position[1], 
					socket.ais.bindings[i].position[2], 
					socket.ais.bindings[i].quaternion[0], 
					socket.ais.bindings[i].quaternion[1], 
					socket.ais.bindings[i].quaternion[2], 
					socket.ais.bindings[i].quaternion[3]);
			self.ais[i].buildMesh(THREE);
			self.scene.add(self.ais[i].mesh);
			self.ais[i].buildPhysic(Ammo);
			self.dynamicsWorld.addRigidBody(self.ais[i].phybody);
		}})();

		//start tracking keyboards
		//document.onkeydown = self.players[self.myPnum].handleKeyDown;
		//document.onkeyup = self.players[self.myPnum].handleKeyUp;
		document.addEventListener("keydown", 
				function(event){self.players[self.myPnum].handleKeyDown(event, 
					self.players[self.myPnum]);}, false);
		document.addEventListener("keyup", 
				function(event){self.players[self.myPnum].handleKeyUp(event, 
					self.players[self.myPnum]);}, false);

		//construct a coordinate helper
		AICRAFT.ClientEngine.coordHelper(this.scene);

		//console.log(AICRAFT.Engine.makeJson(players));
		//console.log(AICRAFT.Engine.makeJson(ais));
	},

	networkReady: function(init_cb, animate_cb) {
		var self = this;
		var socket = io.connect('/');
		socket.on('totalPlayers', function(data) {
			self.totalPlayers = data;
		});
		socket.on('connect', function(data) {
			self.myPnum = data;
		});
		socket.on('pi', function(data) {
			socket.players = AICRAFT.Engine.extractPacket(data);
			socket.on('ai', function(data) {
				socket.ais = AICRAFT.Engine.extractPacket(data);
				if (self.myPnum != -1) {
					init_cb(socket);
					self.players[self.myPnum].connected = true;
					socket.emit('connected', true);
					animate_cb();
				} else {
					alert('game is full');
				}
			});
		});
	},

	syncPos: function(){
		var self = this;
		var socket = io.connect('/');
		socket.on('p', function(data) {
			//console.log(AICRAFT.Engine.extractPacket(data));
		});
		socket.on('a', function(data) {
			//console.log(data);
		});
	},

	syncKey: function() {
		var self = this;
		requestAnimationFrame(self.syncKey.bind(self));
		var socket = io.connect('/');
		socket.emit('k'+self.myPnum, self.players[self.myPnum].keycode);
	},

	animate: function() {
		var self = this;
		requestAnimationFrame(self.animate.bind(self));

		// update inputs
		self.players[self.myPnum].updateInput();

		// update physics
		self.dynamicsWorld.stepSimulation(1/30, 10);
		(function(){ for (var i=0; i<self.totalPlayers; i++) {
			self.players[i].physicAndGraphicUpdate(self.dynamicsWorld);
			self.ais[i].physicAndGraphicUpdate(self.dynamicsWorld);
		}})();

		// update camera controls
		self.cameraControls.update();

		// do the render
		self.render();

		// update stats
		self.stats.update();
	},

	// render the scene
	render: function() {
		// actually render the scene
		this.renderer.render( this.scene, this.camera );
	}
};


/*static functions
 * These funcitons can be shared with either client or server sides
 */

//helper function to show coordinate
AICRAFT.ClientEngine.coordHelper = function(scene) {
	//draw coords
	var coordGeo = new THREE.Geometry();
	coordGeo.vertices.push (
		AICRAFT.ClientEngine.v(-200,0,0), AICRAFT.ClientEngine.v(200,0,0),/*x coord*/
		AICRAFT.ClientEngine.v(0,-200,0), AICRAFT.ClientEngine.v(0,200,0),/*y coord*/
		AICRAFT.ClientEngine.v(0,0,-200), AICRAFT.ClientEngine.v(0,0,200),/*z coord*/
		AICRAFT.ClientEngine.v(200,1,0), AICRAFT.ClientEngine.v(200,-1,0),/*x units*/
		AICRAFT.ClientEngine.v(150,1,0), AICRAFT.ClientEngine.v(150,-1,0),
		AICRAFT.ClientEngine.v(100,1,0), AICRAFT.ClientEngine.v(100,-1,0),
		AICRAFT.ClientEngine.v(50,1,0), AICRAFT.ClientEngine.v(50,-1,0),
		AICRAFT.ClientEngine.v(-50,1,0), AICRAFT.ClientEngine.v(-50,-1,0),
		AICRAFT.ClientEngine.v(-100,1,0), AICRAFT.ClientEngine.v(-100,-1,0),
		AICRAFT.ClientEngine.v(-150,1,0), AICRAFT.ClientEngine.v(-150,-1,0),
		AICRAFT.ClientEngine.v(-200,1,0), AICRAFT.ClientEngine.v(-200,-1,0),
		AICRAFT.ClientEngine.v(1,200,0), AICRAFT.ClientEngine.v(-1,200,0),/*y units*/
		AICRAFT.ClientEngine.v(1,150,0), AICRAFT.ClientEngine.v(-1,150,0),
		AICRAFT.ClientEngine.v(1,100,0), AICRAFT.ClientEngine.v(-1,100,0),
		AICRAFT.ClientEngine.v(1,50,0), AICRAFT.ClientEngine.v(-1,50,0),
		AICRAFT.ClientEngine.v(1,-50,0), AICRAFT.ClientEngine.v(-1,-50,0),
		AICRAFT.ClientEngine.v(1,-100,0), AICRAFT.ClientEngine.v(-1,-100,0),
		AICRAFT.ClientEngine.v(1,-150,0), AICRAFT.ClientEngine.v(-1,-150,0),
		AICRAFT.ClientEngine.v(1,-200,0), AICRAFT.ClientEngine.v(-1,-200,0),
		AICRAFT.ClientEngine.v(0,1,200), AICRAFT.ClientEngine.v(0,-1,200),/*z units*/
		AICRAFT.ClientEngine.v(0,1,150), AICRAFT.ClientEngine.v(0,-1,150),
		AICRAFT.ClientEngine.v(0,1,100), AICRAFT.ClientEngine.v(0,-1,100),
		AICRAFT.ClientEngine.v(0,1,50), AICRAFT.ClientEngine.v(0,-1,50),
		AICRAFT.ClientEngine.v(0,1,-50), AICRAFT.ClientEngine.v(0,-1,-50),
		AICRAFT.ClientEngine.v(0,1,-100), AICRAFT.ClientEngine.v(0,-1,-100),
		AICRAFT.ClientEngine.v(0,1,-150), AICRAFT.ClientEngine.v(0,-1,-150),
		AICRAFT.ClientEngine.v(0,1,-200), AICRAFT.ClientEngine.v(0,-1,-200)
	);
	var coordMat = new THREE.LineBasicMaterial({color: 0x000000, lineWidth:1});
	var coord = new THREE.Line(coordGeo, coordMat);
	coord.type = THREE.Lines;
	scene.add(coord);
};

//vertex maker
AICRAFT.ClientEngine.v = function(x,y,z) {
	return new THREE.Vertex(new THREE.Vector3(x,y,z));
};

/*keyboard input checker
 * input: keycode and the key you want to know if it's pressed
 * output: true if it's pressed, false otherwise
 */
AICRAFT.ClientEngine.key = function(keycode, key) {
	if (key == "w") {
		if (keycode & 8) {
			return true;
		} else {
			return false;
		};	
	} else if (key == "a") {
		if (keycode & 4) {
			return true;
		} else {
			return false;
		};	
	} else if (key == "s") {
		if (keycode & 2) {
			return true;
		} else {
			return false;
		};	
	} else if (key == "d") {
		if (keycode & 1) {
			return true;
		} else {
			return false;
		};	
	} else if (key == "e") {
		if (keycode & 16) {
			return true;
		} else {
			return false;
		};	
	};
	return false;
};
