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

define(["require", "exports", "vs/nls", "vs/base/lib/winjs.base", "vs/platform/services", "vs/platform/platform",
  "vs/platform/actionRegistry", "vs/base/lifecycle", "vs/base/network", "vs/base/errors", "vs/base/strings",
  "vs/base/eventEmitter", "vs/base/dom/builder", "vs/base/ui/widgets/tree/treeImpl",
  "vs/base/ui/widgets/tree/treeDefaults", "vs/editor/core/codeEditorWidget", "vs/editor/core/constants",
  "vs/editor/editorExtensions", "vs/editor/contrib/zoneWidget/zoneWidget", "vs/css!./referenceSearch"
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
    function b(c) {
      a.call(this);

      this._references = c;

      this._references.sort(b.compare);

      this._currentReference = null;
    }
    __extends(b, a);

    b.compare = function(a, b) {
      return a.resourceUrl === b.resourceUrl ? a.range.startLineNumber - b.range.startLineNumber : B.localeCompare(a.resourceUrl,
        b.resourceUrl);
    };

    Object.defineProperty(b.prototype, "currentReference", {
      get: function() {
        return this._currentReference;
      },
      set: function(a) {
        this._currentReference = a;

        this.emit(b.ON_CURRENT_REF, this);
      },
      enumerable: !0,
      configurable: !0
    });

    Object.defineProperty(b.prototype, "references", {
      get: function() {
        return this._references;
      },
      enumerable: !0,
      configurable: !0
    });

    b.prototype.findReferenceFromPosition = function(a, b) {
      for (var c = 0, d = this._references.length; c < d; c++) {
        var e = this._references[c].range;
        if (this._references[c].resourceUrl === a && e.startLineNumber <= b.lineNumber && e.endLineNumber >= b.lineNumber &&
          e.startColumn <= b.column && e.endColumn >= b.column) {
          return c;
        }
      }
      return -1;
    };

    b.ON_CURRENT_REF = "references.model.onCurrentReferenceChanged";

    return b;
  }(C.EventEmitter);

  var L = function() {
    function a() {}
    a.prototype.getId = function(a, b) {
      if (b instanceof K) {
        return "reference.model";
      }
      var c = b;
      return c.resourceUrl + c.range.startLineNumber + c.range.startColumn + c.range.endLineNumber + c.range.endColumn;
    };

    a.prototype.getChildren = function(a, b) {
      var c = [];
      b instanceof K && (c = b.references);

      return u.Promise.as(c);
    };

    a.prototype.hasChildren = function(a, b) {
      return b instanceof K;
    };

    a.prototype.getParent = function(a, b) {
      var c = null;
      b instanceof K || (c = a.getInput());

      return u.Promise.as(c);
    };

    return a;
  }();

  var M = function() {
    function a() {}
    a.prototype.compare = function(a, b, c) {
      var d = b;

      var e = c;
      return K.compare(d, e);
    };

    return a;
  }();

  var N = function(a) {
    function b() {
      a.apply(this, arguments);
    }
    __extends(b, a);

    b.prototype.onClick = function(c, d, e) {
      var f = a.prototype.onClick.call(this, c, d, e);
      c.emit(e.detail === 2 ? b.Events.SELECTED : b.Events.FOCUSED, d);

      return f;
    };

    b.prototype.onEscape = function(a, b) {
      return !1;
    };

    b.prototype.onEnter = function(c, d) {
      var e = a.prototype.onEnter.call(this, c, d);
      c.emit(b.Events.SELECTED, c.getFocus());

      return e;
    };

    b.prototype.onUp = function(b, c) {
      a.prototype.onUp.call(this, b, c);

      this.fakeFocus(b, c);

      return !0;
    };

    b.prototype.onPageUp = function(b, c) {
      a.prototype.onPageUp.call(this, b, c);

      this.fakeFocus(b, c);

      return !0;
    };

    b.prototype.onLeft = function(b, c) {
      a.prototype.onLeft.call(this, b, c);

      this.fakeFocus(b, c);

      return !0;
    };

    b.prototype.onDown = function(b, c) {
      a.prototype.onDown.call(this, b, c);

      this.fakeFocus(b, c);

      return !0;
    };

    b.prototype.onPageDown = function(b, c) {
      a.prototype.onPageDown.call(this, b, c);

      this.fakeFocus(b, c);

      return !0;
    };

    b.prototype.onRight = function(b, c) {
      a.prototype.onRight.call(this, b, c);

      this.fakeFocus(b, c);

      return !0;
    };

    b.prototype.fakeFocus = function(a, c) {
      var d = a.getFocus();
      a.setSelection([d]);

      a.emit(b.Events.FOCUSED, d);
    };

    b.Events = {
      FOCUSED: "events/custom/focused",
      SELECTED: "events/custom/selected"
    };

    return b;
  }(F.DefaultController);

  var O = function() {
    function a(a) {
      this.lineHeightInPx = a;
    }
    a.prototype.getHeight = function(a, b) {
      return 1.2 * this.lineHeightInPx;
    };

    a.prototype.render = function(a, b, c) {
      var d = b;

      var e = this.getHeight(a, b);

      var f = d.resourceUrl.lastIndexOf("/");

      var g = (new z.URL(d.resourceUrl)).getScheme() === "inMemory" ? t.localize("references.label.fileNameLine",
        "line") : d.resourceUrl.substring(f + 1);

      var h = t.localize("reference.label.lineNumber", ":{0}", d.range.startLineNumber);
      D.Build.withElement(c).div({
        "class": "reference",
        text: g,
        title: g + h
      }, function(a) {
        a.span().text(h).addClass("lineNumber");
      });

      return null;
    };

    return a;
  }();

  var P = function(a) {
    function b(b, c, d) {
      a.call(this, d, {
        frameColor: "#EFEFF2"
      });

      this.editorService = b;

      this.requestService = c;

      this.toUnhook = [];

      this.tree = null;

      this.treeContainer = null;

      this.preview = null;

      this.previewContainer = null;

      this.previewDecorations = [];

      this.lastHeight = null;

      this.create();
    }
    __extends(b, a);

    b.prototype.createArrow = function(b, c, d) {
      return a.prototype.createArrow.call(this, b, c, d);
    };

    b.prototype.fillContainer = function(a) {
      var b = this;

      var c = D.withElement(a);
      c.addClass("reference-zone-widget");

      c.div({
        "class": "label"
      }, function(a) {
        b.labelContainer = a.show();
      });

      c.div({
        "class": "preview inline"
      }, function(a) {
        var c = b.editor.getConfiguration();
        c.readOnly = !0;

        c.scrollBeyondLastLine = !1;

        c.scrollbar = {
          useShadows: !1
        };

        b.preview = new G.CodeEditorWidget(a.getHTMLElement(), c, null);

        b.previewContainer = a.hide();
      });

      c.div({
        "class": "tree inline"
      }, function(a) {
        var c = {
          dataSource: new L,
          renderer: new O(b.editor.getConfiguration().lineHeight),
          sorter: new M,
          controller: new N
        };

        var d = {
          allowHorizontalScroll: !1,
          indentPixels: 0
        };
        b.tree = new E.Tree(a.getHTMLElement(), c, d);

        b.treeContainer = a.hide();
      });
    };

    b.prototype.doLayout = function(a) {
      var b = a + "px";
      if (b === this.lastHeight) return;
      this.treeContainer.style({
        height: b
      });

      this.previewContainer.style({
        height: b
      });

      this.tree.layout(a);

      this.preview.layout();

      this.lastHeight = b;
    };

    b.prototype.onWidth = function(a) {
      this.preview.layout();
    };

    b.prototype.setModel = function(a) {
      var c = this;
      while (this.toUnhook.length > 0) {
        this.toUnhook.pop()();
      }
      this.model = a;

      if (this.model) {
        this.toUnhook.push(this.tree.addListener(N.Events.FOCUSED, function(a) {
          c.showReferencePreview(a);
        }));
        this.toUnhook.push(this.tree.addListener(N.Events.SELECTED, function(a) {
          c.showReferencePreview(a);

          c.model.currentReference = a;
        }));
        this.tree.setInput(this.model).then(function() {
          c.tree.setSelection([c.model.currentReference]);
        }).done(null, A.onUnexpectedError);
        this.toUnhook.push(this.preview.addListener(H.EventType.MouseDown, function(a) {
          if (a.event.detail === 2) {
            c.emit(b.Events.EditorDoubleClick, {
              reference: c.tree.getFocus(),
              range: a.target.range
            });
          }
        }));
      }
    };

    b.prototype.focus = function() {
      this.tree.DOMFocus();
    };

    b.prototype.showLoading = function(a) {
      this.labelContainer.text(t.localize("label.loading", "Loading...")).show();

      this.treeContainer.hide();

      this.previewContainer.hide();

      this.show(a, 2);
    };

    b.prototype.showNoResultsMessage = function(a) {
      this.labelContainer.text(t.localize("label.noresults", "No References Found")).show();

      this.treeContainer.hide();

      this.previewContainer.hide();

      this.show(a, 2);
    };

    b.prototype.showAtReference = function(a) {
      this.labelContainer.hide();

      this.treeContainer.show();

      this.previewContainer.show();

      this.show(a.range, 18);

      this.focus();
    };

    b.prototype.showReferencePreview = function(a) {
      var b = this;

      var c = {
        path: this.requestService.getPath("root", new z.URL(a.resourceUrl))
      };
      this.editorService.resolveEditorModel(c).done(function(c) {
        b.preview.setModel(c.getTextEditorModel());

        b.preview.setSelection(a.range, !0, !0, !0);

        b.preview.changeDecorations(function(c) {
          var d = [];

          var e = {
            className: "reference-decoration"
          };
          for (var f = 0; f < b.model.references.length; f++) {
            var g = b.model.references[f];
            if (g.resourceUrl === a.resourceUrl) {
              d.push({
                range: g.range,
                options: e
              });
            }
          }
          b.previewDecorations = c.deltaDecorations(b.previewDecorations, d);
        });
      }, A.onUnexpectedError);

      this.tree.setSelection([a]);

      this.tree.setFocus(a);

      this.tree.reveal(a);
    };

    b.prototype.revealCurrentReference = function() {
      var a = this.model.currentReference.resourceUrl;

      var b = this.model.currentReference.range;
      return this.editorService.openEditor({
        path: this.requestService.getPath("root", new z.URL(a)),
        options: {
          selection: b
        }
      });
    };

    b.prototype.dispose = function() {
      this.setModel(null);

      this.preview.destroy();

      this.tree.dispose();

      a.prototype.dispose.call(this);
    };

    b.Events = {
      EditorDoubleClick: "editorDoubleClick"
    };

    return b;
  }(J.ZoneWidget);

  var Q = function(a) {
    function b(b, c) {
      a.call(this, b, c, I.Precondition.WidgetFocus);

      this.handlerService = null;

      this.editorService = null;

      this.requestIdPool = 0;

      this.model = null;

      this.modelRevealing = !1;

      this.widget = null;

      this.callOnClear = [];

      this.label = t.localize("references.action.label", "Find references");

      this.enabled = !1;
    }
    __extends(b, a);

    b.prototype.injectEditorService = function(a) {
      this.editorService = a;
    };

    b.prototype.injectRequestService = function(a) {
      this.requestService = a;
    };

    b.prototype.injectMessageService = function(a) {
      this.messageService = a;
    };

    b.prototype.injectionDone = function() {
      this.updateEnablementState();
    };

    b.prototype.getEnablementState = function() {
      return !!this.handlerService && !! this.editorService && !! this.requestService && !! this.messageService && a.prototype
        .getEnablementState.call(this) && !! this.editor.getModel().getMode().referenceSupport;
    };

    b.prototype.run = function() {
      var a = this;

      var b = this.editor.getSelection();

      var c = this.widget ? this.widget.position : null;

      var d = this.clear();
      if (d && !! c && b.containsPosition(c)) {
        return null;
      }
      var e = ++this.requestIdPool;

      var f = this.editor.getModel();

      var g = this.editor.getModel().getMode().referenceSupport;

      var h = this.telemetryService.start("findReferences", {
        mode: f.getMode().getId()
      });
      g.findReferences(f.getAssociatedResource(), b.getStartPosition()).then(function(c) {
        if (e !== a.requestIdPool) {
          h.stop();
          return;
        }
        if (c.length === 0) {
          a.widget.showNoResultsMessage(b);

          h.stop();
          return;
        }
        a.model = new K(c);
        var d = a.model.findReferenceFromPosition(f.getAssociatedResource().toExternal(), b.getStartPosition());
        a.model.currentReference = a.model.references[d];

        a.callOnClear.push(a.model.addListener(K.ON_CURRENT_REF, function() {
          if (a.model.currentReference) {
            a.modelRevealing = !0;
            a.widget.revealCurrentReference().done(function() {
              a.modelRevealing = !1;

              window.setTimeout(function() {
                a.widget.showReferencePreview(a.model.currentReference);

                a.widget.showAtReference(a.model.currentReference);
              }, 0);
            }, A.onUnexpectedError);
          }
        }));

        a._startTime = Date.now();

        a.widget.setModel(a.model);

        a.widget.showAtReference(a.model.currentReference);

        a.widget.showReferencePreview(a.model.references[(d + 1) % a.model.references.length]);

        h.stop();
      }, function(b) {
        a.messageService.show(v.Severity.Error, b);

        h.stop();
      });

      this.callOnClear.push(this.handlerService.bind({
        key: "Escape"
      }, function() {
        return a.clear();
      }, {
        once: !0,
        id: "referenceSearch"
      }).dispose);

      this.callOnClear.push(this.editor.addListener(H.EventType.ModelModeChanged, function() {
        a.clear();
      }));

      this.callOnClear.push(this.editor.addListener(H.EventType.ModelChanged, function() {
        if (!a.modelRevealing) {
          a.clear();
        }
      }));

      this.widget = new P(this.editorService, this.requestService, this.editor);

      this.widget.showLoading(b);

      this.callOnClear.push(this.widget.addListener(P.Events.EditorDoubleClick, function(b) {
        a.editorService.openEditor({
          path: a.requestService.getPath("root", new z.URL(b.reference.resourceUrl)),
          options: {
            selection: b.range
          }
        }).done(null, A.onUnexpectedError);

        a.clear();
      }));

      return u.Promise.as(this.widget);
    };

    b.prototype.clear = function() {
      this.telemetryService.log("zoneWidgetShown", {
        mode: "reference search",
        elapsedTime: Date.now() - this._startTime
      });

      y.cAll(this.callOnClear);

      this.model = null;
      var a = !1;
      this.widget !== null && (this.widget.dispose(), this.widget = null, a = !0);

      this.editor.focus();

      this.requestIdPool += 1;

      return a;
    };

    b.ID = "editor.actions.referenceSearch.trigger";

    return b;
  }(I.EditorAction);
  b.ReferenceAction = Q;
  var R = new x.ActionDescriptor(Q, Q.ID, t.localize("references.action.name", "Show references"), {
    shift: !0,
    key: "F12"
  });

  var S = w.Registry.as(I.Extensions.EditorContributions);
  S.registerEditorContribution(R);
});