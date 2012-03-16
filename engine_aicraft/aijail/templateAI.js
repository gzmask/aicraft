/** Entry point function : AICRAFT.[ai name].prototype.run
 * When AI sees something, function AICRAFT.[ai name].prototype.onSightFound is executed : AICRAFT.[ai name].prototype.run
 * 
 * Body:
 * this.body controls the motor part of the AI
 * 
 * APIs:
 * 
 * Motor:
 * this.body.turnLeft(degree, cb)
 * this.body.turnRight(degree, cb)
 * 
 * Sight: 
 * lookAt(to, cb)
 * lookLeft(degree, cb)
 * lookRight(degree, cb)
 * 
 * Weapon:
 * fireAt(x, y, z, fn_cb)
 * 
 * Event Object in onSightFound function:
 * event.position is an array[x,y,z]
 * event.tag is the object ID of the discovered Object.
 */
AICRAFT.ai_name_to_replace.prototype.run = function() {
};

AICRAFT.ai_name_to_replace.prototype.onSightFound = function(event) {
};