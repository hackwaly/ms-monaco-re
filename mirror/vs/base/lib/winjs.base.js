define("vs/base/lib/winjs.base", ["./raw.winjs.base", "vs/base/errors"], function(e, t) {
  "use strict";

  function n(e) {
    var n = e.detail;

    var i = n.id;
    return n.parent ? (n.handler && o && delete o[i], void 0) : (o[i] = n, 1 === Object.keys(o).length && setTimeout(
      function() {
        var e = o;
        o = {};

        Object.keys(e).forEach(function(n) {
          var i = e[n];
          if (i.exception) {
            t.onUnexpectedError(i.exception);
          } else {
            if (i.error) {
              t.onUnexpectedError(i.error);
            }
          }

          console.log("WARNING: Promise with no error callback:" + i.id);

          console.log(i);

          if (i.exception) {
            console.log(i.exception.stack);
          }
        });
      }, 0), void 0);
  }

  function i(e, t, n) {
    var i;

    var o;

    var r;

    var s = new WinJS.Promise(function(e, t, n) {
      i = e;

      o = t;

      r = n;
    }, function() {
      e.cancel();
    });
    e.then(function(e) {
      if (t) {
        t(e);
      }

      i(e);
    }, function(e) {
      if (n) {
        n(e);
      }

      o(e);
    }, r);

    return s;
  }
  var o = {};
  WinJS.Promise.addEventListener("error", n);

  return {
    decoratePromise: i,
    Class: WinJS.Class,
    xhr: WinJS.xhr,
    Promise: WinJS.Promise,
    TPromise: WinJS.Promise,
    Utilities: WinJS.Utilities
  };
});