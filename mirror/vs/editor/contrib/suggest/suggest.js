var __extends = this.__extends || function(a, b) {
    function d() {
      this.constructor = a;
    }
    for (var c in b) {
      b.hasOwnProperty(c) && (a[c] = b[c]);
    }
    d.prototype = b.prototype;

    a.prototype = new d;
  };

define(["require", "exports", "vs/nls", "vs/editor/contrib/snippet/snippet", "vs/editor/core/constants",
  "./suggestWidget", "./suggestModel", "./quickSuggestWidget", "vs/base/env", "vs/base/errors",
  "vs/base/lib/winjs.base", "vs/editor/editorExtensions", "vs/platform/platform", "vs/platform/actionRegistry"
], function(a, b, c, d, e, f, g, h, i, j, k, l, m, n) {
  var o = c;

  var p = d;

  var q = e;

  var r = f;

  var s = g;

  var t = h;

  var u = i;

  var v = j;

  var w = k;

  var x = l;

  var y = m;

  var z = n;

  var A = function(a) {
    function b(b, c) {
      var d = this;
      a.call(this, b, c);

      this.model = new s.SuggestModel(this.editor, function(a, b) {
        p.InsertSnippetHelper.run(d.editor, d.handlerService, a, b);
      });

      this.quickSuggestWidget = null;

      this.suggestWidget = null;

      this.binding = null;

      this.triggerCharacterListeners = [];

      this.toUnhook.push(b.addListener(q.EventType.ConfigurationChanged, function() {
        return d.update();
      }));

      this.toUnhook.push(b.addListener(q.EventType.ModelChanged, function() {
        return d.update();
      }));

      this.toUnhook.push(b.addListener(q.EventType.ModelModeChanged, function() {
        return d.update();
      }));
    }
    __extends(b, a);

    b.prototype.injectHandlerService = function(b) {
      a.prototype.injectHandlerService.call(this, b);

      this.quickSuggestWidget || (this.quickSuggestWidget = new t.QuickSuggestWidget(this.editor, this.handlerService),
        this.quickSuggestWidget.setModel(this.model));
    };

    b.prototype.injectTelemetryService = function(b) {
      a.prototype.injectTelemetryService.call(this, b);

      this.suggestWidget || (this.suggestWidget = new r.SuggestWidget(this.editor, this.telemetryService), this.suggestWidget
        .setModel(this.model));
    };

    b.prototype.injectionDone = function() {
      this.update();
    };

    b.prototype.getEnablementState = function() {
      return a.prototype.getEnablementState.call(this) && !! this.editor.getModel().getMode().suggestSupport;
    };

    b.prototype.update = function() {
      var a = this;
      this.triggerCharacterListeners.forEach(function(a) {
        a();
      });

      this.triggerCharacterListeners = [];
      if (this.editor.getModel() && this.editor.getConfiguration().suggestOnTriggerCharacters) {
        var b = this.editor.getModel().getMode();
        if (b.suggestSupport) {
          var c = b.suggestSupport.getTriggerCharacters();

          var d = function() {
            var c = a.editor.getPosition();

            var d = a.editor.getModel().getLineContent(c.lineNumber);

            var e = a.editor.getModel().getRawLineTokens(c.lineNumber);
            b.suggestSupport.shouldAutotriggerSuggest(d, e, c.column - 1) && a.triggerSuggest(!0).done(null, v.onUnexpectedError);
          };
          for (var e = 0; e < c.length; e++) {
            this.triggerCharacterListeners.push(this.editor.addTypingListener(c[e], function() {
              return d();
            }));
          }
        }
      }
    };

    b.prototype.run = function() {
      return this.triggerSuggest(!1);
    };

    b.prototype.triggerSuggest = function(a) {
      var b = this;
      this.binding !== null && (this.binding.dispose(), this.binding = null);

      this.suggestWidget.setModel(this.model);

      this.binding = this.handlerService.bindGroup(function(a) {
        a({
          key: "Enter"
        }, function() {
          return b.accept();
        }, {
          once: !0
        });

        a({
          key: "Tab"
        }, function() {
          return b.accept();
        }, {
          once: !0
        });

        a({
          key: "Escape"
        }, function() {
          return b.cancel();
        }, {
          once: !0
        });

        a({
          key: "DownArrow"
        }, function() {
          return b.next();
        });

        a({
          key: "PageDown"
        }, function() {
          return b.nextPage();
        });

        a({
          key: "UpArrow"
        }, function() {
          return b.prev();
        });

        a({
          key: "PageUp"
        }, function() {
          return b.prevPage();
        });
      });

      this.model.trigger(!1, a);

      this.editor.focus();

      return w.Promise.as(!1);
    };

    b.prototype.dispose = function() {
      a.prototype.dispose.call(this);
      while (this.triggerCharacterListeners.length > 0) {
        this.triggerCharacterListeners.pop()();
      }
      this.quickSuggestWidget && (this.quickSuggestWidget.destroy(), this.quickSuggestWidget = null);

      this.suggestWidget && (this.suggestWidget.destroy(), this.suggestWidget = null);

      this.model && (this.model.destroy(), this.model = null);

      this.binding !== null && (this.binding.dispose(), this.binding = null);
    };

    b.prototype.accept = function() {
      return this.suggestWidget.acceptSelectedSuggestion();
    };

    b.prototype.cancel = function() {
      return this.model.cancel();
    };

    b.prototype.prevPage = function() {
      return this.suggestWidget.selectPreviousPage();
    };

    b.prototype.prev = function() {
      return this.suggestWidget.selectPrevious();
    };

    b.prototype.nextPage = function() {
      return this.suggestWidget.selectNextPage();
    };

    b.prototype.next = function() {
      return this.suggestWidget.selectNext();
    };

    b.ID = "editor.actions.triggerSuggest";

    return b;
  }(x.EditorAction);
  b.TriggerSuggestAction = A;
  var B = new z.ActionDescriptor(A, A.ID, o.localize("suggest.trigger.label", "Trigger suggest"), {
    ctrlCmd: !u.browser.isMacintosh,
    winCtrl: u.browser.isMacintosh,
    key: "Space"
  });

  var C = y.Registry.as(x.Extensions.EditorContributions);
  C.registerEditorContribution(B);
});