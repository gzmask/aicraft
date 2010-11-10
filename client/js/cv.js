
/*===========================================================================*/
var msPF = 66; //ms per frame, which is 1000/FPS
var canvas;
var ctx;

/*===========================================================================*/
var p1 = new Player(10,10);
var a1 = new Ai(30,30);

/*===========================================================================*/
function animateScene() {
	p1.x = p1.x+3
	a1.x = a1.x+1
}

function drawScene () {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	p1.draw(ctx);
	a1.draw(ctx);
}

function update() {
	animateScene();
	drawScene();
}

function cv_init() {
	canvas = document.getElementById("canvas");
	if (canvas.getContext) {
		ctx = canvas.getContext("2d");
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		setInterval(update, msPF);
	}
}
