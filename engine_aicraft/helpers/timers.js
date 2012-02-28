AICRAFT.requestAnimationFrame = function( /* function FrameRequestCallback */ callback, fps ) {
	return setTimeout( callback, 1000 / fps );
};

AICRAFT.requestPosFrame = function( /* function FrameRequestCallback */ callback, fps ) {
	return setTimeout( callback, 1000 / fps );
};

AICRAFT.requestKeyFrame = function( /* function FrameRequestCallback */ callback, fps ) {
	return setTimeout( callback, 1000 / fps );
};
