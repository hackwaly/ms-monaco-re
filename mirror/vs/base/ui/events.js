var __extends = this.__extends || function(a, b) {
    function d() {
      this.constructor = a
    }
    for (var c in b) b.hasOwnProperty(c) && (a[c] = b[c]);
    d.prototype = b.prototype, a.prototype = new d
  };
define(["require", "exports"], function(a, b) {
  var c = function() {
    function a(a) {
      this.time = (new Date).getTime(), this.originalEvent = a, this.source = null
    }
    return a
  }();
  b.Event = c;
  var d = function(a) {
    function b(b, c) {
      a.call(this, c), this.message = b
    }
    return __extends(b, a), b
  }(c);
  b.MessageEvent = d;
  var e = function(a) {
    function b(b, c, d, e) {
      a.call(this, e), this.key = b, this.oldValue = c, this.newValue = d
    }
    return __extends(b, a), b
  }(c);
  b.PropertyChangeEvent = e;
  var f = function(a) {
    function b(b, c) {
      a.call(this, c), this.element = b
    }
    return __extends(b, a), b
  }(c);
  b.ViewerEvent = f, b.EventType = {
    PROPERTY_CHANGED: "propertyChanged",
    SELECTION: "selection",
    FOCUS: "focus",
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
  }
})