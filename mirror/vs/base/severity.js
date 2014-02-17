define("vs/base/severity", ["require", "exports", "vs/base/strings"], function(e, t, n) {
  function i(e) {
    return e ? n.equalsIgnoreCase(r, e) ? o.Error : n.equalsIgnoreCase(s, e) || n.equalsIgnoreCase(a, e) ? o.Warning :
      n.equalsIgnoreCase(u, e) ? o.Info : 0 : 0;
  }! function(e) {
    e[e.Ignore = 0] = "Ignore";

    e[e.Info = 1] = "Info";

    e[e.Warning = 2] = "Warning";

    e[e.Error = 4] = "Error";
  }(t.Severity || (t.Severity = {}));
  var o = t.Severity;

  var r = "error";

  var s = "warning";

  var a = "warn";

  var u = "info";
  t.fromValue = i;
});