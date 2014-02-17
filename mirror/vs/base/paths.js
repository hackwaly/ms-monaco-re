define("vs/base/paths", ["require", "exports"], function(e, t) {
  function n(e) {
    return e.replace(/\\/g, "/");
  }

  function r(e) {
    var t = ~e.lastIndexOf("/") || ~e.lastIndexOf("\\");
    return 0 === t || 0 === ~t ? e : e.substring(0, ~t);
  }

  function i(e) {
    var n = ~e.lastIndexOf("/") || ~e.lastIndexOf("\\");
    return 0 === n ? e : ~n === e.length - 1 ? t.basename(e.substring(0, e.length - 1)) : e.substr(~n + 1);
  }

  function o() {
    for (var e = [], t = 0; t < arguments.length - 0; t++) e[t] = arguments[t + 0];
    for (var n = [], r = /\w+:\/\//.exec(e[0]), i = "/" === e[0][0], o = 0; o < e.length; o++) n.push.apply(n, e[o].split(
      "/"));
    for (var o = 0; o < n.length; o++) {
      var s = n[o];
      "." === s || 0 === s.length ? (n.splice(o, 1), o -= 1) : o > 0 && ".." === s && (n.splice(o - 1, 2), o -= 2);
    }
    r && n.splice(1, 0, "");

    i && n.unshift("");

    return n.join("/");
  }

  function s(e) {
    return "/" === e[0];
  }
  t.normalize = n;

  t.dirname = r;

  t.basename = i;

  t.join = o;

  t.isAbsolute = s;
});