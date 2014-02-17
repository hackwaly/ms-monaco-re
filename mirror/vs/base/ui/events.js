define("vs/base/ui/events", ["require", "exports"], function(e, t) {
  var n = function() {
    function e(e) {
      this.time = (new Date).getTime();

      this.originalEvent = e;

      this.source = null;
    }
    return e;
  }();
  t.Event = n;
  var i = function(e) {
    function t(t, n) {
      e.call(this, n);

      this.message = t;
    }
    __extends(t, e);

    return t;
  }(n);
  t.MessageEvent = i;
  var o = function(e) {
    function t(t, n, i, o) {
      e.call(this, o);

      this.key = t;

      this.oldValue = n;

      this.newValue = i;
    }
    __extends(t, e);

    return t;
  }(n);
  t.PropertyChangeEvent = o;
  var r = function(e) {
    function t(t, n) {
      e.call(this, n);

      this.element = t;
    }
    __extends(t, e);

    return t;
  }(n);
  t.ViewerEvent = r;

  t.EventType = {
    PROPERTY_CHANGED: "propertyChanged",
    SELECTION: "selection",
    FOCUS: "focus",
    BLUR: "blur",
    HIGHLIGHT: "highlight",
    EXPAND: "expand",
    COLLAPSE: "collapse",
    TOGGLE: "toggle",
    CONTENTS_CHANGED: "contentsChanged",
    BEFORE_RUN: "beforeRun",
    RUN: "run",
    EDIT: "edit",
    SAVE: "save",
    CANCEL: "cancel",
    INFO: "info",
    WARNING: "warning",
    ERROR: "error",
    CHANGE: "change",
    DISPOSE: "dispose"
  };
});