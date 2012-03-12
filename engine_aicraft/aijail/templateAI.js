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
