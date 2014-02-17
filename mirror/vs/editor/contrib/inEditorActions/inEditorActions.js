define("vs/editor/contrib/inEditorActions/inEditorActions", ["require", "exports", "vs/nls!vs/editor/editor.main",
  "vs/base/lib/winjs.base", "vs/platform/platform", "vs/platform/actionRegistry", "vs/platform/handlerService",
  "vs/base/dom/dom", "vs/base/eventEmitter", "vs/base/types", "vs/editor/editorExtensions",
  "vs/editor/core/editorState", "vs/editor/core/constants", "vs/base/ui/actions", "vs/base/ui/widgets/actionbar",
  "vs/base/dom/builder", "vs/base/ui/events", "vs/base/dom/mouseEvent", "vs/editor/editor",
  "vs/css!./inEditorActions"
], function(e, t, n, i, o, r, s, a, u, l, c, d, h, p, f, g, m, v) {
  {
    var y = g.$;

    var _ = function(e) {
      function t(n) {
        e.call(this, [t.Events.Updated]);

        this.editor = n;

        this.request = i.TPromise.as(null);

        this.delayedRequest = i.TPromise.as(null);

        this.state = null;

        this.actions = [];
      }
      __extends(t, e);

      t.prototype.hasActions = function() {
        return this.actions.length > 0;
      };

      t.prototype.getActions = function() {
        return this.actions;
      };

      t.prototype.deferredUpdate = function() {
        var e = this;
        this.delayedRequest.cancel();

        this.delayedRequest = i.TPromise.timeout(500);

        this.delayedRequest.then(function() {
          return e.update();
        });
      };

      t.prototype.update = function() {
        var e = this;
        if (null !== this.state && this.state.validate()) {
          this.emit(t.Events.Updated, this);
          return i.TPromise.as(null);
        }
        var n = this.editor.getModel();
        if (!n || !n.getMode().inEditorActionsSupport) {
          this.actions = [];
          this.emit(t.Events.Updated, this);
          return i.TPromise.as(null);
        }
        this.request.cancel();

        this.state = d.capture(this.editor, 2);
        var o = n.getMode().inEditorActionsSupport;
        this.request = o.getActionsAtPosition(this.editor.getModel().getAssociatedResource(), this.editor.getPosition());

        return this.request.then(function(n) {
          e.actions = e.state.validate() ? n : [];

          e.emit(t.Events.Updated, e);
        });
      };

      t.Events = {
        Updated: "inEditorAction.model.update"
      };

      return t;
    }(u.EventEmitter);

    var b = function() {
      function e(e, t, n) {
        this.editor = e;

        this.handlerService = t;

        this.model = n;

        this.toUnhook = [];

        this.domNode = document.createElement("div");

        this.trigger = null;

        this.details = null;

        this.actionBar = null;

        this.expanded = !1;

        this.isVisible = !1;

        this.create();

        this.add();

        this.hide();
      }
      e.prototype.create = function() {
        var e = this;

        var t = y(this.domNode).addClass("in-editor-actions");
        t.div({
          "class": "arrow no-user-selection"
        }, function(t) {
          t.attr({
            role: "button",
            "aria-haspopup": "true",
            "aria-label": n.localize("vs_editor_contrib_inEditorActions_inEditorActions", 0)
          });

          e.trigger = t;

          e.trigger.on(a.EventType.CLICK, function(t) {
            e.setExpanded(!e.expanded);

            (new v.StandardMouseEvent(t)).preventDefault();
          }, e.toUnhook);
        });

        t.div({
          "class": "menu no-user-selection"
        }, function(t) {
          e.details = t;

          e.actionBar = new f.ActionBar(e.details, {
            orientation: 2,
            context: e.editor
          });

          e.toUnhook.push(e.actionBar.addListener(m.EventType.BEFORE_RUN, function() {
            e.hide();
          }));

          e.toUnhook.push(e.actionBar.addListener(m.EventType.RUN, function(t) {
            if (t.result && l.isFunction(t.result.focus)) {
              t.result.focus();
            } else {
              e.editor.focus();
            }
          }));

          e.details.hide();
        });
      };

      e.prototype.show = function() {
        if (!this.isVisible) {
          this.isVisible = !0;
          this.domNode.style.display = "block";
          this.editor.layoutContentWidget(this);
        }
      };

      e.prototype.hide = function() {
        if (this.isVisible) {
          this.setExpanded(!1);
          this.isVisible = !1;
          this.domNode.style.display = "none";
          this.editor.layoutContentWidget(this);
        }
      };

      e.prototype.getPosition = function() {
        return this.isVisible ? {
          position: this.editor.getPosition(),
          preference: [2]
        } : null;
      };

      e.prototype.fillActionBar = function() {
        var e = this;
        this.actionBar.clear();
        for (var t = o.Registry.as(c.Extensions.EditorContributions), i = t.getEditorContributions(), a = {}, u = 0; u <
          i.length; u++) {
          var l = i[u];
          if (l instanceof r.ActionDescriptor) {
            var d = l;
            if (d.keybindings && d.keybindings.length > 0) {
              a[d.id] = s.asString(d.keybindings[0]);
            }
          }
        }
        var h = this.model.getActions();
        h.forEach(function(t) {
          var i = e.editor.getAction(t);
          if (i) {
            if (i.enabled) {
              var o;
              o = a[i.id] ? n.localize("vs_editor_contrib_inEditorActions_inEditorActions", 1, i.label, a[i.id]) :
                i.label;

              e.actionBar.push(new p.Action(i.id, o, i.class, !0, function(e) {
                return i.run(e);
              }));
            }
          } else {
            console.warn("NO action found for " + t);
          }
        });

        if (h.length > 0) {
          this.show();
        } else {
          this.hide();
        }
      };

      e.prototype.setExpanded = function(e) {
        if (this.isVisible) {
          this.expanded = e;
          if (this.expanded) {
            this.details.show();
            this.trigger.addClass("active");
            this.actionBar.focus(!0);
          } else {
            this.details.hide();
            this.trigger.removeClass("active");
          }
        }
      };

      e.prototype.getDomNode = function() {
        return this.domNode;
      };

      e.prototype.getId = function() {
        return e.ID;
      };

      e.prototype.add = function() {
        var e = this;
        this.editor.addContentWidget(this);

        this.toUnhook.push(this.model.addListener(_.Events.Updated, function() {
          return e.fillActionBar();
        }));

        this.toUnhook.push(this.editor.addListener(h.EventType.CursorPositionChanged, function() {
          return e.hide();
        }));

        this.toUnhook.push(this.editor.addListener(h.EventType.ModelChanged, function() {
          return e.hide();
        }));

        this.toUnhook.push(this.handlerService.bind({
          key: "Escape"
        }, function() {
          return e.isVisible ? (e.hide(), e.editor.focus(), !0) : !1;
        }).dispose);

        this.toUnhook.push(this.handlerService.bind({
          key: "Tab"
        }, function() {
          e.isVisible && e.hide();

          return !1;
        }).dispose);
      };

      e.prototype.dispose = function() {
        for (; this.toUnhook.length > 0;) {
          this.toUnhook.pop()();
        }
        if (this.domNode && this.domNode.parentElement) {
          this.domNode.parentElement.removeChild(this.domNode);
        }

        this.actionBar.dispose();

        this.domNode = null;
      };

      e.ID = "editor.contrib.triggerWidget";

      return e;
    }();
    ! function(e) {
      function t(t, n) {
        var i = this;
        e.call(this, t, n, c.Precondition.WidgetFocus);

        this.model = new _(t);

        this.widget = null;

        this.toUnhook.push(t.addListener(h.EventType.CursorPositionChanged, function(e) {
          if (i.enabled && "explicit" === e.reason && "mouse" === e.source) {
            var t = i.editor.getSelection();
            if (t.startLineNumber === t.endLineNumber) {
              var n = i.editor.getModel().getWordAtPosition({
                lineNumber: t.startLineNumber,
                column: t.startColumn
              }, !0, !0);
              if (!(!n || n.startColumn > t.startColumn || n.endColumn < t.endColumn)) {
                i.model.deferredUpdate();
              }
            }
          }
        }));
      }
      __extends(t, e);

      t.prototype.injectHandlerService = function(t) {
        e.prototype.injectHandlerService.call(this, t);

        if (!this.widget) {
          this.widget = new b(this.editor, this.handlerService, this.model);
        }
      };

      t.prototype.run = function() {
        var e = this;
        return this.model.update().then(function() {
          e.widget.setExpanded(!0);
        });
      };

      t.prototype.dispose = function() {
        e.prototype.dispose.call(this);

        if (this.model) {
          this.model.dispose();
          this.model = null;
        }

        if (this.widget) {
          this.widget.dispose();
          this.widget = null;
        }
      };

      t.ID = "editor.action.inEditorActions.now";

      return t;
    }(c.EditorAction);
  }
});