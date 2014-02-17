define("vs/base/ui/widgets/sash", ["require", "exports", "vs/base/dom/builder", "vs/base/dom/dom",
  "vs/base/eventEmitter", "vs/base/dom/mouseEvent", "vs/css!./sash"
], function(e, t, n, i, o, r) {
  var s = n.$;
  ! function(e) {
    e[e.HORIZONTAL = 0] = "HORIZONTAL";

    e[e.VERTICAL = 1] = "VERTICAL";
  }(t.Orientation || (t.Orientation = {}));
  var a = (t.Orientation, function(e) {
    function t(t, n, i) {
      if ("undefined" == typeof i) {
        i = {
          orientation: 1
        };
      }
      var o = this;
      e.call(this);

      this.$e = s(".monaco-sash").appendTo(t).on("mousedown", function(e) {
        o.onMouseDown(e);
      });

      0 === i.orientation ? this.$e.addClass("horizontal") : this.$e.addClass("vertical");

      this.isDisabled = !1;

      this.hidden = !1;

      this.layoutProvider = n;

      this.options = i;
    }
    __extends(t, e);

    t.prototype.getHTMLElement = function() {
      return this.$e.getHTMLElement();
    };

    t.prototype.onMouseDown = function(e) {
      var t = this;
      if (i.EventHelper.stop(e, !1), !this.isDisabled) {
        var n = new r.StandardMouseEvent(e);

        var o = n.posx;

        var a = n.posy;

        var u = {
          startX: o,
          currentX: o,
          startY: a,
          currentY: a
        };
        this.$e.addClass("active");

        this.emit("start", u);
        var l = s("div").style({
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: 1e6,
          cursor: 1 === this.options.orientation ? "ew-resize" : "ns-resize"
        });

        var c = s(window);
        c.on("mousemove", function(e) {
          i.EventHelper.stop(e, !1);
          var n = new r.StandardMouseEvent(e);

          var s = {
            startX: o,
            currentX: n.posx,
            startY: a,
            currentY: n.posy
          };
          t.emit("change", s);
        }).once("mouseup", function(e) {
          i.EventHelper.stop(e, !1);

          t.$e.removeClass("active");

          t.emit("end");

          c.off("mousemove");

          l.destroy();
        });

        l.appendTo(document.body);
      }
    };

    t.prototype.layout = function() {
      if (1 === this.options.orientation) {
        var e = this.layoutProvider;
        this.$e.style({
          height: e.getVerticalSashHeight(this) + "px",
          top: e.getVerticalSashTop(this) + "px",
          left: e.getVerticalSashLeft(this) - this.$e.getTotalSize().width / 2 + "px"
        });
      } else {
        var t = this.layoutProvider;
        this.$e.style({
          width: t.getHorizontalSashWidth(this) + "px",
          top: t.getHorizontalSashTop(this) - this.$e.getTotalSize().height / 2 + "px",
          left: t.getHorizontalSashLeft(this)
        });
      }
    };

    t.prototype.show = function() {
      this.hidden = !1;

      this.$e.show();
    };

    t.prototype.hide = function() {
      this.hidden = !0;

      this.$e.hide();
    };

    t.prototype.isHidden = function() {
      return this.hidden;
    };

    t.prototype.isVisible = function() {
      return !this.hidden;
    };

    t.prototype.enable = function() {
      this.$e.removeClass("disabled");

      this.isDisabled = !1;
    };

    t.prototype.disable = function() {
      this.$e.addClass("disabled");

      this.isDisabled = !0;
    };

    t.prototype.dispose = function() {
      if (this.$e) {
        this.$e.destroy();
        this.$e = null;
      }

      e.prototype.dispose.call(this);
    };

    return t;
  }(o.EventEmitter));
  t.Sash = a;
});