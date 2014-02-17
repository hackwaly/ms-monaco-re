define("vs/editor/core/view/parts/zones/zones", ["require", "exports", "vs/base/types", "vs/editor/core/view/viewPart"],
  function(e, t, n, i) {
    var o = function(e) {
      function t(t, n) {
        e.call(this, t);

        this._whitespaceManager = n;

        this.domNode = document.createElement("div");

        this.domNode.className = "view-zones";

        this.domNode.style.position = "absolute";

        this.domNode.setAttribute("role", "presentation");

        this.domNode.setAttribute("aria-hidden", "true");

        this._zones = {};
      }
      __extends(t, e);

      t.prototype.dispose = function() {
        e.prototype.dispose.call(this);

        this._whitespaceManager = null;

        this._zones = {};
      };

      t.prototype.onConfigurationChanged = function(e) {
        var t = this;
        if (e.lineHeight) {
          var i;

          var o;

          var r;

          var s = {};
          for (i in this._zones) this._zones.hasOwnProperty(i) && (o = this._zones[i], r = this._heightInLinesToPixels(
            o.delegate.heightInLines), n.isFunction(o.delegate.onComputedHeight) && o.delegate.onComputedHeight(r), s[
            i] = r, this._whitespaceManager.changeWhitespace(parseInt(i, 10), r));
          this._requestModificationFrame(function() {
            for (i in t._zones) t._zones.hasOwnProperty(i) && s.hasOwnProperty(i) && (t._zones[i].delegate.domNode.style
              .height = s[i] + "px");
          });

          return !0;
        }
        return !1;
      };

      t.prototype.onLineMappingChanged = function() {
        var e;

        var t;

        var n = !1;
        for (t in this._zones)
          if (this._zones.hasOwnProperty(t)) {
            e = this._zones[t];
            var i = this._computeWhitespaceAfterLineNumber(e.delegate);
            n = this._whitespaceManager.changeAfterLineNumberForWhitespace(parseInt(t, 10), i) || n;
          }
        return n;
      };

      t.prototype.onLayoutChanged = function() {
        return !0;
      };

      t.prototype.onScrollChanged = function(e) {
        return e.vertical;
      };

      t.prototype.onZonesChanged = function() {
        return !0;
      };

      t.prototype.onModelLinesDeleted = function() {
        return !0;
      };

      t.prototype.onModelLinesInserted = function() {
        return !0;
      };

      t.prototype._computeWhitespaceAfterLineNumber = function(e) {
        if (0 === e.afterLineNumber) return 0;
        var t;
        if ("undefined" != typeof e.afterColumn) t = this._context.model.validateModelPosition({
          lineNumber: e.afterLineNumber,
          column: e.afterColumn
        });
        else {
          var n = this._context.model.validateModelPosition({
            lineNumber: e.afterLineNumber,
            column: 1
          }).lineNumber;
          t = {
            lineNumber: n,
            column: this._context.model.getModelLineMaxColumn(n)
          };
        }
        var i = this._context.model.convertModelPositionToViewPosition(t.lineNumber, t.column);
        return i.lineNumber;
      };

      t.prototype.addZone = function(e) {
        var t = this._heightInLinesToPixels(e.heightInLines);

        var i = this._whitespaceManager.addWhitespace(this._computeWhitespaceAfterLineNumber(e), t);

        var o = {
          whitespaceId: i,
          delegate: e,
          isVisible: !1
        };
        n.isFunction(o.delegate.onComputedHeight) && o.delegate.onComputedHeight(t);

        this._requestModificationFrame(function() {
          o.delegate.domNode.style.position = "absolute";

          o.delegate.domNode.style.height = t + "px";

          o.delegate.domNode.style.width = "100%";

          o.delegate.domNode.style.display = "none";
        });

        this._zones[o.whitespaceId.toString()] = o;

        this.domNode.appendChild(o.delegate.domNode);

        return o.whitespaceId;
      };

      t.prototype.removeZone = function(e) {
        if (this._zones.hasOwnProperty(e.toString())) {
          var t = this._zones[e.toString()];
          delete this._zones[e.toString()];

          this._whitespaceManager.removeWhitespace(t.whitespaceId);

          this._requestModificationFrame(function() {
            t.delegate.domNode.parentNode && t.delegate.domNode.parentNode.removeChild(t.delegate.domNode);
          });

          return !0;
        }
        return !1;
      };

      t.prototype.shouldSuppressMouseDownOnViewZone = function(e) {
        if (this._zones.hasOwnProperty(e.toString())) {
          var t = this._zones[e.toString()];
          return t.delegate.suppressMouseDown;
        }
        return !1;
      };

      t.prototype._heightInLinesToPixels = function(e) {
        return this._context.configuration.editor.lineHeight * e;
      };

      t.prototype._render = function(e, t) {
        var i = this;

        var o = this._whitespaceManager.getWhitespaceViewportData();
        t && (t.renderedViewZones += o.length);

        this._requestModificationFrame(function() {
          var t;

          var r;

          var s = {};

          var a = !1;
          for (t = 0, r = o.length; r > t; t++) s[o[t].id.toString()] = o[t];

          a = !0;
          var u;

          var l;
          for (u in i._zones) i._zones.hasOwnProperty(u) && (l = i._zones[u], s.hasOwnProperty(u) ? (l.delegate.domNode
            .style.top = e.getScrolledTopFromAbsoluteTop(s[u].verticalOffset) + "px", l.delegate.domNode.style.height =
            s[u].height + "px", l.isVisible || (l.delegate.domNode.style.display = "block", l.isVisible = !0), n.isFunction(
              l.delegate.onDomNodeTop) && l.delegate.onDomNodeTop(e.getScrolledTopFromAbsoluteTop(s[u].verticalOffset))
          ) : (l.isVisible && (l.delegate.domNode.style.display = "none", l.isVisible = !1), n.isFunction(l.delegate
            .onDomNodeTop) && l.delegate.onDomNodeTop(e.getScrolledTopFromAbsoluteTop(-1e6))));
          a && (i.domNode.style.width = e.scrollWidth + "px");
        });
      };

      return t;
    }(i.ViewPart);
    t.ViewZones = o;
  });