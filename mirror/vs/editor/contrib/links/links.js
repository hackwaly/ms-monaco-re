define(["require", "exports", "vs/nls", "vs/base/lib/winjs.base", "vs/platform/platform", "vs/base/env",
  "vs/editor/core/constants", "vs/editor/core/range", "vs/editor/editorExtensions", "vs/editor/editor",
  "vs/css!./links"
], function(a, b, c, d, e, f, g, h, i, j) {
  var k = c,
    l = d,
    m = e,
    n = f,
    o = g,
    p = h,
    q = i,
    r = j,
    s = function() {
      function a(a) {
        var b = this;
        this.editor = a, this.listenersToRemove = [], this.listenersToRemove.push(a.addListener("change", function(a) {
          return b.onChange()
        })), this.listenersToRemove.push(a.addListener(o.EventType.ModelChanged, function(a) {
          b.decorations = [], b.stop(), b.beginCompute()
        })), this.listenersToRemove.push(this.editor.addListener(o.EventType.MouseUp, function(a) {
          return b.onEditorMouseUp(a)
        })), this.listenersToRemove.push(this.editor.addListener(o.EventType.MouseMove, function(a) {
          return b.onEditorMouseMove(a)
        })), this.listenersToRemove.push(this.editor.addListener(o.EventType.KeyDown, function(a) {
          return b.onEditorKeyDown(a)
        })), this.listenersToRemove.push(this.editor.addListener(o.EventType.KeyUp, function(a) {
          return b.onEditorKeyUp(a)
        })), this.timeoutPromise = null, this.computePromise = null, this.decorations = [], this.beginCompute()
      }
      return a.prototype.onChange = function() {
        var b = this;
        this.stop(), this.timeoutPromise = l.Promise.timeout(a.RECOMPUTE_TIME), this.timeoutPromise.then(function() {
          b.timeoutPromise = null, b.beginCompute()
        })
      }, a.prototype.beginCompute = function() {
        var a = this;
        if (!this.editor.getModel()) return;
        var b = this.editor.getModel().getMode();
        b.linkSupport && (this.computePromise = b.linkSupport.computeLinks(this.editor.getModel().getAssociatedResource()),
          this.computePromise.then(function(b) {
            return a.updateDecorations(b)
          }))
      }, a.prototype.updateDecorations = function(b) {
        var c = [];
        if (b)
          for (var d = 0; d < b.length; d++) c.push({
            range: b[d].range,
            options: {
              inlineClassName: a.CLASS_NAME,
              hoverMessage: a.HOVER_MESSAGE
            }
          });
        this.decorations = this.editor.deltaDecorations(this.decorations, c)
      }, a.prototype.onEditorKeyDown = function(b) {
        b.key === a.TRIGGER_KEY_VALUE && this.lastMouseEvent && this.onEditorMouseMove(this.lastMouseEvent, b)
      }, a.prototype.onEditorKeyUp = function(b) {
        b.key === a.TRIGGER_KEY_VALUE && this.cleanUpActiveLinkDecoration()
      }, a.prototype.onEditorMouseMove = function(b, c) {
        var d = this;
        this.lastMouseEvent = b;
        if (this.isEnabled(b, c)) {
          var e = this.getLinkDecoration(b);
          e ? e.options && e.options.inlineClassName !== a.CLASS_NAME_ACTIVE && this.editor.changeDecorations(
            function(b) {
              b.changeDecorationOptions(e.id, {
                inlineClassName: a.CLASS_NAME_ACTIVE,
                hoverMessage: a.HOVER_MESSAGE
              }), d.activeLinkDecoration = e
            }) : this.cleanUpActiveLinkDecoration()
        } else this.cleanUpActiveLinkDecoration()
      }, a.prototype.cleanUpActiveLinkDecoration = function() {
        if (this.activeLinkDecoration) {
          var b = this.activeLinkDecoration.id;
          this.activeLinkDecoration = null, this.editor.changeDecorations(function(c) {
            c.changeDecorationOptions(b, {
              inlineClassName: a.CLASS_NAME,
              hoverMessage: a.HOVER_MESSAGE
            })
          })
        }
      }, a.prototype.onEditorMouseUp = function(a) {
        if (this.isEnabled(a)) {
          var b = this.getLinkDecoration(a);
          if (b) {
            var c = this.editor.getModel().getValueInRange(b.range);
            window.open(c)
          }
        }
      }, a.prototype.getLinkDecoration = function(b) {
        var c = b.target.position,
          d = this.editor.getModel().getDecorationsInRange({
            startLineNumber: c.lineNumber,
            startColumn: c.column,
            endLineNumber: c.lineNumber,
            endColumn: c.column
          }, null, !0);
        for (var e = 0; e < d.length; e++) {
          var f = d[e];
          if (f.options && (f.options.inlineClassName === a.CLASS_NAME || f.options.inlineClassName === a.CLASS_NAME_ACTIVE)) {
            var g = new p.Range(f.range.startLineNumber, f.range.startColumn, f.range.endLineNumber, f.range.endColumn);
            if (g.containsPosition(c)) return f
          }
        }
        return null
      }, a.prototype.isEnabled = function(b, c) {
        return b.target.type === r.MouseTargetType.CONTENT_TEXT && (b.event[a.TRIGGER_MODIFIER] || c && c.key === a.TRIGGER_KEY_VALUE) && !!
          this.editor.getModel().getMode().linkSupport
      }, a.prototype.stop = function() {
        this.timeoutPromise && (this.timeoutPromise.cancel(), this.timeoutPromise = null), this.computePromise && (
          this.computePromise.cancel(), this.computePromise = null)
      }, a.prototype.destroy = function() {
        this.listenersToRemove.forEach(function(a) {
          a()
        }), this.listenersToRemove = [], this.stop()
      }, a.RECOMPUTE_TIME = 1e3, a.TRIGGER_KEY_VALUE = n.browser.isMacintosh ? "Meta" : "Ctrl", a.TRIGGER_MODIFIER =
        n.browser.isMacintosh ? "metaKey" : "ctrlKey", a.HOVER_MESSAGE = n.browser.isMacintosh ? k.localize(
          "links.navigate.mac", "Cmd + click to follow link") : k.localize("links.navigate",
          "Ctrl + click to follow link"), a.CLASS_NAME = "detected-link", a.CLASS_NAME_ACTIVE =
        "detected-link-active", a
    }(),
    t = function() {
      function a(a) {
        this.linkDetector = new s(a)
      }
      return a.prototype.getId = function() {
        return a.ID
      }, a.prototype.dispose = function() {
        this.linkDetector.destroy()
      }, a.ID = "editor.contrib.LinkDetector", a
    }(),
    u = m.Registry.as(q.Extensions.EditorContributions);
  u.registerEditorContribution(new m.BaseDescriptor(t))
})