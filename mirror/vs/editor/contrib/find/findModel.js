define("vs/editor/contrib/find/findModel", ["require", "exports", "vs/editor/core/position", "vs/editor/core/constants",
  "vs/base/strings", "vs/base/eventEmitter", "vs/editor/contrib/find/replaceAllCommand",
  "vs/editor/core/command/replaceCommand", "vs/editor/editor"
], function(e, t, n, i, o, r, s, a) {
  t.START_FIND_ID = "actions.find";

  t.NEXT_MATCH_FIND_ID = "editor.actions.nextMatchFindAction";

  t.PREVIOUS_MATCH_FIND_ID = "editor.actions.previousMatchFindAction";

  t.CANCEL_SELECTION_FIND_ID = "editor.actions.cancelSelectionFindAction";

  t.START_FIND_REPLACE_ID = "editor.actions.startFindReplaceAction";

  t.REPLACE_ID = "editor.actions.replaceAction";

  t.REPLACE_ALL_ID = "editor.actions.replaceAllAction";
  var u = function(e) {
    function t(n) {
      var o = this;
      e.call(this, [t._MATCHES_UPDATED_EVENT, t._START_EVENT]);

      this.editor = n;

      this.startPosition = null;

      this.searchString = "";

      this.replaceString = "";

      this.searchOnlyEditableRange = !1;

      this.decorations = [];

      this.decorationIndex = 0;

      this.findScopeDecorationId = null;

      this.highlightedDecorationId = null;

      this.listenersToRemove = [];

      this.updateDecorationsTimeout = null;

      this.didReplace = !1;

      this.isRegex = !1;

      this.matchCase = !1;

      this.wholeWord = !1;

      this.listenersToRemove.push(this.editor.addListener(i.EventType.CursorPositionChanged, function(e) {
        if ("explicit" === e.reason || "undo" === e.reason || "redo" === e.reason) {
          if (null !== o.highlightedDecorationId) {
            o.editor.changeDecorations(function(e) {
              e.changeDecorationOptions(o.highlightedDecorationId, o.createFindMatchDecorationOptions(!1));

              o.highlightedDecorationId = null;
            });
          }
          o.startPosition = o.editor.getPosition();
          o.decorationIndex = -1;
        }
      }));

      this.listenersToRemove.push(this.editor.getModel().addListener(i.EventType.ModelContentChanged, function(e) {
        e.changeType === i.EventType.ModelContentChangedFlush && (o.decorations = []);

        o.startPosition = o.editor.getPosition();

        return null !== o.updateDecorationsTimeout ? (window.clearTimeout(o.updateDecorationsTimeout), o.resetupdateDecorationsTimeout(),
          void 0) : (o.resetupdateDecorationsTimeout(), void 0);
      }));
    }
    __extends(t, e);

    t.prototype.resetupdateDecorationsTimeout = function() {
      var e = this;
      this.updateDecorationsTimeout = window.setTimeout(function() {
        e.updateDecorations(!1, !1, null);

        e.updateDecorationsTimeout = null;
      }, 100);
    };

    t.prototype.removeOldDecorations = function(e, t) {
      var n;

      var i;
      for (n = 0, i = this.decorations.length; i > n; n++) {
        e.removeDecoration(this.decorations[n]);
      }
      this.decorations = [];

      if (t && this.hasFindScope()) {
        e.removeDecoration(this.findScopeDecorationId);
        this.findScopeDecorationId = null;
      }
    };

    t.prototype.createFindMatchDecorationOptions = function(e) {
      return {
        stickiness: 1,
        isOverlay: !1,
        className: e ? "currentFindMatch" : "findMatch",
        overviewRuler: {
          color: "rgba(246, 185, 77, 0.7)",
          position: 2
        }
      };
    };

    t.prototype.createFindScopeDecorationOptions = function() {
      return {
        className: "findScope",
        isWholeLine: !0
      };
    };

    t.prototype.addMatchesDecorations = function(e, t) {
      var n;

      var i;
      for (n = 0, i = t.length; i > n; n++) {
        this.decorations[n] = e.addDecoration(t[n], this.createFindMatchDecorationOptions(!1));
      }
    };

    t.prototype.updateDecorations = function(e, t, n) {
      var i = this;
      if (this.didReplace) {
        this.next();
      }

      this.editor.changeDecorations(function(e) {
        i.removeOldDecorations(e, t);
        var o;
        o = i.searchOnlyEditableRange ? i.editor.getModel().getEditableRange() : i.editor.getModel().getFullModelRange();

        if (t && n) {
          i.findScopeDecorationId = e.addDecoration(n, i.createFindScopeDecorationOptions());
        }

        if (i.hasFindScope()) {
          o = o.intersectRanges(i.editor.getModel().getDecorationRange(i.findScopeDecorationId));
        }

        i.addMatchesDecorations(e, i.editor.getModel().findMatches(i.searchString, o, i.isRegex, i.matchCase, i.wholeWord));
      });

      this.highlightedDecorationId = null;

      this.decorationIndex = this.indexAfterPosition(this.startPosition);

      if (this.didReplace || e) {
        if (this.decorations.length > 0) {
          this.setSelectionToDecoration(this.decorations[this.decorationIndex]);
        }
      }

      {
        this.decorationIndex = this.previousIndex(this.decorationIndex);
      }
      var o = !1;
      if (0 === this.decorations.length && this.hasFindScope()) {
        o = this.editor.getModel().findMatches(this.searchString, this.editor.getModel().getFullModelRange(), this.isRegex,
          this.matchCase, this.wholeWord).length > 0;
      }
      var r = {
        position: this.decorations.length > 0 ? this.decorationIndex + 1 : 0,
        count: this.decorations.length,
        matchesOnlyOutsideSelection: o
      };
      this._emitMatchesUpdatedEvent(r);

      this.didReplace = !1;
    };

    t.prototype.setFindScope = function(e) {
      this.updateDecorations(!1, !0, e);
    };

    t.prototype.recomputeMatches = function(e, t) {
      var n = !1;
      if (this.isRegex !== e.properties.isRegex) {
        this.isRegex = e.properties.isRegex;
        n = !0;
      }

      if (this.matchCase !== e.properties.matchCase) {
        this.matchCase = e.properties.matchCase;
        n = !0;
      }

      if (this.wholeWord !== e.properties.wholeWord) {
        this.wholeWord = e.properties.wholeWord;
        n = !0;
      }

      if (e.searchString !== this.searchString) {
        this.searchString = e.searchString;
        n = !0;
      }

      this.replaceString = e.replaceString;

      if (e.isReplaceRevealed !== this.searchOnlyEditableRange) {
        this.searchOnlyEditableRange = e.isReplaceRevealed;
        n = !0;
      }

      if (n) {
        this.updateDecorations(t, !1, null);
      }
    };

    t.prototype.start = function(e, t, n) {
      this.startPosition = this.editor.getPosition();

      this.isRegex = e.properties.isRegex;

      this.matchCase = e.properties.matchCase;

      this.wholeWord = e.properties.wholeWord;

      this.searchString = e.searchString;

      this.replaceString = e.replaceString;

      this.searchOnlyEditableRange = e.isReplaceRevealed;

      this.updateDecorations(!1, !0, t);

      this.decorationIndex = this.previousIndex(this.indexAfterPosition(this.startPosition));
      var i = {
        state: e,
        selectionFindEnabled: this.hasFindScope(),
        shouldFocus: n
      };
      this._emitStartEvent(i);
    };

    t.prototype.prev = function() {
      if (this.decorations.length > 0) {
        if (-1 === this.decorationIndex) {
          this.decorationIndex = this.indexAfterPosition(this.startPosition);
        }
        this.decorationIndex = this.previousIndex(this.decorationIndex);
        this.setSelectionToDecoration(this.decorations[this.decorationIndex]);
      }
    };

    t.prototype.next = function() {
      if (this.decorations.length > 0) {
        this.decorationIndex = -1 === this.decorationIndex ? this.indexAfterPosition(this.startPosition) : this.nextIndex(
          this.decorationIndex);
        this.setSelectionToDecoration(this.decorations[this.decorationIndex]);
      }
    };

    t.prototype.setSelectionToDecoration = function(e) {
      var t = this;
      this.editor.changeDecorations(function(n) {
        if (null !== t.highlightedDecorationId) {
          n.changeDecorationOptions(t.highlightedDecorationId, t.createFindMatchDecorationOptions(!1));
        }

        n.changeDecorationOptions(e, t.createFindMatchDecorationOptions(!0));

        t.highlightedDecorationId = e;
      });
      var n = this.editor.getModel().getDecorationRange(e);
      this.editor.setSelection(n, !0, !0, !0);
    };

    t.prototype.getReplaceString = function(e) {
      if (!this.isRegex) {
        return this.replaceString;
      }
      var t = o.createRegExp(this.searchString, this.isRegex, this.matchCase, this.wholeWord);
      return e.replace(t, this.replaceString);
    };

    t.prototype.replace = function() {
      if (0 !== this.decorations.length) {
        var e = this.editor.getModel();

        var t = e.getDecorationRange(this.decorations[this.decorationIndex]);

        var i = this.editor.getSelection();
        if (null !== t && i.startColumn === t.startColumn && i.endColumn === t.endColumn && i.startLineNumber === t.startLineNumber &&
          i.endLineNumber === t.endLineNumber) {
          var o = e.getValueInRange(i);

          var r = this.getReplaceString(o);

          var s = new a.ReplaceCommand(i, r);
          this.editor.executeCommand("replace", s);

          this.startPosition = new n.Position(i.startLineNumber, i.startColumn + r.length);

          this.decorationIndex = -1;

          this.didReplace = !0;
        } else {
          this.next();
        }
      }
    };

    t.prototype.replaceAll = function() {
      var e = this;
      if (0 !== this.decorations.length) {
        for (var t = this.editor.getModel(), n = [], i = 0, o = this.decorations.length; o > i; i++) {
          n.push(t.getDecorationRange(this.decorations[i]));
        }
        this.editor.changeDecorations(function(t) {
          e.removeOldDecorations(t, !1);
        });
        for (var r = [], i = 0, o = n.length; o > i; i++) {
          r.push(this.getReplaceString(t.getValueInRange(n[i])));
        }
        var a = new s.ReplaceAllCommand(n, r);
        this.editor.executeCommand("replaceAll", a);
      }
    };

    t.prototype.dispose = function() {
      var t = this;
      e.prototype.dispose.call(this);

      this.listenersToRemove.forEach(function(e) {
        e();
      });

      this.listenersToRemove = [];

      this.editor.changeDecorations(function(e) {
        t.removeOldDecorations(e, !0);
      });
    };

    t.prototype.hasFindScope = function() {
      return !!this.findScopeDecorationId;
    };

    t.prototype.previousIndex = function(e) {
      return this.decorations.length > 0 ? (e - 1 + this.decorations.length) % this.decorations.length : 0;
    };

    t.prototype.nextIndex = function(e) {
      return this.decorations.length > 0 ? (e + 1) % this.decorations.length : 0;
    };

    t.prototype.indexAfterPosition = function(e) {
      if (0 === this.decorations.length) {
        return 0;
      }
      for (var t = 0, n = this.decorations.length; n > t; t++) {
        var i = this.decorations[t];

        var o = this.editor.getModel().getDecorationRange(i);
        if (!(o.startLineNumber < e.lineNumber)) {
          if (o.startLineNumber > e.lineNumber) {
            return t;
          }
          if (!(o.startColumn < e.column)) {
            return t;
          }
        }
      }
      return 0;
    };

    t.prototype.addStartEventListener = function(e) {
      return this.addListener2(t._START_EVENT, e);
    };

    t.prototype._emitStartEvent = function(e) {
      this.emit(t._START_EVENT, e);
    };

    t.prototype.addMatchesUpdatedEventListener = function(e) {
      return this.addListener2(t._MATCHES_UPDATED_EVENT, e);
    };

    t.prototype._emitMatchesUpdatedEvent = function(e) {
      this.emit(t._MATCHES_UPDATED_EVENT, e);
    };

    t._START_EVENT = "start";

    t._MATCHES_UPDATED_EVENT = "matches";

    return t;
  }(r.EventEmitter);
  t.FindModelBoundToEditorModel = u;
});