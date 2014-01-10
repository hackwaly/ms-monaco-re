define(["require", "exports", "vs/editor/core/position", "vs/editor/core/range", "vs/editor/core/view/viewContext",
  "vs/editor/editor"
], function(a, b, c, d, e, f) {
  var g = c,
    h = d,
    i = e,
    j = f,
    k = function() {
      function a(a, b, c, d, e) {
        typeof c == "undefined" && (c = null), typeof d == "undefined" && (d = null), typeof e == "undefined" && (e =
          null), this.element = a, this.type = b, this.position = c, !d && c && (d = new h.Range(c.lineNumber, c.column,
          c.lineNumber, c.column)), this.range = d, this.detail = e
      }
      return a.prototype._typeToString = function() {
        return this.type === j.MouseTargetType.TEXTAREA ? "TEXTAREA" : this.type === j.MouseTargetType.GUTTER_GLYPH_MARGIN ?
          "GUTTER_GLYPH_MARGIN" : this.type === j.MouseTargetType.GUTTER_LINE_NUMBERS ? "GUTTER_LINE_NUMBERS" : this.type ===
          j.MouseTargetType.GUTTER_LINE_DECORATIONS ? "GUTTER_LINE_DECORATIONS" : this.type === j.MouseTargetType.GUTTER_VIEW_ZONE ?
          "GUTTER_VIEW_ZONE" : this.type === j.MouseTargetType.CONTENT_TEXT ? "CONTENT_TEXT" : this.type === j.MouseTargetType
          .CONTENT_EMPTY ? "CONTENT_EMPTY" : this.type === j.MouseTargetType.CONTENT_VIEW_ZONE ? "CONTENT_VIEW_ZONE" :
          this.type === j.MouseTargetType.CONTENT_WIDGET ? "CONTENT_WIDGET" : this.type === j.MouseTargetType.OVERVIEW_RULER ?
          "OVERVIEW_RULER" : this.type === j.MouseTargetType.SCROLLBAR ? "SCROLLBAR" : this.type === j.MouseTargetType
          .OVERLAY_WIDGET ? "OVERLAY_WIDGET" : "UNKNOWN"
      }, a.prototype.toString = function() {
        return this._typeToString() + ": " + this.position + " - " + this.range + " - " + this.detail
      }, a
    }(),
    l = {
      IS_TEXTAREA_COVER: new RegExp("^[^/]*" + i.ClassNames.TEXTAREA_COVER + "[^/]*$"),
      IS_TEXTAREA: new RegExp("^" + i.ClassNames.TEXTAREA + "$"),
      IS_VIEW_LINES: new RegExp("^[^/]+/[^/]+/" + i.ClassNames.VIEW_LINES + "$"),
      IS_CHILD_OF_VIEW_LINES: new RegExp("^[^/]+/[^/]+/" + i.ClassNames.VIEW_LINES),
      IS_CHILD_OF_SCROLLABLE_ELEMENT: new RegExp("^[^/]*" + i.ClassNames.SCROLLABLE_ELEMENT),
      IS_CHILD_OF_CONTENT_WIDGETS: new RegExp("^[^/]+/[^/]+/" + i.ClassNames.CONTENT_WIDGETS),
      IS_CHILD_OF_OVERLAY_WIDGETS: new RegExp("^" + i.ClassNames.OVERLAY_WIDGETS),
      IS_CHILD_OF_LINES_DECORATIONS: new RegExp(i.ClassNames.LINES_DECORATIONS),
      IS_CHILD_OF_LINE_NUMBERS: new RegExp("^[^/]+/[^/]+/" + i.ClassNames.LINE_NUMBERS),
      IS_CHILD_OF_GLYPH_MARGIN: new RegExp("^[^/]+/[^/]+/" + i.ClassNames.GLYPH_MARGIN)
    }, m = function() {
      function a(a, b) {
        this.context = a, this.viewHelper = b
      }
      return a.prototype.getClassNamePathTo = function(a, b) {
        var c = [],
          d;
        while (a && a !== document.body) {
          if (a === b) break;
          a.nodeType === a.ELEMENT_NODE && (d = a.className, d && c.unshift(d)), a = a.parentNode
        }
        return c.join("/")
      }, a.prototype.createMouseTarget = function(a, b, c) {
        var d = Math.max(0, this.viewHelper.getScrollTop() + (b.posy - a.top)),
          e = this.viewHelper.getScrollLeft() + (b.posx - a.left),
          f = b.target,
          g = this.getClassNamePathTo(f, this.viewHelper.viewDomNode),
          h = f.hasAttribute("lineNumber") ? f.getAttribute("lineNumber") : null,
          i = f.hasAttribute("column") ? f.getAttribute("column") : null;
        if (h && i) return this.createMouseTargetFromViewCursor(f, parseInt(h, 10), parseInt(i, 10));
        if (l.IS_CHILD_OF_CONTENT_WIDGETS.test(g)) return this.createMouseTargetFromContentWidgetsChild(f);
        if (l.IS_CHILD_OF_OVERLAY_WIDGETS.test(g)) return this.createMouseTargetFromOverlayWidgetsChild(f);
        if (l.IS_TEXTAREA_COVER.test(g)) return this.context.configuration.editor.glyphMargin ? this.createMouseTargetFromGlyphMargin(
          f, d) : this.context.configuration.editor.lineNumbers ? this.createMouseTargetFromLineNumbers(f, d) : this.createMouseTargetFromLinesDecorationsChild(
          f, d);
        if (l.IS_TEXTAREA.test(g)) return new k(f, j.MouseTargetType.TEXTAREA);
        if (l.IS_VIEW_LINES.test(g)) return this.createMouseTargetFromViewLines(f, d);
        if (!c || l.IS_CHILD_OF_VIEW_LINES.test(g)) {
          var m = this._doHitTest(a, b);
          if (m.position) return this.createMouseTargetFromHitTestPosition(f, m.position.lineNumber, m.position.column,
            e);
          m.hitTarget && (f = m.hitTarget, g = this.getClassNamePathTo(f, this.viewHelper.viewDomNode))
        }
        return l.IS_CHILD_OF_SCROLLABLE_ELEMENT.test(g) ? this.createMouseTargetFromScrollbar(f, d) : l.IS_CHILD_OF_LINES_DECORATIONS
          .test(g) ? this.createMouseTargetFromLinesDecorationsChild(f, d) : l.IS_CHILD_OF_LINE_NUMBERS.test(g) ?
          this.createMouseTargetFromLineNumbers(f, d) : l.IS_CHILD_OF_GLYPH_MARGIN.test(g) ? this.createMouseTargetFromGlyphMargin(
            f, d) : this.createMouseTargetFromUnknownTarget(f)
      }, a.prototype._isChild = function(a, b, c) {
        while (a && a !== document.body) {
          if (a === b) return !0;
          if (a === c) return !1;
          a = a.parentNode
        }
        return !1
      }, a.prototype._findAttribute = function(a, b, c) {
        while (a && a !== document.body) {
          if (a.hasAttribute(b)) return a.getAttribute(b);
          if (a === c) return null;
          a = a.parentNode
        }
        return null
      }, a.prototype._doHitTestWithCaretRangeFromPoint = function(a, b) {
        var c = null,
          d = null,
          e = b.posx - document.body.scrollLeft - document.documentElement.scrollLeft,
          f = b.posy - document.body.scrollTop - document.documentElement.scrollTop,
          g = document.caretRangeFromPoint(e, f),
          h = g ? g.startContainer : null,
          j = h ? h.parentNode : null,
          k = j ? j.parentNode : null,
          l = k ? k.parentNode : null,
          m = l && l.nodeType === l.ELEMENT_NODE ? l.className : "";
        return m === i.ClassNames.VIEW_LINE ? c = this.viewHelper.getPositionFromDOMInfo(g.startContainer.parentNode,
          g.startOffset) : d = j, g.detach(), {
          position: c,
          hitTarget: d
        }
      }, a.prototype._doHitTestWithRangeProperties = function(a) {
        var b = null,
          c = null,
          d, e;
        a.browserEvent.rangeParent ? (d = a.browserEvent.rangeParent, e = a.browserEvent.rangeOffset) : (d = a.extraData
          .rangeParent, e = a.extraData.rangeOffset);
        var f = document.createRange();
        return f.setStart(d, e), f.collapse(!0), b = this.viewHelper.getPositionFromDOMInfo(f.startContainer.parentNode,
          f.startOffset), f.detach(), {
          position: b,
          hitTarget: c
        }
      }, a.prototype._doHitTestWithMoveToPoint = function(a) {
        var b = null,
          c = null,
          d = document.body.createTextRange();
        try {
          var e = a.posx - document.body.scrollLeft - document.documentElement.scrollLeft,
            f = a.posy - document.body.scrollTop - document.documentElement.scrollTop;
          d.moveToPoint(e, f)
        } catch (g) {
          return {
            position: null,
            hitTarget: null
          }
        }
        d.collapse(!0);
        var h = d ? d.parentElement() : null,
          j = h ? h.parentNode : null,
          k = j ? j.parentNode : null,
          l = k && k.nodeType === k.ELEMENT_NODE ? k.className : "";
        if (l === i.ClassNames.VIEW_LINE) {
          var m = d.duplicate();
          m.moveToElementText(h), m.setEndPoint("EndToStart", d), b = this.viewHelper.getPositionFromDOMInfo(h, m.text
            .length), m.moveToElementText(this.viewHelper.viewDomNode)
        } else c = h;
        return d.moveToElementText(this.viewHelper.viewDomNode), {
          position: b,
          hitTarget: c
        }
      }, a.prototype._doHitTest = function(a, b) {
        return document.caretRangeFromPoint ? this._doHitTestWithCaretRangeFromPoint(a, b) : b.extraData || b.browserEvent
          .rangeParent ? this._doHitTestWithRangeProperties(b) : document.body.createTextRange ? this._doHitTestWithMoveToPoint(
            b) : {
            position: null,
            hitTarget: null
        }
      }, a.prototype._getZoneAtCoord = function(a) {
        var b = this.viewHelper.getWhitespaceAtVerticalOffset(a);
        if (b) {
          var c = b.verticalOffset + b.height / 2,
            d, e, f = this.context.model.getLineCount();
          b.afterLineNumber === f || a < c && b.afterLineNumber > 0 ? (d = b.afterLineNumber, e = this.context.model.getLineMaxColumn(
            d)) : (d = b.afterLineNumber + 1, e = 1);
          var h = new g.Position(d, e);
          return {
            viewZoneId: b.id,
            position: h
          }
        }
        return null
      }, a.prototype._getFullLineRangeAtCoord = function(a) {
        var b = this.viewHelper.getLineNumberAtVerticalOffset(a),
          c = this.context.model.getLineMaxColumn(b);
        return new h.Range(b, 1, b, c)
      }, a.prototype.createMouseTargetFromViewCursor = function(a, b, c) {
        return new k(a, j.MouseTargetType.CONTENT_TEXT, new g.Position(b, c))
      }, a.prototype.createMouseTargetFromViewLines = function(a, b) {
        var c = this._getZoneAtCoord(b);
        if (c) return new k(a, j.MouseTargetType.CONTENT_VIEW_ZONE, c.position, null, c.viewZoneId);
        var d = this.context.model.getLineCount(),
          e = this.context.model.getLineMaxColumn(d);
        return new k(a, j.MouseTargetType.CONTENT_EMPTY, new g.Position(d, e))
      }, a.prototype.createMouseTargetFromHitTestPosition = function(a, b, c, d) {
        var e = new g.Position(b, c),
          f = this.viewHelper.getLineWidth(b);
        if (d > f) return new k(a, j.MouseTargetType.CONTENT_EMPTY, e);
        var i = this.viewHelper.visibleRangeForPosition2(b, c).left;
        if (d === i) return new k(a, j.MouseTargetType.CONTENT_TEXT, e);
        var l;
        if (c > 1) {
          var m = this.viewHelper.visibleRangeForPosition2(b, c).left;
          l = !1, l = l || m < d && d < i, l = l || i < d && d < m;
          if (l) {
            var n = new h.Range(b, c, b, c - 1);
            return new k(a, j.MouseTargetType.CONTENT_TEXT, e, n)
          }
        }
        var o = this.context.model.getLineMaxColumn(b);
        if (c < o) {
          var p = this.viewHelper.visibleRangeForPosition2(b, c + 1);
          if (p) {
            var q = this.viewHelper.visibleRangeForPosition2(b, c + 1).left;
            l = !1, l = l || i < d && d < q, l = l || q < d && d < i;
            if (l) {
              var n = new h.Range(b, c, b, c + 1);
              return new k(a, j.MouseTargetType.CONTENT_TEXT, e, n)
            }
          }
        }
        return new k(a, j.MouseTargetType.CONTENT_TEXT, e)
      }, a.prototype.createMouseTargetFromContentWidgetsChild = function(a) {
        var b = this._findAttribute(a, "widgetId", this.viewHelper.viewDomNode);
        return b ? new k(a, j.MouseTargetType.CONTENT_WIDGET, null, null, b) : new k(a, j.MouseTargetType.UNKNOWN)
      }, a.prototype.createMouseTargetFromOverlayWidgetsChild = function(a) {
        var b = this._findAttribute(a, "widgetId", this.viewHelper.viewDomNode);
        return b ? new k(a, j.MouseTargetType.OVERLAY_WIDGET, null, null, b) : new k(a, j.MouseTargetType.UNKNOWN)
      }, a.prototype.createMouseTargetFromLinesDecorationsChild = function(a, b) {
        var c = this._getZoneAtCoord(b);
        if (c) return new k(a, j.MouseTargetType.GUTTER_VIEW_ZONE, c.position, null, c.viewZoneId);
        var d = this._getFullLineRangeAtCoord(b);
        return new k(a, j.MouseTargetType.GUTTER_LINE_DECORATIONS, new g.Position(d.startLineNumber, 1), d)
      }, a.prototype.createMouseTargetFromLineNumbers = function(a, b) {
        var c = this._getZoneAtCoord(b);
        if (c) return new k(a, j.MouseTargetType.GUTTER_VIEW_ZONE, c.position, null, c.viewZoneId);
        var d = this._getFullLineRangeAtCoord(b);
        return new k(a, j.MouseTargetType.GUTTER_LINE_NUMBERS, new g.Position(d.startLineNumber, 1), d)
      }, a.prototype.createMouseTargetFromGlyphMargin = function(a, b) {
        var c = this._getZoneAtCoord(b);
        if (c) return new k(a, j.MouseTargetType.GUTTER_VIEW_ZONE, c.position, null, c.viewZoneId);
        var d = this._getFullLineRangeAtCoord(b);
        return new k(a, j.MouseTargetType.GUTTER_GLYPH_MARGIN, new g.Position(d.startLineNumber, 1), d)
      }, a.prototype.createMouseTargetFromScrollbar = function(a, b) {
        return new k(a, j.MouseTargetType.SCROLLBAR)
      }, a.prototype.createMouseTargetFromUnknownTarget = function(a) {
        var b = this._isChild(a, this.viewHelper.viewDomNode, this.viewHelper.viewDomNode),
          c = null;
        return b && (c = this._findAttribute(a, "widgetId", this.viewHelper.viewDomNode)), c ? new k(a, j.MouseTargetType
          .OVERLAY_WIDGET, null, null, c) : new k(a, j.MouseTargetType.UNKNOWN)
      }, a
    }();
  b.MouseTargetFactory = m
})