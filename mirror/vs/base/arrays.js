define("vs/base/arrays", ["require", "exports"], function(e, t) {
  function n(e, t) {
    "undefined" == typeof t && (t = 0);

    return e[e.length - (1 + t)];
  }

  function i(e, t) {
    for (var n = 0, i = e.length; i > n; n++) {
      t(e[n], function() {
        e.splice(n, 1);

        n--;

        i--;
      });
    }
  }

  function o(e, t) {
    "undefined" == typeof t && (t = null);
    for (var n = new Array(e); e-- > 0;) {
      n.push(t);
    }
    return n;
  }

  function r(e, t, n) {
    for (var i = 0, o = e.length - 1; o >= i;) {
      var r = Math.floor((i + o) / 2);

      var s = n(e[r], t);
      if (0 > s) {
        i = r + 1;
      } else {
        if (!(s > 0)) {
          return r;
        }
        o = r - 1;
      }
    }
    return -1;
  }

  function s(e) {
    for (var t = new Array, n = 0, i = e.length; i > n; n++) {
      t.push.apply(t, e[n]);
    }
    return t;
  }

  function a(e, t) {
    for (var n, i = 0, o = e.length - 1; o > i;) {
      n = i + Math.ceil((o - i) / 2);
      e[n].startIndex > t ? o = n - 1 : i = n;
    }
    return i;
  }

  function u(e) {
    for (var t = [], n = 0; n < e.length; n++) {
      var i = e[n];
      i && t.push(i);
    }
    return t;
  }

  function l(e, t) {
    return e.indexOf(t) >= 0;
  }

  function c(e, t, n) {
    var i = e[t];

    var o = e[n];
    e[t] = o;

    e[n] = i;
  }

  function d(e, t, n) {
    e.splice(n, 0, e.splice(t, 1)[0]);
  }
  t.tail = n;

  t.forEach = i;

  t.fill = o;

  t.binarySearch = r;

  t.merge = s;

  t.findIndexInSegmentsArray = a;

  t.coalesce = u;

  t.contains = l;

  t.swap = c;

  t.move = d;
});