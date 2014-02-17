define("vs/base/dom/keyboardController", ["require", "exports", "vs/base/dom/dom", "vs/base/lifecycle"], function(e, t,
  n, i) {
  var o = function() {
    function e(e) {
      var t = this;
      this._listeners = {};

      this._previousKeyDown = null;

      this._previousEventType = null;

      this._toDispose = [];

      this._toDispose.push(n.addStandardDisposableListener(e, "keydown", function(e) {
        return t._onKeyDown(e);
      }));

      this._toDispose.push(n.addStandardDisposableListener(e, "keypress", function(e) {
        return t._onKeyPress(e);
      }));

      this._toDispose.push(n.addStandardDisposableListener(e, "keyup", function(e) {
        return t._onKeyUp(e);
      }));
    }
    e.prototype.dispose = function() {
      this._toDispose = i.disposeAll(this._toDispose);

      this._listeners = null;

      this._previousKeyDown = null;

      this._previousEventType = null;
    };

    e.prototype.addListener = function(e, t) {
      var n = this;
      this._listeners[e] = t;

      return function() {
        n._listeners[e] = null;
      };
    };

    e.prototype._fire = function(e, t) {
      if (this._listeners.hasOwnProperty(e)) {
        this._listeners[e](t);
      }
    };

    e.prototype._onKeyDown = function(e) {
      this._previousKeyDown = e.clone();

      this._previousEventType = "keydown";

      this._fire("keydown", e);
    };

    e.prototype._onKeyPress = function(e) {
      if (this._previousKeyDown) {
        if (e.shiftKey && this._previousKeyDown.asString() !== e.asString()) {
          e.shiftKey = !1;
        }
        if ("keypress" === this._previousEventType) {
          this._fire("keydown", this._previousKeyDown);
        }
      }

      this._previousEventType = "keypress";

      this._fire("keypress", e);
    };

    e.prototype._onKeyUp = function(e) {
      this._fire("keyup", e);
    };

    return e;
  }();
  t.KeyboardController = o;
});