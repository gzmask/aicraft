//aiengine runs on node.js 
//this engine runs the intelligent part of the ai
AICRAFT.AIEngine = function () {
	this.templateStr = undefined;
	this.ais = new Array();
};

AICRAFT.AIEngine.prototype = {

	constructor: AICRAFT.AIEngine,

	/* load or reload the AI
	 * input: code string, physical part, name
	 * Should be called on changed of the code string
	 */
	loadAI: function(aiStr, AIbody, AIname) {
		var templateStr = this.templateStr.replace(/ai_name_to_replace/g, "AI_"+AIname.toString());
		eval(templateStr);
		eval(aiStr);
		eval("var AI = AICRAFT.AI_"+AIname.toString());
		var ai = new AI(AIbody);
		this.ais[AIname.toString()] = ai;
	},

	stepSimulation: function() {
		console.log('steping ai');					
		console.log(this.ais);
		this.ais.forEach( function(ai) {
			console.log('getting');
			ai.run();
		}, this);
	}

};
