var A = function(){};

a = new A;
b = new A;

//b.prototype.x = function(){}; //TypeError: Cannot set property 'x' of undefined
//A.prototype.x = function(){};
A.prototype.x = 10;
b.__proto__.y = 20;
a.__proto__.foo = function(){ console.log("foo_1"); };
a.foo();
a.__proto__.foo = function(){ a.foo(); console.log("foo_2"); };
a.foo();//RangeError: Maximum call stack size exceeded

//Fails in Opera or IE<=8
console.log(Object.getPrototypeOf(a)); //[object Object]
console.log(Object.getPrototypeOf(b)); //[object Object]

//Fails in IE
console.log(a.__proto__); //[object Object]
console.log(b.__proto__); //[object Object]

//all browsers 
//(but only if constructor.prototype has not been replaced and fails with Object.create)
console.log(a.constructor.prototype); //[object Object]
console.log(b.constructor.prototype); //[object Object]

