define("vs/editor/contrib/snippet/snippet", ["require", "exports", "vs/base/collections", "vs/base/strings",
  "vs/editor/core/range", "vs/editor/core/constants", "vs/editor/core/command/replaceCommand",
  "vs/editor/core/selection", "vs/editor/editor", "vs/css!./snippet"
], function(e, t, n, i, o, r, s, a) {
  var u = function() {
    function e(e) {
      this.lines = [];

      this.placeHolders = [];

      this.startPlaceHolderIndex = 0;

      this.finishPlaceHolderIndex = -1;

      this.parseTemplate(e);
    }
    e.prototype.parseTemplate = function(e) {
      var t;

      var i;

      var r;

      var s;

      var a = {};

      var u = e.split("\n");
      for (t = 0, i = u.length; i > t; t++) {
        var l = this.parseLine(u[t]);
        for (r = 0, s = l.placeHolders.length; s > r; r++) {
          var c;

          var d = l.placeHolders[r];

          var h = new o.Range(t + 1, d.startColumn, t + 1, d.endColumn);
          n.contains(a, d.value) ? c = a[d.value] : (c = {
            value: d.value,
            occurences: []
          }, this.placeHolders.push(c), "" === d.value && (this.finishPlaceHolderIndex = this.placeHolders.length -
            1), a[d.value] = c);

          c.occurences.push(h);
        }
        this.lines.push(l.line);
      }
      if (this.placeHolders.length > this.startPlaceHolderIndex && "" === this.placeHolders[this.startPlaceHolderIndex]
        .value && this.placeHolders.length > 1) {
        this.startPlaceHolderIndex++;
      }
    };

    e.prototype.parseLine = function(e) {
      for (var t, n = "", i = [], o = 0, r = e.length, s = 0; r > o;)
        if ("{" === e.charAt(o) && r > o + 1 && "{" === e.charAt(o + 1)) {
          for (o += 2, t = ""; r > o;) {
            if ("}" === e.charAt(o) && r > o + 1 && "}" === e.charAt(o + 1)) {
              o += 2;
              break;
            }
            t += e.charAt(o);

            o++;
          }
          i.push({
            value: t,
            startColumn: s + 1,
            endColumn: s + 1 + t.length
          });

          n += t;

          s += t.length;
        } else {
          n += e.charAt(o);
          s++;
          o++;
        }
      return {
        line: n,
        placeHolders: i
      };
    };

    e.prototype.extractLineIndentation = function(e, t) {
      if ("undefined" == typeof t) {
        t = Number.MAX_VALUE;
      }
      var n = i.getLeadingWhitespace(e);
      return n.length > t - 1 ? n.substring(0, t - 1) : n;
    };

    e.prototype.bind = function(e, t, n, i) {
      var o;

      var r;

      var s;

      var a;

      var u;

      var l;

      var c;

      var d;

      var h = [];

      var p = [];

      var f = this.extractLineIndentation(e, n + 1);

      var g = [];
      for (u = 0, l = this.lines.length; l > u; u++) {
        o = this.lines[u];
        0 === u ? (g[u + 1] = n, h[u] = o) : (r = this.extractLineIndentation(o), s = o.substr(r.length), a = i.normalizeIndentation(
          f + r), g[u + 1] = a.length - r.length, h[u] = a + s);
      }
      var m;

      var v;

      var y;
      for (u = 0, l = this.placeHolders.length; l > u; u++) {
        for (m = this.placeHolders[u], y = [], c = 0, d = m.occurences.length; d > c; c++) {
          v = m.occurences[c];
          y.push({
            startLineNumber: v.startLineNumber + t,
            startColumn: v.startColumn + g[v.startLineNumber],
            endLineNumber: v.endLineNumber + t,
            endColumn: v.endColumn + g[v.endLineNumber]
          });
        }
        p.push({
          value: m.value,
          occurences: y
        });
      }
      return {
        lines: h,
        placeHolders: p,
        startPlaceHolderIndex: this.startPlaceHolderIndex,
        finishPlaceHolderIndex: this.finishPlaceHolderIndex
      };
    };

    return e;
  }();
  t.CodeSnippet = u;
  var l = function() {
    function e(e, t, n, i) {
      this.editor = e;

      this.model = e.getModel();

      this.handlerService = t;

      this.finishPlaceHolderIndex = n.finishPlaceHolderIndex;

      this.trackedPlaceHolders = [];

      this.placeHolderDecorations = [];

      this.currentPlaceHolderIndex = n.startPlaceHolderIndex;

      this.highlightDecorationId = null;

      this.isFinished = !1;

      this.binding = null;

      this.initialize(n, i);
    }
    e.prototype.initialize = function(e, t) {
      var n;

      var i;

      var s = this;
      for (n = 0, i = e.placeHolders.length; i > n; n++) {
        for (var a = e.placeHolders[n], u = [], l = 0, c = a.occurences.length; c > l; l++) {
          u.push(this.model.addTrackedRange(a.occurences[l], 0));
        }
        this.trackedPlaceHolders.push({
          ranges: u
        });
      }
      this.editor.changeDecorations(function(r) {
        var a = t + e.lines.length - 1;

        var u = s.model.getLineMaxColumn(a);
        for (s.highlightDecorationId = r.addDecoration(new o.Range(t, 1, a, u), {
          className: "new-snippet",
          isWholeLine: !0
        }), n = 0, i = s.trackedPlaceHolders.length; i > n; n++) {
          var l = n === s.finishPlaceHolderIndex ? "finish-snippet-placeholder" : "snippet-placeholder";
          s.placeHolderDecorations.push(r.addDecoration(s.model.getTrackedRange(s.trackedPlaceHolders[n].ranges[0]), {
            className: l
          }));
        }
      });

      this.listenersToRemove = [];

      this.listenersToRemove.push(this.model.addListener(r.EventType.ModelContentChanged, function(e) {
        if (!s.isFinished)
          if (e.changeType === r.EventType.ModelContentChangedFlush) {
            s.stopAll();
          } else if (e.changeType === r.EventType.ModelContentChangedLineChanged) {
          var t = e.lineNumber;

          var n = s.model.getDecorationRange(s.highlightDecorationId);
          if (t < n.startLineNumber || t > n.endLineNumber) {
            s.stopAll();
          }
        } else if (e.changeType === r.EventType.ModelContentChangedLinesInserted) {
          var i = e.fromLineNumber;

          var n = s.model.getDecorationRange(s.highlightDecorationId);
          if (i < n.startLineNumber || i > n.endLineNumber) {
            s.stopAll();
          }
        } else if (e.changeType === r.EventType.ModelContentChangedLinesDeleted) {
          var o = e.fromLineNumber;

          var a = e.toLineNumber;

          var n = s.model.getDecorationRange(s.highlightDecorationId);

          var u = a < n.startLineNumber;

          var l = o > n.endLineNumber;
          if (u || l) {
            s.stopAll();
          }
        }
      }));

      this.listenersToRemove.push(this.editor.addListener(r.EventType.CursorPositionChanged, function(e) {
        if (!s.isFinished) {
          var t = s.model.getDecorationRange(s.highlightDecorationId);

          var n = e.position.lineNumber;
          if (n < t.startLineNumber || n > t.endLineNumber) {
            s.stopAll();
          }
        }
      }));

      this.listenersToRemove.push(this.editor.addListener(r.EventType.ModelChanged, function() {
        s.stopAll();
      }));

      this.listenersToRemove.push(this.model.addListener(r.EventType.ModelDecorationsChanged, function() {
        if (!s.isFinished) {
          for (var e = s.model.getEditableRange(), t = !0, n = !0, i = 0;
            (t || n) && i < s.trackedPlaceHolders.length; i++)
            for (var o = s.trackedPlaceHolders[i].ranges, r = 0;
              (t || n) && r < o.length; r++) {
              var a = s.model.getTrackedRange(o[r]);
              if (t && !a.isEmpty()) {
                t = !1;
              }

              if (n && !e.equalsRange(a)) {
                n = !1;
              }
            }
          if (t || n) {
            s.stopAll();
          } else if (-1 !== s.finishPlaceHolderIndex) {
            var u = s.placeHolderDecorations[s.finishPlaceHolderIndex];

            var l = s.model.getDecorationRange(u);

            var c = s.model.getDecorationOptions(u);

            var d = l.isEmpty();

            var h = "finish-snippet-placeholder" === c.className;

            var p = Number(d) ^ Number(h);
            if (p) {
              s.editor.changeDecorations(function(e) {
                var t = d ? "finish-snippet-placeholder" : "snippet-placeholder";
                e.changeDecorationOptions(u, {
                  className: t
                });
              });
            }
          }
        }
      }));

      this.doLinkEditing();

      this.registerKeyHandlers();
    };

    e.prototype.registerKeyHandlers = function() {
      var e = this;
      this.binding = this.handlerService.bindGroup(function(t) {
        t({
          key: "Tab"
        }, function() {
          return e.onNextPlaceHolder();
        });

        t({
          key: "Shift-Tab"
        }, function() {
          return e.onPrevPlaceHolder();
        });

        t({
          key: "Enter"
        }, function() {
          return e.onAccept();
        });

        t({
          key: "Escape"
        }, function() {
          return e.onEscape();
        });
      });
    };

    e.prototype.onNextPlaceHolder = function() {
      return this.isFinished ? !1 : (this.currentPlaceHolderIndex = (this.currentPlaceHolderIndex + 1) % this.trackedPlaceHolders
        .length, this.doLinkEditing(), !0);
    };

    e.prototype.onPrevPlaceHolder = function() {
      return this.isFinished ? !1 : (this.currentPlaceHolderIndex = (this.trackedPlaceHolders.length + this.currentPlaceHolderIndex -
        1) % this.trackedPlaceHolders.length, this.doLinkEditing(), !0);
    };

    e.prototype.onAccept = function() {
      if (this.isFinished) {
        return !1;
      }
      if (-1 !== this.finishPlaceHolderIndex) {
        var e = this.model.getTrackedRange(this.trackedPlaceHolders[this.finishPlaceHolderIndex].ranges[0]);
        this.editor.setPosition({
          lineNumber: e.endLineNumber,
          column: e.endColumn
        });
      }
      this.stopAll();

      return !0;
    };

    e.prototype.onEscape = function() {
      return this.isFinished ? !1 : (this.stopAll(), this.editor.setSelections([this.editor.getSelections()[0]]), !0);
    };

    e.prototype.doLinkEditing = function() {
      for (var e = [], t = 0, n = this.trackedPlaceHolders[this.currentPlaceHolderIndex].ranges.length; n > t; t++) {
        var i = this.model.getTrackedRange(this.trackedPlaceHolders[this.currentPlaceHolderIndex].ranges[t]);
        e.push({
          selectionStartLineNumber: i.startLineNumber,
          selectionStartColumn: i.startColumn,
          positionLineNumber: i.endLineNumber,
          positionColumn: i.endColumn
        });
      }
      this.editor.setSelections(e);
    };

    e.prototype.stopAll = function() {
      var e = this;
      if (!this.isFinished) {
        this.isFinished = !0;

        this.listenersToRemove.forEach(function(e) {
          e();
        });

        this.listenersToRemove = [];
        for (var t = 0; t < this.trackedPlaceHolders.length; t++)
          for (var n = this.trackedPlaceHolders[t].ranges, i = 0; i < n.length; i++) {
            this.model.removeTrackedRange(n[i]);
          }
        this.trackedPlaceHolders = [];

        this.binding.dispose();

        this.editor.changeDecorations(function(t) {
          t.removeDecoration(e.highlightDecorationId);
          for (var n = 0; n < e.placeHolderDecorations.length; n++) {
            t.removeDecoration(e.placeHolderDecorations[n]);
          }
          e.placeHolderDecorations = [];

          e.highlightDecorationId = null;
        });
      }
    };

    return e;
  }();

  var c = function() {
    function e() {}
    e.run = function(e, t, n, i) {
      0 === n.placeHolders.length ? this._runForAllSelections(e, t, n, i) : this._runForPrimarySelection(e, t, n, i);
    };

    e._getTypeRangeForSelection = function(e, t, n) {
      var i;
      return i = n ? e.validateRange(o.plusRange(t, {
        startLineNumber: t.positionLineNumber,
        startColumn: t.positionColumn - n,
        endLineNumber: t.positionLineNumber,
        endColumn: t.positionColumn
      })) : t;
    };

    e._getAdaptedSnippet = function(e, t, n, i) {
      return n.bind(t.getLineContent(i.startLineNumber), i.startLineNumber - 1, i.startColumn - 1, e);
    };

    e._getCommandForSnippet = function(e, t) {
      var n = e.lines.join("\n");
      return new s.ReplaceCommand(t, n);
    };

    e._runForPrimarySelection = function(t, n, i, o) {
      var r = t.getModel();

      var s = e._getTypeRangeForSelection(r, t.getSelection(), o);

      var u = e._getAdaptedSnippet(t, r, i, s);
      t.executeCommand("editor.contrib.insertSnippetHelper", this._getCommandForSnippet(u, s));
      var c = e._getSnippetCursorOnly(u);
      c ? t.setSelection(new a.Selection(c.lineNumber, c.column, c.lineNumber, c.column)) : u.placeHolders.length > 0 &&
        new l(t, n, u, s.startLineNumber);
    };

    e._runForAllSelections = function(t, n, i, o) {
      var r;

      var s;

      var a;

      var u = t.getSelections();

      var l = t.getModel();

      var c = [];
      for (r = 0; r < u.length; r++) {
        s = e._getTypeRangeForSelection(l, u[r], o);
        a = e._getAdaptedSnippet(t, l, i, s);
        c.push(this._getCommandForSnippet(a, s));
      }
      t.executeCommands("editor.contrib.insertSnippetHelper", c);
    };

    e._getSnippetCursorOnly = function(e) {
      if (1 !== e.placeHolders.length) {
        return null;
      }
      var t = e.placeHolders[0];
      if ("" !== t.value || 1 !== t.occurences.length) {
        return null;
      }
      var n = t.occurences[0];
      return o.isEmpty(n) ? {
        lineNumber: n.startLineNumber,
        column: n.startColumn
      } : null;
    };

    return e;
  }();
  t.InsertSnippetHelper = c;
});