define(["require", "exports", "vs/base/dom/builder", "vs/base/dom/dom", "vs/base/dom/mouseEvent", "vs/editor/editor",
  "vs/css!./quickSuggest"
], function(a, b, c, d, e, f) {
  function k(a, b) {
    if ("snippet" === b.type) return !1;
    var c = b.highlights;
    if (c.length !== 1 || c[0].start > 0) return !1;
    var d = b.label;
    return d.length === a.length ? !1 : !0;
  }
  var g = c;

  var h = d;

  var i = e;

  var j = f;
  b.QUICK_SUGGEST_WIDGET_ID = "editor.widget.quickSuggestWidget";
  var l = function() {
    function a(a, c) {
      var d = this;
      this.editor = a;

      this.handlerService = c;

      this.modelListenersToRemove = [];

      this.model = null;

      this.isVisible = !1;

      this.currentSuggestion = null;

      this.currentSuggestionIndex = -1;

      this.suggestions = null;

      this.currentWord = null;

      this.builder = g.Build.offDOM().div({
        "class": "editor-widget quick-suggest-widget"
      });

      this.bindings = this.handlerService.bindGroup(function(a) {
        var b = function() {
          if (d.currentSuggestion) return d.model.accept(d.currentSuggestion);
        };

        var c = function() {
          return d.suggestions.length === 1 ? b() : d.currentSuggestion ? (d.next(), !0) : !1;
        };

        var e = function() {
          return d.currentSuggestion ? (d.previous(), !0) : !1;
        };

        var f = function() {
          return d.model.cancel();
        };
        a({
          key: "Tab"
        }, c);

        a({
          shift: !0,
          key: "Tab"
        }, e);

        a({
          key: "RightArrow"
        }, b);

        a({
          key: "Escape"
        }, f);
      }, {
        id: b.QUICK_SUGGEST_WIDGET_ID
      });

      this.bindings.deactivate();

      this.listenersToRemove = [];

      this.listenersToRemove.push(h.addListener(this.getDomNode(), "mousedown", function(a) {
        (new i.MouseEvent(a)).preventDefault();
      }));

      this.listenersToRemove.push(a.addListener("blur", function() {
        d.cancel();
      }));

      this.editor.addContentWidget(this);
    }
    a.prototype.setModel = function(a) {
      var b = this;
      this.releaseModel();

      this.model = a;

      this.modelListenersToRemove.push(this.model.addListener("suggest", function(a) {
        a.auto ? (b.currentWord = a.suggestions.currentWord, b.suggestions = a.suggestions.suggestions.filter(k.bind(
            null, b.currentWord)), b.currentSuggestionIndex = 0, b.currentSuggestion = b.suggestions[b.currentSuggestionIndex],
          b.onSuggestions()) : b.cancel();
      }));

      this.modelListenersToRemove.push(this.model.addListener("refilter", function(a) {
        if (a.auto) {
          var c = b.suggestions[b.currentSuggestionIndex];
          b.suggestions = b.suggestions.filter(a.filter);

          b.currentSuggestionIndex = 0;
          for (var d = 0; d < b.suggestions.length; d++)
            if (b.suggestions[d] === c) {
              b.currentSuggestionIndex = d;
              break;
            }
          b.currentSuggestion = b.suggestions[b.currentSuggestionIndex];

          b.currentWord = a.currentWord;

          b.onSuggestions();
        } else b.cancel();
      }));

      this.modelListenersToRemove.push(this.model.addListener("empty", function(a) {
        return b.cancel();
      }));

      this.modelListenersToRemove.push(this.model.addListener("cancel", function(a) {
        return b.cancel();
      }));
    };

    a.prototype.onSuggestions = function() {
      if (!this.suggestions.length) {
        this.hide();
        return;
      }
      this.render();
    };

    a.prototype.next = function() {
      this.currentSuggestionIndex = (this.currentSuggestionIndex + 1) % this.suggestions.length;

      this.currentSuggestion = this.suggestions[this.currentSuggestionIndex];

      this.render();
    };

    a.prototype.previous = function() {
      this.currentSuggestionIndex = --this.currentSuggestionIndex < 0 ? this.suggestions.length - 1 : this.currentSuggestionIndex;

      this.currentSuggestion = this.suggestions[this.currentSuggestionIndex];

      this.render();
    };

    a.prototype.render = function() {
      this.builder.text(this.currentSuggestion.label.substring(this.currentWord.length));

      this.show();
    };

    a.prototype.cancel = function() {
      this.currentSuggestion = null;

      this.hide();
    };

    a.prototype.releaseModel = function() {
      var a;
      while (a = this.modelListenersToRemove.pop()) a();
      this.model = null;
    };

    a.prototype.show = function() {
      this.isVisible = !0;

      this.builder.display("block");

      this.bindings.activate();

      this.editor.layoutContentWidget(this);
    };

    a.prototype.hide = function() {
      this.isVisible = !1;

      this.bindings.deactivate();

      this.builder.display("none");

      this.editor.layoutContentWidget(this);
    };

    a.prototype.getPosition = function() {
      return this.isVisible ? {
        position: this.editor.getPosition(),
        preference: [j.ContentWidgetPositionPreference.EXACT]
      } : null;
    };

    a.prototype.getId = function() {
      return a.ID;
    };

    a.prototype.getDomNode = function() {
      return this.builder.getHTMLElement();
    };

    a.prototype.destroy = function() {
      while (this.listenersToRemove.length > 0) this.listenersToRemove.pop()();
      this.bindings.dispose();

      this.releaseModel();

      this.builder.destroy();
    };

    a.ID = "editor.contrib.quickSuggestWidget";

    return a;
  }();
  b.QuickSuggestWidget = l;
});