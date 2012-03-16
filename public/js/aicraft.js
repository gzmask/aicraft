var AICRAFT = AICRAFT || {};
"undefined" !== typeof exports && null !== exports && (exports.AICRAFT = AICRAFT);
AICRAFT.GameObject = function(a, b, c, d, e, f, h) {
  this.position = {};
  this.position.x = parseFloat(a);
  this.position.y = parseFloat(b);
  this.position.z = parseFloat(c);
  this.quaternion = {};
  this.quaternion.x = d || 0;
  this.quaternion.y = e || 0;
  this.quaternion.z = f || 0;
  this.quaternion.w = void 0 === h ? 1 : h;
  this.quaternion.x = parseFloat(this.quaternion.x);
  this.quaternion.y = parseFloat(this.quaternion.y);
  this.quaternion.z = parseFloat(this.quaternion.z);
  this.quaternion.w = parseFloat(this.quaternion.w);
  this.phybody = this.mesh = void 0;
  this.depth = this.height = this.width = 8;
  this.radius = 5;
  this.mass = 1;
  this.friction = 3;
  this.angularFactor = 0;
  this.IsClient = !1;
  this.objs = this.dynamicsWorld = void 0
};
AICRAFT.GameObject.prototype = {constructor:AICRAFT.GameObject, buildMesh:function(a, b, c) {
  this.mesh = new a.Mesh(new a.SphereGeometry(this.radius), new a.MeshLambertMaterial({color:c}));
  this.mesh.castShadow = !0;
  this.mesh.receiveShadow = !0;
  this.mesh.position.x = this.position.x;
  this.mesh.position.y = this.position.y;
  this.mesh.position.z = this.position.z;
  this.mesh.useQuaternion = !0;
  this.mesh.quaternion.set(this.quaternion.x, this.quaternion.y, this.quaternion.z, this.quaternion.w);
  b.add(this.mesh)
}, buildPhysic:function(a, b) {
  void 0 !== a && (Ammo = a);
  var c = new Ammo.btSphereShape(this.radius), d = new Ammo.btTransform;
  d.setIdentity();
  d.setOrigin(new Ammo.btVector3(this.position.x, this.position.y, this.position.z));
  d.setRotation(new Ammo.btQuaternion(this.quaternion.x, this.quaternion.y, this.quaternion.z, this.quaternion.w));
  var e = 0 != this.mass, f = new Ammo.btVector3(0, 0, 0);
  e && c.calculateLocalInertia(this.mass, f);
  d = new Ammo.btDefaultMotionState(d);
  c = new Ammo.btRigidBodyConstructionInfo(this.mass, d, c, f);
  this.phybody = new Ammo.btRigidBody(c);
  this.phybody.setFriction(this.friction);
  this.phybody.setAngularFactor(this.angularFactor);
  this.dynamicsWorld = b;
  this.dynamicsWorld.addRigidBody(this.phybody)
}, setPos:function(a, b, c, d, e, f, h, g, k, j, i) {
  b = parseFloat(b);
  c = parseFloat(c);
  d = parseFloat(d);
  e = parseFloat(e);
  f = parseFloat(f);
  h = parseFloat(h);
  g = parseFloat(g);
  k = parseFloat(k);
  j = parseFloat(j);
  i = parseFloat(i);
  void 0 !== a && (Ammo = a);
  a = new Ammo.btTransform;
  a.setIdentity();
  a.setOrigin(new Ammo.btVector3(b, c, d));
  a.setRotation(new Ammo.btQuaternion(e, f, h, g));
  this.position.x = b;
  this.position.y = c;
  this.position.z = d;
  this.quaternion.x = e;
  this.quaternion.y = f;
  this.quaternion.z = h;
  this.quaternion.w = g;
  this.phybody.activate();
  this.phybody.getMotionState().setWorldTransform(a);
  this.phybody.setCenterOfMassTransform(a);
  this.phybody.setAngularVelocity(new Ammo.btVector3(k, j, i))
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
  this.phybody.getMotionState() && (this.phybody.getMotionState().getWorldTransform(a.trans), this.position.x = parseFloat(a.trans.getOrigin().x().toFixed(2)), this.position.y = parseFloat(a.trans.getOrigin().y().toFixed(2)), this.position.z = parseFloat(a.trans.getOrigin().z().toFixed(2)), this.quaternion.x = parseFloat(a.trans.getRotation().x()), this.quaternion.y = parseFloat(a.trans.getRotation().y()), this.quaternion.z = parseFloat(a.trans.getRotation().z()), this.quaternion.w = parseFloat(a.trans.getRotation().w()))
}};
AICRAFT.Ai = function(a, b, c, d, e, f, h, g) {
  AICRAFT.GameObject.call(this, a, b, c, d, e, f, h);
  this.Ammo = void 0 !== g ? g : Ammo;
  this.sight = {};
  this.sight.lines = [];
  this.sight.quaternion = {};
  this.sight.quaternion.x = 0;
  this.sight.quaternion.y = 0;
  this.sight.quaternion.z = 0;
  this.sight.quaternion.w = 1;
  this.sight.range = 80;
  this.sightMesh = void 0;
  this.maxSpeed = 10;
  this.acceleration = 28;
  this.weaponLock = this.raycastLock = this.lookAtLock = this.rotateLock = this.moveLock = this.codeUploading = !1;
  this.weaponRange = 100;
  this.weaponDelay = 1E3;
  this.hp = 100;
  this.onSightFound = this.owner = this.name = this.walkMesh = void 0
};
AICRAFT.Ai.prototype = new AICRAFT.GameObject;
AICRAFT.Ai.prototype.constructor = AICRAFT.Ai;
AICRAFT.Ai.prototype.buildMesh = function(a, b, c) {
  AICRAFT.Ai.JSONloader(this, "asset/rat_walk.js", this.walkMesh, b, c, a);
  var d = new a.Geometry;
  d.vertices = AICRAFT.Ai.getSight(0, 0, 0, 0, 0, -1, this.sight.range, 60, 10, this.Ammo, !1);
  c = new a.LineBasicMaterial({color:c, lineWidth:1});
  this.sightMesh = new a.Line(d, c);
  this.sightMesh.type = a.Lines;
  this.sightMesh.useQuaternion = !0;
  this.sightMesh.position.x = this.position.x;
  this.sightMesh.position.y = this.position.y;
  this.sightMesh.position.z = this.position.z;
  this.sightMesh.quaternion.x = this.quaternion.x;
  this.sightMesh.quaternion.y = this.quaternion.y;
  this.sightMesh.quaternion.z = this.quaternion.z;
  this.sightMesh.quaternion.w = this.quaternion.w;
  b.add(this.sightMesh)
};
AICRAFT.Ai.prototype.buildPhysic = function(a, b) {
  AICRAFT.GameObject.prototype.buildPhysic.call(this, a, b);
  this.sight.quaternion.x = this.quaternion.x;
  this.sight.quaternion.y = this.quaternion.y;
  this.sight.quaternion.z = this.quaternion.z;
  this.sight.quaternion.w = this.quaternion.w;
  this.sight.lines = AICRAFT.Ai.getSight(0, 0, 0, 0, 0, -1, this.sight.range, 60, 10, this.Ammo, !0)
};
AICRAFT.Ai.prototype.physicAndGraphicUpdate = function(a, b) {
  void 0 !== this.mesh && (this.physicUpdate.call(this, a), this.sightMesh.position.x = this.mesh.position.x = this.position.x, this.sightMesh.position.y = this.mesh.position.y = this.position.y, this.sightMesh.position.z = this.mesh.position.z = this.position.z, this.mesh.quaternion.x = this.quaternion.x, this.mesh.quaternion.y = this.quaternion.y, this.mesh.quaternion.z = this.quaternion.z, this.mesh.quaternion.w = this.quaternion.w, this.sightMesh.quaternion.x = this.sight.quaternion.x, this.sightMesh.quaternion.y = 
  this.sight.quaternion.y, this.sightMesh.quaternion.z = this.sight.quaternion.z, this.sightMesh.quaternion.w = this.sight.quaternion.w, this.mesh.updateAnimation(1E3 * b))
};
AICRAFT.Ai.prototype.physicUpdate = function() {
  AICRAFT.GameObject.prototype.physicUpdate.call(this, this.dynamicsWorld);
  var a = new this.Ammo.btQuaternion(this.sight.quaternion.x, this.sight.quaternion.y, this.sight.quaternion.z, this.sight.quaternion.w), b = new this.Ammo.btTransform;
  b.setIdentity();
  b.setRotation(a);
  var c = new this.Ammo.btVector3(0, 0, -1), c = b.op_mul(c);
  this.sight.lines = AICRAFT.Ai.getSight(this.position.x, this.position.y, this.position.z, c.getX() + this.position.x, c.getY() + this.position.y, c.getZ() + this.position.z, 80, 60, 10, this.Ammo, !0);
  this.raycast(1E3);
  this.Ammo.destroy(b);
  this.Ammo.destroy(a)
};
AICRAFT.Ai.prototype.raycast = function(a) {
  if(!0 !== this.raycastLock) {
    for(var b = this, c = 0;c < b.sight.lines.length;c += 2) {
      var d = b.sight.lines[c], e = b.sight.lines[c + 1], f = new b.Ammo.ClosestRayResultCallback(d, e);
      this.dynamicsWorld.rayTest(d, e, f);
      f.hasHit() && (b.raycastLock = !0, b.found(f.get_m_hitPointWorld().getX(), f.get_m_hitPointWorld().getY(), f.get_m_hitPointWorld().getZ(), f.get_m_collisionObject().getIslandTag()), setTimeout(function() {
        b.raycastLock = !1
      }, a))
    }
  }
};
AICRAFT.Ai.prototype.fireAt = function(a, b, c, d) {
  if(!0 !== this.weaponLock) {
    var e = this, f = new e.Ammo.btVector3(e.position.x, e.position.y, e.position.z), a = new e.Ammo.btVector3(a - e.position.x, b - e.position.y, c - e.position.z);
    a.normalize();
    a.op_mul(e.weaponRange);
    a.op_add(f);
    console.log("fire from" + f.getX() + "," + f.getZ() + " to " + a.getX() + "," + a.getZ());
    b = new e.Ammo.ClosestRayResultCallback(f, a);
    e.dynamicsWorld.rayTest(f, a, b);
    b.hasHit() && (e.weaponLock = !0, console.log("hit! objectID:" + b.get_m_collisionObject().getIslandTag()), setTimeout(function() {
      e.weaponLock = !1;
      void 0 !== d && d()
    }, e.weaponDelay))
  }
};
AICRAFT.Ai.prototype.found = function(a, b, c, d) {
  if(!(-1 === d || d === this.owner.phybody.getIslandTag())) {
    event = {};
    event.position = [a, b, c];
    event.tag = d;
    try {
      this.onSightFound(event)
    }catch(e) {
    }
  }
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
    var d = c.phybody.getOrientation(), e = AICRAFT.quatFromEuler(a, 0, 0, c.Ammo), d = AICRAFT.quatMul(e, d);
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
AICRAFT.Ai.prototype.setPos = function(a, b, c, d, e, f, h, g, k, j, i, l, m, n, o) {
  b = parseFloat(b);
  c = parseFloat(c);
  d = parseFloat(d);
  e = parseFloat(e);
  f = parseFloat(f);
  h = parseFloat(h);
  g = parseFloat(g);
  k = parseFloat(k);
  j = parseFloat(j);
  i = parseFloat(i);
  l = parseFloat(l);
  m = parseFloat(m);
  n = parseFloat(n);
  o = parseFloat(o);
  AICRAFT.GameObject.prototype.setPos.call(this, a, b, c, d, e, f, h, g, m, n, o);
  this.sight.quaternion.x = k;
  this.sight.quaternion.y = j;
  this.sight.quaternion.z = i;
  this.sight.quaternion.w = l;
  this.sightMesh.quaternion.x = this.sight.quaternion.x;
  this.sightMesh.quaternion.y = this.sight.quaternion.y;
  this.sightMesh.quaternion.z = this.sight.quaternion.z;
  this.sightMesh.quaternion.w = this.sight.quaternion.w
};
AICRAFT.Ai.lookRotate = function(a, b, c, d) {
  AICRAFT.Ai.rotate(a, b, c, d, !1, !0, 30)
};
AICRAFT.Ai.rotate = function(a, b, c, d, e, f, h) {
  if(1 > b || 1 > a.hp || a.codeUploading || !0 === a.rotateLock) {
    return void 0 !== c && !0 !== a.codeUploading && c(), console.log("quiting rotate"), !1
  }
  a.rotateLock = !0;
  360 < b && (b %= 360);
  var g = a.phybody.getOrientation(), k = new a.Ammo.btQuaternion(a.sight.quaternion.x, a.sight.quaternion.y, a.sight.quaternion.z, a.sight.quaternion.w), j = new a.Ammo.btQuaternion, j = !0 === d ? AICRAFT.quatFromEuler(1, 0, 0) : AICRAFT.quatFromEuler(-1, 0, 0);
  if(!0 === e) {
    g = AICRAFT.quatMul(g, j);
    a.quaternion.x = g.getX();
    a.quaternion.y = g.getY();
    a.quaternion.z = g.getZ();
    a.quaternion.w = g.getW();
    var i = new a.Ammo.btTransform;
    i.setIdentity();
    i.setOrigin(new a.Ammo.btVector3(a.position.x, a.position.y, a.position.z));
    i.setRotation(g);
    a.phybody.activate();
    a.phybody.getMotionState().setWorldTransform(i);
    a.phybody.setCenterOfMassTransform(i)
  }
  !0 === f && (g = AICRAFT.quatMul(k, j), a.sight.quaternion.x = g.getX(), a.sight.quaternion.y = g.getY(), a.sight.quaternion.z = g.getZ(), a.sight.quaternion.w = g.getW());
  setTimeout(function() {
    a.rotateLock = !1;
    AICRAFT.Ai.rotate(a, b - 1, c, d, e, f, h)
  }, h)
};
AICRAFT.Ai.move = function(a, b, c, d, e) {
  if(1 > b || 1 > a.hp || a.codeUploading || !0 === a.moveLock) {
    return void 0 !== c && !0 !== a.codeUploading && c(), console.log("quiting move"), !1
  }
  a.moveLock = !0;
  var f = a.phybody.getLinearVelocity(), f = Math.sqrt(f.getX() * f.getX() + f.getY() * f.getY() + f.getZ() * f.getZ());
  a.phybody.activate();
  var h = a.phybody.getOrientation(), g = new a.Ammo.btTransform;
  g.setIdentity();
  g.setRotation(h);
  h = new a.Ammo.btVector3(0, 0, -1);
  h = g.op_mul(h);
  for(g = 0;g < a.acceleration;g++) {
    h.setX(1.1 * h.getX()), h.setY(1.1 * h.getY()), h.setZ(1.1 * h.getZ())
  }
  d || (h.setX(-1 * h.getX()), h.setY(-1 * h.getY()), h.setZ(-1 * h.getZ()));
  f < a.maxSpeed && a.phybody.applyCentralImpulse(h);
  setTimeout(function() {
    a.moveLock = !1;
    AICRAFT.Ai.move(a, b - 1, c, d, e)
  }, e)
};
AICRAFT.Ai.JSONloader = function(a, b, c, d, e, f) {
  (new f.JSONLoader).load(b, function(b) {
    var g = b.materials[0];
    g.morphTargets = !0;
    g.color.setHex(e);
    g.ambient.setHex(2236962);
    g = new f.MeshFaceMaterial;
    b = new f.MorphAnimMesh(b, g);
    b.duration = 1E3;
    b.time = 0;
    c = b;
    c.castShadow = !0;
    c.receiveShadow = !0;
    c.position.x = a.position.x;
    c.position.y = a.position.y;
    c.position.z = a.position.z;
    c.useQuaternion = !0;
    c.quaternion.set(a.quaternion.x, a.quaternion.y, a.quaternion.z, a.quaternion.w);
    c.scale.set(5, 5, 5);
    a.mesh = c;
    d.add(c)
  })
};
AICRAFT.Ai.getSight = function(a, b, c, d, e, f, h, g, k, j, i) {
  var l = [], d = new j.btVector3(d - a, e - b, f - c), e = AICRAFT.quatFromEuler(g / 2, 0, 0, j), f = new j.btTransform;
  f.setRotation(e);
  d = f.op_mul(d);
  d.normalize();
  d.op_mul(h);
  do {
    l.push(AICRAFT.v(a, b, c, i), AICRAFT.v(d.getX() + a, d.getY() + b, d.getZ() + c, i)), e = AICRAFT.quatFromEuler(-1 * k, 0, 0, j), f.setRotation(e), d = f.op_mul(d), d.normalize(), d.op_mul(h), g -= k
  }while(0 <= g);
  j.destroy(e);
  j.destroy(f);
  return l
};
AICRAFT.Player = function(a, b, c, d, e, f, h, g) {
  AICRAFT.GameObject.call(this, a, b, c, d, e, f, h);
  this.Ammo = void 0 !== g ? g : Ammo;
  this.maxSpeed = 20;
  this.acceleration = 4;
  this.connected = !1;
  this.keycode = 0;
  this.codeUploading = !1
};
AICRAFT.Player.prototype = new AICRAFT.GameObject;
AICRAFT.Player.prototype.constructor = AICRAFT.Player;
AICRAFT.Player.prototype.handleKeyDown = function(a, b) {
  "W" == String.fromCharCode(a.keyCode) ? b.keycode |= 8 : "A" == String.fromCharCode(a.keyCode) ? b.keycode |= 4 : "S" == String.fromCharCode(a.keyCode) ? b.keycode |= 2 : "D" == String.fromCharCode(a.keyCode) ? b.keycode |= 1 : "E" == String.fromCharCode(a.keyCode) ? b.keycode |= 16 : "Q" == String.fromCharCode(a.keyCode) ? b.keycode |= 32 : 17 == a.keyCode && (b.keycode |= 64)
};
AICRAFT.Player.prototype.handleKeyUp = function(a, b) {
  "W" == String.fromCharCode(a.keyCode) ? b.keycode ^= 8 : "A" == String.fromCharCode(a.keyCode) ? b.keycode ^= 4 : "S" == String.fromCharCode(a.keyCode) ? b.keycode ^= 2 : "D" == String.fromCharCode(a.keyCode) ? b.keycode ^= 1 : "E" == String.fromCharCode(a.keyCode) ? b.keycode ^= 16 : "Q" == String.fromCharCode(a.keyCode) ? b.keycode ^= 32 : 17 == a.keyCode && (b.keycode ^= 64)
};
AICRAFT.Player.prototype.updateInput = function(a, b) {
  AICRAFT.ClientEngine.key(this.keycode, "ctl") && !0 === this.IsClient && b.fire();
  if(!0 !== this.codeUploading) {
    void 0 !== a && (Ammo = a);
    var c = this.phybody.getLinearVelocity(), c = Math.sqrt(c.getX() * c.getX() + c.getY() * c.getY() + c.getZ() * c.getZ());
    AICRAFT.ClientEngine.key(this.keycode, "w") && c < this.maxSpeed && 1 > this.position.y && AICRAFT.Player.ahead(this, !0);
    AICRAFT.ClientEngine.key(this.keycode, "a") && c < this.maxSpeed && 1 > this.position.y && AICRAFT.Player.side(this, !0);
    AICRAFT.ClientEngine.key(this.keycode, "s") && c < this.maxSpeed && 1 > this.position.y && AICRAFT.Player.ahead(this, !1);
    AICRAFT.ClientEngine.key(this.keycode, "d") && c < this.maxSpeed && 1 > this.position.y && AICRAFT.Player.side(this, !1);
    AICRAFT.ClientEngine.key(this.keycode, "e") && 0.1 > this.position.y && this.rotate(2);
    AICRAFT.ClientEngine.key(this.keycode, "q") && 0.1 > this.position.y && this.rotate(2, !0)
  }
};
AICRAFT.Player.prototype.rotate = function(a, b) {
  if(!0 !== this.codeUploading) {
    void 0 === b && (b = !1);
    var c = this.phybody.getOrientation(), d = new this.Ammo.btQuaternion, d = !0 === b ? AICRAFT.quatFromEuler(a, 0, 0) : AICRAFT.quatFromEuler(-1 * a, 0, 0), c = AICRAFT.quatMul(c, d);
    this.quaternion.x = c.getX();
    this.quaternion.y = c.getY();
    this.quaternion.z = c.getZ();
    this.quaternion.w = c.getW();
    d = new this.Ammo.btTransform;
    d.setIdentity();
    d.setOrigin(new this.Ammo.btVector3(this.position.x, this.position.y, this.position.z));
    d.setRotation(c);
    this.phybody.activate();
    this.phybody.getMotionState().setWorldTransform(d);
    this.phybody.setCenterOfMassTransform(d)
  }
};
AICRAFT.Player.side = function(a, b) {
  var c;
  c = !0 === b ? new a.Ammo.btVector3(-1, 0, 0) : new a.Ammo.btVector3(1, 0, 0);
  AICRAFT.Player.move(a, c)
};
AICRAFT.Player.ahead = function(a, b) {
  var c;
  c = !0 === b ? new a.Ammo.btVector3(0, 0, -1) : new a.Ammo.btVector3(0, 0, 1);
  AICRAFT.Player.move(a, c)
};
AICRAFT.Player.move = function(a, b) {
  if(!0 !== this.codeUploading) {
    a.phybody.activate();
    var c = a.phybody.getOrientation(), d = new a.Ammo.btTransform;
    d.setIdentity();
    d.setRotation(c);
    b = d.op_mul(b);
    for(c = 0;c < a.acceleration;c++) {
      b.setX(1.1 * b.getX()), b.setY(1.1 * b.getY()), b.setZ(1.1 * b.getZ())
    }
    a.phybody.applyCentralImpulse(b)
  }
};
AICRAFT.CameraControl = function(a, b, c) {
  this.camera = a;
  this.camera.useQuaternion = !0;
  this.camera.lookAt(new THREE.Vector3(0, 0, -1));
  this.domElement = c || document;
  this.gameObj = b;
  this.target = new THREE.Vector3(0, 0, 0);
  this.deltaY = this.prevMouseY = this.mouseYc = this.mouseY = this.deltaX = this.prevMouseX = this.mouseXc = this.mouseX = 0;
  this.mouseDragOn = !1;
  this.speed = 2;
  this.domElement === document ? (this.viewHalfX = window.innerWidth / 2, this.viewHalfY = window.innerHeight / 2) : (this.viewHalfX = this.domElement.offsetWidth / 2, this.viewHalfY = this.domElement.offsetHeight / 2, this.domElement.setAttribute("tabindex", -1))
};
AICRAFT.CameraControl.prototype.constructor = AICRAFT.CameraControl;
AICRAFT.CameraControl.prototype.update = function() {
  this.camera.position.x = this.gameObj.position.x;
  this.camera.position.y = this.gameObj.position.y;
  this.camera.position.z = this.gameObj.position.z;
  var a = this.tailVector();
  this.camera.position.x += a.x;
  this.camera.position.y += a.y;
  this.camera.position.z += a.z;
  this.camera.position.y += 10;
  this.camera.quaternion.x = this.gameObj.quaternion.x;
  this.camera.quaternion.y = this.gameObj.quaternion.y;
  this.camera.quaternion.z = this.gameObj.quaternion.z;
  this.camera.quaternion.w = this.gameObj.quaternion.w
};
AICRAFT.CameraControl.prototype.onMouseMove = function(a) {
  this.domElement === document ? (this.mouseX = a.pageX, this.mouseY = a.pageY) : (this.mouseX = a.pageX - this.viewHalfX, this.mouseY = a.pageY - this.viewHalfY);
  this.domElement === document ? (this.mouseXc = a.pageX - this.viewHalfX, this.mouseYc = a.pageY - this.viewHalfY) : (this.mouseXc = a.pageX - this.domElement.offsetLeft - this.viewHalfX, this.mouseYc = a.pageY - this.domElement.offsetTop - this.viewHalfY);
  this.deltaX = this.mouseX - this.prevMouseX;
  this.deltaY = this.mouseY - this.prevMouseY;
  this.prevMouseX = this.mouseX;
  this.prevMouseY = this.mouseY
};
AICRAFT.CameraControl.prototype.onMouseDown = function(a) {
  this.domElement !== document && this.domElement.focus();
  a.preventDefault();
  a.stopPropagation();
  this.mouseDragOn = !0
};
AICRAFT.CameraControl.prototype.onMouseUp = function(a) {
  a.preventDefault();
  a.stopPropagation();
  this.mouseDragOn = !1
};
AICRAFT.CameraControl.prototype.pitch = function() {
};
AICRAFT.CameraControl.prototype.tailVector = function() {
  return AICRAFT.CameraControl.setVector(this, 20, !1)
};
AICRAFT.CameraControl.prototype.frontVector = function() {
  return AICRAFT.CameraControl.setVector(this, 1, !0)
};
AICRAFT.CameraControl.setVector = function(a, b, c) {
  var c = new Ammo.btVector3(0, 0, !0 === c ? -1 : 1), a = a.gameObj.phybody.getOrientation(), d = new Ammo.btTransform;
  d.setIdentity();
  d.setRotation(a);
  c = d.op_mul(c);
  return new THREE.Vector3(c.getX() * b, c.getY() * b, c.getZ() * b)
};
AICRAFT.CodeEmitter = function(a, b, c, d, e) {
  var f = this;
  this.cameraControls = a;
  this.socket = d;
  this.player = b;
  this.ai = c;
  if(void 0 === e || null === e) {
    e = document.body
  }
  this.switching = this.IsEnable = !1;
  this.editor = document.createElement("div");
  this.editor.id = "editor";
  this.editor.style.background = "#999";
  this.editor.style.width = "80%";
  this.editor.style.height = "80%";
  this.editor.style.zIndex = "-3";
  this.editor.style.position = "absolute";
  this.editor.style.visibility = "hidden";
  this.editor.style.left = this.cameraControls.viewHalfX;
  this.editor.style.top = this.cameraControls.viewHalfY;
  e.appendChild(this.editor);
  this.editorAce = ace.edit("editor");
  this.editorAce.setReadOnly(!1);
  this.editorAceDom = document.getElementById("editor");
  d.on("emitterInit", function(b) {
    b = b.replace(/ai_name_to_replace/g, "AI_" + f.ai.name.toString());
    f.editorAce.focus();
    f.editorAce.getSession().setValue(b)
  })
};
AICRAFT.CodeEmitter.prototype.constructor = AICRAFT.CodeEmitter;
AICRAFT.CodeEmitter.prototype.fire = function() {
  if(!0 !== this.switching) {
    this.switching = !0;
    !0 === this.IsEnable ? this.send() : this.enable();
    var a = this;
    setTimeout(function() {
      a.switching = !1
    }, 1500)
  }
};
AICRAFT.CodeEmitter.prototype.enable = function() {
  !0 !== this.IsEnable && (this.IsEnable = !0, this.editor.style.visibility = "visible", this.editor.style.left = "20%", this.editor.style.top = "20%", this.editorAceDom.style.visibility = "visible", this.editor.style.zIndex = "3", this.editorAce.setReadOnly(!1), this.ai.codeUploading = !0, this.player.codeUploading = !0, this.socket.emit("code"))
};
AICRAFT.CodeEmitter.prototype.send = function() {
  !1 !== this.IsEnable && (this.IsEnable = !1, this.editor.style.visibility = "hidden", this.editorAceDom.style.visibility = "hidden", this.editor.style.zIndex = "-3", this.editorAce.setReadOnly(!0), this.ai.codeUploading = !1, this.player.codeUploading = !1, this.socket.emit("coded", this.editorAce.getSession().getValue()))
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
AICRAFT.v = function(a, b, c, d) {
  return!0 === d ? AICRAFT.bv(a, b, c) : new THREE.Vertex(new THREE.Vector3(a, b, c))
};
AICRAFT.bv = function(a, b, c) {
  return new Ammo.btVector3(a, b, c)
};
AICRAFT.quatMul = function(a, b) {
  return new Ammo.btQuaternion(a.getW() * b.getX() + a.getX() * b.getW() + a.getY() * b.getZ() - a.getZ() * b.getY(), a.getW() * b.getY() + a.getY() * b.getW() + a.getZ() * b.getX() - a.getX() * b.getZ(), a.getW() * b.getZ() + a.getZ() * b.getW() + a.getX() * b.getY() - a.getY() * b.getX(), a.getW() * b.getW() - a.getX() * b.getX() - a.getY() * b.getY() - a.getZ() * b.getZ())
};
AICRAFT.quatFromEuler = function(a, b, c, d) {
  this.Ammo = void 0 !== d ? d : Ammo;
  var d = a * Math.PI / 360, e = b * Math.PI / 360, f = c * Math.PI / 360, c = Math.sin(d), b = Math.sin(e), a = Math.sin(f), d = Math.cos(d), e = Math.cos(e), f = Math.cos(f);
  return(new this.Ammo.btQuaternion(a * d * e - f * c * b, f * c * e + a * d * b, f * d * b - a * c * e, f * d * e + a * c * b)).normalize()
};
AICRAFT.bind = function(a, b) {
  return function() {
    b.apply(a, arguments)
  }
};
AICRAFT.Engine = function() {
  this.dynamicsWorld = void 0;
  this.totalPlayers = 2;
  this.players = [];
  this.ais = [];
  this.objs = [];
  this.animateFPS = 60;
  this.posFPS = 20;
  this.phyFPS = 30;
  this.aiEngine = void 0
};
AICRAFT.Engine.prototype = {constructor:AICRAFT.Engine, init:function(a, b, c) {
  var d = this;
  d.aiEngine = c;
  var a = new b.btDefaultCollisionConfiguration, c = new b.btCollisionDispatcher(a), e = new b.btDbvtBroadphase, f = new b.btSequentialImpulseConstraintSolver;
  this.dynamicsWorld = new b.btDiscreteDynamicsWorld(c, e, f, a);
  this.dynamicsWorld.setGravity(new b.btVector3(0, -9.82, 0));
  this.dynamicsWorld.trans = new b.btTransform;
  this.dynamicsWorld.trans.setIdentity();
  (function() {
    var a = new b.btBoxShape(new b.btVector3(200, 0.5, 200)), c = new b.btTransform;
    c.setIdentity();
    c.setOrigin(new b.btVector3(0, -5.5, 0));
    var e = 0, f = 0 != e, i = new b.btVector3(0, 0, 0);
    f && a.calculateLocalInertia(e, i);
    f = new b.btDefaultMotionState(c);
    e = new b.btRigidBodyConstructionInfo(e, f, a, i);
    e = new b.btRigidBody(e);
    d.dynamicsWorld.addRigidBody(e);
    a = new b.btBoxShape(new b.btVector3(200, 15, 0.5));
    c = new b.btTransform;
    c.setIdentity();
    c.setOrigin(new b.btVector3(0, -5.5, -200));
    e = 0;
    f = 0 != e;
    i = new b.btVector3(0, 0, 0);
    f && a.calculateLocalInertia(e, i);
    f = new b.btDefaultMotionState(c);
    e = new b.btRigidBodyConstructionInfo(e, f, a, i);
    e = new b.btRigidBody(e);
    d.dynamicsWorld.addRigidBody(e);
    a = new b.btBoxShape(new b.btVector3(0.5, 15, 200));
    c = new b.btTransform;
    c.setIdentity();
    c.setOrigin(new b.btVector3(200, -5.5, 0));
    e = 0;
    f = 0 != e;
    i = new b.btVector3(0, 0, 0);
    f && a.calculateLocalInertia(e, i);
    f = new b.btDefaultMotionState(c);
    e = new b.btRigidBodyConstructionInfo(e, f, a, i);
    e = new b.btRigidBody(e);
    d.dynamicsWorld.addRigidBody(e);
    a = new b.btBoxShape(new b.btVector3(200, 15, 0.5));
    c = new b.btTransform;
    c.setIdentity();
    c.setOrigin(new b.btVector3(0, -5.5, 200));
    e = 0;
    f = 0 != e;
    i = new b.btVector3(0, 0, 0);
    f && a.calculateLocalInertia(e, i);
    f = new b.btDefaultMotionState(c);
    e = new b.btRigidBodyConstructionInfo(e, f, a, i);
    e = new b.btRigidBody(e);
    d.dynamicsWorld.addRigidBody(e);
    a = new b.btBoxShape(new b.btVector3(0.5, 15, 200));
    c = new b.btTransform;
    c.setIdentity();
    c.setOrigin(new b.btVector3(-200, -5.5, 0));
    e = 0;
    f = 0 != e;
    i = new b.btVector3(0, 0, 0);
    f && a.calculateLocalInertia(e, i);
    f = new b.btDefaultMotionState(c);
    e = new b.btRigidBodyConstructionInfo(e, f, a, i);
    e = new b.btRigidBody(e);
    d.dynamicsWorld.addRigidBody(e)
  })();
  (function() {
    for(var a = 0;a < d.totalPlayers;a++) {
      quat = AICRAFT.quatFromEuler(0, 0, 0, b), d.players[a] = new AICRAFT.Player(-150 + 301 * Math.random(), 0, -150 + 301 * Math.random(), quat.getX(), quat.getY(), quat.getZ(), quat.getW(), b), d.players[a].buildPhysic(b, d.dynamicsWorld), d.objs[d.players[a].phybody.getIslandTag()] = d.players[a], d.players[a].objs = d.objs, quat = AICRAFT.quatFromEuler(360 * Math.random(), 0, 0, b), d.ais[a] = new AICRAFT.Ai(d.players[a].position.x, 0, d.players[a].position.z - 25, quat.getX(), quat.getY(), 
      quat.getZ(), quat.getW(), b), d.ais[a].buildPhysic(b, d.dynamicsWorld), d.ais[a].owner = d.players[a], d.objs[d.ais[a].phybody.getIslandTag()] = d.ais[a], d.ais[a].objs = d.objs
    }
  })()
}, networkInit:function(a) {
  var b = this;
  a.emit("totalPlayers", this.totalPlayers);
  a.emit("connect", AICRAFT.Engine.getNextAvailablePnum(this.players));
  a.on("connected", function(c) {
    var d = c[0];
    b.ais[d].name = c[1];
    if(b.players[d].connected || void 0 === b.players[d]) {
      return!1
    }
    console.log("Conected players:" + d);
    b.players[d].connected = !0;
    b.aiEngine.initAI(b.ais[d], b.ais[d].name);
    a.set("Pnum", d)
  });
  a.emit("pi", AICRAFT.Engine.encryptedPacket(this.players));
  a.emit("ai", AICRAFT.Engine.encryptedPacket(this.ais));
  a.on("disconnect", function() {
    a.get("Pnum", function(a, d) {
      void 0 !== d && (b.players[d].connected = !1)
    })
  });
  a.emit("emitterInit", b.aiEngine.templateStr);
  a.on("code", function() {
    a.get("Pnum", function(a, d) {
      b.ais[d].codeUploading = !0;
      b.players[d].codeUploading = !0
    })
  });
  a.on("coded", function(c) {
    a.get("Pnum", function(a, e) {
      b.ais[e].codeUploading = !1;
      b.players[e].codeUploading = !1;
      b.aiEngine.loadAI(c, b.ais[e].name)
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
    a.get("Pnum", function(a, f) {
      c.players[f].keycode = d;
      c.players[f].updateInput(b)
    })
  })
}, animate:function() {
  var a = this;
  AICRAFT.requestAnimationFrame(function() {
    a.animate()
  }, a.animateFPS);
  -1 === AICRAFT.Engine.getNextAvailablePnum(a.players) && (a.dynamicsWorld.stepSimulation(1 / a.phyFPS, 10), a.players.forEach(function(b) {
    b.physicUpdate(a.dynamicsWorld)
  }), a.ais.forEach(function(b) {
    b.physicUpdate(a.dynamicsWorld)
  }))
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
AICRAFT.AIEngine.prototype = {constructor:AICRAFT.AIEngine, loadAI:function(a, b) {
  var c = a.replace(/ai_name_to_replace/g, "AI_" + b.toString());
  console.log(c);
  try {
    eval(c)
  }catch(d) {
    console.log(d.message)
  }
  this.ais.forEach(function(a) {
    if(a.body.name === b) {
      try {
        a.run()
      }catch(c) {
        console.log(c.message)
      }
    }
  })
}, initAI:function(a, b) {
  AICRAFT["AI_" + b.toString()] = function(b) {
    this.body = b
  };
  AICRAFT["AI_" + b.toString()].prototype = new (AICRAFT["AI_" + b.toString()]);
  AICRAFT["AI_" + b.toString()].prototype.constructor = AICRAFT["AI_" + b.toString()];
  AICRAFT["AI_" + b.toString()].prototype.run = function() {
  };
  AICRAFT["AI_" + b.toString()].prototype.onSightFound = function() {
  };
  var c = new (AICRAFT["AI_" + b.toString()])(a);
  c.body.onSightFound = function(b) {
    c.onSightFound(b)
  };
  c.run();
  this.ais.push(c)
}, stepSimulation:function() {
  this.ais.forEach(function(a) {
    a.run()
  })
}};
AICRAFT.ClientEngine = function() {
  this.phyFPS = this.keyFPS = 30;
  this.codeEmitter = this.cameraControls = this.camera = this.renderer = this.scene = this.stats = void 0;
  this.clock = new THREE.Clock;
  this.myPnum = this.socket = this.totalPlayers = this.dynamicsWorld = this.ground = void 0;
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
    var a = new Ammo.btDefaultCollisionConfiguration, c = new Ammo.btCollisionDispatcher(a), d = new Ammo.btDbvtBroadphase, e = new Ammo.btSequentialImpulseConstraintSolver;
    b.dynamicsWorld = new Ammo.btDiscreteDynamicsWorld(c, d, e, a);
    b.dynamicsWorld.setGravity(new Ammo.btVector3(0, -9.82, 0));
    b.dynamicsWorld.trans = new Ammo.btTransform;
    b.dynamicsWorld.trans.setIdentity()
  })();
  this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1E4);
  this.scene.add(this.camera);
  THREEx.WindowResize.bind(this.renderer, this.camera);
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
    var d = 0, e = 0 != d, f = new Ammo.btVector3(0, 0, 0);
    e && a.calculateLocalInertia(d, f);
    e = new Ammo.btDefaultMotionState(c);
    d = new Ammo.btRigidBodyConstructionInfo(d, e, a, f);
    b.ground.phybody = new Ammo.btRigidBody(d);
    b.dynamicsWorld.addRigidBody(b.ground.phybody);
    a = new Ammo.btBoxShape(new Ammo.btVector3(200, 15, 0.5));
    c = new Ammo.btTransform;
    c.setIdentity();
    c.setOrigin(new Ammo.btVector3(0, -5.5, -200));
    d = 0;
    e = 0 != d;
    f = new Ammo.btVector3(0, 0, 0);
    e && a.calculateLocalInertia(d, f);
    e = new Ammo.btDefaultMotionState(c);
    d = new Ammo.btRigidBodyConstructionInfo(d, e, a, f);
    d = new Ammo.btRigidBody(d);
    b.dynamicsWorld.addRigidBody(d);
    a = new Ammo.btBoxShape(new Ammo.btVector3(0.5, 15, 200));
    c = new Ammo.btTransform;
    c.setIdentity();
    c.setOrigin(new Ammo.btVector3(200, -5.5, 0));
    d = 0;
    e = 0 != d;
    f = new Ammo.btVector3(0, 0, 0);
    e && a.calculateLocalInertia(d, f);
    e = new Ammo.btDefaultMotionState(c);
    d = new Ammo.btRigidBodyConstructionInfo(d, e, a, f);
    d = new Ammo.btRigidBody(d);
    b.dynamicsWorld.addRigidBody(d);
    a = new Ammo.btBoxShape(new Ammo.btVector3(200, 15, 0.5));
    c = new Ammo.btTransform;
    c.setIdentity();
    c.setOrigin(new Ammo.btVector3(0, -5.5, 200));
    d = 0;
    e = 0 != d;
    f = new Ammo.btVector3(0, 0, 0);
    e && a.calculateLocalInertia(d, f);
    e = new Ammo.btDefaultMotionState(c);
    d = new Ammo.btRigidBodyConstructionInfo(d, e, a, f);
    d = new Ammo.btRigidBody(d);
    b.dynamicsWorld.addRigidBody(d);
    a = new Ammo.btBoxShape(new Ammo.btVector3(0.5, 15, 200));
    c = new Ammo.btTransform;
    c.setIdentity();
    c.setOrigin(new Ammo.btVector3(-200, -5.5, 0));
    d = 0;
    e = 0 != d;
    f = new Ammo.btVector3(0, 0, 0);
    e && a.calculateLocalInertia(d, f);
    e = new Ammo.btDefaultMotionState(c);
    d = new Ammo.btRigidBodyConstructionInfo(d, e, a, f);
    d = new Ammo.btRigidBody(d);
    b.dynamicsWorld.addRigidBody(d)
  })();
  var e = new THREE.Quaternion, f = [11960, 10079283, 16716820, 6736896, 7686143, 4029112];
  (function() {
    for(var c = 0;c < b.totalPlayers;c++) {
      var d = Math.floor(6 * Math.random());
      e.setFromEuler(new THREE.Vector3(-30, -20, 0));
      b.players[c] = new AICRAFT.Player(a.players.bindings[c].position[0], a.players.bindings[c].position[1], a.players.bindings[c].position[2], a.players.bindings[c].quaternion[0], a.players.bindings[c].quaternion[1], a.players.bindings[c].quaternion[2], a.players.bindings[c].quaternion[3]);
      b.players[c].IsClient = !0;
      b.players[c].buildMesh(THREE, b.scene, f[d]);
      b.players[c].buildPhysic(Ammo, b.dynamicsWorld);
      e.setFromEuler(new THREE.Vector3(30, -20, 0));
      b.ais[c] = new AICRAFT.Ai(a.ais.bindings[c].position[0], a.ais.bindings[c].position[1], a.ais.bindings[c].position[2], a.ais.bindings[c].quaternion[0], a.ais.bindings[c].quaternion[1], a.ais.bindings[c].quaternion[2], a.ais.bindings[c].quaternion[3]);
      b.ais[c].IsClient = !0;
      b.ais[c].buildMesh(THREE, b.scene, f[d]);
      b.ais[c].buildPhysic(Ammo, b.dynamicsWorld);
      b.ais[c].owner = b.players[c]
    }
  })();
  this.cameraControls = new AICRAFT.CameraControl(this.camera, this.players[this.myPnum], this.renderer.domElemen);
  this.codeEmitter = new AICRAFT.CodeEmitter(this.cameraControls, this.players[this.myPnum], this.ais[this.myPnum], a);
  document.addEventListener("keydown", function(a) {
    b.players[b.myPnum].handleKeyDown(a, b.players[b.myPnum])
  }, !1);
  document.addEventListener("keyup", function(a) {
    b.players[b.myPnum].handleKeyUp(a, b.players[b.myPnum])
  }, !1);
  AICRAFT.ClientEngine.coordHelper(this.scene)
}, aiNameExist:function(a) {
  this.ais.forEach(function(b) {
    if(b.name === a) {
      return!0
    }
  });
  return!1
}, networkReady:function(a, b, c, d) {
  var e = this;
  e.socket = io.connect("/");
  e.socket.on("totalPlayers", function(a) {
    e.totalPlayers = a
  });
  e.socket.on("connect", function(a) {
    e.myPnum = a
  });
  e.socket.on("pi", function(f) {
    e.socket.players = AICRAFT.Engine.extractPacket(f);
    e.socket.on("ai", function(f) {
      e.socket.ais = AICRAFT.Engine.extractPacket(f);
      if(-1 != e.myPnum) {
        a(e.socket);
        e.players[e.myPnum].connected = !0;
        f = "aicraft" + e.myPnum.toString();
        do {
          prompt("what is the name of your AI?", f)
        }while(!0 === e.aiNameExist(f));
        e.ais[e.myPnum].name = f;
        e.socket.emit("connected", [e.myPnum, e.ais[e.myPnum].name]);
        b();
        c();
        d()
      }else {
        alert("game is full")
      }
    })
  })
}, syncPos:function() {
  var a = this;
  a.socket.on("p", function(b) {
    for(var b = AICRAFT.Engine.extractPacket(b).bindings, c = 0;c < a.totalPlayers;c++) {
      a.players[c].setPos(Ammo, b[c].position[0], b[c].position[1], b[c].position[2], b[c].quaternion[0], b[c].quaternion[1], b[c].quaternion[2], b[c].quaternion[3], b[c].velocity[0], b[c].velocity[1], b[c].velocity[2])
    }
  });
  a.socket.on("a", function(b) {
    for(var b = AICRAFT.Engine.extractPacket(b).bindings, c = 0;c < a.totalPlayers;c++) {
      a.ais[c].setPos(Ammo, b[c].position[0], b[c].position[1], b[c].position[2], b[c].quaternion[0], b[c].quaternion[1], b[c].quaternion[2], b[c].quaternion[3], b[c].sightQuaternion[0], b[c].sightQuaternion[1], b[c].sightQuaternion[2], b[c].sightQuaternion[3], b[c].velocity[0], b[c].velocity[1], b[c].velocity[2])
    }
  })
}, syncKey:function() {
  AICRAFT.requestKeyFrame(this.syncKey.bind(this), this.keyFPS);
  void 0 === this.players[this.myPnum] || void 0 === this.myPnum || (0 != this.players[this.myPnum].keycode ? (this.socket.emit("k", this.players[this.myPnum].keycode), this.players[this.myPnum].updateInput(Ammo, this.codeEmitter)) : 0 == this.players[this.myPnum].keycode && 0 != this.lastKeycode && this.socket.emit("k", 0), this.lastKeycode = this.players[this.myPnum].keycode)
}, animate:function() {
  this.delta = this.clock.getDelta();
  requestAnimationFrame(this.animate.bind(this));
  this.dynamicsWorld.stepSimulation(1 / this.phyFPS, 10);
  for(var a = 0;a < this.totalPlayers;a++) {
    this.players[a].physicAndGraphicUpdate(this.dynamicsWorld, this.delta), this.ais[a].physicAndGraphicUpdate(this.dynamicsWorld, this.delta)
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
  return"w" == b ? a & 8 ? !0 : !1 : "a" == b ? a & 4 ? !0 : !1 : "s" == b ? a & 2 ? !0 : !1 : "d" == b ? a & 1 ? !0 : !1 : "ctl" == b ? a & 64 ? !0 : !1 : "e" == b ? a & 16 ? !0 : !1 : "q" == b ? a & 32 ? !0 : !1 : !1
};

