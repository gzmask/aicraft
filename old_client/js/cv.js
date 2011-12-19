/*
	Event handling: currentlyPressedKeys[keycode], a hash, is used to track which keys are pressed and hold. If true, it's being hold, if false, it's been released. This way, all keys can be track reguardless the hardware limites.

*/

/*===========================================================================*/
var msPF = 66; //ms per frame, which is 1000/FPS
var canvas;
var ctx;

/*===========================================================================*/
var p1 = new Player(10,10);
var a1 = new Player(30,30);
var currentlyPressedKeys = Object();
var wasd = 0;

/*===========================================================================*/

function handleKeyUp(event) {
	currentlyPressedKeys[event.keyCode] = false;
	if (String.fromCharCode(event.keyCode) == "W") {
		wasd = wasd ^ 8;
	} else if (String.fromCharCode(event.keyCode) == "A") {
		wasd = wasd ^ 4;
	} else if (String.fromCharCode(event.keyCode) == "S") {
		wasd = wasd ^ 2;
	} else if (String.fromCharCode(event.keyCode) == "D") {
		wasd = wasd ^ 1;
	}
}

function handleKeyDown(event) {
	currentlyPressedKeys[event.keyCode] = true;

	if (String.fromCharCode(event.keyCode) == "W") {
		wasd = wasd | 8;
	} else if (String.fromCharCode(event.keyCode) == "A") {
		wasd = wasd | 4;
	} else if (String.fromCharCode(event.keyCode) == "S") {
		wasd = wasd | 2;
	} else if (String.fromCharCode(event.keyCode) == "D") {
		wasd = wasd | 1;
	}
	//16,32,64,128,256,512,1024,2048,4096,8192,16384,32768 are reserved for 12 more keys
}

function animateScene() {
	//here inserts client side animations
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
		document.onkeydown = handleKeyDown;
		document.onkeyup = handleKeyUp;
		setInterval(update, msPF);
	}
}
