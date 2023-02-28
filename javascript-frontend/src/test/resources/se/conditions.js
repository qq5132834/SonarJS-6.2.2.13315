function main() {
  var x = foo1();
  if (!x) {
    x = 42;
  }
  bar(); // PS x=TRUTHY || x=POS_NUMBER
  makeLive(x);

  x = foo2();
  if (!(x)) {
    x = 42;
  }
  bar(); // PS x=TRUTHY || x=POS_NUMBER
  makeLive(x);

  var notExecuted;
  x = 42;
  if (x != null) {
  } else {
    notExecuted = 42;
  }
  bar(); // PS notExecuted=UNDEFINED
  makeLive(notExecuted);

  if (x) {
  } else {
    notExecuted = 42;
  }
  bar(); // PS notExecuted=UNDEFINED
  makeLive(notExecuted);

  if (!x) {
    notExecuted = 42;
  } else {
  }
  bar(); // PS notExecuted=UNDEFINED
  makeLive(notExecuted);

  x = foo3();
  if (x == null) {
    foo(); // PS x=NULLY
  } else {
    bar(); // PS x=NOT_NULLY
  }
  makeLive(x);

  x = foo4();
  if (undefined != x) {
    foo(); // PS x=NOT_NULLY
  } else {
    bar(); // PS x=NULLY
  }
  makeLive(x);

  x = 42;

  if (true) {
  } else {
    x = null;
  }

  dummyStatement(); // PS x=POS_NUMBER
  makeLive(x);

  if (false) {
  } else {
    x = null;
  }

  dummyStatement(); // PS x=NULL
  makeLive(x);

  while(true) {
    break;
  }

  var y1 = null, y2 = 42, z = 42;

  if (y1 != null) {
    z = null;
  }

  dummyStatement(); // PS z=POS_NUMBER
  makeLive(z);

  if (y2 == null) {
    z = null;
  }

  makeLive(z); // PS z=POS_NUMBER

  x = foo(), y1 = bar();
  z = x === null && y1;
  if (z) {
    dummyStatement(); // PS x=NULL & y1=TRUTHY
  }

  makeLive(y1, x);

  x = foo();
  var y = x && x.bar;
  z = condition1() ? null : x;
  if (z) {
    dummyStatement(); // PS z=TRUTHY
    makeLive(z);
  }

  x = foo() && 42;
  dummyStatement(); // PS x=FALSY || x=POS_NUMBER
  makeLive(x);

  var p1 = foo(), p2 = foo(), p3 = foo();
  var combi = p1 && p2 == 42 && p3 === null;
  if (combi) {
    foo(); // PS p1=TRUTHY & p3=NULL
  }

  makeLive(p1, p2, p3);

}
