AICRAFT.ai_name_to_replace.prototype.run = function() {
	var self = this;
	var Smove = function() {
		self.body.lookAt(0);
		self.body.ahead(10, function(){
			self.body.turnRight(90, function(){
				Smove();
			});
		});
	};
	Smove();
};

AICRAFT.ai_name_to_replace.prototype.onSightFound = function(event) {
	console.log(this.body.name+' finds enemy at:'+event.position);
	this.body.fireAt(event.position[0],
			event.position[1],
			event.position[2]);
};