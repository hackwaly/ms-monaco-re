define("vs/editor/contrib/suggest/quickSuggestWidget", ["require", "exports", "vs/base/dom/builder", "vs/base/dom/dom",
  "vs/base/dom/mouseEvent", "vs/editor/editor", "vs/css!./quickSuggest"
], function(e, t, n, i, o) {
  function r(e, t) {
    if ("snippet" === t.type || "text" === t.type) {
      return !1;
    }
    var n = t.highlights;
    if (1 !== n.length || n[0].start > 0) {
      return !1;
    }
    var i = t.label;
    return i.length === e.length ? !1 : !0;
  }
  var s = n.$;
  t.QUICK_SUGGEST_WIDGET_ID = "editor.widget.quickSuggestWidget";
  var a = function() {
    function e(e, n) {
      var r = this;
      this.editor = e;

      this.handlerService = n;

      this.modelListenersToRemove = [];

      this.model = null;

      this.isVisible = !1;

      this.currentSuggestion = null;

      this.currentSuggestionIndex = -1;

      this.suggestions = null;

      this.currentWord = null;

      this.builder = s().div({
        "class": "editor-widget quick-suggest-widget"
      });

      this.bindings = this.handlerService.bindGroup(function(e) {
        var t = function() {
          return r.currentSuggestion ? r.model.accept(r.currentSuggestion) : void 0;
        };

        var n = function() {
          return 1 === r.suggestions.length ? t() : r.currentSuggestion ? (r.next(), !0) : !1;
        };

        var i = function() {
          return r.currentSuggestion ? (r.previous(), !0) : !1;
        };

        var o = function() {
          return r.model.cancel();
        };
        e({
          key: "Tab"
        }, n);

        e({
          shift: !0,
          key: "Tab"
        }, i);

        e({
          key: "RightArrow"
        }, t);

        e({
          key: "Escape"
        }, o);
      }, {
        id: t.QUICK_SUGGEST_WIDGET_ID
      });

      this.bindings.deactivate();

      this.listenersToRemove = [];

      this.listenersToRemove.push(i.addListener(this.getDomNode(), "mousedown", function(e) {
        (new o.StandardMouseEvent(e)).preventDefault();
      }));

      this.listenersToRemove.push(e.addListener("blur", function() {
        r.cancel();
      }));

      this.editor.addContentWidget(this);
    }
    e.prototype.setModel = function(e) {
      var t = this;
      this.releaseModel();

      this.model = e;

      this.modelListenersToRemove.push(this.model.addListener("suggest", function(e) {
        if (t.editor.getConfiguration().quickSuggestions) {
          if (e.auto) {
            t.currentWord = e.suggestions.currentWord;
            t.suggestions = e.suggestions.suggestions.filter(r.bind(null, t.currentWord));
            t.currentSuggestionIndex = 0;
            t.currentSuggestion = t.suggestions[t.currentSuggestionIndex];
            t.onSuggestions();
          } else {
            t.cancel();
          }
        }
      }));

      this.modelListenersToRemove.push(this.model.addListener("refilter", function(e) {
        if (t.editor.getConfiguration().quickSuggestions)
          if (e.auto) {
            var n = t.suggestions[t.currentSuggestionIndex];
            t.suggestions = t.suggestions.filter(e.filter);

            t.currentSuggestionIndex = 0;
            for (var i = 0; i < t.suggestions.length; i++)
              if (t.suggestions[i] === n) {
                t.currentSuggestionIndex = i;
                break;
              }
            t.currentSuggestion = t.suggestions[t.currentSuggestionIndex];

            t.currentWord = e.currentWord;

            t.onSuggestions();
          } else {
            t.cancel();
          }
      }));

      this.modelListenersToRemove.push(this.model.addListener("empty", function() {
        return t.cancel();
      }));

      this.modelListenersToRemove.push(this.model.addListener("cancel", function() {
        return t.cancel();
      }));
    };

    e.prototype.onSuggestions = function() {
      return this.suggestions.length ? (this.render(), void 0) : (this.hide(), void 0);
    };

    e.prototype.next = function() {
      this.currentSuggestionIndex = (this.currentSuggestionIndex + 1) % this.suggestions.length;

      this.currentSuggestion = this.suggestions[this.currentSuggestionIndex];

      this.render();
    };

    e.prototype.previous = function() {
      this.currentSuggestionIndex = --this.currentSuggestionIndex < 0 ? this.suggestions.length - 1 : this.currentSuggestionIndex;

      this.currentSuggestion = this.suggestions[this.currentSuggestionIndex];

      this.render();
    };

    e.prototype.render = function() {
      this.builder.text(this.currentSuggestion.label.substring(this.currentWord.length));

      this.show();
    };

    e.prototype.cancel = function() {
      this.currentSuggestion = null;

      this.hide();
    };

    e.prototype.releaseModel = function() {
      for (var e; e = this.modelListenersToRemove.pop();) {
        e();
      }
      this.model = null;
    };

    e.prototype.show = function() {
      this.isVisible = !0;

      this.builder.display("block");

      this.bindings.activate();

      this.editor.layoutContentWidget(this);
    };

    e.prototype.hide = function() {
      this.isVisible = !1;

      this.bindings.deactivate();

      this.builder.display("none");

      this.editor.layoutContentWidget(this);
    };

    e.prototype.getPosition = function() {
      return this.isVisible ? {
        position: this.editor.getPosition(),
        preference: [0]
      } : null;
    };

    e.prototype.getId = function() {
      return e.ID;
    };

    e.prototype.getDomNode = function() {
      return this.builder.getHTMLElement();
    };

    e.prototype.destroy = function() {
      for (; this.listenersToRemove.length > 0;) {
        this.listenersToRemove.pop()();
      }
      this.bindings.dispose();

      this.releaseModel();

      this.builder.destroy();
    };

    e.ID = "editor.contrib.quickSuggestWidget";

    return e;
  }();
  t.QuickSuggestWidget = a;
});