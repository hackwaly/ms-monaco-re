require.config({
  shim: {
    "vs/base/lib/raw.winjs.base": {}
  }
}), define(["./raw.winjs.base", "vs/base/errors"], function(a, b) {
  function d(a) {
    var d = a.detail,
      e = d.id;
    if (d.parent) {
      d.handler && c && delete c[e];
      return
    }
    c[e] = d, Object.keys(c).length === 1 && setTimeout(function() {
      var a = c;
      c = {}, Object.keys(a).forEach(function(c) {
        var d = a[c];
        d.exception ? b.onUnexpectedError(d.exception) : d.error && b.onUnexpectedError(d.error), console.log(
          "WARNING: Promise with no error callback:" + d.id), console.log(d), d.exception && console.log(d.exception
          .stack)
      })
    }, 0)
  }

  function e(a, b, c) {
    var d, e, f, g = new WinJS.Promise(function(a, b, c) {
        d = a, e = b, f = c
      }, function() {
        a.cancel()
      });
    return a.then(function(a) {
      b && b(a), d(a)
    }, function(a) {
      c && c(a), e(a)
    }, f), g
  }
  var c = {};
  return WinJS.Promise.addEventListener("error", d), {
    decoratePromise: e,
    Class: WinJS.Class,
    xhr: WinJS.xhr,
    Promise: WinJS.Promise,
    Utilities: WinJS.Utilities
  }
})