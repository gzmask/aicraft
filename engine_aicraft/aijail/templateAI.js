/* input: aiBody, which is the physical part of the Ai
 * This Class is the intelligent part of the Ai
 */
AICRAFT.ai_name_to_replace = function (aiBody) {
	this.body = aiBody;
};

AICRAFT.ai_name_to_replace.prototype = new AICRAFT.ai_name_to_replace();
AICRAFT.ai_name_to_replace.prototype.constructor = AICRAFT.ai_name_to_replace;

//user commiting code
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
