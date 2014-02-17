define("vs/editor/contrib/gotoError/gotoError", ["require", "exports", "vs/base/lifecycle", "vs/base/strings",
  "vs/base/severity", "vs/base/dom/dom", "vs/base/lib/winjs.base", "vs/editor/contrib/zoneWidget/zoneWidget",
  "vs/base/dom/builder", "vs/base/eventEmitter", "vs/editor/editorExtensions", "vs/editor/core/constants",
  "vs/editor/core/position", "vs/editor/core/range", "vs/platform/services", "vs/platform/platform",
  "vs/platform/actionRegistry", "vs/nls!vs/editor/editor.main", "vs/css!./gotoError"
], function(e, t, n, i, o, r, s, a, u, l, c, d, h, p, f, g, m, v) {
  var y = u.$;

  var _ = function(e) {
    function t(n, i) {
      var o = this;
      e.call(this, [t.Events.CURRENT, t.Events.MARKER_SET]);

      this._editor = n;

      this._markers = null;

      this._nextIdx = -1;

      this._toUnbind = [];

      this._ignoreSelectionChange = !1;

      this.setMarkers(i);

      this._toUnbind.push(this._editor.addListener(d.EventType.Disposed, function() {
        return o.dispose();
      }));

      this._toUnbind.push(this._editor.addListener(d.EventType.CursorPositionChanged, function() {
        if (!o._ignoreSelectionChange) {
          o._nextIdx = -1;
        }
      }));
    }
    __extends(t, e);

    t.prototype.setMarkers = function(e) {
      this._markers = e || [];

      this._markers.sort(function(e, t) {
        return e.range.startLineNumber === t.range.startLineNumber ? e.range.startColumn - t.range.startColumn : e.range
          .startLineNumber - t.range.startLineNumber;
      });

      this._nextIdx = -1;

      this.emit(t.Events.MARKER_SET, this);
    };

    t.prototype.withoutWatchingEditorPosition = function(e) {
      this._ignoreSelectionChange = !0;
      try {
        e();
      } finally {
        this._ignoreSelectionChange = !1;
      }
    };

    t.prototype.initIdx = function(e) {
      for (var t = !1, n = this._editor.getPosition(), i = 0, o = this._markers.length; o > i && !t; i++) {
        var r = new p.Range(this._markers[i].range.startLineNumber, this._markers[i].range.startColumn, this._markers[
          i].range.endLineNumber, this._markers[i].range.endColumn);
        if (n.isBeforeOrEqual(r.getStartPosition())) {
          this._nextIdx = i + (e ? 0 : -1);
          t = !0;
        }
      }
      if (!t) {
        this._nextIdx = e ? 0 : this._markers.length - 1;
      }

      if (this._nextIdx < 0) {
        this._nextIdx = this._markers.length - 1;
      }
    };

    t.prototype.move = function(e) {
      if (!this.canNavigate()) {
        this.emit(t.Events.CURRENT, null);
        return void 0;
      }
      if (-1 === this._nextIdx) {
        this.initIdx(e);
      } else {
        if (e) {
          this._nextIdx += 1;
          if (this._nextIdx >= this._markers.length) {
            this._nextIdx = 0;
          }
        } else {
          this._nextIdx -= 1;
          if (this._nextIdx < 0) {
            this._nextIdx = this._markers.length - 1;
          }
        }
      }
      var n = this._markers[this._nextIdx];
      this.emit(t.Events.CURRENT, n);
    };

    t.prototype.canNavigate = function() {
      return this._markers.length > 0;
    };

    t.prototype.next = function() {
      this.move(!0);
    };

    t.prototype.previous = function() {
      this.move(!1);
    };

    t.prototype.indexOf = function(e) {
      return this._markers.indexOf(e);
    };

    t.prototype.length = function() {
      return this._markers.length;
    };

    t.prototype.reveal = function() {
      var e = this;
      if (-1 !== this._nextIdx) {
        this.withoutWatchingEditorPosition(function() {
          var t = new h.Position(e._markers[e._nextIdx].range.startLineNumber, e._markers[e._nextIdx].range.startColumn);
          e._editor.setPosition(t, !0, !0, !0);
        });
      }
    };

    t.prototype.dispose = function() {
      this._toUnbind = n.cAll(this._toUnbind);

      e.prototype.dispose.call(this);
    };

    t.Events = {
      CURRENT: "onMarker",
      MARKER_SET: "onNewMarkerSet"
    };

    return t;
  }(l.EventEmitter);

  var b = {
    showFrame: !0,
    showArrow: !0
  };

  var C = function(e) {
    function t(t, n) {
      e.call(this, t, b);

      this._model = n;

      this._callOnDispose = [];

      this.create();

      this._wireModelAndView();
    }
    __extends(t, e);

    t.prototype.fillContainer = function(e) {
      var t = this;

      var n = y(e).addClass("marker-widget");
      n.div(function(e) {
        t._element = e;
      });

      n.div(function(e) {
        t._quickFixLabel = e;
      });

      n.on(r.EventType.CLICK, function() {
        t.editor.focus();
      });
    };

    t.prototype._wireModelAndView = function() {
      var e = this;
      this._callOnDispose.push(this._model.addListener2(_.Events.CURRENT, function(t) {
        return e.showAtMarker(t);
      }));
    };

    t.prototype.showAtMarker = function(e) {
      var t = this;
      if (e) {
        switch (e.severity) {
          case o.Severity.Error:
            this.options.frameColor = "#ff5a5a";
            break;
          case o.Severity.Warning:
          case o.Severity.Info:
            this.options.frameColor = "#5aac5a";
        }
        this._element.text(i.format("({0}/{1}) {2}", this._model.indexOf(e) + 1, this._model.length(), e.text));
        var n = this.editor.getModel().getMode();
        if (this._quickFixLabel.hide(), e.severity === o.Severity.Error && n.quickFixSupport) {
          var r = e.range.startColumn > 1 && "." === this.editor.getModel().getLineContent(e.range.startLineNumber).charAt(
            e.range.startColumn - 1 - 1);
          if (r) {
            var s = n.quickFixSupport.quickFix(this.editor.getModel().getAssociatedResource(), {
              lineNumber: e.range.endLineNumber,
              column: e.range.endColumn
            });
            s.then(function(e) {
              if (e.length > 0) {
                var n = e.map(function(e) {
                  return e.label;
                });
                t._quickFixLabel.show().text(v.localize("vs_editor_contrib_gotoError_gotoError", 0, n.join(", ")));
              }
            }).done();
          }
        }
        this._model.withoutWatchingEditorPosition(function() {
          t.show(new h.Position(e.range.startLineNumber, e.range.startColumn), 3);
        });
      }
    };

    t.prototype.dispose = function() {
      this._callOnDispose = n.disposeAll(this._callOnDispose);

      e.prototype.dispose.call(this);
    };

    return t;
  }(a.ZoneWidget);

  var w = function(e) {
    function t(t, n, i) {
      e.call(this, t, n);

      this.handlerService = null;

      this.markerService = null;

      this.isNext = i;
    }
    __extends(t, e);

    t.prototype.injectMarkerService = function(e) {
      this.markerService = e;
    };

    t.prototype.injectionDone = function() {
      this.updateEnablementState();
    };

    t.prototype.getEnablementState = function() {
      return !!this.markerService && !! this.handlerService && e.prototype.getEnablementState.call(this);
    };

    t.prototype.getOrCreateModel = function() {
      throw new Error("Abstract method");
    };

    t.prototype.run = function() {
      var e = this.getOrCreateModel();
      this.telemetryService.log("zoneWidgetShown", {
        mode: "go to error"
      });

      e && (this.isNext ? e.next() : e.previous(), e.reveal());

      return s.TPromise.as(!0);
    };

    return t;
  }(c.EditorAction);

  var E = function(e) {
    function t(t, n) {
      e.call(this, t, n, !0);

      this._callOnClose = [];
    }
    __extends(t, e);

    t.prototype._cleanUp = function() {
      this._callOnClose = n.disposeAll(this._callOnClose);

      this._zone = null;

      this._model = null;
    };

    t.prototype.getOrCreateModel = function() {
      var e = this;
      if (this._model) {
        return this._model;
      }
      var t = this._getMarkers();
      this._model = new _(this.editor, t);

      this._zone = new C(this.editor, this._model);

      this._callOnClose.push(this._model);

      this._callOnClose.push(this._zone);

      this._callOnClose.push(this.handlerService.bind({
        key: "Escape"
      }, function() {
        e._cleanUp();

        return !0;
      }, {
        once: !0,
        id: this.id
      }));

      this._callOnClose.push(this.editor.addListener2(d.EventType.ModelChanged, function() {
        e._cleanUp();
      }));

      this._callOnClose.push(this._model.addListener2(_.Events.CURRENT, function(t) {
        if (!t) {
          e._cleanUp();
        }
      }));

      this._callOnClose.push(this.markerService.addListener2(f.MarkerServiceConstants.SERVICE_CHANGED, function(t) {
        for (var n = t.markerSetEvents, i = e.editor.getModel().getAssociatedResource().toExternal(), o = 0; o <
          n.length; o++) {
          var r = n[o];
          if (r.resource.toExternal() === i) {
            var s = e._getMarkers();
            e._model.setMarkers(s);
            break;
          }
        }
      }));

      return this._model;
    };

    t.prototype._getMarkers = function() {
      var e = this.editor.getModel().getAssociatedResource();

      var t = this.markerService.getMarkerSet(e);
      return null === t ? null : t.getMarkers();
    };

    t.prototype.dispose = function() {
      e.prototype.dispose.call(this);

      this._cleanUp();
    };

    t.ID = "editor.actions.marker.next";

    return t;
  }(w);

  var S = function(e) {
    function t(t, n) {
      e.call(this, t, n, !1);
    }
    __extends(t, e);

    t.prototype.getOrCreateModel = function() {
      return this.editor.getAction(E.ID).getOrCreateModel();
    };

    t.ID = "editor.actions.marker.prev";

    return t;
  }(w);

  var x = new m.ActionDescriptor(E, E.ID, v.localize("vs_editor_contrib_gotoError_gotoError", 1), {
    ctrlCmd: !0,
    key: "."
  });

  var L = new m.ActionDescriptor(S, S.ID, v.localize("vs_editor_contrib_gotoError_gotoError", 2), {
    ctrlCmd: !0,
    shift: !0,
    key: "."
  });

  var T = g.Registry.as(c.Extensions.EditorContributions);
  T.registerEditorContribution(x);

  T.registerEditorContribution(L);
});