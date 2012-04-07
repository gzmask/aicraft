var AICRAFT = AICRAFT || {};
"undefined" !== typeof exports && null !== exports && (exports.AICRAFT = AICRAFT);
AICRAFT.GameObject = function(b, a, c, e, d, f, g) {
  this.position = {};
  this.position.x = parseFloat(b);
  this.position.y = parseFloat(a);
  this.position.z = parseFloat(c);
  this.quaternion = {};
  this.quaternion.x = e || 0;
  this.quaternion.y = d || 0;
  this.quaternion.z = f || 0;
  this.quaternion.w = void 0 === g ? 1 : g;
  this.quaternion.x = parseFloat(this.quaternion.x);
  this.quaternion.y = parseFloat(this.quaternion.y);
  this.quaternion.z = parseFloat(this.quaternion.z);
  this.quaternion.w = parseFloat(this.quaternion.w);
  this.mesh = void 0;
  this.sprites = [];
  this.depth = this.height = this.width = 8;
  this.radius = 5;
  this.mass = 1;
  this.friction = 3;
  this.angularFactor = 0;
  this.hp = 100;
  this.IsMoving = this.IsClient = !1
};
AICRAFT.GameObject.prototype = {constructor:AICRAFT.GameObject, buildMesh:function(b, a, c, e) {
  var d = b.ImageUtils.loadTexture("asset/battery_b.png"), b = new b.Sprite({map:d, useScreenCoordinates:!1, color:c});
  b.position.set(this.position.x + b.dx, this.position.y + b.dy, this.position.z + b.dz);
  !0 !== e ? (b.dx = 0, b.dy = 9, b.dz = 0, b.scale.set(0.1, 0.05, 0.1)) : (b.dx = 0, b.dy = 17, b.dz = 0, b.scale.set(0.1, 0.04, 0.1), b.opacity = 0.7);
  a.add(b);
  this.sprites.push(b)
}, setPos:function(b, a, c, e, d, f, g, h, j, i, k, l, m) {
  a = parseFloat(a);
  c = parseFloat(c);
  e = parseFloat(e);
  d = parseFloat(d);
  f = parseFloat(f);
  g = parseFloat(g);
  h = parseFloat(h);
  parseFloat(j);
  parseFloat(i);
  parseFloat(k);
  this.IsMoving = l;
  this.position.x = a;
  this.position.y = c;
  this.position.z = e;
  this.quaternion.x = d;
  this.quaternion.y = f;
  this.quaternion.z = g;
  this.quaternion.w = h;
  this.hp = m
}, physicAndGraphicUpdate:function() {
  this.mesh.position.x = this.position.x;
  this.mesh.position.y = this.position.y;
  this.mesh.position.z = this.position.z;
  this.mesh.quaternion.x = this.quaternion.x;
  this.mesh.quaternion.y = this.quaternion.y;
  this.mesh.quaternion.z = this.quaternion.z;
  this.mesh.quaternion.w = this.quaternion.w;
  var b = this;
  this.sprites.forEach(function(a) {
    a.scale.x = b.hp / 600;
    a.position.set(b.position.x + a.dx, b.position.y + a.dy, b.position.z + a.dz)
  })
}};
AICRAFT.Ai = function(b, a, c, e, d, f, g, h) {
  AICRAFT.GameObject.call(this, b, a, c, e, d, f, g);
  this.Ammo = void 0 !== h ? h : Ammo;
  this.sight = {};
  this.sight.lines = [];
  this.sight.quaternion = {};
  this.sight.quaternion.x = 0;
  this.sight.quaternion.y = 0;
  this.sight.quaternion.z = 0;
  this.sight.quaternion.w = 1;
  this.sight.range = 80;
  this.mesh_t = this.mesh_w = this.name = this.sightMesh = void 0
};
AICRAFT.Ai.prototype = new AICRAFT.GameObject;
AICRAFT.Ai.prototype.constructor = AICRAFT.Ai;
AICRAFT.Ai.prototype.buildMesh = function(b, a, c) {
  var e = this;
  e.mesh = AICRAFT.Ai.JSONloader(e, "asset/rat_turn.js", e.mesh_t, a, c, b, !1, function() {
    e.mesh_t = e.mesh
  });
  e.mesh = AICRAFT.Ai.JSONloader(e, "asset/rat_walk.js", e.mesh_w, a, c, b, !0, function() {
    e.mesh_w = e.mesh;
    AICRAFT.GameObject.prototype.buildMesh.call(e, b, a, c)
  });
  var d = new b.Geometry;
  d.vertices = AICRAFT.Ai.getSight(0, 0, 0, 0, 0, -1, e.sight.range, 60, 10, e.Ammo, !1);
  var f = new b.LineBasicMaterial({color:c, lineWidth:1});
  e.sightMesh = new b.Line(d, f);
  e.sightMesh.type = b.Lines;
  e.sightMesh.useQuaternion = !0;
  e.sightMesh.position.x = e.position.x;
  e.sightMesh.position.y = e.position.y;
  e.sightMesh.position.z = e.position.z;
  e.sightMesh.quaternion.x = e.quaternion.x;
  e.sightMesh.quaternion.y = e.quaternion.y;
  e.sightMesh.quaternion.z = e.quaternion.z;
  e.sightMesh.quaternion.w = e.quaternion.w;
  a.add(e.sightMesh)
};
AICRAFT.Ai.prototype.physicAndGraphicUpdate = function(b) {
  void 0 === this.mesh || 1 > this.hp || (this.applyAnimation(this.mesh_t, this.mesh_w), this.sightMesh.position.x = this.position.x, this.sightMesh.position.y = this.position.y, this.sightMesh.position.z = this.position.z, AICRAFT.GameObject.prototype.physicAndGraphicUpdate.call(this), this.sightMesh.quaternion.x = this.sight.quaternion.x, this.sightMesh.quaternion.y = this.sight.quaternion.y, this.sightMesh.quaternion.z = this.sight.quaternion.z, this.sightMesh.quaternion.w = this.sight.quaternion.w, 
  this.mesh.updateAnimation(1E3 * b))
};
AICRAFT.Ai.prototype.applyAnimation = function(b, a) {
  !0 === this.IsMoving ? (b.visible = !1, a.visible = !0, this.mesh = a) : (b.visible = !0, a.visible = !1, this.mesh = b)
};
AICRAFT.Ai.prototype.deltaPos = function(b, a, c, e) {
  return Math.abs(b - a) + Math.abs(c - e)
};
AICRAFT.Ai.prototype.setPos = function(b, a, c, e, d, f, g, h, j, i, k, l, m, n, o, p, q) {
  a = parseFloat(a);
  c = parseFloat(c);
  e = parseFloat(e);
  d = parseFloat(d);
  f = parseFloat(f);
  g = parseFloat(g);
  h = parseFloat(h);
  j = parseFloat(j);
  i = parseFloat(i);
  k = parseFloat(k);
  l = parseFloat(l);
  m = parseFloat(m);
  n = parseFloat(n);
  o = parseFloat(o);
  AICRAFT.GameObject.prototype.setPos.call(this, b, a, c, e, d, f, g, h, m, n, o, p, q);
  this.sight.quaternion.x = j;
  this.sight.quaternion.y = i;
  this.sight.quaternion.z = k;
  this.sight.quaternion.w = l;
  this.sightMesh.quaternion.x = this.sight.quaternion.x;
  this.sightMesh.quaternion.y = this.sight.quaternion.y;
  this.sightMesh.quaternion.z = this.sight.quaternion.z;
  this.sightMesh.quaternion.w = this.sight.quaternion.w
};
AICRAFT.Ai.JSONloader = function(b, a, c, e, d, f, g, h) {
  (new f.JSONLoader).load(a, function(a) {
    var i = a.materials[0];
    i.morphTargets = !0;
    i.color.setHex(d);
    i.ambient.setHex(2236962);
    i = new f.MeshFaceMaterial;
    a = new f.MorphAnimMesh(a, i);
    a.duration = 1E3;
    a.time = 0;
    c = a;
    c.castShadow = !0;
    c.receiveShadow = !0;
    c.position.x = b.position.x;
    c.position.y = b.position.y;
    c.position.z = b.position.z;
    c.useQuaternion = !0;
    c.quaternion.set(b.quaternion.x, b.quaternion.y, b.quaternion.z, b.quaternion.w);
    c.scale.set(5, 5, 5);
    b.mesh = c;
    e.add(c);
    c.visible = g;
    void 0 !== h && h();
    return c
  })
};
AICRAFT.Ai.getSight = function(b, a, c, e, d, f, g, h, j, i, k) {
  var l = [], e = new i.btVector3(e - b, d - a, f - c), d = AICRAFT.quatFromEuler(h / 2, 0, 0, i), f = new i.btTransform;
  f.setRotation(d);
  e = f.op_mul(e);
  e.normalize();
  e.op_mul(g);
  do {
    l.push(AICRAFT.v(b, a, c, k), AICRAFT.v(e.getX() + b, e.getY() + a, e.getZ() + c, k)), d = AICRAFT.quatFromEuler(-1 * j, 0, 0, i), f.setRotation(d), e = f.op_mul(e), e.normalize(), e.op_mul(g), h -= j
  }while(0 <= h);
  i.destroy(d);
  i.destroy(f);
  return l
};
AICRAFT.Player = function(b, a, c, e, d, f, g, h) {
  AICRAFT.GameObject.call(this, b, a, c, e, d, f, g);
  this.Ammo = void 0 !== h ? h : Ammo;
  this.maxSpeed = 20;
  this.acceleration = 4;
  this.connected = !1;
  this.keycode = 0;
  this.codeUploading = !1;
  this.mesh_t = this.mesh_w = void 0;
  this.IsMe = !1
};
AICRAFT.Player.prototype = new AICRAFT.GameObject;
AICRAFT.Player.prototype.constructor = AICRAFT.Player;
AICRAFT.Player.prototype.buildMesh = function(b, a, c, e) {
  var d = this;
  d.IsMe = e;
  d.mesh = AICRAFT.Player.JSONloader(d, "asset/rat_turn.js", d.mesh_t, a, c, b, !1, function() {
    d.mesh_t = d.mesh
  });
  d.mesh = AICRAFT.Player.JSONloader(d, "asset/rat_walk.js", d.mesh_w, a, c, b, !0, function() {
    d.mesh_w = d.mesh;
    AICRAFT.GameObject.prototype.buildMesh.call(d, b, a, c, e)
  })
};
AICRAFT.Player.prototype.physicAndGraphicUpdate = function(b) {
  void 0 === this.mesh || 1 > this.hp || (this.applyAnimation(this.mesh_t, this.mesh_w), AICRAFT.GameObject.prototype.physicAndGraphicUpdate.call(this), this.mesh.updateAnimation(1E3 * b))
};
AICRAFT.Player.prototype.applyAnimation = function(b, a) {
  !0 === this.IsMoving ? (b.visible = !1, a.visible = !0, this.mesh = a) : (b.visible = !0, a.visible = !1, this.mesh = b)
};
AICRAFT.Player.prototype.handleKeyDown = function(b, a) {
  "W" == String.fromCharCode(b.keyCode) ? a.keycode |= 8 : "A" == String.fromCharCode(b.keyCode) ? a.keycode |= 4 : "S" == String.fromCharCode(b.keyCode) ? a.keycode |= 2 : "D" == String.fromCharCode(b.keyCode) ? a.keycode |= 1 : "E" == String.fromCharCode(b.keyCode) ? a.keycode |= 16 : "Q" == String.fromCharCode(b.keyCode) ? a.keycode |= 32 : 18 == b.keyCode && (a.keycode |= 64)
};
AICRAFT.Player.prototype.handleKeyUp = function(b, a) {
  "W" == String.fromCharCode(b.keyCode) ? a.keycode ^= 8 : "A" == String.fromCharCode(b.keyCode) ? a.keycode ^= 4 : "S" == String.fromCharCode(b.keyCode) ? a.keycode ^= 2 : "D" == String.fromCharCode(b.keyCode) ? a.keycode ^= 1 : "E" == String.fromCharCode(b.keyCode) ? a.keycode ^= 16 : "Q" == String.fromCharCode(b.keyCode) ? a.keycode ^= 32 : 18 == b.keyCode && (a.keycode ^= 64)
};
AICRAFT.Player.prototype.updateInput = function(b) {
  AICRAFT.ClientEngine.key(this.keycode, "code") && b.request()
};
AICRAFT.Player.JSONloader = function(b, a, c, e, d, f, g, h) {
  (new f.JSONLoader).load(a, function(a) {
    var i = a.materials[0];
    i.morphTargets = !0;
    i.color.setHex(d);
    i.ambient.setHex(2236962);
    i = new f.MeshFaceMaterial;
    a = new f.MorphAnimMesh(a, i);
    a.duration = 1E3;
    a.time = 0;
    c = a;
    c.castShadow = !0;
    c.receiveShadow = !0;
    c.position.x = b.position.x;
    c.position.y = b.position.y;
    c.position.z = b.position.z;
    c.useQuaternion = !0;
    c.quaternion.set(b.quaternion.x, b.quaternion.y, b.quaternion.z, b.quaternion.w);
    c.scale.set(5, 5, 5);
    b.mesh = c;
    e.add(c);
    c.visible = g;
    void 0 !== h && h();
    return c
  })
};
AICRAFT.CameraControl = function(b, a, c) {
  this.camera = b;
  this.camera.useQuaternion = !0;
  this.camera.lookAt(new THREE.Vector3(0, 0, -1));
  this.domElement = c || document;
  this.gameObj = a;
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
  var b = this.tailVector();
  this.camera.position.x += b.x;
  this.camera.position.y += b.y;
  this.camera.position.z += b.z;
  this.camera.position.y += 10;
  this.camera.quaternion.x = this.gameObj.quaternion.x;
  this.camera.quaternion.y = this.gameObj.quaternion.y;
  this.camera.quaternion.z = this.gameObj.quaternion.z;
  this.camera.quaternion.w = this.gameObj.quaternion.w
};
AICRAFT.CameraControl.prototype.onMouseMove = function(b) {
  this.domElement === document ? (this.mouseX = b.pageX, this.mouseY = b.pageY) : (this.mouseX = b.pageX - this.viewHalfX, this.mouseY = b.pageY - this.viewHalfY);
  this.domElement === document ? (this.mouseXc = b.pageX - this.viewHalfX, this.mouseYc = b.pageY - this.viewHalfY) : (this.mouseXc = b.pageX - this.domElement.offsetLeft - this.viewHalfX, this.mouseYc = b.pageY - this.domElement.offsetTop - this.viewHalfY);
  this.deltaX = this.mouseX - this.prevMouseX;
  this.deltaY = this.mouseY - this.prevMouseY;
  this.prevMouseX = this.mouseX;
  this.prevMouseY = this.mouseY
};
AICRAFT.CameraControl.prototype.onMouseDown = function(b) {
  this.domElement !== document && this.domElement.focus();
  b.preventDefault();
  b.stopPropagation();
  this.mouseDragOn = !0
};
AICRAFT.CameraControl.prototype.onMouseUp = function(b) {
  b.preventDefault();
  b.stopPropagation();
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
AICRAFT.CameraControl.setVector = function(b, a, c) {
  var c = new Ammo.btVector3(0, 0, !0 === c ? -1 : 1), b = new Ammo.btQuaternion(b.gameObj.quaternion.x, b.gameObj.quaternion.y, b.gameObj.quaternion.z, b.gameObj.quaternion.w), e = new Ammo.btTransform;
  e.setIdentity();
  e.setRotation(b);
  c = e.op_mul(c);
  return new THREE.Vector3(c.getX() * a, c.getY() * a, c.getZ() * a)
};
AICRAFT.CodeEmitter = function(b, a, c, e, d) {
  var f = this;
  this.cameraControls = b;
  this.socket = e;
  this.player = a;
  this.ai = c;
  if(void 0 === d || null === d) {
    d = document.body
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
  d.appendChild(this.editor);
  this.editorAce = ace.edit("editor");
  this.editorAce.setReadOnly(!1);
  this.editorAceDom = document.getElementById("editor");
  e.on("emitterInit", function(a) {
    a = a.replace(/ai_name_to_replace/g, "AI_" + f.ai.name.toString());
    f.editorAce.focus();
    f.editorAce.getSession().setValue(a)
  })
};
AICRAFT.CodeEmitter.prototype.constructor = AICRAFT.CodeEmitter;
AICRAFT.CodeEmitter.prototype.request = function() {
  if(!0 !== this.switching) {
    this.switching = !0;
    !0 === this.IsEnable ? this.send() : this.enable();
    var b = this;
    setTimeout(function() {
      b.switching = !1
    }, 1500)
  }
};
AICRAFT.CodeEmitter.prototype.enable = function() {
  !0 !== this.IsEnable && (this.IsEnable = !0, this.editor.style.visibility = "visible", this.editor.style.left = "20%", this.editor.style.top = "20%", this.editorAceDom.style.visibility = "visible", this.editor.style.zIndex = "3", this.editor.focus(), this.editorAce.setReadOnly(!1), this.editorAce.focus(), this.ai.codeUploading = !0, this.player.codeUploading = !0, this.socket.emit("code"))
};
AICRAFT.CodeEmitter.prototype.send = function() {
  !1 !== this.IsEnable && (this.IsEnable = !1, this.editor.style.visibility = "hidden", this.editorAceDom.style.visibility = "hidden", this.editor.style.zIndex = "-3", this.editorAce.setReadOnly(!0), this.ai.codeUploading = !1, this.player.codeUploading = !1, this.socket.emit("coded", this.editorAce.getSession().getValue()))
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
AICRAFT.v = function(b, a, c, e) {
  return!0 === e ? AICRAFT.bv(b, a, c) : new THREE.Vertex(new THREE.Vector3(b, a, c))
};
AICRAFT.bv = function(b, a, c) {
  return new Ammo.btVector3(b, a, c)
};
AICRAFT.quatMul = function(b, a) {
  return new Ammo.btQuaternion(b.getW() * a.getX() + b.getX() * a.getW() + b.getY() * a.getZ() - b.getZ() * a.getY(), b.getW() * a.getY() + b.getY() * a.getW() + b.getZ() * a.getX() - b.getX() * a.getZ(), b.getW() * a.getZ() + b.getZ() * a.getW() + b.getX() * a.getY() - b.getY() * a.getX(), b.getW() * a.getW() - b.getX() * a.getX() - b.getY() * a.getY() - b.getZ() * a.getZ())
};
AICRAFT.quatFromEuler = function(b, a, c, e) {
  this.Ammo = void 0 !== e ? e : Ammo;
  var e = b * Math.PI / 360, d = a * Math.PI / 360, f = c * Math.PI / 360, c = Math.sin(e), a = Math.sin(d), b = Math.sin(f), e = Math.cos(e), d = Math.cos(d), f = Math.cos(f);
  return(new this.Ammo.btQuaternion(b * e * d - f * c * a, f * c * d + b * e * a, f * e * a - b * c * d, f * e * d + b * c * a)).normalize()
};
AICRAFT.bind = function(b, a) {
  return function() {
    a.apply(b, arguments)
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
AICRAFT.Engine.prototype = {constructor:AICRAFT.Engine, init:function(b, a, c) {
  this.aiEngine = c;
  var b = new a.btDefaultCollisionConfiguration, c = new a.btCollisionDispatcher(b), e = new a.btDbvtBroadphase, d = new a.btSequentialImpulseConstraintSolver;
  this.dynamicsWorld = new a.btDiscreteDynamicsWorld(c, e, d, b);
  this.dynamicsWorld.setGravity(new a.btVector3(0, -9.82, 0));
  this.dynamicsWorld.trans = new a.btTransform;
  this.dynamicsWorld.trans.setIdentity();
  AICRAFT.Engine.initScene(this, a);
  b = [];
  for(e = c = 0;e < this.totalPlayers;e++) {
    quat = AICRAFT.quatFromEuler(0, 0, 0, a), this.players[e] = new AICRAFT.Player(-150 + 301 * Math.random(), 0, -150 + 301 * Math.random(), quat.getX(), quat.getY(), quat.getZ(), quat.getW(), a), this.players[e].buildPhysic(a, this.dynamicsWorld), this.players[e].phybody.setUserPointer(c), b.push(this.players[e]), this.players[e].objects = b, c++, quat = AICRAFT.quatFromEuler(360 * Math.random(), 0, 0, a), this.ais[e] = new AICRAFT.Ai(this.players[e].position.x, 0, this.players[e].position.z - 
    25, quat.getX(), quat.getY(), quat.getZ(), quat.getW(), a), this.ais[e].buildPhysic(a, this.dynamicsWorld), this.ais[e].owner = this.players[e], this.ais[e].phybody.setUserPointer(c), b.push(this.ais[e]), this.ais[e].objects = b, c++
  }
}, networkInit:function(b) {
  var a = this, c = AICRAFT.Engine.getNextAvailablePnum(a.players);
  -1 !== c && (a.players[c].connecting = !0);
  b.emit("totalPlayers", a.totalPlayers);
  b.emit("connect", c);
  b.on("connected", function(c) {
    var d = c[0];
    a.ais[d].name = c[1];
    if(a.players[d].connected || void 0 === a.players[d]) {
      return!1
    }
    console.log("Conected players:" + d);
    a.players[d].connected = !0;
    a.players[d].connecting = !1;
    a.aiEngine.initAI(a.ais[d], a.ais[d].name);
    b.set("Pnum", d)
  });
  b.emit("pi", AICRAFT.Engine.encryptedPacket(this.players));
  b.emit("ai", AICRAFT.Engine.encryptedPacket(this.ais));
  b.on("disconnect", function() {
    b.get("Pnum", function(b, c) {
      void 0 !== c && (a.players[c].connected = !1)
    })
  });
  b.emit("emitterInit", a.aiEngine.templateStr);
  b.on("code", function() {
    b.get("Pnum", function(b, c) {
      a.ais[c].codeUploading = !0;
      a.players[c].codeUploading = !0
    })
  });
  b.on("coded", function(c) {
    b.get("Pnum", function(b, f) {
      a.ais[f].codeUploading = !1;
      a.players[f].codeUploading = !1;
      a.aiEngine.loadAI(c, a.ais[f].name)
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
  var c = this;
  b.on("k", function(e) {
    b.get("Pnum", function(b, f) {
      c.players[f].keycode = e;
      c.players[f].updateInput(a)
    })
  })
}, animate:function() {
  var b = this;
  AICRAFT.requestAnimationFrame(function() {
    b.animate()
  }, b.animateFPS);
  -1 === AICRAFT.Engine.getNextAvailablePnum(b.players) && (b.dynamicsWorld.stepSimulation(1 / b.phyFPS, 10), b.players.forEach(function(a) {
    a.physicUpdate()
  }), b.ais.forEach(function(a) {
    a.physicUpdate()
  }))
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
    void 0 !== b.sight && (a.push(b.sight.quaternion.x), a.push(b.sight.quaternion.y), a.push(b.sight.quaternion.z), a.push(b.sight.quaternion.w));
    a.push(b.phybody.getAngularVelocity().getX());
    a.push(b.phybody.getAngularVelocity().getY());
    a.push(b.phybody.getAngularVelocity().getZ());
    a.push(b.IsMoving);
    a.push(b.hp)
  });
  return a
};
AICRAFT.Engine.extractPacket = function(b) {
  if(0 == b.length % 12) {
    for(var a = '({"bindings":[', c = 0;c < b.length;c += 12) {
      a += '{"position":', a += "[" + b[c] + "," + b[c + 1] + "," + b[c + 2] + "],", a += '"quaternion":', a += "[" + b[c + 3] + "," + b[c + 4] + "," + b[c + 5] + "," + b[c + 6] + "],", a += '"velocity":', a += "[" + b[c + 7] + "," + b[c + 8] + "," + b[c + 9] + "],", a += '"IsMoving":', a += "[" + b[c + 10] + "],", a += '"hp":', a += "[" + b[c + 11] + "]", a += "},"
    }
    return eval(a + "]})")
  }
  if(0 == b.length % 16) {
    a = '({"bindings":[';
    for(c = 0;c < b.length;c += 16) {
      a += '{"position":', a += "[" + b[c] + "," + b[c + 1] + "," + b[c + 2] + "],", a += '"quaternion":', a += "[" + b[c + 3] + "," + b[c + 4] + "," + b[c + 5] + "," + b[c + 6] + "],", a += '"sightQuaternion":', a += "[" + b[c + 7] + "," + b[c + 8] + "," + b[c + 9] + "," + b[c + 10] + "],", a += '"velocity":', a += "[" + b[c + 11] + "," + b[c + 12] + "," + b[c + 13] + "],", a += '"IsMoving":', a += "[" + b[c + 14] + "],", a += '"hp":', a += "[" + b[c + 15] + "]", a += "},"
    }
    return eval(a + "]})")
  }
};
AICRAFT.Engine.getNextAvailablePnum = function(b) {
  for(var a = 0;a < b.length;a++) {
    if(!b[a].connected && !b[a].connecting) {
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
AICRAFT.Engine.initScene = function(b, a) {
  var c = new a.btBoxShape(new a.btVector3(200, 0.5, 200)), e = new a.btTransform;
  e.setIdentity();
  e.setOrigin(new a.btVector3(0, -5.5, 0));
  var d = 0, f = 0 != d, g = new a.btVector3(0, 0, 0);
  f && c.calculateLocalInertia(d, g);
  f = new a.btDefaultMotionState(e);
  d = new a.btRigidBodyConstructionInfo(d, f, c, g);
  d = new a.btRigidBody(d);
  d.setUserPointer(-1);
  b.dynamicsWorld.addRigidBody(d);
  c = new a.btBoxShape(new a.btVector3(200, 200, 0.5));
  e = new a.btTransform;
  e.setIdentity();
  e.setOrigin(new a.btVector3(0, -5.5, -200));
  d = 0;
  f = 0 != d;
  g = new a.btVector3(0, 0, 0);
  f && c.calculateLocalInertia(d, g);
  f = new a.btDefaultMotionState(e);
  d = new a.btRigidBodyConstructionInfo(d, f, c, g);
  d = new a.btRigidBody(d);
  d.setUserPointer(-1);
  b.dynamicsWorld.addRigidBody(d);
  c = new a.btBoxShape(new a.btVector3(0.5, 200, 200));
  e = new a.btTransform;
  e.setIdentity();
  e.setOrigin(new a.btVector3(200, -5.5, 0));
  d = 0;
  f = 0 != d;
  g = new a.btVector3(0, 0, 0);
  f && c.calculateLocalInertia(d, g);
  f = new a.btDefaultMotionState(e);
  d = new a.btRigidBodyConstructionInfo(d, f, c, g);
  d = new a.btRigidBody(d);
  d.setUserPointer(-1);
  b.dynamicsWorld.addRigidBody(d);
  c = new a.btBoxShape(new a.btVector3(200, 200, 0.5));
  e = new a.btTransform;
  e.setIdentity();
  e.setOrigin(new a.btVector3(0, -5.5, 200));
  d = 0;
  f = 0 != d;
  g = new a.btVector3(0, 0, 0);
  f && c.calculateLocalInertia(d, g);
  f = new a.btDefaultMotionState(e);
  d = new a.btRigidBodyConstructionInfo(d, f, c, g);
  d = new a.btRigidBody(d);
  d.setUserPointer(-1);
  b.dynamicsWorld.addRigidBody(d);
  c = new a.btBoxShape(new a.btVector3(0.5, 200, 200));
  e = new a.btTransform;
  e.setIdentity();
  e.setOrigin(new a.btVector3(-200, -5.5, 0));
  d = 0;
  f = 0 != d;
  g = new a.btVector3(0, 0, 0);
  f && c.calculateLocalInertia(d, g);
  f = new a.btDefaultMotionState(e);
  d = new a.btRigidBodyConstructionInfo(d, f, c, g);
  d = new a.btRigidBody(d);
  d.setUserPointer(-1);
  b.dynamicsWorld.addRigidBody(d)
};
AICRAFT.AIEngine = function() {
  this.templateStr = void 0;
  this.ais = []
};
AICRAFT.AIEngine.prototype = {constructor:AICRAFT.AIEngine, loadAI:function(b, a) {
  var c = b.replace(/ai_name_to_replace/g, "AI_" + a.toString());
  console.log(c);
  try {
    eval(c)
  }catch(e) {
    console.log(e.message)
  }
  this.ais.forEach(function(b) {
    if(b.body.name === a) {
      try {
        b.run()
      }catch(c) {
        console.log(c.message)
      }
    }
  })
}, initAI:function(b, a) {
  AICRAFT["AI_" + a.toString()] = function(a) {
    this.body = a
  };
  AICRAFT["AI_" + a.toString()].prototype = new (AICRAFT["AI_" + a.toString()]);
  AICRAFT["AI_" + a.toString()].prototype.constructor = AICRAFT["AI_" + a.toString()];
  AICRAFT["AI_" + a.toString()].prototype.run = function() {
  };
  AICRAFT["AI_" + a.toString()].prototype.onSightFound = function() {
  };
  var c = new (AICRAFT["AI_" + a.toString()])(b);
  c.body.onSightFound = function(a) {
    c.onSightFound(a)
  };
  this.ais.push(c)
}};
AICRAFT.ClientEngine = function() {
  this.keyFPS = 30;
  this.codeEmitter = this.cameraControls = this.camera = this.renderer = this.scene = this.stats = void 0;
  this.clock = new THREE.Clock;
  this.socket = this.totalPlayers = this.ground = void 0;
  this.observer = !1;
  this.myPnum = void 0;
  this.players = [];
  this.ais = [];
  this.lastKeycode = 0;
  this.colors = [7686143, 16716820, 6736896, 11960, 4029112, 10079283]
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
  this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1E4);
  this.scene.add(this.camera);
  THREEx.WindowResize.bind(this.renderer, this.camera);
  var c = new THREE.SpotLight;
  c.position.set(170, 330, -160);
  c.castShadow = !0;
  this.scene.add(c);
  var c = new THREE.PlaneGeometry(400, 400, 10, 10), e = new THREE.MeshLambertMaterial({color:this.colors[5]});
  this.ground = new THREE.Mesh(c, e);
  this.ground.rotation.x = -Math.PI / 2;
  this.ground.position.y = -5;
  this.ground.receiveShadow = !0;
  this.scene.add(this.ground);
  var d = new THREE.Quaternion;
  (function() {
    for(var c = 0;c < a.totalPlayers;c++) {
      d.setFromEuler(new THREE.Vector3(-30, -20, 0)), a.players[c] = new AICRAFT.Player(b.players.bindings[c].position[0], b.players.bindings[c].position[1], b.players.bindings[c].position[2], b.players.bindings[c].quaternion[0], b.players.bindings[c].quaternion[1], b.players.bindings[c].quaternion[2], b.players.bindings[c].quaternion[3]), a.players[c].IsClient = !0, a.players[c].buildMesh(THREE, a.scene, a.colors[c], c === a.myPnum), d.setFromEuler(new THREE.Vector3(30, -20, 0)), a.ais[c] = new AICRAFT.Ai(b.ais.bindings[c].position[0], 
      b.ais.bindings[c].position[1], b.ais.bindings[c].position[2], b.ais.bindings[c].quaternion[0], b.ais.bindings[c].quaternion[1], b.ais.bindings[c].quaternion[2], b.ais.bindings[c].quaternion[3]), a.ais[c].IsClient = !0, a.ais[c].buildMesh(THREE, a.scene, a.colors[c])
    }
  })();
  this.cameraControls = new AICRAFT.CameraControl(this.camera, this.players[this.myPnum], this.renderer.domElemen);
  this.codeEmitter = new AICRAFT.CodeEmitter(this.cameraControls, this.players[this.myPnum], this.ais[this.myPnum], b);
  document.addEventListener("keydown", function(b) {
    a.players[a.myPnum].handleKeyDown(b, a.players[a.myPnum])
  }, !1);
  document.addEventListener("keyup", function(b) {
    a.players[a.myPnum].handleKeyUp(b, a.players[a.myPnum])
  }, !1);
  AICRAFT.ClientEngine.coordHelper(this.scene)
}, aiNameExist:function(b) {
  this.ais.forEach(function(a) {
    if(a.name === b) {
      return!0
    }
  });
  return!1
}, networkReady:function(b, a, c, e) {
  var d = this;
  d.socket = io.connect("/");
  d.socket.on("totalPlayers", function(a) {
    d.totalPlayers = a
  });
  d.socket.on("connect", function(a) {
    d.myPnum = a
  });
  d.socket.on("pi", function(f) {
    d.socket.players = AICRAFT.Engine.extractPacket(f);
    d.socket.on("ai", function(f) {
      d.socket.ais = AICRAFT.Engine.extractPacket(f);
      -1 != d.myPnum ? (b(d.socket), d.players[d.myPnum].connected = !0, d.ais[d.myPnum].name = "aicraft" + d.myPnum.toString(), d.socket.emit("connected", [d.myPnum, d.ais[d.myPnum].name]), a(), c(), e()) : (alert("This game is already full, entering observer mode."), d.observer = !0, d.myPnum = 0, b(d.socket), a(), c())
    })
  })
}, syncPos:function() {
  var b = this;
  b.socket.on("p", function(a) {
    for(var a = AICRAFT.Engine.extractPacket(a).bindings, c = 0;c < b.totalPlayers;c++) {
      b.players[c].setPos(Ammo, a[c].position[0], a[c].position[1], a[c].position[2], a[c].quaternion[0], a[c].quaternion[1], a[c].quaternion[2], a[c].quaternion[3], a[c].velocity[0], a[c].velocity[1], a[c].velocity[2], a[c].IsMoving[0], a[c].hp[0])
    }
  });
  b.socket.on("a", function(a) {
    for(var a = AICRAFT.Engine.extractPacket(a).bindings, c = 0;c < b.totalPlayers;c++) {
      b.ais[c].setPos(Ammo, a[c].position[0], a[c].position[1], a[c].position[2], a[c].quaternion[0], a[c].quaternion[1], a[c].quaternion[2], a[c].quaternion[3], a[c].sightQuaternion[0], a[c].sightQuaternion[1], a[c].sightQuaternion[2], a[c].sightQuaternion[3], a[c].velocity[0], a[c].velocity[1], a[c].velocity[2], a[c].IsMoving[0], a[c].hp[0])
    }
  })
}, syncKey:function() {
  AICRAFT.requestKeyFrame(this.syncKey.bind(this), this.keyFPS);
  void 0 === this.players[this.myPnum] || void 0 === this.myPnum || (0 != this.players[this.myPnum].keycode ? (this.socket.emit("k", this.players[this.myPnum].keycode), this.players[this.myPnum].updateInput(this.codeEmitter)) : 0 == this.players[this.myPnum].keycode && 0 != this.lastKeycode && this.socket.emit("k", 0), this.lastKeycode = this.players[this.myPnum].keycode)
}, animate:function() {
  this.delta = this.clock.getDelta();
  if(1 > this.players[this.myPnum].hp || 1 > this.ais[this.myPnum].hp) {
    alert("your tream have lost!")
  }else {
    requestAnimationFrame(this.animate.bind(this));
    for(var b = 0;b < this.totalPlayers;b++) {
      this.players[b].physicAndGraphicUpdate(this.delta), this.ais[b].physicAndGraphicUpdate(this.delta)
    }
    this.cameraControls.update();
    this.render();
    this.stats.update()
  }
}, render:function() {
  this.renderer.render(this.scene, this.camera)
}};
AICRAFT.ClientEngine.coordHelper = function(b) {
  var a = new THREE.Geometry;
  a.vertices.push(AICRAFT.v(-200, 0, 0), AICRAFT.v(200, 0, 0), AICRAFT.v(0, -200, 0), AICRAFT.v(0, 200, 0), AICRAFT.v(0, 0, -200), AICRAFT.v(0, 0, 200), AICRAFT.v(200, 1, 0), AICRAFT.v(200, -1, 0), AICRAFT.v(150, 1, 0), AICRAFT.v(150, -1, 0), AICRAFT.v(100, 1, 0), AICRAFT.v(100, -1, 0), AICRAFT.v(50, 1, 0), AICRAFT.v(50, -1, 0), AICRAFT.v(-50, 1, 0), AICRAFT.v(-50, -1, 0), AICRAFT.v(-100, 1, 0), AICRAFT.v(-100, -1, 0), AICRAFT.v(-150, 1, 0), AICRAFT.v(-150, -1, 0), AICRAFT.v(-200, 1, 0), AICRAFT.v(-200, 
  -1, 0), AICRAFT.v(1, 200, 0), AICRAFT.v(-1, 200, 0), AICRAFT.v(1, 150, 0), AICRAFT.v(-1, 150, 0), AICRAFT.v(1, 100, 0), AICRAFT.v(-1, 100, 0), AICRAFT.v(1, 50, 0), AICRAFT.v(-1, 50, 0), AICRAFT.v(1, -50, 0), AICRAFT.v(-1, -50, 0), AICRAFT.v(1, -100, 0), AICRAFT.v(-1, -100, 0), AICRAFT.v(1, -150, 0), AICRAFT.v(-1, -150, 0), AICRAFT.v(1, -200, 0), AICRAFT.v(-1, -200, 0), AICRAFT.v(0, 1, 200), AICRAFT.v(0, -1, 200), AICRAFT.v(0, 1, 150), AICRAFT.v(0, -1, 150), AICRAFT.v(0, 1, 100), AICRAFT.v(0, -1, 
  100), AICRAFT.v(0, 1, 50), AICRAFT.v(0, -1, 50), AICRAFT.v(0, 1, -50), AICRAFT.v(0, -1, -50), AICRAFT.v(0, 1, -100), AICRAFT.v(0, -1, -100), AICRAFT.v(0, 1, -150), AICRAFT.v(0, -1, -150), AICRAFT.v(0, 1, -200), AICRAFT.v(0, -1, -200));
  var c = new THREE.LineBasicMaterial({color:0, lineWidth:1}), a = new THREE.Line(a, c);
  a.type = THREE.Lines;
  b.add(a)
};
AICRAFT.ClientEngine.key = function(b, a) {
  return"w" == a ? b & 8 ? !0 : !1 : "a" == a ? b & 4 ? !0 : !1 : "s" == a ? b & 2 ? !0 : !1 : "d" == a ? b & 1 ? !0 : !1 : "code" == a ? b & 64 ? !0 : !1 : "e" == a ? b & 16 ? !0 : !1 : "q" == a ? b & 32 ? !0 : !1 : !1
};

