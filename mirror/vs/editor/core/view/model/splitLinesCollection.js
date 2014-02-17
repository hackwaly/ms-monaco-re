define("vs/editor/core/view/model/splitLinesCollection", ["require", "exports",
  "vs/editor/core/view/model/prefixSumComputer", "vs/editor/core/view/model/filteredLineTokens",
  "vs/editor/core/position", "vs/editor/core/view/viewContext"
], function(e, t, n, i, o, r) {
  var s = {
    outputLineIndex: 0,
    outputOffset: 0
  };

  var a = function() {
    function e(e) {
      this.positionMapper = e;

      this.outputLineCount = this.positionMapper.getOutputLineCount();
    }
    e.prototype.setLineText = function(e) {
      this.positionMapper.setLineText(e);

      this.outputLineCount = this.positionMapper.getOutputLineCount();
    };

    e.prototype.setTabSize = function(e) {
      this.positionMapper.setTabSize(e);

      this.outputLineCount = this.positionMapper.getOutputLineCount();
    };

    e.prototype.setWrappingColumn = function(e) {
      this.positionMapper.setWrappingColumn(e);

      this.outputLineCount = this.positionMapper.getOutputLineCount();
    };

    e.prototype.getOutputLineCount = function() {
      return this.outputLineCount;
    };

    e.prototype.getInputStartOffsetOfOutputLineIndex = function(e) {
      return this.positionMapper.getInputOffsetOfOutputPosition(e, 0);
    };

    e.prototype.getInputEndOffsetOfOutputLineIndex = function(e, t, n) {
      return n + 1 === this.outputLineCount ? e.getLineMaxColumn(t) - 1 : this.positionMapper.getInputOffsetOfOutputPosition(
        n + 1, 0);
    };

    e.prototype.getOutputLineContent = function(e, t, n) {
      var i = this.getInputStartOffsetOfOutputLineIndex(n);

      var o = this.getInputEndOffsetOfOutputLineIndex(e, t, n);
      return e.getLineContent(t).substring(i, o);
    };

    e.prototype.getOutputLineMaxColumn = function(e, t, n) {
      return this.getOutputLineContent(e, t, n).length + 1;
    };

    e.prototype.getOutputLineTokens = function(e, t, n) {
      var o = this.getInputStartOffsetOfOutputLineIndex(n);

      var r = this.getInputEndOffsetOfOutputLineIndex(e, t, n);
      return new i.FilteredLineTokens(e.getLineTokens(t, !0), o, r);
    };

    e.prototype.getInputColumnOfOutputPosition = function(e, t) {
      return this.positionMapper.getInputOffsetOfOutputPosition(e, t - 1) + 1;
    };

    e.prototype.getOutputPositionOfInputPosition = function(e, t) {
      this.positionMapper.getOutputPositionOfInputOffset(t - 1, s);
      var n = s.outputLineIndex;

      var i = s.outputOffset + 1;
      return new o.Position(e + n, i);
    };

    return e;
  }();

  var u = function() {
    function e(e, t, n, i) {
      this.model = e;

      this.tabSize = n;

      this.wrappingColumn = i;

      this.linePositionMapperFactory = t;

      this.constructLines();

      this.tmpIndexOfResult = {
        index: 0,
        remainder: 0
      };
    }
    e.prototype.constructLines = function() {
      this.lines = [];
      for (var e, t, i = [], o = 0, r = this.model.getLineCount(); r > o; o++) {
        t = this.linePositionMapperFactory.createLineMapper(this.model.getLineContent(o + 1), this.tabSize, this.wrappingColumn);
        e = new a(t);
        i[o] = e.getOutputLineCount();
        this.lines[o] = e;
      }
      this.prefixSumComputer = new n.PrefixSumComputer(i);
    };

    e.prototype.setTabSize = function(e, t) {
      if (this.tabSize === e) {
        return !1;
      }
      this.tabSize = e;
      for (var n = 0; n < this.lines.length; n++) {
        this.lines[n].setTabSize(this.tabSize);
        var i = this.lines[n].getOutputLineCount();
        this.prefixSumComputer.changeValue(n, i);
      }
      t(r.EventNames.ModelFlushedEvent, null);

      return !0;
    };

    e.prototype.setWrappingColumn = function(e, t) {
      if (this.wrappingColumn === e) {
        return !1;
      }
      this.wrappingColumn = e;
      for (var n = 0; n < this.lines.length; n++) {
        this.lines[n].setWrappingColumn(this.wrappingColumn);
        var i = this.lines[n].getOutputLineCount();
        this.prefixSumComputer.changeValue(n, i);
      }
      t(r.EventNames.ModelFlushedEvent, null);

      return !0;
    };

    e.prototype.onModelFlushed = function(e) {
      this.constructLines();

      e(r.EventNames.ModelFlushedEvent, null);
    };

    e.prototype.onModelLinesDeleted = function(e, t, n) {
      var i = 1 === e ? 1 : this.prefixSumComputer.getAccumulatedValue(e - 2) + 1;

      var o = this.prefixSumComputer.getAccumulatedValue(t - 1);
      this.lines.splice(e - 1, t - e + 1);

      this.prefixSumComputer.removeValues(e - 1, t - e + 1);
      var s = {
        fromLineNumber: i,
        toLineNumber: o
      };
      n(r.EventNames.LinesDeletedEvent, s);
    };

    e.prototype.onModelLinesInserted = function(e, t, n, i) {
      for (var o, s, u, l = 1 === e ? 1 : this.prefixSumComputer.getAccumulatedValue(e - 2) + 1, c = 0, d = n.length -
          1; d >= 0; d--) {
        u = this.linePositionMapperFactory.createLineMapper(n[d], this.tabSize, this.wrappingColumn);
        o = new a(u);
        this.lines.splice(e - 1, 0, o);
        s = o.getOutputLineCount();
        c += s;
        this.prefixSumComputer.insertValue(e - 1, s);
      }
      var h = {
        fromLineNumber: l,
        toLineNumber: l + c - 1
      };
      i(r.EventNames.LinesInsertedEvent, h);
    };

    e.prototype.onModelLineChanged = function(e, t, n) {
      var i = e - 1;

      var o = this.lines[i].getOutputLineCount();
      this.lines[i].setLineText(t);
      var s = this.lines[i].getOutputLineCount();

      var a = !1;

      var u = 0;

      var l = -1;

      var c = 0;

      var d = -1;

      var h = 0;

      var p = -1;
      if (o > s) {
        u = 1 === e ? 1 : this.prefixSumComputer.getAccumulatedValue(e - 2) + 1;
        l = u + s - 1;
        h = l + 1;
        p = h + (o - s) - 1;
        a = !0;
      } else {
        if (s > o) {
          u = 1 === e ? 1 : this.prefixSumComputer.getAccumulatedValue(e - 2) + 1;
          l = u + o - 1;
          c = l + 1;
          d = c + (s - o) - 1;
          a = !0;
        } else {
          u = 1 === e ? 1 : this.prefixSumComputer.getAccumulatedValue(e - 2) + 1;
          l = u + s - 1;
        }
      }

      this.prefixSumComputer.changeValue(i, s);
      var f;

      var g;

      var m;

      var v;
      if (l >= u)
        for (var f = u; l >= f; f++) {
          g = {
            lineNumber: f
          };
          n(r.EventNames.LineChangedEvent, g);
        }
      d >= c && (m = {
        fromLineNumber: c,
        toLineNumber: d
      }, n(r.EventNames.LinesInsertedEvent, m));

      p >= h && (v = {
        fromLineNumber: h,
        toLineNumber: p
      }, n(r.EventNames.LinesDeletedEvent, v));

      return a;
    };

    e.prototype.getOutputLineCount = function() {
      return this.prefixSumComputer.getTotalValue();
    };

    e.prototype.getOutputLineContent = function(e) {
      this.prefixSumComputer.getIndexOf(e - 1, this.tmpIndexOfResult);
      var t = this.tmpIndexOfResult.index;

      var n = this.tmpIndexOfResult.remainder;
      return this.lines[t].getOutputLineContent(this.model, t + 1, n);
    };

    e.prototype.getOutputLineMaxColumn = function(e) {
      this.prefixSumComputer.getIndexOf(e - 1, this.tmpIndexOfResult);
      var t = this.tmpIndexOfResult.index;

      var n = this.tmpIndexOfResult.remainder;
      return this.lines[t].getOutputLineMaxColumn(this.model, t + 1, n);
    };

    e.prototype.getOutputLineTokens = function(e) {
      this.prefixSumComputer.getIndexOf(e - 1, this.tmpIndexOfResult);
      var t = this.tmpIndexOfResult.index;

      var n = this.tmpIndexOfResult.remainder;
      return this.lines[t].getOutputLineTokens(this.model, t + 1, n);
    };

    e.prototype.convertOutputPositionToInputPosition = function(e, t) {
      this.prefixSumComputer.getIndexOf(e - 1, this.tmpIndexOfResult);
      var n = this.tmpIndexOfResult.index;

      var i = this.tmpIndexOfResult.remainder;

      var r = this.lines[n].getInputColumnOfOutputPosition(i, t);
      return new o.Position(n + 1, r);
    };

    e.prototype.convertInputPositionToOutputPosition = function(e, t) {
      var n = 1 + (1 === e ? 0 : this.prefixSumComputer.getAccumulatedValue(e - 2));

      var i = this.lines[e - 1].getOutputPositionOfInputPosition(n, t);
      return i;
    };

    return e;
  }();
  t.SplitLinesCollection = u;
});