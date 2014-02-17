define("vs/base/ui/widgets/tree/tree", ["require", "exports"], function(e, t) {
  var n = function() {
    function e(e, t, n) {
      this._posx = e;

      this._posy = t;

      this._target = n;
    }
    e.prototype.preventDefault = function() {};

    e.prototype.stopPropagation = function() {};

    Object.defineProperty(e.prototype, "posx", {
      get: function() {
        return this._posx;
      },
      enumerable: !0,
      configurable: !0
    });

    Object.defineProperty(e.prototype, "posy", {
      get: function() {
        return this._posy;
      },
      enumerable: !0,
      configurable: !0
    });

    Object.defineProperty(e.prototype, "target", {
      get: function() {
        return this._target;
      },
      enumerable: !0,
      configurable: !0
    });

    return e;
  }();
  t.ContextMenuEvent = n;
  var i = function(e) {
    function t(t) {
      e.call(this, t.posx, t.posy, t.target);

      this.originalEvent = t;
    }
    __extends(t, e);

    t.prototype.preventDefault = function() {
      this.originalEvent.preventDefault();
    };

    t.prototype.stopPropagation = function() {
      this.originalEvent.stopPropagation();
    };

    return t;
  }(n);
  t.MouseContextMenuEvent = i;
  var o = function(e) {
    function t(t, n, i) {
      e.call(this, t, n, i.target);

      this.originalEvent = i;
    }
    __extends(t, e);

    t.prototype.preventDefault = function() {
      this.originalEvent.preventDefault();
    };

    t.prototype.stopPropagation = function() {
      this.originalEvent.stopPropagation();
    };

    return t;
  }(n);
  t.KeyboardContextMenuEvent = o;

  (function(e) {
    e[e.NONE = 0] = "NONE";

    e[e.ACCEPT = 1] = "ACCEPT";

    e[e.ACCEPT_BUBBLE_DOWN = 2] = "ACCEPT_BUBBLE_DOWN";

    e[e.BUBBLE_UP = 3] = "BUBBLE_UP";
  })(t.DragOverReaction || (t.DragOverReaction = {}));
  t.DragOverReaction;
});