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

define(["require", "exports", "vs/nls", "vs/base/lib/winjs.base", "vs/base/errors", "vs/editor/modes/modes",
  "vs/base/dom/builder", "vs/base/ui/widgets/tree/preRenderer", "vs/base/ui/widgets/tree/treeImpl",
  "vs/base/ui/widgets/tree/treeDefaults", "vs/base/ui/widgets/highlightedLabel", "vs/editor/core/constants",
  "vs/editor/editor", "vs/css!./suggest"
], function(a, b, c, d, e, f, g, h, i, j, k, l, m) {
  function E(a, b, c) {
    var d = a.toLowerCase();

    var e = 0;
    for (var f = 0; f < b.length && f < a.length; f++)
      if (b[f] === a[f]) {
        e += 2;
      } else {
        if (c[f] !== d[f]) break;
        e += 1;
      }
    return e;
  }
  var n = c;

  var o = d;

  var p = e;

  var q = f;

  var r = g;

  var s = h;

  var t = i;

  var u = j;

  var v = k;

  var w = l;

  var x = m;

  var y = r.$;

  var z = function() {
    function a(a, b) {
      this.parent = a;

      this.message = b;
    }
    return a;
  }();
  b.Message = z;
  var A = function() {
    function a(a) {
      this.child = new z(this, a);
    }
    return a;
  }();
  b.MessageRoot = A;
  var B = function() {
    function a() {
      this.root = null;
    }
    a.prototype.isRoot = function(a) {
      return a instanceof A ? !0 : a instanceof z ? !1 : a.suggestions ? (this.root = a, !0) : !1;
    };

    a.prototype.getId = function(b, c) {
      if (c instanceof A) {
        return "messageroot";
      }
      if (c instanceof z) {
        return "message" + c.message;
      }
      if (!c.suggestions) {
        if (q.isISuggestion(c)) {
          typeof c.id != "string" && (c.id = String(a._IdPool++));
          return c.id;
        }
        throw p.illegalArgument("element");
      }
      return "root";
    };

    a.prototype.getParent = function(a, b) {
      return b instanceof A ? o.Promise.as(null) : b instanceof z ? o.Promise.as(b.parent) : o.Promise.as(this.isRoot(
        b) ? null : this.root);
    };

    a.prototype.getChildren = function(a, b) {
      return b instanceof A ? o.Promise.as([b.child]) : b instanceof z ? o.Promise.as([]) : o.Promise.as(this.isRoot(
        b) ? this.root.suggestions : []);
    };

    a.prototype.hasChildren = function(a, b) {
      return this.isRoot(b);
    };

    a._IdPool = 0;

    return a;
  }();

  var C = function(a) {
    function b() {
      a.apply(this, arguments);
    }
    __extends(b, a);

    b.prototype.onLeftClick = function(a, b, c) {
      c.preventDefault();

      c.stopPropagation();

      b instanceof z || a.setSelection([b], {
        origin: "mouse"
      });

      return !0;
    };

    return b;
  }(u.DefaultController);

  var D = function(a) {
    function b(b, c) {
      a.call(this, b);

      this.editor = c;
    }
    __extends(b, a);

    b.prototype.getHeight = function(b, c) {
      var d = c;
      return c instanceof z || !d.documentationLabel || !b.isFocused(d) ? 19 : a.prototype.getHeight.call(this, b, c);
    };

    b.prototype.render = function(a, b, c) {
      return this.renderContents(a, b, c);
    };

    b.prototype.renderContents = function(a, b, c) {
      var d = y(c);
      if (b instanceof z) {
        d.empty().span({
          style: {
            opacity: .7,
            "padding-left": "12px"
          },
          text: b.message
        });
        return null;
      }
      var e = b;

      var f = d.getBinding();

      var g = d.clone();
      if (!f) {
        g.attr("aria-label", e.type);

        y(".icon").addClass(e.type).appendTo(g);

        f = {};
        var h = y(".text").appendTo(g);
        f.main = y(".main").appendTo(h);

        f.highlightedLabel = new v.HighlightedLabel(f.main);

        f.typeLabel = y("span.type-label").appendTo(f.main);

        f.documentation = y(".docs").appendTo(h);

        f.documentationLabel = y("span.docs-label").appendTo(f.documentation);

        d.bind(f);
      }
      f.highlightedLabel.setValue(e.label, e.highlights);

      f.typeLabel.text(e.typeLabel || "");

      f.documentationLabel.text(e.documentationLabel || "");

      return function() {
        f.highlightedLabel.destroy();
      };
    };

    return b;
  }(s.PreRenderer);

  var F = function() {
    function a(b, c) {
      var d = this;
      this.editor = b;

      this.isActive = !1;

      this.isLoading = !1;

      this.modelListenersToRemove = [];

      this.model = null;

      this.telemetryData = null;

      this.telemetryService = c;
      var e = function() {
        var a = d.editor.getModel();
        a && a.getMode().suggestSupport ? d.shouldShowEmptySuggestionList = a.getMode().suggestSupport.shouldShowEmptySuggestionList() :
          d.shouldShowEmptySuggestionList = !1;
      };
      e();

      this.listenersToRemove = [];

      this.listenersToRemove.push(b.addListener(w.EventType.ModelChanged, e));

      this.listenersToRemove.push(b.addListener(w.EventType.ModelModeChanged, e));

      this.builder = y(".editor-widget.suggest-widget.monaco-editor-background").style({
        width: a.WIDTH + "px",
        height: a.HEIGHT + "px"
      });

      if (!this.editor.getConfiguration().iconsInSuggestions) {
        this.builder.addClass("no-icons");
      }
      var f = new B;
      this.renderer = new D(f, this.editor);

      this.tree = new t.Tree(this.builder.getHTMLElement(), {
        dataSource: f,
        renderer: this.renderer,
        controller: new C
      }, {
        twistiePixels: 0,
        alwaysFocused: !0,
        verticalScrollMode: "visible"
      });

      this.listenersToRemove.push(b.addListener("blur", function() {
        o.Promise.timeout(150).done(function() {
          if (d.tree && !d.tree.isDOMFocused()) {
            d.hide();
          }
        });
      }));

      this.listenersToRemove.push(this.tree.addListener("selection", function(a) {
        if (a.selection && a.selection.length > 0) {
          var b = a.selection[0];
          if (!b.hasOwnProperty("suggestions") && !(b instanceof A) && !(b instanceof z)) {
            d.telemetryData.selectedIndex = d.tree.getInput().suggestions.indexOf(b);
            d.telemetryData.wasCancelled = !1;
            d.submitTelemetryData();
            d.model.accept(b);
            d.editor.focus();
          }
        }
      }));
      var g = null;
      this.listenersToRemove.push(this.tree.addListener("focus", function(a) {
        var b = a.focus;

        var c = a.payload;
        if (q.isISuggestion(b)) {
          d.resolveDetails(b);
        }
        if (b === g) return;
        var e = [];
        if (g) {
          e.push(g);
        }

        if (b) {
          e.push(b);
        }

        g = b;

        d.tree.refreshAll(e).done(function() {
          if (b) {
            d.tree.reveal(b, c && c.firstSuggestion ? 0 : null);
          }
        }, p.onUnexpectedError);
      }));

      this.editor.addContentWidget(this);

      this.listenersToRemove.push(this.editor.addListener(w.EventType.CursorSelectionChanged, function(a) {
        if (d.isActive) {
          d.editor.layoutContentWidget(d);
        }
      }));

      this.hide();
    }
    a.prototype.setModel = function(b) {
      var c = this;
      this.releaseModel();

      this.model = b;
      var d = null;

      var e;
      this.modelListenersToRemove.push(this.model.addListener("loading", function(b) {
        if (!b.auto && !c.isActive) {
          d = c.telemetryService.start("suggestWidgetLoadingTime");
          c.isLoading = !0;
          e = setTimeout(function() {
            c.builder.removeClass("empty");

            c.tree.setInput(a.LOADING_MESSAGE).done(null, p.onUnexpectedError);

            c.show();
          }, 50);
          if (!b.retrigger) {
            c.telemetryData = {
              wasAutomaticallyTriggered: b.characterTriggered
            };
          }
        }
      }));

      this.modelListenersToRemove.push(this.model.addListener("suggest", function(a) {
        c.isLoading = !1;

        if (typeof e != "undefined") {
          clearTimeout(e);
        }
        if (!a.auto) {
          c.builder.removeClass("empty");

          c.tree.setInput(a.suggestions).done(null, p.onUnexpectedError);

          c.show();
          var b = a.suggestions.currentWord;

          var f = b.toLowerCase();

          var g = a.suggestions.suggestions;

          var h;

          var i = -1;

          var j = a.suggestions.suggestions[0];

          var k = -1;
          for (var l = 0, m = g.length; l < m; l++) {
            h = g[l];
            var n = E(h.label, b, f);
            if (n > k) {
              k = n;
              j = h;
              i = l;
            }
          }
          c.resolveDetails(j);

          c.tree.setFocus(j, {
            firstSuggestion: !0
          });

          c.telemetryData.suggestionCount = g.length;

          c.telemetryData.suggestedIndex = i;

          c.telemetryData.hintLength = b.length;

          if (d) {
            d.data = {
              reason: "results"
            };
            d.stop();
            d = null;
          }
        }
      }));

      this.modelListenersToRemove.push(this.model.addListener("empty", function(b) {
        c.isLoading = !1;

        if (!b.auto) {
          c.tree.getInput() === a.LOADING_MESSAGE ? c.shouldShowEmptySuggestionList ? c.tree.setInput(a.NO_SUGGESTIONS_MESSAGE)
            .done(null, p.onUnexpectedError) : c.hide() : c.builder.addClass("empty");
          if (d) {
            d.data = {
              reason: "empty"
            };
            d.stop();
            d = null;
          }
        }
      }));

      this.modelListenersToRemove.push(this.model.addListener("cancel", function(a) {
        c.isLoading = !1;

        c.hide();

        if (!a.auto) {
          if (!a.retrigger && c.telemetryData) {
            c.telemetryData.selectedIndex = -1;
            c.telemetryData.wasCancelled = !0;
            c.submitTelemetryData();
          }
          if (d) {
            d.data = {
              reason: "cancel"
            };
            d.stop();
            d = null;
          }
        }
      }));
    };

    a.prototype.resolveDetails = function(a) {
      var b = this;
      if (a.detailsResolved === !0) return;
      var c = this.editor.getModel().getMode().suggestSupport;
      if (typeof c.getSuggestionDetails != "function") return;
      if (this.currentSuggestionDetails) {
        this.currentSuggestionDetails.cancel();
      }

      this.currentSuggestionDetails = c.getSuggestionDetails(this.editor.getModel().getAssociatedResource(), this.editor
        .getPosition(), a);

      this.currentSuggestionDetails.then(function(c) {
        a.detailsResolved = !0;

        a.codeSnippet = c.codeSnippet;

        a.documentationLabel = c.documentationLabel;

        a.highlights = c.highlights;

        a.label = c.label;

        a.type = c.type;

        a.typeLabel = c.typeLabel;

        return b.tree.refresh(a);
      }, function(a) {
        if (p.isPromiseCanceledError(a)) return;
        throw a;
      }).done(undefined, p.onUnexpectedError);
    };

    a.prototype.selectNextPage = function() {
      return this.isLoading ? !0 : this.isActive ? (this.tree.focusNextPage(), !0) : !1;
    };

    a.prototype.selectNext = function() {
      if (this.isLoading) {
        return !0;
      }
      if (this.isActive) {
        var a = this.tree.getFocus();
        this.tree.focusNext(1);

        a === this.tree.getFocus() && this.tree.focusFirst();

        return !0;
      }
      return !1;
    };

    a.prototype.selectPreviousPage = function() {
      return this.isLoading ? !0 : this.isActive ? (this.tree.focusPreviousPage(), !0) : !1;
    };

    a.prototype.selectPrevious = function() {
      if (this.isLoading) {
        return !0;
      }
      if (this.isActive) {
        var a = this.tree.getFocus();
        this.tree.focusPrevious(1);

        a === this.tree.getFocus() && this.tree.focusLast();

        return !0;
      }
      return !1;
    };

    a.prototype.acceptSelectedSuggestion = function() {
      if (this.isLoading) {
        return !0;
      }
      if (this.isActive) {
        var a = this.tree.getFocus();
        a ? this.tree.setSelection([a]) : this.model.cancel();

        return !0;
      }
      return !1;
    };

    a.prototype.releaseModel = function() {
      var a;
      while (a = this.modelListenersToRemove.pop()) {
        a();
      }
      this.model = null;
    };

    a.prototype.show = function() {
      this.isActive = !0;

      this.builder.style("visibility", "visible");

      this.tree.layout();

      this.editor.layoutContentWidget(this);
    };

    a.prototype.hide = function() {
      this.isActive = !1;

      this.builder.style("visibility", "hidden");

      this.editor.layoutContentWidget(this);
    };

    a.prototype.getPosition = function() {
      return this.isActive ? {
        position: this.editor.getPosition(),
        preference: [x.ContentWidgetPositionPreference.BELOW, x.ContentWidgetPositionPreference.ABOVE]
      } : null;
    };

    a.prototype.getDomNode = function() {
      return this.builder.getHTMLElement();
    };

    a.prototype.getId = function() {
      return a.ID;
    };

    a.prototype.submitTelemetryData = function() {
      this.telemetryService.publicLog("suggestWidget", this.telemetryData);

      this.telemetryData = null;
    };

    a.prototype.destroy = function() {
      this.releaseModel();

      this.builder.destroy();

      this.tree.dispose();

      this.tree = null;

      if (this.renderer) {
        this.renderer.dispose();
        this.renderer = null;
      }

      this.listenersToRemove.forEach(function(a) {
        a();
      });

      this.listenersToRemove = null;
    };

    a.ID = "editor.widget.suggestWidget";

    a.WIDTH = 440;

    a.HEIGHT = 240;

    a.LOADING_MESSAGE = new A(n.localize("suggestWidget.loading", "Loading..."));

    a.NO_SUGGESTIONS_MESSAGE = new A(n.localize("suggestWidget.noSuggestions", "No suggestions."));

    return a;
  }();
  b.SuggestWidget = F;
});