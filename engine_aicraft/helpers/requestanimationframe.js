AICRAFT.requestAnimationFrame = function( /* function FrameRequestCallback */ callback ) {
	return setTimeout( callback, 1000 / 30 );
};

AICRAFT.requestPosFrame = function( /* function FrameRequestCallback */ callback ) {
	return setTimeout( callback, 1000 / 30 );
};

AICRAFT.requestKeyFrame = function( /* function FrameRequestCallback */ callback ) {
	return setTimeout( callback, 1000 / 30 );
};
