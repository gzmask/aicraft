//this is object binding
var a= function bar () {
	this.mother = 1;
}

function foo() {
	var b=2;
	a.son = b;
}

foo();

console.log(a.son);
console.log(a.mother);
