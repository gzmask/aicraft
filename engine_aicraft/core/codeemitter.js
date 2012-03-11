AICRAFT.CodeEmitter = function(cameraControls, player, ai, domElement) {
	this.cameraControls = cameraControls;
	this.player = player;
	this.ai = ai;
	if (domElement === undefined || domElement === null) {
		domElement = document.body;
	}
	this.IsEnable = false;
	this.switching = false;
	this.editor = document.createElement('div');
	this.editor.style.background = '#333';
	this.editor.style.width = '100px';
	this.editor.style.height = '100px';
	this.editor.style.zIndex = '3';
	this.editor.style.position = 'absolute';
	this.editor.style.visibility = 'hidden';
	this.editor.style.left =this.cameraControls.viewHalfX;
	this.editor.style.top =this.cameraControls.viewHalfY;
	domElement.appendChild(this.editor);
};

AICRAFT.CodeEmitter.prototype.constructor = AICRAFT.CodeEmitter;

AICRAFT.CodeEmitter.prototype.switcher = function() {
	if (this.switching === true) {return;}
	this.switching = true;
	if (this.IsEnable === true) {
		this.disable();
	} else {
		this.enable();
	}
	var self = this;
	setTimeout(function(){
		self.switching = false;
	},500);
};

AICRAFT.CodeEmitter.prototype.enable = function() {
	if (this.IsEnable === true) {return;}
	this.IsEnable = true;
	this.editor.style.visibility = 'visible';
	this.editor.style.left = this.cameraControls.mouseX.toString()+'px';
	this.editor.style.top = this.cameraControls.mouseY.toString()+'px';
	//here I need to tell server the code uploading is begun using websocket
};

AICRAFT.CodeEmitter.prototype.disable = function() {
	if (this.IsEnable === false) {return;}
	this.IsEnable = false;
	this.editor.style.visibility = 'hidden';
};