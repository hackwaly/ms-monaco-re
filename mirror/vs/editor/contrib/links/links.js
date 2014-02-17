define("vs/editor/contrib/links/links", ["require", "exports", "vs/nls!vs/editor/editor.main", "vs/base/paths",
  "vs/base/lib/winjs.base", "vs/platform/platform", "vs/platform/services", "vs/base/env", "vs/base/errors",
  "vs/editor/core/constants", "vs/base/network", "vs/editor/editorExtensions", "vs/editor/editor", "vs/css!./links"
], function(e, t, n, i, o, r, s, a, u, l, c, d) {
  var h = function() {
    function e(e, t) {
      this.link = e;

      this.decorationId = t.addDecoration({
        startLineNumber: this.link.range.startLineNumber,
        startColumn: this.link.range.startColumn,
        endLineNumber: this.link.range.startLineNumber,
        endColumn: this.link.range.endColumn
      }, this.getOptions(!1));
    }
    e.prototype.dispose = function(e) {
      e.removeDecoration(this.decorationId);
    };

    e.prototype.getOptions = function(e) {
      var t = "";
      this.link.extraInlineClassName && (t = this.link.extraInlineClassName + " ");

      t += e ? p.CLASS_NAME_ACTIVE : p.CLASS_NAME;

      return {
        stickiness: 1,
        inlineClassName: t,
        hoverMessage: p.HOVER_MESSAGE
      };
    };

    e.prototype.activate = function(e) {
      e.changeDecorationOptions(this.decorationId, this.getOptions(!0));
    };

    e.prototype.deactivate = function(e) {
      e.changeDecorationOptions(this.decorationId, this.getOptions(!1));
    };

    return e;
  }();

  var p = function() {
    function e(e, t, n) {
      var i = this;
      this.editor = e;

      this.editorService = t;

      this.requestService = n;

      this.listenersToRemove = [];

      this.listenersToRemove.push(e.addListener("change", function() {
        return i.onChange();
      }));

      this.listenersToRemove.push(e.addListener(l.EventType.ModelChanged, function() {
        i.lastMouseEvent = null;

        i.currentOccurences = {};

        i.activeLinkDecorationId = null;

        i.stop();

        i.beginCompute();
      }));

      this.listenersToRemove.push(this.editor.addListener(l.EventType.MouseUp, function(e) {
        return i.onEditorMouseUp(e);
      }));

      this.listenersToRemove.push(this.editor.addListener(l.EventType.MouseMove, function(e) {
        return i.onEditorMouseMove(e);
      }));

      this.listenersToRemove.push(this.editor.addListener(l.EventType.KeyDown, function(e) {
        return i.onEditorKeyDown(e);
      }));

      this.listenersToRemove.push(this.editor.addListener(l.EventType.KeyUp, function(e) {
        return i.onEditorKeyUp(e);
      }));

      this.timeoutPromise = null;

      this.computePromise = null;

      this.currentOccurences = {};

      this.activeLinkDecorationId = null;

      this.beginCompute();
    }
    e.prototype.onChange = function() {
      var t = this;
      if (!this.timeoutPromise) {
        this.timeoutPromise = o.TPromise.timeout(e.RECOMPUTE_TIME);
        this.timeoutPromise.then(function() {
          t.timeoutPromise = null;

          t.beginCompute();
        });
      }
    };

    e.prototype.beginCompute = function() {
      var e = this;
      if (this.editor.getModel()) {
        var t = this.editor.getModel().getMode();
        if (t.linkSupport) {
          this.computePromise = t.linkSupport.computeLinks(this.editor.getModel().getAssociatedResource());
          this.computePromise.then(function(t) {
            return e.updateDecorations(t);
          });
        }
      }
    };

    e.prototype.updateDecorations = function(e) {
      var t = this;
      this.editor.changeDecorations(function(n) {
        for (var i in t.currentOccurences)
          if (t.currentOccurences.hasOwnProperty(i)) {
            var o = t.currentOccurences[i];
            o.dispose(n);
          }
        if (t.currentOccurences = {}, t.activeLinkDecorationId = null, e)
          for (var r = 0; r < e.length; r++) {
            var o = new h(e[r], n);
            t.currentOccurences[o.decorationId] = o;
          }
      });
    };

    e.prototype.onEditorKeyDown = function(t) {
      if (t.key === e.TRIGGER_KEY_VALUE && this.lastMouseEvent) {
        this.onEditorMouseMove(this.lastMouseEvent, t);
      }
    };

    e.prototype.onEditorKeyUp = function(t) {
      if (t.key === e.TRIGGER_KEY_VALUE) {
        this.cleanUpActiveLinkDecoration();
      }
    };

    e.prototype.onEditorMouseMove = function(e, t) {
      var n = this;
      if (this.lastMouseEvent = e, this.isEnabled(e, t)) {
        this.cleanUpActiveLinkDecoration();
        var i = this.getLinkOccurence(e);
        if (i) {
          this.editor.changeDecorations(function(e) {
            i.activate(e);

            n.activeLinkDecorationId = i.decorationId;
          });
        }
      } else {
        this.cleanUpActiveLinkDecoration();
      }
    };

    e.prototype.cleanUpActiveLinkDecoration = function() {
      if (this.activeLinkDecorationId) {
        var e = this.currentOccurences[this.activeLinkDecorationId];
        if (e) {
          this.editor.changeDecorations(function(t) {
            e.deactivate(t);
          });
        }

        this.activeLinkDecorationId = null;
      }
    };

    e.prototype.onEditorMouseUp = function(e) {
      if (this.isEnabled(e)) {
        var t = this.getLinkOccurence(e);
        if (t) {
          var n = t.link;
          if (n.openInEditor && this.editorService) {
            var o = i.isAbsolute(n.url) ? i.join(this.requestService.getRequestUrl("root", "", !0), n.url) : n.url;

            var r = o.indexOf("#");

            var s = -1;

            var a = -1;
            if (r >= 0) {
              var l = o.substr(r + 1);

              var d = l.split(",");
              if (d.length > 0) {
                s = Number(d[0]);
              }

              if (d.length > 1) {
                a = Number(d[1]);
              }

              o = o.substr(0, r);
            }
            var h = {
              resource: new c.URL(o)
            };
            if (s >= 0) {
              h.options = {
                selection: {
                  startLineNumber: s,
                  startColumn: a
                }
              };
            }
            var p = 0;
            if (e.event.altKey) {
              p = !0;
            }

            this.editorService.openEditor(h, p).done(null, u.onUnexpectedError);
          } else {
            var f = this.editor.getModel().getValueInRange(n.range);
            window.open(f);
          }
        }
      }
    };

    e.prototype.getLinkOccurence = function(e) {
      for (var t = e.target.position, n = this.editor.getModel().getDecorationsInRange({
          startLineNumber: t.lineNumber,
          startColumn: t.column,
          endLineNumber: t.lineNumber,
          endColumn: t.column
        }, null, !0), i = 0; i < n.length; i++) {
        var o = n[i];

        var r = this.currentOccurences[o.id];
        if (r) {
          return r;
        }
      }
      return null;
    };

    e.prototype.isEnabled = function(t, n) {
      return 6 === t.target.type && (t.event[e.TRIGGER_MODIFIER] || n && n.key === e.TRIGGER_KEY_VALUE) && !! this.editor
        .getModel().getMode().linkSupport;
    };

    e.prototype.stop = function() {
      if (this.timeoutPromise) {
        this.timeoutPromise.cancel();
        this.timeoutPromise = null;
      }

      if (this.computePromise) {
        this.computePromise.cancel();
        this.computePromise = null;
      }
    };

    e.prototype.destroy = function() {
      this.listenersToRemove.forEach(function(e) {
        e();
      });

      this.listenersToRemove = [];

      this.stop();
    };

    e.RECOMPUTE_TIME = 1e3;

    e.TRIGGER_KEY_VALUE = a.browser.isMacintosh ? "Meta" : "Ctrl";

    e.TRIGGER_MODIFIER = a.browser.isMacintosh ? "metaKey" : "ctrlKey";

    e.HOVER_MESSAGE = a.browser.isMacintosh ? n.localize("vs_editor_contrib_links_links", 0) : n.localize(
      "vs_editor_contrib_links_links", 1);

    e.CLASS_NAME = "detected-link";

    e.CLASS_NAME_ACTIVE = "detected-link-active";

    return e;
  }();

  var f = function() {
    function e(e) {
      this.editor = e;
    }
    e.prototype.injectEditorService = function(e) {
      this.editorService = e;
    };

    e.prototype.injectRequestService = function(e) {
      this.requestService = e;
    };

    e.prototype.injectionDone = function() {
      this.linkDetector = new p(this.editor, this.editorService, this.requestService);
    };

    e.prototype.getId = function() {
      return e.ID;
    };

    e.prototype.dispose = function() {
      this.linkDetector.destroy();
    };

    e.ID = "editor.contrib.LinkDetector";

    return e;
  }();

  var g = r.Registry.as(d.Extensions.EditorContributions);
  g.registerEditorContribution(new r.BaseDescriptor(f));
});