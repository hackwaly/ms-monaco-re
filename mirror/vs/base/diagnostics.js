define("vs/base/diagnostics", ["require", "exports"], function(e, t) {
  function n(e, t) {
    for (; e.length > t;) {
      e.shift();
    }
  }

  function i(e, t) {
    var i = r[e] || !1;
    r[e] = i;
    var o = s[e] || [];
    o.push(t);

    s[e] = o;
    var u = function() {
      for (var i = [], o = 0; o < arguments.length - 0; o++) {
        i[o] = arguments[o + 0];
      }
      var s;
      if (r[e] === !0) {
        var u = [arguments];
        s = a.indexOf(t);

        if (-1 !== s) {
          u.unshift.apply(u, a[s + 1] || []);
          a[s + 1] = [];
        }
        var l = (u.length > 1, function() {
          var e = u.shift();
          t.apply(t, e);

          if (u.length > 0) {
            window.setTimeout(l, 500);
          }
        });
        l();
      } else {
        s = a.indexOf(t);

        s = -1 !== s ? s : a.length;
        var c = s + 1;

        var d = a[c] || [];
        d.push(arguments);

        n(d, 50);

        a[s] = t;

        a[c] = d;
      }
    };
    return u;
  }
  var o = self;
  if (!o.Monaco) {
    o.Monaco = {};
  }

  o.Monaco.Diagnostics = {};
  var r = o.Monaco.Diagnostics;

  var s = {};

  var a = [];
  t.register = i;
});