define("vs/editor/contrib/find/find", ["require", "exports", "vs/base/lib/winjs.base", "vs/platform/platform",
  "vs/platform/actionRegistry", "vs/editor/editorExtensions", "./findWidget", "./findModel",
  "vs/nls!vs/editor/editor.main", "vs/editor/core/constants", "vs/base/lifecycle"
], function(e, t, n, i, o, r, s, a, u, l, c) {
  var d = function() {
    function e(e) {
      var t = this;
      this.editor = e;

      this.handlerService = null;

      this.binding = null;

      this.model = null;

      this.widgetIsVisible = !1;

      this.lastState = null;

      this.widget = new s.FindWidget(this.editor, this.contextViewService);

      this.widgetListeners = [];

      this.widgetListeners.push(this.widget.addClickEventListener(function() {
        return t.onWidgetClick();
      }));

      this.widgetListeners.push(this.widget.addUserInputEventListener(function(e) {
        return t.onWidgetUserInput(e);
      }));

      this.widgetListeners.push(this.widget.addClosedEventListener(function() {
        return t.onWidgetClosed();
      }));

      this.editorListeners = [];

      this.editorListeners.push(this.editor.addListener(l.EventType.ModelChanged, function() {
        t.disposeBindingAndModel();

        if (t.editor.getModel() && t.lastState && t.widgetIsVisible) {
          t._start(!1, !1, !1, !1);
        }
      }));

      this.editorListeners.push(this.editor.addListener(l.EventType.Disposed, function() {
        t.editorListeners.forEach(function(e) {
          e();
        });

        t.editorListeners = [];
      }));
    }
    e.getFindController = function(t) {
      return t.getContribution(e.ID);
    };

    e.prototype.injectHandlerService = function(e) {
      this.handlerService = e;
    };

    e.prototype.injectContextViewService = function(e) {
      this.contextViewService = e;
    };

    e.prototype.getId = function() {
      return e.ID;
    };

    e.prototype.dispose = function() {
      this.widgetListeners = c.disposeAll(this.widgetListeners);

      if (this.widget) {
        this.widget.dispose();
        this.widget = null;
      }

      this.disposeBindingAndModel();
    };

    e.prototype.disposeBindingAndModel = function() {
      if (this.binding) {
        this.binding.dispose();
        this.binding = null;
      }

      if (this.widget) {
        this.widget.setModel(null);
      }

      if (this.model) {
        this.model.dispose();
        this.model = null;
      }
    };

    e.prototype.onEscape = function() {
      this.widgetIsVisible = !1;

      this.disposeBindingAndModel();

      this.editor.focus();

      return !0;
    };

    e.prototype.onWidgetClosed = function() {
      this.widgetIsVisible = !1;

      this.disposeBindingAndModel();
    };

    e.prototype.onWidgetClick = function() {
      this._start(!1, !1, !0, !1);
    };

    e.prototype.onWidgetUserInput = function(e) {
      this.lastState = this.widget.getState();

      if (this.model) {
        this.model.recomputeMatches(this.lastState, e.jumpToNextMatch);
      }
    };

    e.prototype._start = function(e, t, n, i) {
      var o = this;
      if (!this.model) {
        this.model = new a.FindModelBoundToEditorModel(this.editor);
        this.widget.setModel(this.model);
      }

      if (null === this.binding) {
        this.binding = this.handlerService.bind({
          key: "Escape"
        }, function() {
          return o.onEscape();
        });
      }

      this.lastState = this.lastState || this.widget.getState();
      var r = this.editor.getSelection();
      if (t && !r.isEmpty() && r.startLineNumber === r.endLineNumber) {
        this.lastState.searchString = this.editor.getModel().getValueInRange(r);
      }
      var s = null;
      if (n && r.startLineNumber < r.endLineNumber) {
        s = r;
      }

      if (e) {
        this.lastState.isReplaceRevealed = e;
      }

      this.model.start(this.lastState, s, i);

      this.widgetIsVisible = !0;
    };

    e.prototype.startFromAction = function(e) {
      this._start(e, !0, !0, !0);
    };

    e.prototype.next = function() {
      return this.model ? (this.model.next(), !0) : !1;
    };

    e.prototype.prev = function() {
      return this.model ? (this.model.prev(), !0) : !1;
    };

    e.prototype.cancelSelectionFind = function() {
      if (this.model) {
        this.model.setFindScope(null);
      }
    };

    e.prototype.replace = function() {
      return this.model ? (this.model.replace(), !0) : !1;
    };

    e.prototype.replaceAll = function() {
      return this.model ? (this.model.replaceAll(), !0) : !1;
    };

    e.ID = "editor.contrib.findController";

    return e;
  }();
  t.FindController = d;
  var h = function(e) {
    function t(t, n) {
      e.call(this, t, n, r.Precondition.WidgetFocus);

      this.handlerService = null;
    }
    __extends(t, e);

    t.prototype.getEnablementState = function() {
      return e.prototype.getEnablementState.call(this) && !! this.handlerService;
    };

    t.prototype._startController = function(e) {
      e.startFromAction(!1);
    };

    t.prototype.run = function() {
      var e = d.getFindController(this.editor);
      this._startController(e);

      return n.TPromise.as(!0);
    };

    return t;
  }(r.EditorAction);
  t.StartFindAction = h;
  var p = function(e) {
    function t(t, n) {
      e.call(this, t, n, r.Precondition.WidgetFocus);
    }
    __extends(t, e);

    t.prototype.run = function() {
      var e = d.getFindController(this.editor);
      return e.next() ? n.TPromise.as(!0) : this.editor.getAction(a.START_FIND_ID).run();
    };

    return t;
  }(r.EditorAction);
  t.NextMatchFindAction = p;
  var f = function(e) {
    function t(t, n) {
      e.call(this, t, n, r.Precondition.WidgetFocus);
    }
    __extends(t, e);

    t.prototype.run = function() {
      var e = d.getFindController(this.editor);
      return e.prev() ? n.TPromise.as(!0) : this.editor.getAction(a.START_FIND_ID).run();
    };

    return t;
  }(r.EditorAction);
  t.PreviousMatchFindAction = f;
  var g = function(e) {
    function t(t, n) {
      e.call(this, t, n, r.Precondition.WidgetFocus);
    }
    __extends(t, e);

    t.prototype.run = function() {
      var e = d.getFindController(this.editor);
      e.cancelSelectionFind();

      return n.TPromise.as(!0);
    };

    return t;
  }(r.EditorAction);
  t.CancelSelectionFindAction = g;
  var m = function(e) {
    function t(t, n) {
      e.call(this, t, n);
    }
    __extends(t, e);

    t.prototype.getId = function() {
      return a.START_FIND_REPLACE_ID;
    };

    t.prototype._startController = function(e) {
      e.startFromAction(!0);
    };

    return t;
  }(h);
  t.StartFindReplaceAction = m;
  var v = function(e) {
    function t(t, n) {
      e.call(this, t, n, r.Precondition.WidgetFocus);

      this.label = u.localize("vs_editor_contrib_find_find", 0);
    }
    __extends(t, e);

    t.prototype.run = function() {
      var e = d.getFindController(this.editor);
      return e.replace() ? n.TPromise.as(!0) : n.TPromise.as(!1);
    };

    return t;
  }(r.EditorAction);
  t.ReplaceAction = v;
  var y = function(e) {
    function t(t, n) {
      e.call(this, t, n, r.Precondition.WidgetFocus);

      this.label = u.localize("vs_editor_contrib_find_find", 1);
    }
    __extends(t, e);

    t.prototype.run = function() {
      var e = d.getFindController(this.editor);
      return e.replaceAll() ? n.TPromise.as(!0) : n.TPromise.as(!1);
    };

    return t;
  }(r.EditorAction);
  t.ReplaceAllAction = y;
  var _ = i.Registry.as(r.Extensions.EditorContributions);
  _.registerEditorContribution(new o.ActionDescriptor(h, a.START_FIND_ID, u.localize("vs_editor_contrib_find_find", 2), {
    ctrlCmd: !0,
    key: "F"
  }, {
    ctrlCmd: !0,
    key: "F3"
  }));

  _.registerEditorContribution(new o.ActionDescriptor(p, a.NEXT_MATCH_FIND_ID, u.localize(
    "vs_editor_contrib_find_find", 3), {
    key: "F3"
  }));

  _.registerEditorContribution(new o.ActionDescriptor(f, a.PREVIOUS_MATCH_FIND_ID, u.localize(
    "vs_editor_contrib_find_find", 4), {
    shift: !0,
    key: "F3"
  }));

  _.registerEditorContribution(new o.ActionDescriptor(g, a.CANCEL_SELECTION_FIND_ID, u.localize(
    "vs_editor_contrib_find_find", 5)));

  _.registerEditorContribution(new o.ActionDescriptor(m, a.START_FIND_REPLACE_ID, u.localize(
    "vs_editor_contrib_find_find", 6), {
    ctrlCmd: !0,
    key: "H"
  }));

  _.registerEditorContribution(new o.ActionDescriptor(v, a.REPLACE_ID, u.localize("vs_editor_contrib_find_find", 7)));

  _.registerEditorContribution(new o.ActionDescriptor(y, a.REPLACE_ALL_ID, u.localize("vs_editor_contrib_find_find",
    8)));

  _.registerEditorContribution(new i.BaseDescriptor(d));
});