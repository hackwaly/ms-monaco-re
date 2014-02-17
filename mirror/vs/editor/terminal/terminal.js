define("vs/editor/terminal/terminal", ["require", "exports", "vs/editor/core/codeEditorWidget",
  "vs/editor/core/internalConstants", "vs/editor/core/constants", "vs/base/dom/dom",
  "vs/editor/core/command/replaceCommand", "vs/css!./terminal"
], function(e, t, n, i, o, r, s) {
  var a = function(e) {
    function t(t, n, i) {
      var o = this;
      e.call(this, t, n, i);

      this.terminalListenersToRemove = [];

      this.terminalListenersToRemove.push(r.addListener(t, "mouseup", function() {
        return o.onMouseUp();
      }));

      this.isReadOnly = !1;

      this.resume(!0, !0);
    }
    __extends(t, e);

    t.prototype._attachModel = function(t) {
      var n = this;
      e.prototype._attachModel.call(this, t);

      if (this.cursor) {
        this.listenersToRemove.push(this.cursor.addListener(o.EventType.CursorSelectionChanged, function(e) {
          return n._onCursorSelectionChanged(e);
        }));
      }
    };

    t.prototype._onCursorSelectionChanged = function(e) {
      if ("modelChange" === e.source && e.selection.isEmpty()) {
        var t = this.getPosition();

        var n = this.cursor.getEditableRange();
        if (t.equals(n.getEndPosition())) {
          this.revealPosition(t, !1, !1);
        }
      }
    };

    t.prototype.onMouseUp = function() {
      if (this.getModel() && this.getSelection().isEmpty()) {
        var e = this.getPosition();

        var t = this.cursor.getEditableRange();
        if (!t.containsPosition(e)) {
          var n = this.model.getLineCount();

          var i = this.model.getLineMaxColumn(n);
          this.setPosition({
            lineNumber: n,
            column: i
          }, !1, !1, !1);
        }
      }
    };

    t.prototype.destroy = function() {
      this.terminalListenersToRemove.forEach(function(e) {
        e();
      });

      this.terminalListenersToRemove = [];

      e.prototype.destroy.call(this);
    };

    t.prototype.getEditorType = function() {
      return o.EditorType.ITerminal;
    };

    t.prototype.peekCurrentInput = function() {
      var e = this.cursor.getEditableRange();
      return this.getModel().getValueInRange(e);
    };

    t.prototype.acceptInput = function() {
      var e = this.peekCurrentInput();
      this.resume(!0, !0);

      return e;
    };

    t.prototype.replaceInput = function(e) {
      var t = this.peekCurrentInput();

      var n = this.cursor.getEditableRange();
      if (t !== e) {
        var o = new s.ReplaceCommand(n, e);
        this.trigger("terminal", i.Handler.ExecuteCommand, o);
      }
      return t;
    };

    t.prototype.setReadOnly = function(e) {
      if (this.isReadOnly !== e) {
        this.isReadOnly = e;
        this.updateOptions({
          readOnly: e
        });
      }
    };

    t.prototype.pause = function() {
      this.setReadOnly(!0);
    };

    t.prototype.resume = function(e, t) {
      if (this.getModel()) {
        this.setReadOnly(!1);
        var n = this.model.getLineCount();

        var i = this.model.getLineMaxColumn(n);
        if (e) {
          this.cursor.setEditableRange({
            startLineNumber: n,
            startColumn: i,
            endLineNumber: n,
            endColumn: i
          });
        }

        if (t) {
          this.setPosition({
            lineNumber: n,
            column: i
          }, !1, !1, !1);
        }
      }
    };

    return t;
  }(n.CodeEditorWidget);
  t.Terminal = a;
});