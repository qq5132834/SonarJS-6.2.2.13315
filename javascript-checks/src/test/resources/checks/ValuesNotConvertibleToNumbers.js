function testObject() {
  var obj = new Object();
  var obj2 = new Object();
  var date = new Date();
  var num = new Number();
  var bool = new Boolean();
  var unknown = foo();

  // 1. compare an object with the other types
  obj > 0;                     // Noncompliant {{Re-evaluate the data flow; this operand of a numeric comparison could be an Object.}}
//^^^
  obj > true;                  // Noncompliant
//^^^
  obj > false;                 // Noncompliant
//^^^
  obj >= date;                 // Noncompliant
//^^^
  obj >= null;                 // Noncompliant
//^^^
  obj >= undefined;            // Noncompliant {{Re-evaluate the data flow; this operand of a numeric comparison could be "undefined".}}
//       ^^^^^^^^^
  obj >= num;                  // Noncompliant
//^^^
  obj >= bool;                 // Noncompliant
//^^^
  obj > "hello";               // OK
  obj >= unknown;              // OK
  obj > obj2;                  // OK

  // 2. same as 1., but swapping left-hand side and right-hand side
  0 <= obj;                    // Noncompliant {{Re-evaluate the data flow; this operand of a numeric comparison could be an Object.}}
//     ^^^
  true <= obj;                 // Noncompliant
  date < obj;                  // Noncompliant
  null < obj;                  // Noncompliant
  undefined < obj;             // Noncompliant
  num < obj;                   // Noncompliant
  bool < obj;                  // Noncompliant
  "hello" <= obj;              // OK
  unknown < obj;               // OK

  // 3. other cases
  if (1 < function(){}){}      // Noncompliant
}

function testUndefined() {
  undefined > 0;               // Noncompliant {{Re-evaluate the data flow; this operand of a numeric comparison could be "undefined".}}
//^^^^^^^^^
  undefined >= "hello";        // Noncompliant
// Noncompliant@+1
  undefined <= undefined;      // Noncompliant
  null < undefined;            // Noncompliant
  undefined > unknown();       // Noncompliant
//^^^^^^^^^
}

function notTwoIssuesForSameOperand() {
  var obj = new Object();
  for (var i = 0; i < 10; i++) {
    if (obj > 1) {}            // Noncompliant
  }

  var undef;
  for (var i = 0; i < 10; i++) {
    if (undef > 1) {}          // Noncompliant
  }
}

function testTwoUnknowns() {
  foo() < bar();               // OK
}

function testDates() {
  var date = new Date();
  var date2 = new Date();

  date > date2;                // OK
  date >= date2;               // OK
}

function testGeneralNonRegression() {
  1 < 2;                       // OK
  null > "hello";              // OK
}

function notANumber() {

  Number.NaN < 42;            // Noncompliant

  NaN < 42;            // Noncompliant

  var array = [3,2];
  array > 42;                 // Noncompliant

  var obj = {};
  obj <= 42;                  // Noncompliant

  var undefinedVariable;
  var nan = undefinedVariable + 42;
  nan >= 42;                  // Noncompliant

}
