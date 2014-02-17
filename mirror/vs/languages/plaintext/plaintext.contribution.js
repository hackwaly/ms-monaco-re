define("vs/languages/plaintext/plaintext.contribution", ["require", "exports", "vs/editor/modes/modesExtensions",
  "vs/platform/platform"
], function(e, t, n, i) {
  var o = function(e) {
    function t(t) {
      e.call(this, t);
    }
    __extends(t, e);

    t.prototype.makeClone = function() {
      return new t(this.getMode());
    };

    t.prototype.tokenize = function(e) {
      e.advanceToEOS();

      return {
        type: ""
      };
    };

    return t;
  }(n.AbstractState);

  var r = function(e) {
    function t() {
      e.call(this, "vs.languages.plainText", n.AbstractMode.NULL_WORKER_ID);
    }
    __extends(t, e);

    t.prototype.getInitialState = function() {
      return new o(this);
    };

    return t;
  }(n.AbstractMode);
  t.Mode = r;
  var s = i.Registry.as(n.Extensions.EditorModes);
  s.registerMode(["text/plain"], new i.DeferredDescriptor("vs/languages/plaintext/plaintext.contribution", "Mode"));
});