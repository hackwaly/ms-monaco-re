define("vs/editor/contrib/suggest/suggest", ["require", "exports", "vs/nls!vs/editor/editor.main",
  "vs/editor/contrib/snippet/snippet", "vs/editor/core/constants", "./suggestWidget", "./suggestModel",
  "./quickSuggestWidget", "vs/base/env", "vs/base/errors", "vs/base/lib/winjs.base", "vs/editor/editorExtensions",
  "vs/platform/platform", "vs/platform/actionRegistry"
], function(e, t, n, i, o, r, s, a, u, l, c, d, h, p) {
  var f = function(e) {
    function t(t, n) {
      var r = this;
      e.call(this, t, n);

      this.model = new s.SuggestModel(this.editor, function(e, t) {
        i.InsertSnippetHelper.run(r.editor, r.handlerService, e, t);
      });

      this.quickSuggestWidget = null;

      this.suggestWidget = null;

      this.binding = null;

      this.triggerCharacterListeners = [];

      this.toUnhook.push(t.addListener(o.EventType.ConfigurationChanged, function() {
        return r.update();
      }));

      this.toUnhook.push(t.addListener(o.EventType.ModelChanged, function() {
        return r.update();
      }));

      this.toUnhook.push(t.addListener(o.EventType.ModelModeChanged, function() {
        return r.update();
      }));
    }
    __extends(t, e);

    t.prototype.injectHandlerService = function(t) {
      e.prototype.injectHandlerService.call(this, t);

      if (!this.quickSuggestWidget) {
        this.quickSuggestWidget = new a.QuickSuggestWidget(this.editor, this.handlerService);
        this.quickSuggestWidget.setModel(this.model);
      }
    };

    t.prototype.injectTelemetryService = function(t) {
      e.prototype.injectTelemetryService.call(this, t);

      if (!this.suggestWidget) {
        this.suggestWidget = new r.SuggestWidget(this.editor, this.telemetryService);
        this.suggestWidget.setModel(this.model);
      }
    };

    t.prototype.injectionDone = function() {
      this.update();
    };

    t.prototype.getEnablementState = function() {
      return e.prototype.getEnablementState.call(this) && !! this.editor.getModel().getMode().suggestSupport;
    };

    t.prototype.update = function() {
      var e = this;
      if (this.triggerCharacterListeners.forEach(function(e) {
        e();
      }), this.triggerCharacterListeners = [], this.editor.getModel() && this.editor.getConfiguration().suggestOnTriggerCharacters) {
        var t = this.editor.getModel().getMode();
        if (t.suggestSupport)
          for (var n = t.suggestSupport.getTriggerCharacters(), i = function() {
              var n = e.editor.getPosition(),
                i = e.editor.getModel().getLineContent(n.lineNumber),
                o = e.editor.getModel().getRawLineTokens(n.lineNumber);
              t.suggestSupport.shouldAutotriggerSuggest(i, o, n.column - 1) && e.triggerSuggest(!0).done(null, l.onUnexpectedError);
            }, o = 0; o < n.length; o++) {
            this.triggerCharacterListeners.push(this.editor.addTypingListener(n[o], function() {
              return i();
            }));
          }
      }
    };

    t.prototype.run = function() {
      return this.triggerSuggest(!1);
    };

    t.prototype.triggerSuggest = function(e) {
      var t = this;
      null !== this.binding && (this.binding.dispose(), this.binding = null);

      this.suggestWidget.setModel(this.model);

      this.binding = this.handlerService.bindGroup(function(e) {
        e({
          key: "Enter"
        }, function() {
          return t.accept();
        }, {
          once: !0
        });

        e({
          key: "Tab"
        }, function() {
          return t.accept();
        }, {
          once: !0
        });

        e({
          key: "Escape"
        }, function() {
          return t.cancel();
        }, {
          once: !0
        });

        e({
          key: "DownArrow"
        }, function() {
          return t.next();
        });

        e({
          key: "PageDown"
        }, function() {
          return t.nextPage();
        });

        e({
          key: "UpArrow"
        }, function() {
          return t.prev();
        });

        e({
          key: "PageUp"
        }, function() {
          return t.prevPage();
        });
      });

      this.model.trigger(!1, e);

      this.editor.focus();

      return c.TPromise.as(!1);
    };

    t.prototype.dispose = function() {
      for (e.prototype.dispose.call(this); this.triggerCharacterListeners.length > 0;) {
        this.triggerCharacterListeners.pop()();
      }
      if (this.quickSuggestWidget) {
        this.quickSuggestWidget.destroy();
        this.quickSuggestWidget = null;
      }

      if (this.suggestWidget) {
        this.suggestWidget.destroy();
        this.suggestWidget = null;
      }

      if (this.model) {
        this.model.destroy();
        this.model = null;
      }

      if (null !== this.binding) {
        this.binding.dispose();
        this.binding = null;
      }
    };

    t.prototype.accept = function() {
      return this.suggestWidget.acceptSelectedSuggestion();
    };

    t.prototype.cancel = function() {
      return this.model.cancel();
    };

    t.prototype.prevPage = function() {
      return this.suggestWidget.selectPreviousPage();
    };

    t.prototype.prev = function() {
      return this.suggestWidget.selectPrevious();
    };

    t.prototype.nextPage = function() {
      return this.suggestWidget.selectNextPage();
    };

    t.prototype.next = function() {
      return this.suggestWidget.selectNext();
    };

    t.ID = "editor.actions.triggerSuggest";

    return t;
  }(d.EditorAction);
  t.TriggerSuggestAction = f;
  var g = new p.ActionDescriptor(f, f.ID, n.localize("vs_editor_contrib_suggest_suggest", 0), {
    ctrlCmd: !u.browser.isMacintosh,
    winCtrl: u.browser.isMacintosh,
    key: "Space"
  });

  var m = h.Registry.as(d.Extensions.EditorContributions);
  m.registerEditorContribution(g);
});