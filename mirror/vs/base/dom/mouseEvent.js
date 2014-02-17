define('vs/base/dom/mouseEvent', [
  'require',
  'exports',
  'vs/base/env',
  'vs/base/dom/iframe'
], function(e, t, n, i) {
  function o(e) {
    var t = window.MonacoScrollDivisor || 120;
    return e / t;
  }
  var r = function() {
    function e(e) {
      this.browserEvent = e, this.leftButton = 0 === e.button, this.middleButton = 1 === e.button, this.rightButton =
        2 === e.button, this.target = e.target || e.targetNode || e.srcElement, this.detail = e.detail || 1,
        'dblclick' === e.type && (this.detail = 2), this.posx = 0, this.posy = 0, this.ctrlKey = e.ctrlKey, this.shiftKey =
        e.shiftKey, this.altKey = e.altKey, this.metaKey = e.metaKey, e.clientX || e.clientY ? (this.posx = e.clientX +
          document.body.scrollLeft + document.documentElement.scrollLeft, this.posy = e.clientY + document.body.scrollTop +
          document.documentElement.scrollTop) : (e.pageX || e.pageY) && (this.posx = e.pageX, this.posy = e.pageY);
      var t = i.getPositionOfChildWindowRelativeToAncestorWindow(self, e.view);
      this.posx -= t.left, this.posy -= t.top;
    }
    return e.prototype.preventDefault = function() {
      this.browserEvent.preventDefault ? this.browserEvent.preventDefault() : this.browserEvent.returnValue = !1;
    }, e.prototype.stopPropagation = function() {
      this.browserEvent.stopPropagation ? this.browserEvent.stopPropagation() : this.browserEvent.cancelBubble = !0;
    }, e;
  }();
  t.StandardMouseEvent = r;
  var s = function(e) {
    function t(t) {
      e.call(this, t), this.dataTransfer = t.dataTransfer;
    }
    return __extends(t, e), t;
  }(r);
  t.DragMouseEvent = s;
  var a = function(e) {
    function t(t) {
      e.call(this, t);
    }
    return __extends(t, e), t;
  }(s);
  t.DropMouseEvent = a;
  var u = function() {
    function e(e, t, i) {
      if ('undefined' == typeof t && (t = 0), 'undefined' == typeof i && (i = 0), this.browserEvent = e || null, this
        .target = e ? e.target || e.targetNode || e.srcElement : null, this.deltaY = i, this.deltaX = t, e) {
        var r = e,
          s = e;
        'undefined' != typeof r.wheelDeltaY ? this.deltaY = o(r.wheelDeltaY) : 'undefined' != typeof s.VERTICAL_AXIS &&
          s.axis === s.VERTICAL_AXIS && (this.deltaY = -s.detail / 3), 'undefined' != typeof r.wheelDeltaX ? this.deltaX =
          n.browser.isSafari && n.browser.isWindows ? -o(r.wheelDeltaX) : o(r.wheelDeltaX) : 'undefined' != typeof s.HORIZONTAL_AXIS &&
          s.axis === s.HORIZONTAL_AXIS && (this.deltaX = -e.detail / 3), 0 === this.deltaY && 0 === this.deltaX && e.wheelDelta &&
          (this.deltaY = o(e.wheelDelta));
      }
    }
    return e.prototype.preventDefault = function() {
      this.browserEvent && (this.browserEvent.preventDefault ? this.browserEvent.preventDefault() : this.browserEvent
        .returnValue = !1);
    }, e.prototype.stopPropagation = function() {
      this.browserEvent && (this.browserEvent.stopPropagation ? this.browserEvent.stopPropagation() : this.browserEvent
        .cancelBubble = !0);
    }, e;
  }();
  t.StandardMouseWheelEvent = u;
})