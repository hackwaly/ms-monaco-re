define('vs/editor/contrib/referenceSearch/referenceSearchWidget', [
  'require',
  'exports',
  'vs/nls!vs/editor/editor.main',
  'vs/base/collections',
  'vs/base/lifecycle',
  'vs/base/dom/dom',
  'vs/base/lib/winjs.base',
  'vs/base/strings',
  'vs/base/network',
  'vs/base/errors',
  'vs/base/dom/builder',
  'vs/base/ui/widgets/tree/treeImpl',
  'vs/base/ui/widgets/tree/treeDefaults',
  'vs/base/ui/widgets/leftRightWidget/leftRightWidget',
  'vs/base/ui/widgets/countBadge/countBadge',
  'vs/editor/core/range',
  'vs/editor/editor',
  'vs/editor/core/config/config',
  'vs/editor/core/constants',
  'vs/editor/core/embeddedCodeEditorWidget',
  'vs/editor/core/model/model',
  'vs/editor/contrib/zoneWidget/peekViewWidget',
  './referenceSearchModel',
  'vs/css!./referenceSearchWidget'
], function(e, t, n, i, o, r, s, a, u, l, c, d, h, p, f, g, m, v, y, _, b, C, w) {
  var E = function() {
    function e(e, t) {
      var n = this;
      this.editor = e, this.model = t, this.decorationSet = {}, this.decorationIgnoreSet = new i.HashSet(), this.callOnDispose = [],
        this.callOnModelChange = [], this.callOnDispose.push(this.editor.addListener(y.EventType.ModelChanged,
          function() {
            return n.onModelChanged();
          })), this.onModelChanged();
    }
    return e.prototype.dispose = function() {
      o.cAll(this.callOnDispose), this.removeDecorations();
    }, e.prototype.onModelChanged = function() {
      this.removeDecorations(), o.cAll(this.callOnModelChange);
      var e = this.editor.getModel();
      if (e)
        for (var t = 0, n = this.model.children.length; n > t; t++)
          if (this.model.children[t].resource.equals(e.getAssociatedResource()))
            return this.addDecorations(this.model.children[t]), void 0;
    }, e.prototype.addDecorations = function(t) {
      var n = this;
      this.callOnModelChange.push(this.editor.getModel().addListener(y.EventType.ModelDecorationsChanged, function(e) {
        return n.onDecorationChanged(e);
      })), this.editor.getModel().changeDecorations(function(i) {
        for (var o = 0, r = t.children.length; r > o; o++) {
          var s = t.children[o];
          if (!n.decorationIgnoreSet.contains(s)) {
            var a = i.addDecoration(s.range, e.DecorationOptions);
            n.decorationSet[a] = s;
          }
        }
      });
    }, e.prototype.onDecorationChanged = function(e) {
      for (var t = this, n = e.addedOrChangedDecorations, o = [], r = 0, s = n.length; s > r; r++) {
        var a = i.lookup(this.decorationSet, n[r].id);
        if (a) {
          var u = n[r].range,
            l = !1;
          if (!g.equalsRange(u, a.range)) {
            if (g.spansMultipleLines(u))
              l = !0;
            else {
              var c = a.range.endColumn - a.range.startColumn,
                d = u.endColumn - u.startColumn;
              c !== d && (l = !0);
            }
            l ? (this.decorationIgnoreSet.add(a), o.push(n[r].id)) : a.range = u;
          }
        }
      }
      this.editor.changeDecorations(function(e) {
        for (; o.length > 0;) {
          var n = o.pop();
          e.removeDecoration(n), delete t.decorationSet[n];
        }
      });
    }, e.prototype.removeDecorations = function() {
      var e = this;
      this.editor.changeDecorations(function(t) {
        for (var n = Object.keys(e.decorationSet); n.length > 0;)
          t.removeDecoration(n.pop());
      }), this.decorationSet = {};
    }, e.DecorationOptions = {
      stickiness: 1,
      className: 'reference-decoration'
    }, e;
  }(),
    S = function() {
      function e() {}
      return e.prototype.getId = function(e, t) {
        return t instanceof w.Model ? 'root' : t instanceof w.FileReferences ? t.id : t instanceof w.OneReference ? t
          .id : void 0;
      }, e.prototype.hasChildren = function(e, t) {
        return t instanceof w.FileReferences || t instanceof w.Model;
      }, e.prototype.getChildren = function(e, t) {
        var n = [];
        return t instanceof w.Model ? n = t.children : t instanceof w.FileReferences && (n = t.children), s.Promise.as(
          n);
      }, e.prototype.getParent = function(e, t) {
        var n = null;
        return t instanceof w.FileReferences ? n = t.parent : t instanceof w.OneReference && (n = t.parent), s.Promise
          .as(n);
      }, e;
    }(),
    x = function(e) {
      function t() {
        e.apply(this, arguments);
      }
      return __extends(t, e), t.prototype.onClick = function(n, i, o) {
        if (i instanceof w.FileReferences)
          return o.preventDefault(), o.stopPropagation(), this.expandCollapse(n, i);
        var r = e.prototype.onClick.call(this, n, i, o);
        return o.ctrlKey || o.metaKey ? n.emit(t.Events.OPEN_TO_SIDE, i) : n.emit(2 === o.detail ? t.Events.SELECTED :
          t.Events.FOCUSED, i), r;
      }, t.prototype.expandCollapse = function(e, t) {
        return e.isExpanded(t) ? e.collapse(t).done(null, l.onUnexpectedError) : e.expand(t).done(null, l.onUnexpectedError), !
          0;
      }, t.prototype.onEscape = function() {
        return !1;
      }, t.prototype.onEnter = function(n, i) {
        var o = n.getFocus();
        if (o instanceof w.FileReferences)
          return this.expandCollapse(n, o);
        var r = e.prototype.onEnter.call(this, n, i);
        return i.ctrlKey || i.metaKey ? n.emit(t.Events.OPEN_TO_SIDE, o) : n.emit(t.Events.SELECTED, o), r;
      }, t.prototype.onUp = function(t, n) {
        return e.prototype.onUp.call(this, t, n), this.fakeFocus(t, n), !0;
      }, t.prototype.onPageUp = function(t, n) {
        return e.prototype.onPageUp.call(this, t, n), this.fakeFocus(t, n), !0;
      }, t.prototype.onLeft = function(t, n) {
        return e.prototype.onLeft.call(this, t, n), this.fakeFocus(t, n), !0;
      }, t.prototype.onDown = function(t, n) {
        return e.prototype.onDown.call(this, t, n), this.fakeFocus(t, n), !0;
      }, t.prototype.onPageDown = function(t, n) {
        return e.prototype.onPageDown.call(this, t, n), this.fakeFocus(t, n), !0;
      }, t.prototype.onRight = function(t, n) {
        return e.prototype.onRight.call(this, t, n), this.fakeFocus(t, n), !0;
      }, t.prototype.fakeFocus = function(e) {
        var n = e.getFocus();
        e.setSelection([n]), e.emit(t.Events.FOCUSED, n);
      }, t.Events = {
        FOCUSED: 'events/custom/focused',
        SELECTED: 'events/custom/selected',
        OPEN_TO_SIDE: 'events/custom/opentoside'
      }, t;
    }(h.DefaultController),
    L = function() {
      function e(e, t) {
        this.editor = e, this.requestService = t;
      }
      return e.prototype.getHeight = function() {
        return 1.2 * this.editor.getConfiguration().lineHeight;
      }, e.prototype.render = function(e, t, i) {
        if (r.clearNode(i), t instanceof w.FileReferences) {
          var o = t,
            s = c.$('.reference-file');
          new p.LeftRightWidget(s, function(e) {
            var t = o.resource.toExternal();
            return c.$('a.name.plain').href(t).title(t).text(o.name).appendTo(e), c.$('span.directory').text(o.directory)
              .appendTo(e), null;
          }, function(e) {
            var t = o.children.length;
            return new f.CountBadge(e, t, t > 1 ? n.localize(
              'vs_editor_contrib_referenceSearch_referenceSearchWidget', 0, t) : n.localize(
              'vs_editor_contrib_referenceSearch_referenceSearchWidget', 1, t));
          }), s.appendTo(i);
        } else if (t instanceof w.OneReference) {
          var u = t,
            l = c.$('.reference'),
            d = u.preview.text.split(/\r\n|\r|\n/g),
            h = 20,
            g = d[u.preview.range.startLineNumber - 1],
            m = g.replace(/^\s*/g, ''),
            v = g.length - m.length,
            y = u.preview.range.startColumn - 1 - v,
            _ = u.preview.range.endColumn - 1 - v,
            b = new Array();
          b.push('<span>'), b.push(m.substring(y - h, y)), b.push('</span>'), b.push('<span class="referenceMatch">'),
            b.push(m.substring(y, _)), b.push('</span>'), b.push('<span>'), b.push(m.substring(_, _ + h)), b.push(
              '</span>'), l.innerHtml(b.join(a.empty)).appendTo(i);
        }
        return null;
      }, e;
    }(),
    T = function(e) {
      function t(t, n, i, o) {
        e.call(this, o, {
          frameColor: '#007ACC',
          showFrame: !1,
          showArrow: !0
        }), this.editorService = t, this.requestService = n, this.injectorService = i.createChild({
          peekViewService: this
        }), this.callOnModel = [], this.tree = null, this.treeContainer = null, this.preview = null, this.previewContainer =
          null, this.previewDecorations = [], this.lastHeight = null, this.create();
      }
      return __extends(t, e), t.prototype._onTitleClick = function(e) {
        if (this.preview && this.preview.getModel()) {
          var n = this.preview.getModel(),
            i = this.preview.getPosition().lineNumber,
            o = new o.Range(i, 1, i, n.getLineMaxColumn(i));
          this.emit(t.Events.EditorDoubleClick, {
            reference: this.getFocusedReference(),
            range: o,
            originalEvent: e
          });
        }
      }, t.prototype._fillBody = function(e) {
        var t = this,
          i = c.$(e);
        i.addClass('reference-zone-widget'), i.div({
          class: 'preview inline'
        }, function(e) {
          var i = {
            scrollBeyondLastLine: !1,
            scrollbar: v.Config.editor.scrollbar,
            overviewRulerLanes: 2
          };
          t.preview = new _.EmbeddedCodeEditorWidget(t.editor, e.getHTMLElement(), i, t.injectorService), t.previewContainer =
            e.hide(), t.previewNotAvailableMessage = new b.Model(n.localize(
              'vs_editor_contrib_referenceSearch_referenceSearchWidget', 2), null);
        }), i.div({
          class: 'tree inline'
        }, function(e) {
          var n = new L(t.editor, t.requestService),
            i = {
              dataSource: new S(),
              renderer: n,
              controller: new x()
            }, o = {
              allowHorizontalScroll: !1,
              twistiePixels: 20
            };
          t.tree = new d.Tree(e.getHTMLElement(), i, o), t.treeContainer = e.hide();
        });
      }, t.prototype._doLayoutBody = function(t) {
        e.prototype._doLayoutBody.call(this, t);
        var n = t + 'px';
        n !== this.lastHeight && (this.treeContainer.style({
          height: n
        }), this.previewContainer.style({
          height: n
        }), this.tree.layout(t), this.preview.layout(), this.lastHeight = n);
      }, t.prototype.onWidth = function() {
        this.preview.layout();
      }, t.prototype.setModel = function(e) {
        var n = this;
        if (o.disposeAll(this.callOnModel), this.model = e, this.model) {
          this.decorationsManager = new E(this.preview, this.model), this.callOnModel.push(this.decorationsManager),
            this.callOnModel.push(this.model.addListener2(w.EventType.OnReferenceRangeChanged, function(e) {
              n.tree.refresh(e);
            })), this.callOnModel.push(this.tree.addListener2(x.Events.FOCUSED, function(e) {
              e instanceof w.OneReference && n.showReferencePreview(e);
            })), this.callOnModel.push(this.tree.addListener2(x.Events.SELECTED, function(e) {
              e instanceof w.OneReference && (n.showReferencePreview(e), n.model.currentReference = e);
            })), this.callOnModel.push(this.tree.addListener2(x.Events.OPEN_TO_SIDE, function(e) {
              e instanceof w.OneReference && n.editorService.openEditor({
                resource: e.resource,
                options: {
                  selection: e.range
                }
              }, !0);
            }));
          var i = 1 === this.model.children.length ? this.model.children[0] : this.model;
          this.tree.setInput(i).then(function() {
            n.tree.setSelection([n.model.currentReference]);
          }).done(null, l.onUnexpectedError), this.callOnModel.push(this.preview.addListener2(y.EventType.MouseDown,
            function(e) {
              2 === e.event.detail && n.emit(t.Events.EditorDoubleClick, {
                reference: n.getFocusedReference(),
                range: e.target.range,
                originalEvent: e.event
              });
            }));
        }
      }, t.prototype.getFocusedReference = function() {
        var e = this.tree.getFocus();
        if (e instanceof w.OneReference)
          return e.resource;
        if (e instanceof w.FileReferences) {
          var t = e;
          if (t.children.length > 0)
            return t.children[0].resource;
        }
        return null;
      }, t.prototype.focus = function() {
        this.tree.DOMFocus();
      }, t.prototype.showAtReference = function(e) {
        this.container.addClass('results-loaded'), this.treeContainer.show(), this.previewContainer.show(), this.preview
          .layout(), this.position && g.containsPosition(e.range, this.position) ? this.show(this.position, 18) :
          this.show(e.range, 18), this.focus();
      }, t.prototype.showReferencePreview = function(e) {
        var t = this;
        this.editorService.resolveEditorModel({
          resource: e.resource
        }).done(function(i) {
          i ? (t.preview.setModel(i.textEditorModel), t.preview.setSelection(e.range, !0, !0, !0)) : t.preview.setModel(
            t.previewNotAvailableMessage), e.resource.getScheme() !== u.schemas.inMemory ? t.setTitle(e.name, e.directory) :
            t.setTitle(n.localize('vs_editor_contrib_referenceSearch_referenceSearchWidget', 3));
        }, l.onUnexpectedError), this.tree.reveal(e), this.tree.setSelection([e]), this.tree.setFocus(e);
      }, t.prototype.revealCurrentReference = function() {
        var e = this.model.currentReference.resource,
          t = this.model.currentReference.range;
        return this.editorService.openEditor({
          resource: e,
          options: {
            selection: t
          }
        });
      }, t.prototype.dispose = function() {
        this.setModel(null), o.disposeAll([
          this.decorationsManager,
          this.preview,
          this.previewNotAvailableMessage,
          this.tree
        ]), e.prototype.dispose.call(this);
      }, t.Events = {
        EditorDoubleClick: 'editorDoubleClick'
      }, t;
    }(C.PeekViewWidget);
  t.ReferenceWidget = T;
})