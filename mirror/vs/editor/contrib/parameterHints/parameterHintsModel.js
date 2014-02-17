define("vs/editor/contrib/parameterHints/parameterHintsModel", ["require", "exports", "vs/base/lib/winjs.base",
  "vs/base/lifecycle", "vs/base/async", "vs/editor/core/constants", "vs/base/eventEmitter"
], function(e, t, n, i, o, r, s) {
  var a = function(e) {
    function t(n) {
      var i = this;
      e.call(this, ["cancel", "hint", "destroy"]);

      this.editor = n;

      this.listenersToRemove = [];

      this.triggerCharactersListeners = [];

      this.throttledDelayer = new o.ThrottledDelayer(t.DELAY);

      this.active = !1;

      this.listenersToRemove.push(this.editor.addListener(r.EventType.ModelChanged, function() {
        return i.onModelChanged();
      }));

      this.listenersToRemove.push(this.editor.addListener(r.EventType.ModelModeChanged, function() {
        return i.onModelChanged();
      }));

      this.listenersToRemove.push(this.editor.addListener(r.EventType.CursorSelectionChanged, function() {
        if (i.isTriggered()) {
          i.trigger();
        }
      }));

      this.onModelChanged();
    }
    __extends(t, e);

    t.prototype.cancel = function(e) {
      if ("undefined" == typeof e) {
        e = !1;
      }

      this.active = !1;

      this.throttledDelayer.cancel();

      if (!e) {
        this.emit("cancel");
      }
    };

    t.prototype.trigger = function(e) {
      if ("undefined" == typeof e) {
        e = t.DELAY;
      }
      var n = this;
      if (this.editor.getModel().getMode().parameterHintsSupport) {
        this.cancel(!0);
        return this.throttledDelayer.trigger(function() {
          return n.doTrigger();
        }, e);
      }
    };

    t.prototype.doTrigger = function() {
      var e = this;

      var t = this.editor.getModel();
      if (!t || !t.getMode().parameterHintsSupport) {
        return n.Promise.as(!1);
      }
      var i = t.getMode().parameterHintsSupport;
      return i.getParameterHints(t.getAssociatedResource(), this.editor.getPosition()).then(function(t) {
        if (!t || 0 === t.signatures.length) {
          e.cancel();
          e.emit("cancel");
          return !1;
        }
        e.active = !0;
        var n = {
          hints: t
        };
        e.emit("hint", n);

        return !0;
      });
    };

    t.prototype.isTriggered = function() {
      return this.active || this.throttledDelayer.isTriggered();
    };

    t.prototype.onModelChanged = function() {
      var e = this;
      if (this.triggerCharactersListeners = i.disposeAll(this.triggerCharactersListeners), this.editor.getModel()) {
        var t = this.editor.getModel().getMode();
        if (t.parameterHintsSupport) {
          this.triggerCharactersListeners = t.parameterHintsSupport.getParameterHintsTriggerCharacters().map(function(
            n) {
            var i = e.editor.addTypingListener(n, function() {
              var n = e.editor.getPosition();

              var i = e.editor.getModel().getLineContent(n.lineNumber);

              var o = e.editor.getModel().getRawLineTokens(n.lineNumber);
              if (t.parameterHintsSupport.shouldTriggerParameterHints(i, o, n.column - 1)) {
                e.trigger();
              }
            });
            return {
              dispose: i
            };
          });
        }
      }
    };

    t.prototype.dispose = function() {
      this.cancel(!0);

      this.triggerCharactersListeners = i.disposeAll(this.triggerCharactersListeners);

      if (this.listenersToRemove) {
        this.listenersToRemove.forEach(function(e) {
          e();
        });
        this.listenersToRemove = null;
      }

      this.emit("destroy", null);

      e.prototype.dispose.call(this);
    };

    t.DELAY = 120;

    return t;
  }(s.EventEmitter);
  t.ParameterHintsModel = a;
});