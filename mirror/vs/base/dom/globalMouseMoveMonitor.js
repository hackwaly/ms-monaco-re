define("vs/base/dom/globalMouseMoveMonitor", ["require", "exports", "vs/base/lifecycle", "vs/base/dom/dom",
  "vs/base/dom/mouseEvent", "vs/base/dom/iframe"
], function(e, t, n, i, o, r) {
  function s(e, t) {
    var n = new o.StandardMouseEvent(t);
    n.preventDefault();

    return {
      leftButton: n.leftButton,
      posx: n.posx,
      posy: n.posy
    };
  }
  t.standardMouseMoveMerger = s;
  var a = function() {
    function e() {
      this.hooks = [];

      this.mouseMoveEventMerger = null;

      this.mouseMoveCallback = null;

      this.onStopCallback = null;
    }
    e.prototype.dispose = function() {
      this.stopMonitoring(!1);
    };

    e.prototype.stopMonitoring = function(e) {
      if (this.isMonitoring()) {
        this.hooks = n.disposeAll(this.hooks);

        this.mouseMoveEventMerger = null;

        this.mouseMoveCallback = null;
        var t = this.onStopCallback;
        this.onStopCallback = null;

        e && t();
      }
    };

    e.prototype.isMonitoring = function() {
      return this.hooks.length > 0;
    };

    e.prototype.startMonitoring = function(e, t, n) {
      var s = this;
      if (!this.isMonitoring()) {
        this.mouseMoveEventMerger = e;

        this.mouseMoveCallback = t;

        this.onStopCallback = n;
        for (var a = r.getSameOriginWindowChain(), u = 0; u < a.length; u++) this.hooks.push(i.addDisposableThrottledListener(
          a[u].window.document, "mousemove", function(e) {
            return s.mouseMoveCallback(e);
          }, function(e, t) {
            return s.mouseMoveEventMerger(e, t);
          }));

        this.hooks.push(i.addDisposableListener(a[u].window.document, "mouseup", function() {
          return s.stopMonitoring(!0);
        }));
        if (r.hasDifferentOriginAncestor()) {
          var l = a[a.length - 1];
          this.hooks.push(i.addDisposableListener(l.window.document, "mouseout", function(e) {
            var t = new o.StandardMouseEvent(e);
            "html" === t.target.tagName.toLowerCase() && s.stopMonitoring(!0);
          }));

          this.hooks.push(i.addDisposableListener(l.window.document, "mouseover", function(e) {
            var t = new o.StandardMouseEvent(e);
            "html" === t.target.tagName.toLowerCase() && s.stopMonitoring(!0);
          }));

          this.hooks.push(i.addDisposableListener(l.window.document.body, "mouseleave", function() {
            s.stopMonitoring(!0);
          }));
        }
      }
    };

    return e;
  }();
  t.GlobalMouseMoveMonitor = a;
});