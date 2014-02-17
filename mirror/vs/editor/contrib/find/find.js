var __extends = this.__extends || function(a, b) {
    function d() {
      this.constructor = a;
    }
    for (var c in b) b.hasOwnProperty(c) && (a[c] = b[c]);
    d.prototype = b.prototype;

    a.prototype = new d;
  };

define(["require", "exports", "vs/base/lib/winjs.base", "vs/platform/platform", "vs/platform/actionRegistry",
  "vs/editor/editorExtensions", "./findWidget", "./findModel", "vs/nls", "vs/editor/core/constants"
], function(a, b, c, d, e, f, g, h, i, j) {
  var k = c;

  var l = d;

  var m = e;

  var n = f;

  var o = g;

  var p = h;

  var q = i;

  var r = j;

  var s = function() {
    function a(a) {
      var b = this;
      this.editor = a;

      this.handlerService = null;

      this.binding = null;

      this.model = null;

      this.widget = null;

      this.widgetIsVisible = !1;

      this.lastState = null;

      this.widgetListeners = [];

      this.editorListeners = [];

      this.editorListeners.push(this.editor.addListener(r.EventType.ModelChanged, function() {
        b.disposeBindingAndModel();

        b.editor.getModel() && b.lastState && b.widgetIsVisible && b._start(b.lastState.isReplaceEnabled, !1, !1);
      }));

      this.editorListeners.push(this.editor.addListener(r.EventType.Disposed, function() {
        b.editorListeners.forEach(function(a) {
          a();
        });

        b.editorListeners = [];
      }));
    }
    a.getFindController = function(b) {
      return b.getContribution(a.ID);
    };

    a.prototype.injectHandlerService = function(a) {
      this.handlerService = a;
    };

    a.prototype.getId = function() {
      return a.ID;
    };

    a.prototype.dispose = function() {
      this.widgetListeners.forEach(function(a) {
        a();
      });

      this.widgetListeners = [];

      this.widget && (this.widget.destroy(), this.widget = null);

      this.disposeBindingAndModel();
    };

    a.prototype.disposeBindingAndModel = function() {
      this.binding && (this.binding.dispose(), this.binding = null);

      this.widget && this.widget.setModel(null);

      this.model && (this.model.destroy(), this.model = null);
    };

    a.prototype.onEscape = function() {
      this.widgetIsVisible = !1;

      this.disposeBindingAndModel();

      return !0;
    };

    a.prototype.onWidgetClosed = function() {
      this.widgetIsVisible = !1;

      this.disposeBindingAndModel();
    };

    a.prototype.onWidgetUserInput = function() {
      this.lastState = this.widget.getState();

      this.model && this.model.update(this.lastState, !0);
    };

    a.prototype._start = function(a, b, c) {
      var d = this;
      this.widget || (this.widget = new o.FindWidget(this.editor), this.widgetListeners.push(this.widget.addListener(
        o.FindWidget.USER_INPUT_EVENT, function() {
          return d.onWidgetUserInput();
        })), this.widgetListeners.push(this.widget.addListener(o.FindWidget.USER_CLOSED_EVENT, function() {
        return d.onWidgetClosed();
      })));

      this.model || (this.model = new p.FindModelBoundToEditorModel(this.editor), this.widget.setModel(this.model));

      this.binding === null && (this.binding = this.handlerService.bind({
        key: "Escape"
      }, function() {
        return d.onEscape();
      }));

      this.lastState = this.lastState || this.widget.getState();
      var e = this.editor.getSelection();
      b && !e.isEmpty() && e.startLineNumber === e.endLineNumber && (this.lastState.searchString = this.editor.getModel()
        .getValueInRange(e));

      a && (this.lastState.isReplaceEnabled = a);

      this.model.start(this.lastState, c);

      this.widgetIsVisible = !0;
    };

    a.prototype.start = function(a) {
      this._start(a, !0, !0);
    };

    a.prototype.next = function() {
      return this.model ? (this.model.next(), !0) : !1;
    };

    a.prototype.prev = function() {
      return this.model ? (this.model.prev(), !0) : !1;
    };

    a.prototype.replace = function() {
      return this.model ? (this.model.replace(), !0) : !1;
    };

    a.prototype.replaceAll = function() {
      return this.model ? (this.model.replaceAll(), !0) : !1;
    };

    a.ID = "editor.contrib.findController";

    return a;
  }();
  b.FindController = s;
  var t = function(a) {
    function b(b, c) {
      a.call(this, b, c, n.Precondition.WidgetFocus);

      this.handlerService = null;
    }
    __extends(b, a);

    b.prototype.getEnablementState = function() {
      return a.prototype.getEnablementState.call(this) && !! this.handlerService;
    };

    b.prototype._startController = function(a) {
      a.start(!1);
    };

    b.prototype.run = function() {
      var a = s.getFindController(this.editor);
      this._startController(a);

      return k.Promise.as(!0);
    };

    return b;
  }(n.EditorAction);
  b.StartFindAction = t;
  var u = function(a) {
    function b(b, c) {
      a.call(this, b, c, n.Precondition.WidgetFocus);
    }
    __extends(b, a);

    b.prototype.run = function() {
      var a = s.getFindController(this.editor);
      return a.next() ? k.Promise.as(!0) : this.editor.getAction(p.START_FIND_ID).run();
    };

    return b;
  }(n.EditorAction);
  b.NextMatchFindAction = u;
  var v = function(a) {
    function b(b, c) {
      a.call(this, b, c, n.Precondition.WidgetFocus);
    }
    __extends(b, a);

    b.prototype.run = function() {
      var a = s.getFindController(this.editor);
      return a.prev() ? k.Promise.as(!0) : this.editor.getAction(p.START_FIND_ID).run();
    };

    return b;
  }(n.EditorAction);
  b.PreviousMatchFindAction = v;
  var w = function(a) {
    function b(b, c) {
      a.call(this, b, c);
    }
    __extends(b, a);

    b.prototype.getId = function() {
      return p.START_FIND_REPLACE_ID;
    };

    b.prototype._startController = function(a) {
      a.start(!0);
    };

    return b;
  }(t);
  b.StartFindReplaceAction = w;
  var x = function(a) {
    function b(b, c) {
      a.call(this, b, c, n.Precondition.WidgetFocus);

      this.label = q.localize("replaceAction", "Replace this instance");
    }
    __extends(b, a);

    b.prototype.run = function() {
      var a = s.getFindController(this.editor);
      return a.replace() ? k.Promise.as(!0) : k.Promise.as(!1);
    };

    return b;
  }(n.EditorAction);
  b.ReplaceAction = x;
  var y = function(a) {
    function b(b, c) {
      a.call(this, b, c, n.Precondition.WidgetFocus);

      this.label = q.localize("replaceAllAction", "Replace all instances");
    }
    __extends(b, a);

    b.prototype.run = function() {
      var a = s.getFindController(this.editor);
      return a.replaceAll() ? k.Promise.as(!0) : k.Promise.as(!1);
    };

    return b;
  }(n.EditorAction);
  b.ReplaceAllAction = y;
  var z = l.Registry.as(n.Extensions.EditorContributions);
  z.registerEditorContribution(new m.ActionDescriptor(t, p.START_FIND_ID, q.localize("startFindAction", "Find"), {
    ctrlCmd: !0,
    key: "F"
  }, {
    ctrlCmd: !0,
    key: "F3"
  }));

  z.registerEditorContribution(new m.ActionDescriptor(u, p.NEXT_MATCH_FIND_ID, q.localize("findNextMatchAction",
    "Find next"), {
    key: "F3"
  }));

  z.registerEditorContribution(new m.ActionDescriptor(v, p.PREVIOUS_MATCH_FIND_ID, q.localize(
    "findPreviousMatchAction", "Find previous"), {
    shift: !0,
    key: "F3"
  }));

  z.registerEditorContribution(new m.ActionDescriptor(w, p.START_FIND_REPLACE_ID, q.localize("startReplace",
    "Replace"), {
    ctrlCmd: !0,
    key: "H"
  }));

  z.registerEditorContribution(new m.ActionDescriptor(x, p.REPLACE_ID, q.localize("replace.replaceThis",
    "Replace this instance")));

  z.registerEditorContribution(new m.ActionDescriptor(y, p.REPLACE_ALL_ID, q.localize("replace.replaceAll",
    "Replace all instances")));

  z.registerEditorContribution(new l.BaseDescriptor(s));
});