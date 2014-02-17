var __extends = this.__extends || function(a, b) {
    function d() {
      this.constructor = a;
    }
    for (var c in b) {
      b.hasOwnProperty(c) && (a[c] = b[c]);
    }
    d.prototype = b.prototype;

    a.prototype = new d;
  };

define(["require", "exports", "vs/base/types", "vs/editor/core/view/viewEventHandler"], function(a, b, c, d) {
  var e = c;

  var f = d;

  var g = function(a) {
    function b(b, c) {
      a.call(this);

      this.context = b;

      this.whitespaceManager = c;

      this.domNode = document.createElement("div");

      this.domNode.className = "view-zones";

      this.domNode.style.position = "absolute";

      this.domNode.setAttribute("role", "presentation");

      this.domNode.setAttribute("aria-hidden", "true");

      this.zones = {};

      this.context.addEventHandler(this);
    }
    __extends(b, a);

    b.prototype.dispose = function() {
      this.context.removeEventHandler(this);

      this.context = null;

      this.whitespaceManager = null;

      this.zones = {};
    };

    b.prototype.onConfigurationLineHeightChanged = function() {
      var a;

      var b;

      var c;
      for (a in this.zones) {
        this.zones.hasOwnProperty(a) && (b = this.zones[a], c = this.heightInLinesToPixels(b.delegate.heightInLines),
          e.isFunction(b.delegate.onComputedHeight) && b.delegate.onComputedHeight(c), b.delegate.domNode.style.height =
          c + "px", this.whitespaceManager.changeWhitespace(parseInt(a, 10), c));
      }
      return !0;
    };

    b.prototype.onLineMappingChanged = function() {
      var a = !1;

      var b;

      var c;
      for (c in this.zones)
        if (this.zones.hasOwnProperty(c)) {
          b = this.zones[c];
          var d = this.computeWhitespaceAfterLineNumber(b.delegate);
          a = this.whitespaceManager.changeAfterLineNumberForWhitespace(parseInt(c, 10), d) || a;
        }
      return a;
    };

    b.prototype.onLayoutChanged = function(a) {
      return !0;
    };

    b.prototype.onScrollChanged = function(a) {
      return a.vertical;
    };

    b.prototype.onZonesChanged = function() {
      return !0;
    };

    b.prototype.onModelLinesDeleted = function(a) {
      return !0;
    };

    b.prototype.onModelLinesInserted = function(a) {
      return !0;
    };

    b.prototype.computeWhitespaceAfterLineNumber = function(a) {
      if (a.afterLineNumber === 0) {
        return 0;
      }
      var b;
      if (typeof a.afterColumn != "undefined") {
        b = this.context.model.validateModelPosition({
          lineNumber: a.afterLineNumber,
          column: a.afterColumn
        });
      } else {
        var c = this.context.model.validateModelPosition({
          lineNumber: a.afterLineNumber,
          column: 1
        }).lineNumber;
        b = {
          lineNumber: c,
          column: this.context.model.getLineMaxColumn(c)
        };
      }
      var d = this.context.model.convertModelPositionToViewPosition(b.lineNumber, b.column);
      return d.lineNumber;
    };

    b.prototype.addZone = function(a) {
      var b = this.heightInLinesToPixels(a.heightInLines);

      var c = this.whitespaceManager.addWhitespace(this.computeWhitespaceAfterLineNumber(a), b);

      var d = {
        whitespaceId: c,
        delegate: a,
        isVisible: !1
      };
      e.isFunction(d.delegate.onComputedHeight) && d.delegate.onComputedHeight(b);

      d.delegate.domNode.style.position = "absolute";

      d.delegate.domNode.style.height = b + "px";

      d.delegate.domNode.style.width = "100%";

      d.delegate.domNode.style.display = "none";

      this.zones[d.whitespaceId.toString()] = d;

      this.domNode.appendChild(d.delegate.domNode);

      return d.whitespaceId;
    };

    b.prototype.removeZone = function(a) {
      if (this.zones.hasOwnProperty(a.toString())) {
        var b = this.zones[a.toString()];
        delete this.zones[a.toString()];

        b.delegate.domNode.parentNode && b.delegate.domNode.parentNode.removeChild(b.delegate.domNode);

        this.whitespaceManager.removeWhitespace(b.whitespaceId);

        return !0;
      }
      return !1;
    };

    b.prototype.heightInLinesToPixels = function(a) {
      return this.context.configuration.editor.lineHeight * a;
    };

    b.prototype.prepareRender = function(a) {
      var b = this.whitespaceManager.getWhitespaceViewportData();
      return {
        data: b
      };
    };

    b.prototype.render = function(a, b) {
      var c = {};

      var d;

      var f;

      var g = !1;
      for (d = 0, f = a.data.length; d < f; d++) {
        c[a.data[d].id.toString()] = a.data[d];
        g = !0;
      }
      var h;

      var i;
      for (h in this.zones) {
        this.zones.hasOwnProperty(h) && (i = this.zones[h], c.hasOwnProperty(h) ? (i.delegate.domNode.style.top = b.getScrolledTopFromAbsoluteTop(
            c[h].verticalOffset) + "px", i.delegate.domNode.style.height = c[h].height + "px", i.isVisible || (i.delegate
            .domNode.style.display = "block", i.isVisible = !0), e.isFunction(i.delegate.onDomNodeTop) && i.delegate
          .onDomNodeTop(b.getScrolledTopFromAbsoluteTop(c[h].verticalOffset))) : (i.isVisible && (i.delegate.domNode
          .style.display = "none", i.isVisible = !1), e.isFunction(i.delegate.onDomNodeTop) && i.delegate.onDomNodeTop(
          b.getScrolledTopFromAbsoluteTop(-1e6))));
      }
      g && (this.domNode.style.width = b.scrollWidth + "px");
    };

    return b;
  }(f.ViewEventHandler);
  b.ViewZones = g;
});