define(["require", "exports", "vs/base/strings", "vs/editor/core/range", "vs/editor/core/constants",
  "vs/editor/core/command/replaceCommand", "vs/editor/core/selection", "vs/css!./snippet"
], function(a, b, c, d, e, f, g) {
  var h = c;

  var i = d;

  var j = e;

  var k = f;

  var l = g;

  var m = function() {
    function a(a) {
      this.lines = [];

      this.placeHolders = [];

      this.startPlaceHolderIndex = 0;

      this.finishPlaceHolderIndex = -1;

      this.parseTemplate(a);
    }
    a.prototype.parseTemplate = function(a) {
      var b = {};

      var c;

      var d;

      var e;

      var f;

      var g = a.split("\n");
      for (c = 0, d = g.length; c < d; c++) {
        var h = this.parseLine(g[c]);
        for (e = 0, f = h.placeHolders.length; e < f; e++) {
          var j = h.placeHolders[e];

          var k = new i.Range(c + 1, j.startColumn, c + 1, j.endColumn);

          var l;
          b.hasOwnProperty(j.value) ? l = b[j.value] : (l = {
            value: j.value,
            occurences: []
          }, this.placeHolders.push(l), j.value === "" && (this.finishPlaceHolderIndex = this.placeHolders.length -
            1), b[j.value] = l);

          l.occurences.push(k);
        }
        this.lines.push(h.line);
      }
      this.placeHolders.length > this.startPlaceHolderIndex && this.placeHolders[this.startPlaceHolderIndex].value ===
        "" && this.placeHolders.length > 1 && this.startPlaceHolderIndex++;
    };

    a.prototype.parseLine = function(a) {
      var b;

      var c = "";

      var d = [];

      var e = 0;

      var f = a.length;

      var g = 0;
      while (e < f)
        if (a.charAt(e) === "{" && e + 1 < f && a.charAt(e + 1) === "{") {
          e += 2;

          b = "";
          while (e < f) {
            if (a.charAt(e) === "}" && e + 1 < f && a.charAt(e + 1) === "}") {
              e += 2;
              break;
            }
            b += a.charAt(e);

            e++;
          }
          d.push({
            value: b,
            startColumn: g + 1,
            endColumn: g + 1 + b.length
          });

          c += b;

          g += b.length;
        } else c += a.charAt(e);

      g++;

      e++;
      return {
        line: c,
        placeHolders: d
      };
    };

    a.prototype.extractLineIndentation = function(a, b) {
      typeof b == "undefined" && (b = Number.MAX_VALUE);
      var c = h.getLeadingWhitespace(a);
      return c.length > b - 1 ? c.substring(0, b - 1) : c;
    };

    a.prototype.bind = function(a, b, c, d) {
      var e = [];

      var f = [];

      var g = this.extractLineIndentation(a, c + 1);

      var h;

      var i;

      var j;

      var k;

      var l;

      var m;

      var n;

      var o;

      var p = [];
      for (l = 0, m = this.lines.length; l < m; l++) h = this.lines[l];

      l === 0 ? (p[l + 1] = c, e[l] = h) : (i = this.extractLineIndentation(h), j = h.substr(i.length), k = d.normalizeIndentation(
        g + i), p[l + 1] = k.length - i.length, e[l] = k + j);
      var q;

      var r;

      var s;
      for (l = 0, m = this.placeHolders.length; l < m; l++) {
        q = this.placeHolders[l];

        s = [];
        for (n = 0, o = q.occurences.length; n < o; n++) r = q.occurences[n];

        s.push({
          startLineNumber: r.startLineNumber + b,
          startColumn: r.startColumn + p[r.startLineNumber],
          endLineNumber: r.endLineNumber + b,
          endColumn: r.endColumn + p[r.endLineNumber]
        });
        f.push({
          value: q.value,
          occurences: s
        });
      }
      return {
        lines: e,
        placeHolders: f,
        startPlaceHolderIndex: this.startPlaceHolderIndex,
        finishPlaceHolderIndex: this.finishPlaceHolderIndex
      };
    };

    return a;
  }();
  b.CodeSnippet = m;
  var n = function() {
    function a(a, b, c, d) {
      this.editor = a;

      this.handlerService = b;

      this.finishPlaceHolderIndex = c.finishPlaceHolderIndex;

      this.trackedPlaceHolders = [];

      this.placeHolderDecorations = [];

      this.currentPlaceHolderIndex = c.startPlaceHolderIndex;

      this.highlightDecorationId = null;

      this.isFinished = !1;

      this.binding = null;

      this.initialize(c, d);
    }
    a.prototype.initialize = function(a, b) {
      var c = this;

      var d = [];

      var e;

      var f;

      var g = this.editor.getModel();
      for (e = 0, f = a.placeHolders.length; e < f; e++) {
        var h = a.placeHolders[e];

        var k = [];
        for (var l = 0, m = h.occurences.length; l < m; l++) k.push(g.addTrackedRange(h.occurences[l]));
        this.trackedPlaceHolders.push({
          ranges: k
        });
      }
      this.editor.changeDecorations(function(d) {
        var h = b + a.lines.length - 1;

        var j = c.editor.getModel().getLineMaxColumn(h);
        c.highlightDecorationId = d.addDecoration(new i.Range(b, 1, h, j), {
          className: "new-snippet",
          isWholeLine: !0
        });
        for (e = 0, f = c.trackedPlaceHolders.length; e < f; e++) {
          var k = e === c.finishPlaceHolderIndex ? "finish-snippet-placeholder" : "snippet-placeholder";
          c.placeHolderDecorations.push(d.addDecoration(g.getTrackedRange(c.trackedPlaceHolders[e].ranges[0]), {
            className: k
          }));
        }
      });

      this.listenersToRemove = [];

      this.listenersToRemove.push(this.editor.getModel().addListener(j.EventType.ModelContentChanged, function(a) {
        if (c.isFinished) return;
        if (a.changeType === j.EventType.ModelContentChangedFlush) c.stopAll();
        else if (a.changeType === j.EventType.ModelContentChangedLineChanged) {
          var b = a.lineNumber;

          var d = c.editor.getModel().getDecorationRange(c.highlightDecorationId);
          (b < d.startLineNumber || b > d.endLineNumber) && c.stopAll();
        } else if (a.changeType === j.EventType.ModelContentChangedLinesInserted) {
          var e = a.fromLineNumber;

          var d = c.editor.getModel().getDecorationRange(c.highlightDecorationId);
          (e < d.startLineNumber || e > d.endLineNumber) && c.stopAll();
        } else if (a.changeType === j.EventType.ModelContentChangedLinesDeleted) {
          var f = a.fromLineNumber;

          var g = a.toLineNumber;

          var d = c.editor.getModel().getDecorationRange(c.highlightDecorationId);

          var h = g < d.startLineNumber;

          var i = f > d.endLineNumber;
          (h || i) && c.stopAll();
        }
      }));

      this.listenersToRemove.push(this.editor.addListener(j.EventType.CursorPositionChanged, function(a) {
        if (c.isFinished) return;
        var b = c.editor.getModel().getDecorationRange(c.highlightDecorationId);

        var d = a.position.lineNumber;
        (d < b.startLineNumber || d > b.endLineNumber) && c.stopAll();
      }));

      this.listenersToRemove.push(this.editor.addListener(j.EventType.ModelChanged, function() {
        c.stopAll();
      }));

      this.listenersToRemove.push(this.editor.getModel().addListener(j.EventType.ModelDecorationsChanged, function(a) {
        if (c.isFinished) return;
        var b = !0;
        for (var d = 0; d < c.trackedPlaceHolders.length; d++) {
          var e = c.trackedPlaceHolders[d].ranges;
          for (var f = 0; f < e.length; f++) {
            var g = c.editor.getModel().getTrackedRange(e[f]);
            if (!g.isEmpty()) {
              b = !1;
              break;
            }
          }
        }
        if (b) c.stopAll();
        else if (c.finishPlaceHolderIndex !== -1) {
          var h = c.placeHolderDecorations[c.finishPlaceHolderIndex];

          var i = c.editor.getModel().getDecorationRange(h);

          var j = c.editor.getModel().getDecorationOptions(h);

          var k = i.isEmpty();

          var l = j.className === "finish-snippet-placeholder";

          var m = Number(k) ^ Number(l);
          m && c.editor.changeDecorations(function(a) {
            var b = k ? "finish-snippet-placeholder" : "snippet-placeholder";
            a.changeDecorationOptions(h, {
              className: b
            });
          });
        }
      }));

      this.doLinkEditing();

      this.registerKeyHandlers();
    };

    a.prototype.registerKeyHandlers = function() {
      var a = this;
      this.binding = this.handlerService.bindGroup(function(b) {
        b({
          key: "Tab"
        }, function() {
          return a.onNextPlaceHolder();
        });

        b({
          key: "Shift-Tab"
        }, function() {
          return a.onPrevPlaceHolder();
        });

        b({
          key: "Enter"
        }, function() {
          return a.onAccept();
        });

        b({
          key: "Escape"
        }, function() {
          return a.onEscape();
        });
      });
    };

    a.prototype.onNextPlaceHolder = function() {
      return this.isFinished ? !1 : (this.currentPlaceHolderIndex = (this.currentPlaceHolderIndex + 1) % this.trackedPlaceHolders
        .length, this.doLinkEditing(), !0);
    };

    a.prototype.onPrevPlaceHolder = function() {
      return this.isFinished ? !1 : (this.currentPlaceHolderIndex = (this.trackedPlaceHolders.length + this.currentPlaceHolderIndex -
        1) % this.trackedPlaceHolders.length, this.doLinkEditing(), !0);
    };

    a.prototype.onAccept = function() {
      if (this.isFinished) return !1;
      if (this.finishPlaceHolderIndex !== -1) {
        var a = this.editor.getModel().getTrackedRange(this.trackedPlaceHolders[this.finishPlaceHolderIndex].ranges[0]);
        this.editor.setPosition({
          lineNumber: a.endLineNumber,
          column: a.endColumn
        });
      }
      this.stopAll();

      return !0;
    };

    a.prototype.onEscape = function() {
      return this.isFinished ? !1 : (this.stopAll(), this.editor.setSelections([this.editor.getSelections()[0]]), !0);
    };

    a.prototype.doLinkEditing = function() {
      var a = [];
      for (var b = 0, c = this.trackedPlaceHolders[this.currentPlaceHolderIndex].ranges.length; b < c; b++) {
        var d = this.editor.getModel().getTrackedRange(this.trackedPlaceHolders[this.currentPlaceHolderIndex].ranges[
          b]);
        a.push({
          selectionStartLineNumber: d.startLineNumber,
          selectionStartColumn: d.startColumn,
          positionLineNumber: d.endLineNumber,
          positionColumn: d.endColumn
        });
      }
      this.editor.setSelections(a);
    };

    a.prototype.stopAll = function() {
      var a = this;
      if (this.isFinished) return;
      this.isFinished = !0;

      this.listenersToRemove.forEach(function(a) {
        a();
      });

      this.listenersToRemove = [];
      var b = this.editor.getModel();
      for (var c = 0; c < this.trackedPlaceHolders.length; c++) {
        var d = this.trackedPlaceHolders[c].ranges;
        for (var e = 0; e < d.length; e++) b.removeTrackedRange(d[e]);
      }
      this.trackedPlaceHolders = [];

      this.binding.dispose();

      this.editor.changeDecorations(function(b) {
        b.removeDecoration(a.highlightDecorationId);
        for (var c = 0; c < a.placeHolderDecorations.length; c++) b.removeDecoration(a.placeHolderDecorations[c]);
        a.placeHolderDecorations = [];

        a.highlightDecorationId = null;
      });
    };

    return a;
  }();

  var o = function() {
    function a() {}
    a.run = function(b, c, d, e) {
      var f = b.getSelection();

      var g = f.getStartPosition();

      var h = b.getModel();

      var i = f;
      e && (i = i.plusRange(e));
      var j = d.bind(h.getLineContent(i.startLineNumber), i.startLineNumber - 1, i.startColumn - 1, b);

      var m = j.lines.join("\n");

      var o = new k.ReplaceCommand(i, m);
      b.executeCommand("editor.contrib.insertSnippetHelper", o);
      var p = a._getSnippetCursorOnly(j);
      p ? b.setSelection(new l.Selection(p.lineNumber, p.column, p.lineNumber, p.column)) : j.placeHolders.length > 0 &&
        new n(b, c, j, i.startLineNumber);
    };

    a._getSnippetCursorOnly = function(a) {
      if (a.placeHolders.length !== 1) return null;
      var b = a.placeHolders[0];
      if (b.value !== "" || b.occurences.length !== 1) return null;
      var c = b.occurences[0];
      return i.RangeUtils.isEmpty(c) ? {
        lineNumber: c.startLineNumber,
        column: c.startColumn
      } : null;
    };

    return a;
  }();
  b.InsertSnippetHelper = o;
});