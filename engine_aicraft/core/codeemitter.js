AICRAFT.CodeEmitter = function(cameraControls, player, ai, socket, domElement) {
	var self = this;
	this.cameraControls = cameraControls;
	this.socket = socket;
	this.player = player;
	this.ai = ai;
	if (domElement === undefined || domElement === null) {
		domElement = document.body;
	}
	this.IsEnable = false;
	this.switching = false;
	this.editor = document.createElement('div');
	this.editor.id = "editor";
	this.editor.style.background = '#333';
	this.editor.style.width = '500px';
	this.editor.style.height = '400px';
	this.editor.style.zIndex = '-3';
	this.editor.style.position = 'absolute';
	this.editor.style.visibility = 'hidden';
	this.editor.style.left =this.cameraControls.viewHalfX;
	this.editor.style.top =this.cameraControls.viewHalfY;
	//set up code emitter form
	domElement.appendChild(this.editor);
	this.editorAce = ace.edit('editor');
	this.editorAce.setReadOnly(true);
	this.editorAceDom = document.getElementById('editor');
	socket.on('emitterInit', function(data){
		data = data.replace(/ai_name_to_replace/g, 'AI_'+self.ai.name.toString());
		self.editorAce.getSession().setValue(data);
	});
};

AICRAFT.CodeEmitter.prototype.constructor = AICRAFT.CodeEmitter;

AICRAFT.CodeEmitter.prototype.fire = function() {
	if (this.switching === true) {return;}
	this.switching = true;
	if (this.IsEnable === true) {
		this.send();
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
	this.editorAceDom.style.visibility = 'visible';
	this.editor.style.zIndex = '3';
	this.editorAce.setReadOnly(false);
	//here I need to tell server the code uploading is begun using websocket
	this.ai.codeUploading = true;
	this.player.codeUploading = true;
	this.socket.emit('code');
};

AICRAFT.CodeEmitter.prototype.send = function() {
	if (this.IsEnable === false) {return;}
	this.IsEnable = false;
	this.editor.style.visibility = 'hidden';
	this.editorAceDom.style.visibility = 'hidden';
	this.editor.style.zIndex = '-3';
	this.editorAce.setReadOnly(true);
	this.ai.codeUploading = false;
	this.player.codeUploading = false;
	this.socket.emit('coded', this.editorAce.getSession().getValue());
};
