/* input: nullAi, which is the physical part of the Ai
 * This Class is the intelligent part of the Ai
 */
AICRAFT.Ai0 = function (nullAi) {
	this.body = nullAi;
};

AICRAFT.Ai0.prototype = new AICRAFT.Ai0();
AICRAFT.Ai0.prototype.constructor = AICRAFT.Ai0;
