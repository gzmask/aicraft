var AICRAFT = AICRAFT || {};
"undefined" !== typeof exports && null !== exports && (exports.AICRAFT = AICRAFT);
AICRAFT.GameObject = function(b, a, c, d, e, f, g) {
  this.position = {};
  this.position.x = b;
  this.position.y = a;
  this.position.z = c;
  this.quaternion = {};
  this.quaternion.x = d || 0;
  this.quaternion.y = e || 0;
  this.quaternion.z = f || 0;
  this.quaternion.w = void 0 === g ? 1 : g;
  this.phybody = this.mesh = void 0;
  this.width = 8;
  this.height = 1;
  this.depth = 8;
  this.radius = 5;
  this.mass = 1;
  this.friction = 3
};
AICRAFT.GameObject.prototype = {constructor:AICRAFT.GameObject, buildMesh:function(b) {
  this.mesh = new b.Mesh(new b.CubeGeometry(this.width, this.height, this.depth), new b.MeshLambertMaterial({color:16777215}));
  this.mesh.castShadow = !0;
  this.mesh.receiveShadow = !0;
  this.mesh.position.x = this.position.x;
  this.mesh.position.y = this.position.y;
  this.mesh.position.z = this.position.z;
  this.mesh.useQuaternion = !0;
  this.mesh.quaternion.set(this.quaternion.x, this.quaternion.y, this.quaternion.z, this.quaternion.w)
}, buildPhysic:function(b) {
  void 0 !== b && (Ammo = b);
  var b = new Ammo.btBoxShape(new Ammo.btVector3(this.width / 2, this.height / 2, this.depth / 2)), a = new Ammo.btTransform;
  a.setIdentity();
  a.setOrigin(new Ammo.btVector3(this.position.x, this.position.y, this.position.z));
  a.setRotation(new Ammo.btQuaternion(this.quaternion.x, this.quaternion.y, this.quaternion.z, this.quaternion.w));
  var c = 0 != this.mass, d = new Ammo.btVector3(0, 0, 0);
  c && b.calculateLocalInertia(this.mass, d);
  a = new Ammo.btDefaultMotionState(a);
  b = new Ammo.btRigidBodyConstructionInfo(this.mass, a, b, d);
  this.phybody = new Ammo.btRigidBody(b);
  this.phybody.setFriction(this.friction)
}, setPos:function(b, a, c, d, e, f, g, h) {
  void 0 !== b && (Ammo = b);
  b = new Ammo.btTransform;
  b.setIdentity();
  b.setOrigin(new Ammo.btVector3(a, c, d));
  b.setRotation(new Ammo.btQuaternion(e, f, g, h));
  this.position.x = a;
  this.position.y = c;
  this.position.z = d;
  this.quaternion.x = e;
  this.quaternion.y = f;
  this.quaternion.z = g;
  this.quaternion.w = h;
  this.phybody.getMotionState().setWorldTransform(b);
  this.phybody.setCenterOfMassTransform(b);
  this.phybody.activate()
}, physicAndGraphicUpdate:function(b) {
  this.phybody.getMotionState() && (this.phybody.getMotionState().getWorldTransform(b.trans), this.position.x = this.mesh.position.x = b.trans.getOrigin().x().toFixed(2), this.position.y = this.mesh.position.y = b.trans.getOrigin().y().toFixed(2), this.position.z = this.mesh.position.z = b.trans.getOrigin().z().toFixed(2), this.quaternion.x = this.mesh.quaternion.x = b.trans.getRotation().x(), this.quaternion.y = this.mesh.quaternion.y = b.trans.getRotation().y(), this.quaternion.z = this.mesh.quaternion.z = 
  b.trans.getRotation().z(), this.quaternion.w = this.mesh.quaternion.w = b.trans.getRotation().w())
}, physicUpdate:function(b) {
  this.phybody.getMotionState() && (this.phybody.getMotionState().getWorldTransform(b.trans), this.position.x = b.trans.getOrigin().x().toFixed(2), this.position.y = b.trans.getOrigin().y().toFixed(2), this.position.z = b.trans.getOrigin().z().toFixed(2), this.quaternion.x = b.trans.getRotation().x(), this.quaternion.y = b.trans.getRotation().y(), this.quaternion.z = b.trans.getRotation().z(), this.quaternion.w = b.trans.getRotation().w())
}};
AICRAFT.Ai = function(b, a, c, d, e, f, g) {
  AICRAFT.GameObject.call(this, b, a, c, d, e, f, g)
};
AICRAFT.Ai.prototype = new AICRAFT.GameObject;
AICRAFT.Ai.prototype.constructor = AICRAFT.Ai;
AICRAFT.Player = function(b, a, c, d, e, f, g) {
  this.maxSpeed = 20;
  this.acceleration = 4;
  this.connected = !1;
  this.keycode = 0;
  AICRAFT.GameObject.call(this, b, a, c, d, e, f, g)
};
AICRAFT.Player.prototype = new AICRAFT.GameObject;
AICRAFT.Player.prototype.constructor = AICRAFT.Player;
AICRAFT.Player.prototype.handleKeyDown = function(b, a) {
  "W" == String.fromCharCode(b.keyCode) ? a.keycode |= 8 : "A" == String.fromCharCode(b.keyCode) ? a.keycode |= 4 : "S" == String.fromCharCode(b.keyCode) ? a.keycode |= 2 : "D" == String.fromCharCode(b.keyCode) ? a.keycode |= 1 : "E" == String.fromCharCode(b.keyCode) && (a.keycode |= 16)
};
AICRAFT.Player.prototype.handleKeyUp = function(b, a) {
  "W" == String.fromCharCode(b.keyCode) ? a.keycode ^= 8 : "A" == String.fromCharCode(b.keyCode) ? a.keycode ^= 4 : "S" == String.fromCharCode(b.keyCode) ? a.keycode ^= 2 : "D" == String.fromCharCode(b.keyCode) ? a.keycode ^= 1 : "E" == String.fromCharCode(b.keyCode) && (a.keycode ^= 16)
};
AICRAFT.Player.prototype.updateInput = function(b) {
  void 0 !== b && (Ammo = b, console.log("hello"));
  var b = this.phybody.getLinearVelocity(), a = Math.sqrt(b.getX() * b.getX() + b.getY() * b.getY() + b.getZ() * b.getZ());
  AICRAFT.ClientEngine.key(this.keycode, "w") && a < this.maxSpeed && 1 > this.position.y && (this.phybody.activate(), b = new Ammo.btVector3(0, 0, 0 - this.acceleration), this.phybody.applyCentralImpulse(b));
  AICRAFT.ClientEngine.key(this.keycode, "a") && a < this.maxSpeed && 1 > this.position.y && (this.phybody.activate(), b = new Ammo.btVector3(0 - this.acceleration, 0, 0), this.phybody.applyCentralImpulse(b));
  AICRAFT.ClientEngine.key(this.keycode, "s") && a < this.maxSpeed && 1 > this.position.y && (this.phybody.activate(), b = new Ammo.btVector3(0, 0, this.acceleration), this.phybody.applyCentralImpulse(b));
  AICRAFT.ClientEngine.key(this.keycode, "d") && a < this.maxSpeed && 1 > this.position.y && (this.phybody.activate(), b = new Ammo.btVector3(this.acceleration, 0, 0), this.phybody.applyCentralImpulse(b));
  AICRAFT.ClientEngine.key(this.keycode, "e") && 0.1 > this.position.y && (this.phybody.activate(), b = new Ammo.btVector3(0, 1, 0), this.phybody.applyCentralImpulse(b))
};
AICRAFT.requestAnimationFrame = function(b) {
  return setTimeout(b, 1E3 / 60)
};
AICRAFT.requestNetworkFrame = function(b) {
  return setTimeout(b, 1E3 / 30)
};
AICRAFT.Engine = function() {
  this.dynamicsWorld = void 0;
  this.totalPlayers = 2;
  this.players = [];
  this.ais = []
};
AICRAFT.Engine.prototype = {constructor:AICRAFT.Engine, init:function(b, a) {
  var c = new a.btDefaultCollisionConfiguration, d = new a.btCollisionDispatcher(c), e = new a.btDbvtBroadphase, f = new a.btSequentialImpulseConstraintSolver;
  this.dynamicsWorld = new a.btDiscreteDynamicsWorld(d, e, f, c);
  this.dynamicsWorld.setGravity(new a.btVector3(0, -9.82, 0));
  this.dynamicsWorld.trans = new a.btTransform;
  this.dynamicsWorld.trans.setIdentity();
  c = new a.btBoxShape(new a.btVector3(400, 0.5, 400));
  e = new a.btTransform;
  e.setIdentity();
  e.setOrigin(new a.btVector3(0, -5.5, 0));
  d = new a.btVector3(0, 0, 0);
  e = new a.btDefaultMotionState(e);
  c = new a.btRigidBodyConstructionInfo(0, e, c, d);
  this.dynamicsWorld.addRigidBody(new a.btRigidBody(c));
  c = new a.btQuaternion;
  for(d = 0;d < this.totalPlayers;d++) {
    c.setEuler(0, 20, -30), this.players[d] = new AICRAFT.Player(-200 + Math.floor(401 * Math.random()), 25, -200 + Math.floor(301 * Math.random()), c.getX(), c.getY(), c.getZ(), c.getW()), this.players[d].buildPhysic(a), this.dynamicsWorld.addRigidBody(this.players[d].phybody), c.setEuler(0, 20, 30), this.ais[d] = new AICRAFT.Ai(this.players[d].position.x, 5, this.players[d].position.z - 5, c.getX(), c.getY(), c.getZ(), c.getW()), this.ais[d].buildPhysic(a), this.dynamicsWorld.addRigidBody(this.ais[d].phybody)
  }
}, networkInit:function(b) {
  var a = this;
  b.emit("totalPlayers", this.totalPlayers);
  b.emit("connect", AICRAFT.Engine.getNextAvailablePnum(this.players));
  b.on("connected", function(b) {
    b && (a.players[AICRAFT.Engine.getNextAvailablePnum(a.players)].connected = !0, console.log("Conected players:" + AICRAFT.Engine.getNextAvailablePnum(a.players)))
  });
  b.emit("pi", AICRAFT.Engine.encryptedPacket(this.players));
  b.emit("ai", AICRAFT.Engine.encryptedPacket(this.ais))
}, syncPos:function(b) {
  var a = this;
  AICRAFT.requestNetworkFrame(function() {
    a.syncPos(b)
  });
  b.emit("p", AICRAFT.Engine.encryptedPacket(a.players));
  b.emit("a", AICRAFT.Engine.encryptedPacket(a.ais))
}, syncKey:function(b) {
  for(var a = this, c = 0;c < a.totalPlayers;c++) {
    b.on("k" + c.toString(), function(b) {
      a.players[b[1]].keycode = b[0]
    })
  }
}, animate:function(b) {
  var a = this;
  AICRAFT.requestAnimationFrame(function() {
    a.animate()
  });
  a.players.forEach(function(a) {
    a.connected && a.updateInput(b)
  });
  a.dynamicsWorld.stepSimulation(1 / 30, 10);
  a.players.forEach(function(b) {
    b.physicUpdate(a.dynamicsWorld)
  });
  a.ais.forEach(function(b) {
    b.physicUpdate(a.dynamicsWorld)
  })
}};
AICRAFT.Engine.encryptedPacket = function(b) {
  var a = [];
  b.forEach(function(b) {
    a.push(parseFloat(b.position.x));
    a.push(parseFloat(b.position.y));
    a.push(parseFloat(b.position.z));
    a.push(b.quaternion.x);
    a.push(b.quaternion.y);
    a.push(b.quaternion.z);
    a.push(b.quaternion.w);
    a.push(b.phybody.getAngularVelocity().getX());
    a.push(b.phybody.getAngularVelocity().getY());
    a.push(b.phybody.getAngularVelocity().getZ())
  });
  return a
};
AICRAFT.Engine.extractPacket = function(b) {
  if(0 == b.length % 10) {
    for(var a = '({"bindings":[', c = 0;c < b.length;c += 10) {
      a += '{"position":', a += "[" + b[c] + "," + b[c + 1] + "," + b[c + 2] + "],", a += '"quaternion":', a += "[" + b[c + 3] + "," + b[c + 4] + "," + b[c + 5] + "," + b[c + 6] + "],", a += '"velocity":', a += "[" + b[c + 7] + "," + b[c + 8] + "," + b[c + 9] + "]", a += "},"
    }
    return eval(a + "]})")
  }
};
AICRAFT.Engine.makeJson = function(b) {
  var a = '({"bindings":[';
  b.forEach(function(b) {
    a += '{"position":';
    a += "[" + b.position.x + "," + b.position.y + "," + b.position.z + "],";
    a += '"quaternion":';
    a += "[" + b.quaternion.x + "," + b.quaternion.y + "," + b.quaternion.z + "," + b.quaternion.w + "],";
    a += '"velocity":';
    a += "[" + b.phybody.getAngularVelocity().getX() + "," + b.phybody.getAngularVelocity().getY() + "," + b.phybody.getAngularVelocity().getZ() + "]";
    a += "},"
  });
  a += "]})";
  return eval(a)
};
AICRAFT.Engine.getNextAvailablePnum = function(b) {
  for(var a = 0;a < b.length;a++) {
    if(!b[a].connected) {
      return a
    }
  }
  return-1
};
AICRAFT.ClientEngine = function() {
  this.myPnum = this.totalPlayers = this.dynamicsWorld = this.ground = this.cameraControl = this.camera = this.renderer = this.scene = this.stats = void 0;
  this.players = [];
  this.ais = []
};
AICRAFT.ClientEngine.prototype = {constructor:AICRAFT.ClientEngine, init:function(b) {
  var a = this;
  if(Detector.webgl) {
    this.renderer = new THREE.WebGLRenderer({antialias:!0, preserveDrawingBuffer:!0}), this.renderer.setClearColorHex(12303291, 1)
  }else {
    return Detector.addGetWebGLMessage(), !0
  }
  this.renderer.setSize(window.innerWidth, window.innerHeight);
  this.renderer.shadowMapEnabled = !0;
  document.getElementById("container").appendChild(this.renderer.domElement);
  this.stats = new Stats;
  this.stats.domElement.style.position = "absolute";
  this.stats.domElement.style.bottom = "0px";
  document.body.appendChild(this.stats.domElement);
  this.scene = new THREE.Scene;
  (function() {
    var b = new Ammo.btDefaultCollisionConfiguration, c = new Ammo.btCollisionDispatcher(b), d = new Ammo.btDbvtBroadphase, e = new Ammo.btSequentialImpulseConstraintSolver;
    a.dynamicsWorld = new Ammo.btDiscreteDynamicsWorld(c, d, e, b);
    a.dynamicsWorld.setGravity(new Ammo.btVector3(0, -9.82, 0));
    a.dynamicsWorld.trans = new Ammo.btTransform;
    a.dynamicsWorld.trans.setIdentity()
  })();
  this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1E4);
  this.camera.position.set(0, 0, 200);
  this.scene.add(this.camera);
  this.cameraControls = new THREEx.DragPanControls(this.camera);
  THREEx.WindowResize.bind(this.renderer, this.camera);
  THREEx.Screenshot.bindKey(this.renderer);
  THREEx.FullScreen.available() && (THREEx.FullScreen.bindKey(), document.getElementById("inlineDoc").innerHTML += "- <i>f</i> for fullscreen");
  var c = new THREE.SpotLight;
  c.position.set(170, 330, -160);
  c.castShadow = !0;
  this.scene.add(c);
  var c = new THREE.PlaneGeometry(400, 400, 10, 10), d = new THREE.MeshLambertMaterial({color:16777215});
  this.ground = new THREE.Mesh(c, d);
  this.ground.rotation.x = -Math.PI / 2;
  this.ground.position.y = -5;
  this.ground.receiveShadow = !0;
  this.scene.add(this.ground);
  (function() {
    var b = new Ammo.btBoxShape(new Ammo.btVector3(400, 0.5, 400)), c = new Ammo.btTransform;
    c.setIdentity();
    c.setOrigin(new Ammo.btVector3(0, -5.5, 0));
    var d = new Ammo.btVector3(0, 0, 0), c = new Ammo.btDefaultMotionState(c), b = new Ammo.btRigidBodyConstructionInfo(0, c, b, d);
    a.ground.phybody = new Ammo.btRigidBody(b);
    a.dynamicsWorld.addRigidBody(a.ground.phybody)
  })();
  var e = new THREE.Quaternion;
  (function() {
    for(var c = 0;c < a.totalPlayers;c++) {
      e.setFromEuler(new THREE.Vector3(-30, -20, 0)), a.players[c] = new AICRAFT.Player(b.players.bindings[c].position[0], b.players.bindings[c].position[1], b.players.bindings[c].position[2], b.players.bindings[c].quaternion[0], b.players.bindings[c].quaternion[1], b.players.bindings[c].quaternion[2], b.players.bindings[c].quaternion[3]), a.players[c].buildMesh(THREE), a.scene.add(a.players[c].mesh), a.players[c].buildPhysic(Ammo), a.dynamicsWorld.addRigidBody(a.players[c].phybody), e.setFromEuler(new THREE.Vector3(30, 
      -20, 0)), a.ais[c] = new AICRAFT.Ai(b.ais.bindings[c].position[0], b.ais.bindings[c].position[1], b.ais.bindings[c].position[2], b.ais.bindings[c].quaternion[0], b.ais.bindings[c].quaternion[1], b.ais.bindings[c].quaternion[2], b.ais.bindings[c].quaternion[3]), a.ais[c].buildMesh(THREE), a.scene.add(a.ais[c].mesh), a.ais[c].buildPhysic(Ammo), a.dynamicsWorld.addRigidBody(a.ais[c].phybody)
    }
  })();
  document.addEventListener("keydown", function(b) {
    a.players[a.myPnum].handleKeyDown(b, a.players[a.myPnum])
  }, !1);
  document.addEventListener("keyup", function(b) {
    a.players[a.myPnum].handleKeyUp(b, a.players[a.myPnum])
  }, !1);
  AICRAFT.ClientEngine.coordHelper(this.scene)
}, networkReady:function(b, a) {
  var c = this, d = io.connect("/");
  d.on("totalPlayers", function(b) {
    c.totalPlayers = b
  });
  d.on("connect", function(b) {
    c.myPnum = b
  });
  d.on("pi", function(e) {
    d.players = AICRAFT.Engine.extractPacket(e);
    d.on("ai", function(e) {
      d.ais = AICRAFT.Engine.extractPacket(e);
      -1 != c.myPnum ? (b(d), c.players[c.myPnum].connected = !0, d.emit("connected", !0), a()) : alert("game is full")
    })
  })
}, syncPos:function() {
  var b = this, a = io.connect("/");
  a.on("p", function(a) {
    for(var a = AICRAFT.Engine.extractPacket(a).bindings, d = 0;d < b.totalPlayers;d++) {
      b.players[d].setPos(Ammo, a[d].position[0], a[d].position[1], a[d].position[2], a[d].quaternion[0], a[d].quaternion[1], a[d].quaternion[2], a[d].quaternion[3])
    }
  });
  a.on("a", function(a) {
    for(var a = AICRAFT.Engine.extractPacket(a).bindings, d = 0;d < b.totalPlayers;d++) {
      b.ais[d].setPos(Ammo, a[d].position[0], a[d].position[1], a[d].position[2], a[d].quaternion[0], a[d].quaternion[1], a[d].quaternion[2], a[d].quaternion[3])
    }
  })
}, syncKey:function() {
  AICRAFT.requestNetworkFrame(this.syncKey.bind(this));
  var b = io.connect("/");
  void 0 !== this.myPnum && 0 != this.players[this.myPnum].keycode && b.emit("k" + this.myPnum.toString(), [this.players[this.myPnum].keycode, this.myPnum])
}, animate:function() {
  requestAnimationFrame(this.animate.bind(this));
  this.players[this.myPnum].updateInput();
  this.dynamicsWorld.stepSimulation(1 / 30, 10);
  for(var b = 0;b < this.totalPlayers;b++) {
    this.players[b].physicAndGraphicUpdate(this.dynamicsWorld), this.ais[b].physicAndGraphicUpdate(this.dynamicsWorld)
  }
  this.cameraControls.update();
  this.render();
  this.stats.update()
}, render:function() {
  this.renderer.render(this.scene, this.camera)
}};
AICRAFT.ClientEngine.coordHelper = function(b) {
  var a = new THREE.Geometry;
  a.vertices.push(AICRAFT.ClientEngine.v(-200, 0, 0), AICRAFT.ClientEngine.v(200, 0, 0), AICRAFT.ClientEngine.v(0, -200, 0), AICRAFT.ClientEngine.v(0, 200, 0), AICRAFT.ClientEngine.v(0, 0, -200), AICRAFT.ClientEngine.v(0, 0, 200), AICRAFT.ClientEngine.v(200, 1, 0), AICRAFT.ClientEngine.v(200, -1, 0), AICRAFT.ClientEngine.v(150, 1, 0), AICRAFT.ClientEngine.v(150, -1, 0), AICRAFT.ClientEngine.v(100, 1, 0), AICRAFT.ClientEngine.v(100, -1, 0), AICRAFT.ClientEngine.v(50, 1, 0), AICRAFT.ClientEngine.v(50, 
  -1, 0), AICRAFT.ClientEngine.v(-50, 1, 0), AICRAFT.ClientEngine.v(-50, -1, 0), AICRAFT.ClientEngine.v(-100, 1, 0), AICRAFT.ClientEngine.v(-100, -1, 0), AICRAFT.ClientEngine.v(-150, 1, 0), AICRAFT.ClientEngine.v(-150, -1, 0), AICRAFT.ClientEngine.v(-200, 1, 0), AICRAFT.ClientEngine.v(-200, -1, 0), AICRAFT.ClientEngine.v(1, 200, 0), AICRAFT.ClientEngine.v(-1, 200, 0), AICRAFT.ClientEngine.v(1, 150, 0), AICRAFT.ClientEngine.v(-1, 150, 0), AICRAFT.ClientEngine.v(1, 100, 0), AICRAFT.ClientEngine.v(-1, 
  100, 0), AICRAFT.ClientEngine.v(1, 50, 0), AICRAFT.ClientEngine.v(-1, 50, 0), AICRAFT.ClientEngine.v(1, -50, 0), AICRAFT.ClientEngine.v(-1, -50, 0), AICRAFT.ClientEngine.v(1, -100, 0), AICRAFT.ClientEngine.v(-1, -100, 0), AICRAFT.ClientEngine.v(1, -150, 0), AICRAFT.ClientEngine.v(-1, -150, 0), AICRAFT.ClientEngine.v(1, -200, 0), AICRAFT.ClientEngine.v(-1, -200, 0), AICRAFT.ClientEngine.v(0, 1, 200), AICRAFT.ClientEngine.v(0, -1, 200), AICRAFT.ClientEngine.v(0, 1, 150), AICRAFT.ClientEngine.v(0, 
  -1, 150), AICRAFT.ClientEngine.v(0, 1, 100), AICRAFT.ClientEngine.v(0, -1, 100), AICRAFT.ClientEngine.v(0, 1, 50), AICRAFT.ClientEngine.v(0, -1, 50), AICRAFT.ClientEngine.v(0, 1, -50), AICRAFT.ClientEngine.v(0, -1, -50), AICRAFT.ClientEngine.v(0, 1, -100), AICRAFT.ClientEngine.v(0, -1, -100), AICRAFT.ClientEngine.v(0, 1, -150), AICRAFT.ClientEngine.v(0, -1, -150), AICRAFT.ClientEngine.v(0, 1, -200), AICRAFT.ClientEngine.v(0, -1, -200));
  var c = new THREE.LineBasicMaterial({color:0, lineWidth:1}), a = new THREE.Line(a, c);
  a.type = THREE.Lines;
  b.add(a)
};
AICRAFT.ClientEngine.v = function(b, a, c) {
  return new THREE.Vertex(new THREE.Vector3(b, a, c))
};
AICRAFT.ClientEngine.key = function(b, a) {
  return"w" == a ? b & 8 ? !0 : !1 : "a" == a ? b & 4 ? !0 : !1 : "s" == a ? b & 2 ? !0 : !1 : "d" == a ? b & 1 ? !0 : !1 : "e" == a ? b & 16 ? !0 : !1 : !1
};

