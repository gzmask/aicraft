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
	},
	
	/** initialize the AI
	 * @param AIbody physical part 
	 * @param AIname {string} name
	 * Should be called on changed of the code string
	 */
	initAI: function(AIbody, AIname) {
		AICRAFT['AI_'+AIname.toString()] = function(aibody) {
			this.body = aibody;};
		AICRAFT['AI_'+AIname.toString()].prototype = new AICRAFT['AI_'+AIname.toString()]();
		AICRAFT['AI_'+AIname.toString()].prototype.constructor = AICRAFT['AI_'+AIname.toString()];
		AICRAFT['AI_'+AIname.toString()].prototype.run = function(){};
		AICRAFT['AI_'+AIname.toString()].prototype.onSightFound = function(event){};
		var ai = new AICRAFT['AI_'+AIname.toString()](AIbody);
		ai.body.onSightFound = function(event){
			ai.onSightFound(event);
		};
		this.ais.push(ai);
	}
	
};
