function Player(x,y) {

	this.x = x;
	this.y = y;

	this.draw = function(ctx) {
		ctx.fillStyle = "rgb(200,0,0)";  
		ctx.fillRect (this.x, this.y, 10, 10);  
	};

}
