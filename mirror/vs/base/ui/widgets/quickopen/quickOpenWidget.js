define(["require", "exports", "vs/base/lib/winjs.base", "vs/base/env", "vs/base/ui/events", "vs/base/types",
  "vs/base/errors", "vs/base/strings", "vs/base/ui/widgets/quickopen/quickOpenViewer",
  "vs/base/ui/widgets/quickopen/quickOpenModel", "vs/base/dom/builder", "vs/base/ui/widgets/tree/treeImpl",
  "vs/base/ui/widgets/progressbar", "vs/base/dom/keyboardEvent", "vs/base/dom/dom", "vs/css!./quickopen"
], function(a, b, c, d, e, f, g, h, i, j, k, l, m, n, o) {
  var p = c;

  var q = d;

  var r = e;

  var s = f;

  var t = g;

  var u = h;

  var v = i;

  var w = j;

  var x = k;

  var y = l;

  var z = m;

  var A = n;

  var B = o;

  var C = 110;

  var D = x.$;

  var E = function() {
    function a(a, b, c, d) {
      this.toUnbind = [];

      this.container = a;

      this.callbacks = b;

      this.configuration = c;

      this.usageLogger = d;
    }
    a.prototype.create = function() {
      var a = this;

      var b = D(window.document.body).getClientArea();
      this.builder = D().div(function(b) {
        b.on(B.EventType.KEY_DOWN, function(b) {
          var c = new A.KeyboardEvent(b);
          if (c.key === "Escape") {
            B.EventHelper.stop(b, !0);
            a.hide(!0);
          }
        }).on(B.EventType.FOCUS, function(b) {
          return a.gainingFocus();
        }, null, !0).on(B.EventType.CONTEXT_MENU, function(a) {
          return B.EventHelper.stop(a, !0);
        }).on(B.EventType.BLUR, function(b) {
          return a.loosingFocus();
        }, null, !0);

        a.progressBar = new z.ProgressBar(b.clone());

        a.progressBar.getContainer().hide();

        a.inputField = b.element("input", {
          type: "text",
          id: "monaco-workbench-quick-open-input"
        }).attr("placeholder", q.browser.isIE10 ? "" : a.configuration.inputPlaceHolder || "").on(B.EventType.KEY_DOWN,
          function(b) {
            var c = new A.KeyboardEvent(b);
            if (c.key === "Tab" || c.key === "DownArrow" || c.key === "UpArrow" || c.key === "PageDown" || c.key ===
              "PageUp") {
              B.EventHelper.stop(b, !0);
              a.navigateInTree(c.key, c.shiftKey);
            } else {
              if (b.keyCode === A.KEYS.Ctrl) {
                a.builder.addClass("transparent");
              }
            }
          }).on(B.EventType.KEY_UP, function(b) {
          var c = new A.KeyboardEvent(b);
          if (c.key === "Enter") {
            var d = a.tree.getFocus();
            if (d) {
              a.elementSelected(d);
            }
          } else {
            if (!q.browser.isIE9 || c.key !== "Backspace" && c.key !== "Delete") {
              if (b.keyCode === A.KEYS.Ctrl) {
                a.builder.removeClass("transparent");
              }
            } else {
              a.onType();
            }
          }
        }).on(B.EventType.INPUT, function(b) {
          a.onType();
        }).attr({
          wrap: "off",
          autocorrect: "off",
          autocapitalize: "off",
          spellcheck: "false"
        }).addClass("quick-open-input").clone();

        if (a.configuration.inputPlaceHolder && q.browser.isIE10) {
          a.helpText = b.element("label", {
            text: a.configuration.inputPlaceHolder,
            "for": "monaco-workbench-quick-open-input"
          }).on(B.EventType.CLICK, function(b) {
            B.EventHelper.stop(b, !0);

            a.inputField.domFocus();
          }).addClass("quick-open-help-shim").clone();
        }

        a.renderer = new v.Renderer;

        a.treeContainer = b.div({
          "class": "quick-open-tree"
        }, function(b) {
          a.tree = new y.Tree(b.getHTMLElement(), {
            dataSource: new v.DataSource,
            controller: new v.Controller,
            renderer: a.renderer
          }, {
            twistiePixels: 11,
            indentPixels: 0,
            alwaysFocused: !0,
            verticalScrollMode: "visible"
          });

          a.toUnbind.push(a.tree.addListener(r.EventType.FOCUS, function(b) {
            a.elementFocused(b.focus);
          }));

          a.toUnbind.push(a.tree.addListener(r.EventType.SELECTION, function(b) {
            if (b.selection && b.selection.length > 0) {
              a.elementSelected(b.selection[0]);
            }
          }));
        }).on(B.EventType.KEY_DOWN, function(b) {
          var c = new A.KeyboardEvent(b);
          if (!a.quickNavigateKey) return;
          if (c.key === a.quickNavigateKey.key) {
            B.EventHelper.stop(b, !0);
            a.navigateInTree(c.shiftKey ? "UpArrow" : "DownArrow");
          } else if (c.key === "DownArrow" || c.key === "UpArrow" || c.key === "PageDown" || c.key === "PageUp") {
            B.EventHelper.stop(b, !0);
            a.navigateInTree(c.key);
          }
        }).on(B.EventType.KEY_UP, function(b) {
          var c = new A.KeyboardEvent(b);
          if (!a.quickNavigateKey) return;
          if ((a.quickNavigateKey.ctrlCmd || a.quickNavigateKey.winCtrl) && c.key === "Ctrl" || c.key === "Enter") {
            var d = a.tree.getFocus();
            if (d) {
              a.elementSelected(d);
            }
          }
        }).clone();
      }).addClass("quick-open-widget").build(this.container);
    };

    a.prototype.onType = function() {
      var a = this.inputField.getHTMLElement().value;
      if (this.helpText) {
        if (a) {
          this.helpText.hide();
        } else {
          this.helpText.show();
        }
      }

      this.callbacks.onType(a);
    };

    a.prototype.navigateInTree = function(a, b) {
      var c = this.tree.getInput() ? this.tree.getInput().getEntries() : [];

      var d = this.tree.getFocus();

      var e = !1;

      var f = !1;
      if (c.length > 1) {
        if (a !== "UpArrow" || d !== c[0] && !! d) {
          if (a === "DownArrow" && d === c[c.length - 1]) {
            this.tree.setFocus(c[0]);
            e = !0;
          }
        } else {
          this.tree.setFocus(c[c.length - 1]);
          e = !0;
        }
      }
      if (!e) switch (a) {
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
          this.cycleThroughEntryGroups(c, d, b);

          f = !0;
      }
      d = this.tree.getFocus();

      if (d) {
        if (f) {
          this.tree.reveal(this.tree.getFocus(), 0);
        } else {
          this.tree.reveal(this.tree.getFocus());
        }
      }
    };

    a.prototype.cycleThroughEntryGroups = function(a, b, c) {
      if (a.length === 0) return;
      var d = b ? a.indexOf(b) : -1;
      if (d >= 0)
        if (!c)
          for (var e = d + 1; e < a.length; e++) {
            var f = a[e];
            if (f instanceof w.QuickOpenEntryGroup && f.getGroupLabel()) {
              this.tree.setFocus(f);
              return;
            }
          } else
            for (var e = d - 1; e >= 0; e--) {
              var g = a[e];
              if (g instanceof w.QuickOpenEntryGroup && g.getGroupLabel()) {
                this.tree.setFocus(g);
                return;
              }
            }
      if (!c) {
        this.tree.setFocus(a[0]);
        return;
      }
      for (var e = a.length - 1; e >= 0; e--) {
        var g = a[e];
        if (g instanceof w.QuickOpenEntryGroup && g.getGroupLabel()) {
          this.tree.setFocus(g);
          return;
        }
      }
    };

    a.prototype.elementFocused = function(a) {
      if (a instanceof w.QuickOpenEntry && this.isVisible()) {
        var b = a;
        a.run(w.Mode.PREVIEW);
      }
    };

    a.prototype.elementSelected = function(a) {
      var b = !0;
      if (a instanceof w.QuickOpenEntry && this.isVisible()) {
        var c = a;
        b = a.run(w.Mode.OPEN);
      }
      var d = this.tree.getInput().entries.indexOf(a);

      var e = this.tree.getInput().entries.length;
      this.usageLogger.publicLog("quickOpenWidgetItemAccepted", {
        index: d,
        count: e,
        isQuickNavigate: this.quickNavigateKey ? !0 : !1
      });

      if (b) {
        this.hide();
      }
    };

    a.prototype.show = function(a, b, c) {
      if (typeof b == "undefined") {
        b = {};
      }

      this.visible = !0;

      this.isLoosingFocus = !1;

      this.quickNavigateKey = c;

      this.builder.removeClass("transparent");

      if (this.quickNavigateKey) {
        this.inputField.hide();
        this.treeContainer.removeClass("transition");
        this.builder.show();
        this.tree.DOMFocus();
      } else {
        this.inputField.show();
        this.treeContainer.addClass("transition");
        this.builder.show();
        this.inputField.domFocus();
      }

      if (this.helpText) {
        if (this.quickNavigateKey || s.isString(a)) {
          this.helpText.hide();
        } else {
          this.helpText.show();
        }
      }

      if (s.isString(a)) {
        this.doShowWithPrefix(a);
      } else {
        this.doShowWithInput(a, b);
      }
    };

    a.prototype.doShowWithPrefix = function(a) {
      this.inputField.getHTMLElement().value = a;

      this.callbacks.onType(a);
    };

    a.prototype.doShowWithInput = function(a, b) {
      this.setInput(a, b);
    };

    a.prototype.setInputAndLayout = function(a, b) {
      var c = this;

      var d = u.generateUuid();
      this.currentInputToken = d;

      this.treeContainer.style({
        height: this.getHeight(a) + "px"
      });

      this.getAnimationPromise().then(function() {
        if (c.currentInputToken === d) {
          c.tree.setInput(a).done(function() {
            c.tree.layout();

            if (a && a.getEntries().length > 0) {
              c.autoFocus(a, b);
            }
          }, t.onUnexpectedError);
        }
      });
    };

    a.prototype.autoFocus = function(a, b) {
      if (b.autoFocusPrefixMatch) {
        var c = a.getEntries();

        var d;

        var e;

        var f = b.autoFocusPrefixMatch;

        var g = f.toLowerCase();
        for (var h = 0; h < c.length; h++) {
          var i = c[h];
          if (!d && i.getLabel().indexOf(f) === 0) {
            d = i;
          } else {
            if (!e && i.getLabel().toLowerCase().indexOf(g) === 0) {
              e = i;
            }
          }
          if (d && e) break;
        }
        var j = d || e;
        if (j) {
          this.tree.setFocus(j);

          this.tree.reveal(j, .5);
          return;
        }
      }
      if (b.autoFocusFirstEntry) {
        this.tree.focusNext();
        this.tree.reveal(this.tree.getFocus(), 0);
      }
    };

    a.prototype.refreshAndLayout = function(a, b) {
      var c = this;
      if (!this.isVisible()) return;
      this.treeContainer.style({
        height: this.getHeight(a) + "px"
      });

      this.getAnimationPromise().then(function() {
        c.tree.refresh().done(function() {
          c.tree.layout();

          if (!c.tree.getFocus() && a && a.getEntries().length > 0) {
            c.autoFocus(a, b);
          }
        }, t.onUnexpectedError);
      });
    };

    a.prototype.getAnimationPromise = function() {
      return this.treeContainer.hasClass("transition") ? p.Promise.timeout(C) : p.Promise.as(null);
    };

    a.prototype.getHeight = function(a) {
      var b = this.renderer.getHeight(this.tree, null);

      var c = this.configuration.minItemsToShow;
      if (a) {
        var d = a.getEntries();
        c = d.length;
      }
      return Math.min(this.configuration.maxItemsToShow * b, c * b);
    };

    a.prototype.hide = function(a) {
      if (typeof a == "undefined") {
        a = !1;
      }
      if (!this.isVisible()) return;
      this.visible = !1;

      this.builder.hide();

      this.builder.domBlur();
      if (a) {
        var b = this.tree.getInput().entries.length;
        this.usageLogger.publicLog("quickOpenWidgetCancelled", {
          count: b,
          isQuickNavigate: this.quickNavigateKey ? !0 : !1
        });
      }
      this.inputField.getHTMLElement().value = "";

      this.tree.setInput(null);
      var c = this.renderer.getHeight(this.tree, null);
      this.treeContainer.style({
        height: this.configuration.minItemsToShow * c + "px"
      });

      this.progressBar.stop().getContainer().hide();

      if (this.tree.isDOMFocused()) {
        this.tree.DOMBlur();
      } else {
        if (this.inputField.hasFocus()) {
          this.inputField.domBlur();
        }
      }

      if (a) {
        this.callbacks.onCancel();
      } else {
        this.callbacks.onOk();
      }
    };

    a.prototype.setInput = function(a, b) {
      if (!this.isVisible()) return;
      this.setInputAndLayout(a, b);
    };

    a.prototype.getInput = function() {
      return this.tree.getInput();
    };

    a.prototype.runFocus = function() {
      var a = this.tree.getFocus();
      return a ? (this.elementSelected(a), !0) : !1;
    };

    a.prototype.getProgressBar = function() {
      return this.progressBar;
    };

    a.prototype.isVisible = function() {
      return this.visible;
    };

    a.prototype.gainingFocus = function() {
      this.isLoosingFocus = !1;
    };

    a.prototype.loosingFocus = function() {
      var a = this;
      if (!this.isVisible()) return;
      this.isLoosingFocus = !0;

      p.Promise.timeout(0).then(function() {
        if (!a.isLoosingFocus) return;
        a.hide(!1);
      });
    };

    a.prototype.dispose = function() {
      while (this.toUnbind.length) {
        this.toUnbind.pop()();
      }
      this.progressBar.dispose();

      this.tree.dispose();
    };

    return a;
  }();
  b.QuickOpenWidget = E;
});