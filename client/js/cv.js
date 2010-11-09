
/*===========================================================================*/
var msPF = 15;
var canvas;
var ctx;

/*===========================================================================*/
function Square() {
	this.tlx;
	this.tly;
	this.brx;
	this.bry;
}
var s1 = new Square();
s1.tlx = 10;
s1.tly = 10;
s1.brx = 55;
s1.bry = 50;
var s2 = new Square();
s2.tlx = 30;
s2.tly = 30;
s2.brx = 55;
s2.bry = 50;


/*===========================================================================*/
function animateScene() {
	s1.tlx = s1.tlx+2;
	s2.tlx = s2.tlx+1;
}

function drawScene () {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.fillStyle = "rgb(200,0,0)";  
        ctx.fillRect (s1.tlx, s1.tly, s1.brx, s1.bry);  
  
        ctx.fillStyle = "rgba(0, 0, 200, 0.5)";  
        ctx.fillRect (s2.tlx, s2.tly, s2.brx, s2.bry);  

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
		setInterval(update, 66);
	}
}
