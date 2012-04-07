/** 
 * @fileoverview Client Engine runs in browsers.
 */

/** 
 * @class Client Engine runs in browsers. 
 * @requires THREE.js, Ammo.JS, Socket.IO
 */
AICRAFT.ClientEngine = function () {
	this.keyFPS = 30;
	this.stats = undefined;
	this.scene = undefined; 
	this.renderer = undefined;
	this.camera = undefined;
   	this.cameraControls = undefined;
	this.codeEmitter = undefined;
	this.clock = new THREE.Clock();
	this.ground = undefined;
	this.totalPlayers = undefined;
	this.socket = undefined;
	//number represents my player in player array
	this.myPnum = undefined;
	this.players = new Array();
	this.ais = new Array();
	//dirty vars
	this.lastKeycode = 0;
	this.colors = [0x7547FF, 0xFF1414, 0x66CC00, 0x002EB8, 0x3D7AB8, 0x99CC33];
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

		// put a camera in the scene
		this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 10000 );
		this.scene.add(this.camera);




		// transparently support window resize
		THREEx.WindowResize.bind(this.renderer, this.camera);

		//construct a light
		var light = new THREE.SpotLight();
		light.position.set(170,330,-160);
		light.castShadow = true;
		this.scene.add(light);

		//construct a ground
		var groundGeo = new THREE.PlaneGeometry(400, 400, 10, 10);
		//var groundGeo = new THREE.CubeGeometry(400, 0.1, 400);
		var groundMat = new THREE.MeshLambertMaterial({color: this.colors[5]});
		this.ground = new THREE.Mesh(groundGeo, groundMat);
		this.ground.rotation.x = -Math.PI/2;
		this.ground.position.y = -5;
		this.ground.receiveShadow = true;
		this.scene.add(this.ground);
		

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
			self.players[i].IsClient = true;
            var im = i === self.myPnum;
			self.players[i].buildMesh(THREE, self.scene, self.colors[i], im);

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
			self.ais[i].IsClient = true;
			self.ais[i].buildMesh(THREE, self.scene, self.colors[i]);
		}})();


		// create a camera control
		//this.cameraControls	= new THREEx.DragPanControls(this.camera);
		this.cameraControls	= new AICRAFT.CameraControl(this.camera, this.players[this.myPnum], this.renderer.domElemen);
		
		// create a code emitter
		this.codeEmitter = new AICRAFT.CodeEmitter(this.cameraControls, this.players[this.myPnum], this.ais[this.myPnum], socket);

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

	},
	
	aiNameExist: function(ai_name) {
		this.ais.forEach(function(ai){
			if (ai.name === ai_name) {
				return true;}
		});
		return false;
	},

	networkReady: function(init_cb, animate_cb, syncPos_cb, syncKey_cb) {
		var self = this;
		self.socket = io.connect('/');
		self.socket.on('totalPlayers', function(data) {
			self.totalPlayers = data;
		});
		self.socket.on('connect', function(data) {
			self.myPnum = data;
		});
		//read player status from server
		self.socket.on('pi', function(data) {
			self.socket.players = AICRAFT.Engine.extractPacket(data);
			//read ai status from server
			self.socket.on('ai', function(data) {
				self.socket.ais = AICRAFT.Engine.extractPacket(data);
				if (self.myPnum != -1) {
					init_cb(self.socket);
					self.players[self.myPnum].connected = true;
					var ai_name = "aicraft"+self.myPnum.toString();
					self.ais[self.myPnum].name = ai_name;
					//finished reading and reported connected
					self.socket.emit('connected', [self.myPnum, self.ais[self.myPnum].name]);
					animate_cb();
					syncPos_cb();
					syncKey_cb();
				} else {
					alert('game is full');
					/* observe mode
					init_cb(self.socket);
					self.players[0].connected = true;
					animate_cb();
					syncPos_cb();
					*/
				}
			});
		});
	},

	syncPos: function(){
		var self = this;
		self.socket.on('p', function(data) {
			var players = AICRAFT.Engine.extractPacket(data).bindings;
			for (var i = 0; i<self.totalPlayers; i++) {
				self.players[i].setPos(Ammo,
					players[i].position[0],
					players[i].position[1],
					players[i].position[2],
					players[i].quaternion[0],
					players[i].quaternion[1],
					players[i].quaternion[2],
					players[i].quaternion[3],
					players[i].velocity[0],
					players[i].velocity[1],
					players[i].velocity[2],
					players[i].IsMoving[0],
					players[i].hp[0]);
			};
		});
		self.socket.on('a', function(data) {
			var ais = AICRAFT.Engine.extractPacket(data).bindings;
			for (var i = 0; i<self.totalPlayers; i++) {
				self.ais[i].setPos(Ammo,
					ais[i].position[0],
					ais[i].position[1],
					ais[i].position[2],
					ais[i].quaternion[0],
					ais[i].quaternion[1],
					ais[i].quaternion[2],
					ais[i].quaternion[3],
					ais[i].sightQuaternion[0],
					ais[i].sightQuaternion[1],
					ais[i].sightQuaternion[2],
					ais[i].sightQuaternion[3],
					ais[i].velocity[0],
					ais[i].velocity[1],
					ais[i].velocity[2],
					ais[i].IsMoving[0],
					ais[i].hp[0]);
			};
		});
	},

	syncKey: function() {
		var self = this;
		AICRAFT.requestKeyFrame(self.syncKey.bind(self), self.keyFPS);
		if (self.players[self.myPnum] === undefined || self.myPnum === undefined) {
			return;}
		if (self.players[self.myPnum].keycode != 0) {
			self.socket.emit("k", self.players[self.myPnum].keycode);
			self.players[self.myPnum].updateInput(self.codeEmitter);
		} else if((self.players[self.myPnum].keycode == 0) && (self.lastKeycode != 0)) {
			self.socket.emit("k", 0);
		};
		self.lastKeycode = self.players[self.myPnum].keycode;
		/*mouse disabled
		if (self.cameraControls.mouseDragOn === true) {
			var deltaX = self.cameraControls.deltaX * self.cameraControls.speed;
			self.socket.emit("m", deltaX);
			self.players[self.myPnum].rotate(deltaX);}
			*/
	},

	animate: function() {
		// update delta
		this.delta = this.clock.getDelta();

		var self = this;
        if ((self.players[self.myPnum].hp < 1) || (self.ais[self.myPnum].hp < 1)) {
            alert("your tream have lost!");    
            return;
        };

		requestAnimationFrame(self.animate.bind(self));

		// update graphics
        (function(){ for (var i=0; i<self.totalPlayers; i++) {
            self.players[i].physicAndGraphicUpdate(self.delta);
            self.ais[i].physicAndGraphicUpdate(self.delta);
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
		AICRAFT.v(-200,0,0), AICRAFT.v(200,0,0),/*x coord*/
		AICRAFT.v(0,-200,0), AICRAFT.v(0,200,0),/*y coord*/
		AICRAFT.v(0,0,-200), AICRAFT.v(0,0,200),/*z coord*/
		AICRAFT.v(200,1,0), AICRAFT.v(200,-1,0),/*x units*/
		AICRAFT.v(150,1,0), AICRAFT.v(150,-1,0),
		AICRAFT.v(100,1,0), AICRAFT.v(100,-1,0),
		AICRAFT.v(50,1,0), AICRAFT.v(50,-1,0),
		AICRAFT.v(-50,1,0), AICRAFT.v(-50,-1,0),
		AICRAFT.v(-100,1,0), AICRAFT.v(-100,-1,0),
		AICRAFT.v(-150,1,0), AICRAFT.v(-150,-1,0),
		AICRAFT.v(-200,1,0), AICRAFT.v(-200,-1,0),
		AICRAFT.v(1,200,0), AICRAFT.v(-1,200,0),/*y units*/
		AICRAFT.v(1,150,0), AICRAFT.v(-1,150,0),
		AICRAFT.v(1,100,0), AICRAFT.v(-1,100,0),
		AICRAFT.v(1,50,0), AICRAFT.v(-1,50,0),
		AICRAFT.v(1,-50,0), AICRAFT.v(-1,-50,0),
		AICRAFT.v(1,-100,0), AICRAFT.v(-1,-100,0),
		AICRAFT.v(1,-150,0), AICRAFT.v(-1,-150,0),
		AICRAFT.v(1,-200,0), AICRAFT.v(-1,-200,0),
		AICRAFT.v(0,1,200), AICRAFT.v(0,-1,200),/*z units*/
		AICRAFT.v(0,1,150), AICRAFT.v(0,-1,150),
		AICRAFT.v(0,1,100), AICRAFT.v(0,-1,100),
		AICRAFT.v(0,1,50), AICRAFT.v(0,-1,50),
		AICRAFT.v(0,1,-50), AICRAFT.v(0,-1,-50),
		AICRAFT.v(0,1,-100), AICRAFT.v(0,-1,-100),
		AICRAFT.v(0,1,-150), AICRAFT.v(0,-1,-150),
		AICRAFT.v(0,1,-200), AICRAFT.v(0,-1,-200)
	);
	var coordMat = new THREE.LineBasicMaterial({color: 0x000000, lineWidth:1});
	var coord = new THREE.Line(coordGeo, coordMat);
	coord.type = THREE.Lines;
	scene.add(coord);
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
	} else if (key == "code") {
		if (keycode & 64) {
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
	} else if (key == "q") {
		if (keycode & 32) {
			return true;
		} else {
			return false;
		};	
	};
	return false;
};
