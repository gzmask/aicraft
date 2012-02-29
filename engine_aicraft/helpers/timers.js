/** @fileoverview all the helper functions related to controlling framerates
 */

/** controls framerate related to graphics and physics
 * @param callback the fucntion that needed to be loop
 */
AICRAFT.requestAnimationFrame = function( /* function FrameRequestCallback */ callback, fps ) {
	return setTimeout( callback, 1000 / fps );
};

/** controls the framerate related to network Position syncs
 */
AICRAFT.requestPosFrame = function( /* function FrameRequestCallback */ callback, fps ) {
	return setTimeout( callback, 1000 / fps );
};

/** controls the framerate for user inputs syncs in network
 */
AICRAFT.requestKeyFrame = function( /* function FrameRequestCallback */ callback, fps ) {
	return setTimeout( callback, 1000 / fps );
};
