var AICRAFT = AICRAFT || {};
"undefined" !== typeof exports && null !== exports && (exports.AICRAFT = AICRAFT);
AICRAFT.GameObject = function(a, b, c, d, f, e, g) {
  this.position = {};
  this.position.x = a;
  this.position.y = b;
  this.position.z = c;
  this.quaternion = {};
  this.quaternion.x = d || 0;
  this.quaternion.y = f || 0;
  this.quaternion.z = e || 0;
  this.quaternion.w = void 0 === g ? 1 : g;
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
}, setPos:function(a, b, c, d, f, e, g, h, k, i, j) {
  void 0 !== a && (Ammo = a);
  a = new Ammo.btTransform;
  a.setIdentity();
  a.setOrigin(new Ammo.btVector3(b, c, d));
  a.setRotation(new Ammo.btQuaternion(f, e, g, h));
  this.position.x = b;
  this.position.y = c;
  this.position.z = d;
  this.quaternion.x = f;
  this.quaternion.y = e;
  this.quaternion.z = g;
  this.quaternion.w = h;
  this.phybody.activate();
  this.phybody.getMotionState().setWorldTransform(a);
  this.phybody.setCenterOfMassTransform(a);
  this.phybody.setAngularVelocity(new Ammo.btVector3(k, i, j))
}, physicAndGraphicUpdate:function(a) {
  this.physicUpdate.call(this, a);
  this.mesh.position.x = this.position.x;
  this.mesh.position.y = this.position.y;
  this.mesh.position.z = this.position.z;
  this.mesh.quaternion.x = this.quaternion.x;
  this.mesh.quaternion.y = this.quaternion.y;
  this.mesh.quaternion.z = this.quaternion.z;
  this.mesh.quaternion.w = this.quaternion.w
}, physicUpdate:function(a) {
  this.phybody.getMotionState() && (this.phybody.getMotionState().getWorldTransform(a.trans), this.position.x = a.trans.getOrigin().x().toFixed(2), this.position.y = a.trans.getOrigin().y().toFixed(2), this.position.z = a.trans.getOrigin().z().toFixed(2), this.quaternion.x = a.trans.getRotation().x(), this.quaternion.y = a.trans.getRotation().y(), this.quaternion.z = a.trans.getRotation().z(), this.quaternion.w = a.trans.getRotation().w())
}};
AICRAFT.Ai = function(a, b, c, d, f, e, g, h) {
  AICRAFT.GameObject.call(this, a, b, c, d, f, e, g);
  this.Ammo = void 0 !== h ? h : Ammo;
  this.sight = {};
  this.sight.lines = [];
  this.sight.quaternion = {};
  this.sight.quaternion.x = 0;
  this.sight.quaternion.y = 0;
  this.sight.quaternion.z = 0;
  this.sight.quaternion.w = 1;
  this.clientSight = void 0;
  this.maxSpeed = 10;
  this.acceleration = 28;
  this.lookAtLock = this.turnLock = this.aheadLock = this.codeUploading = !1;
  this.hp = 100
};
AICRAFT.Ai.prototype = new AICRAFT.GameObject;
AICRAFT.Ai.prototype.constructor = AICRAFT.Ai;
AICRAFT.Ai.prototype.buildMesh = function(a, b) {
  AICRAFT.GameObject.prototype.buildMesh.call(this, a, b);
  var c = new a.Geometry;
  c.vertices.push(AICRAFT.v(0, 0, 0), AICRAFT.v(-84.5, 0, -260), AICRAFT.v(0, 0, 0), AICRAFT.v(-47.6, 0, -267.8), AICRAFT.v(0, 0, 0), AICRAFT.v(0, 0, -273), AICRAFT.v(0, 0, 0), AICRAFT.v(47.6, 0, -267.8), AICRAFT.v(0, 0, 0), AICRAFT.v(84.5, 0, -260));
  var d = new a.LineBasicMaterial({color:3407667, lineWidth:1});
  this.clientSight = new a.Line(c, d);
  this.clientSight.type = a.Lines;
  this.clientSight.useQuaternion = !0;
  this.clientSight.position.x = this.position.x;
  this.clientSight.position.y = this.position.y;
  this.clientSight.position.z = this.position.z;
  this.clientSight.quaternion.x = this.quaternion.x;
  this.clientSight.quaternion.y = this.quaternion.y;
  this.clientSight.quaternion.z = this.quaternion.z;
  this.clientSight.quaternion.w = this.quaternion.w;
  b.add(this.clientSight)
};
AICRAFT.Ai.prototype.buildPhysic = function(a) {
  AICRAFT.GameObject.prototype.buildPhysic.call(this, a);
  this.sight.quaternion.x = this.quaternion.x;
  this.sight.quaternion.y = this.quaternion.y;
  this.sight.quaternion.z = this.quaternion.z;
  this.sight.quaternion.w = this.quaternion.w;
  this.sight.lines.push([AICRAFT.bv(0, 0, 0), AICRAFT.bv(-84.5, 0, -260)], [AICRAFT.bv(0, 0, 0), AICRAFT.bv(-47.6, 0, -267.8)], [AICRAFT.bv(0, 0, 0), AICRAFT.bv(0, 0, -273)], [AICRAFT.bv(0, 0, 0), AICRAFT.bv(47.6, 0, -267.8)], [AICRAFT.bv(0, 0, 0), AICRAFT.bv(84.5, 0, -260)])
};
AICRAFT.Ai.prototype.setPos = function(a, b, c, d, f, e, g, h, k, i, j, l, m, n, o) {
  AICRAFT.GameObject.prototype.setPos.call(this, a, b, c, d, f, e, g, h, m, n, o);
  this.sight.quaternion.x = k;
  this.sight.quaternion.y = i;
  this.sight.quaternion.z = j;
  this.sight.quaternion.w = l;
  this.clientSight.quaternion.x = this.sight.quaternion.x;
  this.clientSight.quaternion.y = this.sight.quaternion.y;
  this.clientSight.quaternion.z = this.sight.quaternion.z;
  this.clientSight.quaternion.w = this.sight.quaternion.w
};
AICRAFT.Ai.prototype.physicAndGraphicUpdate = function(a) {
  this.physicUpdate.call(this, a);
  this.clientSight.position.x = this.mesh.position.x = this.position.x;
  this.clientSight.position.y = this.mesh.position.y = this.position.y;
  this.clientSight.position.z = this.mesh.position.z = this.position.z;
  this.mesh.quaternion.x = this.quaternion.x;
  this.mesh.quaternion.y = this.quaternion.y;
  this.mesh.quaternion.z = this.quaternion.z;
  this.mesh.quaternion.w = this.quaternion.w;
  this.clientSight.quaternion.x = this.sight.quaternion.x;
  this.clientSight.quaternion.y = this.sight.quaternion.y;
  this.clientSight.quaternion.z = this.sight.quaternion.z;
  this.clientSight.quaternion.w = this.sight.quaternion.w
};
AICRAFT.Ai.prototype.physicUpdate = function(a) {
  AICRAFT.GameObject.prototype.physicUpdate.call(this, a)
};
AICRAFT.Ai.prototype.ahead = function(a, b) {
  a = Math.abs(a);
  AICRAFT.Ai.move(this, a, b, !0, 400)
};
AICRAFT.Ai.prototype.back = function(a, b) {
  a = Math.abs(a);
  AICRAFT.Ai.move(this, a, b, !1, 600)
};
AICRAFT.Ai.prototype.lookLeft = function(a, b) {
  AICRAFT.Ai.lookRotate(this, a, b, !0)
};
AICRAFT.Ai.prototype.lookRight = function(a, b) {
  AICRAFT.Ai.lookRotate(this, a, b, !1)
};
AICRAFT.Ai.prototype.lookAt = function(a, b) {
  var c = this;
  if(!0 !== c.lookAtLock) {
    360 < a && (a %= 360);
    var d = c.phybody.getOrientation(), f = AICRAFT.quatFromEuler(a, 0, 0, c.Ammo), d = AICRAFT.quatMul(f, d);
    c.sight.quaternion.x = d.getX();
    c.sight.quaternion.y = d.getY();
    c.sight.quaternion.z = d.getZ();
    c.sight.quaternion.w = d.getW();
    c.lookAtLock = !0;
    setTimeout(function() {
      c.lookAtLock = !1;
      void 0 !== b && b()
    }, 3E3)
  }
};
AICRAFT.Ai.prototype.turnRight = function(a, b) {
  AICRAFT.Ai.rotate(this, a, b, !1, !0, !1, 40)
};
AICRAFT.Ai.prototype.turnLeft = function(a, b) {
  AICRAFT.Ai.rotate(this, a, b, !0, !0, !1, 40)
};
AICRAFT.Ai.lookRotate = function(a, b, c, d) {
  AICRAFT.Ai.rotate(a, b, c, d, !1, !0, 30)
};
AICRAFT.Ai.rotate = function(a, b, c, d, f, e, g) {
  if(1 > b || 1 > a.hp || a.codeUploading) {
    return void 0 !== c && c(), !1
  }
  360 < b && (b %= 360);
  var h = a.phybody.getOrientation(), k = new a.Ammo.btQuaternion(a.sight.quaternion.x, a.sight.quaternion.y, a.sight.quaternion.z, a.sight.quaternion.w), i = new a.Ammo.btQuaternion, i = !0 === d ? AICRAFT.quatFromEuler(1, 0, 0) : AICRAFT.quatFromEuler(-1, 0, 0);
  if(!0 === f) {
    h = AICRAFT.quatMul(h, i);
    a.quaternion.x = h.getX();
    a.quaternion.y = h.getY();
    a.quaternion.z = h.getZ();
    a.quaternion.w = h.getW();
    var j = new a.Ammo.btTransform;
    j.setIdentity();
    j.setOrigin(new a.Ammo.btVector3(a.position.x, a.position.y, a.position.z));
    j.setRotation(h);
    a.phybody.activate();
    a.phybody.getMotionState().setWorldTransform(j);
    a.phybody.setCenterOfMassTransform(j)
  }
  !0 === e && (h = AICRAFT.quatMul(k, i), a.sight.quaternion.x = h.getX(), a.sight.quaternion.y = h.getY(), a.sight.quaternion.z = h.getZ(), a.sight.quaternion.w = h.getW());
  setTimeout(function() {
    AICRAFT.Ai.rotate(a, b - 1, c, d, f, e, g)
  }, g)
};
AICRAFT.Ai.move = function(a, b, c, d, f) {
  if(1 > b || 1 > a.hp || a.codeUploading) {
    return void 0 !== c && c(), !1
  }
  var e = a.phybody.getLinearVelocity(), e = Math.sqrt(e.getX() * e.getX() + e.getY() * e.getY() + e.getZ() * e.getZ());
  a.phybody.activate();
  var g = a.phybody.getOrientation(), h = new a.Ammo.btTransform;
  h.setIdentity();
  h.setRotation(g);
  g = new a.Ammo.btVector3(0, 0, -1);
  g = h.op_mul(g);
  for(h = 0;h < a.acceleration;h++) {
    g.setX(1.1 * g.getX()), g.setY(1.1 * g.getY()), g.setZ(1.1 * g.getZ())
  }
  d || (g.setX(-1 * g.getX()), g.setY(-1 * g.getY()), g.setZ(-1 * g.getZ()));
  e < a.maxSpeed && !a.aheadLock && a.phybody.applyCentralImpulse(g);
  setTimeout(function() {
    AICRAFT.Ai.move(a, b - 1, c, d, f)
  }, f)
};
AICRAFT.Player = function(a, b, c, d, f, e, g) {
  AICRAFT.GameObject.call(this, a, b, c, d, f, e, g);
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
AICRAFT.bv = function(a, b, c) {
  return new Ammo.btVector3(a, b, c)
};
AICRAFT.quatMul = function(a, b) {
  return new Ammo.btQuaternion(a.getW() * b.getX() + a.getX() * b.getW() + a.getY() * b.getZ() - a.getZ() * b.getY(), a.getW() * b.getY() + a.getY() * b.getW() + a.getZ() * b.getX() - a.getX() * b.getZ(), a.getW() * b.getZ() + a.getZ() * b.getW() + a.getX() * b.getY() - a.getY() * b.getX(), a.getW() * b.getW() - a.getX() * b.getX() - a.getY() * b.getY() - a.getZ() * b.getZ())
};
AICRAFT.quatFromEuler = function(a, b, c, d) {
  this.Ammo = void 0 !== d ? d : Ammo;
  var d = a * Math.PI / 360, f = b * Math.PI / 360, e = c * Math.PI / 360, c = Math.sin(d), b = Math.sin(f), a = Math.sin(e), d = Math.cos(d), f = Math.cos(f), e = Math.cos(e);
  return(new this.Ammo.btQuaternion(a * d * f - e * c * b, e * c * f + a * d * b, e * d * b - a * c * f, e * d * f + a * c * b)).normalize()
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
  var c = this, d = new b.btDefaultCollisionConfiguration, f = new b.btCollisionDispatcher(d), e = new b.btDbvtBroadphase, g = new b.btSequentialImpulseConstraintSolver;
  this.dynamicsWorld = new b.btDiscreteDynamicsWorld(f, e, g, d);
  this.dynamicsWorld.setGravity(new b.btVector3(0, -9.82, 0));
  this.dynamicsWorld.trans = new b.btTransform;
  this.dynamicsWorld.trans.setIdentity();
  (function() {
    var a = new b.btBoxShape(new b.btVector3(200, 0.5, 200)), d = new b.btTransform;
    d.setIdentity();
    d.setOrigin(new b.btVector3(0, -5.5, 0));
    var e = 0, g = 0 != e, f = new b.btVector3(0, 0, 0);
    g && a.calculateLocalInertia(e, f);
    g = new b.btDefaultMotionState(d);
    e = new b.btRigidBodyConstructionInfo(e, g, a, f);
    e = new b.btRigidBody(e);
    c.dynamicsWorld.addRigidBody(e);
    a = new b.btBoxShape(new b.btVector3(200, 15, 0.5));
    d = new b.btTransform;
    d.setIdentity();
    d.setOrigin(new b.btVector3(0, -5.5, -200));
    e = 0;
    g = 0 != e;
    f = new b.btVector3(0, 0, 0);
    g && a.calculateLocalInertia(e, f);
    g = new b.btDefaultMotionState(d);
    e = new b.btRigidBodyConstructionInfo(e, g, a, f);
    e = new b.btRigidBody(e);
    c.dynamicsWorld.addRigidBody(e);
    a = new b.btBoxShape(new b.btVector3(0.5, 15, 200));
    d = new b.btTransform;
    d.setIdentity();
    d.setOrigin(new b.btVector3(200, -5.5, 0));
    e = 0;
    g = 0 != e;
    f = new b.btVector3(0, 0, 0);
    g && a.calculateLocalInertia(e, f);
    g = new b.btDefaultMotionState(d);
    e = new b.btRigidBodyConstructionInfo(e, g, a, f);
    e = new b.btRigidBody(e);
    c.dynamicsWorld.addRigidBody(e);
    a = new b.btBoxShape(new b.btVector3(200, 15, 0.5));
    d = new b.btTransform;
    d.setIdentity();
    d.setOrigin(new b.btVector3(0, -5.5, 200));
    e = 0;
    g = 0 != e;
    f = new b.btVector3(0, 0, 0);
    g && a.calculateLocalInertia(e, f);
    g = new b.btDefaultMotionState(d);
    e = new b.btRigidBodyConstructionInfo(e, g, a, f);
    e = new b.btRigidBody(e);
    c.dynamicsWorld.addRigidBody(e);
    a = new b.btBoxShape(new b.btVector3(0.5, 15, 200));
    d = new b.btTransform;
    d.setIdentity();
    d.setOrigin(new b.btVector3(-200, -5.5, 0));
    e = 0;
    g = 0 != e;
    f = new b.btVector3(0, 0, 0);
    g && a.calculateLocalInertia(e, f);
    g = new b.btDefaultMotionState(d);
    e = new b.btRigidBodyConstructionInfo(e, g, a, f);
    e = new b.btRigidBody(e);
    c.dynamicsWorld.addRigidBody(e)
  })();
  (function() {
    for(var a = 0;a < c.totalPlayers;a++) {
      quat = AICRAFT.quatFromEuler(0, 0, 0, b), c.players[a] = new AICRAFT.Player(-150 + 301 * Math.random(), 0, -150 + 301 * Math.random(), quat.getX(), quat.getY(), quat.getZ(), quat.getW()), c.players[a].buildPhysic(b), c.dynamicsWorld.addRigidBody(c.players[a].phybody), quat = AICRAFT.quatFromEuler(360 * Math.random(), 0, 0, b), c.ais[a] = new AICRAFT.Ai(c.players[a].position.x, 0, c.players[a].position.z - 15, quat.getX(), quat.getY(), quat.getZ(), quat.getW(), b), c.ais[a].buildPhysic(b), c.dynamicsWorld.addRigidBody(c.ais[a].phybody)
    }
  })()
}, networkInit:function(a) {
  var b = this;
  a.emit("totalPlayers", this.totalPlayers);
  a.emit("connect", AICRAFT.Engine.getNextAvailablePnum(this.players));
  a.on("connected", function(c) {
    if(b.players[c].connected || void 0 === b.players[c]) {
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
    void 0 !== a.sight && (b.push(a.sight.quaternion.x), b.push(a.sight.quaternion.y), b.push(a.sight.quaternion.z), b.push(a.sight.quaternion.w));
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
  if(0 == a.length % 14) {
    b = '({"bindings":[';
    for(c = 0;c < a.length;c += 14) {
      b += '{"position":', b += "[" + a[c] + "," + a[c + 1] + "," + a[c + 2] + "],", b += '"quaternion":', b += "[" + a[c + 3] + "," + a[c + 4] + "," + a[c + 5] + "," + a[c + 6] + "],", b += '"sightQuaternion":', b += "[" + a[c + 7] + "," + a[c + 8] + "," + a[c + 9] + "," + a[c + 10] + "],", b += '"velocity":', b += "[" + a[c + 11] + "," + a[c + 12] + "," + a[c + 13] + "]", b += "},"
    }
    return eval(b + "]})")
  }
};
AICRAFT.Engine.getNextAvailablePnum = function(a) {
  if(void 0 === a) {
    return-1
  }
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
    var a = new Ammo.btDefaultCollisionConfiguration, c = new Ammo.btCollisionDispatcher(a), d = new Ammo.btDbvtBroadphase, f = new Ammo.btSequentialImpulseConstraintSolver;
    b.dynamicsWorld = new Ammo.btDiscreteDynamicsWorld(c, d, f, a);
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
    var a = new Ammo.btBoxShape(new Ammo.btVector3(200, 0.5, 200)), c = new Ammo.btTransform;
    c.setIdentity();
    c.setOrigin(new Ammo.btVector3(0, -5.5, 0));
    var d = 0, f = 0 != d, i = new Ammo.btVector3(0, 0, 0);
    f && a.calculateLocalInertia(d, i);
    f = new Ammo.btDefaultMotionState(c);
    d = new Ammo.btRigidBodyConstructionInfo(d, f, a, i);
    b.ground.phybody = new Ammo.btRigidBody(d);
    b.dynamicsWorld.addRigidBody(b.ground.phybody);
    a = new Ammo.btBoxShape(new Ammo.btVector3(200, 15, 0.5));
    c = new Ammo.btTransform;
    c.setIdentity();
    c.setOrigin(new Ammo.btVector3(0, -5.5, -200));
    d = 0;
    f = 0 != d;
    i = new Ammo.btVector3(0, 0, 0);
    f && a.calculateLocalInertia(d, i);
    f = new Ammo.btDefaultMotionState(c);
    d = new Ammo.btRigidBodyConstructionInfo(d, f, a, i);
    d = new Ammo.btRigidBody(d);
    b.dynamicsWorld.addRigidBody(d);
    a = new Ammo.btBoxShape(new Ammo.btVector3(0.5, 15, 200));
    c = new Ammo.btTransform;
    c.setIdentity();
    c.setOrigin(new Ammo.btVector3(200, -5.5, 0));
    d = 0;
    f = 0 != d;
    i = new Ammo.btVector3(0, 0, 0);
    f && a.calculateLocalInertia(d, i);
    f = new Ammo.btDefaultMotionState(c);
    d = new Ammo.btRigidBodyConstructionInfo(d, f, a, i);
    d = new Ammo.btRigidBody(d);
    b.dynamicsWorld.addRigidBody(d);
    a = new Ammo.btBoxShape(new Ammo.btVector3(200, 15, 0.5));
    c = new Ammo.btTransform;
    c.setIdentity();
    c.setOrigin(new Ammo.btVector3(0, -5.5, 200));
    d = 0;
    f = 0 != d;
    i = new Ammo.btVector3(0, 0, 0);
    f && a.calculateLocalInertia(d, i);
    f = new Ammo.btDefaultMotionState(c);
    d = new Ammo.btRigidBodyConstructionInfo(d, f, a, i);
    d = new Ammo.btRigidBody(d);
    b.dynamicsWorld.addRigidBody(d);
    a = new Ammo.btBoxShape(new Ammo.btVector3(0.5, 15, 200));
    c = new Ammo.btTransform;
    c.setIdentity();
    c.setOrigin(new Ammo.btVector3(-200, -5.5, 0));
    d = 0;
    f = 0 != d;
    i = new Ammo.btVector3(0, 0, 0);
    f && a.calculateLocalInertia(d, i);
    f = new Ammo.btDefaultMotionState(c);
    d = new Ammo.btRigidBodyConstructionInfo(d, f, a, i);
    d = new Ammo.btRigidBody(d);
    b.dynamicsWorld.addRigidBody(d)
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
      a.ais[d].setPos(Ammo, b[d].position[0], b[d].position[1], b[d].position[2], b[d].quaternion[0], b[d].quaternion[1], b[d].quaternion[2], b[d].quaternion[3], b[d].sightQuaternion[0], b[d].sightQuaternion[1], b[d].sightQuaternion[2], b[d].sightQuaternion[3], b[d].velocity[0], b[d].velocity[1], b[d].velocity[2])
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

