define("vs/editor/contrib/goToDeclaration/goToDeclaration", ["require", "exports", "vs/nls!vs/editor/editor.main",
  "vs/base/env", "vs/base/network", "vs/base/async", "vs/base/strings", "vs/base/errors", "vs/base/lib/winjs.base",
  "vs/platform/platform", "vs/platform/services", "vs/platform/actionRegistry", "vs/base/dom/builder",
  "vs/editor/core/embeddedCodeEditorWidget", "vs/editor/editorExtensions",
  "vs/editor/contrib/zoneWidget/peekViewWidget", "vs/editor/core/constants", "vs/editor/editor",
  "vs/editor/core/range", "vs/editor/modes/modesExtensions", "vs/editor/core/editorState",
  "vs/editor/core/config/config", "vs/css!./goToDeclaration"
], function(e, t, n, i, o, r, s, a, u, l, c, d, h, p, f, g, m, v, y, _, b, C) {
  var w = function(e) {
    function t(t, n) {
      e.call(this, t, n, f.Precondition.WidgetFocus | f.Precondition.ShowInContextMenu);
    }
    __extends(t, e);

    t.prototype.injectEditorService = function(e) {
      this.editorService = e;

      this.updateEnablementState();
    };

    t.prototype.injectMessageService = function(e) {
      this.messageService = e;

      this.updateEnablementState();
    };

    t.prototype.injectRequestService = function(e) {
      this.requestService = e;
    };

    t.prototype.getEnablementState = function() {
      return e.prototype.getEnablementState.call(this) && !! this.editorService && !! this.messageService && !! this.editor
        .getModel().getMode().declarationSupport;
    };

    t.prototype.run = function() {
      var e = this;

      var t = this.editor.getModel();

      var n = this.editor.getPosition();

      var i = this.resolve(t.getAssociatedResource(), {
        lineNumber: n.lineNumber,
        column: n.column
      });
      return i.then(function(t) {
        return t ? (e.editorService.openEditor({
          resource: new o.URL(t.resourceUrl),
          options: {
            selection: t.range
          }
        }), !0) : !1;
      }, function(t) {
        e.messageService.show(2, t);

        return !1;
      });
    };

    t.prototype.resolve = function() {
      return u.TPromise.as(null);
    };

    return t;
  }(f.EditorAction);
  t.GoToTypeAction = w;
  var E = function(e) {
    function t(t, n) {
      e.call(this, t, n);
    }
    __extends(t, e);

    t.prototype.getEnablementState = function() {
      return !1;
    };

    t.prototype.resolve = function(e, t) {
      return this.editor.getModel().getMode().declarationSupport.findTypeDeclaration(e, t);
    };

    t.ID = "editor.actions.goToTypeDeclaration";

    return t;
  }(w);
  t.GoToTypeDeclarationActions = E;
  var S = function(e) {
    function t(t, n) {
      e.call(this, t, n);
    }
    __extends(t, e);

    t.prototype.getEnablementState = function() {
      return e.prototype.getEnablementState.call(this) && !! this.editor.getModel().getMode().declarationSupport.findDeclaration;
    };

    t.prototype.resolve = function(e, t) {
      return this.editor.getModel().getMode().declarationSupport.findDeclaration(e, t);
    };

    t.ID = "editor.actions.goToDeclaration";

    return t;
  }(w);
  t.GoToDeclarationAction = S;
  var x = function(e) {
    function t(t, n, i) {
      e.call(this, t, {
        frameColor: "#007ACC",
        showFrame: !1,
        showArrow: !0
      });

      this.requestService = n;

      this.injectorService = i.createChild({
        peekViewService: this
      });

      this.create();
    }
    __extends(t, e);

    t.prototype._onTitleClick = function(e) {
      if (this.widget && this.widget.getModel()) {
        var n = this.widget.getModel();

        var i = this.widget.getPosition().lineNumber;

        var o = new y.Range(i, 1, i, n.getLineMaxColumn(i));
        this.emit(t.Events.HeaderTabClick, {
          reference: n.getAssociatedResource(),
          range: o,
          originalEvent: e
        });
      }
    };

    t.prototype._fillBody = function(e) {
      var t = h.$(e).addClass("preview-zone-widget preview");

      var n = {
        scrollBeyondLastLine: !1,
        scrollbar: C.Config.editor.scrollbar,
        overviewRulerLanes: 2
      };
      this.widget = new p.EmbeddedCodeEditorWidget(this.editor, t.getHTMLElement(), n, this.injectorService);
    };

    t.prototype.showPreview = function(e, t) {
      this.widget.setModel(t.model);

      this.widget.setPosition({
        lineNumber: t.range.startLineNumber,
        column: t.range.startColumn
      }, !0, !0, !0);

      this.setTitle(t.title, t.subtitle);

      this.show(e, 18);
    };

    t.prototype.doLayout = function(t) {
      e.prototype.doLayout.call(this, t);

      this.widget.layout();
    };

    t.prototype.onWidth = function() {
      this.widget.layout();
    };

    t.prototype.dispose = function() {
      this.widget.dispose();

      e.prototype.dispose.call(this);
    };

    t.Events = {
      HeaderTabClick: "headerTabClick"
    };

    return t;
  }(g.PeekViewWidget);

  var L = function(e) {
    function t(t, n) {
      var i = this;
      e.call(this, t, n, f.Precondition.WidgetFocus | f.Precondition.ShowInContextMenu);

      this.toUnhook.push(t.addListener(m.EventType.ModelChanged, function() {
        return i.clear();
      }));
    }
    __extends(t, e);

    t.prototype.injectEditorService = function(e) {
      this.editorService = e;
    };

    t.prototype.injectInjectorService = function(e) {
      this.injectorService = e;
    };

    t.prototype.injectRequestService = function(e) {
      this.requestService = e;
    };

    t.prototype.injectPeekViewService = function(e) {
      this.peekViewService = e;
    };

    t.prototype.injectionDone = function() {
      this.updateEnablementState();
    };

    t.prototype.getEnablementState = function() {
      return !(this.peekViewService && this.peekViewService.isActive || !e.prototype.getEnablementState.call(this) || !
        this.editorService || !this.handlerService || !this.editor.getModel().getMode().declarationSupport || !this.editor
        .getModel().getMode().declarationSupport.findDeclaration);
    };

    t.prototype.run = function() {
      var e = this;
      this.clear();
      var t = this.editor.getModel();

      var i = this.editor.getModel().getMode().declarationSupport;

      var r = this.editor.getPosition();

      var s = {
        lineNumber: r.lineNumber,
        column: r.column
      };
      return i.findDeclaration(t.getAssociatedResource(), s).then(function(t) {
        return t && t.preview ? e.editorService.resolveEditorModel({
          resource: new o.URL(t.resourceUrl)
        }).then(function(i) {
          var s = {
            model: i.textEditorModel,
            range: t.range,
            title: n.localize("vs_editor_contrib_goToDeclaration_goToDeclaration", 0),
            subtitle: ""
          };
          if (s.model.getAssociatedResource().getScheme() !== o.schemas.inMemory) {
            var u = e.requestService.getPath("root", s.model.getAssociatedResource());

            var l = u.lastIndexOf("/");
            s.title = u.substring(l + 1);

            s.subtitle = u.substring(0, l + 1);
          }
          e.widget = new x(e.editor, e.requestService, e.injectorService);

          e.widget.showPreview(r, s);
          var c = (new Date).getTime();
          e.toUnhook.push(e.widget.addListener(x.Events.HeaderTabClick, function(t) {
            e.editorService.openEditor({
              resource: t.reference,
              options: {
                selection: t.range
              }
            }, t.originalEvent.ctrlKey || t.originalEvent.metaKey).done(null, a.onUnexpectedError);

            e.clear();
          }));

          e.closeBinding = e.handlerService.bind({
            key: "Escape"
          }, function() {
            e.telemetryService.log("zoneWidgetShown", {
              mode: "go to declaration",
              elapsedTime: (new Date).getTime() - c
            });

            return !!e.clear();
          }, {
            id: e.id
          });
        }) : u.Promise.as(null);
      });
    };

    t.prototype.clear = function() {
      if (this.closeBinding) {
        this.closeBinding.dispose();
        this.closeBinding = null;
      }

      if (this.widget) {
        this.widget.dispose();
        this.widget = null;
      }
    };

    t.prototype.dispose = function() {
      this.clear();

      e.prototype.dispose.call(this);
    };

    t.ID = "editor.actions.previewDeclaration";

    return t;
  }(f.EditorAction);
  t.PreviewDeclarationAction = L;
  var T = new d.ActionDescriptor(L, L.ID, n.localize("vs_editor_contrib_goToDeclaration_goToDeclaration", 1), {
    alt: !0,
    key: "F12"
  });

  var N = new d.ActionDescriptor(S, S.ID, n.localize("vs_editor_contrib_goToDeclaration_goToDeclaration", 2), {
    ctrlCmd: !i.browser.isMacintosh,
    key: "F12"
  });

  var M = new d.ActionDescriptor(E, E.ID, n.localize("vs_editor_contrib_goToDeclaration_goToDeclaration", 3), {
    ctrlCmd: !0,
    shift: !i.browser.isMacintosh,
    key: "F12"
  });

  var D = l.Registry.as(f.Extensions.EditorContributions);
  D.registerEditorContribution(T);

  D.registerEditorContribution(N);

  D.registerEditorContribution(M);
  var I = function() {
    function e(e) {
      var t = this;
      this.toUnhook = [];

      this.decorations = [];

      this.editor = e;

      this.throttler = new r.Throttler;

      this.toUnhook.push(this.editor.addListener(m.EventType.MouseUp, function(e) {
        return t.onEditorMouseUp(e);
      }));

      this.toUnhook.push(this.editor.addListener(m.EventType.MouseMove, function(e) {
        return t.onEditorMouseMove(e);
      }));

      this.toUnhook.push(this.editor.addListener(m.EventType.KeyDown, function(e) {
        return t.onEditorKeyDown(e);
      }));

      this.toUnhook.push(this.editor.addListener(m.EventType.KeyUp, function(e) {
        return t.onEditorKeyUp(e);
      }));

      this.toUnhook.push(this.editor.addListener(m.EventType.ModelChanged, function() {
        return t.removeDecorations();
      }));

      this.toUnhook.push(this.editor.addListener("change", function() {
        return t.removeDecorations();
      }));
    }
    e.prototype.injectEditorService = function(e) {
      this.editorService = e;
    };

    e.prototype.injectRequestService = function(e) {
      this.requestService = e;
    };

    e.prototype.injectMessageService = function(e) {
      this.messageService = e;
    };

    e.prototype.injectionDone = function() {
      this.hasRequiredServices = !! this.messageService && !! this.requestService && !! this.editorService;
    };

    e.prototype.onEditorMouseMove = function(t, n) {
      var i = this;
      if (this.lastMouseEvent = t, this.isEnabled(t, n)) {
        var o = t.target.position;

        var r = o ? this.editor.getModel().getWordAtPosition(o, !1) : null;
        if (!r) {
          this.removeDecorations();
          return void 0;
        }
        this.currentPositionUnderMouse = o;

        this.currentWordUnderMouse = r;
        var l = b.capture(this.editor, 2, 0, 1, 3);
        this.throttler.queue(function() {
          return l.validate() ? i.findDefinition(t.target) : u.Promise.as(null);
        }).done(function(n) {
          if (n && n.range && (n.range.startColumn !== r.startColumn || n.range.startLineNumber !== t.target.position
            .lineNumber)) {
            var a = "";
            if (n.preview && n.preview.text && n.preview.range) {
              var u = n.preview.text.split("\n");

              var l = [];

              var c = n.preview.range;

              var d = c.startLineNumber - 1;

              var h = c.endLineNumber - 1;
              if (d < u.length && h < u.length) {
                for (var p = null, f = d; l.length < e.MAX_SOURCE_PREVIEW_LINES && h >= f; f++) {
                  var g;
                  if (null === p) {
                    g = s.trim(s.trim(u[f], "	"));
                    p = u[f].substr(0, u[f].length - g.length);
                  } else {
                    g = 0 === u[f].indexOf(p) ? u[f].substring(p.length).replace("	", "    ") : u[f];
                  }

                  if (g) {
                    l.push(g);
                  }
                }
                a = l.join("\n");

                if (h - d >= e.MAX_SOURCE_PREVIEW_LINES) {
                  a += "\n…";
                }
              }
            }
            i.addDecoration({
              startLineNumber: o.lineNumber,
              startColumn: r.startColumn,
              endLineNumber: o.lineNumber,
              endColumn: r.endColumn
            }, a);
          } else {
            i.removeDecorations();
          }
        }, a.onUnexpectedError);
      } else {
        this.removeDecorations();
      }
    };

    e.prototype.addDecoration = function(e, t) {
      var n = this.editor.getModel();
      if (n) {
        var i = null;
        if (t) {
          i = [{
            tagName: "div",
            className: "goto-definition-link-hover",
            children: [_.TextToHtmlTokenizer.tokenize(t, n.getMode())]
          }];
        }
        var o = [];
        o.push({
          range: e,
          options: {
            inlineClassName: "goto-definition-link",
            htmlMessage: i
          }
        });

        this.decorations = this.editor.deltaDecorations(this.decorations, o);
      }
    };

    e.prototype.removeDecorations = function() {
      if (this.decorations.length > 0) {
        this.decorations = this.editor.deltaDecorations(this.decorations, []);
      }

      this.currentWordUnderMouse = null;

      this.currentPositionUnderMouse = null;
    };

    e.prototype.onEditorKeyDown = function(t) {
      if (t.key === e.TRIGGER_KEY_VALUE && this.lastMouseEvent) {
        this.onEditorMouseMove(this.lastMouseEvent, t);
      }
    };

    e.prototype.onEditorKeyUp = function(t) {
      if (t.key === e.TRIGGER_KEY_VALUE) {
        this.removeDecorations();
      }
    };

    e.prototype.onEditorMouseUp = function(e) {
      var t = this;
      if (this.isEnabled(e)) {
        this.gotoDefinition(e.target, e.event.altKey).done(function() {
          t.removeDecorations();
        }, function(e) {
          t.removeDecorations();

          a.onUnexpectedError(e);
        });
      }
    };

    e.prototype.isEnabled = function(t, n) {
      return this.hasRequiredServices && this.editor.getModel() && (i.browser.isIE11orEarlier || t.event.detail <= 1) &&
        6 === t.target.type && (t.event[e.TRIGGER_MODIFIER] || n && n.key === e.TRIGGER_KEY_VALUE) && !! this.editor.getModel()
        .getMode().declarationSupport;
    };

    e.prototype.findDefinition = function(e) {
      var t = this.editor.getModel();
      if (!t) {
        return u.Promise.as(null);
      }
      var n = e.position;
      return t.getMode().declarationSupport.findDeclaration(t.getAssociatedResource(), {
        lineNumber: n.lineNumber,
        column: n.column
      });
    };

    e.prototype.gotoDefinition = function(e, t) {
      var n = this;

      var i = b.capture(this.editor, 2, 0, 1, 3);
      return this.findDefinition(e).then(function(r) {
        if (i.validate()) {
          var s = e.position;

          var a = n.editor.getModel().getWordAtPosition(s, !1);
          return r && r.range && (r.range.startColumn !== a.startColumn || r.range.startLineNumber !== e.position.lineNumber) ?
            n.editorService.openEditor({
              resource: new o.URL(r.resourceUrl),
              options: {
                selection: {
                  startLineNumber: r.range.startLineNumber,
                  startColumn: r.range.startColumn,
                  endLineNumber: r.range.startLineNumber,
                  endColumn: r.range.endColumn
                }
              }
            }, t) : void 0;
        }
      });
    };

    e.prototype.getId = function() {
      return e.ID;
    };

    e.prototype.dispose = function() {
      for (; this.toUnhook.length > 0;) {
        this.toUnhook.pop()();
      }
    };

    e.ID = "editor.contrib.gotodefinitionwithmouse";

    e.TRIGGER_MODIFIER = i.browser.isMacintosh ? "metaKey" : "ctrlKey";

    e.TRIGGER_KEY_VALUE = i.browser.isMacintosh ? "Meta" : "Ctrl";

    e.MAX_SOURCE_PREVIEW_LINES = 7;

    return e;
  }();
  D.registerEditorContribution(new l.BaseDescriptor(I));
});