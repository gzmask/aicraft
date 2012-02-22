AICRAFT.requestNetworkFrame = function( /* function FrameRequestCallback */ callback ) {
	return setTimeout( callback, 1000 / 60 );
};
