define("vs/base/ui/widgets/contextview/contextview", ["require", "exports", "vs/base/dom/builder", "vs/base/dom/dom",
  "vs/base/lifecycle", "vs/base/eventEmitter", "vs/css!./contextview"
], function(e, t, n, i, o, r) {
  var s = n.$;
  ! function(e) {
    e[e.LEFT = 0] = "LEFT";

    e[e.RIGHT = 1] = "RIGHT";
  }(t.AnchorAlignment || (t.AnchorAlignment = {}));
  t.AnchorAlignment;
  ! function(e) {
    e[e.BELOW = 0] = "BELOW";

    e[e.ABOVE = 1] = "ABOVE";
  }(t.AnchorPosition || (t.AnchorPosition = {}));
  var a = (t.AnchorPosition, function(e) {
    function t(t) {
      var n = this;
      e.call(this);

      this.$view = s(".context-view").hide();

      this.setContainer(t);

      this.toDispose = [{
        dispose: function() {
          n.setContainer(null);
        }
      }];

      this.toDisposeOnClean = null;
    }
    __extends(t, e);

    t.prototype.setContainer = function(e) {
      var n = this;
      this.$container && (this.$container.off(t.EVENTS), this.$container = null);

      e && (this.$container = s(e), this.$view.appendTo(this.$container), this.$container.on(t.EVENTS, function(e) {
        n.onDOMEvent(e, document.activeElement);
      }));
    };

    t.prototype.show = function(e) {
      this.isVisible() && this.hide();

      this.$view.setClass("context-view").empty().style({
        top: "0px",
        left: "0px"
      }).show();

      this.toDisposeOnClean = e.render(this.$view.getHTMLElement());

      this.delegate = e;

      this.doLayout();
    };

    t.prototype.layout = function() {
      if (this.isVisible()) {
        if (this.delegate.canRelayout === !1) this.hide();

        return void 0;
        this.delegate.layout && this.delegate.layout();

        this.doLayout();
      }
    };

    t.prototype.doLayout = function() {
      var e;

      var t;

      var n;

      var o;

      var r;

      var a;

      var u;

      var l;

      var c = this.delegate.getAnchor();
      if (i.isHTMLElement(c)) {
        var d = s(c);

        var h = d.getPosition();

        var p = d.getTotalSize();
        r = h.top;

        a = h.left;

        u = p.width;

        l = p.height;
      } else {
        var f = c;
        r = f.y;

        a = f.x;

        u = 0;

        l = 0;
      }
      var g = this.$container.getPosition();

      var m = g.top;

      var v = g.left;

      var y = window.innerHeight;

      var _ = window.innerWidth;

      var b = this.$view.getTotalSize();
      n = b.width;

      o = b.height;
      var C = this.delegate.anchorPosition || 0;
      0 === C ? (e = r + l - m, m + e + o > y && r - m > o && (e = r - o - m)) : (e = r - o - m, 0 > e + m && y > r +
        l + o - m && (e = r + l - m));
      var w = this.delegate.anchorAlignment || 0;
      0 === w ? (t = a - v, v + t + n > _ && (t -= n - u)) : (t = a + u - n - v, 0 > t + v && _ > a + n && (t = a -
        v));

      this.$view.style({
        top: e + "px",
        left: t + "px",
        width: "initial"
      });
    };

    t.prototype.hide = function(e) {
      this.delegate && this.delegate.onHide && this.delegate.onHide(e);

      this.delegate = null;

      this.toDisposeOnClean && (this.toDisposeOnClean.dispose(), this.toDisposeOnClean = null);

      this.$view.hide();
    };

    t.prototype.isVisible = function() {
      return !!this.delegate;
    };

    t.prototype.onDOMEvent = function(e) {
      if (this.delegate)
        if (this.delegate.onDOMEvent) this.delegate.onDOMEvent(e, document.activeElement);
        else {
          if (i.isAncestor(e.target, this.$container.getHTMLElement())) return;
          this.hide();
        }
    };

    t.prototype.dispose = function() {
      e.prototype.dispose.call(this);

      this.hide();

      this.toDispose = o.disposeAll(this.toDispose);
    };

    t.EVENTS = ["click", "keydown", "focus", "blur"];

    return t;
  }(r.EventEmitter));
  t.ContextView = a;
});