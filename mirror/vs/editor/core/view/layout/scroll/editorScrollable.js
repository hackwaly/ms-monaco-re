var __extends = this.__extends || function(a, b) {
    function d() {
      this.constructor = a;
    }
    for (var c in b) {
      if (b.hasOwnProperty(c)) {
        a[c] = b[c];
      }
    }
    d.prototype = b.prototype;

    a.prototype = new d;
  };

define(["require", "exports", "vs/base/eventEmitter"], function(a, b, c) {
  var d = c;

  var e = function(a) {
    function b(b) {
      a.call(this);

      this.linesContent = b;

      this.scrollTop = 0;

      this.scrollLeft = 0;

      this.scrollWidth = 0;

      this.scrollHeight = 0;

      this.width = 0;

      this.height = 0;

      this.useNativeScrollTop = !0;
    }
    __extends(b, a);

    b.prototype.dispose = function() {
      a.prototype.dispose.call(this);
    };

    b.prototype.getWidth = function() {
      return this.width;
    };

    b.prototype.setWidth = function(a) {
      if (a < 0) {
        a = 0;
      }

      if (this.width !== a) {
        this.width = a;
        this.setScrollWidth(this.scrollWidth);
        this.setScrollLeft(this.scrollLeft);
      }
    };

    b.prototype.getScrollWidth = function() {
      return this.scrollWidth;
    };

    b.prototype.setScrollWidth = function(a) {
      if (a < this.width) {
        a = this.width;
      }

      if (this.scrollWidth !== a) {
        this.scrollWidth = a;
        this.setScrollLeft(this.scrollLeft);
        this._emitInternalSizeEvent();
      }
    };

    b.prototype.getScrollLeft = function() {
      return this.scrollLeft;
    };

    b.prototype.setScrollLeft = function(a) {
      if (a < 0) {
        a = 0;
      }

      if (a + this.width > this.scrollWidth) {
        a = this.scrollWidth - this.width;
      }

      if (this.scrollLeft !== a) {
        this.scrollLeft = a;
        this.linesContent.scrollLeft = a;
        this._emitScrollEvent(!1, !0);
      }
    };

    b.prototype.getHeight = function() {
      return this.height;
    };

    b.prototype.setHeight = function(a) {
      if (a < 0) {
        a = 0;
      }

      if (this.height !== a) {
        this.height = a;
        this.setScrollHeight(this.scrollHeight);
        this.setScrollTop(this.scrollTop);
      }
    };

    b.prototype.getScrollHeight = function() {
      return this.scrollHeight;
    };

    b.prototype.setScrollHeight = function(a) {
      if (a < this.height) {
        a = this.height;
      }

      if (this.scrollHeight !== a) {
        this.scrollHeight = a;
        this.setScrollTop(this.scrollTop);
        this._emitInternalSizeEvent();
      }
    };

    b.prototype.getScrollTop = function() {
      return this.scrollTop;
    };

    b.prototype.setScrollTop = function(a) {
      if (a < 0) {
        a = 0;
      }

      if (a + this.height > this.scrollHeight) {
        a = this.scrollHeight - this.height;
      }

      if (this.scrollTop !== a) {
        this.scrollTop = a;
        this._emitScrollEvent(!0, !1);
      }
    };

    b.prototype._emitScrollEvent = function(a, c) {
      var d = {
        vertical: a,
        horizontal: c
      };
      this.emit(b._SCROLL_EVENT, d);
    };

    b.prototype.addScrollListener = function(a) {
      return this.addListener2(b._SCROLL_EVENT, a);
    };

    b.prototype._emitInternalSizeEvent = function() {
      this.emit(b._INTERNAL_SIZE_CHANGED_EVENT);
    };

    b.prototype.addInternalSizeChangeListener = function(a) {
      return this.addListener2(b._INTERNAL_SIZE_CHANGED_EVENT, a);
    };

    b._SCROLL_EVENT = "scroll";

    b._INTERNAL_SIZE_CHANGED_EVENT = "internalSizeChanged";

    return b;
  }(d.EventEmitter);
  b.EditorScrollable = e;
});