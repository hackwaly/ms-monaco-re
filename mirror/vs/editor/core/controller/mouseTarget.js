define("vs/editor/core/controller/mouseTarget", ["require", "exports", "vs/editor/core/position",
  "vs/editor/core/range", "vs/editor/core/view/viewContext", "vs/editor/editor"
], function(e, t, n, i, o) {
  var r = function() {
    function e(e, t, n, o, r) {
      "undefined" == typeof n && (n = null);

      "undefined" == typeof o && (o = null);

      "undefined" == typeof r && (r = null);

      this.element = e;

      this.type = t;

      this.position = n;

      !o && n && (o = new i.Range(n.lineNumber, n.column, n.lineNumber, n.column));

      this.range = o;

      this.detail = r;
    }
    e.prototype._typeToString = function() {
      return 1 === this.type ? "TEXTAREA" : 2 === this.type ? "GUTTER_GLYPH_MARGIN" : 3 === this.type ?
        "GUTTER_LINE_NUMBERS" : 4 === this.type ? "GUTTER_LINE_DECORATIONS" : 5 === this.type ? "GUTTER_VIEW_ZONE" :
        6 === this.type ? "CONTENT_TEXT" : 7 === this.type ? "CONTENT_EMPTY" : 8 === this.type ? "CONTENT_VIEW_ZONE" :
        9 === this.type ? "CONTENT_WIDGET" : 10 === this.type ? "OVERVIEW_RULER" : 11 === this.type ? "SCROLLBAR" :
        12 === this.type ? "OVERLAY_WIDGET" : "UNKNOWN";
    };

    e.prototype.toString = function() {
      return this._typeToString() + ": " + this.position + " - " + this.range + " - " + this.detail;
    };

    return e;
  }();

  var s = function() {
    function e(e) {
      return "[^/]*" + e + "[^/]*";
    }

    function t() {
      return "[^/]+";
    }

    function n() {
      for (var e = [], t = 0; t < arguments.length - 0; t++) e[t] = arguments[t + 0];
      var n = !1;
      "$" === e[e.length - 1] && (n = !0, e.pop());

      return new RegExp(i + e.join("\\/") + (n ? "$" : ""));
    }
    var i = "^" + o.ClassNames.OVERFLOW_GUARD + "\\/";
    return {
      IS_TEXTAREA_COVER: n(e(o.ClassNames.TEXTAREA_COVER), "$"),
      IS_TEXTAREA: n(o.ClassNames.TEXTAREA, "$"),
      IS_VIEW_LINES: n(t(), t(), o.ClassNames.VIEW_LINES, "$"),
      IS_CHILD_OF_VIEW_LINES: n(t(), t(), o.ClassNames.VIEW_LINES),
      IS_CHILD_OF_SCROLLABLE_ELEMENT: n(e(o.ClassNames.SCROLLABLE_ELEMENT)),
      IS_CHILD_OF_CONTENT_WIDGETS: n(t(), t(), o.ClassNames.CONTENT_WIDGETS),
      IS_CHILD_OF_OVERLAY_WIDGETS: n(o.ClassNames.OVERLAY_WIDGETS),
      IS_CHILD_OF_LINES_DECORATIONS: n(o.ClassNames.LINES_DECORATIONS),
      IS_CHILD_OF_LINE_NUMBERS: n(t(), t(), o.ClassNames.LINE_NUMBERS),
      IS_CHILD_OF_GLYPH_MARGIN: n(t(), t(), o.ClassNames.GLYPH_MARGIN)
    };
  }();

  var a = function() {
    function e(e, t) {
      this.context = e;

      this.viewHelper = t;
    }
    e.prototype.getClassNamePathTo = function(e, t) {
      for (var n, i = []; e && e !== document.body && e !== t;) e.nodeType === e.ELEMENT_NODE && (n = e.className, n &&
        i.unshift(n));

      e = e.parentNode;
      return i.join("/");
    };

    e.prototype.createMouseTarget = function(e, t, n) {
      var i = Math.max(0, this.viewHelper.getScrollTop() + (t.posy - e.top));

      var o = this.viewHelper.getScrollLeft() + (t.posx - e.left);

      var a = t.target;

      var u = this.getClassNamePathTo(a, this.viewHelper.viewDomNode);

      var l = a.hasAttribute && a.hasAttribute("lineNumber") ? a.getAttribute("lineNumber") : null;

      var c = a.hasAttribute && a.hasAttribute("column") ? a.getAttribute("column") : null;
      if (l && c) return this.createMouseTargetFromViewCursor(a, parseInt(l, 10), parseInt(c, 10));
      if (s.IS_CHILD_OF_CONTENT_WIDGETS.test(u)) return this.createMouseTargetFromContentWidgetsChild(a);
      if (s.IS_CHILD_OF_OVERLAY_WIDGETS.test(u)) return this.createMouseTargetFromOverlayWidgetsChild(a);
      if (s.IS_TEXTAREA_COVER.test(u)) return this.context.configuration.editor.glyphMargin ? this.createMouseTargetFromGlyphMargin(
        a, i) : this.context.configuration.editor.lineNumbers ? this.createMouseTargetFromLineNumbers(a, i) : this.createMouseTargetFromLinesDecorationsChild(
        a, i);
      if (s.IS_TEXTAREA.test(u)) return new r(a, 1);
      if (s.IS_VIEW_LINES.test(u)) return this.createMouseTargetFromViewLines(a, i);
      if (!n || s.IS_CHILD_OF_VIEW_LINES.test(u)) {
        var d = this._doHitTest(e, t);
        if (d.position) return this.createMouseTargetFromHitTestPosition(a, d.position.lineNumber, d.position.column,
          o);
        d.hitTarget && (a = d.hitTarget, u = this.getClassNamePathTo(a, this.viewHelper.viewDomNode));
      }
      return s.IS_CHILD_OF_SCROLLABLE_ELEMENT.test(u) ? this.createMouseTargetFromScrollbar(a, i) : s.IS_CHILD_OF_LINES_DECORATIONS
        .test(u) ? this.createMouseTargetFromLinesDecorationsChild(a, i) : s.IS_CHILD_OF_LINE_NUMBERS.test(u) ? this.createMouseTargetFromLineNumbers(
          a, i) : s.IS_CHILD_OF_GLYPH_MARGIN.test(u) ? this.createMouseTargetFromGlyphMargin(a, i) : this.createMouseTargetFromUnknownTarget(
          a);
    };

    e.prototype._isChild = function(e, t, n) {
      for (; e && e !== document.body;) {
        if (e === t) return !0;
        if (e === n) return !1;
        e = e.parentNode;
      }
      return !1;
    };

    e.prototype._findAttribute = function(e, t, n) {
      for (; e && e !== document.body;) {
        if (e.hasAttribute(t)) return e.getAttribute(t);
        if (e === n) return null;
        e = e.parentNode;
      }
      return null;
    };

    e.prototype._doHitTestWithCaretRangeFromPoint = function(e, t) {
      var n = null;

      var i = null;

      var r = t.posx - document.body.scrollLeft - document.documentElement.scrollLeft;

      var s = t.posy - document.body.scrollTop - document.documentElement.scrollTop;

      var a = document.caretRangeFromPoint(r, s);

      var u = a ? a.startContainer : null;

      var l = u ? u.parentNode : null;

      var c = l ? l.parentNode : null;

      var d = c ? c.parentNode : null;

      var h = d && d.nodeType === d.ELEMENT_NODE ? d.className : "";
      h === o.ClassNames.VIEW_LINE ? n = this.viewHelper.getPositionFromDOMInfo(a.startContainer.parentNode, a.startOffset) :
        i = l;

      a && a.detach();

      return {
        position: n,
        hitTarget: i
      };
    };

    e.prototype._doHitTestWithCaretPositionFromPoint = function(e) {
      var t = null;

      var n = null;

      var i = e.posx - document.body.scrollLeft - document.documentElement.scrollLeft;

      var o = e.posy - document.body.scrollTop - document.documentElement.scrollTop;

      var r = document.caretPositionFromPoint(i, o);

      var s = document.createRange();
      s.setStart(r.offsetNode, r.offset);

      s.collapse(!0);

      t = this.viewHelper.getPositionFromDOMInfo(s.startContainer.parentNode, s.startOffset);

      s.detach();

      return {
        position: t,
        hitTarget: n
      };
    };

    e.prototype._doHitTestWithMoveToPoint = function(e) {
      var t = null;

      var n = null;

      var i = document.body.createTextRange();
      try {
        var r = e.posx - document.body.scrollLeft - document.documentElement.scrollLeft;

        var s = e.posy - document.body.scrollTop - document.documentElement.scrollTop;
        i.moveToPoint(r, s);
      } catch (a) {
        return {
          position: null,
          hitTarget: null
        };
      }
      i.collapse(!0);
      var u = i ? i.parentElement() : null;

      var l = u ? u.parentNode : null;

      var c = l ? l.parentNode : null;

      var d = c && c.nodeType === c.ELEMENT_NODE ? c.className : "";
      if (d === o.ClassNames.VIEW_LINE) {
        var h = i.duplicate();
        h.moveToElementText(u);

        h.setEndPoint("EndToStart", i);

        t = this.viewHelper.getPositionFromDOMInfo(u, h.text.length);

        h.moveToElementText(this.viewHelper.viewDomNode);
      } else n = u;
      i.moveToElementText(this.viewHelper.viewDomNode);

      return {
        position: t,
        hitTarget: n
      };
    };

    e.prototype._doHitTest = function(e, t) {
      return document.caretRangeFromPoint ? this._doHitTestWithCaretRangeFromPoint(e, t) : document.caretPositionFromPoint ?
        this._doHitTestWithCaretPositionFromPoint(t) : document.body.createTextRange ? this._doHitTestWithMoveToPoint(
          t) : {
          position: null,
          hitTarget: null
      };
    };

    e.prototype._getZoneAtCoord = function(e) {
      var t = this.viewHelper.getWhitespaceAtVerticalOffset(e);
      if (t) {
        var i;

        var o;

        var r = t.verticalOffset + t.height / 2;

        var s = this.context.model.getLineCount();
        t.afterLineNumber === s || r > e && t.afterLineNumber > 0 ? (i = t.afterLineNumber, o = this.context.model.getLineMaxColumn(
          i)) : (i = t.afterLineNumber + 1, o = 1);
        var a = new n.Position(i, o);
        return {
          viewZoneId: t.id,
          position: a
        };
      }
      return null;
    };

    e.prototype._getFullLineRangeAtCoord = function(e) {
      var t = this.viewHelper.getLineNumberAtVerticalOffset(e);

      var n = this.context.model.getLineMaxColumn(t);
      return new i.Range(t, 1, t, n);
    };

    e.prototype.createMouseTargetFromViewCursor = function(e, t, i) {
      return new r(e, 6, new n.Position(t, i));
    };

    e.prototype.createMouseTargetFromViewLines = function(e, t) {
      var i = this._getZoneAtCoord(t);
      if (i) return new r(e, 8, i.position, null, i.viewZoneId);
      var o = this.context.model.getLineCount();

      var s = this.context.model.getLineMaxColumn(o);
      return new r(e, 7, new n.Position(o, s));
    };

    e.prototype.createMouseTargetFromHitTestPosition = function(e, t, o, s) {
      var a = new n.Position(t, o);

      var u = this.viewHelper.getLineWidth(t);
      if (s > u) return new r(e, 7, a);
      var l = this.viewHelper.visibleRangeForPosition2(t, o).left;
      if (s === l) return new r(e, 6, a);
      var c;
      if (o > 1) {
        var d = this.viewHelper.visibleRangeForPosition2(t, o).left;
        if (c = !1, c = c || s > d && l > s, c = c || s > l && d > s) {
          var h = new i.Range(t, o, t, o - 1);
          return new r(e, 6, a, h);
        }
      }
      var p = this.context.model.getLineMaxColumn(t);
      if (p > o) {
        var f = this.viewHelper.visibleRangeForPosition2(t, o + 1);
        if (f) {
          var g = this.viewHelper.visibleRangeForPosition2(t, o + 1).left;
          if (c = !1, c = c || s > l && g > s, c = c || s > g && l > s) {
            var h = new i.Range(t, o, t, o + 1);
            return new r(e, 6, a, h);
          }
        }
      }
      return new r(e, 6, a);
    };

    e.prototype.createMouseTargetFromContentWidgetsChild = function(e) {
      var t = this._findAttribute(e, "widgetId", this.viewHelper.viewDomNode);
      return t ? new r(e, 9, null, null, t) : new r(e, 0);
    };

    e.prototype.createMouseTargetFromOverlayWidgetsChild = function(e) {
      var t = this._findAttribute(e, "widgetId", this.viewHelper.viewDomNode);
      return t ? new r(e, 12, null, null, t) : new r(e, 0);
    };

    e.prototype.createMouseTargetFromLinesDecorationsChild = function(e, t) {
      var i = this._getZoneAtCoord(t);
      if (i) return new r(e, 5, i.position, null, i.viewZoneId);
      var o = this._getFullLineRangeAtCoord(t);
      return new r(e, 4, new n.Position(o.startLineNumber, 1), o);
    };

    e.prototype.createMouseTargetFromLineNumbers = function(e, t) {
      var i = this._getZoneAtCoord(t);
      if (i) return new r(e, 5, i.position, null, i.viewZoneId);
      var o = this._getFullLineRangeAtCoord(t);
      return new r(e, 3, new n.Position(o.startLineNumber, 1), o);
    };

    e.prototype.createMouseTargetFromGlyphMargin = function(e, t) {
      var i = this._getZoneAtCoord(t);
      if (i) return new r(e, 5, i.position, null, i.viewZoneId);
      var o = this._getFullLineRangeAtCoord(t);
      return new r(e, 2, new n.Position(o.startLineNumber, 1), o);
    };

    e.prototype.createMouseTargetFromScrollbar = function(e) {
      return new r(e, 11);
    };

    e.prototype.createMouseTargetFromUnknownTarget = function(e) {
      var t = this._isChild(e, this.viewHelper.viewDomNode, this.viewHelper.viewDomNode);

      var n = null;
      t && (n = this._findAttribute(e, "widgetId", this.viewHelper.viewDomNode));

      return n ? new r(e, 12, null, null, n) : new r(e, 0);
    };

    return e;
  }();
  t.MouseTargetFactory = a;
});