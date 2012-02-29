var AICRAFT = AICRAFT || {};
"undefined" !== typeof exports && null !== exports && (exports.AICRAFT = AICRAFT);
AICRAFT.GameObject = function(a, b, c, d, f, e, h) {
  this.position = {};
  this.position.x = a;
  this.position.y = b;
  this.position.z = c;
  this.quaternion = {};
  this.quaternion.x = d || 0;
  this.quaternion.y = f || 0;
  this.quaternion.z = e || 0;
  this.quaternion.w = void 0 === h ? 1 : h;
  this.phybody = this.mesh = void 0;
  this.width = 8;
  this.height = 1;
  this.depth = 8;
  this.radius = 5;
  this.mass = 1;
  this.friction = 3
};
AICRAFT.GameObject.prototype = {constructor:AICRAFT.GameObject, buildMesh:function(a, b) {
  this.mesh = new a.Mesh(new a.CubeGeometry(this.width, this.height, this.depth), new a.MeshLambertMaterial({color:16777215}));
  this.mesh.castShadow = !0;
  this.mesh.receiveShadow = !0;
  this.mesh.position.x = this.position.x;
  this.mesh.position.y = this.position.y;
  this.mesh.position.z = this.position.z;
  this.mesh.useQuaternion = !0;
  this.mesh.quaternion.set(this.quaternion.x, this.quaternion.y, this.quaternion.z, this.quaternion.w);
  b.add(this.mesh)
}, buildPhysic:function(a) {
  void 0 !== a && (Ammo = a);
  var a = new Ammo.btBoxShape(new Ammo.btVector3(this.width / 2, this.height / 2, this.depth / 2)), b = new Ammo.btTransform;
  b.setIdentity();
  b.setOrigin(new Ammo.btVector3(this.position.x, this.position.y, this.position.z));
  b.setRotation(new Ammo.btQuaternion(this.quaternion.x, this.quaternion.y, this.quaternion.z, this.quaternion.w));
  var c = 0 != this.mass, d = new Ammo.btVector3(0, 0, 0);
  c && a.calculateLocalInertia(this.mass, d);
  b = new Ammo.btDefaultMotionState(b);
  a = new Ammo.btRigidBodyConstructionInfo(this.mass, b, a, d);
  this.phybody = new Ammo.btRigidBody(a);
  this.phybody.setFriction(this.friction)
}, setPos:function(a, b, c, d, f, e, h, g, j, i, k) {
  void 0 !== a && (Ammo = a);
  a = new Ammo.btTransform;
  a.setIdentity();
  a.setOrigin(new Ammo.btVector3(b, c, d));
  a.setRotation(new Ammo.btQuaternion(f, e, h, g));
  this.position.x = b;
  this.position.y = c;
  this.position.z = d;
  this.quaternion.x = f;
  this.quaternion.y = e;
  this.quaternion.z = h;
  this.quaternion.w = g;
  this.phybody.activate();
  this.phybody.getMotionState().setWorldTransform(a);
  this.phybody.setCenterOfMassTransform(a);
  this.phybody.setAngularVelocity(new Ammo.btVector3(j, i, k))
}, physicAndGraphicUpdate:function(a) {
  this.phybody.getMotionState() && (this.phybody.getMotionState().getWorldTransform(a.trans), this.position.x = this.mesh.position.x = a.trans.getOrigin().x().toFixed(2), this.position.y = this.mesh.position.y = a.trans.getOrigin().y().toFixed(2), this.position.z = this.mesh.position.z = a.trans.getOrigin().z().toFixed(2), this.quaternion.x = this.mesh.quaternion.x = a.trans.getRotation().x(), this.quaternion.y = this.mesh.quaternion.y = a.trans.getRotation().y(), this.quaternion.z = this.mesh.quaternion.z = 
  a.trans.getRotation().z(), this.quaternion.w = this.mesh.quaternion.w = a.trans.getRotation().w())
}, physicUpdate:function(a) {
  this.phybody.getMotionState() && (this.phybody.getMotionState().getWorldTransform(a.trans), this.position.x = a.trans.getOrigin().x().toFixed(2), this.position.y = a.trans.getOrigin().y().toFixed(2), this.position.z = a.trans.getOrigin().z().toFixed(2), this.quaternion.x = a.trans.getRotation().x(), this.quaternion.y = a.trans.getRotation().y(), this.quaternion.z = a.trans.getRotation().z(), this.quaternion.w = a.trans.getRotation().w())
}};
AICRAFT.Ai = function(a, b, c, d, f, e, h, g) {
  AICRAFT.GameObject.call(this, a, b, c, d, f, e, h);
  this.Ammo = void 0 !== g ? g : Ammo;
  this.sight = void 0;
  this.maxSpeed = 10;
  this.acceleration = 28;
  this.turnLock = this.aheadLock = this.codeUploading = !1;
  this.hp = 100
};
AICRAFT.Ai.prototype = new AICRAFT.GameObject;
AICRAFT.Ai.prototype.constructor = AICRAFT.Ai;
AICRAFT.Ai.prototype.buildMesh = function(a, b) {
  AICRAFT.GameObject.prototype.buildMesh.call(this, a, b);
  var c = new a.Geometry;
  c.vertices.push(AICRAFT.v(0, 0, 0), AICRAFT.v(-84.5, 0, -260), AICRAFT.v(0, 0, 0), AICRAFT.v(-47.6, 0, -267.8), AICRAFT.v(0, 0, 0), AICRAFT.v(0, 0, -273), AICRAFT.v(0, 0, 0), AICRAFT.v(47.6, 0, -267.8), AICRAFT.v(0, 0, 0), AICRAFT.v(84.5, 0, -260));
  var d = new a.LineBasicMaterial({color:3407667, lineWidth:1});
  this.sight = new a.Line(c, d);
  this.sight.type = a.Lines;
  this.sight.useQuaternion = !0;
  this.sight.position.x = this.position.x;
  this.sight.position.y = this.position.y;
  this.sight.position.z = this.position.z;
  this.sight.quaternion.x = this.quaternion.x;
  this.sight.quaternion.y = this.quaternion.y;
  this.sight.quaternion.z = this.quaternion.z;
  this.sight.quaternion.w = this.quaternion.w;
  b.add(this.sight)
};
AICRAFT.Ai.prototype.physicAndGraphicUpdate = function(a) {
  AICRAFT.GameObject.prototype.physicAndGraphicUpdate.call(this, a);
  this.sight.position.x = this.position.x;
  this.sight.position.y = this.position.y;
  this.sight.position.z = this.position.z;
  this.sight.quaternion.x = this.quaternion.x;
  this.sight.quaternion.y = this.quaternion.y;
  this.sight.quaternion.z = this.quaternion.z;
  this.sight.quaternion.w = this.quaternion.w
};
AICRAFT.Ai.prototype.back = function(a, b) {
  AICRAFT.Ai.move(a, b, !1, this)
};
AICRAFT.Ai.prototype.ahead = function(a, b) {
  AICRAFT.Ai.move(a, b, !0, this)
};
AICRAFT.Ai.prototype.turnRight = function(a, b) {
  0 < a ? AICRAFT.Ai.turn(a, b, !1, this) : AICRAFT.Ai.turn(-1 * a, b, !0, this)
};
AICRAFT.Ai.prototype.turnLeft = function(a, b) {
  0 < a ? AICRAFT.Ai.turn(a, b, !0, this) : AICRAFT.Ai.turn(-1 * a, b, !1, this)
};
AICRAFT.Ai.turn = function(a, b, c, d) {
  d.phybody.setFriction(d.friction);
  d.aheadLock = !1;
  if(1 > a || 1 > d.hp || d.codeUploading) {
    return void 0 !== b && b(), !1
  }
  var f;
  f = !0 == c ? 1 : -1;
  d.phybody.activate();
  d.phybody.setAngularVelocity(new d.Ammo.btVector3(0, 0, 0));
  d.phybody.setLinearVelocity(new d.Ammo.btVector3(0, 0, 0));
  d.aheadLock = !0;
  d.phybody.setFriction(0);
  d.turnLock || d.phybody.applyTorqueImpulse(new d.Ammo.btVector3(0, 4 * f, 0));
  setTimeout(function() {
    AICRAFT.Ai.turn(a - 2, b, c, d)
  }, 50)
};
AICRAFT.Ai.move = function(a, b, c, d) {
  if(1 > a || 1 > d.hp || d.codeUploading) {
    return void 0 !== b && b(), !1
  }
  var f = d.phybody.getLinearVelocity(), f = Math.sqrt(f.getX() * f.getX() + f.getY() * f.getY() + f.getZ() * f.getZ());
  d.phybody.activate();
  var e = d.phybody.getOrientation(), h = new d.Ammo.btTransform;
  h.setIdentity();
  h.setRotation(e);
  e = new d.Ammo.btVector3(0, 0, -1);
  e = h.op_mul(e);
  for(h = 0;h < d.acceleration;h++) {
    e.setX(1.1 * e.getX()), e.setY(1.1 * e.getY()), e.setZ(1.1 * e.getZ())
  }
  c || (e.setX(-1 * e.getX()), e.setY(-1 * e.getY()), e.setZ(-1 * e.getZ()));
  f < d.maxSpeed && !d.aheadLock && d.phybody.applyCentralImpulse(e);
  setTimeout(function() {
    AICRAFT.Ai.move(a - 1, b, c, d)
  }, 500)
};
AICRAFT.Player = function(a, b, c, d, f, e, h) {
  AICRAFT.GameObject.call(this, a, b, c, d, f, e, h);
  this.maxSpeed = 20;
  this.acceleration = 4;
  this.connected = !1;
  this.keycode = 0
};
AICRAFT.Player.prototype = new AICRAFT.GameObject;
AICRAFT.Player.prototype.constructor = AICRAFT.Player;
AICRAFT.Player.prototype.handleKeyDown = function(a, b) {
  "W" == String.fromCharCode(a.keyCode) ? b.keycode |= 8 : "A" == String.fromCharCode(a.keyCode) ? b.keycode |= 4 : "S" == String.fromCharCode(a.keyCode) ? b.keycode |= 2 : "D" == String.fromCharCode(a.keyCode) ? b.keycode |= 1 : "E" == String.fromCharCode(a.keyCode) && (b.keycode |= 16)
};
AICRAFT.Player.prototype.handleKeyUp = function(a, b) {
  "W" == String.fromCharCode(a.keyCode) ? b.keycode ^= 8 : "A" == String.fromCharCode(a.keyCode) ? b.keycode ^= 4 : "S" == String.fromCharCode(a.keyCode) ? b.keycode ^= 2 : "D" == String.fromCharCode(a.keyCode) ? b.keycode ^= 1 : "E" == String.fromCharCode(a.keyCode) && (b.keycode ^= 16)
};
AICRAFT.Player.prototype.updateInput = function(a) {
  void 0 !== a && (Ammo = a);
  var a = this.phybody.getLinearVelocity(), b = Math.sqrt(a.getX() * a.getX() + a.getY() * a.getY() + a.getZ() * a.getZ());
  AICRAFT.ClientEngine.key(this.keycode, "w") && b < this.maxSpeed && 1 > this.position.y && (this.phybody.activate(), a = new Ammo.btVector3(0, 0, 0 - this.acceleration), this.phybody.applyCentralImpulse(a));
  AICRAFT.ClientEngine.key(this.keycode, "a") && b < this.maxSpeed && 1 > this.position.y && (this.phybody.activate(), a = new Ammo.btVector3(0 - this.acceleration, 0, 0), this.phybody.applyCentralImpulse(a));
  AICRAFT.ClientEngine.key(this.keycode, "s") && b < this.maxSpeed && 1 > this.position.y && (this.phybody.activate(), a = new Ammo.btVector3(0, 0, this.acceleration), this.phybody.applyCentralImpulse(a));
  AICRAFT.ClientEngine.key(this.keycode, "d") && b < this.maxSpeed && 1 > this.position.y && (this.phybody.activate(), a = new Ammo.btVector3(this.acceleration, 0, 0), this.phybody.applyCentralImpulse(a));
  AICRAFT.ClientEngine.key(this.keycode, "e") && 0.1 > this.position.y && (this.phybody.activate(), a = new Ammo.btVector3(0, 1, 0), this.phybody.applyCentralImpulse(a))
};
AICRAFT.requestAnimationFrame = function(a, b) {
  return setTimeout(a, 1E3 / b)
};
AICRAFT.requestPosFrame = function(a, b) {
  return setTimeout(a, 1E3 / b)
};
AICRAFT.requestKeyFrame = function(a, b) {
  return setTimeout(a, 1E3 / b)
};
AICRAFT.v = function(a, b, c) {
  return new THREE.Vertex(new THREE.Vector3(a, b, c))
};
AICRAFT.Engine = function() {
  this.dynamicsWorld = void 0;
  this.totalPlayers = 2;
  this.players = [];
  this.ais = [];
  this.animateFPS = 60;
  this.posFPS = 20;
  this.phyFPS = 30
};
AICRAFT.Engine.prototype = {constructor:AICRAFT.Engine, init:function(a, b) {
  var c = this, d = new b.btDefaultCollisionConfiguration, f = new b.btCollisionDispatcher(d), e = new b.btDbvtBroadphase, h = new b.btSequentialImpulseConstraintSolver;
  this.dynamicsWorld = new b.btDiscreteDynamicsWorld(f, e, h, d);
  this.dynamicsWorld.setGravity(new b.btVector3(0, -9.82, 0));
  this.dynamicsWorld.trans = new b.btTransform;
  this.dynamicsWorld.trans.setIdentity();
  (function() {
    var a = new b.btBoxShape(new b.btVector3(200, 0.5, 200)), d = new b.btTransform;
    d.setIdentity();
    d.setOrigin(new b.btVector3(0, -5.5, 0));
    var e = 0, g = 0 != e, h = new b.btVector3(0, 0, 0);
    g && a.calculateLocalInertia(e, h);
    g = new b.btDefaultMotionState(d);
    e = new b.btRigidBodyConstructionInfo(e, g, a, h);
    e = new b.btRigidBody(e);
    c.dynamicsWorld.addRigidBody(e);
    a = new b.btBoxShape(new b.btVector3(200, 15, 0.5));
    d = new b.btTransform;
    d.setIdentity();
    d.setOrigin(new b.btVector3(0, -5.5, -200));
    e = 0;
    g = 0 != e;
    h = new b.btVector3(0, 0, 0);
    g && a.calculateLocalInertia(e, h);
    g = new b.btDefaultMotionState(d);
    e = new b.btRigidBodyConstructionInfo(e, g, a, h);
    e = new b.btRigidBody(e);
    c.dynamicsWorld.addRigidBody(e);
    a = new b.btBoxShape(new b.btVector3(0.5, 15, 200));
    d = new b.btTransform;
    d.setIdentity();
    d.setOrigin(new b.btVector3(200, -5.5, 0));
    e = 0;
    g = 0 != e;
    h = new b.btVector3(0, 0, 0);
    g && a.calculateLocalInertia(e, h);
    g = new b.btDefaultMotionState(d);
    e = new b.btRigidBodyConstructionInfo(e, g, a, h);
    e = new b.btRigidBody(e);
    c.dynamicsWorld.addRigidBody(e);
    a = new b.btBoxShape(new b.btVector3(200, 15, 0.5));
    d = new b.btTransform;
    d.setIdentity();
    d.setOrigin(new b.btVector3(0, -5.5, 200));
    e = 0;
    g = 0 != e;
    h = new b.btVector3(0, 0, 0);
    g && a.calculateLocalInertia(e, h);
    g = new b.btDefaultMotionState(d);
    e = new b.btRigidBodyConstructionInfo(e, g, a, h);
    e = new b.btRigidBody(e);
    c.dynamicsWorld.addRigidBody(e);
    a = new b.btBoxShape(new b.btVector3(0.5, 15, 200));
    d = new b.btTransform;
    d.setIdentity();
    d.setOrigin(new b.btVector3(-200, -5.5, 0));
    e = 0;
    g = 0 != e;
    h = new b.btVector3(0, 0, 0);
    g && a.calculateLocalInertia(e, h);
    g = new b.btDefaultMotionState(d);
    e = new b.btRigidBodyConstructionInfo(e, g, a, h);
    e = new b.btRigidBody(e);
    c.dynamicsWorld.addRigidBody(e)
  })();
  var g = new b.btQuaternion;
  (function() {
    for(var a = 0;a < c.totalPlayers;a++) {
      g.setEuler(0, 0, 0), c.players[a] = new AICRAFT.Player(-150 + 301 * Math.random(), 0, -150 + 301 * Math.random(), g.getX(), g.getY(), g.getZ(), g.getW()), c.players[a].buildPhysic(b), c.dynamicsWorld.addRigidBody(c.players[a].phybody), g.setEuler(360 * Math.random(), 0, 0), c.ais[a] = new AICRAFT.Ai(c.players[a].position.x, 0, c.players[a].position.z - 15, g.getX(), g.getY(), g.getZ(), g.getW(), b), c.ais[a].buildPhysic(b), c.dynamicsWorld.addRigidBody(c.ais[a].phybody)
    }
  })()
}, networkInit:function(a) {
  var b = this;
  a.emit("totalPlayers", this.totalPlayers);
  a.emit("connect", AICRAFT.Engine.getNextAvailablePnum(this.players));
  a.on("connected", function(c) {
    if(b.players[c].connected) {
      return!1
    }
    console.log("Conected players:" + c);
    b.players[c].connected = !0;
    a.set("Pnum", c)
  });
  a.emit("pi", AICRAFT.Engine.encryptedPacket(this.players));
  a.emit("ai", AICRAFT.Engine.encryptedPacket(this.ais));
  a.on("disconnect", function() {
    a.get("Pnum", function(a, d) {
      void 0 !== d && (b.players[d].connected = !1)
    })
  })
}, syncPos:function(a) {
  var b = this;
  AICRAFT.requestPosFrame(function() {
    b.syncPos(a)
  }, b.posFPS);
  a.emit("p", AICRAFT.Engine.encryptedPacket(b.players));
  a.emit("a", AICRAFT.Engine.encryptedPacket(b.ais))
}, syncKey:function(a, b) {
  var c = this;
  a.on("k", function(d) {
    a.get("Pnum", function(a, e) {
      c.players[e].keycode = d;
      c.players[e].updateInput(b)
    })
  })
}, animate:function() {
  var a = this;
  AICRAFT.requestAnimationFrame(function() {
    a.animate()
  }, a.animateFPS);
  a.dynamicsWorld.stepSimulation(1 / a.phyFPS, 10);
  a.players.forEach(function(b) {
    b.physicUpdate(a.dynamicsWorld)
  });
  a.ais.forEach(function(b) {
    b.physicUpdate(a.dynamicsWorld)
  })
}};
AICRAFT.Engine.encryptedPacket = function(a) {
  var b = [];
  a.forEach(function(a) {
    b.push(parseFloat(a.position.x));
    b.push(parseFloat(a.position.y));
    b.push(parseFloat(a.position.z));
    b.push(a.quaternion.x);
    b.push(a.quaternion.y);
    b.push(a.quaternion.z);
    b.push(a.quaternion.w);
    b.push(a.phybody.getAngularVelocity().getX());
    b.push(a.phybody.getAngularVelocity().getY());
    b.push(a.phybody.getAngularVelocity().getZ())
  });
  return b
};
AICRAFT.Engine.extractPacket = function(a) {
  if(0 == a.length % 10) {
    for(var b = '({"bindings":[', c = 0;c < a.length;c += 10) {
      b += '{"position":', b += "[" + a[c] + "," + a[c + 1] + "," + a[c + 2] + "],", b += '"quaternion":', b += "[" + a[c + 3] + "," + a[c + 4] + "," + a[c + 5] + "," + a[c + 6] + "],", b += '"velocity":', b += "[" + a[c + 7] + "," + a[c + 8] + "," + a[c + 9] + "]", b += "},"
    }
    return eval(b + "]})")
  }
};
AICRAFT.Engine.getNextAvailablePnum = function(a) {
  for(var b = 0;b < a.length;b++) {
    if(!a[b].connected) {
      return b
    }
  }
  return-1
};
AICRAFT.Engine.makeJson = function(a) {
  var b = '({"bindings":[';
  a.forEach(function(a) {
    b += '{"position":';
    b += "[" + a.position.x + "," + a.position.y + "," + a.position.z + "],";
    b += '"quaternion":';
    b += "[" + a.quaternion.x + "," + a.quaternion.y + "," + a.quaternion.z + "," + a.quaternion.w + "],";
    b += '"velocity":';
    b += "[" + a.phybody.getAngularVelocity().getX() + "," + a.phybody.getAngularVelocity().getY() + "," + a.phybody.getAngularVelocity().getZ() + "]";
    b += "},"
  });
  b += "]})";
  return eval(b)
};
AICRAFT.AIEngine = function() {
  this.templateStr = void 0;
  this.ais = []
};
AICRAFT.AIEngine.prototype = {constructor:AICRAFT.AIEngine, loadAI:function(a, b, c) {
  var d = this.templateStr.replace(/ai_name_to_replace/g, "AI_" + c.toString());
  eval(d);
  eval(a);
  eval("var AI = AICRAFT.AI_" + c.toString());
  this.ais.push(new AI(b))
}, stepSimulation:function() {
  this.ais.forEach(function(a) {
    a.run()
  })
}};
AICRAFT.ClientEngine = function() {
  this.phyFPS = this.keyFPS = 30;
  this.myPnum = this.totalPlayers = this.dynamicsWorld = this.ground = this.cameraControl = this.camera = this.renderer = this.scene = this.stats = void 0;
  this.players = [];
  this.ais = [];
  this.lastKeycode = 0
};
AICRAFT.ClientEngine.prototype = {constructor:AICRAFT.ClientEngine, init:function(a) {
  var b = this;
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
    var a = new Ammo.btDefaultCollisionConfiguration, d = new Ammo.btCollisionDispatcher(a), c = new Ammo.btDbvtBroadphase, f = new Ammo.btSequentialImpulseConstraintSolver;
    b.dynamicsWorld = new Ammo.btDiscreteDynamicsWorld(d, c, f, a);
    b.dynamicsWorld.setGravity(new Ammo.btVector3(0, -9.82, 0));
    b.dynamicsWorld.trans = new Ammo.btTransform;
    b.dynamicsWorld.trans.setIdentity()
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
    var a = new Ammo.btBoxShape(new Ammo.btVector3(200, 0.5, 200)), d = new Ammo.btTransform;
    d.setIdentity();
    d.setOrigin(new Ammo.btVector3(0, -5.5, 0));
    var c = 0, f = 0 != c, i = new Ammo.btVector3(0, 0, 0);
    f && a.calculateLocalInertia(c, i);
    f = new Ammo.btDefaultMotionState(d);
    c = new Ammo.btRigidBodyConstructionInfo(c, f, a, i);
    b.ground.phybody = new Ammo.btRigidBody(c);
    b.dynamicsWorld.addRigidBody(b.ground.phybody);
    a = new Ammo.btBoxShape(new Ammo.btVector3(200, 15, 0.5));
    d = new Ammo.btTransform;
    d.setIdentity();
    d.setOrigin(new Ammo.btVector3(0, -5.5, -200));
    c = 0;
    f = 0 != c;
    i = new Ammo.btVector3(0, 0, 0);
    f && a.calculateLocalInertia(c, i);
    f = new Ammo.btDefaultMotionState(d);
    c = new Ammo.btRigidBodyConstructionInfo(c, f, a, i);
    c = new Ammo.btRigidBody(c);
    b.dynamicsWorld.addRigidBody(c);
    a = new Ammo.btBoxShape(new Ammo.btVector3(0.5, 15, 200));
    d = new Ammo.btTransform;
    d.setIdentity();
    d.setOrigin(new Ammo.btVector3(200, -5.5, 0));
    c = 0;
    f = 0 != c;
    i = new Ammo.btVector3(0, 0, 0);
    f && a.calculateLocalInertia(c, i);
    f = new Ammo.btDefaultMotionState(d);
    c = new Ammo.btRigidBodyConstructionInfo(c, f, a, i);
    c = new Ammo.btRigidBody(c);
    b.dynamicsWorld.addRigidBody(c);
    a = new Ammo.btBoxShape(new Ammo.btVector3(200, 15, 0.5));
    d = new Ammo.btTransform;
    d.setIdentity();
    d.setOrigin(new Ammo.btVector3(0, -5.5, 200));
    c = 0;
    f = 0 != c;
    i = new Ammo.btVector3(0, 0, 0);
    f && a.calculateLocalInertia(c, i);
    f = new Ammo.btDefaultMotionState(d);
    c = new Ammo.btRigidBodyConstructionInfo(c, f, a, i);
    c = new Ammo.btRigidBody(c);
    b.dynamicsWorld.addRigidBody(c);
    a = new Ammo.btBoxShape(new Ammo.btVector3(0.5, 15, 200));
    d = new Ammo.btTransform;
    d.setIdentity();
    d.setOrigin(new Ammo.btVector3(-200, -5.5, 0));
    c = 0;
    f = 0 != c;
    i = new Ammo.btVector3(0, 0, 0);
    f && a.calculateLocalInertia(c, i);
    f = new Ammo.btDefaultMotionState(d);
    c = new Ammo.btRigidBodyConstructionInfo(c, f, a, i);
    c = new Ammo.btRigidBody(c);
    b.dynamicsWorld.addRigidBody(c)
  })();
  var f = new THREE.Quaternion;
  (function() {
    for(var c = 0;c < b.totalPlayers;c++) {
      f.setFromEuler(new THREE.Vector3(-30, -20, 0)), b.players[c] = new AICRAFT.Player(a.players.bindings[c].position[0], a.players.bindings[c].position[1], a.players.bindings[c].position[2], a.players.bindings[c].quaternion[0], a.players.bindings[c].quaternion[1], a.players.bindings[c].quaternion[2], a.players.bindings[c].quaternion[3]), b.players[c].buildMesh(THREE, b.scene), b.players[c].buildPhysic(Ammo), b.dynamicsWorld.addRigidBody(b.players[c].phybody), f.setFromEuler(new THREE.Vector3(30, 
      -20, 0)), b.ais[c] = new AICRAFT.Ai(a.ais.bindings[c].position[0], a.ais.bindings[c].position[1], a.ais.bindings[c].position[2], a.ais.bindings[c].quaternion[0], a.ais.bindings[c].quaternion[1], a.ais.bindings[c].quaternion[2], a.ais.bindings[c].quaternion[3]), b.ais[c].buildMesh(THREE, b.scene), b.ais[c].buildPhysic(Ammo), b.dynamicsWorld.addRigidBody(b.ais[c].phybody)
    }
  })();
  document.addEventListener("keydown", function(a) {
    b.players[b.myPnum].handleKeyDown(a, b.players[b.myPnum])
  }, !1);
  document.addEventListener("keyup", function(a) {
    b.players[b.myPnum].handleKeyUp(a, b.players[b.myPnum])
  }, !1);
  AICRAFT.ClientEngine.coordHelper(this.scene)
}, networkReady:function(a, b) {
  var c = this, d = io.connect("/");
  d.on("totalPlayers", function(a) {
    c.totalPlayers = a
  });
  d.on("connect", function(a) {
    c.myPnum = a
  });
  d.on("pi", function(f) {
    d.players = AICRAFT.Engine.extractPacket(f);
    d.on("ai", function(e) {
      d.ais = AICRAFT.Engine.extractPacket(e);
      -1 != c.myPnum ? (a(d), c.players[c.myPnum].connected = !0, d.emit("connected", c.myPnum), b()) : alert("game is full")
    })
  })
}, syncPos:function() {
  var a = this, b = io.connect("/");
  b.on("p", function(b) {
    for(var b = AICRAFT.Engine.extractPacket(b).bindings, d = 0;d < a.totalPlayers;d++) {
      a.players[d].setPos(Ammo, b[d].position[0], b[d].position[1], b[d].position[2], b[d].quaternion[0], b[d].quaternion[1], b[d].quaternion[2], b[d].quaternion[3], b[d].velocity[0], b[d].velocity[1], b[d].velocity[2])
    }
  });
  b.on("a", function(b) {
    for(var b = AICRAFT.Engine.extractPacket(b).bindings, d = 0;d < a.totalPlayers;d++) {
      a.ais[d].setPos(Ammo, b[d].position[0], b[d].position[1], b[d].position[2], b[d].quaternion[0], b[d].quaternion[1], b[d].quaternion[2], b[d].quaternion[3], b[d].velocity[0], b[d].velocity[1], b[d].velocity[2])
    }
  })
}, syncKey:function() {
  AICRAFT.requestKeyFrame(this.syncKey.bind(this), this.keyFPS);
  var a = io.connect("/");
  void 0 !== this.myPnum && 0 != this.players[this.myPnum].keycode ? (a.emit("k", this.players[this.myPnum].keycode), this.players[this.myPnum].updateInput()) : void 0 !== this.myPnum && 0 == this.players[this.myPnum].keycode && 0 != this.lastKeycode && a.emit("k", 0);
  this.lastKeycode = this.players[this.myPnum].keycode
}, animate:function() {
  requestAnimationFrame(this.animate.bind(this));
  this.dynamicsWorld.stepSimulation(1 / this.phyFPS, 10);
  for(var a = 0;a < this.totalPlayers;a++) {
    this.players[a].physicAndGraphicUpdate(this.dynamicsWorld), this.ais[a].physicAndGraphicUpdate(this.dynamicsWorld)
  }
  this.cameraControls.update();
  this.render();
  this.stats.update()
}, render:function() {
  this.renderer.render(this.scene, this.camera)
}};
AICRAFT.ClientEngine.coordHelper = function(a) {
  var b = new THREE.Geometry;
  b.vertices.push(AICRAFT.v(-200, 0, 0), AICRAFT.v(200, 0, 0), AICRAFT.v(0, -200, 0), AICRAFT.v(0, 200, 0), AICRAFT.v(0, 0, -200), AICRAFT.v(0, 0, 200), AICRAFT.v(200, 1, 0), AICRAFT.v(200, -1, 0), AICRAFT.v(150, 1, 0), AICRAFT.v(150, -1, 0), AICRAFT.v(100, 1, 0), AICRAFT.v(100, -1, 0), AICRAFT.v(50, 1, 0), AICRAFT.v(50, -1, 0), AICRAFT.v(-50, 1, 0), AICRAFT.v(-50, -1, 0), AICRAFT.v(-100, 1, 0), AICRAFT.v(-100, -1, 0), AICRAFT.v(-150, 1, 0), AICRAFT.v(-150, -1, 0), AICRAFT.v(-200, 1, 0), AICRAFT.v(-200, 
  -1, 0), AICRAFT.v(1, 200, 0), AICRAFT.v(-1, 200, 0), AICRAFT.v(1, 150, 0), AICRAFT.v(-1, 150, 0), AICRAFT.v(1, 100, 0), AICRAFT.v(-1, 100, 0), AICRAFT.v(1, 50, 0), AICRAFT.v(-1, 50, 0), AICRAFT.v(1, -50, 0), AICRAFT.v(-1, -50, 0), AICRAFT.v(1, -100, 0), AICRAFT.v(-1, -100, 0), AICRAFT.v(1, -150, 0), AICRAFT.v(-1, -150, 0), AICRAFT.v(1, -200, 0), AICRAFT.v(-1, -200, 0), AICRAFT.v(0, 1, 200), AICRAFT.v(0, -1, 200), AICRAFT.v(0, 1, 150), AICRAFT.v(0, -1, 150), AICRAFT.v(0, 1, 100), AICRAFT.v(0, -1, 
  100), AICRAFT.v(0, 1, 50), AICRAFT.v(0, -1, 50), AICRAFT.v(0, 1, -50), AICRAFT.v(0, -1, -50), AICRAFT.v(0, 1, -100), AICRAFT.v(0, -1, -100), AICRAFT.v(0, 1, -150), AICRAFT.v(0, -1, -150), AICRAFT.v(0, 1, -200), AICRAFT.v(0, -1, -200));
  var c = new THREE.LineBasicMaterial({color:0, lineWidth:1}), b = new THREE.Line(b, c);
  b.type = THREE.Lines;
  a.add(b)
};
AICRAFT.ClientEngine.key = function(a, b) {
  return"w" == b ? a & 8 ? !0 : !1 : "a" == b ? a & 4 ? !0 : !1 : "s" == b ? a & 2 ? !0 : !1 : "d" == b ? a & 1 ? !0 : !1 : "e" == b ? a & 16 ? !0 : !1 : !1
};

