define("vs/editor/diff/diffEditorWidget", ["require", "exports", "vs/editor/core/config/config", "vs/base/lifecycle",
  "vs/editor/core/constants", "vs/base/objects", "vs/editor/core/codeEditorWidget", "vs/base/dom/dom",
  "vs/base/eventEmitter", "vs/editor/core/range", "vs/editor/editor", "vs/base/ui/widgets/sash",
  "vs/editor/core/view/lines/viewLine", "vs/editor/core/view/lines/viewLineParts", "vs/css!./diffEditor"
], function(e, t, n, i, o, r, s, a, u, l, c, d, h, p) {
  var f = function() {
    function e() {
      this._zones = [];

      this._decorations = [];
    }
    e.prototype.clean = function(e) {
      var t = this;
      if (this._zones.length > 0) {
        e.changeViewZones(function(e) {
          for (var n = 0, i = t._zones.length; i > n; n++) {
            e.removeZone(t._zones[n]);
          }
        });
      }

      this._zones = [];

      if (this._decorations.length > 0) {
        e.changeDecorations(function(e) {
          for (var n = 0, i = t._decorations.length; i > n; n++) {
            e.removeDecoration(t._decorations[n]);
          }
        });
      }

      this._decorations = [];
    };

    e.prototype.apply = function(e, t, n) {
      var i;

      var o;

      var r = this;
      e.changeViewZones(function(e) {
        for (i = 0, o = r._zones.length; o > i; i++) {
          e.removeZone(r._zones[i]);
        }
        for (r._zones = [], i = 0, o = n.zones.length; o > i; i++) {
          n.zones[i].suppressMouseDown = !0;
          r._zones.push(e.addZone(n.zones[i]));
        }
      });

      this._decorations = e.deltaDecorations(this._decorations, n.decorations);

      t.setZones(n.overviewZones);
    };

    return e;
  }();

  var g = function(e) {
    function t(i, o, r) {
      var s = this;
      e.call(this);

      this._domElement = i;

      o = o || {};

      this._theme = o.theme || n.Config.editor.theme;

      this._renderSideBySide = !0;

      if ("undefined" != typeof o.renderSideBySide) {
        this._renderSideBySide = o.renderSideBySide;
      }

      this._toDispose = [];

      this._containerDomElement = document.createElement("div");

      this._containerDomElement.className = t._getClassName(this._theme, this._renderSideBySide);

      this._containerDomElement.style.position = "relative";

      this._containerDomElement.style.height = "100%";

      this._domElement.appendChild(this._containerDomElement);

      this._overviewDomElement = document.createElement("div");

      this._overviewDomElement.className = "diffOverview";

      this._overviewDomElement.style.position = "absolute";

      this._overviewDomElement.style.height = "100%";

      this._toDispose.push(a.addDisposableListener(this._overviewDomElement, "mousedown", function(e) {
        s.modifiedEditor.delegateVerticalScrollbarMouseDown(e);
      }));

      this._containerDomElement.appendChild(this._overviewDomElement);

      this._createLeftHandSide();

      this._createRightHandSide();

      this._beginUpdateDecorationsTimeout = -1;

      this._diffComputationToken = 0;

      this._originalEditorState = new f;

      this._modifiedEditorState = new f;

      this._isVisible = !0;

      this._isHandlingScrollEvent = !1;

      this._width = 0;

      this._height = 0;

      this._lineChanges = null;

      this._createLeftHandSideEditor(o, r);

      this._createRightHandSideEditor(o, r);

      if (o.automaticLayout) {
        this._measureDomElementToken = window.setInterval(function() {
          return s._measureDomElement(!1);
        }, 100);
      }

      this._enableSplitViewResizing = !0;

      if ("undefined" != typeof o.enableSplitViewResizing) {
        this._enableSplitViewResizing = o.enableSplitViewResizing;
      }

      if (this._renderSideBySide) {
        this._setStrategy(new v(this._createDataSource(), this._enableSplitViewResizing));
      }

      {
        this._setStrategy(new y(this._createDataSource(), this._enableSplitViewResizing));
      }
    }
    __extends(t, e);

    t._getClassName = function(e, t) {
      var n = "monaco-diff-editor monaco-editor-background ";
      t && (n += "side-by-side ");

      return n += e;
    };

    t.prototype._recreateOverviewRulers = function() {
      if (this._originalOverviewRuler) {
        this._overviewDomElement.removeChild(this._originalOverviewRuler.getDomNode());
        this._originalOverviewRuler.dispose();
      }

      this._originalOverviewRuler = this.originalEditor.getView().createOverviewRuler("original diffOverviewRuler", 4,
        Number.MAX_VALUE);

      this._overviewDomElement.appendChild(this._originalOverviewRuler.getDomNode());

      if (this._modifiedOverviewRuler) {
        this._overviewDomElement.removeChild(this._modifiedOverviewRuler.getDomNode());
        this._modifiedOverviewRuler.dispose();
      }

      this._modifiedOverviewRuler = this.modifiedEditor.getView().createOverviewRuler("modified diffOverviewRuler", 4,
        Number.MAX_VALUE);

      this._overviewDomElement.appendChild(this._modifiedOverviewRuler.getDomNode());

      this._layoutOverviewRulers();
    };

    t.prototype._createLeftHandSide = function() {
      this._originalDomNode = document.createElement("div");

      this._originalDomNode.className = "editor original";

      this._originalDomNode.style.position = "absolute";

      this._originalDomNode.style.height = "100%";

      this._containerDomElement.appendChild(this._originalDomNode);
    };

    t.prototype._createRightHandSide = function() {
      this._modifiedDomNode = document.createElement("div");

      this._modifiedDomNode.className = "editor modified";

      this._modifiedDomNode.style.position = "absolute";

      this._modifiedDomNode.style.height = "100%";

      this._containerDomElement.appendChild(this._modifiedDomNode);
    };

    t.prototype._createLeftHandSideEditor = function(e, t) {
      var n = this;
      this.originalEditor = new s.CodeEditorWidget(this._originalDomNode, this._adjustOptionsForLeftHandSide(e), t);

      this._toDispose.push(this.originalEditor.addBulkListener2(function(e) {
        return n._onOriginalEditorEvents(e);
      }));

      this._toDispose.push(this.addEmitter2(this.originalEditor, "leftHandSide"));
    };

    t.prototype._createRightHandSideEditor = function(e, t) {
      var n = this;
      this.modifiedEditor = new s.CodeEditorWidget(this._modifiedDomNode, this._adjustOptionsForRightHandSide(e), t);

      this._toDispose.push(this.modifiedEditor.addBulkListener2(function(e) {
        return n._onModifiedEditorEvents(e);
      }));

      this._toDispose.push(this.addEmitter2(this.modifiedEditor, "rightHandSide"));
    };

    t.prototype.destroy = function() {
      this.dispose();
    };

    t.prototype.dispose = function() {
      this._toDispose = i.disposeAll(this._toDispose);

      window.clearInterval(this._measureDomElementToken);

      this._cleanViewZonesAndDecorations();

      this._originalOverviewRuler.dispose();

      this._modifiedOverviewRuler.dispose();

      this.originalEditor.destroy();

      this.modifiedEditor.destroy();

      this._strategy.dispose();

      e.prototype.dispose.call(this);
    };

    t.prototype.getEditorType = function() {
      return o.EditorType.IDiffEditor;
    };

    t.prototype.getLineChanges = function() {
      return this._lineChanges;
    };

    t.prototype.getOriginalEditor = function() {
      return this.originalEditor;
    };

    t.prototype.getModifiedEditor = function() {
      return this.modifiedEditor;
    };

    t.prototype.updateOptions = function(e) {
      this._theme = e && e.theme ? e.theme : this._theme;
      var n = !1;
      if ("undefined" != typeof e.renderSideBySide && this._renderSideBySide !== e.renderSideBySide) {
        this._renderSideBySide = e.renderSideBySide;
        n = !0;
      }

      this._containerDomElement.className = t._getClassName(this._theme, this._renderSideBySide);

      this.modifiedEditor.updateOptions(this._adjustOptionsForRightHandSide(e));

      this.originalEditor.updateOptions(this._adjustOptionsForLeftHandSide(e));

      if ("undefined" != typeof e.enableSplitViewResizing) {
        this._enableSplitViewResizing = e.enableSplitViewResizing;
      }

      this._strategy.setEnableSplitViewResizing(this._enableSplitViewResizing);

      if (n) {
        if (this._renderSideBySide) {
          this._setStrategy(new v(this._createDataSource(), this._enableSplitViewResizing));
        } {
          this._setStrategy(new y(this._createDataSource(), this._enableSplitViewResizing));
        }
      }
    };

    t.prototype.getValue = function(e) {
      "undefined" == typeof e && (e = null);

      return this.modifiedEditor.getValue(e);
    };

    t.prototype.getModel = function() {
      return {
        original: this.originalEditor.getModel(),
        modified: this.modifiedEditor.getModel()
      };
    };

    t.prototype.setModel = function(e) {
      this._cleanViewZonesAndDecorations();

      this.originalEditor.setModel(e ? e.original : null);

      this.modifiedEditor.setModel(e ? e.modified : null);

      if (e) {
        this.originalEditor.setScrollTop(0);
        this.modifiedEditor.setScrollTop(0);
      }

      this._diffComputationToken++;

      if (e) {
        this._recreateOverviewRulers();
        this._beginUpdateDecorations();
      }

      {
        this._lineChanges = null;
      }
    };

    t.prototype.getDomNode = function() {
      return this._domElement;
    };

    t.prototype.getPosition = function() {
      return this.modifiedEditor.getPosition();
    };

    t.prototype.setPosition = function(e, t, n, i) {
      this.modifiedEditor.setPosition(e, t, n, i);
    };

    t.prototype.getSelection = function() {
      return this.modifiedEditor.getSelection();
    };

    t.prototype.getSelections = function() {
      return this.modifiedEditor.getSelections();
    };

    t.prototype.setSelection = function(e, t, n, i) {
      this.modifiedEditor.setSelection(e, t, n, i);
    };

    t.prototype.getActions = function() {
      return this.modifiedEditor.getActions();
    };

    t.prototype.saveViewState = function() {
      var e = this.originalEditor.saveViewState();

      var t = this.modifiedEditor.saveViewState();
      return {
        original: e,
        modified: t
      };
    };

    t.prototype.restoreViewState = function(e) {
      var t = e;
      if (t.original && t.original) {
        var n = t;
        this.originalEditor.restoreViewState(n.original);

        this.modifiedEditor.restoreViewState(n.modified);
      }
    };

    t.prototype.layout = function() {
      this._measureDomElement(!1);
    };

    t.prototype.focus = function() {
      this.modifiedEditor.focus();
    };

    t.prototype.isFocused = function() {
      return this.originalEditor.isFocused() || this.modifiedEditor.isFocused();
    };

    t.prototype.onVisible = function() {
      this._isVisible = !0;

      this.originalEditor.onVisible();

      this.modifiedEditor.onVisible();

      this._beginUpdateDecorations();
    };

    t.prototype.onHide = function() {
      this._isVisible = !1;

      this.originalEditor.onHide();

      this.modifiedEditor.onHide();

      this._cleanViewZonesAndDecorations();
    };

    t.prototype.trigger = function(e, t, n) {
      this.modifiedEditor.trigger(e, t, n);
    };

    t.prototype.changeDecorations = function(e) {
      return this.modifiedEditor.changeDecorations(e);
    };

    t.prototype._measureDomElement = function(e) {
      var t = a.getDomNodePosition(this._containerDomElement);
      if (!(t.width <= 0)) {
        if (e || t.width !== this._width || t.height !== this._height) {
          this._width = t.width;
          this._height = t.height;
          this._doLayout();
        }
      }
    };

    t.prototype._layoutOverviewRulers = function() {
      var e = t.ENTIRE_DIFF_OVERVIEW_WIDTH - 2 * t.ONE_OVERVIEW_WIDTH;

      var n = this.modifiedEditor.getLayoutInfo();
      if (n) {
        this._originalOverviewRuler.setLayout({
          top: 0,
          width: t.ONE_OVERVIEW_WIDTH,
          right: e + t.ONE_OVERVIEW_WIDTH,
          height: this._height - n.horizontalScrollbarHeight
        });
        this._modifiedOverviewRuler.setLayout({
          top: 0,
          right: 0,
          width: t.ONE_OVERVIEW_WIDTH,
          height: this._height - n.horizontalScrollbarHeight
        });
      }
    };

    t.prototype._onOriginalEditorEvents = function(e) {
      for (var t = 0; t < e.length; t++) {
        if ("scroll" === e[t].getType()) {
          this._onOriginalEditorScroll(e[t].getData());
        }
      }
    };

    t.prototype._onModifiedEditorEvents = function(e) {
      for (var n = this, i = !1, o = 0; o < e.length; o++) {
        i = i || "change" === e[o].getType();
        if ("scroll" === e[o].getType()) {
          this._onModifiedEditorScroll(e[o].getData());
        }
      }
      if (i && this._isVisible) {
        if (-1 !== this._beginUpdateDecorationsTimeout) {
          window.clearTimeout(this._beginUpdateDecorationsTimeout);
          this._beginUpdateDecorationsTimeout = -1;
        }
        this._beginUpdateDecorationsTimeout = window.setTimeout(function() {
          return n._beginUpdateDecorations();
        }, t.UPDATE_DIFF_DECORATIONS_DELAY);
      }
    };

    t.prototype._beginUpdateDecorations = function() {
      var e = this;
      if (this._beginUpdateDecorationsTimeout = -1, this.modifiedEditor.getModel()) {
        this._diffComputationToken++;
        var t = this._diffComputationToken;

        var n = this.originalEditor.getModel();

        var i = this.modifiedEditor.getModel();

        var r = this.modifiedEditor.getModel().getMode().diffSupport;
        if (r) try {
          r.computeDiff(n.getAssociatedResource(), i.getAssociatedResource()).then(function(r) {
            if (t === e._diffComputationToken && n === e.originalEditor.getModel() && i === e.modifiedEditor.getModel()) {
              e._updateDecorations(r);
              e._lineChanges = r;
              e.emit(o.EventType.DiffUpdated, {
                editor: e,
                lineChanges: r
              });
            }
          }, function() {
            if (t === e._diffComputationToken && n === e.originalEditor.getModel() && i === e.modifiedEditor.getModel()) {
              e._updateDecorations(null);
            }
          });
        } catch (s) {
          console.error(s);

          this._updateDecorations(null);
        } else {
          this._updateDecorations(null);
        }
      }
    };

    t.prototype._cleanViewZonesAndDecorations = function() {
      this._originalEditorState.clean(this.originalEditor);

      this._modifiedEditorState.clean(this.modifiedEditor);
    };

    t.prototype._updateDecorations = function(e) {
      e = e || [];
      var t = this._strategy.getEditorsDiffDecorations(e, this.originalEditor, this.modifiedEditor);
      this._originalEditorState.apply(this.originalEditor, this._originalOverviewRuler, t.original);

      this._modifiedEditorState.apply(this.modifiedEditor, this._modifiedOverviewRuler, t.modified);
    };

    t.prototype._adjustOptionsForLeftHandSide = function(e) {
      var t = r.clone(e || {});
      t.wrappingColumn = -1;

      t.readOnly = !0;

      t.automaticLayout = !1;

      t.scrollbar = t.scrollbar || {};

      t.scrollbar.vertical = "hidden";

      t.overviewRulerLanes = 1;

      t.theme = this._theme + " original-in-monaco-diff-editor";

      return t;
    };

    t.prototype._adjustOptionsForRightHandSide = function(e) {
      var i = r.clone(e || {});
      i.wrappingColumn = -1;

      i.automaticLayout = !1;

      i.revealHorizontalRightPadding = n.Config.editor.revealHorizontalRightPadding + t.ENTIRE_DIFF_OVERVIEW_WIDTH;

      i.scrollbar = i.scrollbar || {};

      i.scrollbar.vertical = "visible";

      i.scrollbar.verticalHasArrows = !1;

      i.scrollbar.verticalScrollbarSize = 41;

      i.scrollbar.verticalSliderSize = 41;

      i.overviewRulerLanes = 1;

      i.theme = this._theme + " modified-in-monaco-diff-editor";

      return i;
    };

    t.prototype._onOriginalEditorScroll = function(e) {
      if (!this._isHandlingScrollEvent) {
        this._isHandlingScrollEvent = !0;
        this.modifiedEditor.setScrollLeft(e.scrollLeft);
        this.modifiedEditor.setScrollTop(e.scrollTop);
        this._isHandlingScrollEvent = !1;
      }
    };

    t.prototype._onModifiedEditorScroll = function(e) {
      if (!this._isHandlingScrollEvent) {
        this._isHandlingScrollEvent = !0;
        this.originalEditor.setScrollLeft(e.scrollLeft);
        this.originalEditor.setScrollTop(e.scrollTop);
        this._isHandlingScrollEvent = !1;
      }
    };

    t.prototype._doLayout = function() {
      var e = this._strategy.layout();
      this._originalDomNode.style.width = e + "px";

      this._originalDomNode.style.left = "0px";

      this._modifiedDomNode.style.width = this._width - e + "px";

      this._modifiedDomNode.style.left = e + "px";

      this._overviewDomElement.style.top = "0px";

      this._overviewDomElement.style.width = t.ENTIRE_DIFF_OVERVIEW_WIDTH + "px";

      this._overviewDomElement.style.left = this._width - t.ENTIRE_DIFF_OVERVIEW_WIDTH + "px";

      this.originalEditor.layout();

      this.modifiedEditor.layout();

      if (this._originalOverviewRuler || this._modifiedOverviewRuler) {
        this._layoutOverviewRulers();
      }
    };

    t.prototype._createDataSource = function() {
      var e = this;
      return {
        getWidth: function() {
          return e._width;
        },
        getHeight: function() {
          return e._height;
        },
        getContainerDomNode: function() {
          return e._containerDomElement;
        },
        relayoutEditors: function() {
          e._doLayout();
        },
        getOriginalEditor: function() {
          return e.originalEditor;
        },
        getModifiedEditor: function() {
          return e.modifiedEditor;
        }
      };
    };

    t.prototype._setStrategy = function(e) {
      if (this._strategy) {
        this._strategy.dispose();
      }

      this._strategy = e;

      if (this._lineChanges) {
        this._updateDecorations(this._lineChanges);
      }

      this._measureDomElement(!0);
    };

    t.ONE_OVERVIEW_WIDTH = 15;

    t.ENTIRE_DIFF_OVERVIEW_WIDTH = 30;

    t.UPDATE_DIFF_DECORATIONS_DELAY = 200;

    return t;
  }(u.EventEmitter);
  t.DiffEditorWidget = g;
  var m = function() {
    function e(e) {
      this._dataSource = e;
    }
    e.prototype.getEditorsDiffDecorations = function(e, t, n) {
      return {
        original: this._getOriginalEditorDecorations(e, t, n),
        modified: this._getModifiedEditorDecorations(e, t, n)
      };
    };

    e.prototype._getOriginalEditorDecorations = function() {
      return null;
    };

    e.prototype._getModifiedEditorDecorations = function() {
      return null;
    };

    e.prototype._isChangeOrInsert = function(e) {
      return e.modifiedEndLineNumber > 0;
    };

    e.prototype._isChangeOrDelete = function(e) {
      return e.originalEndLineNumber > 0;
    };

    e.prototype._getOriginalLength = function(e) {
      return e.originalEndLineNumber > 0 ? e.originalEndLineNumber - e.originalStartLineNumber + 1 : 0;
    };

    e.prototype._getModifiedLength = function(e) {
      return e.modifiedEndLineNumber > 0 ? e.modifiedEndLineNumber - e.modifiedStartLineNumber + 1 : 0;
    };

    e.prototype._createDecoration = function(e, t, n, i, o, r) {
      return {
        range: new l.Range(e, t, n, i),
        options: {
          isOverlay: !1,
          className: o,
          isWholeLine: r
        }
      };
    };

    return e;
  }();

  var v = function(e) {
    function t(t, n) {
      var i = this;
      e.call(this, t);

      this._disableSash = n === !1;

      this._sashRatio = null;

      this._sashPosition = null;

      this._sash = new d.Sash(this._dataSource.getContainerDomNode(), this);

      if (this._disableSash) {
        this._sash.disable();
      }

      this._sash.on("start", function() {
        return i._onSashDragStart();
      });

      this._sash.on("change", function(e) {
        return i._onSashDrag(e);
      });

      this._sash.on("end", function() {
        return i._onSashDragEnd();
      });
    }
    __extends(t, e);

    t.prototype.dispose = function() {
      this._sash.dispose();
    };

    t.prototype.setEnableSplitViewResizing = function(e) {
      var t = e === !1;
      if (this._disableSash !== t) {
        this._disableSash = t;
        if (this._disableSash) {
          this._sash.disable();
        } {
          this._sash.enable();
        }
      }
    };

    t.prototype.layout = function(e) {
      if ("undefined" == typeof e) {
        e = this._sashRatio;
      }
      var n = this._dataSource.getWidth();

      var i = n - g.ENTIRE_DIFF_OVERVIEW_WIDTH;

      var o = Math.floor((e || .5) * i);

      var r = Math.floor(.5 * i);

      var o = this._disableSash ? r : o || r;
      i > 2 * t.MINIMUM_EDITOR_WIDTH ? (o < t.MINIMUM_EDITOR_WIDTH && (o = t.MINIMUM_EDITOR_WIDTH), o > i - t.MINIMUM_EDITOR_WIDTH &&
        (o = i - t.MINIMUM_EDITOR_WIDTH)) : o = r;

      this._sashPosition !== o && (this._sashPosition = o, this._sash.layout());

      return this._sashPosition;
    };

    t.prototype._onSashDragStart = function() {
      this._startSashPosition = this._sashPosition;
    };

    t.prototype._onSashDrag = function(e) {
      var t = this._dataSource.getWidth();

      var n = t - g.ENTIRE_DIFF_OVERVIEW_WIDTH;

      var i = this.layout((this._startSashPosition + (e.currentX - e.startX)) / n);
      this._sashRatio = i / n;

      this._dataSource.relayoutEditors();
    };

    t.prototype._onSashDragEnd = function() {
      this._sash.layout();
    };

    t.prototype.getVerticalSashTop = function() {
      return 0;
    };

    t.prototype.getVerticalSashLeft = function() {
      return this._sashPosition;
    };

    t.prototype.getVerticalSashHeight = function() {
      return this._dataSource.getHeight();
    };

    t.prototype._getOriginalEditorDecorations = function(e) {
      var t;

      var n;

      var i;

      var o;

      var r;

      var s;

      var a;

      var u;

      var l = {
        decorations: [],
        zones: [],
        overviewZones: []
      };
      for (t = 0, n = e.length; n > t; t++)
        if (a = e[t], this._isChangeOrInsert(a) && (r = this._getModifiedLength(a), s = this._getOriginalLength(a), r >
          s && l.zones.push({
            afterLineNumber: Math.max(a.originalStartLineNumber, a.originalEndLineNumber),
            heightInLines: r - s,
            domNode: this._createFakeLinesDiv()
          })), this._isChangeOrDelete(a) && (l.decorations.push(this._createDecoration(a.originalStartLineNumber, 1,
            a.originalEndLineNumber, Number.MAX_VALUE, "line-delete", !0)), this._isChangeOrInsert(a) && a.charChanges ||
          l.decorations.push(this._createDecoration(a.originalStartLineNumber, 1, a.originalEndLineNumber, Number.MAX_VALUE,
            "char-delete", !0)), l.overviewZones.push({
            startLineNumber: a.originalStartLineNumber,
            endLineNumber: a.originalEndLineNumber,
            color: "rgba(255, 0, 0, 0.4)",
            position: c.OverviewRulerLane.Full
          }), a.charChanges))
          for (i = 0, o = a.charChanges.length; o > i; i++) {
            u = a.charChanges[i];
            if (this._isChangeOrDelete(u)) {
              l.decorations.push(this._createDecoration(u.originalStartLineNumber, u.originalStartColumn, u.originalEndLineNumber,
                u.originalEndColumn, "char-delete", !1));
            }
          }
      return l;
    };

    t.prototype._getModifiedEditorDecorations = function(e) {
      var t;

      var n;

      var i;

      var o;

      var r;

      var s;

      var a;

      var u;

      var l = {
        decorations: [],
        zones: [],
        overviewZones: []
      };
      for (t = 0, n = e.length; n > t; t++)
        if (a = e[t], this._isChangeOrDelete(a) && (r = this._getModifiedLength(a), s = this._getOriginalLength(a), s >
          r && l.zones.push({
            afterLineNumber: Math.max(a.modifiedStartLineNumber, a.modifiedEndLineNumber),
            heightInLines: s - r,
            domNode: this._createFakeLinesDiv()
          })), this._isChangeOrInsert(a) && (l.decorations.push(this._createDecoration(a.modifiedStartLineNumber, 1,
            a.modifiedEndLineNumber, Number.MAX_VALUE, "line-insert", !0)), this._isChangeOrDelete(a) && a.charChanges ||
          l.decorations.push(this._createDecoration(a.modifiedStartLineNumber, 1, a.modifiedEndLineNumber, Number.MAX_VALUE,
            "char-insert", !0)), l.overviewZones.push({
            startLineNumber: a.modifiedStartLineNumber,
            endLineNumber: a.modifiedEndLineNumber,
            color: "rgba(155, 185, 85, 0.4)",
            position: c.OverviewRulerLane.Full
          }), a.charChanges))
          for (i = 0, o = a.charChanges.length; o > i; i++) {
            u = a.charChanges[i];
            if (this._isChangeOrInsert(u)) {
              l.decorations.push(this._createDecoration(u.modifiedStartLineNumber, u.modifiedStartColumn, u.modifiedEndLineNumber,
                u.modifiedEndColumn, "char-insert", !1));
            }
          }
      return l;
    };

    t.prototype._createFakeLinesDiv = function() {
      var e = document.createElement("div");
      e.className = "diagonal-fill";

      return e;
    };

    t.MINIMUM_EDITOR_WIDTH = 100;

    return t;
  }(m);

  var y = function(e) {
    function t(t) {
      var n = this;
      e.call(this, t);

      this.decorationsLeft = 40;

      this.toDispose = [];

      this.toDispose.push(t.getOriginalEditor().addListener2(o.EventType.EditorLayout, function(e) {
        if (n.decorationsLeft !== e.decorationsLeft) {
          n.decorationsLeft = e.decorationsLeft;
          t.relayoutEditors();
        }
      }));
    }
    __extends(t, e);

    t.prototype.dispose = function() {
      this.toDispose = i.disposeAll(this.toDispose);
    };

    t.prototype.setEnableSplitViewResizing = function() {};

    t.prototype._getOriginalEditorDecorations = function(e) {
      var t;

      var n;

      var i;

      var o = {
        decorations: [],
        zones: [],
        overviewZones: []
      };
      for (t = 0, n = e.length; n > t; t++) {
        i = e[t];
        if (this._isChangeOrInsert(i)) {
          o.zones.push({
            afterLineNumber: Math.max(i.originalStartLineNumber, i.originalEndLineNumber),
            heightInLines: this._getModifiedLength(i),
            domNode: document.createElement("div")
          });
        }
        if (this._isChangeOrDelete(i)) {
          o.overviewZones.push({
            startLineNumber: i.originalStartLineNumber,
            endLineNumber: i.originalEndLineNumber,
            color: "rgba(255, 0, 0, 0.4)",
            position: c.OverviewRulerLane.Full
          });
        }
      }
      return o;
    };

    t.prototype.renderOriginalLine = function(e, t, n, i, o) {
      var r;

      var s;

      var a = e.getLineContent(i);
      r = {
        getTokens: function() {
          return [{
            startIndex: 0,
            type: ""
          }];
        },
        getTextLength: function() {
          return a.length;
        },
        equals: function() {
          return !1;
        },
        findIndexOfOffset: function() {
          return 0;
        }
      };

      s = p.createLineParts(i, r, o);
      var u = h.renderLine({
        lineContent: a,
        tabSize: n.tabSize,
        stopRenderingLineAfter: t.stopRenderingLineAfter,
        parts: s.getParts()
      });

      var l = [];
      l.push('<div class="view-line');

      0 === o.length && l.push(" char-delete");

      l.push('" style="width:1000000px;">');

      l = l.concat(u.output);

      l.push("</div>");

      return l;
    };

    t.prototype._getModifiedEditorDecorations = function(e, t, n) {
      var i;

      var o;

      var r;

      var s;

      var a;

      var u;

      var l;

      var d;

      var h;

      var p = {
        decorations: [],
        zones: [],
        overviewZones: []
      };

      var f = t.getModel();

      var g = n.getConfiguration();

      var m = n.getIndentationOptions();
      for (i = 0, o = e.length; o > i; i++) {
        if (a = e[i], this._isChangeOrDelete(a)) {
          var v = [];
          if (a.charChanges)
            for (u = 0, l = a.charChanges.length; l > u; u++) {
              d = a.charChanges[u];
              if (this._isChangeOrDelete(d)) {
                h = this._createDecoration(d.originalStartLineNumber, d.originalStartColumn, d.originalEndLineNumber,
                  d.originalEndColumn, "char-delete", !1);
                h.options.inlineClassName = h.options.className;
                v.push(h);
              }
            }
          for (s = [], r = a.originalStartLineNumber; r <= a.originalEndLineNumber; r++) {
            s = s.concat(this.renderOriginalLine(f, g, m, r, v));
          }
          var y = document.createElement("div");
          y.className = "view-lines line-delete";

          y.innerHTML = s.join("");

          p.zones.push({
            afterLineNumber: 0 === a.modifiedEndLineNumber ? a.modifiedStartLineNumber : a.modifiedStartLineNumber -
              1,
            heightInLines: this._getOriginalLength(a),
            domNode: y
          });
        }
        if (this._isChangeOrInsert(a))
          if (p.decorations.push(this._createDecoration(a.modifiedStartLineNumber, 1, a.modifiedEndLineNumber, Number
            .MAX_VALUE, "line-insert", !0)), p.overviewZones.push({
            startLineNumber: a.modifiedStartLineNumber,
            endLineNumber: a.modifiedEndLineNumber,
            color: "rgba(155, 185, 85, 0.4)",
            position: c.OverviewRulerLane.Full
          }), a.charChanges)
            for (u = 0, l = a.charChanges.length; l > u; u++) {
              d = a.charChanges[u];
              if (this._isChangeOrInsert(d)) {
                p.decorations.push(this._createDecoration(d.modifiedStartLineNumber, d.modifiedStartColumn, d.modifiedEndLineNumber,
                  d.modifiedEndColumn, "char-insert", !1));
              }
            } else {
              p.decorations.push(this._createDecoration(a.modifiedStartLineNumber, 1, a.modifiedEndLineNumber, Number
                .MAX_VALUE, "char-insert", !0));
            }
      }
      return p;
    };

    t.prototype.layout = function() {
      return Math.max(5, this.decorationsLeft);
    };

    return t;
  }(m);
});