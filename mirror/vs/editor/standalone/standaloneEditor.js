var __extends = this.__extends || function(a, b) {
    function d() {
      this.constructor = a;
    }
    for (var c in b) {
      b.hasOwnProperty(c) && (a[c] = b[c]);
    }
    d.prototype = b.prototype;

    a.prototype = new d;
  };

define(["require", "exports", "vs/editor/core/codeEditorWidget", "vs/editor/diff/diffEditorWidget",
  "vs/editor/terminal/terminal", "vs/editor/standalone/simpleServices", "vs/platform/handlerService",
  "vs/platform/services", "vs/platform/telemetry/telemetryService", "vs/editor/core/model/model",
  "vs/editor/core/model/terminalModel", "vs/platform/injectorService", "vs/platform/markers/markerService",
  "vs/editor/modes/modesExtensions", "vs/platform/platform"
], function(a, b, c, d, e, f, g, h, i, j, k, l, m, n, o) {
  function G(a, b) {
    return new F(a, b);
  }

  function H(a, b, c) {
    var d = B.Registry.as(A.Extensions.EditorModes);

    var e = d.getMode(b);
    return new w.Model(a, e, c, D.markerService);
  }

  function I(a, b, c) {
    var d = B.Registry.as(A.Extensions.EditorModes);

    var e = d.getMode(b);
    return new x.TerminalModel(a, e, c);
  }

  function J(a, b) {
    var c = D.create({
      handlerService: new t.HandlerService(a)
    });
    return new q.DiffEditorWidget(a, b, c);
  }

  function K(a, b) {
    var c = D.create({
      handlerService: new t.HandlerService(a)
    });
    return new r.Terminal(a, b, c);
  }

  function L(a) {
    var b = B.Registry.as(A.Extensions.EditorModes);
    return b.getOrCreateMode(a);
  }
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

  var C = function(a) {
    function b() {
      a.apply(this, arguments);
    }
    __extends(b, a);

    b.prototype.getPath = function(a, b) {
      return b.toExternal();
    };

    return b;
  }(u.BaseRequestService);

  var D = function() {
    function a() {}
    a.create = function(b) {
      var c = {
        markerService: a.markerService,
        messageService: a.messageService,
        contextService: a.contextService,
        requestService: a.requestService
      };
      if (b) {
        var d;
        for (d in b) {
          b.hasOwnProperty(d) && (c[d] = b[d]);
        }
      }
      return y.create(c);
    };

    a.markerService = new z.MarkerService;

    a.messageService = new s.SimpleMessageService;

    a.contextService = new u.BaseContextService({
      uri: null,
      name: null,
      telemetry: "/api/telemetry"
    }, {
      paths: {
        PUBLIC_WORKSPACE_URL: "inMemory://"
      }
    });

    a.requestService = new C;

    return a;
  }();

  var E = B.Registry.as(A.Extensions.EditorModes);
  D.create().injectTo(E);
  var F = function(a) {
    function c(c, d) {
      this._editorService = new s.SimpleEditorService(this);

      this._handlerService = new t.HandlerService(c);

      this._telemetryService = v.nullService;

      d = d || {};

      d.enableTelemetry && (this._telemetryService = new v.TelemetryService);
      var e = {
        editorService: this._editorService,
        handlerService: this._handlerService,
        telemetryService: this._telemetryService
      };

      var f = D.create(e);
      d.model ? this._ownsModel = !1 : (d.model = b.createModel(d.value || "", d.mode || "text/plain"), this._ownsModel = !
        0);

      a.call(this, c, d, f);
    }
    __extends(c, a);

    c.prototype.destroy = function() {
      a.prototype.destroy.call(this);

      this._handlerService.dispose();
    };

    c.prototype.getMarkerService = function() {
      return D.markerService;
    };

    c.prototype.getHandlerService = function() {
      return this._handlerService;
    };

    c.prototype.getTelemetryService = function() {
      return this._telemetryService;
    };

    c.prototype._detachModel = function() {
      var b = this.getModel();
      a.prototype._detachModel.call(this);

      b && this._ownsModel && (b.destroy(), this._ownsModel = !1);
    };

    return c;
  }(p.CodeEditorWidget);
  b.create = G;

  b.createModel = H;

  b.createTerminalModel = I;

  b.createDiffEditor = J;

  b.createTerminal = K;

  b.getOrCreateMode = L;
  var M = self;
  M.Monaco || (M.Monaco = {});
  var N = M.Monaco;
  N.Editor || (N.Editor = {});

  N.Editor.create = b.create;

  N.Editor.createModel = b.createModel;

  N.Editor.createTerminalModel = b.createTerminalModel;

  N.Editor.CodeEditor = F;

  N.Editor.createDiffEditor = b.createDiffEditor;

  N.Editor.createTerminal = b.createTerminal;

  N.Editor.getOrCreateMode = b.getOrCreateMode;
});