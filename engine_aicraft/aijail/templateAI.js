AICRAFT.ai_name_to_replace.prototype.run = function() {
};

AICRAFT.ai_name_to_replace.prototype.onSightFound = function(event) {
    this.body.fireAt(event.position[0],event.position[1],event.position[2]);
};

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
 * this.body.lookAt(to, cb)
 * this.body.lookLeft(degree, cb)
 * this.body.lookRight(degree, cb)
 * 
 * Weapon:
 * this.body.fireAt(x, y, z, fn_cb)
 * 
 * Event Object in onSightFound function:
 * event.position is an array[x,y,z]
 * event.tag is the object ID of the discovered Object.
 */

