define("vs/languages/vsxml/vsxml", ["require", "exports", "vs/base/objects", "vs/base/errors",
  "vs/editor/modes/modesExtensions"
], function(e, t, n, i, r) {
  var o = '<>"=/';

  var s = "	 ";

  var a = n.createKeywordMatcher(["summary", "reference", "returns", "param", "loc"]);

  var u = n.createKeywordMatcher(["type", "path", "name", "locid", "filename", "format", "optional"]);

  var l = n.createKeywordMatcher(o.split(""));

  var c = function(e) {
    function t(t, n, i) {
      e.call(this, t);

      this.state = n;

      this.parentState = i;
    }
    __extends(t, e);

    t.prototype.getParentState = function() {
      return this.parentState;
    };

    t.prototype.makeClone = function() {
      return new t(this.getMode(), null === this.state ? null : this.state.clone(), null === this.parentState ? null :
        this.parentState.clone());
    };

    t.prototype.equals = function(n) {
      if (!e.prototype.equals.call(this, n)) return !1;
      if (!(n instanceof t)) return !1;
      var i = n;
      return null === this.state && null === i.state ? !0 : null === this.state || null === i.state ? !1 : null ===
        this.parentState && null === i.parentState ? !0 : null === this.parentState || null === i.parentState ? !1 :
        this.state.equals(i.state) && this.parentState.equals(i.parentState);
    };

    t.prototype.setState = function(e) {
      this.state = e;
    };

    t.prototype.postTokenize = function(e) {
      return e;
    };

    t.prototype.tokenize = function(e) {
      var t = this.state.tokenize(e);
      void 0 !== t.nextState && this.setState(t.nextState);

      t.nextState = this;

      return this.postTokenize(t, e);
    };

    return t;
  }(r.AbstractState);
  t.EmbeddedState = c;
  var d = function(e) {
    function t(t, n, i) {
      e.call(this, t, n, i);
    }
    __extends(t, e);

    t.prototype.setState = function(t) {
      e.prototype.setState.call(this, t);

      this.getParentState().setVSXMLState(t);
    };

    t.prototype.postTokenize = function(e, t) {
      t.eos() && (e.nextState = this.getParentState());

      return e;
    };

    return t;
  }(c);
  t.VSXMLEmbeddedState = d;
  var h = function(e) {
    function t(t, n, i, r) {
      "undefined" == typeof r && (r = "");

      e.call(this, t);

      this.name = n;

      this.parent = i;

      this.whitespaceTokenType = r;
    }
    __extends(t, e);

    t.prototype.equals = function(n) {
      return e.prototype.equals.call(this, n) ? n instanceof t && this.getMode() === n.getMode() && this.name === n.name &&
        (null === this.parent && null === n.parent || null !== this.parent && this.parent.equals(n.parent)) : !1;
    };

    t.prototype.tokenize = function(e) {
      e.setTokenRules(o, s);

      return e.skipWhitespace().length > 0 ? {
        type: this.whitespaceTokenType
      } : this.stateTokenize(e);
    };

    t.prototype.stateTokenize = function() {
      throw i.notImplemented();
    };

    return t;
  }(r.AbstractState);
  t.VSXMLState = h;
  var p = function(e) {
    function t(t, n) {
      e.call(this, t, "string", n, "attribute.value.vs");
    }
    __extends(t, e);

    t.prototype.makeClone = function() {
      return new t(this.getMode(), this.parent ? this.parent.clone() : null);
    };

    t.prototype.stateTokenize = function(e) {
      for (; !e.eos();) {
        var t = e.nextToken();
        if ('"' === t) return {
          type: "attribute.value.vs",
          nextState: this.parent
        };
      }
      return {
        type: "attribute.value.vs",
        nextState: this.parent
      };
    };

    return t;
  }(h);
  t.VSXMLString = p;
  var f = function(e) {
    function t(t, n) {
      e.call(this, t, "expression", n, "vs");
    }
    __extends(t, e);

    t.prototype.makeClone = function() {
      return new t(this.getMode(), this.parent ? this.parent.clone() : null);
    };

    t.prototype.stateTokenize = function(e) {
      var t = e.nextToken();

      var n = this.whitespaceTokenType;
      return ">" === t ? {
        type: "delimiter.vs",
        nextState: this.parent
      } : '"' === t ? {
        type: "attribute.value.vs",
        nextState: new p(this.getMode(), this)
      } : (a(t) ? n = "tag.vs" : u(t) ? n = "attribute.name.vs" : l(t) && (n = "delimiter.vs"), {
        type: n,
        nextState: this
      });
    };

    return t;
  }(h);
  t.VSXMLTag = f;
  var g = function(e) {
    function t(t, n) {
      e.call(this, t, "expression", n, "vs");
    }
    __extends(t, e);

    t.prototype.makeClone = function() {
      return new t(this.getMode(), this.parent ? this.parent.clone() : null);
    };

    t.prototype.stateTokenize = function(e) {
      var t = e.nextToken();
      return "<" === t ? {
        type: "delimiter.vs",
        nextState: new f(this.getMode(), this)
      } : {
        type: this.whitespaceTokenType,
        nextState: this
      };
    };

    return t;
  }(h);
  t.VSXMLExpression = g;
});