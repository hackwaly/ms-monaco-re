define("vs/base/ui/scrollbar/impl/common", ["require", "exports"], function(e, t) {
  function n(e) {
    switch (e) {
      case "hidden":
        return 1;
      case "visible":
        return 2;
      default:
        return 0;
    }
  }! function(e) {
    e[e.Auto = 0] = "Auto";

    e[e.Hidden = 1] = "Hidden";

    e[e.Visible = 2] = "Visible";
  }(t.Visibility || (t.Visibility = {}));
  t.Visibility;
  t.visibilityFromString = n;
});