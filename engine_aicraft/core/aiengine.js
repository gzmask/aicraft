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
	 * @param AIname {string} name
	 * Should be called on changed of the code string
	 */
	loadAI: function(aiStr, AIname) {
		var code_str = aiStr.replace(/ai_name_to_replace/g, 'AI_'+AIname.toString());
		console.log(code_str);
		eval(code_str);
		this.ais.forEach( function(ai) {
			if (ai.body.name === AIname) {ai.run();}
		});
		//eval("var AI = AICRAFT.AI_"+AIname.toString());
	},
	
	/** initialize the AI
	 * @param AIbody physical part 
	 * @param AIname {string} name
	 * Should be called on changed of the code string
	 */
	initAI: function(AIbody, AIname) {
		var code_str = 'AICRAFT.AI_'+AIname.toString()+'= function(aibody){this.body=aibody;};';
		code_str += "AICRAFT.AI_"+AIname.toString()+".prototype = new AICRAFT.AI_"+AIname.toString()+"();";
		code_str += "AICRAFT.AI_"+AIname.toString()+".prototype.constructor = AICRAFT."+AIname.toString()+";";
		code_str += "AICRAFT.AI_"+AIname.toString()+".prototype.run = function(){};";
		console.log(code_str);
		eval(code_str);
		var ai = new AICRAFT['AI_'+AIname.toString()](AIbody);
		ai.run();
		this.ais.push(ai);
	},
	
	stepSimulation: function() {
		this.ais.forEach( function(ai) {
			ai.run();
		});
	}

};
