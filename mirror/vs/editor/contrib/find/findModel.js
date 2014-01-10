var __extends = this.__extends || function(a, b) {
    function d() {
      this.constructor = a
    }
    for (var c in b) b.hasOwnProperty(c) && (a[c] = b[c]);
    d.prototype = b.prototype, a.prototype = new d
  };
define(["require", "exports", "vs/editor/core/position", "vs/editor/core/constants", "vs/base/strings",
  "vs/base/eventEmitter", "vs/editor/contrib/find/replaceAllCommand", "vs/editor/core/command/replaceCommand"
], function(a, b, c, d, e, f, g, h) {
  var i = c,
    j = d,
    k = e,
    l = f,
    m = g,
    n = h;
  b.START_FIND_ID = "actions.find", b.NEXT_MATCH_FIND_ID = "editor.actions.nextMatchFindAction", b.PREVIOUS_MATCH_FIND_ID =
    "editor.actions.previousMatchFindAction", b.START_FIND_REPLACE_ID = "editor.actions.startFindReplaceAction", b.REPLACE_ID =
    "editor.actions.replaceAction", b.REPLACE_ALL_ID = "editor.actions.replaceAllAction";
  var o = function(a) {
    function b(b) {
      var c = this;
      a.call(this), this.editor = b, this.startPosition = null, this.searchString = "", this.replaceString = "", this
        .searchOnlyEditableRange = !1, this.decorations = [], this.decorationIndex = 0, this.highlightedDecorationId =
        null, this.listenersToRemove = [], this.updateDecorationsTimeout = null, this.didReplace = !1, this.isRegex = !
        1, this.matchCase = !1, this.wholeWord = !1, this.listenersToRemove.push(this.editor.addListener(j.EventType.CursorPositionChanged,
          function(a) {
            if (a.reason === "explicit" || a.reason === "undo" || a.reason === "redo") c.highlightedDecorationId !==
              null && c.editor.changeDecorations(function(a) {
                a.changeDecorationOptions(c.highlightedDecorationId, c.createFindMatchDecorationOptions(!1)), c.highlightedDecorationId =
                  null
              }), c.startPosition = c.editor.getPosition(), c.decorationIndex = -1
          })), this.listenersToRemove.push(this.editor.getModel().addListener(j.EventType.ModelContentChanged,
          function(a) {
            a.changeType === j.EventType.ModelContentChangedFlush && (c.decorations = []), c.startPosition = c.editor
              .getPosition();
            if (c.updateDecorationsTimeout !== null) {
              window.clearTimeout(c.updateDecorationsTimeout), c.resetupdateDecorationsTimeout();
              return
            }
            c.resetupdateDecorationsTimeout()
          }))
    }
    return __extends(b, a), b.prototype.resetupdateDecorationsTimeout = function() {
      var a = this;
      this.updateDecorationsTimeout = window.setTimeout(function() {
        a.updateDecorations(!1), a.updateDecorationsTimeout = null
      }, 100)
    }, b.prototype.removeOldDecorations = function(a) {
      var b, c;
      for (b = 0, c = this.decorations.length; b < c; b++) a.removeDecoration(this.decorations[b]);
      this.decorations = []
    }, b.prototype.createFindMatchDecorationOptions = function(a) {
      return {
        isOverlay: !1,
        className: a ? "currentFindMatch" : "findMatch",
        showInOverviewRuler: "rgba(246, 185, 77, 0.7)"
      }
    }, b.prototype.addDecorations = function(a, b) {
      var c, d;
      for (c = 0, d = b.length; c < d; c++) this.decorations[c] = a.addDecoration(b[c], this.createFindMatchDecorationOptions(!
        1))
    }, b.prototype.updateDecorations = function(a) {
      var b = this;
      this.didReplace && this.next(), this.editor.changeDecorations(function(a) {
        b.removeOldDecorations(a), b.addDecorations(a, b.editor.getModel().findMatches(b.searchString, b.searchOnlyEditableRange,
          b.isRegex, b.matchCase, b.wholeWord))
      }), this.highlightedDecorationId = null, this.decorationIndex = this.indexAfterPosition(this.startPosition), !
        this.didReplace && !a ? this.decorationIndex = this.previousIndex(this.decorationIndex) : this.decorations.length >
        0 && this.setSelectionToDecoration(this.decorations[this.decorationIndex]);
      var c = {
        position: this.decorations.length > 0 ? this.decorationIndex + 1 : 0,
        count: this.decorations.length
      };
      this.emit("matches", c), this.didReplace = !1
    }, b.prototype.update = function(a, b) {
      var c = !1;
      this.isRegex !== a.properties.isRegex && (this.isRegex = a.properties.isRegex, c = !0), this.matchCase !== a.properties
        .matchCase && (this.matchCase = a.properties.matchCase, c = !0), this.wholeWord !== a.properties.wholeWord &&
        (this.wholeWord = a.properties.wholeWord, c = !0), a.searchString !== this.searchString && (this.searchString =
          a.searchString, c = !0), this.replaceString = a.replaceString, a.isReplaceEnabled !== this.searchOnlyEditableRange &&
        (this.searchOnlyEditableRange = a.isReplaceEnabled, c = !0), c && this.updateDecorations(b)
    }, b.prototype.start = function(a, b) {
      this.startPosition = this.editor.getPosition(), this.isRegex = a.properties.isRegex, this.matchCase = a.properties
        .matchCase, this.wholeWord = a.properties.wholeWord, this.searchString = a.searchString, this.replaceString =
        a.replaceString, this.searchOnlyEditableRange = a.isReplaceEnabled, this.updateDecorations(!1), this.decorationIndex =
        this.previousIndex(this.indexAfterPosition(this.startPosition));
      var c = {
        state: a,
        shouldFocus: b
      };
      this.emit("start", c)
    }, b.prototype.prev = function() {
      this.decorations.length > 0 && (this.decorationIndex === -1 && (this.decorationIndex = this.indexAfterPosition(
        this.startPosition)), this.decorationIndex = this.previousIndex(this.decorationIndex), this.setSelectionToDecoration(
        this.decorations[this.decorationIndex]))
    }, b.prototype.next = function() {
      this.decorations.length > 0 && (this.decorationIndex === -1 ? this.decorationIndex = this.indexAfterPosition(
        this.startPosition) : this.decorationIndex = this.nextIndex(this.decorationIndex), this.setSelectionToDecoration(
        this.decorations[this.decorationIndex]))
    }, b.prototype.setSelectionToDecoration = function(a) {
      var b = this;
      this.editor.changeDecorations(function(c) {
        b.highlightedDecorationId !== null && c.changeDecorationOptions(b.highlightedDecorationId, b.createFindMatchDecorationOptions(!
          1)), c.changeDecorationOptions(a, b.createFindMatchDecorationOptions(!0)), b.highlightedDecorationId = a
      });
      var c = this.editor.getModel().getDecorationRange(a);
      this.editor.setSelection(c, !0, !0, !0)
    }, b.prototype.getReplaceString = function(a) {
      if (!this.isRegex) return this.replaceString;
      var b = k.createRegExp(this.searchString, this.isRegex, this.matchCase, this.wholeWord);
      return a.replace(b, this.replaceString)
    }, b.prototype.replace = function() {
      if (this.decorations.length === 0) return;
      var a = this.editor.getModel(),
        b = a.getDecorationRange(this.decorations[this.decorationIndex]),
        c = this.editor.getSelection();
      if (b !== null && c.startColumn === b.startColumn && c.endColumn === b.endColumn && c.startLineNumber === b.startLineNumber &&
        c.endLineNumber === b.endLineNumber) {
        var d = a.getValueInRange(c),
          e = this.getReplaceString(d),
          f = new n.ReplaceCommand(c, e);
        this.editor.executeCommand("replace", f), this.startPosition = new i.Position(c.startLineNumber, c.startColumn +
          e.length), this.decorationIndex = -1, this.didReplace = !0
      } else this.next()
    }, b.prototype.replaceAll = function() {
      var a = this;
      if (this.decorations.length === 0) return;
      var b = this.editor.getModel(),
        c = [];
      for (var d = 0, e = this.decorations.length; d < e; d++) c.push(b.getDecorationRange(this.decorations[d]));
      this.editor.changeDecorations(function(b) {
        a.removeOldDecorations(b)
      });
      var f = [];
      for (var d = 0, e = c.length; d < e; d++) f.push(this.getReplaceString(b.getValueInRange(c[d])));
      var g = new m.ReplaceAllCommand(c, f);
      this.editor.executeCommand("replaceAll", g)
    }, b.prototype.destroy = function() {
      var a = this;
      this.listenersToRemove.forEach(function(a) {
        a()
      }), this.listenersToRemove = [], this.editor.changeDecorations(function(b) {
        a.removeOldDecorations(b)
      }), this.emit("destroy", null)
    }, b.prototype.previousIndex = function(a) {
      return this.decorations.length > 0 ? (a - 1 + this.decorations.length) % this.decorations.length : 0
    }, b.prototype.nextIndex = function(a) {
      return this.decorations.length > 0 ? (a + 1) % this.decorations.length : 0
    }, b.prototype.indexAfterPosition = function(a) {
      if (this.decorations.length === 0) return 0;
      for (var b = 0, c = this.decorations.length; b < c; b++) {
        var d = this.decorations[b],
          e = this.editor.getModel().getDecorationRange(d);
        if (e.startLineNumber < a.lineNumber) continue;
        if (e.startLineNumber > a.lineNumber) return b;
        if (e.startColumn < a.column) continue;
        return b
      }
      return 0
    }, b
  }(l.EventEmitter);
  b.FindModelBoundToEditorModel = o
})