define(["require", "exports"], function(a, b) {
  function g(a, b) {
    while (a.length > b) {
      a.shift();
    }
  }

  function h(a, b) {
    var c = d[a] || !1;
    d[a] = c;
    var h = e[a] || [];
    h.push(b);

    e[a] = h;
    var i = function() {
      var c = [];
      for (var e = 0; e < arguments.length - 0; e++) {
        c[e] = arguments[e + 0];
      }
      var h;
      if (d[a] === !0) {
        var i = [arguments];
        h = f.indexOf(b);

        if (h !== -1) {
          i.unshift.apply(i, f[h + 1] || []);
          f[h + 1] = [];
        }
        var j = i.length > 1;

        var k = function() {
          var a = i.shift();
          b.apply(b, a);

          if (i.length > 0) {
            window.setTimeout(k, 500);
          }
        };
        k();
      } else {
        h = f.indexOf(b);

        h = h !== -1 ? h : f.length;
        var l = h + 1;

        var m = f[l] || [];
        m.push(arguments);

        g(m, 50);

        f[h] = b;

        f[l] = m;
      }
    };
    return i;
  }
  var c = self;
  if (!c.Monaco) {
    c.Monaco = {};
  }

  c.Monaco.Diagnostics = {};
  var d = c.Monaco.Diagnostics;

  var e = {};

  var f = [];
  b.register = h;
});