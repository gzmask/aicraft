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
  this.phybody = void 0;
  this.depth = this.height = this.width = 8;
  this.radius = 5;
  this.mass = 1;
  this.friction = 3;
  this.angularFactor = 0.01;
  this.restitution = 1;
  this.hp = 100;
  this.IsClient = !1;
  this.dynamicsWorld = void 0;
  this.IsMoving = !1;
  this.objects = void 0
};
AICRAFT.GameObject.prototype = {constructor:AICRAFT.GameObject, buildPhysic:function(b, a) {
  void 0 !== b && (Ammo = b);
  var c = new Ammo.btSphereShape(this.radius), e = new Ammo.btTransform;
  e.setIdentity();
  e.setOrigin(new Ammo.btVector3(this.position.x, this.position.y, this.position.z));
  e.setRotation(new Ammo.btQuaternion(this.quaternion.x, this.quaternion.y, this.quaternion.z, this.quaternion.w));
  var d = 0 != this.mass, f = new Ammo.btVector3(0, 0, 0);
  d && c.calculateLocalInertia(this.mass, f);
  e = new Ammo.btDefaultMotionState(e);
  c = new Ammo.btRigidBodyConstructionInfo(this.mass, e, c, f);
  this.phybody = new Ammo.btRigidBody(c);
  this.phybody.setFriction(this.friction);
  this.phybody.setAngularFactor(new Ammo.btVector3(0, this.angularFactor, 0));
  this.phybody.setRestitution(this.restitution);
  this.dynamicsWorld = a;
  this.dynamicsWorld.addRigidBody(this.phybody)
}, setPos:function(b, a, c, e, d, f, g, h, k, i, j) {
  a = parseFloat(a);
  c = parseFloat(c);
  e = parseFloat(e);
  d = parseFloat(d);
  f = parseFloat(f);
  g = parseFloat(g);
  h = parseFloat(h);
  k = parseFloat(k);
  i = parseFloat(i);
  j = parseFloat(j);
  void 0 !== b && (Ammo = b);
  b = new Ammo.btTransform;
  b.setIdentity();
  b.setOrigin(new Ammo.btVector3(a, c, e));
  b.setRotation(new Ammo.btQuaternion(d, f, g, h));
  this.position.x = a;
  this.position.y = c;
  this.position.z = e;
  this.quaternion.x = d;
  this.quaternion.y = f;
  this.quaternion.z = g;
  this.quaternion.w = h;
  this.phybody.activate();
  this.phybody.getMotionState().setWorldTransform(b);
  this.phybody.setCenterOfMassTransform(b);
  this.phybody.setAngularVelocity(new Ammo.btVector3(k, i, j))
}, physicUpdate:function() {
  this.phybody.getMotionState() && (this.phybody.getMotionState().getWorldTransform(this.dynamicsWorld.trans), this.position.x = parseFloat(this.dynamicsWorld.trans.getOrigin().x().toFixed(2)), this.position.y = parseFloat(this.dynamicsWorld.trans.getOrigin().y().toFixed(2)), this.position.z = parseFloat(this.dynamicsWorld.trans.getOrigin().z().toFixed(2)), this.quaternion.x = parseFloat(this.dynamicsWorld.trans.getRotation().x()), this.quaternion.y = parseFloat(this.dynamicsWorld.trans.getRotation().y()), 
  this.quaternion.z = parseFloat(this.dynamicsWorld.trans.getRotation().z()), this.quaternion.w = parseFloat(this.dynamicsWorld.trans.getRotation().w()))
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
  this.maxSpeed = 10;
  this.acceleration = 28;
  this.weaponLock = this.raycastLock = this.lookAtLock = this.rotateLock = this.codeUploading = !1;
  this.weaponRange = 100;
  this.weaponForce = 20;
  this.weaponDelay = 1E3;
  this.weaponDamage = 10;
  this.onSightFound = this.owner = this.name = void 0
};
AICRAFT.Ai.prototype = new AICRAFT.GameObject;
AICRAFT.Ai.prototype.constructor = AICRAFT.Ai;
AICRAFT.Ai.prototype.buildPhysic = function(b, a) {
  AICRAFT.GameObject.prototype.buildPhysic.call(this, b, a);
  this.sight.quaternion.x = this.quaternion.x;
  this.sight.quaternion.y = this.quaternion.y;
  this.sight.quaternion.z = this.quaternion.z;
  this.sight.quaternion.w = this.quaternion.w;
  this.sight.lines = AICRAFT.Ai.getSight(0, 0, 0, 0, 0, -1, this.sight.range, 60, 10, this.Ammo, !0)
};
AICRAFT.Ai.prototype.physicUpdate = function() {
  if(!(1 > this.hp)) {
    AICRAFT.GameObject.prototype.physicUpdate.call(this, this.dynamicsWorld);
    var b = new this.Ammo.btQuaternion(this.sight.quaternion.x, this.sight.quaternion.y, this.sight.quaternion.z, this.sight.quaternion.w), a = new this.Ammo.btTransform;
    a.setIdentity();
    a.setRotation(b);
    var c = new this.Ammo.btVector3(0, 0, -1), c = a.op_mul(c);
    this.sight.lines = AICRAFT.Ai.getSight(this.position.x, this.position.y, this.position.z, c.getX() + this.position.x, c.getY() + this.position.y, c.getZ() + this.position.z, 80, 60, 10, this.Ammo, !0);
    this.raycast(1E3);
    this.Ammo.destroy(a);
    this.Ammo.destroy(b)
  }
};
AICRAFT.Ai.prototype.raycast = function(b) {
  if(!0 !== this.raycastLock) {
    for(var a = this, c = 0;c < a.sight.lines.length;c += 2) {
      var e = a.sight.lines[c], d = a.sight.lines[c + 1], f = new a.Ammo.ClosestRayResultCallback(e, d);
      this.dynamicsWorld.rayTest(e, d, f);
      f.hasHit() && (a.raycastLock = !0, a.found(f.get_m_hitPointWorld().getX(), f.get_m_hitPointWorld().getY(), f.get_m_hitPointWorld().getZ(), f.get_m_collisionObject().getUserPointer()), setTimeout(function() {
        a.raycastLock = !1
      }, b))
    }
  }
};
AICRAFT.Ai.prototype.fireAt = function(b, a, c, e) {
  if(!0 !== this.weaponLock) {
    var d = this, f = new d.Ammo.btVector3(d.position.x, d.position.y, d.position.z), b = new d.Ammo.btVector3(b - d.position.x, a - d.position.y, c - d.position.z);
    b.normalize();
    b.op_mul(d.weaponRange);
    b.op_add(f);
    console.log("fire from" + f.getX() + "," + f.getZ() + " to " + b.getX() + "," + b.getZ());
    a = new d.Ammo.ClosestRayResultCallback(f, b);
    d.dynamicsWorld.rayTest(f, b, a);
    a.hasHit() && (d.weaponLock = !0, a = a.get_m_collisionObject().getUserPointer(), d.objects[a].phybody.activate(), d.objects[a].phybody.applyCentralImpulse(d.feedbackVector(f, b).op_mul(1.5)), d.objects[a].hp -= d.weaponDamage, 1 > d.objects[a].hp ? d.objects[a].phybody.setUserPointer(-1) : setTimeout(function() {
      d.weaponLock = !1;
      void 0 !== e && e()
    }, d.weaponDelay))
  }
};
AICRAFT.Ai.charge = function(b, a, c, e, d) {
  b.phybody.activate();
  b.phybody.applyCentralImpulse(b.feedbackVector(a, c).op_mul(1.1));
  setTimeout(function() {
    e()
  }, d)
};
AICRAFT.Ai.prototype.feedbackVector = function(b, a) {
  var c = a.op_sub(b);
  c.normalize();
  c.op_mul(this.weaponForce);
  c.setY(c.getY() + 0.2 * this.weaponForce);
  return c
};
AICRAFT.Ai.prototype.found = function(b, a, c, e) {
  if(!(-1 === e || e === this.owner.phybody.getUserPointer())) {
    event = {};
    event.position = [b, a, c];
    event.tag = e;
    try {
      this.onSightFound(event)
    }catch(d) {
    }
  }
};
AICRAFT.Ai.prototype.ahead = function(b, a) {
  b = Math.abs(b);
  AICRAFT.Ai.move(this, b, a, !0, 400)
};
AICRAFT.Ai.prototype.back = function(b, a) {
  b = Math.abs(b);
  AICRAFT.Ai.move(this, b, a, !1, 600)
};
AICRAFT.Ai.prototype.lookLeft = function(b, a) {
  AICRAFT.Ai.lookRotate(this, b, a, !0)
};
AICRAFT.Ai.prototype.lookRight = function(b, a) {
  AICRAFT.Ai.lookRotate(this, b, a, !1)
};
AICRAFT.Ai.prototype.lookAt = function(b, a) {
  var c = this;
  if(!0 !== c.lookAtLock) {
    360 < b && (b %= 360);
    var e = c.phybody.getOrientation(), d = AICRAFT.quatFromEuler(b, 0, 0, c.Ammo), e = AICRAFT.quatMul(d, e);
    c.sight.quaternion.x = e.getX();
    c.sight.quaternion.y = e.getY();
    c.sight.quaternion.z = e.getZ();
    c.sight.quaternion.w = e.getW();
    c.lookAtLock = !0;
    setTimeout(function() {
      c.lookAtLock = !1;
      void 0 !== a && a()
    }, 3E3)
  }
};
AICRAFT.Ai.prototype.turnRight = function(b, a) {
  AICRAFT.Ai.rotate(this, b, a, !1, !0, !0, 40)
};
AICRAFT.Ai.prototype.turnLeft = function(b, a) {
  AICRAFT.Ai.rotate(this, b, a, !0, !0, !0, 40)
};
AICRAFT.Ai.lookRotate = function(b, a, c, e) {
  AICRAFT.Ai.rotate(b, a, c, e, !1, !0, 30)
};
AICRAFT.Ai.rotate = function(b, a, c, e, d, f, g) {
  if(1 > a || 1 > b.hp || b.codeUploading || !0 === b.rotateLock) {
    return void 0 !== c && !0 !== b.codeUploading && c(), console.log("quiting rotate"), !1
  }
  b.rotateLock = !0;
  360 < a && (a %= 360);
  var h = b.phybody.getOrientation(), k = new b.Ammo.btQuaternion(b.sight.quaternion.x, b.sight.quaternion.y, b.sight.quaternion.z, b.sight.quaternion.w), i = new b.Ammo.btQuaternion, i = !0 === e ? AICRAFT.quatFromEuler(1, 0, 0) : AICRAFT.quatFromEuler(-1, 0, 0);
  if(!0 === d) {
    h = AICRAFT.quatMul(h, i);
    b.quaternion.x = h.getX();
    b.quaternion.y = h.getY();
    b.quaternion.z = h.getZ();
    b.quaternion.w = h.getW();
    var j = new b.Ammo.btTransform;
    j.setIdentity();
    j.setOrigin(new b.Ammo.btVector3(b.position.x, b.position.y, b.position.z));
    j.setRotation(h);
    b.phybody.activate();
    b.phybody.getMotionState().setWorldTransform(j);
    b.phybody.setCenterOfMassTransform(j)
  }
  !0 === f && (h = AICRAFT.quatMul(k, i), b.sight.quaternion.x = h.getX(), b.sight.quaternion.y = h.getY(), b.sight.quaternion.z = h.getZ(), b.sight.quaternion.w = h.getW());
  setTimeout(function() {
    b.rotateLock = !1;
    AICRAFT.Ai.rotate(b, a - 1, c, e, d, f, g)
  }, g)
};
AICRAFT.Ai.move = function(b, a, c, e, d) {
  if(1 > a || 1 > b.hp || b.codeUploading || !0 === b.IsMoving) {
    return void 0 !== c && !0 !== b.codeUploading && c(), console.log("quiting move"), !1
  }
  b.IsMoving = !0;
  var f = b.phybody.getLinearVelocity(), f = Math.sqrt(f.getX() * f.getX() + f.getY() * f.getY() + f.getZ() * f.getZ());
  b.phybody.activate();
  var g = b.phybody.getOrientation(), h = new b.Ammo.btTransform;
  h.setIdentity();
  h.setRotation(g);
  g = new b.Ammo.btVector3(0, 0, -1);
  g = h.op_mul(g);
  for(h = 0;h < b.acceleration;h++) {
    g.setX(1.1 * g.getX()), g.setY(1.1 * g.getY()), g.setZ(1.1 * g.getZ())
  }
  e || (g.setX(-1 * g.getX()), g.setY(-1 * g.getY()), g.setZ(-1 * g.getZ()));
  f < b.maxSpeed && b.phybody.applyCentralImpulse(g);
  setTimeout(function() {
    b.IsMoving = !1;
    AICRAFT.Ai.move(b, a - 1, c, e, d)
  }, d)
};
AICRAFT.Ai.getSight = function(b, a, c, e, d, f, g, h, k, i, j) {
  var l = [], e = new i.btVector3(e - b, d - a, f - c), d = AICRAFT.quatFromEuler(h / 2, 0, 0, i), f = new i.btTransform;
  f.setRotation(d);
  e = f.op_mul(e);
  e.normalize();
  e.op_mul(g);
  do {
    l.push(AICRAFT.v(b, a, c, j), AICRAFT.v(e.getX() + b, e.getY() + a, e.getZ() + c, j)), d = AICRAFT.quatFromEuler(-1 * k, 0, 0, i), f.setRotation(d), e = f.op_mul(e), e.normalize(), e.op_mul(g), h -= k
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
  this.connecting = this.connected = !1;
  this.keycode = 0;
  this.codeUploading = !1
};
AICRAFT.Player.prototype = new AICRAFT.GameObject;
AICRAFT.Player.prototype.constructor = AICRAFT.Player;
AICRAFT.Player.prototype.updateInput = function(b) {
  !0 !== this.codeUploading && (void 0 !== b && (Ammo = b), this.IsMoving = !1, b = this.phybody.getLinearVelocity(), b = Math.sqrt(b.getX() * b.getX() + b.getY() * b.getY() + b.getZ() * b.getZ()), AICRAFT.ClientEngine.key(this.keycode, "w") && b < this.maxSpeed && 1 > this.position.y && (this.IsMoving = !0, AICRAFT.Player.ahead(this, !0)), AICRAFT.ClientEngine.key(this.keycode, "a") && b < this.maxSpeed && 1 > this.position.y && (this.IsMoving = !0, AICRAFT.Player.side(this, !0)), AICRAFT.ClientEngine.key(this.keycode, 
  "s") && b < this.maxSpeed && 1 > this.position.y && (this.IsMoving = !0, AICRAFT.Player.ahead(this, !1)), AICRAFT.ClientEngine.key(this.keycode, "d") && b < this.maxSpeed && 1 > this.position.y && (this.IsMoving = !0, AICRAFT.Player.side(this, !1)), AICRAFT.ClientEngine.key(this.keycode, "e") && 0.1 > this.position.y && this.rotate(2), AICRAFT.ClientEngine.key(this.keycode, "q") && 0.1 > this.position.y && this.rotate(2, !0))
};
AICRAFT.Player.prototype.rotate = function(b, a) {
  if(!0 !== this.codeUploading) {
    void 0 === a && (a = !1);
    var c = this.phybody.getOrientation(), e = new this.Ammo.btQuaternion, e = !0 === a ? AICRAFT.quatFromEuler(b, 0, 0) : AICRAFT.quatFromEuler(-1 * b, 0, 0), c = AICRAFT.quatMul(c, e);
    this.quaternion.x = c.getX();
    this.quaternion.y = c.getY();
    this.quaternion.z = c.getZ();
    this.quaternion.w = c.getW();
    e = new this.Ammo.btTransform;
    e.setIdentity();
    e.setOrigin(new this.Ammo.btVector3(this.position.x, this.position.y, this.position.z));
    e.setRotation(c);
    this.phybody.activate();
    this.phybody.getMotionState().setWorldTransform(e);
    this.phybody.setCenterOfMassTransform(e)
  }
};
AICRAFT.Player.side = function(b, a) {
  var c;
  c = !0 === a ? new b.Ammo.btVector3(-1, 0, 0) : new b.Ammo.btVector3(1, 0, 0);
  AICRAFT.Player.move(b, c)
};
AICRAFT.Player.ahead = function(b, a) {
  var c;
  c = !0 === a ? new b.Ammo.btVector3(0, 0, -1) : new b.Ammo.btVector3(0, 0, 1);
  AICRAFT.Player.move(b, c)
};
AICRAFT.Player.move = function(b, a) {
  if(!0 !== this.codeUploading) {
    b.phybody.activate();
    var c = b.phybody.getOrientation(), e = new b.Ammo.btTransform;
    e.setIdentity();
    e.setRotation(c);
    a = e.op_mul(a);
    for(c = 0;c < b.acceleration;c++) {
      a.setX(1.1 * a.getX()), a.setY(1.1 * a.getY()), a.setZ(1.1 * a.getZ())
    }
    b.phybody.applyCentralImpulse(a)
  }
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
  this.editor.style.width = "80%";
  this.editor.style.height = "80%";
  this.editor.style.zIndex = "-3";
  this.editor.style.position = "absolute";
  this.editor.style.visibility = "hidden";
  d.appendChild(this.editor);
  this.editorAce = ace.edit("editor");
  this.editorAce.setReadOnly(!1);
  this.editorAceDom = document.getElementById("editor");
  e.on("emitterInit", function(a) {
    a = a.replace(/ai_name_to_replace/g, "AI_" + f.ai.name.toString());
    f.editorAce.focus();
    f.editorAce.getSession().setValue(a)
  });
  this.img = document.createElement("img");
  document.body.appendChild(this.img);
  this.img.setAttribute("src", "asset/ce.png");
  this.img.style.zIndex = "10004";
  this.img.style.position = "absolute";
  this.img.style.right = "5px";
  this.img.style.bottom = "5px";
  this.img.onclick = this.request.bind(this)
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
  this.colors = [5500950, 15788054, 9119467, 7686143];
  this.starColors = [13754487, 14724471, 12443767, 7841248, 8001755];
  this.attributes = this.uniforms = void 0
};
AICRAFT.ClientEngine.prototype = {constructor:AICRAFT.ClientEngine, init:function(b) {
  var a = this;
  if(Detector.webgl) {
    this.renderer = new THREE.WebGLRenderer({antialias:!0, preserveDrawingBuffer:!0}), this.renderer.setClearColorHex(1708291, 1)
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
  this.scene.fog = new THREE.FogExp2(this.colors[3], 0.003);
  this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1E4);
  this.scene.add(this.camera);
  THREEx.WindowResize.bind(this.renderer, this.camera);
  var c = new THREE.SpotLight;
  c.position.set(170, 330, -160);
  c.castShadow = !0;
  this.scene.add(c);
  AICRAFT.ClientEngine.generateBarriers(this, this.scene);
  AICRAFT.ClientEngine.generateStars(this.scene, 3E3, this.starColors[0]);
  AICRAFT.ClientEngine.generateStars(this.scene, 2500, this.starColors[1]);
  AICRAFT.ClientEngine.generateStars(this.scene, 2E3, this.starColors[2]);
  AICRAFT.ClientEngine.generateStars(this.scene, 1500, this.starColors[3]);
  AICRAFT.ClientEngine.generateStars(this.scene, 1E3, this.starColors[4]);
  AICRAFT.ClientEngine.generateStars(this.scene, 500, this.starColors[5]);
  var e = new THREE.Quaternion;
  (function() {
    for(var c = 0;c < a.totalPlayers;c++) {
      e.setFromEuler(new THREE.Vector3(-30, -20, 0)), a.players[c] = new AICRAFT.Player(b.players.bindings[c].position[0], b.players.bindings[c].position[1], b.players.bindings[c].position[2], b.players.bindings[c].quaternion[0], b.players.bindings[c].quaternion[1], b.players.bindings[c].quaternion[2], b.players.bindings[c].quaternion[3]), a.players[c].IsClient = !0, a.players[c].buildMesh(THREE, a.scene, a.colors[c], c === a.myPnum), e.setFromEuler(new THREE.Vector3(30, -20, 0)), a.ais[c] = new AICRAFT.Ai(b.ais.bindings[c].position[0], 
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
  }, !1)
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
    alert("your team have lost!")
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
  var b = 0.001 * Date.now();
  this.renderer.render(this.scene, this.camera);
  this.uniforms.amplitude.value = 0.5 * Math.sin(0.5 * b);
  THREE.ColorUtils.adjustHSV(this.uniforms.color.value, 5.0E-4, 0, 0);
  for(var a, c, e, d = 0, f = this.attributes.displacement.value.length;d < f;d++) {
    b = 0.3 * (0.5 - Math.random()), a = 0.3 * (0.5 - Math.random()), c = 0.3 * (0.5 - Math.random()), e = this.attributes.displacement.value[d], e.x += b, e.y += a, e.z += c
  }
  this.attributes.displacement.needsUpdate = !0
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
AICRAFT.ClientEngine.generateGround = function(b, a) {
  var c = new THREE.PlaneGeometry(400, 400, 10, 10), e = new THREE.MeshLambertMaterial({color:b.colors[2], opacity:0.3});
  b.ground = new THREE.Mesh(c, e);
  b.ground.rotation.x = -Math.PI / 2;
  b.ground.position.y = -5;
  b.ground.receiveShadow = !0;
  a.add(b.ground)
};
AICRAFT.ClientEngine.generateBarriers = function(b, a) {
  var c, e;
  e = {displacement:{type:"v3", value:[]}, customColor:{type:"c", value:[]}};
  c = {amplitude:{type:"f", value:5}, opacity:{type:"f", value:0.3}, color:{type:"c", value:new THREE.Color(16711680)}};
  b.attributes = e;
  b.uniforms = c;
  c = new THREE.ShaderMaterial({uniforms:c, attributes:e, vertexShader:document.getElementById("vertexshader").textContent, fragmentShader:document.getElementById("fragmentshader").textContent, blending:THREE.AdditiveBlending, depthTest:!1, transparent:!0});
  c.linewidth = 1;
  for(var d = new THREE.Geometry, f = d.vertices, g = 10;-5 <= g;g--) {
    for(var h = -200;200 >= h;h += 10) {
      f.push(new THREE.Vertex(new THREE.Vector3(200, g, h)))
    }
    for(h = 200;-200 <= h;h -= 10) {
      f.push(new THREE.Vertex(new THREE.Vector3(h, g, 200)))
    }
    for(h = 200;-200 <= h;h -= 10) {
      f.push(new THREE.Vertex(new THREE.Vector3(-200, g, h)))
    }
    for(h = -200;200 >= h;h += 10) {
      f.push(new THREE.Vertex(new THREE.Vector3(h, g, -200)))
    }
  }
  for(g = 200;-200 <= g;g -= 10) {
    for(h = -200;200 >= h;h += 10) {
      f.push(new THREE.Vertex(new THREE.Vector3(g, -5, h)))
    }
    for(h = 200;-200 <= h;h -= 10) {
      f.push(new THREE.Vertex(new THREE.Vector3(g - 5, -5, h)))
    }
  }
  d.dynamic = !0;
  c = new THREE.Line(d, c, THREE.LineStrip);
  d = c.geometry.vertices;
  f = e.displacement.value;
  e = e.customColor.value;
  for(g = 0;g < d.length;g++) {
    f[g] = new THREE.Vector3(0, 0, 0), e[g] = new THREE.Color(16777215), e[g].setHSV(g / d.length, 0.9, 0.9)
  }
  a.add(c)
};
AICRAFT.ClientEngine.generateStars = function(b, a, c) {
  for(var e, d, f, g = new THREE.Geometry, h = 0;h < a;h++) {
    e = THREE.Math.randFloatSpread(1E3), d = THREE.Math.randFloatSpread(1E3), f = THREE.Math.randFloatSpread(1E3), e = new THREE.Vector3(e, d, f), g.vertices.push(new THREE.Vertex(e))
  }
  a = new THREE.ParticleSystem(g, new THREE.ParticleBasicMaterial({color:c}));
  b.add(a)
};
AICRAFT.ClientEngine.key = function(b, a) {
  return"w" == a ? b & 8 ? !0 : !1 : "a" == a ? b & 4 ? !0 : !1 : "s" == a ? b & 2 ? !0 : !1 : "d" == a ? b & 1 ? !0 : !1 : "code" == a ? b & 64 ? !0 : !1 : "e" == a ? b & 16 ? !0 : !1 : "q" == a ? b & 32 ? !0 : !1 : !1
};

