/**
 * @fileoverview aiengine runs on node.js 
 */

/**
 * @class AI Engine runs the intelligent part of the ai on the server side
 */
AICRAFT.AIEngine = function () {
	this.templateStr = undefined;
	this.ais = new Array();
};

AICRAFT.AIEngine.prototype = {

	constructor: AICRAFT.AIEngine,

	/** load or reload the AI
	 * @param aiStr code string 
	 * @param AIbody physical part 
	 * @param AIname {string} name
	 * Should be called on changed of the code string
	 */
	loadAI: function(aiStr, AIbody, AIname) {
		var templateStr = this.templateStr.replace(/ai_name_to_replace/g, "AI_"+AIname.toString());
		eval(templateStr);
		eval(aiStr);
		eval("var AI = AICRAFT.AI_"+AIname.toString());
		var ai = new AI(AIbody);
		this.ais.push(ai);
	},

	stepSimulation: function() {
		this.ais.forEach( function(ai) {
			ai.run();
		});
	}

};
