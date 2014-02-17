define('vs/languages/vsxml/vsxml', [
  'require',
  'exports',
  'vs/base/objects',
  'vs/base/errors',
  'vs/editor/modes/modesExtensions'
], function(e, t, n, r, i) {
  var o = '<>"=/',
    s = '\t ',
    a = n.createKeywordMatcher([
      'summary',
      'reference',
      'returns',
      'param',
      'loc'
    ]),
    l = n.createKeywordMatcher([
      'type',
      'path',
      'name',
      'locid',
      'filename',
      'format',
      'optional'
    ]),
    c = n.createKeywordMatcher(o.split('')),
    u = function(e) {
      function t(t, n, r) {
        e.call(this, t), this.state = n, this.parentState = r;
      }
      return __extends(t, e), t.prototype.getParentState = function() {
        return this.parentState;
      }, t.prototype.makeClone = function() {
        return new t(this.getMode(), null === this.state ? null : this.state.clone(), null === this.parentState ?
          null : this.parentState.clone());
      }, t.prototype.equals = function(n) {
        if (!e.prototype.equals.call(this, n))
          return !1;
        if (!(n instanceof t))
          return !1;
        var r = n;
        return null === this.state && null === r.state ? !0 : null === this.state || null === r.state ? !1 : null ===
          this.parentState && null === r.parentState ? !0 : null === this.parentState || null === r.parentState ? !1 :
          this.state.equals(r.state) && this.parentState.equals(r.parentState);
      }, t.prototype.setState = function(e) {
        this.state = e;
      }, t.prototype.postTokenize = function(e) {
        return e;
      }, t.prototype.tokenize = function(e) {
        var t = this.state.tokenize(e);
        return void 0 !== t.nextState && this.setState(t.nextState), t.nextState = this, this.postTokenize(t, e);
      }, t;
    }(i.AbstractState);
  t.EmbeddedState = u;
  var p = function(e) {
    function t(t, n, r) {
      e.call(this, t, n, r);
    }
    return __extends(t, e), t.prototype.setState = function(t) {
      e.prototype.setState.call(this, t), this.getParentState().setVSXMLState(t);
    }, t.prototype.postTokenize = function(e, t) {
      return t.eos() && (e.nextState = this.getParentState()), e;
    }, t;
  }(u);
  t.VSXMLEmbeddedState = p;
  var h = function(e) {
    function t(t, n, r, i) {
      'undefined' == typeof i && (i = ''), e.call(this, t), this.name = n, this.parent = r, this.whitespaceTokenType =
        i;
    }
    return __extends(t, e), t.prototype.equals = function(n) {
      return e.prototype.equals.call(this, n) ? n instanceof t && this.getMode() === n.getMode() && this.name === n.name &&
        (null === this.parent && null === n.parent || null !== this.parent && this.parent.equals(n.parent)) : !1;
    }, t.prototype.tokenize = function(e) {
      return e.setTokenRules(o, s), e.skipWhitespace().length > 0 ? {
        type: this.whitespaceTokenType
      } : this.stateTokenize(e);
    }, t.prototype.stateTokenize = function() {
      throw r.notImplemented();
    }, t;
  }(i.AbstractState);
  t.VSXMLState = h;
  var d = function(e) {
    function t(t, n) {
      e.call(this, t, 'string', n, 'attribute.value.vs');
    }
    return __extends(t, e), t.prototype.makeClone = function() {
      return new t(this.getMode(), this.parent ? this.parent.clone() : null);
    }, t.prototype.stateTokenize = function(e) {
      for (; !e.eos();) {
        var t = e.nextToken();
        if ('"' === t)
          return {
            type: 'attribute.value.vs',
            nextState: this.parent
          };
      }
      return {
        type: 'attribute.value.vs',
        nextState: this.parent
      };
    }, t;
  }(h);
  t.VSXMLString = d;
  var m = function(e) {
    function t(t, n) {
      e.call(this, t, 'expression', n, 'vs');
    }
    return __extends(t, e), t.prototype.makeClone = function() {
      return new t(this.getMode(), this.parent ? this.parent.clone() : null);
    }, t.prototype.stateTokenize = function(e) {
      var t = e.nextToken(),
        n = this.whitespaceTokenType;
      return '>' === t ? {
        type: 'delimiter.vs',
        nextState: this.parent
      } : '"' === t ? {
        type: 'attribute.value.vs',
        nextState: new d(this.getMode(), this)
      } : (a(t) ? n = 'tag.vs' : l(t) ? n = 'attribute.name.vs' : c(t) && (n = 'delimiter.vs'), {
        type: n,
        nextState: this
      });
    }, t;
  }(h);
  t.VSXMLTag = m;
  var f = function(e) {
    function t(t, n) {
      e.call(this, t, 'expression', n, 'vs');
    }
    return __extends(t, e), t.prototype.makeClone = function() {
      return new t(this.getMode(), this.parent ? this.parent.clone() : null);
    }, t.prototype.stateTokenize = function(e) {
      var t = e.nextToken();
      return '<' === t ? {
        type: 'delimiter.vs',
        nextState: new m(this.getMode(), this)
      } : {
        type: this.whitespaceTokenType,
        nextState: this
      };
    }, t;
  }(h);
  t.VSXMLExpression = f;
})