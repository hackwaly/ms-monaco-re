define("vs/editor/contrib/suggest/suggestModel", ["require", "exports", "vs/editor/contrib/snippet/snippet",
  "vs/base/lib/winjs.base", "vs/editor/core/constants", "vs/base/eventEmitter", "vs/base/strings",
  "vs/base/performance/timer", "vs/editor/contrib/parameterHints/parameterHints"
], function(e, t, n, i, o, r, s, a, u) {
  var l;
  ! function(e) {
    e[e.NOT_ACTIVE = 0] = "NOT_ACTIVE";

    e[e.MANUAL_TRIGGER = 1] = "MANUAL_TRIGGER";

    e[e.AUTO_TRIGGER = 2] = "AUTO_TRIGGER";
  }(l || (l = {}));
  var c = function() {
    function e(e, t) {
      if ("undefined" == typeof t) {
        t = e.getPosition();
      }
      var n = e.getModel();

      var i = n.getLineContent(t.lineNumber);
      this.wordBefore = "";
      var o = n.getWordAtPosition(t, !1, !0);
      if (o) {
        this.wordBefore = i.substring(o.startColumn - 1, t.column - 1);
      }

      this.lineNumber = t.lineNumber;

      this.column = t.column;

      this.lineContentBefore = i.substr(0, t.column - 1);

      this.lineContentAfter = i.substr(t.column - 1);
    }
    e.prototype.isValidForAutoSuggest = function() {
      return /^\s*$/.test(this.lineContentAfter) ? 0 === this.wordBefore.length ? !1 : !0 : !1;
    };

    e.prototype.isValidForNewContext = function(e) {
      return this.lineNumber !== e.lineNumber ? !1 : e.column < this.column - this.wordBefore.length ? !1 : 0 !== e.lineContentBefore
        .indexOf(this.lineContentBefore) || this.lineContentAfter !== e.lineContentAfter ? !1 : "" === e.wordBefore &&
        e.lineContentBefore !== this.lineContentBefore ? !1 : !0;
    };

    e.prototype.isValidForRetrigger = function(e) {
      return 0 !== this.lineContentBefore.indexOf(e.lineContentBefore) || this.lineContentAfter !== e.lineContentAfter ? !
        1 : this.lineContentBefore.length > e.lineContentBefore.length && 0 === this.wordBefore.length ? !1 : !0;
    };

    return e;
  }();

  var d = function(e) {
    function t(t, n) {
      var i = this;
      e.call(this);

      this.editor = t;

      this.onAccept = n;

      this.listenersToRemove = [];

      this.autoSuggestDelay = this.editor.getConfiguration().quickSuggestionsDelay;

      if (isNaN(this.autoSuggestDelay) || !this.autoSuggestDelay && 0 !== this.autoSuggestDelay || this.autoSuggestDelay >
        2e3 || this.autoSuggestDelay < 0) {
        this.autoSuggestDelay = 500;
      }

      this.triggerAutoSuggestPromise = null;

      this.state = 0;

      this.requestPromise = null;

      this.suggestions = null;

      this.requestContext = null;

      this.listenersToRemove.push(this.editor.addListener(o.EventType.CursorSelectionChanged, function(e) {
        return e.selection.isEmpty() ? "mouse" === e.source ? (i.cancel(), void 0) : (i.onCursorChange(), void 0) :
          (i.cancel(), void 0);
      }));

      this.listenersToRemove.push(this.editor.addListener(o.EventType.ModelChanged, function() {
        i.cancel();
      }));
    }
    __extends(t, e);

    t.prototype.cancel = function(e, t) {
      if ("undefined" == typeof e) {
        e = !1;
      }

      if ("undefined" == typeof t) {
        t = !1;
      }
      var n = 0 !== this.state;
      this.triggerAutoSuggestPromise && (this.triggerAutoSuggestPromise.cancel(), this.triggerAutoSuggestPromise =
        null);

      this.requestPromise && (this.requestPromise.cancel(), this.requestPromise = null);

      this.state = 0;

      this.suggestions = null;

      this.requestContext = null;

      e || this.emit("cancel", {
        retrigger: t
      });

      return n;
    };

    t.prototype.isAutoSuggest = function() {
      return 2 === this.state;
    };

    t.prototype.onCursorChange = function() {
      var e = this;
      if (this.editor.getModel().getMode().suggestSupport) {
        var t = new c(this.editor);
        if (0 === this.state) {
          this.cancel();
          if (t.isValidForAutoSuggest()) {
            this.triggerAutoSuggestPromise = i.Promise.timeout(this.autoSuggestDelay);
            this.triggerAutoSuggestPromise.then(function() {
              e.triggerAutoSuggestPromise = null;

              e.trigger(!0, !1);
            });
          }
        } else {
          this.onNewContext(t);
        }
      }
    };

    t.prototype.trigger = function(e, t, n) {
      if ("undefined" == typeof n) {
        n = !1;
      }
      var i = this;

      var o = this.editor.getModel();

      var r = o.getMode().suggestSupport;
      if (r) {
        var s = a.start(0, "suggest/TRIGGER");
        this.cancel(!1, n);

        this.state = e ? 2 : 1;

        this.emit("loading", {
          auto: this.isAutoSuggest(),
          characterTriggered: t,
          retrigger: n
        });

        this.requestContext = new c(this.editor);
        var u = a.start(0, "suggest/REQUEST");
        this.requestPromise = r.suggest(o.getAssociatedResource(), this.editor.getPosition());

        this.requestPromise.then(function(e) {
          u.stop();

          i.requestPromise = null;

          if (e.suggestions && e.suggestions.length > 0) {
            i.suggestions = e.suggestions;
            i.onNewContext(new c(i.editor));
          } else {
            i.emit("empty");
          }

          s.stop();
        }, function() {
          u.stop();

          s.stop();
        });
      }
    };

    t.prototype.onNewContext = function(e) {
      if (!this.requestContext.isValidForNewContext(e)) {
        this.requestContext.isValidForRetrigger(e) ? this.trigger(2 === this.state, !1, !0) : this.cancel();
        return void 0;
      }
      if (this.suggestions) {
        var t = this.editor.getModel().getMode().suggestSupport;

        var n = this.suggestions;

        var i = t.getFilter();
        if (i) {
          n = n.filter(i.bind(null, e.wordBefore));
        }

        n = n.sort(function(e, t) {
          return s.localeCompare(e.label.toLowerCase(), t.label.toLowerCase());
        });

        if (n.length > 0) {
          this.emit("suggest", {
            suggestions: {
              suggestions: n,
              currentWord: e.wordBefore
            },
            auto: this.isAutoSuggest()
          });
        } else {
          this.emit("empty");
        }
      }
    };

    t.prototype.accept = function(e) {
      if (!e && null === this.suggestions) {
        return !1;
      }
      e = e || this.suggestions[0];

      this.cancel();
      var t = new c(this.editor);
      this.onAccept(new n.CodeSnippet(e.codeSnippet), t.wordBefore.length);
      var i = this.editor.getAction(u.TriggerParameterHintsAction.ID);

      var o = i ? i.getModel() : null;
      o && o.doTrigger();

      return !0;
    };

    t.prototype.destroy = function() {
      this.cancel(!0);

      if (this.listenersToRemove) {
        this.listenersToRemove.forEach(function(e) {
          e();
        });
        this.listenersToRemove = null;
      }

      this.emit("destroy", null);
    };

    return t;
  }(r.EventEmitter);
  t.SuggestModel = d;
});