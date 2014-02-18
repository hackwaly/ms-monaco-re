define(["require", "exports", "vs/platform/platform", "vs/editor/core/constants", "vs/editor/core/range",
  "vs/editor/editorExtensions"
], function(a, b, c, d, e, f) {
  var g = c;

  var h = d;

  var i = e;

  var j = f;

  var k = function() {
    function a(a) {
      var b = this;
      this.workerRequestTokenId = 0;

      this.workerRequest = null;

      this.workerRequestCompleted = !1;

      this.workerRequestValue = null;

      this.lastCursorPositionChangeTime = 0;

      this.renderDecorationsTimer = -1;

      this.editor = a;

      this.model = this.editor.getModel();

      this.toUnhook = [];

      this.toUnhook.push(a.addListener(h.EventType.CursorPositionChanged, function(a) {
        b._onPositionChanged(a);
      }));

      this.toUnhook.push(a.addListener(h.EventType.ModelChanged, function(a) {
        b._stopAll();

        b.model = b.editor.getModel();
      }));

      this.toUnhook.push(a.addListener("change", function(a) {
        b._stopAll();
      }));

      this._lastWordRange = null;

      this._decorationIds = [];

      this.workerRequestTokenId = 0;

      this.workerRequest = null;

      this.workerRequestCompleted = !1;

      this.workerRequestValue = null;

      this.lastCursorPositionChangeTime = 0;

      this.renderDecorationsTimer = -1;
    }
    a.prototype._removeDecorations = function() {
      var a = this;
      if (this._decorationIds.length > 0) {
        this.editor.changeDecorations(function(b) {
          for (var c = 0, d = a._decorationIds.length; c < d; c++) {
            b.removeDecoration(a._decorationIds[c]);
          }
        });
        this._decorationIds = [];
      }
    };

    a.prototype._stopAll = function() {
      this._lastWordRange = null;

      this._removeDecorations();

      if (this.renderDecorationsTimer !== -1) {
        window.clearTimeout(this.renderDecorationsTimer);
        this.renderDecorationsTimer = -1;
      }

      if (this.workerRequest !== null) {
        this.workerRequest.cancel();
        this.workerRequest = null;
      }

      if (!this.workerRequestCompleted) {
        this.workerRequestTokenId++;
        this.workerRequestCompleted = !0;
      }
    };

    a.prototype._onPositionChanged = function(a) {
      var b = this;
      if (a.reason !== "explicit") {
        this._stopAll();
        return;
      }
      if (this.editor.getConfiguration().readOnly) {
        this._stopAll();
        return;
      }
      if (!this.model.getMode().occurrencesSupport) {
        this._stopAll();
        return;
      }
      var c = this.editor.getSelection();
      if (c.startLineNumber !== c.endLineNumber) {
        this._stopAll();
        return;
      }
      var d = c.startLineNumber;

      var e = c.startColumn;

      var f = c.endColumn;

      var g = this.model.getWordAtPosition({
        lineNumber: d,
        column: e
      }, !0);
      if (!g || g.startColumn > e || g.endColumn < f) {
        this._stopAll();
        return;
      }
      var h = new i.Range(d, g.startColumn, d, g.endColumn);

      var j = this._lastWordRange && this._lastWordRange.equalsRange(h);
      for (var k = 0, l = this._decorationIds.length; !j && k < l; k++) {
        var m = this.model.getDecorationRange(this._decorationIds[k]);
        if (m && m.startLineNumber === d && m.startColumn <= e && m.endColumn >= f) {
          j = !0;
        }
      }
      this.lastCursorPositionChangeTime = (new Date).getTime();
      if (j) {
        if (this.workerRequestCompleted && this.renderDecorationsTimer !== -1) {
          window.clearTimeout(this.renderDecorationsTimer);
          this.renderDecorationsTimer = -1;
          this._beginRenderDecorations();
        }
      } else {
        this._stopAll();
        var n = ++this.workerRequestTokenId;
        this.workerRequestCompleted = !1;

        this.workerRequest = this.model.getMode().occurrencesSupport.findOccurrences(this.model.getAssociatedResource(),
          this.editor.getPosition());

        this.workerRequest.then(function(a) {
          if (n === b.workerRequestTokenId) {
            b.workerRequestCompleted = !0;
            b.workerRequestValue = a;
            b._beginRenderDecorations();
          }
        }).done();
      }
      this._lastWordRange = h;
    };

    a.prototype._beginRenderDecorations = function() {
      var a = this;

      var b = (new Date).getTime();

      var c = this.lastCursorPositionChangeTime + 250;
      if (b >= c) {
        this.renderDecorationsTimer = -1;
        this.renderDecorations();
      } else {
        this.renderDecorationsTimer = window.setTimeout(function() {
          a.renderDecorations();
        }, c - b);
      }
    };

    a.prototype.renderDecorations = function() {
      this.renderDecorationsTimer = -1;
      var a = [];
      for (var b = 0, c = this.workerRequestValue.length; b < c; b++) {
        var d = this.workerRequestValue[b];

        var e = "wordHighlight";

        var f = "rgba(246, 185, 77, 0.7)";
        if (d.kind && d.kind === "write") {
          e += "Strong";
          f = "rgba(249, 206, 130, 0.7)";
        }

        a.push({
          range: d.range,
          options: {
            isOverlay: !1,
            className: e,
            showInOverviewRuler: f
          }
        });
      }
      this._decorationIds = this.editor.deltaDecorations(this._decorationIds, a);
    };

    a.prototype.destroy = function() {
      this._stopAll();
      while (this.toUnhook.length > 0) {
        this.toUnhook.pop()();
      }
    };

    return a;
  }();

  var l = function() {
    function a(a) {
      this.wordHighligher = new k(a);
    }
    a.prototype.getId = function() {
      return a.ID;
    };

    a.prototype.dispose = function() {
      this.wordHighligher.destroy();
    };

    a.ID = "editor.contrib.wordHighlighter";

    return a;
  }();

  var m = g.Registry.as(j.Extensions.EditorContributions);
  m.registerEditorContribution(new g.BaseDescriptor(l));
});