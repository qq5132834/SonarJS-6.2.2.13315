var a = {
  a : 1, // Noncompliant [[sc=8;ec=9]] {{Remove this trailing comma.}}
};
var b = [ 1, ]; // Noncompliant

var a = { // OK
  a : 1
};
var b = [ 1 ]; // OK
var b = []; // OK

var b = [ 1,, ]; // Noncompliant [[sc=13;ec=14]]
