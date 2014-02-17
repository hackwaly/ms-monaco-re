define("vs/editor/core/view/viewPart", ["require", "exports", "vs/editor/core/view/viewEventHandler"], function(e, t, n) {
  var i = function(e) {
    function t(t) {
      e.call(this);

      this._context = t;

      this._context.addEventHandler(this);

      this._modificationBeforeRenderingRunners = [];

      this._modificationRunners = [];
    }
    __extends(t, e);

    t.prototype.dispose = function() {
      this._context.removeEventHandler(this);

      this._context = null;

      this._modificationBeforeRenderingRunners = [];

      this._modificationRunners = [];
    };

    t.prototype._requestModificationFrameBeforeRendering = function(e) {
      this._modificationBeforeRenderingRunners.push(e);
    };

    t.prototype._requestModificationFrame = function(e) {
      this._modificationRunners.push(e);
    };

    t.prototype.onBeforeForcedLayout = function() {
      if (this._modificationBeforeRenderingRunners.length > 0) {
        for (var e = 0; e < this._modificationBeforeRenderingRunners.length; e++) {
          this._modificationBeforeRenderingRunners[e]();
        }
        this._modificationBeforeRenderingRunners = [];
      }
    };

    t.prototype.onReadAfterForcedLayout = function(e, t) {
      if (this.shouldRender) {
        this._render(e, t);
      }
    };

    t.prototype.onWriteAfterForcedLayout = function() {
      if (this.shouldRender) {
        this.shouldRender = !1;
        this._executeModificationRunners();
      }
    };

    t.prototype._executeModificationRunners = function() {
      if (this._modificationRunners.length > 0) {
        for (var e = 0; e < this._modificationRunners.length; e++) {
          this._modificationRunners[e]();
        }
        this._modificationRunners = [];
      }
    };

    t.prototype._render = function() {
      throw new Error("Implement me!");
    };

    return t;
  }(n.ViewEventHandler);
  t.ViewPart = i;
});