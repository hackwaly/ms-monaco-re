var __extends = this.__extends || function(a, b) {
    function d() {
      this.constructor = a
    }
    for (var c in b) b.hasOwnProperty(c) && (a[c] = b[c]);
    d.prototype = b.prototype, a.prototype = new d
  };
define(["require", "exports", "vs/base/dom/dom", "vs/base/lib/winjs.base", "vs/editor/contrib/zoneWidget/zoneWidget",
  "vs/base/dom/builder", "vs/base/eventEmitter", "vs/editor/editorExtensions", "vs/editor/core/constants",
  "vs/editor/core/position", "vs/editor/core/range", "vs/platform/services", "vs/platform/markers/markers",
  "vs/platform/platform", "vs/platform/actionRegistry", "vs/nls", "vs/css!./gotoError"
], function(a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p) {
  var q = c,
    r = d,
    s = e,
    t = f,
    u = g,
    v = h,
    w = i,
    x = j,
    y = k,
    z = l,
    A = m,
    B = n,
    C = o,
    D = p,
    E = function(a) {
      function b(b, c) {
        var d = this;
        a.call(this), this.editor = b, this.markers = null, this.nextIdx = -1, this.disposed = !1, this.toUnbind = [],
          this.ignoreSelectionChange = !1, this.setMarkers(c), this.toUnbind.push(this.editor.addListener(w.EventType
            .Disposed, function() {
              return d.dispose()
            })), this.toUnbind.push(this.editor.addListener(w.EventType.CursorPositionChanged, function() {
            d.ignoreSelectionChange || (d.nextIdx = -1)
          }))
      }
      return __extends(b, a), b.prototype.setMarkers = function(a) {
        this.markers = a || [], this.markers.sort(function(a, b) {
          return a.range.startLineNumber === b.range.startLineNumber ? a.range.startColumn - b.range.startColumn :
            a.range.startLineNumber - b.range.startLineNumber
        }), this.nextIdx = -1, this.emit(b.Events.MARKER_SET, this)
      }, b.prototype.withoutWatchingEditorPosition = function(a) {
        this.ignoreSelectionChange = !0;
        try {
          a()
        } finally {
          this.ignoreSelectionChange = !1
        }
      }, b.prototype.initIdx = function(a) {
        var b = !1,
          c = this.editor.getPosition();
        for (var d = 0, e = this.markers.length; d < e && !b; d++) {
          var f = new y.Range(this.markers[d].range.startLineNumber, this.markers[d].range.startColumn, this.markers[
            d].range.endLineNumber, this.markers[d].range.endColumn);
          c.isBeforeOrEqual(f.getStartPosition()) && (this.nextIdx = d + (a ? 0 : -1), b = !0)
        }
        b || (this.nextIdx = a ? 0 : this.markers.length - 1), this.nextIdx < 0 && (this.nextIdx = this.markers.length -
          1)
      }, b.prototype.move = function(a) {
        if (!this.canNavigate()) {
          this.emit(b.Events.CURRENT, null);
          return
        }
        this.nextIdx === -1 ? this.initIdx(a) : a ? (this.nextIdx += 1, this.nextIdx >= this.markers.length && (this.nextIdx =
          0)) : (this.nextIdx -= 1, this.nextIdx < 0 && (this.nextIdx = this.markers.length - 1));
        var c = this.markers[this.nextIdx];
        this.emit(b.Events.CURRENT, c)
      }, b.prototype.canNavigate = function() {
        return this.markers.length > 0
      }, b.prototype.next = function() {
        this.move(!0)
      }, b.prototype.previous = function() {
        this.move(!1)
      }, b.prototype.reveal = function() {
        var a = this;
        if (this.nextIdx === -1) return;
        this.withoutWatchingEditorPosition(function() {
          var b = new x.Position(a.markers[a.nextIdx].range.startLineNumber, a.markers[a.nextIdx].range.startColumn);
          a.editor.setPosition(b, !0, !0, !0)
        })
      }, b.prototype.dispose = function() {
        while (this.toUnbind.length > 0) this.toUnbind.pop()();
        this.markers = null, this.disposed = !0, a.prototype.dispose.call(this)
      }, b.Events = {
        CURRENT: "onMarker",
        MARKER_SET: "onNewMarkerSet"
      }, b
    }(u.EventEmitter),
    F = {
      showFrame: !0,
      showAbove: !1
    }, G = function(a) {
      function b(b, c) {
        a.call(this, b, F), this.model = c, this.element = null, this.unhook = function() {}, this.create(), this.wireModelAndView()
      }
      return __extends(b, a), b.prototype.fillContainer = function(a) {
        var b = this,
          c = t.withElement(a).addClass("marker-widget");
        c.div(function(a) {
          b.element = a
        }), c.div(function(a) {
          b.quickFixLabel = a
        }), c.on(q.EventType.CLICK, function() {
          b.editor.focus()
        })
      }, b.prototype.wireModelAndView = function() {
        var a = this;
        this.unhook = this.model.addListener(E.Events.CURRENT, function(b) {
          return a.showAtMarker(b)
        })
      }, b.prototype.showAtMarker = function(a) {
        var b = this;
        if (!a) return;
        switch (a.severity) {
          case A.Severity.Error:
            this.options.frameColor = "#ff5a5a";
            break;
          case A.Severity.Warning:
          case A.Severity.Info:
            this.options.frameColor = "#5aac5a"
        }
        this.element.text(a.text);
        var c = this.editor.getModel().getMode();
        this.quickFixLabel.hide();
        if (a.severity === A.Severity.Error && c.quickFixSupport) {
          var d = a.range.startColumn > 1 && this.editor.getModel().getLineContent(a.range.startLineNumber).charAt(a.range
            .startColumn - 1 - 1) === ".";
          if (d) {
            var e = c.quickFixSupport.quickFix(this.editor.getModel().getAssociatedResource(), {
              lineNumber: a.range.endLineNumber,
              column: a.range.endColumn
            });
            e.then(function(a) {
              if (a.length > 0) {
                var c = a.map(function(a) {
                  return a.label
                });
                b.quickFixLabel.show().text(D.localize("quickFix.label", "Did you mean: {0}", c.join(", ")))
              }
            }).done()
          }
        }
        this.model.withoutWatchingEditorPosition(function() {
          b.show(new x.Position(a.range.startLineNumber, a.range.startColumn), 3)
        })
      }, b.prototype.dispose = function() {
        this.unhook(), a.prototype.dispose.call(this)
      }, b
    }(s.ZoneWidget),
    H = function(a) {
      function b(b, c, d) {
        a.call(this, b, c), this.handlerService = null, this.markerService = null, this.isNext = d
      }
      return __extends(b, a), b.prototype.injectMarkerService = function(a) {
        this.markerService = a
      }, b.prototype.injectionDone = function() {
        this.updateEnablementState()
      }, b.prototype.getEnablementState = function() {
        return !!this.markerService && !! this.handlerService && a.prototype.getEnablementState.call(this)
      }, b.prototype.getOrCreateModel = function() {
        throw new Error("Abstract method")
      }, b.prototype.run = function() {
        var a = this.getOrCreateModel();
        return this.telemetryService.log("zoneWidgetShown", {
          mode: "go to error"
        }), a && (this.isNext ? a.next() : a.previous(), a.reveal()), r.Promise.as(!0)
      }, b
    }(v.EditorAction),
    I = function(a) {
      function b(b, c) {
        a.call(this, b, c, !0), this.model = null, this.zone = null, this.moreToUnhook = []
      }
      return __extends(b, a), b.prototype.cleanUp = function() {
        while (this.toUnhook.length > 0) this.toUnhook.pop()();
        this.zone && (this.zone.dispose(), this.zone = null), this.model && (this.model.dispose(), this.model = null)
      }, b.prototype.getOrCreateModel = function() {
        var a = this;
        if (this.model) return this.model;
        var b = this.getMarkers();
        return this.model = new E(this.editor, b), this.zone = new G(this.editor, this.model), this.toUnhook.push(
          this.handlerService.bind({
            key: "Escape"
          }, function() {
            return a.cleanUp(), !0
          }, {
            once: !0,
            id: this.id
          }).dispose), this.toUnhook.push(this.editor.addListener(w.EventType.ModelChanged, function() {
          a.cleanUp()
        })), this.toUnhook.push(this.model.addListener(E.Events.CURRENT, function(b) {
          b || a.cleanUp()
        })), this.toUnhook.push(this.markerService.addListener(z.MarkerServiceConstants.SERVICE_CHANGED, function(b) {
          var c = b.markerSetEvents,
            d = a.editor.getModel().getAssociatedResource().toExternal();
          for (var e = 0; e < c.length; e++) {
            var f = c[e];
            if (f.resource.toExternal() === d) {
              var g = a.getMarkers();
              a.model.setMarkers(g);
              break
            }
          }
        })), this.model
      }, b.prototype.getMarkers = function() {
        var a = this.editor.getModel().getAssociatedResource(),
          b = this.markerService.getMarkerSet(a);
        return b === null ? null : b.getMarkers()
      }, b.prototype.dispose = function() {
        a.prototype.dispose.call(this), this.cleanUp()
      }, b.ID = "editor.actions.marker.next", b
    }(H),
    J = function(a) {
      function b(b, c) {
        a.call(this, b, c, !1)
      }
      return __extends(b, a), b.prototype.getOrCreateModel = function() {
        return this.editor.getAction(I.ID).getOrCreateModel()
      }, b.ID = "editor.actions.marker.prev", b
    }(H),
    K = new C.ActionDescriptor(I, I.ID, D.localize("markerAction.next.label", "Go to next marker"), {
      ctrlCmd: !0,
      key: ","
    }),
    L = new C.ActionDescriptor(J, J.ID, D.localize("markerAction.previous.label", "Go to previous marker"), {
      ctrlCmd: !0,
      shift: !0,
      key: ","
    }),
    M = B.Registry.as(v.Extensions.EditorContributions);
  M.registerEditorContribution(K), M.registerEditorContribution(L)
})