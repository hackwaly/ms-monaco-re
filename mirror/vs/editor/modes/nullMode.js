define("vs/editor/modes/nullMode", ["require", "exports", "vs/editor/modes/modes"], function(e, t) {
  function n(e, t, n, i) {
    if ("undefined" == typeof i) {
      i = 0;
    }
    var o = [{
      startIndex: i,
      type: "",
      bracket: 0
    }];

    var r = [{
      startIndex: i,
      mode: e
    }];
    return {
      tokens: o,
      actualStopOffset: i + t.length,
      endState: n,
      modeTransitions: r
    };
  }
  var i = function() {
    function e(e, t) {
      this.mode = e;

      this.stateData = t;
    }
    e.prototype.clone = function() {
      var t = this.stateData ? this.stateData.clone() : null;
      return new e(this.mode, t);
    };

    e.prototype.equals = function(e) {
      if (this.mode !== e.getMode()) {
        return !1;
      }
      var t = e.getStateData();
      return this.stateData || t ? this.stateData && t ? this.stateData.equals(t) : !1 : !0;
    };

    e.prototype.getMode = function() {
      return this.mode;
    };

    e.prototype.tokenize = function(e) {
      e.advanceToEOS();

      return {
        type: ""
      };
    };

    e.prototype.getStateData = function() {
      return this.stateData;
    };

    e.prototype.setStateData = function(e) {
      this.stateData = e;
    };

    return e;
  }();
  t.NullState = i;
  var o = function() {
    function e() {
      this.tokenTypeClassificationSupport = this;
    }
    e.prototype.getId = function() {
      return "vs.editor.modes.nullMode";
    };

    e.prototype.bindModel = function() {};

    e.prototype.unbindModel = function() {};

    e.prototype.getNonWordTokenTypes = function() {
      return [];
    };

    e.prototype.getWordDefinition = function() {
      return e.DEFAULT_WORD_REGEXP;
    };

    e.DEFAULT_WORD_REGEXP = /(-?\d*\.\d\w*)|(\w+)/g;

    return e;
  }();
  t.NullMode = o;

  t.nullTokenize = n;
});