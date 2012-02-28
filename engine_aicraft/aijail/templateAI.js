/* input: nullAi, which is the physical part of the Ai
 * This Class is the intelligent part of the Ai
 */
AICRAFT.ai_name_to_replace = function (nullAi) {
	this.body = nullAi;
};

AICRAFT.ai_name_to_replace.prototype = new AICRAFT.ai_name_to_replace();
AICRAFT.ai_name_to_replace.prototype.constructor = AICRAFT.ai_name_to_replace;


AICRAFT.ai_name_to_replace.prototype.run = function() {
	this.body.ahead(10);
};
