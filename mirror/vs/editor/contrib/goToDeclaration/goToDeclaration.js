var __extends = this.__extends || function(a, b) {
    function d() {
      this.constructor = a;
    }
    for (var c in b) b.hasOwnProperty(c) && (a[c] = b[c]);
    d.prototype = b.prototype;

    a.prototype = new d;
  };

define(["require", "exports", "vs/nls", "vs/base/env", "vs/base/network", "vs/base/async", "vs/base/strings",
  "vs/base/errors", "vs/base/lib/winjs.base", "vs/platform/platform", "vs/platform/services",
  "vs/platform/actionRegistry", "vs/base/dom/builder", "vs/editor/core/codeEditorWidget",
  "vs/editor/editorExtensions", "vs/editor/contrib/zoneWidget/zoneWidget", "vs/editor/core/constants",
  "vs/editor/editor", "vs/editor/modes/modesExtensions", "vs/css!./goToDeclaration"
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
    function b(b, c) {
      a.call(this, b, c, F.Precondition.TextFocus);

      this.editorService = null;

      this.messageService = null;
    }
    __extends(b, a);

    b.prototype.injectEditorService = function(a) {
      this.editorService = a;

      this.updateEnablementState();
    };

    b.prototype.injectMessageService = function(a) {
      this.messageService = a;

      this.updateEnablementState();
    };

    b.prototype.injectRequestService = function(a) {
      this.requestService = a;
    };

    b.prototype.getEnablementState = function() {
      return a.prototype.getEnablementState.call(this) && !! this.editorService && !! this.messageService && !! this.editor
        .getModel().getMode().declarationSupport;
    };

    b.prototype.run = function() {
      var a = this;

      var b = this.editor.getModel();

      var c = this.editor.getModel().getMode().declarationSupport;

      var d = this.editor.getPosition();

      var e = this.resolve(b.getAssociatedResource(), {
        lineNumber: d.lineNumber,
        column: d.column
      });
      return e.then(function(b) {
        if (!b) return;
        a.editorService.openEditor({
          path: a.requestService.getPath("root", new v.URL(b.resourceUrl)),
          options: {
            selection: b.range
          }
        });
      }, function(b) {
        a.messageService.show(B.Severity.Error, b);
      });
    };

    b.prototype.resolve = function(a, b) {
      return z.Promise.as(null);
    };

    return b;
  }(F.EditorAction);
  b.GoToTypeAction = K;
  var L = function(a) {
    function b(b, c) {
      a.call(this, b, c);
    }
    __extends(b, a);

    b.prototype.getEnablementState = function() {
      return a.prototype.getEnablementState.call(this) && !! this.editor.getModel().getMode().declarationSupport.findTypeDeclaration;
    };

    b.prototype.resolve = function(a, b) {
      return this.editor.getModel().getMode().declarationSupport.findTypeDeclaration(a, b);
    };

    b.ID = "editor.actions.goToTypeDeclaration";

    return b;
  }(K);
  b.GoToTypeDeclarationActions = L;
  var M = function(a) {
    function b(b, c) {
      a.call(this, b, c);
    }
    __extends(b, a);

    b.prototype.getEnablementState = function() {
      return a.prototype.getEnablementState.call(this) && !! this.editor.getModel().getMode().declarationSupport.findDeclaration;
    };

    b.prototype.resolve = function(a, b) {
      return this.editor.getModel().getMode().declarationSupport.findDeclaration(a, b);
    };

    b.ID = "editor.actions.goToDeclaration";

    return b;
  }(K);
  b.GoToDeclarationAction = M;
  var N = function(a) {
    function b(b, c, d) {
      a.call(this, b, {
        showFrame: !0,
        showAbove: !0,
        frameColor: "#EFEFF2"
      });

      this.model = c;

      this.range = d;

      this.widget = null;

      this.widgetContainer = null;

      this.create();
    }
    __extends(b, a);

    b.prototype.fillContainer = function(a) {
      var b = this;
      D.withElement(a).addClass("preview-zone-widget").div(function(a) {
        b.widgetContainer = a.asContainer().addClass("preview");
        var c = b.editor.getConfiguration();
        c.readOnly = !0;

        c.scrollBeyondLastLine = !1;

        c.scrollbar = {
          useShadows: !1
        };

        b.widget = new E.CodeEditorWidget(a.getHTMLElement(), c, null);

        b.widget.setModel(b.model);

        b.reveal();
      });
    };

    b.prototype.reveal = function() {
      this.widget.setPosition({
        lineNumber: this.range.startLineNumber,
        column: this.range.startColumn
      }, !0, !0, !0);
    };

    b.prototype.doLayout = function(a) {
      this.widgetContainer.style({
        height: a + "px"
      });

      this.widget.layout();
    };

    b.prototype.onWidth = function(a) {
      this.widget.layout();
    };

    b.prototype.dispose = function() {
      this.widget.destroy();

      a.prototype.dispose.call(this);
    };

    return b;
  }(G.ZoneWidget);

  var O = function(a) {
    function b(b, c) {
      var d = this;
      a.call(this, b, c, F.Precondition.TextFocus);

      this.handlerService = null;

      this.editorService = null;

      this.toUnhook.push(b.addListener(H.EventType.ModelChanged, function() {
        d.clear();
      }));

      this.widget = null;

      this.closeBinding = null;
    }
    __extends(b, a);

    b.prototype.injectEditorService = function(a) {
      this.editorService = a;
    };

    b.prototype.injectRequestService = function(a) {
      this.requestService = a;
    };

    b.prototype.injectionDone = function() {
      this.updateEnablementState();
    };

    b.prototype.getEnablementState = function() {
      return a.prototype.getEnablementState.call(this) && !! this.editorService && !! this.handlerService && !! this.editor
        .getModel().getMode().declarationSupport && !! this.editor.getModel().getMode().declarationSupport.findDeclaration;
    };

    b.prototype.run = function() {
      var a = this;
      this.clear();
      var b = this.editor.getModel();

      var c = this.editor.getModel().getMode().declarationSupport;

      var d = this.editor.getPosition();

      var e = {
        lineNumber: d.lineNumber,
        column: d.column
      };
      return c.findDeclaration(b.getAssociatedResource(), e).then(function(b) {
        if (!b || !b.preview) return z.Promise.as(null);
        var c = {
          path: a.requestService.getPath("root", new v.URL(b.resourceUrl))
        };
        return a.editorService.resolveEditorModel(c).then(function(c) {
          a.widget = new N(a.editor, c.getTextEditorModel(), b.range);

          a.widget.show(d, 18);

          a.widget.reveal();
          var e = (new Date).getTime();
          a.closeBinding = a.handlerService.bind({
            key: "Escape"
          }, function() {
            a.telemetryService.log("zoneWidgetShown", {
              mode: "go to declaration",
              elapsedTime: (new Date).getTime() - e
            });

            return !!a.clear();
          }, {
            id: a.id
          });
        });
      });
    };

    b.prototype.clear = function() {
      this.closeBinding !== null && (this.closeBinding.dispose(), this.closeBinding = null);

      this.widget && (this.widget.dispose(), this.widget = null);
    };

    b.prototype.dispose = function() {
      this.clear();

      a.prototype.dispose.call(this);
    };

    b.ID = "editor.actions.previewDeclaration";

    return b;
  }(F.EditorAction);
  b.PreviewDeclarationAction = O;
  var P = new C.ActionDescriptor(O, O.ID, t.localize("actions.previewDecl.label", "View declaration"));

  var Q = new C.ActionDescriptor(M, M.ID, t.localize("actions.goToDecl.label", "Go to definition"), {
    ctrlCmd: !u.browser.isMacintosh,
    key: "F12"
  });

  var R = new C.ActionDescriptor(L, L.ID, t.localize("actions.gotoTypeDecl.label", "Go to type"), {
    ctrlCmd: !0,
    shift: !u.browser.isMacintosh,
    key: "F12"
  });

  var S = A.Registry.as(F.Extensions.EditorContributions);
  S.registerEditorContribution(Q);

  S.registerEditorContribution(P);

  S.registerEditorContribution(R);
  var T = function() {
    function a(a) {
      var b = this;
      this.toUnhook = [];

      this.decorations = [];

      this.editor = a;

      this.throttler = new w.Throttler;

      this.toUnhook.push(this.editor.addListener(H.EventType.MouseUp, function(a) {
        return b.onEditorMouseUp(a);
      }));

      this.toUnhook.push(this.editor.addListener(H.EventType.MouseMove, function(a) {
        return b.onEditorMouseMove(a);
      }));

      this.toUnhook.push(this.editor.addListener(H.EventType.KeyDown, function(a) {
        return b.onEditorKeyDown(a);
      }));

      this.toUnhook.push(this.editor.addListener(H.EventType.KeyUp, function(a) {
        return b.onEditorKeyUp(a);
      }));

      this.toUnhook.push(this.editor.addListener(H.EventType.ModelChanged, function(a) {
        return b.removeDecorations();
      }));

      this.toUnhook.push(this.editor.addListener("change", function(a) {
        return b.removeDecorations();
      }));
    }
    a.prototype.injectEditorService = function(a) {
      this.editorService = a;
    };

    a.prototype.injectRequestService = function(a) {
      this.requestService = a;
    };

    a.prototype.injectMessageService = function(a) {
      this.messageService = a;
    };

    a.prototype.injectionDone = function() {
      this.hasRequiredServices = !! this.messageService && !! this.requestService && !! this.editorService;
    };

    a.prototype.onEditorMouseMove = function(b, c) {
      var d = this;
      this.lastMouseEvent = b;
      if (this.isEnabled(b, c)) {
        var e = b.target.position;

        var f = e ? this.editor.getModel().getWordAtPosition(e, !1) : null;
        if (!f) {
          this.removeDecorations();
          return;
        }
        this.currentWordUnderMouse && this.currentPositionUnderMouse && (this.currentPositionUnderMouse.lineNumber !==
          e.lineNumber || this.currentWordUnderMouse.startColumn !== f.startColumn);

        this.currentPositionUnderMouse = e;

        this.currentWordUnderMouse = f;

        this.throttler.queue(function() {
          return d.findDefinition(b.target);
        }).done(function(c) {
          if (c && c.range && (c.range.startColumn !== f.startColumn || c.range.startLineNumber !== b.target.position
            .lineNumber)) {
            var g = "";
            if (c.preview && c.preview.text && c.preview.range) {
              var h = c.preview.text.split("\n");

              var i = [];

              var j = c.preview.range;

              var k = j.startLineNumber - 1;

              var l = j.endLineNumber - 1;
              if (k < h.length && l < h.length) {
                var m = null;
                for (var n = k; i.length < a.MAX_SOURCE_PREVIEW_LINES && n <= l; n++) {
                  var o;
                  m === null ? (o = x.trim(x.trim(h[n], "	")), m = h[n].substr(0, h[n].length - o.length)) : h[n].indexOf(
                    m) === 0 ? o = h[n].substring(m.length).replace("	", "    ") : o = h[n];

                  o && i.push(o);
                }
                g = i.join("\n");

                l - k >= a.MAX_SOURCE_PREVIEW_LINES && (g += "\n…");
              }
            }
            d.addDecoration({
              startLineNumber: e.lineNumber,
              startColumn: f.startColumn,
              endLineNumber: e.lineNumber,
              endColumn: f.endColumn
            }, g);
          } else d.removeDecorations();
        }, y.onUnexpectedError);
      } else this.removeDecorations();
    };

    a.prototype.addDecoration = function(a, b) {
      var c = null;
      b && (c = [{
        tagName: "div",
        className: "goto-definition-link-hover",
        children: [J.TextToHtmlTokenizer.tokenize(b, this.editor.getModel().getMode())]
      }]);
      var d = [];
      d.push({
        range: a,
        options: {
          inlineClassName: "goto-definition-link",
          htmlMessage: c
        }
      });

      this.decorations = this.editor.deltaDecorations(this.decorations, d);
    };

    a.prototype.removeDecorations = function() {
      var a = this;
      this.decorations.length > 0 && (this.editor.changeDecorations(function(b) {
        for (var c = 0, d = a.decorations.length; c < d; c++) b.removeDecoration(a.decorations[c]);
      }), this.decorations = []);

      this.currentWordUnderMouse = null;

      this.currentPositionUnderMouse = null;
    };

    a.prototype.onEditorKeyDown = function(b) {
      b.key === a.TRIGGER_KEY_VALUE && this.lastMouseEvent && this.onEditorMouseMove(this.lastMouseEvent, b);
    };

    a.prototype.onEditorKeyUp = function(b) {
      b.key === a.TRIGGER_KEY_VALUE && this.removeDecorations();
    };

    a.prototype.onEditorMouseUp = function(a) {
      var b = this;
      this.isEnabled(a) && this.gotoDefinition(a.target).done(function() {
        b.removeDecorations();
      }, function(a) {
        b.removeDecorations();

        y.onUnexpectedError(a);
      });
    };

    a.prototype.isEnabled = function(b, c) {
      return this.hasRequiredServices && this.editor.getConfiguration().gotoDefinitionWithMouse && this.editor.getModel() &&
        b.target.type === I.MouseTargetType.CONTENT_TEXT && (b.event[a.TRIGGER_MODIFIER] || c && c.key === a.TRIGGER_KEY_VALUE) && !!
        this.editor.getModel().getMode().declarationSupport;
    };

    a.prototype.findDefinition = function(a) {
      var b = this.editor.getModel();

      var c = this.editor.getModel().getMode().declarationSupport;

      var d = a.position;
      return this.editor.getModel().getMode().declarationSupport.findDeclaration(b.getAssociatedResource(), {
        lineNumber: d.lineNumber,
        column: d.column
      });
    };

    a.prototype.gotoDefinition = function(a) {
      var b = this;
      return this.findDefinition(a).then(function(c) {
        var d = a.position;

        var e = b.editor.getModel().getWordAtPosition(d, !1);
        if (c && c.range && (c.range.startColumn !== e.startColumn || c.range.startLineNumber !== a.position.lineNumber))
          return b.editorService.openEditor({
            path: b.requestService.getPath("root", new v.URL(c.resourceUrl)),
            options: {
              selection: {
                startLineNumber: c.range.startLineNumber,
                startColumn: c.range.startColumn,
                endLineNumber: c.range.startLineNumber,
                endColumn: c.range.endColumn
              }
            }
          });
      });
    };

    a.prototype.getId = function() {
      return a.ID;
    };

    a.prototype.dispose = function() {
      while (this.toUnhook.length > 0) this.toUnhook.pop()();
    };

    a.ID = "editor.contrib.gotodefinitionwithmouse";

    a.TRIGGER_MODIFIER = u.browser.isMacintosh ? "metaKey" : "ctrlKey";

    a.TRIGGER_KEY_VALUE = u.browser.isMacintosh ? "Meta" : "Ctrl";

    a.MAX_SOURCE_PREVIEW_LINES = 7;

    return a;
  }();
  S.registerEditorContribution(new A.BaseDescriptor(T));
});