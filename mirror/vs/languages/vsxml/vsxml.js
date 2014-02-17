define('vs/languages/vsxml/vsxml', [
  'require',
  'exports',
  'vs/base/objects',
  'vs/base/errors',
  'vs/editor/modes/modesExtensions'
], function(e, t, n, i, r) {
  var o = '<>"=/',
    s = '\t ',
    a = n.createKeywordMatcher([
      'summary',
      'reference',
      'returns',
      'param',
      'loc'
    ]),
    u = n.createKeywordMatcher([
      'type',
      'path',
      'name',
      'locid',
      'filename',
      'format',
      'optional'
    ]),
    l = n.createKeywordMatcher(o.split('')),
    c = function(e) {
      function t(t, n, i) {
        e.call(this, t), this.state = n, this.parentState = i;
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
        var i = n;
        return null === this.state && null === i.state ? !0 : null === this.state || null === i.state ? !1 : null ===
          this.parentState && null === i.parentState ? !0 : null === this.parentState || null === i.parentState ? !1 :
          this.state.equals(i.state) && this.parentState.equals(i.parentState);
      }, t.prototype.setState = function(e) {
        this.state = e;
      }, t.prototype.postTokenize = function(e) {
        return e;
      }, t.prototype.tokenize = function(e) {
        var t = this.state.tokenize(e);
        return void 0 !== t.nextState && this.setState(t.nextState), t.nextState = this, this.postTokenize(t, e);
      }, t;
    }(r.AbstractState);
  t.EmbeddedState = c;
  var d = function(e) {
    function t(t, n, i) {
      e.call(this, t, n, i);
    }
    return __extends(t, e), t.prototype.setState = function(t) {
      e.prototype.setState.call(this, t), this.getParentState().setVSXMLState(t);
    }, t.prototype.postTokenize = function(e, t) {
      return t.eos() && (e.nextState = this.getParentState()), e;
    }, t;
  }(c);
  t.VSXMLEmbeddedState = d;
  var h = function(e) {
    function t(t, n, i, r) {
      'undefined' == typeof r && (r = ''), e.call(this, t), this.name = n, this.parent = i, this.whitespaceTokenType =
        r;
    }
    return __extends(t, e), t.prototype.equals = function(n) {
      return e.prototype.equals.call(this, n) ? n instanceof t && this.getMode() === n.getMode() && this.name === n.name &&
        (null === this.parent && null === n.parent || null !== this.parent && this.parent.equals(n.parent)) : !1;
    }, t.prototype.tokenize = function(e) {
      return e.setTokenRules(o, s), e.skipWhitespace().length > 0 ? {
        type: this.whitespaceTokenType
      } : this.stateTokenize(e);
    }, t.prototype.stateTokenize = function() {
      throw i.notImplemented();
    }, t;
  }(r.AbstractState);
  t.VSXMLState = h;
  var p = function(e) {
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
  t.VSXMLString = p;
  var f = function(e) {
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
        nextState: new p(this.getMode(), this)
      } : (a(t) ? n = 'tag.vs' : u(t) ? n = 'attribute.name.vs' : l(t) && (n = 'delimiter.vs'), {
        type: n,
        nextState: this
      });
    }, t;
  }(h);
  t.VSXMLTag = f;
  var g = function(e) {
    function t(t, n) {
      e.call(this, t, 'expression', n, 'vs');
    }
    return __extends(t, e), t.prototype.makeClone = function() {
      return new t(this.getMode(), this.parent ? this.parent.clone() : null);
    }, t.prototype.stateTokenize = function(e) {
      var t = e.nextToken();
      return '<' === t ? {
        type: 'delimiter.vs',
        nextState: new f(this.getMode(), this)
      } : {
        type: this.whitespaceTokenType,
        nextState: this
      };
    }, t;
  }(h);
  t.VSXMLExpression = g;
})