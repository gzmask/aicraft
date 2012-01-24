var a=1;
function foo(a) {
	var b=2;
	a.son = b;
}

foo(a);

console.log(a.son);
