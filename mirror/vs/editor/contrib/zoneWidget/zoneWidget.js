define("vs/editor/contrib/zoneWidget/zoneWidget", ["require", "exports", "vs/base/types", "vs/base/objects",
  "vs/base/eventEmitter", "vs/base/dom/builder", "vs/editor/core/constants", "vs/css!./zoneWidget"
], function(e, t, n, i, o, r, s) {
  var a = r.$;

  var u = {
    showArrow: !0,
    showFrame: !0,
    frameColor: "",
    className: ""
  };

  var l = "vs.editor.contrib.zoneWidget";

  var c = function() {
    function e(e, t, n, i, o) {
      this.domNode = e;

      this.afterLineNumber = t;

      this.heightInLines = n;

      this._onDomNodeTop = i;

      this._onComputedHeight = o;
    }
    e.prototype.onDomNodeTop = function(e) {
      this._onDomNodeTop(e);
    };

    e.prototype.onComputedHeight = function(e) {
      this._onComputedHeight(e);
    };

    return e;
  }();

  var d = function() {
    function e(e, t) {
      this._id = e;

      this._domNode = t;
    }
    e.prototype.getId = function() {
      return this._id;
    };

    e.prototype.getDomNode = function() {
      return this._domNode;
    };

    e.prototype.getPosition = function() {
      return null;
    };

    return e;
  }();

  var h = function(e) {
    function t(t, n) {
      if ("undefined" == typeof n) {
        n = {};
      }
      var o = this;
      e.call(this);

      this.editor = t;

      this.options = i.mixin(i.clone(u), n);

      this.zoneId = -1;

      this.overlayWidget = null;

      this.lastView = null;

      this.domNode = document.createElement("div");

      this.domNode.setAttribute("aria-hidden", "true");

      this.domNode.setAttribute("role", "presentation");

      this.container = null;

      this.listenersToRemove = [];

      this.listenersToRemove.push(this.editor.addListener(s.EventType.EditorLayout, function(e) {
        var t = o.getWidth(e);
        o.domNode.style.width = t + "px";

        o.onWidth(t);
      }));
    }
    __extends(t, e);

    t.prototype.create = function() {
      var e = this;

      var t = a(this.domNode).addClass("zone-widget").addClass(this.options.className);
      t.div({
        "class": "container"
      }, function(t) {
        e.container = t.asContainer();

        e.fillContainer(t.getHTMLElement());
      });
    };

    t.prototype.getWidth = function(e) {
      "undefined" == typeof e && (e = this.editor.getLayoutInfo());

      return e.width - e.verticalScrollbarWidth;
    };

    t.prototype.onViewZoneTop = function(e) {
      this.domNode.style.top = e + "px";
    };

    t.prototype.onViewZoneHeight = function(e) {
      this.domNode.style.height = e + "px";
    };

    t.prototype.show = function(e, t) {
      if (n.isUndefinedOrNull(e.startLineNumber)) {
        this.showImpl({
          startLineNumber: e.lineNumber,
          startColumn: e.column,
          endLineNumber: e.lineNumber,
          endColumn: e.column
        }, t);
      }

      {
        this.showImpl(e, t);
      }
    };

    t.prototype.showImpl = function(e, t) {
      var n = this;

      var i = {
        lineNumber: e.startLineNumber,
        column: e.startColumn
      };
      this.domNode.style.width = this.getWidth() + "px";

      this.editor.revealPosition(i, !1, !1);
      var o = document.createElement("div");

      var r = document.createElement("div");

      var s = this.editor.getConfiguration().lineHeight;

      var a = t * s;

      var u = 0;

      var h = 0;
      if (this.options.showArrow) {
        u = Math.round(s / 3);
        a -= 2 * u;
        r = document.createElement("div");
        r.className = "zone-widget-arrow below";
        r.style.top = -u + "px";
        r.style.borderWidth = u + "px";
        r.style.left = this.editor.getOffsetForColumn(i.lineNumber, i.column) + "px";
        r.style.borderBottomColor = this.options.frameColor;
        o.appendChild(r);
      }

      if (this.options.showFrame) {
        h = Math.round(s / 9);
        a -= 2 * h;
      }

      this.editor.changeViewZones(function(e) {
        if (-1 !== n.zoneId) {
          e.removeZone(n.zoneId);
        }

        if (n.overlayWidget) {
          n.editor.removeOverlayWidget(n.overlayWidget);
          n.overlayWidget = null;
        }
        var r = new c(o, i.lineNumber, t, function(e) {
          return n.onViewZoneTop(e);
        }, function(e) {
          return n.onViewZoneHeight(e);
        });
        n.zoneId = e.addZone(r);

        n.overlayWidget = new d(l + n.zoneId, n.domNode);

        n.editor.addOverlayWidget(n.overlayWidget);
      });

      if (this.options.showFrame) {
        this.container.style({
          borderTopColor: this.options.frameColor,
          borderBottomColor: this.options.frameColor,
          borderTopWidth: h + "px",
          borderBottomWidth: h + "px"
        });
      }

      this.container.style({
        top: u + "px",
        height: a + "px",
        overflow: "hidden"
      });

      this.doLayout(a);

      this.editor.setSelection(e);
      var p = {
        lineNumber: Math.min(this.editor.getModel().getLineCount(), Math.max(1, e.endLineNumber + 1)),
        column: 1
      };
      this.editor.revealPosition(p, !1, !1);

      this.position = i;
    };

    t.prototype.dispose = function() {
      var e = this;
      this.listenersToRemove.forEach(function(e) {
        e();
      });

      this.listenersToRemove = [];

      if (this.overlayWidget) {
        this.editor.removeOverlayWidget(this.overlayWidget);
        this.overlayWidget = null;
      }

      if (-1 !== this.zoneId) {
        this.editor.changeViewZones(function(t) {
          t.removeZone(e.zoneId);

          e.zoneId = -1;
        });
      }
    };

    t.prototype.fillContainer = function() {};

    t.prototype.onWidth = function() {};

    t.prototype.doLayout = function() {};

    return t;
  }(o.EventEmitter);
  t.ZoneWidget = h;
});