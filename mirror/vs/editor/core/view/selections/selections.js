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

define(["require", "exports", "vs/editor/core/view/viewEventHandler", "vs/css!./selections"], function(a, b, c) {
  var d = c;

  var e;
  (function(a) {
    a[a.EXTERN = 0] = "EXTERN";

    a[a.INTERN = 1] = "INTERN";

    a[a.FLAT = 2] = "FLAT";
  })(e || (e = {}));
  var f = function(a) {
    function b(b) {
      a.call(this);

      this.context = b;

      this.selections = [];

      this.contentLeft = 0;

      this.previousRender = null;

      this.horizontalScrollChanged = !1;

      this.context.addEventHandler(this);
    }
    __extends(b, a);

    b.prototype.dispose = function() {
      this.context.removeEventHandler(this);

      this.context = null;

      this.selections = null;

      this.previousRender = null;
    };

    b.prototype.onModelFlushed = function() {
      return !0;
    };

    b.prototype.onModelDecorationsChanged = function(a) {
      return !1;
    };

    b.prototype.onModelLinesDeleted = function(a) {
      return !0;
    };

    b.prototype.onModelLineChanged = function(a) {
      return !0;
    };

    b.prototype.onModelLinesInserted = function(a) {
      return !0;
    };

    b.prototype.onCursorPositionChanged = function(a) {
      return !1;
    };

    b.prototype.onCursorSelectionChanged = function(a) {
      this.selections = [a.selection];

      this.selections = this.selections.concat(a.secondarySelections);

      return !0;
    };

    b.prototype.onCursorRevealRange = function(a) {
      return !1;
    };

    b.prototype.onConfigurationChanged = function(a) {
      return !0;
    };

    b.prototype.onConfigurationFontChanged = function() {
      return !0;
    };

    b.prototype.onConfigurationLineHeightChanged = function() {
      return !0;
    };

    b.prototype.onLayoutChanged = function(a) {
      this.contentLeft = a.contentLeft;

      return !0;
    };

    b.prototype.onScrollChanged = function(a) {
      a.horizontal && (this.horizontalScrollChanged = !0);

      return a.vertical;
    };

    b.prototype.onZonesChanged = function() {
      return !0;
    };

    b.prototype.onScrollWidthChanged = function() {
      return !1;
    };

    b.prototype.onScrollHeightChanged = function(a) {
      return !1;
    };

    b.prototype.visibleRangesHaveGaps = function(a) {
      if (a.length <= 1) {
        return !1;
      }
      var b;

      var c;

      var d;

      var e;
      b = a[0].top;
      for (d = 1, e = a.length; d < e; d++) {
        c = a[d].top;
        if (c === b) {
          return !0;
        }
        b = c;
      }
      return !1;
    };

    b.prototype.enrichVisibleRangesWithStyle = function(a) {
      var b;

      var c;

      var d;

      var f;

      var g;

      var h;

      var i;

      var j;

      var k;

      var l;

      var m;
      for (l = 0, m = a.length; l < m; l++) {
        b = a[l];
        c = b.left;
        d = b.left + b.width;
        j = {
          top: e.EXTERN,
          bottom: e.EXTERN
        };
        k = {
          top: e.EXTERN,
          bottom: e.EXTERN
        };
        if (l > 0) {
          f = a[l - 1].left;
          g = a[l - 1].left + a[l - 1].width;
          if (c === f) {
            j.top = e.FLAT;
          } else {
            if (c > f) {
              j.top = e.INTERN;
            }
          }
          if (d === g) {
            k.top = e.FLAT;
          } else {
            if (f < d && d < g) {
              k.top = e.INTERN;
            }
          }
        }
        if (l + 1 < m) {
          h = a[l + 1].left;
          i = a[l + 1].left + a[l + 1].width;
          if (c === h) {
            j.bottom = e.FLAT;
          } else {
            if (h < c && c < i) {
              j.bottom = e.INTERN;
            }
          }
          if (d === i) {
            k.bottom = e.FLAT;
          } else {
            if (d < i) {
              k.bottom = e.INTERN;
            }
          }
        }
        b.startStyle = j;
        b.endStyle = k;
      }
    };

    b.prototype.getVisibleRangesWithStyle = function(a, b) {
      var c = b.visibleRangesForRange(a, !0);

      var d = c ? c.toArray() : [];

      var e = this.visibleRangesHaveGaps(d);
      !e && this.context.configuration.editor.roundedSelection && this.enrichVisibleRangesWithStyle(d);

      return d;
    };

    b.prototype.createSelectionPiece = function(a, b, c, d, e, f, g, h, i) {
      g.push('<div class="');

      g.push(a);

      g.push('" style="top:');

      g.push(b.toString());

      g.push("px;left:");

      h.push(c);

      i.push(g.length);

      g.push((c - f).toString());

      g.push("px;width:");

      g.push(d.toString());

      g.push("px;height:");

      g.push(e);

      g.push('px;"></div>');
    };

    b.prototype.actualRenderOneSelection = function(a, c, d, f, g) {
      var h = a.length > 0 && a[0].startStyle;

      var i;

      var j = this.context.configuration.editor.lineHeight.toString();

      var k;

      var l;
      for (k = 0; k < a.length; k++) {
        l = a[k];
        if (h) {
          if (l.startStyle.top === e.INTERN || l.startStyle.bottom === e.INTERN) {
            this.createSelectionPiece(b.SELECTION_CLASS_NAME, l.top, l.left - b.ROUNDED_PIECE_WIDTH, b.ROUNDED_PIECE_WIDTH,
              j, c, d, f, g);
            i = b.EDITOR_BACKGROUND_CLASS_NAME;
            if (l.startStyle.top === e.INTERN) {
              i += " " + b.SELECTION_TOP_RIGHT;
            }
            if (l.startStyle.bottom === e.INTERN) {
              i += " " + b.SELECTION_BOTTOM_RIGHT;
            }
            this.createSelectionPiece(i, l.top, l.left - b.ROUNDED_PIECE_WIDTH, b.ROUNDED_PIECE_WIDTH, j, c, d, f, g);
          }
          if (l.endStyle.top === e.INTERN || l.endStyle.bottom === e.INTERN) {
            this.createSelectionPiece(b.SELECTION_CLASS_NAME, l.top, l.left + l.width, b.ROUNDED_PIECE_WIDTH, j, c, d,
              f, g);
            i = b.EDITOR_BACKGROUND_CLASS_NAME;
            if (l.endStyle.top === e.INTERN) {
              i += " " + b.SELECTION_TOP_LEFT;
            }
            if (l.endStyle.bottom === e.INTERN) {
              i += " " + b.SELECTION_BOTTOM_LEFT;
            }
            this.createSelectionPiece(i, l.top, l.left + l.width, b.ROUNDED_PIECE_WIDTH, j, c, d, f, g);
          }
        }
        i = b.SELECTION_CLASS_NAME;

        if (h) {
          if (l.startStyle.top === e.EXTERN) {
            i += " " + b.SELECTION_TOP_LEFT;
          }
          if (l.startStyle.bottom === e.EXTERN) {
            i += " " + b.SELECTION_BOTTOM_LEFT;
          }
          if (l.endStyle.top === e.EXTERN) {
            i += " " + b.SELECTION_TOP_RIGHT;
          }
          if (l.endStyle.bottom === e.EXTERN) {
            i += " " + b.SELECTION_BOTTOM_RIGHT;
          }
        }

        this.createSelectionPiece(i, l.top, l.left, l.width, j, c, d, f, g);
      }
    };

    b.prototype.actualRender = function(a) {
      var b = [];

      var c = [];

      var d = [];

      var e;

      var f;

      var g;
      b.push('<div class="selections-layer" style="left:');

      b.push(this.contentLeft.toString());

      b.push("px;width:");

      b.push(a.scrollWidth.toString());

      b.push("px;height:");

      b.push(a.scrollHeight.toString());

      b.push('px;">');
      for (g = 0; g < this.selections.length; g++) {
        e = this.selections[g];
        if (e.isEmpty()) continue;
        f = this.getVisibleRangesWithStyle(e, a);

        this.actualRenderOneSelection(f, a.viewportLeft, b, c, d);
      }
      b.push("</div>");

      return {
        html: b,
        lefts: c,
        leftsIndices: d
      };
    };

    b.prototype.shouldCallRender = function() {
      return this.shouldRender || this.horizontalScrollChanged;
    };

    b.prototype.render = function(a) {
      if (this.shouldRender) {
        this.previousRender = this.actualRender(a);
        this.shouldRender = !1;
        this.horizontalScrollChanged = !1;
      } else if (this.horizontalScrollChanged) {
        var b;

        var c;

        var d = this.previousRender.html;

        var e = this.previousRender.lefts;

        var f = this.previousRender.leftsIndices;
        for (b = 0, c = e.length; b < c; b++) {
          d[f[b]] = (e[b] - a.viewportLeft).toString();
        }
        this.horizontalScrollChanged = !1;
      }
      return this.previousRender.html;
    };

    b.SELECTION_CLASS_NAME = "selected-text";

    b.SELECTION_TOP_LEFT = "top-left-radius";

    b.SELECTION_BOTTOM_LEFT = "bottom-left-radius";

    b.SELECTION_TOP_RIGHT = "top-right-radius";

    b.SELECTION_BOTTOM_RIGHT = "bottom-right-radius";

    b.EDITOR_BACKGROUND_CLASS_NAME = "monaco-editor-background";

    b.ROUNDED_PIECE_WIDTH = 10;

    return b;
  }(d.ViewEventHandler);
  b.SelectionsOverlay = f;
});