var __extends = this.__extends || function(a, b) {
    function d() {
      this.constructor = a;
    }
    for (var c in b) {
      if (b.hasOwnProperty(c)) {
        a[c] = b[c];
      }
    }
    d.prototype = b.prototype;

    a.prototype = new d;
  };

define(["require", "exports", "vs/base/types", "vs/base/objects", "vs/base/eventEmitter", "vs/base/dom/builder",
  "vs/editor/core/constants", "vs/css!./zoneWidget"
], function(a, b, c, d, e, f, g) {
  var h = c;

  var i = d;

  var j = e;

  var k = f;

  var l = g;

  var m = {
    showAbove: !1,
    showFrame: !0,
    frameColor: "",
    className: ""
  };

  var n = "vs.editor.contrib.zoneWidget";

  var o = function() {
    function a(a, b, c, d, e) {
      this.domNode = a;

      this.afterLineNumber = b;

      this.heightInLines = c;

      this._onDomNodeTop = d;

      this._onComputedHeight = e;
    }
    a.prototype.onDomNodeTop = function(a) {
      this._onDomNodeTop(a);
    };

    a.prototype.onComputedHeight = function(a) {
      this._onComputedHeight(a);
    };

    return a;
  }();

  var p = function() {
    function a(a, b) {
      this._id = a;

      this._domNode = b;
    }
    a.prototype.getId = function() {
      return this._id;
    };

    a.prototype.getDomNode = function() {
      return this._domNode;
    };

    a.prototype.getPosition = function() {
      return null;
    };

    return a;
  }();

  var q = function(a) {
    function b(b, c) {
      if (typeof c == "undefined") {
        c = {};
      }
      var d = this;
      a.call(this);

      this.editor = b;

      this.options = i.mixin(i.clone(m), c);

      this.zoneId = -1;

      this.overlayWidget = null;

      this.lastView = null;

      this.domNode = document.createElement("div");

      this.container = null;

      this.listenersToRemove = [];

      this.listenersToRemove.push(this.editor.addListener(l.EventType.EditorLayout, function(a) {
        var b = d.getWidth(a);
        d.domNode.style.width = b + "px";

        d.onWidth(b);
      }));
    }
    __extends(b, a);

    b.prototype.create = function() {
      var a = this;

      var b = k.Build.withElement(this.domNode).addClass("zone-widget").addClass(this.options.className);
      b.div({
        "class": "container"
      }, function(b) {
        a.container = b.asContainer();

        a.fillContainer(b.getHTMLElement());
      });
    };

    b.prototype.getWidth = function(a) {
      typeof a == "undefined" && (a = this.editor.getLayoutInfo());

      return a.width - a.verticalScrollbarWidth;
    };

    b.prototype.onViewZoneTop = function(a) {
      this.domNode.style.top = a + "px";
    };

    b.prototype.onViewZoneHeight = function(a) {
      this.domNode.style.height = a + "px";
    };

    b.prototype.createArrow = function(a, b, c) {
      var d = document.createElement("div");

      var e = this.editor.getOffsetForColumn(a.lineNumber, a.column);
      d.style.borderWidth = c + "px";

      d.style.left = e + "px";

      this.options.showAbove ? (d.className = "zone-widget-arrow above", d.style.top = 4 + c + b + "px", d.style.borderTopColor =
        this.options.frameColor) : (d.className = "zone-widget-arrow below", d.style.top = -c + "px", d.style.borderBottomColor =
        this.options.frameColor);

      return d;
    };

    b.prototype.show = function(a, b) {
      if (h.isUndefinedOrNull(a.startLineNumber)) {
        this.showImpl({
          startLineNumber: a.lineNumber,
          startColumn: a.column,
          endLineNumber: a.lineNumber,
          endColumn: a.column
        }, b);
      } else {
        this.showImpl(a, b);
      }
    };

    b.prototype.showImpl = function(a, b) {
      var c = this;
      this.position = {
        lineNumber: a.startLineNumber,
        column: a.startColumn
      };

      this.domNode.style.width = this.getWidth() + "px";

      this.editor.revealPosition(this.position, !1, !1);
      var d = document.createElement("div");

      var e = this.editor.getConfiguration().lineHeight;

      var f;
      if (this.options.showFrame) {
        var g = Math.round(e / 3);

        var h = Math.max(0, e - 2 * g);
        f = (b - 1) * e + h - 4;

        d.appendChild(this.createArrow(this.position, f, g));
      } else {
        f = b * e;
      }
      this.editor.changeViewZones(function(a) {
        if (c.zoneId !== -1) {
          a.removeZone(c.zoneId);
        }

        if (c.overlayWidget) {
          c.editor.removeOverlayWidget(c.overlayWidget);
          c.overlayWidget = null;
        }
        var e = new o(d, c.position.lineNumber + (c.options.showAbove ? -1 : 0), b, function(a) {
          return c.onViewZoneTop(a);
        }, function(a) {
          return c.onViewZoneHeight(a);
        });
        c.zoneId = a.addZone(e);

        c.overlayWidget = new p(n + c.zoneId, c.domNode);

        c.editor.addOverlayWidget(c.overlayWidget);
      });

      if (this.options.showFrame) {
        this.container.style({
          borderTopColor: this.options.frameColor,
          borderBottomColor: this.options.frameColor,
          top: g + "px",
          height: f + "px",
          overflow: "hidden"
        });
      } else {
        this.container.style({
          borderTopColor: this.options.frameColor,
          borderBottomColor: this.options.frameColor,
          borderTopWidth: 0,
          borderBottomWidth: 0,
          height: f + "px",
          overflow: "hidden"
        });
      }

      this.doLayout(f);

      this.editor.setSelection(a);
      var i = {
        lineNumber: Math.min(this.editor.getModel().getLineCount(), Math.max(1, a.endLineNumber + (this.options.showAbove ? -
          1 : 1))),
        column: 1
      };
      this.editor.revealPosition(i, !1, !1);
    };

    b.prototype.dispose = function() {
      var a = this;
      this.position = null;

      if (this.overlayWidget) {
        this.editor.removeOverlayWidget(this.overlayWidget);
        this.overlayWidget = null;
      }

      if (this.zoneId !== -1) {
        this.editor.changeViewZones(function(b) {
          b.removeZone(a.zoneId);

          a.zoneId = -1;
        });
      }
    };

    b.prototype.fillContainer = function(a) {};

    b.prototype.onWidth = function(a) {};

    b.prototype.doLayout = function(a) {};

    return b;
  }(j.EventEmitter);
  b.ZoneWidget = q;
});