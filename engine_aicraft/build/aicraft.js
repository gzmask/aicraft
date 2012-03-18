var AICRAFT=AICRAFT||{};"undefined"!==typeof exports&&null!==exports&&(exports.AICRAFT=AICRAFT);AICRAFT.GameObject=function(b,a,c,d,e,f,h){this.position={};this.position.x=parseFloat(b);this.position.y=parseFloat(a);this.position.z=parseFloat(c);this.quaternion={};this.quaternion.x=d||0;this.quaternion.y=e||0;this.quaternion.z=f||0;this.quaternion.w=void 0===h?1:h;this.quaternion.x=parseFloat(this.quaternion.x);this.quaternion.y=parseFloat(this.quaternion.y);this.quaternion.z=parseFloat(this.quaternion.z);this.quaternion.w=parseFloat(this.quaternion.w);this.phybody=this.mesh=void 0;this.depth=
this.height=this.width=8;this.radius=5;this.mass=1;this.friction=3;this.angularFactor=0;this.IsClient=!1;this.dynamicsWorld=void 0};
AICRAFT.GameObject.prototype={constructor:AICRAFT.GameObject,buildMesh:function(b,a,c){this.mesh=new b.Mesh(new b.SphereGeometry(this.radius),new b.MeshLambertMaterial({color:c}));this.mesh.castShadow=!0;this.mesh.receiveShadow=!0;this.mesh.position.x=this.position.x;this.mesh.position.y=this.position.y;this.mesh.position.z=this.position.z;this.mesh.useQuaternion=!0;this.mesh.quaternion.set(this.quaternion.x,this.quaternion.y,this.quaternion.z,this.quaternion.w);a.add(this.mesh)},buildPhysic:function(b,
a){void 0!==b&&(Ammo=b);var c=new Ammo.btSphereShape(this.radius),d=new Ammo.btTransform;d.setIdentity();d.setOrigin(new Ammo.btVector3(this.position.x,this.position.y,this.position.z));d.setRotation(new Ammo.btQuaternion(this.quaternion.x,this.quaternion.y,this.quaternion.z,this.quaternion.w));var e=0!=this.mass,f=new Ammo.btVector3(0,0,0);e&&c.calculateLocalInertia(this.mass,f);d=new Ammo.btDefaultMotionState(d);c=new Ammo.btRigidBodyConstructionInfo(this.mass,d,c,f);this.phybody=new Ammo.btRigidBody(c);
this.phybody.setFriction(this.friction);this.phybody.setAngularFactor(this.angularFactor);this.dynamicsWorld=a;this.dynamicsWorld.addRigidBody(this.phybody)},setPos:function(b,a,c,d,e,f,h,g,k,i,j){a=parseFloat(a);c=parseFloat(c);d=parseFloat(d);e=parseFloat(e);f=parseFloat(f);h=parseFloat(h);g=parseFloat(g);k=parseFloat(k);i=parseFloat(i);j=parseFloat(j);void 0!==b&&(Ammo=b);b=new Ammo.btTransform;b.setIdentity();b.setOrigin(new Ammo.btVector3(a,c,d));b.setRotation(new Ammo.btQuaternion(e,f,h,g));
this.position.x=a;this.position.y=c;this.position.z=d;this.quaternion.x=e;this.quaternion.y=f;this.quaternion.z=h;this.quaternion.w=g;this.phybody.activate();this.phybody.getMotionState().setWorldTransform(b);this.phybody.setCenterOfMassTransform(b);this.phybody.setAngularVelocity(new Ammo.btVector3(k,i,j))},physicAndGraphicUpdate:function(){this.physicUpdate.call(this);this.mesh.position.x=this.position.x;this.mesh.position.y=this.position.y;this.mesh.position.z=this.position.z;this.mesh.quaternion.x=
this.quaternion.x;this.mesh.quaternion.y=this.quaternion.y;this.mesh.quaternion.z=this.quaternion.z;this.mesh.quaternion.w=this.quaternion.w},physicUpdate:function(){this.phybody.getMotionState()&&(this.phybody.getMotionState().getWorldTransform(this.dynamicsWorld.trans),this.position.x=parseFloat(this.dynamicsWorld.trans.getOrigin().x().toFixed(2)),this.position.y=parseFloat(this.dynamicsWorld.trans.getOrigin().y().toFixed(2)),this.position.z=parseFloat(this.dynamicsWorld.trans.getOrigin().z().toFixed(2)),
this.quaternion.x=parseFloat(this.dynamicsWorld.trans.getRotation().x()),this.quaternion.y=parseFloat(this.dynamicsWorld.trans.getRotation().y()),this.quaternion.z=parseFloat(this.dynamicsWorld.trans.getRotation().z()),this.quaternion.w=parseFloat(this.dynamicsWorld.trans.getRotation().w()))}};AICRAFT.Ai=function(b,a,c,d,e,f,h,g){AICRAFT.GameObject.call(this,b,a,c,d,e,f,h);this.Ammo=void 0!==g?g:Ammo;this.sight={};this.sight.lines=[];this.sight.quaternion={};this.sight.quaternion.x=0;this.sight.quaternion.y=0;this.sight.quaternion.z=0;this.sight.quaternion.w=1;this.sight.range=80;this.sightMesh=void 0;this.maxSpeed=10;this.acceleration=28;this.weaponLock=this.raycastLock=this.lookAtLock=this.rotateLock=this.moveLock=this.codeUploading=!1;this.weaponRange=100;this.weaponDelay=1E3;this.hp=
100;this.onSightFound=this.owner=this.name=void 0};AICRAFT.Ai.prototype=new AICRAFT.GameObject;AICRAFT.Ai.prototype.constructor=AICRAFT.Ai;
AICRAFT.Ai.prototype.buildMesh=function(b,a,c){var d=this;AICRAFT.Ai.JSONloader(d,"asset/rat_walk.js",a,c,b,function(){d.mesh.visible=!0});var e=new b.Geometry;e.vertices=AICRAFT.Ai.getSight(0,0,0,0,0,-1,d.sight.range,60,10,this.Ammo,!1);c=new b.LineBasicMaterial({color:c,lineWidth:1});this.sightMesh=new b.Line(e,c);this.sightMesh.type=b.Lines;this.sightMesh.useQuaternion=!0;this.sightMesh.position.x=this.position.x;this.sightMesh.position.y=this.position.y;this.sightMesh.position.z=this.position.z;
this.sightMesh.quaternion.x=this.quaternion.x;this.sightMesh.quaternion.y=this.quaternion.y;this.sightMesh.quaternion.z=this.quaternion.z;this.sightMesh.quaternion.w=this.quaternion.w;a.add(this.sightMesh)};
AICRAFT.Ai.prototype.buildPhysic=function(b,a){AICRAFT.GameObject.prototype.buildPhysic.call(this,b,a);this.sight.quaternion.x=this.quaternion.x;this.sight.quaternion.y=this.quaternion.y;this.sight.quaternion.z=this.quaternion.z;this.sight.quaternion.w=this.quaternion.w;this.sight.lines=AICRAFT.Ai.getSight(0,0,0,0,0,-1,this.sight.range,60,10,this.Ammo,!0)};
AICRAFT.Ai.prototype.physicAndGraphicUpdate=function(b){void 0!==this.mesh&&(this.physicUpdate.call(this,this.dynamicsWorld),this.sightMesh.position.x=this.mesh.position.x=this.position.x,this.sightMesh.position.y=this.mesh.position.y=this.position.y,this.sightMesh.position.z=this.mesh.position.z=this.position.z,this.mesh.quaternion.x=this.quaternion.x,this.mesh.quaternion.y=this.quaternion.y,this.mesh.quaternion.z=this.quaternion.z,this.mesh.quaternion.w=this.quaternion.w,this.sightMesh.quaternion.x=
this.sight.quaternion.x,this.sightMesh.quaternion.y=this.sight.quaternion.y,this.sightMesh.quaternion.z=this.sight.quaternion.z,this.sightMesh.quaternion.w=this.sight.quaternion.w,this.mesh.updateAnimation(1E3*b))};
AICRAFT.Ai.prototype.physicUpdate=function(){AICRAFT.GameObject.prototype.physicUpdate.call(this,this.dynamicsWorld);var b=new this.Ammo.btQuaternion(this.sight.quaternion.x,this.sight.quaternion.y,this.sight.quaternion.z,this.sight.quaternion.w),a=new this.Ammo.btTransform;a.setIdentity();a.setRotation(b);var c=new this.Ammo.btVector3(0,0,-1),c=a.op_mul(c);this.sight.lines=AICRAFT.Ai.getSight(this.position.x,this.position.y,this.position.z,c.getX()+this.position.x,c.getY()+this.position.y,c.getZ()+
this.position.z,80,60,10,this.Ammo,!0);this.raycast(1E3);this.Ammo.destroy(a);this.Ammo.destroy(b)};
AICRAFT.Ai.prototype.raycast=function(b){if(!0!==this.raycastLock)for(var a=this,c=0;c<a.sight.lines.length;c+=2){var d=a.sight.lines[c],e=a.sight.lines[c+1],f=new a.Ammo.ClosestRayResultCallback(d,e);this.dynamicsWorld.rayTest(d,e,f);f.hasHit()&&(a.raycastLock=!0,a.found(f.get_m_hitPointWorld().getX(),f.get_m_hitPointWorld().getY(),f.get_m_hitPointWorld().getZ(),f.get_m_collisionObject().getIslandTag()),setTimeout(function(){a.raycastLock=!1},b))}};
AICRAFT.Ai.prototype.fireAt=function(b,a,c,d){if(!0!==this.weaponLock){var e=this,f=new e.Ammo.btVector3(e.position.x,e.position.y,e.position.z),b=new e.Ammo.btVector3(b-e.position.x,a-e.position.y,c-e.position.z);b.normalize();b.op_mul(e.weaponRange);b.op_add(f);console.log("fire from"+f.getX()+","+f.getZ()+" to "+b.getX()+","+b.getZ());a=new e.Ammo.ClosestRayResultCallback(f,b);e.dynamicsWorld.rayTest(f,b,a);a.hasHit()&&(e.weaponLock=!0,console.log("hit! objectID:"+a.get_m_collisionObject().getIslandTag()),
setTimeout(function(){e.weaponLock=!1;void 0!==d&&d()},e.weaponDelay))}};AICRAFT.Ai.prototype.found=function(b,a,c,d){if(!(-1===d||d===this.owner.phybody.getIslandTag())){event={};event.position=[b,a,c];event.tag=d;try{this.onSightFound(event)}catch(e){}}};AICRAFT.Ai.prototype.ahead=function(b,a){b=Math.abs(b);AICRAFT.Ai.move(this,b,a,!0,400)};AICRAFT.Ai.prototype.back=function(b,a){b=Math.abs(b);AICRAFT.Ai.move(this,b,a,!1,600)};
AICRAFT.Ai.prototype.lookLeft=function(b,a){AICRAFT.Ai.lookRotate(this,b,a,!0)};AICRAFT.Ai.prototype.lookRight=function(b,a){AICRAFT.Ai.lookRotate(this,b,a,!1)};
AICRAFT.Ai.prototype.lookAt=function(b,a){var c=this;if(!0!==c.lookAtLock){360<b&&(b%=360);var d=c.phybody.getOrientation(),e=AICRAFT.quatFromEuler(b,0,0,c.Ammo),d=AICRAFT.quatMul(e,d);c.sight.quaternion.x=d.getX();c.sight.quaternion.y=d.getY();c.sight.quaternion.z=d.getZ();c.sight.quaternion.w=d.getW();c.lookAtLock=!0;setTimeout(function(){c.lookAtLock=!1;void 0!==a&&a()},3E3)}};AICRAFT.Ai.prototype.turnRight=function(b,a){AICRAFT.Ai.rotate(this,b,a,!1,!0,!1,40)};
AICRAFT.Ai.prototype.turnLeft=function(b,a){AICRAFT.Ai.rotate(this,b,a,!0,!0,!1,40)};
AICRAFT.Ai.prototype.setPos=function(b,a,c,d,e,f,h,g,k,i,j,l,m,n,o){a=parseFloat(a);c=parseFloat(c);d=parseFloat(d);e=parseFloat(e);f=parseFloat(f);h=parseFloat(h);g=parseFloat(g);k=parseFloat(k);i=parseFloat(i);j=parseFloat(j);l=parseFloat(l);m=parseFloat(m);n=parseFloat(n);o=parseFloat(o);AICRAFT.GameObject.prototype.setPos.call(this,b,a,c,d,e,f,h,g,m,n,o);this.sight.quaternion.x=k;this.sight.quaternion.y=i;this.sight.quaternion.z=j;this.sight.quaternion.w=l;this.sightMesh.quaternion.x=this.sight.quaternion.x;
this.sightMesh.quaternion.y=this.sight.quaternion.y;this.sightMesh.quaternion.z=this.sight.quaternion.z;this.sightMesh.quaternion.w=this.sight.quaternion.w};AICRAFT.Ai.lookRotate=function(b,a,c,d){AICRAFT.Ai.rotate(b,a,c,d,!1,!0,30)};
AICRAFT.Ai.rotate=function(b,a,c,d,e,f,h){if(1>a||1>b.hp||b.codeUploading||!0===b.rotateLock)return void 0!==c&&!0!==b.codeUploading&&c(),console.log("quiting rotate"),!1;b.rotateLock=!0;360<a&&(a%=360);var g=b.phybody.getOrientation(),k=new b.Ammo.btQuaternion(b.sight.quaternion.x,b.sight.quaternion.y,b.sight.quaternion.z,b.sight.quaternion.w),i=new b.Ammo.btQuaternion,i=!0===d?AICRAFT.quatFromEuler(1,0,0):AICRAFT.quatFromEuler(-1,0,0);if(!0===e){g=AICRAFT.quatMul(g,i);b.quaternion.x=g.getX();b.quaternion.y=
g.getY();b.quaternion.z=g.getZ();b.quaternion.w=g.getW();var j=new b.Ammo.btTransform;j.setIdentity();j.setOrigin(new b.Ammo.btVector3(b.position.x,b.position.y,b.position.z));j.setRotation(g);b.phybody.activate();b.phybody.getMotionState().setWorldTransform(j);b.phybody.setCenterOfMassTransform(j)}!0===f&&(g=AICRAFT.quatMul(k,i),b.sight.quaternion.x=g.getX(),b.sight.quaternion.y=g.getY(),b.sight.quaternion.z=g.getZ(),b.sight.quaternion.w=g.getW());setTimeout(function(){b.rotateLock=!1;AICRAFT.Ai.rotate(b,
a-1,c,d,e,f,h)},h)};
AICRAFT.Ai.move=function(b,a,c,d,e){if(1>a||1>b.hp||b.codeUploading||!0===b.moveLock)return void 0!==c&&!0!==b.codeUploading&&c(),console.log("quiting move"),!1;b.moveLock=!0;var f=b.phybody.getLinearVelocity(),f=Math.sqrt(f.getX()*f.getX()+f.getY()*f.getY()+f.getZ()*f.getZ());b.phybody.activate();var h=b.phybody.getOrientation(),g=new b.Ammo.btTransform;g.setIdentity();g.setRotation(h);h=new b.Ammo.btVector3(0,0,-1);h=g.op_mul(h);for(g=0;g<b.acceleration;g++)h.setX(1.1*h.getX()),h.setY(1.1*h.getY()),
h.setZ(1.1*h.getZ());d||(h.setX(-1*h.getX()),h.setY(-1*h.getY()),h.setZ(-1*h.getZ()));f<b.maxSpeed&&b.phybody.applyCentralImpulse(h);setTimeout(function(){b.moveLock=!1;AICRAFT.Ai.move(b,a-1,c,d,e)},e)};
AICRAFT.Ai.JSONloader=function(b,a,c,d,e,f){(new e.JSONLoader).load(a,function(a){var g=a.materials[0];g.morphTargets=!0;g.color.setHex(d);g.ambient.setHex(2236962);g=new e.MeshFaceMaterial;a=new e.MorphAnimMesh(a,g);a.duration=1E3;a.time=0;a.castShadow=!0;a.receiveShadow=!0;a.position.x=b.position.x;a.position.y=b.position.y;a.position.z=b.position.z;a.useQuaternion=!0;a.quaternion.set(b.quaternion.x,b.quaternion.y,b.quaternion.z,b.quaternion.w);a.scale.set(5,5,5);b.mesh=a;c.add(a);a.visible=!1;
void 0!==f&&f()})};AICRAFT.Ai.getSight=function(b,a,c,d,e,f,h,g,k,i,j){var l=[],d=new i.btVector3(d-b,e-a,f-c),e=AICRAFT.quatFromEuler(g/2,0,0,i),f=new i.btTransform;f.setRotation(e);d=f.op_mul(d);d.normalize();d.op_mul(h);do l.push(AICRAFT.v(b,a,c,j),AICRAFT.v(d.getX()+b,d.getY()+a,d.getZ()+c,j)),e=AICRAFT.quatFromEuler(-1*k,0,0,i),f.setRotation(e),d=f.op_mul(d),d.normalize(),d.op_mul(h),g-=k;while(0<=g);i.destroy(e);i.destroy(f);return l};AICRAFT.Player=function(b,a,c,d,e,f,h,g){AICRAFT.GameObject.call(this,b,a,c,d,e,f,h);this.Ammo=void 0!==g?g:Ammo;this.maxSpeed=20;this.acceleration=4;this.connected=!1;this.keycode=0;this.codeUploading=!1};AICRAFT.Player.prototype=new AICRAFT.GameObject;AICRAFT.Player.prototype.constructor=AICRAFT.Player;
AICRAFT.Player.prototype.handleKeyDown=function(b,a){"W"==String.fromCharCode(b.keyCode)?a.keycode|=8:"A"==String.fromCharCode(b.keyCode)?a.keycode|=4:"S"==String.fromCharCode(b.keyCode)?a.keycode|=2:"D"==String.fromCharCode(b.keyCode)?a.keycode|=1:"E"==String.fromCharCode(b.keyCode)?a.keycode|=16:"Q"==String.fromCharCode(b.keyCode)?a.keycode|=32:17==b.keyCode&&(a.keycode|=64)};
AICRAFT.Player.prototype.handleKeyUp=function(b,a){"W"==String.fromCharCode(b.keyCode)?a.keycode^=8:"A"==String.fromCharCode(b.keyCode)?a.keycode^=4:"S"==String.fromCharCode(b.keyCode)?a.keycode^=2:"D"==String.fromCharCode(b.keyCode)?a.keycode^=1:"E"==String.fromCharCode(b.keyCode)?a.keycode^=16:"Q"==String.fromCharCode(b.keyCode)?a.keycode^=32:17==b.keyCode&&(a.keycode^=64)};
AICRAFT.Player.prototype.updateInput=function(b,a){AICRAFT.ClientEngine.key(this.keycode,"ctl")&&!0===this.IsClient&&a.fire();if(!0!==this.codeUploading){void 0!==b&&(Ammo=b);var c=this.phybody.getLinearVelocity(),c=Math.sqrt(c.getX()*c.getX()+c.getY()*c.getY()+c.getZ()*c.getZ());AICRAFT.ClientEngine.key(this.keycode,"w")&&c<this.maxSpeed&&1>this.position.y&&AICRAFT.Player.ahead(this,!0);AICRAFT.ClientEngine.key(this.keycode,"a")&&c<this.maxSpeed&&1>this.position.y&&AICRAFT.Player.side(this,!0);AICRAFT.ClientEngine.key(this.keycode,
"s")&&c<this.maxSpeed&&1>this.position.y&&AICRAFT.Player.ahead(this,!1);AICRAFT.ClientEngine.key(this.keycode,"d")&&c<this.maxSpeed&&1>this.position.y&&AICRAFT.Player.side(this,!1);AICRAFT.ClientEngine.key(this.keycode,"e")&&0.1>this.position.y&&this.rotate(2);AICRAFT.ClientEngine.key(this.keycode,"q")&&0.1>this.position.y&&this.rotate(2,!0)}};
AICRAFT.Player.prototype.rotate=function(b,a){if(!0!==this.codeUploading){void 0===a&&(a=!1);var c=this.phybody.getOrientation(),d=new this.Ammo.btQuaternion,d=!0===a?AICRAFT.quatFromEuler(b,0,0):AICRAFT.quatFromEuler(-1*b,0,0),c=AICRAFT.quatMul(c,d);this.quaternion.x=c.getX();this.quaternion.y=c.getY();this.quaternion.z=c.getZ();this.quaternion.w=c.getW();d=new this.Ammo.btTransform;d.setIdentity();d.setOrigin(new this.Ammo.btVector3(this.position.x,this.position.y,this.position.z));d.setRotation(c);
this.phybody.activate();this.phybody.getMotionState().setWorldTransform(d);this.phybody.setCenterOfMassTransform(d)}};AICRAFT.Player.side=function(b,a){var c;c=!0===a?new b.Ammo.btVector3(-1,0,0):new b.Ammo.btVector3(1,0,0);AICRAFT.Player.move(b,c)};AICRAFT.Player.ahead=function(b,a){var c;c=!0===a?new b.Ammo.btVector3(0,0,-1):new b.Ammo.btVector3(0,0,1);AICRAFT.Player.move(b,c)};
AICRAFT.Player.move=function(b,a){if(!0!==this.codeUploading){b.phybody.activate();var c=b.phybody.getOrientation(),d=new b.Ammo.btTransform;d.setIdentity();d.setRotation(c);a=d.op_mul(a);for(c=0;c<b.acceleration;c++)a.setX(1.1*a.getX()),a.setY(1.1*a.getY()),a.setZ(1.1*a.getZ());b.phybody.applyCentralImpulse(a)}};AICRAFT.CameraControl=function(b,a,c){this.camera=b;this.camera.useQuaternion=!0;this.camera.lookAt(new THREE.Vector3(0,0,-1));this.domElement=c||document;this.gameObj=a;this.target=new THREE.Vector3(0,0,0);this.deltaY=this.prevMouseY=this.mouseYc=this.mouseY=this.deltaX=this.prevMouseX=this.mouseXc=this.mouseX=0;this.mouseDragOn=!1;this.speed=2;this.domElement===document?(this.viewHalfX=window.innerWidth/2,this.viewHalfY=window.innerHeight/2):(this.viewHalfX=this.domElement.offsetWidth/2,this.viewHalfY=
this.domElement.offsetHeight/2,this.domElement.setAttribute("tabindex",-1))};AICRAFT.CameraControl.prototype.constructor=AICRAFT.CameraControl;
AICRAFT.CameraControl.prototype.update=function(){this.camera.position.x=this.gameObj.position.x;this.camera.position.y=this.gameObj.position.y;this.camera.position.z=this.gameObj.position.z;var b=this.tailVector();this.camera.position.x+=b.x;this.camera.position.y+=b.y;this.camera.position.z+=b.z;this.camera.position.y+=10;this.camera.quaternion.x=this.gameObj.quaternion.x;this.camera.quaternion.y=this.gameObj.quaternion.y;this.camera.quaternion.z=this.gameObj.quaternion.z;this.camera.quaternion.w=
this.gameObj.quaternion.w};
AICRAFT.CameraControl.prototype.onMouseMove=function(b){this.domElement===document?(this.mouseX=b.pageX,this.mouseY=b.pageY):(this.mouseX=b.pageX-this.viewHalfX,this.mouseY=b.pageY-this.viewHalfY);this.domElement===document?(this.mouseXc=b.pageX-this.viewHalfX,this.mouseYc=b.pageY-this.viewHalfY):(this.mouseXc=b.pageX-this.domElement.offsetLeft-this.viewHalfX,this.mouseYc=b.pageY-this.domElement.offsetTop-this.viewHalfY);this.deltaX=this.mouseX-this.prevMouseX;this.deltaY=this.mouseY-this.prevMouseY;
this.prevMouseX=this.mouseX;this.prevMouseY=this.mouseY};AICRAFT.CameraControl.prototype.onMouseDown=function(b){this.domElement!==document&&this.domElement.focus();b.preventDefault();b.stopPropagation();this.mouseDragOn=!0};AICRAFT.CameraControl.prototype.onMouseUp=function(b){b.preventDefault();b.stopPropagation();this.mouseDragOn=!1};AICRAFT.CameraControl.prototype.pitch=function(){};AICRAFT.CameraControl.prototype.tailVector=function(){return AICRAFT.CameraControl.setVector(this,20,!1)};
AICRAFT.CameraControl.prototype.frontVector=function(){return AICRAFT.CameraControl.setVector(this,1,!0)};AICRAFT.CameraControl.setVector=function(b,a,c){var c=new Ammo.btVector3(0,0,!0===c?-1:1),b=b.gameObj.phybody.getOrientation(),d=new Ammo.btTransform;d.setIdentity();d.setRotation(b);c=d.op_mul(c);return new THREE.Vector3(c.getX()*a,c.getY()*a,c.getZ()*a)};AICRAFT.CodeEmitter=function(b,a,c,d,e){var f=this;this.cameraControls=b;this.socket=d;this.player=a;this.ai=c;if(void 0===e||null===e)e=document.body;this.switching=this.IsEnable=!1;this.editor=document.createElement("div");this.editor.id="editor";this.editor.style.background="#999";this.editor.style.width="80%";this.editor.style.height="80%";this.editor.style.zIndex="-3";this.editor.style.position="absolute";this.editor.style.visibility="hidden";this.editor.style.left=this.cameraControls.viewHalfX;
this.editor.style.top=this.cameraControls.viewHalfY;e.appendChild(this.editor);this.editorAce=ace.edit("editor");this.editorAce.setReadOnly(!1);this.editorAceDom=document.getElementById("editor");d.on("emitterInit",function(a){a=a.replace(/ai_name_to_replace/g,"AI_"+f.ai.name.toString());f.editorAce.focus();f.editorAce.getSession().setValue(a)})};AICRAFT.CodeEmitter.prototype.constructor=AICRAFT.CodeEmitter;
AICRAFT.CodeEmitter.prototype.fire=function(){if(!0!==this.switching){this.switching=!0;!0===this.IsEnable?this.send():this.enable();var b=this;setTimeout(function(){b.switching=!1},1500)}};
AICRAFT.CodeEmitter.prototype.enable=function(){!0!==this.IsEnable&&(this.IsEnable=!0,this.editor.style.visibility="visible",this.editor.style.left="20%",this.editor.style.top="20%",this.editorAceDom.style.visibility="visible",this.editor.style.zIndex="3",this.editorAce.setReadOnly(!1),this.ai.codeUploading=!0,this.player.codeUploading=!0,this.socket.emit("code"))};
AICRAFT.CodeEmitter.prototype.send=function(){!1!==this.IsEnable&&(this.IsEnable=!1,this.editor.style.visibility="hidden",this.editorAceDom.style.visibility="hidden",this.editor.style.zIndex="-3",this.editorAce.setReadOnly(!0),this.ai.codeUploading=!1,this.player.codeUploading=!1,this.socket.emit("coded",this.editorAce.getSession().getValue()))};AICRAFT.requestAnimationFrame=function(b,a){return setTimeout(b,1E3/a)};AICRAFT.requestPosFrame=function(b,a){return setTimeout(b,1E3/a)};AICRAFT.requestKeyFrame=function(b,a){return setTimeout(b,1E3/a)};AICRAFT.v=function(b,a,c,d){return!0===d?AICRAFT.bv(b,a,c):new THREE.Vertex(new THREE.Vector3(b,a,c))};AICRAFT.bv=function(b,a,c){return new Ammo.btVector3(b,a,c)};
AICRAFT.quatMul=function(b,a){return new Ammo.btQuaternion(b.getW()*a.getX()+b.getX()*a.getW()+b.getY()*a.getZ()-b.getZ()*a.getY(),b.getW()*a.getY()+b.getY()*a.getW()+b.getZ()*a.getX()-b.getX()*a.getZ(),b.getW()*a.getZ()+b.getZ()*a.getW()+b.getX()*a.getY()-b.getY()*a.getX(),b.getW()*a.getW()-b.getX()*a.getX()-b.getY()*a.getY()-b.getZ()*a.getZ())};
AICRAFT.quatFromEuler=function(b,a,c,d){this.Ammo=void 0!==d?d:Ammo;var d=b*Math.PI/360,e=a*Math.PI/360,f=c*Math.PI/360,c=Math.sin(d),a=Math.sin(e),b=Math.sin(f),d=Math.cos(d),e=Math.cos(e),f=Math.cos(f);return(new this.Ammo.btQuaternion(b*d*e-f*c*a,f*c*e+b*d*a,f*d*a-b*c*e,f*d*e+b*c*a)).normalize()};AICRAFT.bind=function(b,a){return function(){a.apply(b,arguments)}};AICRAFT.Engine=function(){this.dynamicsWorld=void 0;this.totalPlayers=2;this.players=[];this.ais=[];this.objs=[];this.animateFPS=60;this.posFPS=20;this.phyFPS=30;this.aiEngine=void 0};
AICRAFT.Engine.prototype={constructor:AICRAFT.Engine,init:function(b,a,c){var d=this;d.aiEngine=c;var b=new a.btDefaultCollisionConfiguration,c=new a.btCollisionDispatcher(b),e=new a.btDbvtBroadphase,f=new a.btSequentialImpulseConstraintSolver;this.dynamicsWorld=new a.btDiscreteDynamicsWorld(c,e,f,b);this.dynamicsWorld.setGravity(new a.btVector3(0,-9.82,0));this.dynamicsWorld.trans=new a.btTransform;this.dynamicsWorld.trans.setIdentity();(function(){var b=new a.btBoxShape(new a.btVector3(200,0.5,
200)),c=new a.btTransform;c.setIdentity();c.setOrigin(new a.btVector3(0,-5.5,0));var f=0,e=0!=f,j=new a.btVector3(0,0,0);e&&b.calculateLocalInertia(f,j);e=new a.btDefaultMotionState(c);f=new a.btRigidBodyConstructionInfo(f,e,b,j);f=new a.btRigidBody(f);d.dynamicsWorld.addRigidBody(f);b=new a.btBoxShape(new a.btVector3(200,15,0.5));c=new a.btTransform;c.setIdentity();c.setOrigin(new a.btVector3(0,-5.5,-200));f=0;e=0!=f;j=new a.btVector3(0,0,0);e&&b.calculateLocalInertia(f,j);e=new a.btDefaultMotionState(c);
f=new a.btRigidBodyConstructionInfo(f,e,b,j);f=new a.btRigidBody(f);d.dynamicsWorld.addRigidBody(f);b=new a.btBoxShape(new a.btVector3(0.5,15,200));c=new a.btTransform;c.setIdentity();c.setOrigin(new a.btVector3(200,-5.5,0));f=0;e=0!=f;j=new a.btVector3(0,0,0);e&&b.calculateLocalInertia(f,j);e=new a.btDefaultMotionState(c);f=new a.btRigidBodyConstructionInfo(f,e,b,j);f=new a.btRigidBody(f);d.dynamicsWorld.addRigidBody(f);b=new a.btBoxShape(new a.btVector3(200,15,0.5));c=new a.btTransform;c.setIdentity();
c.setOrigin(new a.btVector3(0,-5.5,200));f=0;e=0!=f;j=new a.btVector3(0,0,0);e&&b.calculateLocalInertia(f,j);e=new a.btDefaultMotionState(c);f=new a.btRigidBodyConstructionInfo(f,e,b,j);f=new a.btRigidBody(f);d.dynamicsWorld.addRigidBody(f);b=new a.btBoxShape(new a.btVector3(0.5,15,200));c=new a.btTransform;c.setIdentity();c.setOrigin(new a.btVector3(-200,-5.5,0));f=0;e=0!=f;j=new a.btVector3(0,0,0);e&&b.calculateLocalInertia(f,j);e=new a.btDefaultMotionState(c);f=new a.btRigidBodyConstructionInfo(f,
e,b,j);f=new a.btRigidBody(f);d.dynamicsWorld.addRigidBody(f)})();(function(){for(var b=0;b<d.totalPlayers;b++)quat=AICRAFT.quatFromEuler(0,0,0,a),d.players[b]=new AICRAFT.Player(-150+301*Math.random(),0,-150+301*Math.random(),quat.getX(),quat.getY(),quat.getZ(),quat.getW(),a),d.players[b].buildPhysic(a,d.dynamicsWorld),quat=AICRAFT.quatFromEuler(360*Math.random(),0,0,a),d.ais[b]=new AICRAFT.Ai(d.players[b].position.x,0,d.players[b].position.z-25,quat.getX(),quat.getY(),quat.getZ(),quat.getW(),a),
d.ais[b].buildPhysic(a,d.dynamicsWorld),d.ais[b].owner=d.players[b]})()},networkInit:function(b){var a=this;b.emit("totalPlayers",this.totalPlayers);b.emit("connect",AICRAFT.Engine.getNextAvailablePnum(this.players));b.on("connected",function(c){var d=c[0];a.ais[d].name=c[1];if(a.players[d].connected||void 0===a.players[d])return!1;console.log("Conected players:"+d);a.players[d].connected=!0;a.aiEngine.initAI(a.ais[d],a.ais[d].name);b.set("Pnum",d)});b.emit("pi",AICRAFT.Engine.encryptedPacket(this.players));
b.emit("ai",AICRAFT.Engine.encryptedPacket(this.ais));b.on("disconnect",function(){b.get("Pnum",function(b,d){void 0!==d&&(a.players[d].connected=!1)})});b.emit("emitterInit",a.aiEngine.templateStr);b.on("code",function(){b.get("Pnum",function(b,d){a.ais[d].codeUploading=!0;a.players[d].codeUploading=!0})});b.on("coded",function(c){b.get("Pnum",function(b,e){a.ais[e].codeUploading=!1;a.players[e].codeUploading=!1;a.aiEngine.loadAI(c,a.ais[e].name)})})},syncPos:function(b){var a=this;AICRAFT.requestPosFrame(function(){a.syncPos(b)},
a.posFPS);b.emit("p",AICRAFT.Engine.encryptedPacket(a.players));b.emit("a",AICRAFT.Engine.encryptedPacket(a.ais))},syncKey:function(b,a){var c=this;b.on("k",function(d){b.get("Pnum",function(b,f){c.players[f].keycode=d;c.players[f].updateInput(a)})})},animate:function(){var b=this;AICRAFT.requestAnimationFrame(function(){b.animate()},b.animateFPS);-1===AICRAFT.Engine.getNextAvailablePnum(b.players)&&(b.dynamicsWorld.stepSimulation(1/b.phyFPS,10),b.players.forEach(function(a){a.physicUpdate()}),b.ais.forEach(function(a){a.physicUpdate()}))}};
AICRAFT.Engine.encryptedPacket=function(b){var a=[];b.forEach(function(b){a.push(parseFloat(b.position.x));a.push(parseFloat(b.position.y));a.push(parseFloat(b.position.z));a.push(b.quaternion.x);a.push(b.quaternion.y);a.push(b.quaternion.z);a.push(b.quaternion.w);void 0!==b.sight&&(a.push(b.sight.quaternion.x),a.push(b.sight.quaternion.y),a.push(b.sight.quaternion.z),a.push(b.sight.quaternion.w));a.push(b.phybody.getAngularVelocity().getX());a.push(b.phybody.getAngularVelocity().getY());a.push(b.phybody.getAngularVelocity().getZ())});
return a};
AICRAFT.Engine.extractPacket=function(b){if(0==b.length%10){for(var a='({"bindings":[',c=0;c<b.length;c+=10)a+='{"position":',a+="["+b[c]+","+b[c+1]+","+b[c+2]+"],",a+='"quaternion":',a+="["+b[c+3]+","+b[c+4]+","+b[c+5]+","+b[c+6]+"],",a+='"velocity":',a+="["+b[c+7]+","+b[c+8]+","+b[c+9]+"]",a+="},";return eval(a+"]})")}if(0==b.length%14){a='({"bindings":[';for(c=0;c<b.length;c+=14)a+='{"position":',a+="["+b[c]+","+b[c+1]+","+b[c+2]+"],",a+='"quaternion":',a+="["+b[c+3]+","+b[c+4]+","+b[c+5]+","+
b[c+6]+"],",a+='"sightQuaternion":',a+="["+b[c+7]+","+b[c+8]+","+b[c+9]+","+b[c+10]+"],",a+='"velocity":',a+="["+b[c+11]+","+b[c+12]+","+b[c+13]+"]",a+="},";return eval(a+"]})")}};AICRAFT.Engine.getNextAvailablePnum=function(b){if(void 0===b)return-1;for(var a=0;a<b.length;a++)if(!b[a].connected)return a;return-1};
AICRAFT.Engine.makeJson=function(b){var a='({"bindings":[';b.forEach(function(b){a+='{"position":';a+="["+b.position.x+","+b.position.y+","+b.position.z+"],";a+='"quaternion":';a+="["+b.quaternion.x+","+b.quaternion.y+","+b.quaternion.z+","+b.quaternion.w+"],";a+='"velocity":';a+="["+b.phybody.getAngularVelocity().getX()+","+b.phybody.getAngularVelocity().getY()+","+b.phybody.getAngularVelocity().getZ()+"]";a+="},"});a+="]})";return eval(a)};AICRAFT.AIEngine=function(){this.templateStr=void 0;this.ais=[]};
AICRAFT.AIEngine.prototype={constructor:AICRAFT.AIEngine,loadAI:function(b,a){var c=b.replace(/ai_name_to_replace/g,"AI_"+a.toString());console.log(c);try{eval(c)}catch(d){console.log(d.message)}this.ais.forEach(function(b){if(b.body.name===a)try{b.run()}catch(c){console.log(c.message)}})},initAI:function(b,a){AICRAFT["AI_"+a.toString()]=function(a){this.body=a};AICRAFT["AI_"+a.toString()].prototype=new (AICRAFT["AI_"+a.toString()]);AICRAFT["AI_"+a.toString()].prototype.constructor=AICRAFT["AI_"+
a.toString()];AICRAFT["AI_"+a.toString()].prototype.run=function(){};AICRAFT["AI_"+a.toString()].prototype.onSightFound=function(){};var c=new (AICRAFT["AI_"+a.toString()])(b);c.body.onSightFound=function(a){c.onSightFound(a)};c.run();this.ais.push(c)},stepSimulation:function(){this.ais.forEach(function(b){b.run()})}};AICRAFT.ClientEngine=function(){this.phyFPS=this.keyFPS=30;this.codeEmitter=this.cameraControls=this.camera=this.renderer=this.scene=this.stats=void 0;this.clock=new THREE.Clock;this.myPnum=this.socket=this.totalPlayers=this.dynamicsWorld=this.ground=void 0;this.players=[];this.ais=[];this.lastKeycode=0;this.colors=[11960,10079283,16716820,6736896,7686143,4029112]};
AICRAFT.ClientEngine.prototype={constructor:AICRAFT.ClientEngine,init:function(b){var a=this;if(Detector.webgl)this.renderer=new THREE.WebGLRenderer({antialias:!0,preserveDrawingBuffer:!0}),this.renderer.setClearColorHex(12303291,1);else return Detector.addGetWebGLMessage(),!0;this.renderer.setSize(window.innerWidth,window.innerHeight);this.renderer.shadowMapEnabled=!0;document.getElementById("container").appendChild(this.renderer.domElement);this.stats=new Stats;this.stats.domElement.style.position=
"absolute";this.stats.domElement.style.bottom="0px";document.body.appendChild(this.stats.domElement);this.scene=new THREE.Scene;(function(){var b=new Ammo.btDefaultCollisionConfiguration,c=new Ammo.btCollisionDispatcher(b),d=new Ammo.btDbvtBroadphase,e=new Ammo.btSequentialImpulseConstraintSolver;a.dynamicsWorld=new Ammo.btDiscreteDynamicsWorld(c,d,e,b);a.dynamicsWorld.setGravity(new Ammo.btVector3(0,-9.82,0));a.dynamicsWorld.trans=new Ammo.btTransform;a.dynamicsWorld.trans.setIdentity()})();this.camera=
new THREE.PerspectiveCamera(45,window.innerWidth/window.innerHeight,1,1E4);this.scene.add(this.camera);THREEx.WindowResize.bind(this.renderer,this.camera);var c=new THREE.SpotLight;c.position.set(170,330,-160);c.castShadow=!0;this.scene.add(c);var c=new THREE.PlaneGeometry(400,400,10,10),d=new THREE.MeshLambertMaterial({color:this.colors[1]});this.ground=new THREE.Mesh(c,d);this.ground.rotation.x=-Math.PI/2;this.ground.position.y=-5;this.ground.receiveShadow=!0;this.scene.add(this.ground);(function(){var b=
new Ammo.btBoxShape(new Ammo.btVector3(200,0.5,200)),c=new Ammo.btTransform;c.setIdentity();c.setOrigin(new Ammo.btVector3(0,-5.5,0));var d=0,e=0!=d,i=new Ammo.btVector3(0,0,0);e&&b.calculateLocalInertia(d,i);e=new Ammo.btDefaultMotionState(c);d=new Ammo.btRigidBodyConstructionInfo(d,e,b,i);a.ground.phybody=new Ammo.btRigidBody(d);a.dynamicsWorld.addRigidBody(a.ground.phybody);b=new Ammo.btBoxShape(new Ammo.btVector3(200,15,0.5));c=new Ammo.btTransform;c.setIdentity();c.setOrigin(new Ammo.btVector3(0,
-5.5,-200));d=0;e=0!=d;i=new Ammo.btVector3(0,0,0);e&&b.calculateLocalInertia(d,i);e=new Ammo.btDefaultMotionState(c);d=new Ammo.btRigidBodyConstructionInfo(d,e,b,i);d=new Ammo.btRigidBody(d);a.dynamicsWorld.addRigidBody(d);b=new Ammo.btBoxShape(new Ammo.btVector3(0.5,15,200));c=new Ammo.btTransform;c.setIdentity();c.setOrigin(new Ammo.btVector3(200,-5.5,0));d=0;e=0!=d;i=new Ammo.btVector3(0,0,0);e&&b.calculateLocalInertia(d,i);e=new Ammo.btDefaultMotionState(c);d=new Ammo.btRigidBodyConstructionInfo(d,
e,b,i);d=new Ammo.btRigidBody(d);a.dynamicsWorld.addRigidBody(d);b=new Ammo.btBoxShape(new Ammo.btVector3(200,15,0.5));c=new Ammo.btTransform;c.setIdentity();c.setOrigin(new Ammo.btVector3(0,-5.5,200));d=0;e=0!=d;i=new Ammo.btVector3(0,0,0);e&&b.calculateLocalInertia(d,i);e=new Ammo.btDefaultMotionState(c);d=new Ammo.btRigidBodyConstructionInfo(d,e,b,i);d=new Ammo.btRigidBody(d);a.dynamicsWorld.addRigidBody(d);b=new Ammo.btBoxShape(new Ammo.btVector3(0.5,15,200));c=new Ammo.btTransform;c.setIdentity();
c.setOrigin(new Ammo.btVector3(-200,-5.5,0));d=0;e=0!=d;i=new Ammo.btVector3(0,0,0);e&&b.calculateLocalInertia(d,i);e=new Ammo.btDefaultMotionState(c);d=new Ammo.btRigidBodyConstructionInfo(d,e,b,i);d=new Ammo.btRigidBody(d);a.dynamicsWorld.addRigidBody(d)})();var e=new THREE.Quaternion;(function(){for(var c=0;c<a.totalPlayers;c++){var d=Math.floor(6*Math.random());e.setFromEuler(new THREE.Vector3(-30,-20,0));a.players[c]=new AICRAFT.Player(b.players.bindings[c].position[0],b.players.bindings[c].position[1],
b.players.bindings[c].position[2],b.players.bindings[c].quaternion[0],b.players.bindings[c].quaternion[1],b.players.bindings[c].quaternion[2],b.players.bindings[c].quaternion[3]);a.players[c].IsClient=!0;a.players[c].buildMesh(THREE,a.scene,a.colors[d]);a.players[c].buildPhysic(Ammo,a.dynamicsWorld);e.setFromEuler(new THREE.Vector3(30,-20,0));a.ais[c]=new AICRAFT.Ai(b.ais.bindings[c].position[0],b.ais.bindings[c].position[1],b.ais.bindings[c].position[2],b.ais.bindings[c].quaternion[0],b.ais.bindings[c].quaternion[1],
b.ais.bindings[c].quaternion[2],b.ais.bindings[c].quaternion[3]);a.ais[c].IsClient=!0;a.ais[c].buildMesh(THREE,a.scene,a.colors[d]);a.ais[c].buildPhysic(Ammo,a.dynamicsWorld);a.ais[c].owner=a.players[c]}})();this.cameraControls=new AICRAFT.CameraControl(this.camera,this.players[this.myPnum],this.renderer.domElemen);this.codeEmitter=new AICRAFT.CodeEmitter(this.cameraControls,this.players[this.myPnum],this.ais[this.myPnum],b);document.addEventListener("keydown",function(b){a.players[a.myPnum].handleKeyDown(b,
a.players[a.myPnum])},!1);document.addEventListener("keyup",function(b){a.players[a.myPnum].handleKeyUp(b,a.players[a.myPnum])},!1);AICRAFT.ClientEngine.coordHelper(this.scene)},aiNameExist:function(b){this.ais.forEach(function(a){if(a.name===b)return!0});return!1},networkReady:function(b,a,c,d){var e=this;e.socket=io.connect("/");e.socket.on("totalPlayers",function(a){e.totalPlayers=a});e.socket.on("connect",function(a){e.myPnum=a});e.socket.on("pi",function(f){e.socket.players=AICRAFT.Engine.extractPacket(f);
e.socket.on("ai",function(f){e.socket.ais=AICRAFT.Engine.extractPacket(f);if(-1!=e.myPnum){b(e.socket);e.players[e.myPnum].connected=!0;f="aicraft"+e.myPnum.toString();do prompt("what is the name of your AI?",f);while(!0===e.aiNameExist(f));e.ais[e.myPnum].name=f;e.socket.emit("connected",[e.myPnum,e.ais[e.myPnum].name]);a();c();d()}else alert("game is full")})})},syncPos:function(){var b=this;b.socket.on("p",function(a){for(var a=AICRAFT.Engine.extractPacket(a).bindings,c=0;c<b.totalPlayers;c++)b.players[c].setPos(Ammo,
a[c].position[0],a[c].position[1],a[c].position[2],a[c].quaternion[0],a[c].quaternion[1],a[c].quaternion[2],a[c].quaternion[3],a[c].velocity[0],a[c].velocity[1],a[c].velocity[2])});b.socket.on("a",function(a){for(var a=AICRAFT.Engine.extractPacket(a).bindings,c=0;c<b.totalPlayers;c++)b.ais[c].setPos(Ammo,a[c].position[0],a[c].position[1],a[c].position[2],a[c].quaternion[0],a[c].quaternion[1],a[c].quaternion[2],a[c].quaternion[3],a[c].sightQuaternion[0],a[c].sightQuaternion[1],a[c].sightQuaternion[2],
a[c].sightQuaternion[3],a[c].velocity[0],a[c].velocity[1],a[c].velocity[2])})},syncKey:function(){AICRAFT.requestKeyFrame(this.syncKey.bind(this),this.keyFPS);void 0===this.players[this.myPnum]||void 0===this.myPnum||(0!=this.players[this.myPnum].keycode?(this.socket.emit("k",this.players[this.myPnum].keycode),this.players[this.myPnum].updateInput(Ammo,this.codeEmitter)):0==this.players[this.myPnum].keycode&&0!=this.lastKeycode&&this.socket.emit("k",0),this.lastKeycode=this.players[this.myPnum].keycode)},
animate:function(){this.delta=this.clock.getDelta();requestAnimationFrame(this.animate.bind(this));this.dynamicsWorld.stepSimulation(1/this.phyFPS,10);for(var b=0;b<this.totalPlayers;b++)this.players[b].physicAndGraphicUpdate(),this.ais[b].physicAndGraphicUpdate(this.delta);this.cameraControls.update();this.render();this.stats.update()},render:function(){this.renderer.render(this.scene,this.camera)}};
AICRAFT.ClientEngine.coordHelper=function(b){var a=new THREE.Geometry;a.vertices.push(AICRAFT.v(-200,0,0),AICRAFT.v(200,0,0),AICRAFT.v(0,-200,0),AICRAFT.v(0,200,0),AICRAFT.v(0,0,-200),AICRAFT.v(0,0,200),AICRAFT.v(200,1,0),AICRAFT.v(200,-1,0),AICRAFT.v(150,1,0),AICRAFT.v(150,-1,0),AICRAFT.v(100,1,0),AICRAFT.v(100,-1,0),AICRAFT.v(50,1,0),AICRAFT.v(50,-1,0),AICRAFT.v(-50,1,0),AICRAFT.v(-50,-1,0),AICRAFT.v(-100,1,0),AICRAFT.v(-100,-1,0),AICRAFT.v(-150,1,0),AICRAFT.v(-150,-1,0),AICRAFT.v(-200,1,0),AICRAFT.v(-200,
-1,0),AICRAFT.v(1,200,0),AICRAFT.v(-1,200,0),AICRAFT.v(1,150,0),AICRAFT.v(-1,150,0),AICRAFT.v(1,100,0),AICRAFT.v(-1,100,0),AICRAFT.v(1,50,0),AICRAFT.v(-1,50,0),AICRAFT.v(1,-50,0),AICRAFT.v(-1,-50,0),AICRAFT.v(1,-100,0),AICRAFT.v(-1,-100,0),AICRAFT.v(1,-150,0),AICRAFT.v(-1,-150,0),AICRAFT.v(1,-200,0),AICRAFT.v(-1,-200,0),AICRAFT.v(0,1,200),AICRAFT.v(0,-1,200),AICRAFT.v(0,1,150),AICRAFT.v(0,-1,150),AICRAFT.v(0,1,100),AICRAFT.v(0,-1,100),AICRAFT.v(0,1,50),AICRAFT.v(0,-1,50),AICRAFT.v(0,1,-50),AICRAFT.v(0,
-1,-50),AICRAFT.v(0,1,-100),AICRAFT.v(0,-1,-100),AICRAFT.v(0,1,-150),AICRAFT.v(0,-1,-150),AICRAFT.v(0,1,-200),AICRAFT.v(0,-1,-200));var c=new THREE.LineBasicMaterial({color:0,lineWidth:1}),a=new THREE.Line(a,c);a.type=THREE.Lines;b.add(a)};AICRAFT.ClientEngine.key=function(b,a){return"w"==a?b&8?!0:!1:"a"==a?b&4?!0:!1:"s"==a?b&2?!0:!1:"d"==a?b&1?!0:!1:"ctl"==a?b&64?!0:!1:"e"==a?b&16?!0:!1:"q"==a?b&32?!0:!1:!1};
