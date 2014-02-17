define("vs/editor/core/view/layout/scroll/editorScrollable", ["require", "exports", "vs/base/eventEmitter"], function(e,
  t, n) {
  var i = function(e) {
    function t(n) {
      e.call(this, [t._SCROLL_EVENT, t._INTERNAL_SIZE_CHANGED_EVENT]);

      this.linesContent = n;

      this.scrollTop = 0;

      this.scrollLeft = 0;

      this.scrollWidth = 0;

      this.scrollHeight = 0;

      this.width = 0;

      this.height = 0;
    }
    __extends(t, e);

    t.prototype.dispose = function() {
      e.prototype.dispose.call(this);
    };

    t.prototype.getWidth = function() {
      return this.width;
    };

    t.prototype.setWidth = function(e) {
      if (0 > e) {
        e = 0;
      }

      if (this.width !== e) {
        this.width = e;
        this.setScrollWidth(this.scrollWidth);
        this.setScrollLeft(this.scrollLeft);
      }
    };

    t.prototype.getScrollWidth = function() {
      return this.scrollWidth;
    };

    t.prototype.setScrollWidth = function(e) {
      if (e < this.width) {
        e = this.width;
      }

      if (this.scrollWidth !== e) {
        this.scrollWidth = e;
        this.setScrollLeft(this.scrollLeft);
        this._emitInternalSizeEvent();
      }
    };

    t.prototype.getScrollLeft = function() {
      return this.scrollLeft;
    };

    t.prototype.setScrollLeft = function(e) {
      if (0 > e) {
        e = 0;
      }

      if (e + this.width > this.scrollWidth) {
        e = this.scrollWidth - this.width;
      }

      if (this.scrollLeft !== e) {
        this.scrollLeft = e;
        this.linesContent.scrollLeft = e;
        this._emitScrollEvent(!1, !0);
      }
    };

    t.prototype.getHeight = function() {
      return this.height;
    };

    t.prototype.setHeight = function(e) {
      if (0 > e) {
        e = 0;
      }

      if (this.height !== e) {
        this.height = e;
        this.setScrollHeight(this.scrollHeight);
        this.setScrollTop(this.scrollTop);
      }
    };

    t.prototype.getScrollHeight = function() {
      return this.scrollHeight;
    };

    t.prototype.setScrollHeight = function(e) {
      if (e < this.height) {
        e = this.height;
      }

      if (this.scrollHeight !== e) {
        this.scrollHeight = e;
        this.setScrollTop(this.scrollTop);
        this._emitInternalSizeEvent();
      }
    };

    t.prototype.getScrollTop = function() {
      return this.scrollTop;
    };

    t.prototype.setScrollTop = function(e) {
      if (0 > e) {
        e = 0;
      }

      if (e + this.height > this.scrollHeight) {
        e = this.scrollHeight - this.height;
      }

      if (this.scrollTop !== e) {
        this.scrollTop = e;
        this._emitScrollEvent(!0, !1);
      }
    };

    t.prototype._emitScrollEvent = function(e, n) {
      var i = {
        vertical: e,
        horizontal: n,
        scrollTop: this.scrollTop,
        scrollLeft: this.scrollLeft
      };
      this.emit(t._SCROLL_EVENT, i);
    };

    t.prototype.addScrollListener = function(e) {
      return this.addListener2(t._SCROLL_EVENT, e);
    };

    t.prototype._emitInternalSizeEvent = function() {
      this.emit(t._INTERNAL_SIZE_CHANGED_EVENT);
    };

    t.prototype.addInternalSizeChangeListener = function(e) {
      return this.addListener2(t._INTERNAL_SIZE_CHANGED_EVENT, e);
    };

    t._SCROLL_EVENT = "scroll";

    t._INTERNAL_SIZE_CHANGED_EVENT = "internalSizeChanged";

    return t;
  }(n.EventEmitter);
  t.EditorScrollable = i;
});