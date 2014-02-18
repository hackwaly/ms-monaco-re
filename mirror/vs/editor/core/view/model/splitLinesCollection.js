define(["require", "exports", "vs/editor/core/view/model/prefixSumComputer",
  "vs/editor/core/view/model/filteredLineTokens", "vs/editor/core/position", "vs/editor/core/view/viewContext"
], function(a, b, c, d, e, f) {
  var g = c;

  var h = d;

  var i = e;

  var j = f;

  var k = {
    outputLineIndex: 0,
    outputOffset: 0
  };

  var l = function() {
    function a(a) {
      this.positionMapper = a;

      this.outputLineCount = this.positionMapper.getOutputLineCount();
    }
    a.prototype.setLineText = function(a) {
      this.positionMapper.setLineText(a);

      this.outputLineCount = this.positionMapper.getOutputLineCount();
    };

    a.prototype.setTabSize = function(a) {
      this.positionMapper.setTabSize(a);

      this.outputLineCount = this.positionMapper.getOutputLineCount();
    };

    a.prototype.setWrappingColumn = function(a) {
      this.positionMapper.setWrappingColumn(a);

      this.outputLineCount = this.positionMapper.getOutputLineCount();
    };

    a.prototype.getOutputLineCount = function() {
      return this.outputLineCount;
    };

    a.prototype.getInputStartOffsetOfOutputLineIndex = function(a) {
      return this.positionMapper.getInputOffsetOfOutputPosition(a, 0);
    };

    a.prototype.getInputEndOffsetOfOutputLineIndex = function(a, b, c) {
      return c + 1 === this.outputLineCount ? a.getLineMaxColumn(b) - 1 : this.positionMapper.getInputOffsetOfOutputPosition(
        c + 1, 0);
    };

    a.prototype.getOutputLineContent = function(a, b, c) {
      var d = this.getInputStartOffsetOfOutputLineIndex(c);

      var e = this.getInputEndOffsetOfOutputLineIndex(a, b, c);
      return a.getLineContent(b).substring(d, e);
    };

    a.prototype.getOutputLineMaxColumn = function(a, b, c) {
      return this.getOutputLineContent(a, b, c).length + 1;
    };

    a.prototype.getOutputLineTokens = function(a, b, c) {
      var d = this.getInputStartOffsetOfOutputLineIndex(c);

      var e = this.getInputEndOffsetOfOutputLineIndex(a, b, c);
      return new h.FilteredLineTokens(a.getLineTokens(b), d, e);
    };

    a.prototype.getInputColumnOfOutputPosition = function(a, b) {
      return this.positionMapper.getInputOffsetOfOutputPosition(a, b - 1) + 1;
    };

    a.prototype.getOutputPositionOfInputPosition = function(a, b) {
      this.positionMapper.getOutputPositionOfInputOffset(b - 1, k);
      var c = k.outputLineIndex;

      var d = k.outputOffset + 1;
      return new i.Position(a + c, d);
    };

    return a;
  }();

  var m = function() {
    function a(a, b, c, d) {
      this.model = a;

      this.tabSize = c;

      this.wrappingColumn = d;

      this.linePositionMapperFactory = b;

      this.constructLines();

      this.tmpIndexOfResult = {
        index: 0,
        remainder: 0
      };
    }
    a.prototype.constructLines = function() {
      this.lines = [];
      var a;

      var b = [];

      var c;
      for (var d = 0, e = this.model.getLineCount(); d < e; d++) {
        c = this.linePositionMapperFactory.createLineMapper(this.model.getLineContent(d + 1), this.tabSize, this.wrappingColumn);
        a = new l(c);
        b[d] = a.getOutputLineCount();
        this.lines[d] = a;
      }
      this.prefixSumComputer = new g.PrefixSumComputer(b);
    };

    a.prototype.setTabSize = function(a, b) {
      if (this.tabSize === a) {
        return !1;
      }
      this.tabSize = a;
      for (var c = 0; c < this.lines.length; c++) {
        this.lines[c].setTabSize(this.tabSize);
        var d = this.lines[c].getOutputLineCount();
        this.prefixSumComputer.changeValue(c, d);
      }
      b(j.EventNames.ModelFlushedEvent, null);

      return !0;
    };

    a.prototype.setWrappingColumn = function(a, b) {
      if (this.wrappingColumn === a) {
        return !1;
      }
      this.wrappingColumn = a;
      for (var c = 0; c < this.lines.length; c++) {
        this.lines[c].setWrappingColumn(this.wrappingColumn);
        var d = this.lines[c].getOutputLineCount();
        this.prefixSumComputer.changeValue(c, d);
      }
      b(j.EventNames.ModelFlushedEvent, null);

      return !0;
    };

    a.prototype.onModelFlushed = function(a) {
      this.constructLines();

      a(j.EventNames.ModelFlushedEvent, null);
    };

    a.prototype.onModelLinesDeleted = function(a, b, c) {
      var d = a === 1 ? 1 : this.prefixSumComputer.getAccumulatedValue(a - 2) + 1;

      var e = this.prefixSumComputer.getAccumulatedValue(b - 1);
      this.lines.splice(a - 1, b - a + 1);

      this.prefixSumComputer.removeValues(a - 1, b - a + 1);
      var f = {
        fromLineNumber: d,
        toLineNumber: e
      };
      c(j.EventNames.LinesDeletedEvent, f);
    };

    a.prototype.onModelLinesInserted = function(a, b, c, d) {
      var e = a === 1 ? 1 : this.prefixSumComputer.getAccumulatedValue(a - 2) + 1;

      var f;

      var g;

      var h = 0;

      var i;
      for (var k = c.length - 1; k >= 0; k--) {
        i = this.linePositionMapperFactory.createLineMapper(c[k], this.tabSize, this.wrappingColumn);
        f = new l(i);
        this.lines.splice(a - 1, 0, f);
        g = f.getOutputLineCount();
        h += g;
        this.prefixSumComputer.insertValue(a - 1, g);
      }
      var m = {
        fromLineNumber: e,
        toLineNumber: e + h - 1
      };
      d(j.EventNames.LinesInsertedEvent, m);
    };

    a.prototype.onModelLineChanged = function(a, b, c) {
      var d = a - 1;

      var e = this.lines[d].getOutputLineCount();
      this.lines[d].setLineText(b);
      var f = this.lines[d].getOutputLineCount();

      var g = !1;

      var h = 0;

      var i = -1;

      var k = 0;

      var l = -1;

      var m = 0;

      var n = -1;
      if (e > f) {
        h = a === 1 ? 1 : this.prefixSumComputer.getAccumulatedValue(a - 2) + 1;
        i = h + f - 1;
        m = i + 1;
        n = m + (e - f) - 1;
        g = !0;
      } else {
        if (e < f) {
          h = a === 1 ? 1 : this.prefixSumComputer.getAccumulatedValue(a - 2) + 1;
          i = h + e - 1;
          k = i + 1;
          l = k + (f - e) - 1;
          g = !0;
        } else {
          h = a === 1 ? 1 : this.prefixSumComputer.getAccumulatedValue(a - 2) + 1;
          i = h + f - 1;
        }
      }

      this.prefixSumComputer.changeValue(d, f);
      var o;

      var p;

      var q;

      var r;
      if (h <= i)
        for (var o = h; o <= i; o++) {
          p = {
            lineNumber: o
          };
          c(j.EventNames.LineChangedEvent, p);
        }
      k <= l && (q = {
        fromLineNumber: k,
        toLineNumber: l
      }, c(j.EventNames.LinesInsertedEvent, q));

      m <= n && (r = {
        fromLineNumber: m,
        toLineNumber: n
      }, c(j.EventNames.LinesDeletedEvent, r));

      return g;
    };

    a.prototype.getOutputLineCount = function() {
      return this.prefixSumComputer.getTotalValue();
    };

    a.prototype.getOutputLineContent = function(a) {
      this.prefixSumComputer.getIndexOf(a - 1, this.tmpIndexOfResult);
      var b = this.tmpIndexOfResult.index;

      var c = this.tmpIndexOfResult.remainder;
      return this.lines[b].getOutputLineContent(this.model, b + 1, c);
    };

    a.prototype.getOutputLineMaxColumn = function(a) {
      this.prefixSumComputer.getIndexOf(a - 1, this.tmpIndexOfResult);
      var b = this.tmpIndexOfResult.index;

      var c = this.tmpIndexOfResult.remainder;
      return this.lines[b].getOutputLineMaxColumn(this.model, b + 1, c);
    };

    a.prototype.getOutputLineTokens = function(a) {
      this.prefixSumComputer.getIndexOf(a - 1, this.tmpIndexOfResult);
      var b = this.tmpIndexOfResult.index;

      var c = this.tmpIndexOfResult.remainder;
      return this.lines[b].getOutputLineTokens(this.model, b + 1, c);
    };

    a.prototype.convertOutputPositionToInputPosition = function(a, b) {
      this.prefixSumComputer.getIndexOf(a - 1, this.tmpIndexOfResult);
      var c = this.tmpIndexOfResult.index;

      var d = this.tmpIndexOfResult.remainder;

      var e = this.lines[c].getInputColumnOfOutputPosition(d, b);
      return new i.Position(c + 1, e);
    };

    a.prototype.convertInputPositionToOutputPosition = function(a, b) {
      var c = 1 + (a === 1 ? 0 : this.prefixSumComputer.getAccumulatedValue(a - 2));

      var d = this.lines[a - 1].getOutputPositionOfInputPosition(c, b);
      return d;
    };

    return a;
  }();
  b.SplitLinesCollection = m;
});