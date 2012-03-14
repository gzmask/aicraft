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
		try {
			eval(code_str);
		} catch (err) {
			console.log(err.message);}
		this.ais.forEach( function(ai) {
			if (ai.body.name === AIname) {
				try {
					ai.run();
				} catch(err) {
					console.log(err.message);
				}
				return;}
		});
		//eval("var AI = AICRAFT.AI_"+AIname.toString());
	},
	
	/** initialize the AI
	 * @param AIbody physical part 
	 * @param AIname {string} name
	 * Should be called on changed of the code string
	 */
	initAI: function(AIbody, AIname) {
		//AIbody and AIname can not be used in eval string
		/*
		var code_str = 'AICRAFT.AI_'+AIname.toString()+'= function(aibody){this.body=aibody;};';
		code_str += "AICRAFT.AI_"+AIname.toString()+".prototype = new AICRAFT.AI_"+AIname.toString()+"();";
		code_str += "AICRAFT.AI_"+AIname.toString()+".prototype.constructor = AICRAFT."+AIname.toString()+";";
		code_str += "AICRAFT.AI_"+AIname.toString()+".prototype.run = function(){};";
		console.log(code_str);
		eval(code_str);
		*/
		AICRAFT['AI_'+AIname.toString()] = function(aibody) {
			this.body = aibody;};
		AICRAFT['AI_'+AIname.toString()].prototype = new AICRAFT['AI_'+AIname.toString()]();
		AICRAFT['AI_'+AIname.toString()].prototype.constructor = AICRAFT['AI_'+AIname.toString()];
		AICRAFT['AI_'+AIname.toString()].prototype.run = function(){};
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
