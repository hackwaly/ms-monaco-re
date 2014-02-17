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

define(["require", "exports", "vs/editor/contrib/snippet/snippet", "vs/base/lib/winjs.base", "vs/editor/core/constants",
  "vs/editor/core/range", "vs/base/eventEmitter", "vs/base/strings", "vs/base/performance/timer",
  "vs/editor/contrib/parameterHints/parameterHints"
], function(a, b, c, d, e, f, g, h, i, j) {
  var k = c;

  var l = d;

  var m = e;

  var n = f;

  var o = g;

  var p = h;

  var q = i;

  var r = j;

  var s;
  (function(a) {
    a[a.NOT_ACTIVE = 0] = "NOT_ACTIVE";

    a[a.MANUAL_TRIGGER = 1] = "MANUAL_TRIGGER";

    a[a.AUTO_TRIGGER = 2] = "AUTO_TRIGGER";
  })(s || (s = {}));
  var t = function() {
    function a(a, b) {
      if (typeof b == "undefined") {
        b = a.getPosition();
      }
      var c = a.getModel();

      var d = c.getLineContent(b.lineNumber);
      this.wordBefore = "";
      var e = c.getWordAtPosition(b, !1);
      if (e) {
        this.wordBefore = d.substring(e.startColumn - 1, b.column - 1);
      }

      this.lineNumber = b.lineNumber;

      this.column = b.column;

      this.lineContentBefore = d.substr(0, b.column - 1);

      this.lineContentAfter = d.substr(b.column - 1);
    }
    a.prototype.isValidForAutoSuggest = function() {
      return /^\s*$/.test(this.lineContentAfter) ? this.wordBefore.length === 0 ? !1 : !0 : !1;
    };

    a.prototype.isValidForNewContext = function(a) {
      return this.lineNumber !== a.lineNumber ? !1 : a.column < this.column - this.wordBefore.length ? !1 : a.lineContentBefore
        .indexOf(this.lineContentBefore) !== 0 || this.lineContentAfter !== a.lineContentAfter ? !1 : a.wordBefore ===
        "" && a.lineContentBefore !== this.lineContentBefore ? !1 : !0;
    };

    a.prototype.isValidForRetrigger = function(a) {
      return this.lineContentBefore.indexOf(a.lineContentBefore) !== 0 || this.lineContentAfter !== a.lineContentAfter ? !
        1 : this.lineContentBefore.length > a.lineContentBefore.length && this.wordBefore.length === 0 ? !1 : !0;
    };

    return a;
  }();

  var u = function(a) {
    function b(b, c) {
      var d = this;
      a.call(this);

      this.editor = b;

      this.onAccept = c;

      this.listenersToRemove = [];

      this.autoSuggestDelay = this.editor.getConfiguration().quickSuggestionsDelay;
      if (isNaN(this.autoSuggestDelay) || !this.autoSuggestDelay && this.autoSuggestDelay !== 0 || this.autoSuggestDelay >
        2e3 || this.autoSuggestDelay < 0) {
        this.autoSuggestDelay = 500;
      }
      this.triggerAutoSuggestPromise = null;

      this.state = s.NOT_ACTIVE;

      this.requestPromise = null;

      this.suggestions = null;

      this.requestContext = null;

      this.listenersToRemove.push(this.editor.addListener(m.EventType.CursorSelectionChanged, function(a) {
        if (!a.selection.isEmpty()) {
          d.cancel();
          return;
        }
        if (a.source === "mouse") {
          d.cancel();
          return;
        }
        d.onCursorChange();
      }));
    }
    __extends(b, a);

    b.prototype.cancel = function(a, b) {
      if (typeof a == "undefined") {
        a = !1;
      }

      if (typeof b == "undefined") {
        b = !1;
      }
      var c = this.state !== s.NOT_ACTIVE;
      this.triggerAutoSuggestPromise && (this.triggerAutoSuggestPromise.cancel(), this.triggerAutoSuggestPromise =
        null);

      this.requestPromise && (this.requestPromise.cancel(), this.requestPromise = null);

      this.state = s.NOT_ACTIVE;

      this.suggestions = null;

      this.requestContext = null;

      a || this.emit("cancel", {
        retrigger: b
      });

      return c;
    };

    b.prototype.isAutoSuggest = function() {
      return this.state === s.AUTO_TRIGGER;
    };

    b.prototype.onCursorChange = function() {
      var a = this;
      if (!this.editor.getModel().getMode().suggestSupport) return;
      var b = new t(this.editor);
      this.state === s.NOT_ACTIVE ? (this.cancel(), b.isValidForAutoSuggest() && (this.triggerAutoSuggestPromise = l.Promise
        .timeout(this.autoSuggestDelay), this.triggerAutoSuggestPromise.then(function() {
          a.triggerAutoSuggestPromise = null;

          a.trigger(!0, !1);
        }))) : this.onNewContext(b);
    };

    b.prototype.trigger = function(a, b, c) {
      if (typeof c == "undefined") {
        c = !1;
      }
      var d = this;

      var e = this.editor.getModel();

      var f = e.getMode().suggestSupport;
      if (!f) return;
      var g = q.start(q.Topic.EDITOR, "suggest/TRIGGER");
      this.cancel(!1, c);

      this.state = a ? s.AUTO_TRIGGER : s.MANUAL_TRIGGER;

      this.emit("loading", {
        auto: this.isAutoSuggest(),
        characterTriggered: b,
        retrigger: c
      });

      this.requestContext = new t(this.editor);
      var h = q.start(q.Topic.EDITOR, "suggest/REQUEST");
      this.requestPromise = f.suggest(e.getAssociatedResource(), this.editor.getPosition());

      this.requestPromise.then(function(a) {
        h.stop();

        d.requestPromise = null;

        a.suggestions && a.suggestions.length > 0 ? (d.suggestions = a.suggestions, d.onNewContext(new t(d.editor))) :
          d.emit("empty");

        g.stop();
      }, function() {
        h.stop();

        g.stop();
      });
    };

    b.prototype.onNewContext = function(a) {
      if (!this.requestContext.isValidForNewContext(a)) {
        this.requestContext.isValidForRetrigger(a) ? this.trigger(this.state === s.AUTO_TRIGGER, !1, !0) : this.cancel();
        return;
      }
      if (this.suggestions) {
        var b = this.editor.getModel().getMode().suggestSupport;

        var c = this.suggestions;

        var d = b.getFilter();
        if (d) {
          c = c.filter(d.bind(null, a.wordBefore));
        }

        c = c.sort(function(a, b) {
          return p.localeCompare(a.label.toLowerCase(), b.label.toLowerCase());
        });

        c.length > 0 ? this.emit("suggest", {
          suggestions: {
            suggestions: c,
            currentWord: a.wordBefore
          },
          auto: this.isAutoSuggest()
        }) : this.emit("empty");
      }
    };

    b.prototype.accept = function(a) {
      if (!a && this.suggestions === null) {
        return !1;
      }
      a = a || this.suggestions[0];

      this.cancel();
      var b = new t(this.editor);

      var c = new n.Range(b.lineNumber, b.column - b.wordBefore.length, b.lineNumber, b.column);
      this.onAccept(new k.CodeSnippet(a.codeSnippet), c);
      var d = this.editor.getAction(r.TriggerParameterHintsAction.ID);

      var e = d ? d.getModel() : null;
      e && e.doTrigger();

      return !0;
    };

    b.prototype.destroy = function() {
      this.cancel(!0);

      if (this.listenersToRemove) {
        this.listenersToRemove.forEach(function(a) {
          a();
        });
        this.listenersToRemove = null;
      }

      this.emit("destroy", null);
    };

    return b;
  }(o.EventEmitter);
  b.SuggestModel = u;
});