define(["require", "exports", "vs/editor/modes/modes"], function(a, b, c) {
  function g(a, b, c, e, f) {
    typeof e == "undefined" && (e = 0);
    var g = [{
      startIndex: e,
      type: "",
      bracket: d.Bracket.None
    }],
      h = [{
        startIndex: e,
        mode: a
      }];
    return {
      tokens: g,
      actualStopOffset: e + b.length,
      endState: c,
      modeTransitions: h
    }
  }
  var d = c,
    e = function() {
      function a(a, b) {
        this.mode = a, this.stateData = b
      }
      return a.prototype.clone = function() {
        var b = this.stateData ? this.stateData.clone() : null;
        return new a(this.mode, b)
      }, a.prototype.equals = function(a) {
        if (this.mode !== a.getMode()) return !1;
        var b = a.getStateData();
        return !this.stateData && !b ? !0 : this.stateData && b ? this.stateData.equals(b) : !1
      }, a.prototype.getMode = function() {
        return this.mode
      }, a.prototype.tokenize = function(a) {
        return a.advanceToEOS(), {
          type: ""
        }
      }, a.prototype.getStateData = function() {
        return this.stateData
      }, a.prototype.setStateData = function(a) {
        this.stateData = a
      }, a
    }();
  b.NullState = e;
  var f = function() {
    function a() {
      this.tokenTypeClassificationSupport = this
    }
    return a.prototype.getId = function() {
      return "vs.editor.modes.nullMode"
    }, a.prototype.bindModel = function(a) {}, a.prototype.unbindModel = function(a) {}, a.prototype.getNonWordTokenTypes =
      function() {
        return []
    }, a.prototype.getWordDefinition = function() {
      return a.DEFAULT_WORD_REGEXP
    }, a.DEFAULT_WORD_REGEXP = /(-?\d*\.\d\w*)|(\w+)/g, a
  }();
  b.NullMode = f, b.nullTokenize = g
})