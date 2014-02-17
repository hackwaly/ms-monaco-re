define("vs/base/ui/widgets/quickopen/quickOpenWidget", ["require", "exports", "vs/base/lib/winjs.base", "vs/base/env",
  "vs/base/ui/events", "vs/base/types", "vs/base/errors", "vs/base/strings",
  "vs/base/ui/widgets/quickopen/quickOpenViewer", "vs/base/ui/widgets/quickopen/quickOpenModel",
  "vs/base/dom/builder", "vs/base/ui/widgets/inputBox", "vs/base/ui/widgets/tree/treeImpl",
  "vs/base/ui/widgets/progressbar", "vs/base/dom/keyboardEvent", "vs/base/dom/dom", "vs/css!./quickopen"
], function(e, t, n, i, o, r, s, a, u, l, c, d, h, p, f, g) {
  var m = 150;

  var v = c.$;

  var y = function() {
    function e(e, t, n, i) {
      this.toUnbind = [];

      this.container = e;

      this.callbacks = t;

      this.configuration = n;

      this.usageLogger = i;
    }
    e.prototype.create = function() {
      var e = this;
      this.builder = v().div(function(t) {
        t.on(g.EventType.KEY_DOWN, function(t) {
          var n = new f.KeyboardEvent(t);
          if ("Escape" === n.key) {
            g.EventHelper.stop(t, !0);
            e.hide(!0);
          }
        }).on(g.EventType.FOCUS, function() {
          return e.gainingFocus();
        }, null, !0).on(g.EventType.CONTEXT_MENU, function(e) {
          return g.EventHelper.stop(e, !0);
        }).on(g.EventType.BLUR, function() {
          return e.loosingFocus();
        }, null, !0);

        e.progressBar = new p.ProgressBar(t.clone());

        e.progressBar.getContainer().hide();

        t.div({
          "class": "quick-open-input"
        }, function(t) {
          e.inputContainer = t;

          e.inputBox = new d.InputBox(t.getHTMLElement(), null, {
            placeholder: e.configuration.inputPlaceHolder || ""
          });

          e.inputBox.$input.on(g.EventType.KEY_DOWN, function(t) {
            var n = new f.KeyboardEvent(t);
            if ("Tab" === n.key || "DownArrow" === n.key || "UpArrow" === n.key || "PageDown" === n.key ||
              "PageUp" === n.key) {
              g.EventHelper.stop(t, !0);
              e.navigateInTree(n.key, n.shiftKey);
            }
          }).on(g.EventType.KEY_UP, function(t) {
            var n = new f.KeyboardEvent(t);
            if ("Enter" === n.key) {
              var o = e.tree.getFocus();
              if (o) {
                e.elementSelected(o, t);
              }
            } else {
              if (!(!i.browser.isIE9 || "Backspace" !== n.key && "Delete" !== n.key)) {
                e.onType();
              }
            }
          }).on(g.EventType.INPUT, function() {
            e.onType();
          }).attr({
            wrap: "off",
            autocorrect: "off",
            autocapitalize: "off",
            spellcheck: "false"
          }).clone();
        });
        var n = new u.DataSource;
        e.renderer = new u.Renderer(e.configuration.actionProvider);

        e.treeContainer = t.div({
          "class": "quick-open-tree"
        }, function(t) {
          e.tree = new h.Tree(t.getHTMLElement(), {
            dataSource: n,
            controller: new u.Controller,
            renderer: e.renderer
          }, {
            twistiePixels: 11,
            indentPixels: 0,
            alwaysFocused: !0,
            verticalScrollMode: "visible"
          });

          e.toUnbind.push(e.tree.addListener(o.EventType.FOCUS, function(t) {
            e.elementFocused(t.focus, t);
          }));

          e.toUnbind.push(e.tree.addListener(o.EventType.SELECTION, function(t) {
            if (t.selection && t.selection.length > 0) {
              e.elementSelected(t.selection[0], t);
            }
          }));
        }).on(g.EventType.KEY_DOWN, function(t) {
          var n = new f.KeyboardEvent(t);
          if (e.quickNavigateConfiguration) {
            e.quickNavigateConfiguration.keybinding.keys.some(function(e) {
              return e === n.key;
            }) ? (g.EventHelper.stop(t, !0), e.navigateInTree(n.shiftKey ? "UpArrow" : "DownArrow")) : (
              "DownArrow" === n.key || "UpArrow" === n.key || "PageDown" === n.key || "PageUp" === n.key) && (g.EventHelper
              .stop(t, !0), e.navigateInTree(n.key));
          }
        }).on(g.EventType.KEY_UP, function(t) {
          var n = new f.KeyboardEvent(t);
          if (e.quickNavigateConfiguration && ((e.quickNavigateConfiguration.keybinding.ctrlCmd || e.quickNavigateConfiguration
            .keybinding.winCtrl) && "Ctrl" === n.key || "Enter" === n.key)) {
            var i = e.tree.getFocus();
            if (i) {
              e.elementSelected(i, t);
            }
          }
        }).clone();
      }).addClass("quick-open-widget").addClass(i.browser.isIE10orEarlier ? " no-shadow" : "").build(this.container);
    };

    e.prototype.onType = function() {
      var e = this.inputBox.value;
      if (this.helpText) {
        e ? this.helpText.hide() : this.helpText.show();
      }

      this.callbacks.onType(e);
    };

    e.prototype.navigateInTree = function(e, t) {
      var n = this.tree.getInput() ? this.tree.getInput().getEntries() : [];

      var i = this.tree.getFocus();

      var o = !1;

      var r = !1;
      if (n.length > 1 && ("UpArrow" !== e || i !== n[0] && i ? "DownArrow" === e && i === n[n.length - 1] && (this.tree
        .setFocus(n[0]), o = !0) : (this.tree.setFocus(n[n.length - 1]), o = !0)), !o) switch (e) {
        case "DownArrow":
          this.tree.focusNext();
          break;
        case "UpArrow":
          this.tree.focusPrevious();
          break;
        case "PageDown":
          this.tree.focusNextPage();
          break;
        case "PageUp":
          this.tree.focusPreviousPage();
          break;
        case "Tab":
          this.cycleThroughEntryGroups(n, i, t);

          r = !0;
      }
      i = this.tree.getFocus();

      if (i) {
        r ? this.tree.reveal(this.tree.getFocus(), 0) : this.tree.reveal(this.tree.getFocus());
      }
    };

    e.prototype.cycleThroughEntryGroups = function(e, t, n) {
      if (0 !== e.length) {
        var i = t ? e.indexOf(t) : -1;
        if (i >= 0)
          if (n)
            for (var o = i - 1; o >= 0; o--) {
              var r = e[o];
              if (r instanceof l.QuickOpenEntryGroup && r.getGroupLabel()) {
                this.tree.setFocus(r);
                return void 0;
              }
            } else
              for (var o = i + 1; o < e.length; o++) {
                var s = e[o];
                if (s instanceof l.QuickOpenEntryGroup && s.getGroupLabel()) {
                  this.tree.setFocus(s);
                  return void 0;
                }
              }
        if (!n) {
          this.tree.setFocus(e[0]);
          return void 0;
        }
        for (var o = e.length - 1; o >= 0; o--) {
          var r = e[o];
          if (r instanceof l.QuickOpenEntryGroup && r.getGroupLabel()) {
            this.tree.setFocus(r);
            return void 0;
          }
        }
      }
    };

    e.prototype.elementFocused = function(e, t) {
      if (e instanceof l.QuickOpenEntry && this.isVisible()) {
        var n = {
          event: t,
          quickNavigateConfiguration: this.quickNavigateConfiguration
        };
        e.run(0, n);
      }
    };

    e.prototype.elementSelected = function(e, t) {
      var n = !0;
      if (e instanceof l.QuickOpenEntry && this.isVisible()) {
        var i = {
          event: t,
          quickNavigateConfiguration: this.quickNavigateConfiguration
        };
        n = e.run(1, i);
      }
      if (this.usageLogger) {
        var o = this.tree.getInput().entries.indexOf(e);

        var r = this.tree.getInput().entries.length;
        this.usageLogger.publicLog("quickOpenWidgetItemAccepted", {
          index: o,
          count: r,
          isQuickNavigate: this.quickNavigateConfiguration ? !0 : !1
        });
      }
      if (n) {
        this.hide();
      }
    };

    e.prototype.show = function(e, t, n) {
      if (r.isUndefined(t)) {
        t = {};
      }

      this.visible = !0;

      this.isLoosingFocus = !1;

      this.quickNavigateConfiguration = n;

      this.quickNavigateConfiguration ? (this.inputContainer.hide(), this.treeContainer.removeClass("transition"),
        this.builder.show(), this.tree.DOMFocus()) : (this.inputContainer.show(), this.treeContainer.addClass(
        "transition"), this.builder.show(), this.inputBox.$input.domFocus());

      if (this.helpText) {
        this.quickNavigateConfiguration || r.isString(e) ? this.helpText.hide() : this.helpText.show();
      }

      r.isString(e) ? this.doShowWithPrefix(e) : this.doShowWithInput(e, t);
    };

    e.prototype.doShowWithPrefix = function(e) {
      this.inputBox.value = e;

      this.callbacks.onType(e);
    };

    e.prototype.doShowWithInput = function(e, t) {
      this.setInput(e, t);
    };

    e.prototype.setInputAndLayout = function(e, t) {
      var n = this;

      var i = a.generateUuid();
      this.currentInputToken = i;

      this.treeContainer.style({
        height: this.getHeight(e) + "px"
      });

      this.getAnimationPromise().then(function() {
        if (n.currentInputToken === i) {
          n.tree.setInput(e).done(function() {
            n.tree.layout();

            if (e && e.getEntries().length > 0) {
              n.autoFocus(e, t);
            }
          }, s.onUnexpectedError);
        }
      });
    };

    e.prototype.autoFocus = function(e, t) {
      if (t.autoFocusPrefixMatch) {
        for (var n, i, o = e.getEntries(), r = t.autoFocusPrefixMatch, s = r.toLowerCase(), a = 0; a < o.length; a++) {
          var u = o[a];
          if (n || 0 !== u.getLabel().indexOf(r) ? i || 0 !== u.getLabel().toLowerCase().indexOf(s) || (i = u) : n =
            u, n && i) break;
        }
        var l = n || i;
        if (l) {
          this.tree.setFocus(l);
          this.tree.reveal(l, 0);
          return void 0;
        }
      }
      if (t.autoFocusFirstEntry) {
        this.tree.focusNext();
        this.tree.reveal(this.tree.getFocus(), 0);
      } else if (t.autoFocusSecondEntry) {
        var o = e.getEntries();
        if (o.length > 1) {
          this.tree.setFocus(o[1]);
        }
      }
    };

    e.prototype.refreshAndLayout = function(e, t) {
      var n = this;
      if (this.isVisible()) {
        this.treeContainer.style({
          height: this.getHeight(e) + "px"
        });
        this.getAnimationPromise().then(function() {
          n.tree.refresh().done(function() {
            n.tree.layout();

            if (!n.tree.getFocus() && e && e.getEntries().length > 0) {
              n.autoFocus(e, t);
            }
          }, s.onUnexpectedError);
        });
      }
    };

    e.prototype.getAnimationPromise = function() {
      return this.treeContainer.hasClass("transition") ? n.Promise.timeout(m) : n.Promise.as(null);
    };

    e.prototype.getHeight = function(e) {
      var t = this.renderer.getHeight(this.tree, null);

      var n = this.configuration.minItemsToShow;
      if (e) {
        var i = e.getEntries();
        n = i.length;
      }
      return Math.min(this.configuration.maxItemsToShow * t, n * t);
    };

    e.prototype.hide = function(e) {
      if ("undefined" == typeof e && (e = !1), this.isVisible()) {
        if (this.visible = !1, this.builder.hide(), this.builder.domBlur(), e) {
          var t = this.tree.getInput();
          if (t) {
            var n = t.entries.length;
            if (this.usageLogger) {
              this.usageLogger.publicLog("quickOpenWidgetCancelled", {
                count: n,
                isQuickNavigate: this.quickNavigateConfiguration ? !0 : !1
              });
            }
          }
        }
        this.inputBox.value = "";

        this.tree.setInput(null);
        var i = this.renderer.getHeight(this.tree, null);
        this.treeContainer.style({
          height: this.configuration.minItemsToShow * i + "px"
        });

        this.progressBar.stop().getContainer().hide();

        this.tree.isDOMFocused() ? this.tree.DOMBlur() : this.inputBox.$input.hasFocus() && this.inputBox.$input.domBlur();

        e ? this.callbacks.onCancel() : this.callbacks.onOk();
      }
    };

    e.prototype.setInput = function(e, t) {
      if (this.isVisible()) {
        this.setInputAndLayout(e, t);
      }
    };

    e.prototype.getInput = function() {
      return this.tree.getInput();
    };

    e.prototype.runFocus = function() {
      var e = this.tree.getFocus();
      return e ? (this.elementSelected(e), !0) : !1;
    };

    e.prototype.getProgressBar = function() {
      return this.progressBar;
    };

    e.prototype.setExtraClass = function(e) {
      var t = this.builder.getProperty("extra-class");
      if (t) {
        this.builder.removeClass(t);
      }

      e ? (this.builder.addClass(e), this.builder.setProperty("extra-class", e)) : t && this.builder.removeProperty(
        "extra-class");
    };

    e.prototype.isVisible = function() {
      return this.visible;
    };

    e.prototype.gainingFocus = function() {
      this.isLoosingFocus = !1;
    };

    e.prototype.loosingFocus = function() {
      var e = this;
      if (this.isVisible()) {
        this.isLoosingFocus = !0;
        n.Promise.timeout(0).then(function() {
          if (e.isLoosingFocus) {
            e.hide(!1);
          }
        });
      }
    };

    e.prototype.dispose = function() {
      for (; this.toUnbind.length;) {
        this.toUnbind.pop()();
      }
      this.progressBar.dispose();

      this.inputBox.dispose();

      this.tree.dispose();
    };

    return e;
  }();
  t.QuickOpenWidget = y;
});