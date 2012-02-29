var AICRAFT = AICRAFT || {};
"undefined" !== typeof exports && null !== exports && (exports.AICRAFT = AICRAFT);
AICRAFT.GameObject = function(b, a, d, c, f, e, g) {
  this.position = {};
  this.position.x = b;
  this.position.y = a;
  this.position.z = d;
  this.quaternion = {};
  this.quaternion.x = c || 0;
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
AICRAFT.GameObject.prototype = {constructor:AICRAFT.GameObject, buildMesh:function(b, a) {
  this.mesh = new b.Mesh(new b.CubeGeometry(this.width, this.height, this.depth), new b.MeshLambertMaterial({color:16777215}));
  this.mesh.castShadow = !0;
  this.mesh.receiveShadow = !0;
  this.mesh.position.x = this.position.x;
  this.mesh.position.y = this.position.y;
  this.mesh.position.z = this.position.z;
  this.mesh.useQuaternion = !0;
  this.mesh.quaternion.set(this.quaternion.x, this.quaternion.y, this.quaternion.z, this.quaternion.w);
  a.add(this.mesh)
}, buildPhysic:function(b) {
  void 0 !== b && (Ammo = b);
  var b = new Ammo.btBoxShape(new Ammo.btVector3(this.width / 2, this.height / 2, this.depth / 2)), a = new Ammo.btTransform;
  a.setIdentity();
  a.setOrigin(new Ammo.btVector3(this.position.x, this.position.y, this.position.z));
  a.setRotation(new Ammo.btQuaternion(this.quaternion.x, this.quaternion.y, this.quaternion.z, this.quaternion.w));
  var d = 0 != this.mass, c = new Ammo.btVector3(0, 0, 0);
  d && b.calculateLocalInertia(this.mass, c);
  a = new Ammo.btDefaultMotionState(a);
  b = new Ammo.btRigidBodyConstructionInfo(this.mass, a, b, c);
  this.phybody = new Ammo.btRigidBody(b);
  this.phybody.setFriction(this.friction)
}, setPos:function(b, a, d, c, f, e, g, i, j, h, k) {
  void 0 !== b && (Ammo = b);
  b = new Ammo.btTransform;
  b.setIdentity();
  b.setOrigin(new Ammo.btVector3(a, d, c));
  b.setRotation(new Ammo.btQuaternion(f, e, g, i));
  this.position.x = a;
  this.position.y = d;
  this.position.z = c;
  this.quaternion.x = f;
  this.quaternion.y = e;
  this.quaternion.z = g;
  this.quaternion.w = i;
  this.phybody.activate();
  this.phybody.getMotionState().setWorldTransform(b);
  this.phybody.setCenterOfMassTransform(b);
  this.phybody.setAngularVelocity(new Ammo.btVector3(j, h, k))
}, physicAndGraphicUpdate:function(b) {
  this.physicUpdate.call(this, b);
  this.mesh.position.x = this.position.x;
  this.mesh.position.y = this.position.y;
  this.mesh.position.z = this.position.z;
  this.mesh.quaternion.x = this.quaternion.x;
  this.mesh.quaternion.y = this.quaternion.y;
  this.mesh.quaternion.z = this.quaternion.z;
  this.mesh.quaternion.w = this.quaternion.w
}, physicUpdate:function(b) {
  this.phybody.getMotionState() && (this.phybody.getMotionState().getWorldTransform(b.trans), this.position.x = b.trans.getOrigin().x().toFixed(2), this.position.y = b.trans.getOrigin().y().toFixed(2), this.position.z = b.trans.getOrigin().z().toFixed(2), this.quaternion.x = b.trans.getRotation().x(), this.quaternion.y = b.trans.getRotation().y(), this.quaternion.z = b.trans.getRotation().z(), this.quaternion.w = b.trans.getRotation().w())
}};
AICRAFT.Ai = function(b, a, d, c, f, e, g, i) {
  AICRAFT.GameObject.call(this, b, a, d, c, f, e, g);
  this.Ammo = void 0 !== i ? i : Ammo;
  this.sight = [];
  this.sightQuaternion = {};
  this.sightQuaternion.x = 0;
  this.sightQuaternion.y = 0;
  this.sightQuaternion.z = 0;
  this.sightQuaternion.w = 1;
  this.clientSight = void 0;
  this.maxSpeed = 10;
  this.acceleration = 28;
  this.turnLock = this.aheadLock = this.codeUploading = !1;
  this.hp = 100
};
AICRAFT.Ai.prototype = new AICRAFT.GameObject;
AICRAFT.Ai.prototype.constructor = AICRAFT.Ai;
AICRAFT.Ai.prototype.buildMesh = function(b, a) {
  AICRAFT.GameObject.prototype.buildMesh.call(this, b, a);
  var d = new b.Geometry;
  d.vertices.push(AICRAFT.v(0, 0, 0), AICRAFT.v(-84.5, 0, -260), AICRAFT.v(0, 0, 0), AICRAFT.v(-47.6, 0, -267.8), AICRAFT.v(0, 0, 0), AICRAFT.v(0, 0, -273), AICRAFT.v(0, 0, 0), AICRAFT.v(47.6, 0, -267.8), AICRAFT.v(0, 0, 0), AICRAFT.v(84.5, 0, -260));
  var c = new b.LineBasicMaterial({color:3407667, lineWidth:1});
  this.clientSight = new b.Line(d, c);
  this.clientSight.type = b.Lines;
  this.clientSight.useQuaternion = !0;
  this.clientSight.position.x = this.position.x;
  this.clientSight.position.y = this.position.y;
  this.clientSight.position.z = this.position.z;
  this.clientSight.quaternion.x = this.quaternion.x;
  this.clientSight.quaternion.y = this.quaternion.y;
  this.clientSight.quaternion.z = this.quaternion.z;
  this.clientSight.quaternion.w = this.quaternion.w;
  a.add(this.clientSight)
};
AICRAFT.Ai.prototype.buildPhysic = function(b) {
  AICRAFT.GameObject.prototype.buildPhysic.call(this, b);
  this.sight.push([AICRAFT.bv(0, 0, 0), AICRAFT.bv(-84.5, 0, -260)], [AICRAFT.bv(0, 0, 0), AICRAFT.bv(-47.6, 0, -267.8)], [AICRAFT.bv(0, 0, 0), AICRAFT.bv(0, 0, -273)], [AICRAFT.bv(0, 0, 0), AICRAFT.bv(47.6, 0, -267.8)], [AICRAFT.bv(0, 0, 0), AICRAFT.bv(84.5, 0, -260)])
};
AICRAFT.Ai.prototype.setPos = function(b, a, d, c, f, e, g, i, j, h, k, l, m, n, o) {
  AICRAFT.GameObject.prototype.setPos.call(this, b, a, d, c, f, e, g, i, m, n, o);
  this.sightQuaternion.x = j;
  this.sightQuaternion.y = h;
  this.sightQuaternion.z = k;
  this.sightQuaternion.w = l;
  this.clientSight.quaternion.x = this.sightQuaternion.x;
  this.clientSight.quaternion.y = this.sightQuaternion.y;
  this.clientSight.quaternion.z = this.sightQuaternion.z;
  this.clientSight.quaternion.w = this.sightQuaternion.w
};
AICRAFT.Ai.prototype.physicAndGraphicUpdate = function(b) {
  AICRAFT.GameObject.prototype.physicAndGraphicUpdate.call(this, b);
  this.clientSight.position.x = this.position.x;
  this.clientSight.position.y = this.position.y;
  this.clientSight.position.z = this.position.z;
  this.clientSight.quaternion.x = this.sightQuaternion.x;
  this.clientSight.quaternion.y = this.sightQuaternion.y;
  this.clientSight.quaternion.z = this.sightQuaternion.z;
  this.clientSight.quaternion.w = this.sightQuaternion.w
};
AICRAFT.Ai.prototype.lookAt = function(b) {
  var b = Math.abs(b), a = new this.Ammo.btQuaternion, d = new this.Ammo.btQuaternion(this.sightQuaternion.x, this.sightQuaternion.y, this.sightQuaternion.z, this.sightQuaternion.w), a = AICRAFT.quatFromEuler(b, 0, 0), a = AICRAFT.quatMul(d, a);
  this.sightQuaternion.x = a.getX();
  this.sightQuaternion.y = a.getY();
  this.sightQuaternion.z = a.getZ();
  this.sightQuaternion.w = a.getW()
};
AICRAFT.Ai.prototype.back = function(b, a) {
  AICRAFT.Ai.move(b, a, !1, this)
};
AICRAFT.Ai.prototype.ahead = function(b, a) {
  AICRAFT.Ai.move(b, a, !0, this)
};
AICRAFT.Ai.prototype.turnRight = function(b, a) {
  0 < b ? AICRAFT.Ai.turn(b, a, !1, this) : AICRAFT.Ai.turn(-1 * b, a, !0, this)
};
AICRAFT.Ai.prototype.turnLeft = function(b, a) {
  0 < b ? AICRAFT.Ai.turn(b, a, !0, this) : AICRAFT.Ai.turn(-1 * b, a, !1, this)
};
AICRAFT.Ai.turn = function(b, a, d, c) {
  c.phybody.setFriction(c.friction);
  c.aheadLock = !1;
  if(1 > b || 1 > c.hp || c.codeUploading) {
    return void 0 !== a && a(), !1
  }
  var f;
  f = !0 == d ? 1 : -1;
  c.phybody.activate();
  c.phybody.setAngularVelocity(new c.Ammo.btVector3(0, 0, 0));
  c.phybody.setLinearVelocity(new c.Ammo.btVector3(0, 0, 0));
  c.aheadLock = !0;
  c.phybody.setFriction(0);
  c.turnLock || c.phybody.applyTorqueImpulse(new c.Ammo.btVector3(0, 4 * f, 0));
  setTimeout(function() {
    AICRAFT.Ai.turn(b - 2, a, d, c)
  }, 50)
};
AICRAFT.Ai.move = function(b, a, d, c) {
  if(1 > b || 1 > c.hp || c.codeUploading) {
    return void 0 !== a && a(), !1
  }
  var f = c.phybody.getLinearVelocity(), f = Math.sqrt(f.getX() * f.getX() + f.getY() * f.getY() + f.getZ() * f.getZ());
  c.phybody.activate();
  var e = c.phybody.getOrientation(), g = new c.Ammo.btTransform;
  g.setIdentity();
  g.setRotation(e);
  e = new c.Ammo.btVector3(0, 0, -1);
  e = g.op_mul(e);
  for(g = 0;g < c.acceleration;g++) {
    e.setX(1.1 * e.getX()), e.setY(1.1 * e.getY()), e.setZ(1.1 * e.getZ())
  }
  d || (e.setX(-1 * e.getX()), e.setY(-1 * e.getY()), e.setZ(-1 * e.getZ()));
  f < c.maxSpeed && !c.aheadLock && c.phybody.applyCentralImpulse(e);
  setTimeout(function() {
    AICRAFT.Ai.move(b - 1, a, d, c)
  }, 500)
};
AICRAFT.Player = function(b, a, d, c, f, e, g) {
  AICRAFT.GameObject.call(this, b, a, d, c, f, e, g);
  this.maxSpeed = 20;
  this.acceleration = 4;
  this.connected = !1;
  this.keycode = 0
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
  void 0 !== b && (Ammo = b);
  var b = this.phybody.getLinearVelocity(), a = Math.sqrt(b.getX() * b.getX() + b.getY() * b.getY() + b.getZ() * b.getZ());
  AICRAFT.ClientEngine.key(this.keycode, "w") && a < this.maxSpeed && 1 > this.position.y && (this.phybody.activate(), b = new Ammo.btVector3(0, 0, 0 - this.acceleration), this.phybody.applyCentralImpulse(b));
  AICRAFT.ClientEngine.key(this.keycode, "a") && a < this.maxSpeed && 1 > this.position.y && (this.phybody.activate(), b = new Ammo.btVector3(0 - this.acceleration, 0, 0), this.phybody.applyCentralImpulse(b));
  AICRAFT.ClientEngine.key(this.keycode, "s") && a < this.maxSpeed && 1 > this.position.y && (this.phybody.activate(), b = new Ammo.btVector3(0, 0, this.acceleration), this.phybody.applyCentralImpulse(b));
  AICRAFT.ClientEngine.key(this.keycode, "d") && a < this.maxSpeed && 1 > this.position.y && (this.phybody.activate(), b = new Ammo.btVector3(this.acceleration, 0, 0), this.phybody.applyCentralImpulse(b));
  AICRAFT.ClientEngine.key(this.keycode, "e") && 0.1 > this.position.y && (this.phybody.activate(), b = new Ammo.btVector3(0, 1, 0), this.phybody.applyCentralImpulse(b))
};
AICRAFT.requestAnimationFrame = function(b, a) {
  return setTimeout(b, 1E3 / a)
};
AICRAFT.requestPosFrame = function(b, a) {
  return setTimeout(b, 1E3 / a)
};
AICRAFT.requestKeyFrame = function(b, a) {
  return setTimeout(b, 1E3 / a)
};
AICRAFT.v = function(b, a, d) {
  return new THREE.Vertex(new THREE.Vector3(b, a, d))
};
AICRAFT.bv = function(b, a, d) {
  return new Ammo.btVector3(b, a, d)
};
AICRAFT.quatMul = function(b, a) {
  return new Ammo.btQuaternion(b.getW() * a.getX() + b.getX() * a.getW() + b.getY() * a.getZ() - b.getZ() * a.getY(), b.getW() * a.getY() + b.getY() * a.getW() + b.getZ() * a.getX() - b.getX() * a.getZ(), b.getW() * a.getZ() + b.getZ() * a.getW() + b.getX() * a.getY() - b.getY() * a.getX(), b.getW() * a.getW() - b.getX() * a.getX() - b.getY() * a.getY() - b.getZ() * a.getZ())
};
AICRAFT.quatFromEuler = function(b, a, d, c) {
  this.Ammo = void 0 !== c ? c : Ammo;
  var c = b * Math.PI / 360, f = a * Math.PI / 360, e = d * Math.PI / 360, d = Math.sin(c), a = Math.sin(f), b = Math.sin(e), c = Math.cos(c), f = Math.cos(f), e = Math.cos(e);
  return(new this.Ammo.btQuaternion(b * c * f - e * d * a, e * d * f + b * c * a, e * c * a - b * d * f, e * c * f + b * d * a)).normalize()
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
AICRAFT.Engine.prototype = {constructor:AICRAFT.Engine, init:function(b, a) {
  var d = this, c = new a.btDefaultCollisionConfiguration, f = new a.btCollisionDispatcher(c), e = new a.btDbvtBroadphase, g = new a.btSequentialImpulseConstraintSolver;
  this.dynamicsWorld = new a.btDiscreteDynamicsWorld(f, e, g, c);
  this.dynamicsWorld.setGravity(new a.btVector3(0, -9.82, 0));
  this.dynamicsWorld.trans = new a.btTransform;
  this.dynamicsWorld.trans.setIdentity();
  (function() {
    var b = new a.btBoxShape(new a.btVector3(200, 0.5, 200)), c = new a.btTransform;
    c.setIdentity();
    c.setOrigin(new a.btVector3(0, -5.5, 0));
    var e = 0, f = 0 != e, g = new a.btVector3(0, 0, 0);
    f && b.calculateLocalInertia(e, g);
    f = new a.btDefaultMotionState(c);
    e = new a.btRigidBodyConstructionInfo(e, f, b, g);
    e = new a.btRigidBody(e);
    d.dynamicsWorld.addRigidBody(e);
    b = new a.btBoxShape(new a.btVector3(200, 15, 0.5));
    c = new a.btTransform;
    c.setIdentity();
    c.setOrigin(new a.btVector3(0, -5.5, -200));
    e = 0;
    f = 0 != e;
    g = new a.btVector3(0, 0, 0);
    f && b.calculateLocalInertia(e, g);
    f = new a.btDefaultMotionState(c);
    e = new a.btRigidBodyConstructionInfo(e, f, b, g);
    e = new a.btRigidBody(e);
    d.dynamicsWorld.addRigidBody(e);
    b = new a.btBoxShape(new a.btVector3(0.5, 15, 200));
    c = new a.btTransform;
    c.setIdentity();
    c.setOrigin(new a.btVector3(200, -5.5, 0));
    e = 0;
    f = 0 != e;
    g = new a.btVector3(0, 0, 0);
    f && b.calculateLocalInertia(e, g);
    f = new a.btDefaultMotionState(c);
    e = new a.btRigidBodyConstructionInfo(e, f, b, g);
    e = new a.btRigidBody(e);
    d.dynamicsWorld.addRigidBody(e);
    b = new a.btBoxShape(new a.btVector3(200, 15, 0.5));
    c = new a.btTransform;
    c.setIdentity();
    c.setOrigin(new a.btVector3(0, -5.5, 200));
    e = 0;
    f = 0 != e;
    g = new a.btVector3(0, 0, 0);
    f && b.calculateLocalInertia(e, g);
    f = new a.btDefaultMotionState(c);
    e = new a.btRigidBodyConstructionInfo(e, f, b, g);
    e = new a.btRigidBody(e);
    d.dynamicsWorld.addRigidBody(e);
    b = new a.btBoxShape(new a.btVector3(0.5, 15, 200));
    c = new a.btTransform;
    c.setIdentity();
    c.setOrigin(new a.btVector3(-200, -5.5, 0));
    e = 0;
    f = 0 != e;
    g = new a.btVector3(0, 0, 0);
    f && b.calculateLocalInertia(e, g);
    f = new a.btDefaultMotionState(c);
    e = new a.btRigidBodyConstructionInfo(e, f, b, g);
    e = new a.btRigidBody(e);
    d.dynamicsWorld.addRigidBody(e)
  })();
  (function() {
    for(var b = 0;b < d.totalPlayers;b++) {
      quat = AICRAFT.quatFromEuler(0, 0, 0, a), d.players[b] = new AICRAFT.Player(-150 + 301 * Math.random(), 0, -150 + 301 * Math.random(), quat.getX(), quat.getY(), quat.getZ(), quat.getW()), d.players[b].buildPhysic(a), d.dynamicsWorld.addRigidBody(d.players[b].phybody), quat = AICRAFT.quatFromEuler(360 * Math.random(), 0, 0, a), d.ais[b] = new AICRAFT.Ai(d.players[b].position.x, 0, d.players[b].position.z - 15, quat.getX(), quat.getY(), quat.getZ(), quat.getW(), a), d.ais[b].buildPhysic(a), d.dynamicsWorld.addRigidBody(d.ais[b].phybody)
    }
  })()
}, networkInit:function(b) {
  var a = this;
  b.emit("totalPlayers", this.totalPlayers);
  b.emit("connect", AICRAFT.Engine.getNextAvailablePnum(this.players));
  b.on("connected", function(d) {
    if(a.players[d].connected) {
      return!1
    }
    console.log("Conected players:" + d);
    a.players[d].connected = !0;
    b.set("Pnum", d)
  });
  b.emit("pi", AICRAFT.Engine.encryptedPacket(this.players));
  b.emit("ai", AICRAFT.Engine.encryptedPacket(this.ais));
  b.on("disconnect", function() {
    b.get("Pnum", function(b, c) {
      void 0 !== c && (a.players[c].connected = !1)
    })
  })
}, syncPos:function(b) {
  var a = this;
  AICRAFT.requestPosFrame(function() {
    a.syncPos(b)
  }, a.posFPS);
  b.emit("p", AICRAFT.Engine.encryptedPacket(a.players));
  b.emit("a", AICRAFT.Engine.encryptedPacket(a.ais))
}, syncKey:function(b, a) {
  var d = this;
  b.on("k", function(c) {
    b.get("Pnum", function(b, e) {
      d.players[e].keycode = c;
      d.players[e].updateInput(a)
    })
  })
}, animate:function() {
  var b = this;
  AICRAFT.requestAnimationFrame(function() {
    b.animate()
  }, b.animateFPS);
  b.dynamicsWorld.stepSimulation(1 / b.phyFPS, 10);
  b.players.forEach(function(a) {
    a.physicUpdate(b.dynamicsWorld)
  });
  b.ais.forEach(function(a) {
    a.physicUpdate(b.dynamicsWorld)
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
    void 0 !== b.sightQuaternion && (a.push(b.sightQuaternion.x), a.push(b.sightQuaternion.y), a.push(b.sightQuaternion.z), a.push(b.sightQuaternion.w));
    a.push(b.phybody.getAngularVelocity().getX());
    a.push(b.phybody.getAngularVelocity().getY());
    a.push(b.phybody.getAngularVelocity().getZ())
  });
  return a
};
AICRAFT.Engine.extractPacket = function(b) {
  if(0 == b.length % 10) {
    for(var a = '({"bindings":[', d = 0;d < b.length;d += 10) {
      a += '{"position":', a += "[" + b[d] + "," + b[d + 1] + "," + b[d + 2] + "],", a += '"quaternion":', a += "[" + b[d + 3] + "," + b[d + 4] + "," + b[d + 5] + "," + b[d + 6] + "],", a += '"velocity":', a += "[" + b[d + 7] + "," + b[d + 8] + "," + b[d + 9] + "]", a += "},"
    }
    return eval(a + "]})")
  }
  if(0 == b.length % 14) {
    a = '({"bindings":[';
    for(d = 0;d < b.length;d += 14) {
      a += '{"position":', a += "[" + b[d] + "," + b[d + 1] + "," + b[d + 2] + "],", a += '"quaternion":', a += "[" + b[d + 3] + "," + b[d + 4] + "," + b[d + 5] + "," + b[d + 6] + "],", a += '"sightQuaternion":', a += "[" + b[d + 7] + "," + b[d + 8] + "," + b[d + 9] + "," + b[d + 10] + "],", a += '"velocity":', a += "[" + b[d + 11] + "," + b[d + 12] + "," + b[d + 13] + "]", a += "},"
    }
    return eval(a + "]})")
  }
};
AICRAFT.Engine.getNextAvailablePnum = function(b) {
  for(var a = 0;a < b.length;a++) {
    if(!b[a].connected) {
      return a
    }
  }
  return-1
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
AICRAFT.AIEngine = function() {
  this.templateStr = void 0;
  this.ais = []
};
AICRAFT.AIEngine.prototype = {constructor:AICRAFT.AIEngine, loadAI:function(b, a, d) {
  var c = this.templateStr.replace(/ai_name_to_replace/g, "AI_" + d.toString());
  eval(c);
  eval(b);
  eval("var AI = AICRAFT.AI_" + d.toString());
  this.ais.push(new AI(a))
}, stepSimulation:function() {
  this.ais.forEach(function(b) {
    b.run()
  })
}};
AICRAFT.ClientEngine = function() {
  this.phyFPS = this.keyFPS = 30;
  this.myPnum = this.totalPlayers = this.dynamicsWorld = this.ground = this.cameraControl = this.camera = this.renderer = this.scene = this.stats = void 0;
  this.players = [];
  this.ais = [];
  this.lastKeycode = 0
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
    var b = new Ammo.btDefaultCollisionConfiguration, d = new Ammo.btCollisionDispatcher(b), c = new Ammo.btDbvtBroadphase, f = new Ammo.btSequentialImpulseConstraintSolver;
    a.dynamicsWorld = new Ammo.btDiscreteDynamicsWorld(d, c, f, b);
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
  var d = new THREE.SpotLight;
  d.position.set(170, 330, -160);
  d.castShadow = !0;
  this.scene.add(d);
  var d = new THREE.PlaneGeometry(400, 400, 10, 10), c = new THREE.MeshLambertMaterial({color:16777215});
  this.ground = new THREE.Mesh(d, c);
  this.ground.rotation.x = -Math.PI / 2;
  this.ground.position.y = -5;
  this.ground.receiveShadow = !0;
  this.scene.add(this.ground);
  (function() {
    var b = new Ammo.btBoxShape(new Ammo.btVector3(200, 0.5, 200)), d = new Ammo.btTransform;
    d.setIdentity();
    d.setOrigin(new Ammo.btVector3(0, -5.5, 0));
    var c = 0, f = 0 != c, h = new Ammo.btVector3(0, 0, 0);
    f && b.calculateLocalInertia(c, h);
    f = new Ammo.btDefaultMotionState(d);
    c = new Ammo.btRigidBodyConstructionInfo(c, f, b, h);
    a.ground.phybody = new Ammo.btRigidBody(c);
    a.dynamicsWorld.addRigidBody(a.ground.phybody);
    b = new Ammo.btBoxShape(new Ammo.btVector3(200, 15, 0.5));
    d = new Ammo.btTransform;
    d.setIdentity();
    d.setOrigin(new Ammo.btVector3(0, -5.5, -200));
    c = 0;
    f = 0 != c;
    h = new Ammo.btVector3(0, 0, 0);
    f && b.calculateLocalInertia(c, h);
    f = new Ammo.btDefaultMotionState(d);
    c = new Ammo.btRigidBodyConstructionInfo(c, f, b, h);
    c = new Ammo.btRigidBody(c);
    a.dynamicsWorld.addRigidBody(c);
    b = new Ammo.btBoxShape(new Ammo.btVector3(0.5, 15, 200));
    d = new Ammo.btTransform;
    d.setIdentity();
    d.setOrigin(new Ammo.btVector3(200, -5.5, 0));
    c = 0;
    f = 0 != c;
    h = new Ammo.btVector3(0, 0, 0);
    f && b.calculateLocalInertia(c, h);
    f = new Ammo.btDefaultMotionState(d);
    c = new Ammo.btRigidBodyConstructionInfo(c, f, b, h);
    c = new Ammo.btRigidBody(c);
    a.dynamicsWorld.addRigidBody(c);
    b = new Ammo.btBoxShape(new Ammo.btVector3(200, 15, 0.5));
    d = new Ammo.btTransform;
    d.setIdentity();
    d.setOrigin(new Ammo.btVector3(0, -5.5, 200));
    c = 0;
    f = 0 != c;
    h = new Ammo.btVector3(0, 0, 0);
    f && b.calculateLocalInertia(c, h);
    f = new Ammo.btDefaultMotionState(d);
    c = new Ammo.btRigidBodyConstructionInfo(c, f, b, h);
    c = new Ammo.btRigidBody(c);
    a.dynamicsWorld.addRigidBody(c);
    b = new Ammo.btBoxShape(new Ammo.btVector3(0.5, 15, 200));
    d = new Ammo.btTransform;
    d.setIdentity();
    d.setOrigin(new Ammo.btVector3(-200, -5.5, 0));
    c = 0;
    f = 0 != c;
    h = new Ammo.btVector3(0, 0, 0);
    f && b.calculateLocalInertia(c, h);
    f = new Ammo.btDefaultMotionState(d);
    c = new Ammo.btRigidBodyConstructionInfo(c, f, b, h);
    c = new Ammo.btRigidBody(c);
    a.dynamicsWorld.addRigidBody(c)
  })();
  var f = new THREE.Quaternion;
  (function() {
    for(var c = 0;c < a.totalPlayers;c++) {
      f.setFromEuler(new THREE.Vector3(-30, -20, 0)), a.players[c] = new AICRAFT.Player(b.players.bindings[c].position[0], b.players.bindings[c].position[1], b.players.bindings[c].position[2], b.players.bindings[c].quaternion[0], b.players.bindings[c].quaternion[1], b.players.bindings[c].quaternion[2], b.players.bindings[c].quaternion[3]), a.players[c].buildMesh(THREE, a.scene), a.players[c].buildPhysic(Ammo), a.dynamicsWorld.addRigidBody(a.players[c].phybody), f.setFromEuler(new THREE.Vector3(30, 
      -20, 0)), a.ais[c] = new AICRAFT.Ai(b.ais.bindings[c].position[0], b.ais.bindings[c].position[1], b.ais.bindings[c].position[2], b.ais.bindings[c].quaternion[0], b.ais.bindings[c].quaternion[1], b.ais.bindings[c].quaternion[2], b.ais.bindings[c].quaternion[3]), a.ais[c].buildMesh(THREE, a.scene), a.ais[c].buildPhysic(Ammo), a.dynamicsWorld.addRigidBody(a.ais[c].phybody)
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
  var d = this, c = io.connect("/");
  c.on("totalPlayers", function(b) {
    d.totalPlayers = b
  });
  c.on("connect", function(b) {
    d.myPnum = b
  });
  c.on("pi", function(f) {
    c.players = AICRAFT.Engine.extractPacket(f);
    c.on("ai", function(e) {
      c.ais = AICRAFT.Engine.extractPacket(e);
      -1 != d.myPnum ? (b(c), d.players[d.myPnum].connected = !0, c.emit("connected", d.myPnum), a()) : alert("game is full")
    })
  })
}, syncPos:function() {
  var b = this, a = io.connect("/");
  a.on("p", function(a) {
    for(var a = AICRAFT.Engine.extractPacket(a).bindings, c = 0;c < b.totalPlayers;c++) {
      b.players[c].setPos(Ammo, a[c].position[0], a[c].position[1], a[c].position[2], a[c].quaternion[0], a[c].quaternion[1], a[c].quaternion[2], a[c].quaternion[3], a[c].velocity[0], a[c].velocity[1], a[c].velocity[2])
    }
  });
  a.on("a", function(a) {
    for(var a = AICRAFT.Engine.extractPacket(a).bindings, c = 0;c < b.totalPlayers;c++) {
      b.ais[c].setPos(Ammo, a[c].position[0], a[c].position[1], a[c].position[2], a[c].quaternion[0], a[c].quaternion[1], a[c].quaternion[2], a[c].quaternion[3], a[c].sightQuaternion[0], a[c].sightQuaternion[1], a[c].sightQuaternion[2], a[c].sightQuaternion[3], a[c].velocity[0], a[c].velocity[1], a[c].velocity[2])
    }
  })
}, syncKey:function() {
  AICRAFT.requestKeyFrame(this.syncKey.bind(this), this.keyFPS);
  var b = io.connect("/");
  void 0 !== this.myPnum && 0 != this.players[this.myPnum].keycode ? (b.emit("k", this.players[this.myPnum].keycode), this.players[this.myPnum].updateInput()) : void 0 !== this.myPnum && 0 == this.players[this.myPnum].keycode && 0 != this.lastKeycode && b.emit("k", 0);
  this.lastKeycode = this.players[this.myPnum].keycode
}, animate:function() {
  requestAnimationFrame(this.animate.bind(this));
  this.dynamicsWorld.stepSimulation(1 / this.phyFPS, 10);
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
  a.vertices.push(AICRAFT.v(-200, 0, 0), AICRAFT.v(200, 0, 0), AICRAFT.v(0, -200, 0), AICRAFT.v(0, 200, 0), AICRAFT.v(0, 0, -200), AICRAFT.v(0, 0, 200), AICRAFT.v(200, 1, 0), AICRAFT.v(200, -1, 0), AICRAFT.v(150, 1, 0), AICRAFT.v(150, -1, 0), AICRAFT.v(100, 1, 0), AICRAFT.v(100, -1, 0), AICRAFT.v(50, 1, 0), AICRAFT.v(50, -1, 0), AICRAFT.v(-50, 1, 0), AICRAFT.v(-50, -1, 0), AICRAFT.v(-100, 1, 0), AICRAFT.v(-100, -1, 0), AICRAFT.v(-150, 1, 0), AICRAFT.v(-150, -1, 0), AICRAFT.v(-200, 1, 0), AICRAFT.v(-200, 
  -1, 0), AICRAFT.v(1, 200, 0), AICRAFT.v(-1, 200, 0), AICRAFT.v(1, 150, 0), AICRAFT.v(-1, 150, 0), AICRAFT.v(1, 100, 0), AICRAFT.v(-1, 100, 0), AICRAFT.v(1, 50, 0), AICRAFT.v(-1, 50, 0), AICRAFT.v(1, -50, 0), AICRAFT.v(-1, -50, 0), AICRAFT.v(1, -100, 0), AICRAFT.v(-1, -100, 0), AICRAFT.v(1, -150, 0), AICRAFT.v(-1, -150, 0), AICRAFT.v(1, -200, 0), AICRAFT.v(-1, -200, 0), AICRAFT.v(0, 1, 200), AICRAFT.v(0, -1, 200), AICRAFT.v(0, 1, 150), AICRAFT.v(0, -1, 150), AICRAFT.v(0, 1, 100), AICRAFT.v(0, -1, 
  100), AICRAFT.v(0, 1, 50), AICRAFT.v(0, -1, 50), AICRAFT.v(0, 1, -50), AICRAFT.v(0, -1, -50), AICRAFT.v(0, 1, -100), AICRAFT.v(0, -1, -100), AICRAFT.v(0, 1, -150), AICRAFT.v(0, -1, -150), AICRAFT.v(0, 1, -200), AICRAFT.v(0, -1, -200));
  var d = new THREE.LineBasicMaterial({color:0, lineWidth:1}), a = new THREE.Line(a, d);
  a.type = THREE.Lines;
  b.add(a)
};
AICRAFT.ClientEngine.key = function(b, a) {
  return"w" == a ? b & 8 ? !0 : !1 : "a" == a ? b & 4 ? !0 : !1 : "s" == a ? b & 2 ? !0 : !1 : "d" == a ? b & 1 ? !0 : !1 : "e" == a ? b & 16 ? !0 : !1 : !1
};

