define("vs/editor/standalone/standaloneEditor", ["require", "exports", "vs/editor/core/codeEditorWidget",
  "vs/editor/diff/diffEditorWidget", "vs/editor/terminal/terminal", "vs/editor/standalone/simpleServices",
  "vs/platform/handlerService", "vs/platform/services", "vs/platform/telemetry/telemetryService",
  "vs/platform/contextview/contextviewService", "vs/editor/core/model/model", "vs/editor/core/model/consoleModel",
  "vs/platform/injectorService", "vs/platform/markers/markerService", "vs/editor/modes/modesExtensions",
  "vs/platform/platform", "vs/editor/modes/monarch/monarchCompile", "vs/editor/modes/monarch/monarch", "vs/base/env"
], function(e, t, n, i, o, r, s, a, u, l, c, d, h, p, f, g, m, v, y) {
  function _(e, t) {
    return new M(e, t);
  }

  function b(e, n, i) {
    var o;
    o = "string" == typeof n ? N.getMode(n) : t.createCustomMode(n);

    return new c.Model(e, o, i, T.markerService);
  }

  function C(e) {
    var t = new v.MonarchMode(m.compile(e));
    T.create().injectTo(t);

    return t;
  }

  function w(e, t, n) {
    var i = N.getMode(t);
    return new d.ConsoleModel(e, i, n);
  }

  function E(e, t) {
    return new D(e, t);
  }

  function S(e, t) {
    var n = T.create({
      handlerService: new s.HandlerService(e)
    });
    return new o.Terminal(e, t, n);
  }

  function x(e) {
    return N.getOrCreateMode(e);
  }
  var L = function(e) {
    function t() {
      e.apply(this, arguments);
    }
    __extends(t, e);

    t.prototype.getPath = function(e, t) {
      return t.toExternal();
    };

    return t;
  }(a.BaseRequestService);

  var T = function() {
    function e() {}
    e.create = function(t) {
      var n = {
        markerService: e.markerService,
        messageService: e.messageService,
        contextService: e.contextService,
        requestService: e.requestService,
        telemetryService: e.telemetryService
      };
      if (t) {
        var i;
        for (i in t) {
          if (t.hasOwnProperty(i)) {
            n[i] = t[i];
          }
        }
      }
      return h.create(n);
    };

    e.markerService = new p.MarkerService;

    e.messageService = new r.SimpleMessageService;

    e.contextService = new a.BaseContextService({
      uri: null,
      name: null,
      path: null,
      alternatePath: null,
      telemetry: y.standaloneEditorTelemetryEndpoint,
      publicUrl: null,
      ctime: null,
      mtime: null
    }, {
      paths: {
        PUBLIC_WORKSPACE_URL: "inMemory://"
      }
    });

    e.requestService = new L;

    e.telemetryService = y.standaloneEditorTelemetryEndpoint ? new u.TelemetryService(!0) : u.nullService;

    return e;
  }();

  var N = g.Registry.as(f.Extensions.EditorModes);
  T.create().injectTo(N);
  var M = function(e) {
    function n(n, i) {
      this._editorService = new r.SimpleEditorService(this);

      this._handlerService = new s.HandlerService(n);

      this._contextViewService = new l.ContextViewService(n);
      var o = {
        editorService: this._editorService,
        handlerService: this._handlerService,
        contextViewService: this._contextViewService,
        contextMenuService: this._contextViewService
      };

      var a = T.create(o);
      i = i || {};

      "undefined" == typeof i.model ? (i.model = t.createModel(i.value || "", i.mode || "text/plain"), this._ownsModel = !
        0) : this._ownsModel = !1;

      e.call(this, n, i, a);
    }
    __extends(n, e);

    n.prototype.dispose = function() {
      e.prototype.dispose.call(this);

      this._handlerService.dispose();

      this._contextViewService.dispose();
    };

    n.prototype.destroy = function() {
      this.dispose();
    };

    n.prototype.getMarkerService = function() {
      return T.markerService;
    };

    n.prototype.getHandlerService = function() {
      return this._handlerService;
    };

    n.prototype.getTelemetryService = function() {
      return T.telemetryService;
    };

    n.prototype._attachModel = function(t) {
      e.prototype._attachModel.call(this, t);

      if (this._view) {
        this._contextViewService.setContainer(this._view.domNode);
      }
    };

    n.prototype._postDetachModelCleanup = function(t) {
      e.prototype._postDetachModelCleanup.call(this, t);

      if (t && this._ownsModel) {
        t.destroy();
        this._ownsModel = !1;
      }
    };

    return n;
  }(n.CodeEditorWidget);
  t.StandaloneEditor = M;
  var D = function(e) {
    function t(t, n) {
      this._editorService = new r.SimpleEditorService(this);

      this._handlerService = new s.HandlerService(t);

      this._contextViewService = new l.ContextViewService(t);
      var i = {
        editorService: this._editorService,
        handlerService: this._handlerService,
        contextViewService: this._contextViewService,
        contextMenuService: this._contextViewService
      };

      var o = T.create(i);
      e.call(this, t, n, o);

      this._contextViewService.setContainer(this._containerDomElement);
    }
    __extends(t, e);

    t.prototype.dispose = function() {
      e.prototype.dispose.call(this);

      this._handlerService.dispose();

      this._contextViewService.dispose();
    };

    t.prototype.destroy = function() {
      this.dispose();
    };

    t.prototype.getMarkerService = function() {
      return T.markerService;
    };

    t.prototype.getHandlerService = function() {
      return this._handlerService;
    };

    t.prototype.getTelemetryService = function() {
      return T.telemetryService;
    };

    return t;
  }(i.DiffEditorWidget);
  t.StandaloneDiffEditor = D;

  t.create = _;

  t.createModel = b;

  t.createCustomMode = C;

  t.createTerminalModel = w;

  t.createDiffEditor = E;

  t.createTerminal = S;

  t.getOrCreateMode = x;
  var I = self;
  if (!I.Monaco) {
    I.Monaco = {};
  }
  var R = I.Monaco;
  if (!R.Editor) {
    R.Editor = {};
  }

  R.Editor.create = t.create;

  R.Editor.CodeEditor = M;

  R.Editor.createModel = t.createModel;

  R.Editor.createTerminalModel = t.createTerminalModel;

  R.Editor.createDiffEditor = t.createDiffEditor;

  R.Editor.DiffEditor = D;

  R.Editor.createTerminal = t.createTerminal;

  R.Editor.getOrCreateMode = t.getOrCreateMode;

  R.Editor.createCustomMode = t.createCustomMode;
});