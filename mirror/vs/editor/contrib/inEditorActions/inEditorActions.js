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

define(["require", "exports", "vs/nls", "vs/base/lib/winjs.base", "vs/platform/platform", "vs/platform/actionRegistry",
  "vs/platform/handlerService", "vs/base/dom/dom", "vs/base/eventEmitter", "vs/base/types",
  "vs/editor/editorExtensions", "vs/editor/core/editorState", "vs/editor/core/constants", "vs/base/ui/actions",
  "vs/base/ui/widgets/actionbar", "vs/base/dom/builder", "vs/base/ui/events", "vs/base/dom/mouseEvent",
  "vs/editor/editor", "vs/css!./inEditorActions"
], function(a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s) {
  var t = c;

  var u = d;

  var v = e;

  var w = f;

  var x = g;

  var y = h;

  var z = i;

  var A = j;

  var B = k;

  var C = l;

  var D = m;

  var E = n;

  var F = o;

  var G = p;

  var H = q;

  var I = r;

  var J = s;

  var K = function(a) {
    function b(b) {
      a.call(this);

      this.editor = b;

      this.request = u.Promise.as(!0);

      this.delayedRequest = u.Promise.as(!0);

      this.state = null;

      this.actions = [];
    }
    __extends(b, a);

    b.prototype.hasActions = function() {
      return this.actions.length > 0;
    };

    b.prototype.getActions = function() {
      return this.actions;
    };

    b.prototype.deferredUpdate = function() {
      var a = this;
      this.delayedRequest.cancel();

      this.delayedRequest = u.Promise.timeout(500);

      this.delayedRequest.then(function() {
        return a.update();
      });
    };

    b.prototype.update = function() {
      var a = this;
      if (this.state !== null && this.state.validate()) {
        this.emit(b.Events.Updated, this);
        return u.Promise.as(null);
      }
      var c = this.editor.getModel();
      if (!c || !c.getMode().inEditorActionsSupport) {
        this.actions = [];
        this.emit(b.Events.Updated, this);
        return u.Promise.as(null);
      }
      this.request.cancel();

      this.state = C.capture(this.editor, C.Flag.Position);
      var d = c.getMode().inEditorActionsSupport;
      this.request = d.getActionsAtPosition(this.editor.getModel().getAssociatedResource(), this.editor.getPosition());

      return this.request.then(function(c) {
        a.state.validate() ? a.actions = c : a.actions = [];

        a.emit(b.Events.Updated, a);
      });
    };

    b.Events = {
      Updated: "inEditorAction.model.update"
    };

    return b;
  }(z.EventEmitter);

  var L = function() {
    function a(a, b, c) {
      this.editor = a;

      this.handlerService = b;

      this.model = c;

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
    a.prototype.create = function() {
      var a = this;

      var b = G.Build.withElement(this.domNode).addClass("in-editor-actions");
      b.div({
        "class": "arrow"
      }, function(b) {
        b.attr({
          role: "button",
          "aria-haspopup": "true",
          "aria-label": t.localize("editorActionArrowAccessibleLabel", "Open editor actions")
        });

        a.trigger = b;

        a.trigger.on(y.EventType.CLICK, function(b) {
          a.setExpanded(!a.expanded);

          (new I.MouseEvent(b)).preventDefault();
        }, a.toUnhook);
      });

      b.div({
        "class": "menu"
      }, function(b) {
        a.details = b;

        a.actionBar = new F.ActionBar(a.details, {
          orientation: F.ActionsOrientation.VERTICAL,
          context: a.editor
        });

        a.toUnhook.push(a.actionBar.addListener(H.EventType.BEFORE_RUN, function(b) {
          a.hide();
        }));

        a.toUnhook.push(a.actionBar.addListener(H.EventType.RUN, function(b) {
          b.result && A.isFunction(b.result.focus) ? b.result.focus() : a.editor.focus();
        }));

        a.details.hide();
      });
    };

    a.prototype.show = function() {
      if (!this.isVisible) {
        this.isVisible = !0;
        this.domNode.style.display = "block";
        this.editor.layoutContentWidget(this);
      }
    };

    a.prototype.hide = function() {
      if (this.isVisible) {
        this.setExpanded(!1);
        this.isVisible = !1;
        this.domNode.style.display = "none";
        this.editor.layoutContentWidget(this);
      }
    };

    a.prototype.getPosition = function() {
      return this.isVisible ? {
        position: this.editor.getPosition(),
        preference: [J.ContentWidgetPositionPreference.BELOW]
      } : null;
    };

    a.prototype.fillActionBar = function() {
      var a = this;
      this.actionBar.clear();
      var b = v.Registry.as(B.Extensions.EditorContributions);

      var c = b.getEditorContributions();

      var d = {};
      for (var e = 0; e < c.length; e++) {
        var f = c[e];
        if (f instanceof w.ActionDescriptor) {
          var g = f;
          if (g.keybindings && g.keybindings.length > 0) {
            d[g.id] = x.asString(g.keybindings[0]);
          }
        }
      }
      var h = this.model.getActions();
      h.forEach(function(b) {
        var c = a.editor.getAction(b);
        if (c) {
          if (c.enabled) {
            var e;
            d[c.id] ? e = t.localize("ineditor.menu.keybinding", "{0} ({1})", c.label, d[c.id]) : e = c.label;

            a.actionBar.push(new E.Action(c.id, e, c.class, !0, function(a) {
              return c.run(a);
            }));
          }
        } else {
          console.warn("NO action found for " + b);
        }
      });

      h.length > 0 ? this.show() : this.hide();
    };

    a.prototype.setExpanded = function(a) {
      if (this.isVisible) {
        this.expanded = a;
        this.expanded ? (this.details.show(), this.trigger.addClass("active"), this.actionBar.focus()) : (this.details
          .hide(), this.trigger.removeClass("active"));
      }
    };

    a.prototype.getDomNode = function() {
      return this.domNode;
    };

    a.prototype.getId = function() {
      return a.ID;
    };

    a.prototype.add = function() {
      var a = this;
      this.editor.addContentWidget(this);

      this.toUnhook.push(this.model.addListener(K.Events.Updated, function() {
        return a.fillActionBar();
      }));

      this.toUnhook.push(this.editor.addListener(D.EventType.CursorPositionChanged, function() {
        return a.hide();
      }));

      this.toUnhook.push(this.editor.addListener(D.EventType.ModelChanged, function() {
        return a.hide();
      }));

      this.toUnhook.push(this.handlerService.bind({
        key: "Escape"
      }, function() {
        return a.isVisible ? (a.hide(), a.editor.focus(), !0) : !1;
      }).dispose);

      this.toUnhook.push(this.handlerService.bind({
        key: "Tab"
      }, function() {
        a.isVisible && a.hide();

        return !1;
      }).dispose);
    };

    a.prototype.dispose = function() {
      while (this.toUnhook.length > 0) {
        this.toUnhook.pop()();
      }
      if (this.domNode) {
        this.domNode.parentElement.removeChild(this.domNode);
      }

      this.actionBar.dispose();

      this.domNode = null;
    };

    a.ID = "editor.contrib.triggerWidget";

    return a;
  }();

  var M = function(a) {
    function b(b, c) {
      var d = this;
      a.call(this, b, c, B.Precondition.WidgetFocus);

      this.model = new K(b);

      this.widget = null;

      this.toUnhook.push(b.addListener(D.EventType.CursorPositionChanged, function(a) {
        if (!d.enabled) return;
        if (a.reason !== "explicit") return;
        if (a.source !== "mouse") return;
        var b = d.editor.getSelection();
        if (b.startLineNumber !== b.endLineNumber) return;
        var c = d.editor.getModel().getWordAtPosition({
          lineNumber: b.startLineNumber,
          column: b.startColumn
        }, !0);
        if (!c || c.startColumn > b.startColumn || c.endColumn < b.endColumn) return;
        d.model.deferredUpdate();
      }));
    }
    __extends(b, a);

    b.prototype.injectHandlerService = function(b) {
      a.prototype.injectHandlerService.call(this, b);

      if (!this.widget) {
        this.widget = new L(this.editor, this.handlerService, this.model);
      }
    };

    b.prototype.run = function() {
      var a = this;
      return this.model.update().then(function() {
        a.widget.setExpanded(!0);
      });
    };

    b.prototype.dispose = function() {
      a.prototype.dispose.call(this);

      if (this.model) {
        this.model.dispose();
        this.model = null;
      }

      if (this.widget) {
        this.widget.dispose();
        this.widget = null;
      }
    };

    b.ID = "editor.action.inEditorActions.now";

    return b;
  }(B.EditorAction);

  var N = new w.ActionDescriptor(M, M.ID, t.localize("action.inEditorActions.label", "Show editor actions"), {
    ctrlCmd: !0,
    key: "."
  });

  var O = v.Registry.as(B.Extensions.EditorContributions);
  O.registerEditorContribution(N);
});