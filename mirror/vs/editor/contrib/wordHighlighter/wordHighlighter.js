define("vs/editor/contrib/wordHighlighter/wordHighlighter", ["require", "exports", "vs/platform/platform",
  "vs/editor/core/constants", "vs/editor/core/range", "vs/editor/editorExtensions", "vs/editor/editor"
], function(e, t, n, i, o, r) {
  var s = function() {
    function e(e) {
      var t = this;
      this.workerRequestTokenId = 0;

      this.workerRequest = null;

      this.workerRequestCompleted = !1;

      this.workerRequestValue = null;

      this.lastCursorPositionChangeTime = 0;

      this.renderDecorationsTimer = -1;

      this.editor = e;

      this.model = this.editor.getModel();

      this.toUnhook = [];

      this.toUnhook.push(e.addListener(i.EventType.CursorPositionChanged, function(e) {
        t._onPositionChanged(e);
      }));

      this.toUnhook.push(e.addListener(i.EventType.ModelChanged, function() {
        t._stopAll();

        t.model = t.editor.getModel();
      }));

      this.toUnhook.push(e.addListener("change", function() {
        t._stopAll();
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
    e.prototype._removeDecorations = function() {
      if (this._decorationIds.length > 0) {
        this._decorationIds = this.editor.deltaDecorations(this._decorationIds, []);
      }
    };

    e.prototype._stopAll = function() {
      this._lastWordRange = null;

      this._removeDecorations();

      if (-1 !== this.renderDecorationsTimer) {
        window.clearTimeout(this.renderDecorationsTimer);
        this.renderDecorationsTimer = -1;
      }

      if (null !== this.workerRequest) {
        this.workerRequest.cancel();
        this.workerRequest = null;
      }

      if (!this.workerRequestCompleted) {
        this.workerRequestTokenId++;
        this.workerRequestCompleted = !0;
      }
    };

    e.prototype._onPositionChanged = function(e) {
      var t = this;
      if ("explicit" !== e.reason) {
        this._stopAll();
        return void 0;
      }
      if (!this.model.getMode().occurrencesSupport) {
        this._stopAll();
        return void 0;
      }
      var n = this.editor.getSelection();
      if (n.startLineNumber !== n.endLineNumber) {
        this._stopAll();
        return void 0;
      }
      var i = n.startLineNumber;

      var r = n.startColumn;

      var s = n.endColumn;

      var a = this.model.getWordAtPosition({
        lineNumber: i,
        column: r
      }, !0, !0);
      if (!a || a.startColumn > r || a.endColumn < s) {
        this._stopAll();
        return void 0;
      }
      for (var u = new o.Range(i, a.startColumn, i, a.endColumn), l = this._lastWordRange && this._lastWordRange.equalsRange(
          u), c = 0, d = this._decorationIds.length; !l && d > c; c++) {
        var h = this.model.getDecorationRange(this._decorationIds[c]);
        if (h && h.startLineNumber === i && h.startColumn <= r && h.endColumn >= s) {
          l = !0;
        }
      }
      if (this.lastCursorPositionChangeTime = (new Date).getTime(), l) {
        if (this.workerRequestCompleted && -1 !== this.renderDecorationsTimer) {
          window.clearTimeout(this.renderDecorationsTimer);
          this.renderDecorationsTimer = -1;
          this._beginRenderDecorations();
        }
      } else {
        this._stopAll();
        var p = ++this.workerRequestTokenId;
        this.workerRequestCompleted = !1;

        this.workerRequest = this.model.getMode().occurrencesSupport.findOccurrences(this.model.getAssociatedResource(),
          this.editor.getPosition());

        this.workerRequest.then(function(e) {
          if (p === t.workerRequestTokenId) {
            t.workerRequestCompleted = !0;
            t.workerRequestValue = e;
            t._beginRenderDecorations();
          }
        }).done();
      }
      this._lastWordRange = u;
    };

    e.prototype._beginRenderDecorations = function() {
      var e = this;

      var t = (new Date).getTime();

      var n = this.lastCursorPositionChangeTime + 250;
      t >= n ? (this.renderDecorationsTimer = -1, this.renderDecorations()) : this.renderDecorationsTimer = window.setTimeout(
        function() {
          e.renderDecorations();
        }, n - t);
    };

    e.prototype.renderDecorations = function() {
      this.renderDecorationsTimer = -1;
      for (var e = [], t = 0, n = this.workerRequestValue.length; n > t; t++) {
        var i = this.workerRequestValue[t];

        var o = "wordHighlight";

        var r = "rgba(246, 185, 77, 0.7)";
        if (i.kind && "write" === i.kind) {
          o += "Strong";
          r = "rgba(249, 206, 130, 0.7)";
        }

        e.push({
          range: i.range,
          options: {
            stickiness: 1,
            isOverlay: !1,
            className: o,
            overviewRuler: {
              color: r,
              position: 2
            }
          }
        });
      }
      this._decorationIds = this.editor.deltaDecorations(this._decorationIds, e);
    };

    e.prototype.destroy = function() {
      for (this._stopAll(); this.toUnhook.length > 0;) {
        this.toUnhook.pop()();
      }
    };

    return e;
  }();

  var a = function() {
    function e(e) {
      this.wordHighligher = new s(e);
    }
    e.prototype.getId = function() {
      return e.ID;
    };

    e.prototype.dispose = function() {
      this.wordHighligher.destroy();
    };

    e.ID = "editor.contrib.wordHighlighter";

    return e;
  }();

  var u = n.Registry.as(r.Extensions.EditorContributions);
  u.registerEditorContribution(new n.BaseDescriptor(a));
});