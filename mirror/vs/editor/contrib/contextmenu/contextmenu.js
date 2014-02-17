define("vs/editor/contrib/contextmenu/contextmenu", ["require", "exports", "vs/nls!vs/editor/editor.main",
  "vs/base/dom/dom", "vs/base/errors", "vs/base/lib/winjs.base", "vs/platform/platform", "vs/editor/editorExtensions",
  "vs/editor/editor", "vs/editor/core/editorState", "vs/platform/handlerService", "vs/platform/actionRegistry",
  "vs/base/ui/widgets/actionbar", "vs/base/lifecycle", "vs/base/types", "vs/base/arrays", "vs/editor/core/constants"
], function(e, t, n, i, o, r, s, a, u, l, c, d, h, p, f, g, m) {
  var v = function() {
    function e(e) {
      var t = this;
      this._editor = e;

      this._toDispose = [];

      this._contextMenuIsBeingShownCount = 0;

      this._editorActionsRequest = r.TPromise.as(null);

      this._toDispose.push(this._editor.addListener2(m.EventType.ContextMenu, function(e) {
        return t._onContextMenu(e);
      }));
    }
    e.prototype.injectContextMenuService = function(e) {
      this.contextMenuService = e;
    };

    e.prototype.injectContextViewService = function(e) {
      this.contextViewService = e;
    };

    e.prototype._onContextMenu = function(e) {
      if (this._editor.getConfiguration().contextmenu && 12 !== e.target.type && (e.event.preventDefault(), 6 === e.target
        .type || 7 === e.target.type || 1 === e.target.type)) {
        this._editor.focus();

        if (e.target.position && !this._editor.getSelection().containsPosition(e.target.position)) {
          this._editor.setPosition(e.target.position);
        }
        var t;
        if (1 !== e.target.type) {
          t = {
            x: e.event.posx,
            y: e.event.posy + 1
          };
        }

        this.showContextMenu(t);
      }
    };

    e.prototype.showContextMenu = function(t) {
      var n = this;
      if (this.contextMenuService) {
        var i = this._editor.getPosition();

        var s = this._editor.getModel();
        if (i && s) {
          this._editor.revealPosition(i, !1, !1);
          var a = this._getMenuActions();
          if (a.length > 0) {
            this._editorActionsRequest.cancel();

            this._editorState = l.capture(this._editor, 2);
            var u = s.getMode().inEditorActionsSupport;
            this._editorActionsRequest = u.getActionsAtPosition(this._editor.getModel().getAssociatedResource(), this
              ._editor.getPosition());
            var c = r.Promise.timeout(e.MAX_WORKER_WAIT).then(function() {
              return e.PREDEFINED;
            });
            r.TPromise.any([c, this._editorActionsRequest]).then(function(i) {
              return i.value.then(function(i) {
                if (n._editorState.validate()) {
                  for (var o = 0; o < a.length; o++) {
                    var r = a[o];
                    if (!(e.PREDEFINED.indexOf(r.id) < 0)) {
                      r.enabled = i.indexOf(r.id) >= 0;
                    }
                  }
                  n._doShowContextMenu(a, t);
                }
              });
            }, o.onUnexpectedError);
          }
        }
      }
    };

    e.prototype._getMenuActions = function() {
      var t = this._editor.getActions();

      var n = e.PREDEFINED.map(function(n) {
        if (n === e.SEPARATOR) {
          return new h.Separator;
        }
        var i = t.filter(function(e) {
          return e.id === n;
        });
        if (i && i.length > 0) {
          var o = i[0];
          if (o.enabled && f.isFunction(o.shouldShowInContextMenu) && o.shouldShowInContextMenu()) {
            return o;
          }
        }
        return null;
      });

      var i = this._prepareActions(g.coalesce(n));

      var o = t.filter(function(t) {
        return -1 === e.PREDEFINED.indexOf(t.id) && t.enabled && f.isFunction(t.shouldShowInContextMenu) && t.shouldShowInContextMenu();
      });
      o.length > 0 && i.length > 0 && i.push(new h.Separator);

      return i = i.concat(o);
    };

    e.prototype._prepareActions = function(e) {
      for (var t = 0; t < e.length; t++) {
        var n = e[t];
        if (f.isUndefinedOrNull(n.order)) {
          n.order = t;
        }
      }
      e = e.sort(function(e, t) {
        var n = e.order;

        var i = t.order;
        return i > n ? -1 : 1;
      });
      for (var i = -1, o = 0; o < e.length; o++)
        if (e[o].id !== h.Separator.ID) {
          i = o;
          break;
        }
      if (-1 === i) {
        return [];
      }
      e = e.slice(i);
      for (var r = e.length - 1; r >= 0; r--) {
        var s = e[r].id === h.Separator.ID;
        if (!s) break;
        e.splice(r, 1);
      }
      for (var a = !1, u = e.length - 1; u >= 0; u--) {
        var s = e[u].id === h.Separator.ID;
        s && !a ? e.splice(u, 1) : s ? s && (a = !1) : a = !0;
      }
      return e;
    };

    e.prototype._doShowContextMenu = function(e, t) {
      var o = this;
      this._editor.beginForcedWidgetFocus();
      var s = this._editor.getConfiguration().hover;
      this._editor.updateOptions({
        hover: !1
      });
      var a = t;
      if (!a || f.isUndefinedOrNull(a.x) || f.isUndefinedOrNull(a.y)) {
        var u = this._editor.getScrolledVisiblePosition(this._editor.getPosition());

        var l = i.getDomNodePosition(this._editor.getDomNode());

        var d = l.left + u.left;

        var p = l.top + u.top + u.height;
        a = {
          x: a && !f.isUndefinedOrNull(a.x) ? a.x : d,
          y: a && !f.isUndefinedOrNull(a.y) ? a.y : p
        };
      }
      this.contextMenuService.showContextMenu(a, {
        getActions: function() {
          return r.TPromise.as(e);
        },
        getActionItem: function(e) {
          var t = e;
          if (f.isFunction(t.getDescriptor)) {
            var i = t.getDescriptor();

            var o = [];
            if (i.keybindings) {
              for (var r = 0; r < i.keybindings.length; r++) {
                o.push(c.asString(i.keybindings[r], !0));
              }
              if (o.length > 0) {
                return new h.ActionItem(e, e, {
                  label: !0,
                  keybinding: o.join(n.localize("vs_editor_contrib_contextmenu_contextmenu", 0))
                });
              }
            }
          }
          return null;
        },
        onHide: function() {
          o._contextMenuIsBeingShownCount--;

          o._editor.focus();

          o._editor.endForcedWidgetFocus();

          o._editor.updateOptions({
            hover: s
          });
        }
      });
    };

    e.prototype.getId = function() {
      return e.ID;
    };

    e.prototype.dispose = function() {
      if (this._contextMenuIsBeingShownCount > 0) {
        this.contextViewService.hideContextView();
      }

      this._toDispose = p.disposeAll(this._toDispose);
    };

    e.ID = "editor.contrib.contextmenu";

    e.MAX_WORKER_WAIT = 100;

    e.SEPARATOR = "editor.action.separator";

    e.PREDEFINED = ["editor.actions.previewDeclaration", "editor.actions.goToDeclaration",
      "editor.actions.goToTypeDeclaration", e.SEPARATOR, "editor.actions.referenceSearch.trigger", e.SEPARATOR,
      "editor.actions.rename", "editor.actions.changeAll"
    ];

    return e;
  }();

  var y = function(e) {
    function t(t, n) {
      e.call(this, t, n, a.Precondition.TextFocus);
    }
    __extends(t, e);

    t.prototype.run = function() {
      var e = this.editor.getContribution(v.ID);
      return e ? (e.showContextMenu(), r.Promise.as(null)) : r.Promise.as(null);
    };

    t.ID = "editor.action.showContextMenu";

    return t;
  }(a.EditorAction);

  var _ = s.Registry.as(a.Extensions.EditorContributions);
  _.registerEditorContribution(new s.BaseDescriptor(v));

  _.registerEditorContribution(new d.ActionDescriptor(y, y.ID, n.localize("vs_editor_contrib_contextmenu_contextmenu",
    1)));
});