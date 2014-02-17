define("vs/editor/contrib/suggest/suggestWidget", ["require", "exports", "vs/nls!vs/editor/editor.main",
  "vs/base/lib/winjs.base", "vs/base/errors", "vs/editor/modes/modes", "vs/base/dom/builder",
  "vs/base/ui/widgets/tree/preRenderer", "vs/base/ui/widgets/tree/treeImpl", "vs/base/ui/widgets/tree/treeDefaults",
  "vs/base/ui/widgets/highlightedLabel", "vs/editor/core/constants", "vs/editor/editor", "vs/css!./suggest"
], function(e, t, n, i, o, r, s, a, u, l, c, d) {
  function h(e, t, n) {
    for (var i = e.toLowerCase(), o = 0, r = 0; r < t.length && r < e.length; r++)
      if (t[r] === e[r]) {
        o += 2;
      } else {
        if (n[r] !== i[r]) break;
        o += 1;
      }
    return o;
  }
  var p = s.$;

  var f = function() {
    function e(e, t) {
      this.parent = e;

      this.message = t;
    }
    return e;
  }();
  t.Message = f;
  var g = function() {
    function e(e) {
      this.child = new f(this, e);
    }
    return e;
  }();
  t.MessageRoot = g;
  var m = function() {
    function e() {
      this.root = null;
    }
    e.prototype.isRoot = function(e) {
      return e instanceof g ? !0 : e instanceof f ? !1 : e.suggestions ? (this.root = e, !0) : !1;
    };

    e.prototype.getId = function(t, n) {
      if (n instanceof g) {
        return "messageroot";
      }
      if (n instanceof f) {
        return "message" + n.message;
      }
      if (n.suggestions) {
        return "root";
      }
      if (r.isISuggestion(n)) {
        "string" != typeof n.id && (n.id = String(e._IdPool++));
        return n.id;
      }
      throw o.illegalArgument("element");
    };

    e.prototype.getParent = function(e, t) {
      return t instanceof g ? i.Promise.as(null) : t instanceof f ? i.Promise.as(t.parent) : i.Promise.as(this.isRoot(
        t) ? null : this.root);
    };

    e.prototype.getChildren = function(e, t) {
      return t instanceof g ? i.Promise.as([t.child]) : t instanceof f ? i.Promise.as([]) : i.Promise.as(this.isRoot(
        t) ? this.root.suggestions : []);
    };

    e.prototype.hasChildren = function(e, t) {
      return this.isRoot(t);
    };

    e._IdPool = 0;

    return e;
  }();

  var v = function(e) {
    function t() {
      e.apply(this, arguments);
    }
    __extends(t, e);

    t.prototype.onLeftClick = function(e, t, n) {
      n.preventDefault();

      n.stopPropagation();

      t instanceof f || e.setSelection([t], {
        origin: "mouse"
      });

      return !0;
    };

    return t;
  }(l.DefaultController);

  var y = function(e) {
    function t(t, n) {
      e.call(this, t);

      this.editor = n;
    }
    __extends(t, e);

    t.prototype.getHeight = function(t, n) {
      var i = n;
      return n instanceof f || !i.documentationLabel || !t.isFocused(i) ? 19 : e.prototype.getHeight.call(this, t, n);
    };

    t.prototype.render = function(e, t, n) {
      return this.renderContents(e, t, n);
    };

    t.prototype.renderContents = function(e, t, n) {
      var i = p(n);
      if (t instanceof f) {
        i.empty().span({
          style: {
            opacity: .7,
            "padding-left": "12px"
          },
          text: t.message
        });
        return null;
      }
      var o = t;

      var r = i.getBinding();

      var s = i.clone();
      if (!r) {
        s.attr("aria-label", o.type);

        p(".icon").addClass(o.type).appendTo(s);

        r = {};
        var a = p(".text").appendTo(s);
        r.main = p(".main").appendTo(a);

        r.highlightedLabel = new c.HighlightedLabel(r.main);

        r.typeLabel = p("span.type-label").appendTo(r.main);

        r.documentation = p(".docs").appendTo(a);

        r.documentationLabel = p("span.docs-label").appendTo(r.documentation);

        i.bind(r);
      }
      r.highlightedLabel.setValue(o.label, o.highlights);

      r.typeLabel.text(o.typeLabel || "");

      r.documentationLabel.text(o.documentationLabel || "");

      return function() {
        r.highlightedLabel.destroy();
      };
    };

    return t;
  }(a.PreRenderer);

  var _ = function() {
    function e(t, n) {
      var s = this;
      this.editor = t;

      this.isActive = !1;

      this.isLoading = !1;

      this.modelListenersToRemove = [];

      this.model = null;

      this.telemetryData = null;

      this.telemetryService = n;
      var a = function() {
        var e = s.editor.getModel();
        s.shouldShowEmptySuggestionList = e && e.getMode().suggestSupport ? e.getMode().suggestSupport.shouldShowEmptySuggestionList() : !
          1;
      };
      a();

      this.listenersToRemove = [];

      this.listenersToRemove.push(t.addListener(d.EventType.ModelChanged, a));

      this.listenersToRemove.push(t.addListener(d.EventType.ModelModeChanged, a));

      this.builder = p(".editor-widget.suggest-widget.monaco-editor-background").style({
        width: e.WIDTH + "px",
        height: e.HEIGHT + "px"
      });

      if (!this.editor.getConfiguration().iconsInSuggestions) {
        this.builder.addClass("no-icons");
      }
      var l = new m;
      this.renderer = new y(l, this.editor);

      this.tree = new u.Tree(this.builder.getHTMLElement(), {
        dataSource: l,
        renderer: this.renderer,
        controller: new v
      }, {
        twistiePixels: 0,
        alwaysFocused: !0,
        verticalScrollMode: "visible"
      });

      this.listenersToRemove.push(t.addListener("blur", function() {
        i.Promise.timeout(150).done(function() {
          if (s.tree && !s.tree.isDOMFocused()) {
            s.hide();
          }
        });
      }));

      this.listenersToRemove.push(this.tree.addListener("selection", function(e) {
        if (e.selection && e.selection.length > 0) {
          var t = e.selection[0];
          if (!(t.hasOwnProperty("suggestions") || t instanceof g || t instanceof f)) {
            s.telemetryData.selectedIndex = s.tree.getInput().suggestions.indexOf(t);
            s.telemetryData.wasCancelled = !1;
            s.submitTelemetryData();
            s.model.accept(t);
            s.editor.focus();
          }
        }
      }));
      var c = null;
      this.listenersToRemove.push(this.tree.addListener("focus", function(e) {
        var t = e.focus;

        var n = e.payload;
        if (r.isISuggestion(t) && s.resolveDetails(t), t !== c) {
          var i = [];
          if (c) {
            i.push(c);
          }

          if (t) {
            i.push(t);
          }

          c = t;

          s.tree.refreshAll(i).done(function() {
            if (t) {
              s.tree.reveal(t, n && n.firstSuggestion ? 0 : null);
            }
          }, o.onUnexpectedError);
        }
      }));

      this.editor.addContentWidget(this);

      this.listenersToRemove.push(this.editor.addListener(d.EventType.CursorSelectionChanged, function() {
        if (s.isActive) {
          s.editor.layoutContentWidget(s);
        }
      }));

      this.hide();
    }
    e.prototype.setModel = function(t) {
      var n = this;
      this.releaseModel();

      this.model = t;
      var i;

      var r = null;
      this.modelListenersToRemove.push(this.model.addListener("loading", function(t) {
        if (!(t.auto || n.isActive)) {
          r = n.telemetryService.start("suggestWidgetLoadingTime");
          n.isLoading = !0;
          i = setTimeout(function() {
            n.builder.removeClass("empty");

            n.tree.setInput(e.LOADING_MESSAGE).done(null, o.onUnexpectedError);

            n.show();
          }, 50);
          if (!t.retrigger) {
            n.telemetryData = {
              wasAutomaticallyTriggered: t.characterTriggered
            };
          }
        }
      }));

      this.modelListenersToRemove.push(this.model.addListener("suggest", function(e) {
        if (n.isLoading = !1, "undefined" != typeof i && clearTimeout(i), !e.auto) {
          n.builder.removeClass("empty");

          n.tree.setInput(e.suggestions).done(null, o.onUnexpectedError);

          n.show();
          for (var t, s = e.suggestions.currentWord, a = s.toLowerCase(), u = e.suggestions.suggestions, l = -1,
              c = e.suggestions.suggestions[0], d = -1, p = 0, f = u.length; f > p; p++) {
            t = u[p];
            var g = h(t.label, s, a);
            if (g > d) {
              d = g;
              c = t;
              l = p;
            }
          }
          n.resolveDetails(c);

          n.tree.setFocus(c, {
            firstSuggestion: !0
          });

          n.telemetryData.suggestionCount = u.length;

          n.telemetryData.suggestedIndex = l;

          n.telemetryData.hintLength = s.length;

          if (r) {
            r.data = {
              reason: "results"
            };
            r.stop();
            r = null;
          }
        }
      }));

      this.modelListenersToRemove.push(this.model.addListener("empty", function(t) {
        var s = n.isLoading;
        n.isLoading = !1;

        if ("undefined" != typeof i) {
          clearTimeout(i);
        }

        if (!t.auto) {
          if (s) {
            if (n.shouldShowEmptySuggestionList) {
              n.builder.removeClass("empty");
              n.tree.setInput(e.NO_SUGGESTIONS_MESSAGE).done(null, o.onUnexpectedError);
              n.show();
            } {
              n.hide();
            }
          } {
            n.builder.addClass("empty");
          }
          if (r) {
            r.data = {
              reason: "empty"
            };
            r.stop();
            r = null;
          }
        }
      }));

      this.modelListenersToRemove.push(this.model.addListener("cancel", function(e) {
        n.isLoading = !1;

        n.hide();

        if (!e.auto) {
          if (!e.retrigger && n.telemetryData) {
            n.telemetryData.selectedIndex = -1;
            n.telemetryData.wasCancelled = !0;
            n.submitTelemetryData();
          }
          if (r) {
            r.data = {
              reason: "cancel"
            };
            r.stop();
            r = null;
          }
        }
      }));
    };

    e.prototype.resolveDetails = function(e) {
      var t = this;
      if (e.detailsResolved !== !0) {
        var n = this.editor.getModel().getMode().suggestSupport;
        if ("function" == typeof n.getSuggestionDetails) {
          if (this.currentSuggestionDetails) {
            this.currentSuggestionDetails.cancel();
          }
          this.currentSuggestionDetails = n.getSuggestionDetails(this.editor.getModel().getAssociatedResource(), this
            .editor.getPosition(), e);
          this.currentSuggestionDetails.then(function(n) {
            e.detailsResolved = !0;

            e.codeSnippet = n.codeSnippet;

            e.documentationLabel = n.documentationLabel;

            e.highlights = n.highlights;

            e.label = n.label;

            e.type = n.type;

            e.typeLabel = n.typeLabel;

            return t.tree.refresh(e);
          }, function(e) {
            return o.isPromiseCanceledError(e) ? null : e;
          }).done(void 0, o.onUnexpectedError);
        }
      }
    };

    e.prototype.selectNextPage = function() {
      return this.isLoading ? !0 : this.isActive ? (this.tree.focusNextPage(), !0) : !1;
    };

    e.prototype.selectNext = function() {
      if (this.isLoading) {
        return !0;
      }
      if (this.isActive) {
        var e = this.tree.getFocus();
        this.tree.focusNext(1);

        e === this.tree.getFocus() && this.tree.focusFirst();

        return !0;
      }
      return !1;
    };

    e.prototype.selectPreviousPage = function() {
      return this.isLoading ? !0 : this.isActive ? (this.tree.focusPreviousPage(), !0) : !1;
    };

    e.prototype.selectPrevious = function() {
      if (this.isLoading) {
        return !0;
      }
      if (this.isActive) {
        var e = this.tree.getFocus();
        this.tree.focusPrevious(1);

        e === this.tree.getFocus() && this.tree.focusLast();

        return !0;
      }
      return !1;
    };

    e.prototype.acceptSelectedSuggestion = function() {
      if (this.isLoading) {
        return !0;
      }
      if (this.isActive) {
        var e = this.tree.getFocus();
        e ? this.tree.setSelection([e]) : this.model.cancel();

        return !0;
      }
      return !1;
    };

    e.prototype.releaseModel = function() {
      for (var e; e = this.modelListenersToRemove.pop();) {
        e();
      }
      this.model = null;
    };

    e.prototype.show = function() {
      this.isActive = !0;

      this.builder.style("visibility", "visible");

      this.tree.layout();

      this.editor.layoutContentWidget(this);
    };

    e.prototype.hide = function() {
      this.isActive = !1;

      this.builder.style("visibility", "hidden");

      this.editor.layoutContentWidget(this);
    };

    e.prototype.getPosition = function() {
      return this.isActive ? {
        position: this.editor.getPosition(),
        preference: [2, 1]
      } : null;
    };

    e.prototype.getDomNode = function() {
      return this.builder.getHTMLElement();
    };

    e.prototype.getId = function() {
      return e.ID;
    };

    e.prototype.submitTelemetryData = function() {
      this.telemetryService.publicLog("suggestWidget", this.telemetryData);

      this.telemetryData = null;
    };

    e.prototype.destroy = function() {
      this.releaseModel();

      this.builder.destroy();

      this.tree.dispose();

      this.tree = null;

      if (this.renderer) {
        this.renderer.dispose();
        this.renderer = null;
      }

      this.listenersToRemove.forEach(function(e) {
        e();
      });

      this.listenersToRemove = null;
    };

    e.ID = "editor.widget.suggestWidget";

    e.WIDTH = 440;

    e.HEIGHT = 240;

    e.LOADING_MESSAGE = new g(n.localize("vs_editor_contrib_suggest_suggestWidget", 0));

    e.NO_SUGGESTIONS_MESSAGE = new g(n.localize("vs_editor_contrib_suggest_suggestWidget", 1));

    return e;
  }();
  t.SuggestWidget = _;
});