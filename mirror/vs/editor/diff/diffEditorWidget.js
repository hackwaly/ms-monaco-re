var __extends = this.__extends || function(a, b) {
    function d() {
      this.constructor = a;
    }
    for (var c in b) b.hasOwnProperty(c) && (a[c] = b[c]);
    d.prototype = b.prototype;

    a.prototype = new d;
  };

define(["require", "exports", "vs/editor/core/config", "vs/editor/core/constants", "vs/base/objects",
  "vs/editor/core/codeEditorWidget", "vs/base/dom/dom", "vs/base/eventEmitter", "vs/editor/core/range",
  "vs/base/ui/widgets/sash", "vs/css!./diffEditor"
], function(a, b, c, d, e, f, g, h, i, j) {
  var k = c;

  var l = d;

  var m = e;

  var n = f;

  var o = g;

  var p = h;

  var q = i;

  var r = j;

  var s = function(a) {
    function b(b, c, d) {
      var e = this;
      a.call(this);

      c = c || {};

      this.domElement = b;

      this.listenersToRemove = [];

      this.theme = c.theme || k.Config.editor.theme;

      this.containerDomElement = document.createElement("div");

      this.containerDomElement.className = "monaco-diff-editor monaco-editor-background " + this.theme;

      this.containerDomElement.style.position = "relative";

      this.containerDomElement.style.height = "100%";

      this.domElement.appendChild(this.containerDomElement);

      this.overviewDomElement = document.createElement("div");

      this.overviewDomElement.className = "diffOverview";

      this.overviewDomElement.style.position = "absolute";

      this.overviewDomElement.style.height = "100%";

      this.listenersToRemove.push(o.addListener(this.overviewDomElement, "mousedown", function(a) {
        e.modifiedEditor.delegateVerticalScrollbarMouseDown(a);
      }));

      this.containerDomElement.appendChild(this.overviewDomElement);

      this._createLeftHandSide();

      this._createRightHandSide();

      this.sashPosition = null;

      this.sash = new r.Sash(this.containerDomElement, this);

      this.sash.on("start", function() {
        return e.onSashDragStart();
      });

      this.sash.on("change", function(a) {
        return e.onSashDrag(a);
      });

      this.sash.on("end", function() {
        return e.onSashDragEnd();
      });

      this.domElementWidth = 0;

      this.domElementHeight = 0;

      this._measureDomElement(!1);

      c.automaticLayout && (this.measureDomElementToken = window.setInterval(function() {
        return e._measureDomElement(!0);
      }, 100));

      this._createLeftHandSideEditor(c, d);

      this._createRightHandSideEditor(c, d);

      this.originalDecorations = [];

      this.modifiedDecorations = [];

      this.originalZones = [];

      this.modifiedZones = [];

      this.beginUpdateDecorationsTimeout = -1;

      this.diffComputationToken = 0;

      this.isHandlingScrollEvent = !1;

      this.isVisible = !0;
    }
    __extends(b, a);

    b.prototype.getEditorType = function() {
      return l.EditorType.IDiffEditor;
    };

    b.prototype.getLineChanges = function() {
      return this.lineChanges;
    };

    b.prototype.getModifiedEditor = function() {
      return this.modifiedEditor;
    };

    b.prototype._createLeftHandSide = function() {
      this.originalDomNode = document.createElement("div");

      this.originalDomNode.className = "editor original";

      this.originalDomNode.style.position = "absolute";

      this.originalDomNode.style.height = "100%";

      this.containerDomElement.appendChild(this.originalDomNode);
    };

    b.prototype._createRightHandSide = function() {
      this.modifiedDomNode = document.createElement("div");

      this.modifiedDomNode.className = "editor modified";

      this.modifiedDomNode.style.position = "absolute";

      this.modifiedDomNode.style.height = "100%";

      this.containerDomElement.appendChild(this.modifiedDomNode);
    };

    b.prototype._measureDomElement = function(a, c) {
      typeof c == "undefined" && (c = this.sashPosition);
      var d = o.getDomNodePosition(this.containerDomElement);
      if (d.width <= 0) return;
      var e = d.width - b.ENTIRE_DIFF_OVERVIEW_WIDTH;

      var f = Math.floor(e / 2);
      c = c || f;

      e > b.MINIMUM_EDITOR_WIDTH * 2 ? (c < b.MINIMUM_EDITOR_WIDTH && (c = b.MINIMUM_EDITOR_WIDTH), c > e - b.MINIMUM_EDITOR_WIDTH &&
        (c = e - b.MINIMUM_EDITOR_WIDTH)) : c = f;
      if (d.width === this.width && d.height === this.height && this.sashPosition === c) return;
      this.width = d.width;

      this.height = d.height;

      this.sashPosition = c;

      this.originalDomNode.style.width = c + "px";

      this.originalDomNode.style.left = "0px";

      this.modifiedDomNode.style.width = this.width - c + "px";

      this.modifiedDomNode.style.left = c + "px";

      this.overviewDomElement.style.top = "0px";

      this.overviewDomElement.style.width = b.ENTIRE_DIFF_OVERVIEW_WIDTH + "px";

      this.overviewDomElement.style.left = this.width - b.ENTIRE_DIFF_OVERVIEW_WIDTH + "px";

      a && this.layout();

      (this.originalOverviewRuler || this.modifiedOverviewRuler) && this._layoutOverviewRulers();
    };

    b.prototype._layoutOverviewRulers = function() {
      var a = b.ENTIRE_DIFF_OVERVIEW_WIDTH - 2 * b.ONE_OVERVIEW_WIDTH;

      var c = this.modifiedEditor.getLayoutInfo();
      c && (this.originalOverviewRuler.setLayout({
        top: 0,
        width: b.ONE_OVERVIEW_WIDTH,
        right: a + b.ONE_OVERVIEW_WIDTH,
        height: this.height - c.horizontalScrollbarHeight
      }), this.modifiedOverviewRuler.setLayout({
        top: 0,
        right: 0,
        width: b.ONE_OVERVIEW_WIDTH,
        height: this.height - c.horizontalScrollbarHeight
      }));
    };

    b.prototype._recreateOverviewRulers = function() {
      this.originalOverviewRuler && (this.overviewDomElement.removeChild(this.originalOverviewRuler.getDomNode()),
        this.originalOverviewRuler.destroy());

      this.originalOverviewRuler = this.originalEditor.getView().createOverviewRuler("original diffOverviewRuler", 4,
        Number.MAX_VALUE);

      this.overviewDomElement.appendChild(this.originalOverviewRuler.getDomNode());

      this.modifiedOverviewRuler && (this.overviewDomElement.removeChild(this.modifiedOverviewRuler.getDomNode()),
        this.modifiedOverviewRuler.destroy());

      this.modifiedOverviewRuler = this.modifiedEditor.getView().createOverviewRuler("modified diffOverviewRuler", 4,
        Number.MAX_VALUE);

      this.overviewDomElement.appendChild(this.modifiedOverviewRuler.getDomNode());

      this._layoutOverviewRulers();
    };

    b.prototype._createLeftHandSideEditor = function(a, b) {
      var c = this;
      this.originalEditor = new n.CodeEditorWidget(this.originalDomNode, this._adjustOptionsForLeftHandSide(a), b);

      this.listenersToRemove.push(this.originalEditor.addBulkListener(function(a) {
        return c._onOriginalEditorEvents(a);
      }));

      this.listenersToRemove.push(this.addEmitter(this.originalEditor, "leftHandSide"));
    };

    b.prototype._adjustOptionsForLeftHandSide = function(a) {
      var b = m.clone(a || {});
      b.viewWordWrap = !1;

      b.wrappingColumn = -1;

      b.readOnly = !0;

      b.automaticLayout = !1;

      b.scrollbar = b.scrollbar || {};

      b.scrollbar.vertical = "hidden";

      b.theme = this.theme + " original-in-monaco-diff-editor";

      return b;
    };

    b.prototype._createRightHandSideEditor = function(a, b) {
      var c = this;
      this.modifiedEditor = new n.CodeEditorWidget(this.modifiedDomNode, this._adjustOptionsForRightHandSide(a), b);

      this.listenersToRemove.push(this.modifiedEditor.addBulkListener(function(a) {
        return c._onModifiedEditorEvents(a);
      }));

      this.listenersToRemove.push(this.addEmitter(this.modifiedEditor, "rightHandSide"));
    };

    b.prototype._adjustOptionsForRightHandSide = function(a) {
      var b = m.clone(a || {});
      b.viewWordWrap = !1;

      b.wrappingColumn = -1;

      b.automaticLayout = !1;

      b.scrollbar = b.scrollbar || {};

      b.scrollbar.vertical = "visible";

      b.scrollbar.verticalHasArrows = !1;

      b.scrollbar.verticalScrollbarSize = 41;

      b.theme = this.theme + " modified-in-monaco-diff-editor";

      return b;
    };

    b.prototype._cleanViewZonesAndDecorationsOnEditor = function(a, b, c) {
      b.length > 0 && a.changeViewZones(function(a) {
        for (var c = 0, d = b.length; c < d; c++) a.removeZone(b[c]);
      });

      c.length > 0 && a.changeDecorations(function(a) {
        for (var b = 0, d = c.length; b < d; b++) a.removeDecoration(c[b]);
      });
    };

    b.prototype._cleanViewZonesAndDecorations = function() {
      this._cleanViewZonesAndDecorationsOnEditor(this.originalEditor, this.originalZones, this.originalDecorations);

      this.originalZones = [];

      this.originalDecorations = [];

      this._cleanViewZonesAndDecorationsOnEditor(this.modifiedEditor, this.modifiedZones, this.modifiedDecorations);

      this.modifiedZones = [];

      this.modifiedDecorations = [];
    };

    b.prototype.onSashDragStart = function() {
      this.startSashPosition = this.sashPosition;
    };

    b.prototype.onSashDrag = function(a) {
      this._measureDomElement(!0, this.startSashPosition + (a.currentX - a.startX));
    };

    b.prototype.onSashDragEnd = function() {
      this.sash.layout();
    };

    b.prototype.destroy = function() {
      this.listenersToRemove.forEach(function(a) {
        a();
      });

      this.listenersToRemove = [];

      window.clearInterval(this.measureDomElementToken);

      this._cleanViewZonesAndDecorations();

      this.originalOverviewRuler.destroy();

      this.modifiedOverviewRuler.destroy();

      this.originalEditor.destroy();

      this.modifiedEditor.destroy();
    };

    b.prototype.updateOptions = function(a) {
      this.theme = a && a.theme ? a.theme : this.theme;

      this.containerDomElement.className = "monaco-diff-editor monaco-editor-background " + this.theme;

      this.modifiedEditor.updateOptions(this._adjustOptionsForRightHandSide(a));

      this.originalEditor.updateOptions(this._adjustOptionsForLeftHandSide(a));
    };

    b.prototype.getValue = function(a) {
      typeof a == "undefined" && (a = null);

      return this.modifiedEditor.getValue(a);
    };

    b.prototype.getModel = function() {
      return {
        original: this.originalEditor.getModel(),
        modified: this.modifiedEditor.getModel()
      };
    };

    b.prototype.setModel = function(a) {
      this._cleanViewZonesAndDecorations();

      this.originalEditor.setModel(a ? a.original : null);

      this.modifiedEditor.setModel(a ? a.modified : null);

      a && (this._recreateOverviewRulers(), this._beginUpdateDecorations());
    };

    b.prototype.getDomNode = function() {
      return this.domElement;
    };

    b.prototype.getPosition = function() {
      return this.modifiedEditor.getPosition();
    };

    b.prototype.setPosition = function(a, b, c, d) {
      this.modifiedEditor.setPosition(a, b, c, d);
    };

    b.prototype.getSelection = function() {
      return this.modifiedEditor.getSelection();
    };

    b.prototype.getSelections = function() {
      return this.modifiedEditor.getSelections();
    };

    b.prototype.setSelection = function(a, b, c, d) {
      this.modifiedEditor.setSelection(a, b, c, d);
    };

    b.prototype.getActions = function() {
      return this.modifiedEditor.getActions();
    };

    b.prototype.saveViewState = function() {
      var a = this.originalEditor.saveViewState();

      var b = this.modifiedEditor.saveViewState();
      return {
        original: a,
        modified: b
      };
    };

    b.prototype.restoreViewState = function(a) {
      var b = a;
      if (b.original && b.original) {
        var c = b;
        this.originalEditor.restoreViewState(c.original);

        this.modifiedEditor.restoreViewState(c.modified);
      }
    };

    b.prototype.layout = function() {
      this._measureDomElement(!1);

      this.originalEditor.layout();

      this.modifiedEditor.layout();

      this.sash.layout();
    };

    b.prototype.focus = function() {
      this.modifiedEditor.focus();
    };

    b.prototype.onVisible = function() {
      this.isVisible = !0;

      this.originalEditor.onVisible();

      this.modifiedEditor.onVisible();

      this._beginUpdateDecorations();
    };

    b.prototype.onHide = function() {
      this.isVisible = !1;

      this.originalEditor.onHide();

      this.modifiedEditor.onHide();

      this._cleanViewZonesAndDecorations();
    };

    b.prototype.trigger = function(a, b, c) {
      this.modifiedEditor.trigger(a, b, c);
    };

    b.prototype.getSashTop = function(a) {
      return 0;
    };

    b.prototype.getSashLeft = function(a) {
      return this.sashPosition;
    };

    b.prototype.getSashHeight = function(a) {
      return this.containerDomElement.clientHeight;
    };

    b.prototype.changeDecorations = function(a) {
      return this.modifiedEditor.changeDecorations(a);
    };

    b.prototype._onModifiedEditorEvents = function(a) {
      var c = this;

      var d = !1;
      for (var e = 0; e < a.length; e++) d = d || a[e].getType() === "change";

      a[e].getType() === "scroll" && this._onModifiedEditorScroll(a[e].getData());
      d && this.isVisible && (this.beginUpdateDecorationsTimeout !== -1 && (window.clearTimeout(this.beginUpdateDecorationsTimeout),
        this.beginUpdateDecorationsTimeout = -1), this.beginUpdateDecorationsTimeout = window.setTimeout(function() {
        return c._beginUpdateDecorations();
      }, b.UPDATE_DIFF_DECORATIONS_DELAY));
    };

    b.prototype._onOriginalEditorEvents = function(a) {
      for (var b = 0; b < a.length; b++) a[b].getType() === "scroll" && this._onOriginalEditorScroll(a[b].getData());
    };

    b.prototype._onOriginalEditorScroll = function(a) {
      if (this.isHandlingScrollEvent) return;
      this.isHandlingScrollEvent = !0;

      this.modifiedEditor.setScrollLeft(a.scrollLeft);

      this.modifiedEditor.setScrollTop(a.scrollTop);

      this.isHandlingScrollEvent = !1;
    };

    b.prototype._onModifiedEditorScroll = function(a) {
      if (this.isHandlingScrollEvent) return;
      this.isHandlingScrollEvent = !0;

      this.originalEditor.setScrollLeft(a.scrollLeft);

      this.originalEditor.setScrollTop(a.scrollTop);

      this.isHandlingScrollEvent = !1;
    };

    b.prototype._beginUpdateDecorations = function() {
      var a = this;
      this.beginUpdateDecorationsTimeout = -1;
      if (!this.modifiedEditor.getModel()) return;
      this.diffComputationToken++;
      var b = this.diffComputationToken;

      var c = this.modifiedEditor.getModel().getMode().diffSupport;
      if (!c) this._updateDecorations(null);
      else try {
        c.computeDiff(this.originalEditor.getModel().getAssociatedResource(), this.modifiedEditor.getModel().getAssociatedResource())
          .then(function(c) {
            b === a.diffComputationToken && (a._updateDecorations(c), a.lineChanges = c, a.emit(l.EventType.DiffUpdated, {
              editor: a,
              lineChanges: c
            }));
          }, function(c) {
            b === a.diffComputationToken && a._updateDecorations(null);
          });
      } catch (d) {
        console.error(d);

        this._updateDecorations(null);
      }
    };

    b.prototype._createDecoration = function(a, b, c, d, e, f) {
      return {
        range: new q.Range(a, b, c, d),
        options: {
          isOverlay: !1,
          className: e,
          isWholeLine: f
        }
      };
    };

    b.prototype._createFakeLinesDiv = function() {
      var a = document.createElement("div");
      a.className = "diagonal-fill";

      return a;
    };

    b.prototype._isChangeOrInsert = function(a) {
      return a.modifiedEndLineNumber > 0;
    };

    b.prototype._isChangeOrDelete = function(a) {
      return a.originalEndLineNumber > 0;
    };

    b.prototype._getOriginalLength = function(a) {
      return a.originalEndLineNumber > 0 ? a.originalEndLineNumber - a.originalStartLineNumber + 1 : 0;
    };

    b.prototype._getModifiedLength = function(a) {
      return a.modifiedEndLineNumber > 0 ? a.modifiedEndLineNumber - a.modifiedStartLineNumber + 1 : 0;
    };

    b.prototype._updateOriginalEditorDecorations = function(a) {
      var b = this;
      this.originalEditor.changeViewZones(function(c) {
        var d;

        var e;
        for (d = 0, e = b.originalZones.length; d < e; d++) c.removeZone(b.originalZones[d]);
        b.originalZones = [];
        var f;

        var g;

        var h;

        var i;
        for (d = 0, e = a.length; d < e; d++) f = a[d];

        b._isChangeOrInsert(f) && (h = b._getModifiedLength(f), g = b._getOriginalLength(f), h > g && (i = Math.max(
          f.originalStartLineNumber, f.originalEndLineNumber), b.originalZones.push(c.addZone({
          afterLineNumber: i,
          heightInLines: h - g,
          domNode: b._createFakeLinesDiv()
        }))));
      });
      var c;

      var d;

      var e;

      var f;

      var g;

      var h;

      var i;

      var j = [];

      var k = [];
      for (c = 0, d = a.length; c < d; c++) {
        g = a[c];
        if (this._isChangeOrDelete(g)) {
          i = this._isChangeOrInsert(g);

          j.push(this._createDecoration(g.originalStartLineNumber, 1, g.originalEndLineNumber, 1e5, "line-delete", !0));

          (!i || !g.charChanges) && j.push(this._createDecoration(g.originalStartLineNumber, 1, g.originalEndLineNumber,
            1e5, "char-delete", !0));

          k.push({
            startLineNumber: g.originalStartLineNumber,
            endLineNumber: g.originalEndLineNumber,
            color: "rgba(255, 0, 0, 0.4)"
          });
          if (g.charChanges)
            for (e = 0, f = g.charChanges.length; e < f; e++) h = g.charChanges[e];

          this._isChangeOrDelete(h) && j.push(this._createDecoration(h.originalStartLineNumber, h.originalStartColumn,
            h.originalEndLineNumber, h.originalEndColumn, "char-delete", !1));
        }
      }
      this.originalDecorations = this.originalEditor.deltaDecorations(this.originalDecorations, j);

      this.originalOverviewRuler.setZones(k);
    };

    b.prototype._updateModifiedEditorDecorations = function(a) {
      var b = this;
      this.modifiedEditor.changeViewZones(function(c) {
        var d;

        var e;
        for (d = 0, e = b.modifiedZones.length; d < e; d++) c.removeZone(b.modifiedZones[d]);
        b.modifiedZones = [];
        var f;

        var g;

        var h;

        var i;
        for (d = 0, e = a.length; d < e; d++) f = a[d];

        b._isChangeOrDelete(f) && (h = b._getModifiedLength(f), g = b._getOriginalLength(f), g > h && (i = Math.max(
          f.modifiedStartLineNumber, f.modifiedEndLineNumber), b.modifiedZones.push(c.addZone({
          afterLineNumber: i,
          heightInLines: g - h,
          domNode: b._createFakeLinesDiv()
        }))));
      });
      var c;

      var d;

      var e;

      var f;

      var g;

      var h;

      var i;

      var j = [];

      var k = [];
      for (c = 0, d = a.length; c < d; c++) {
        g = a[c];
        if (this._isChangeOrInsert(g)) {
          i = this._isChangeOrDelete(g);

          j.push(this._createDecoration(g.modifiedStartLineNumber, 1, g.modifiedEndLineNumber, 1e5, "line-insert", !0));

          (!i || !g.charChanges) && j.push(this._createDecoration(g.modifiedStartLineNumber, 1, g.modifiedEndLineNumber,
            1e5, "char-insert", !0));

          k.push({
            startLineNumber: g.modifiedStartLineNumber,
            endLineNumber: g.modifiedEndLineNumber,
            color: "rgba(155, 185, 85, 0.4)"
          });
          if (g.charChanges)
            for (e = 0, f = g.charChanges.length; e < f; e++) h = g.charChanges[e];

          this._isChangeOrInsert(h) && j.push(this._createDecoration(h.modifiedStartLineNumber, h.modifiedStartColumn,
            h.modifiedEndLineNumber, h.modifiedEndColumn, "char-insert", !1));
        }
      }
      this.modifiedDecorations = this.modifiedEditor.deltaDecorations(this.modifiedDecorations, j);

      this.modifiedOverviewRuler.setZones(k);
    };

    b.prototype._updateDecorations = function(a) {
      this._updateOriginalEditorDecorations(a || []);

      this._updateModifiedEditorDecorations(a || []);
    };

    b.UPDATE_DIFF_DECORATIONS_DELAY = 200;

    b.ONE_OVERVIEW_WIDTH = 15;

    b.ENTIRE_DIFF_OVERVIEW_WIDTH = 30;

    b.MINIMUM_EDITOR_WIDTH = 100;

    return b;
  }(p.EventEmitter);
  b.DiffEditorWidget = s;
});