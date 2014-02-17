define("vs/editor/contrib/referenceSearch/referenceSearch", ["require", "exports", "vs/nls!vs/editor/editor.main",
  "vs/base/lib/winjs.base", "vs/platform/services", "vs/platform/platform", "vs/base/lifecycle", "vs/base/errors",
  "vs/editor/core/constants", "vs/editor/editorExtensions", "vs/platform/actionRegistry", "./referenceSearchWidget",
  "./referenceSearchModel"
], function(e, t, n, i, o, r, s, a, u, l, c, d, h) {
  var p = function(e) {
    function t(t, i) {
      e.call(this, t, i, l.Precondition.WidgetFocus | l.Precondition.ShowInContextMenu);

      this.requestIdPool = 0;

      this.modelRevealing = !1;

      this.callOnClear = [];

      this.label = n.localize("vs_editor_contrib_referenceSearch_referenceSearch", 0);

      this.enabled = !1;
    }
    __extends(t, e);

    t.prototype.injectEditorService = function(e) {
      this.editorService = e;
    };

    t.prototype.injectRequestService = function(e) {
      this.requestService = e;
    };

    t.prototype.injectMessageService = function(e) {
      this.messageService = e;
    };

    t.prototype.injectInjectorService = function(e) {
      this.injectorService = e;
    };

    t.prototype.injectPeekViewService = function(e) {
      this.peekViewService = e;
    };

    t.prototype.injectionDone = function() {
      this.updateEnablementState();
    };

    t.prototype.getEnablementState = function() {
      return !(this.peekViewService && this.peekViewService.isActive || !this.handlerService || !this.editorService || !
        this.requestService || !this.messageService || !e.prototype.getEnablementState.call(this) || !this.editor.getModel()
        .getMode().referenceSupport);
    };

    t.prototype.run = function() {
      var e = this;

      var t = this.editor.getSelection();

      var o = this.widget ? this.widget.position : null;

      var r = this.clear();
      if (r && o && t.containsPosition(o)) {
        return null;
      }
      var s = ++this.requestIdPool;

      var l = this.editor.getModel();

      var c = this.editor.getModel().getMode().referenceSupport;

      var p = this.telemetryService.start("findReferences", {
        mode: l.getMode().getId()
      });
      c.findReferences(l.getAssociatedResource(), t.getStartPosition()).then(function(n) {
        if (s !== e.requestIdPool) {
          p.stop();
          return void 0;
        }
        if (0 === n.length) {
          p.stop();
          return void 0;
        }
        e.model = new h.Model(n, e.requestService);

        e.model.currentReference = e.model.findReference(l.getAssociatedResource(), t.getStartPosition());
        var i = e.model.addListener(h.EventType.CurrentReferenceChanged, function() {
          if (e.model.currentReference) {
            e.modelRevealing = !0;
            e.widget.revealCurrentReference().done(function() {
              e.modelRevealing = !1;

              window.setTimeout(function() {
                if (e.editorService.getActiveEditor().getControl() === e.editor) {
                  e.widget.showReferencePreview(e.model.currentReference);
                  e.widget.showAtReference(e.model.currentReference);
                }
              }, 0);
            }, a.onUnexpectedError);
          }
        });
        e.callOnClear.push(i);

        e._startTime = Date.now();

        e.widget.setModel(e.model);

        e.widget.showAtReference(e.model.currentReference);

        e.widget.showReferencePreview(e.model.nextReference(e.model.currentReference));

        p.stop();
      }, function(t) {
        e.messageService.show(2, t);

        p.stop();
      });

      this.callOnClear.push(this.handlerService.bind({
        key: "Escape"
      }, function() {
        return e.clear();
      }, {
        once: !0,
        id: "referenceSearch"
      }).dispose);

      this.callOnClear.push(this.editor.addListener(u.EventType.ModelModeChanged, function() {
        e.clear();
      }));

      this.callOnClear.push(this.editor.addListener(u.EventType.ModelChanged, function() {
        if (!e.modelRevealing) {
          e.clear();
        }
      }));

      this.widget = new d.ReferenceWidget(this.editorService, this.requestService, this.injectorService, this.editor);

      this.widget.setTitle(n.localize("vs_editor_contrib_referenceSearch_referenceSearch", 1));

      this.widget.show(t, 18);

      this.callOnClear.push(this.widget.addListener(d.ReferenceWidget.Events.EditorDoubleClick, function(t) {
        if (t.reference) {
          e.editorService.openEditor({
            resource: t.reference,
            options: {
              selection: t.range
            }
          }, t.originalEvent.ctrlKey || t.originalEvent.metaKey).done(null, a.onUnexpectedError);
          if (!(t.originalEvent.ctrlKey || t.originalEvent.metaKey)) {
            e.clear();
          }
        }
      }));

      return i.Promise.as(this.widget);
    };

    t.prototype.clear = function() {
      this.telemetryService.log("zoneWidgetShown", {
        mode: "reference search",
        elapsedTime: Date.now() - this._startTime
      });

      s.cAll(this.callOnClear);

      this.model = null;
      var e = !1;
      this.widget && (this.widget.dispose(), this.widget = null, e = !0);

      this.editor.focus();

      this.requestIdPool += 1;

      return e;
    };

    t.ID = "editor.actions.referenceSearch.trigger";

    return t;
  }(l.EditorAction);
  t.ReferenceAction = p;
  var f = new c.ActionDescriptor(p, p.ID, n.localize("vs_editor_contrib_referenceSearch_referenceSearch", 2), {
    shift: !0,
    key: "F12"
  });

  var g = r.Registry.as(l.Extensions.EditorContributions);
  g.registerEditorContribution(f);
});