define(["vs/base/lib/winjs.base", "vs/base/env"], function(a, b) {
  var c = function(a) {
    var b = window.MonacoScrollDivisor || 120;
    return a / b
  }, d = a.Class.define(function(b, c) {
      this.browserEvent = b, this.extraData = c, this.leftButton = b.button === 0, this.middleButton = b.button ===
        1, this.rightButton = b.button === 2, this.target = b.target || b.targetNode || b.srcElement, this.detail =
        b.detail || 1, b.type === "dblclick" && (this.detail = 2), this.posx = 0, this.posy = 0, this.ctrlKey = b.ctrlKey,
        this.shiftKey = b.shiftKey, this.altKey = b.altKey, this.metaKey = b.metaKey;
      if (b.clientX || b.clientY) this.posx = b.clientX + document.body.scrollLeft + document.documentElement.scrollLeft,
        this.posy = b.clientY + document.body.scrollTop + document.documentElement.scrollTop;
      else if (b.pageX || b.pageY) this.posx = b.pageX, this.posy = b.pageY
    }, {
      preventDefault: function() {
        this.browserEvent.preventDefault ? this.browserEvent.preventDefault() : this.browserEvent.returnValue = !1
      },
      stopPropagation: function() {
        this.browserEvent.stopPropagation ? this.browserEvent.stopPropagation() : this.browserEvent.cancelBubble = !
          0
      }
    }),
    e = a.Class.derive(d, function(b) {
      d.call(this, b), this.dataTransfer = b.dataTransfer
    }),
    f = a.Class.derive(e, function(b) {
      e.call(this, b)
    }),
    g = a.Class.define(function(d, e, f) {
      d ? this.browserEvent = d : d = d || {}, this.deltaY = f || 0, d.wheeldeltaY || d.wheeldeltaY === 0 ? this.deltaY =
        c(d.wheeldeltaY) : (d.VERTICAL_AXIS || d.VERTICAL_AXIS === 0) && d.axis === d.VERTICAL_AXIS && (this.deltaY = -
          d.detail / 3), this.deltaX = e || 0, d.wheelDeltaX ? b.browser.isSafari && b.browser.isWindows ? this.deltaX = -
        c(d.wheelDeltaX) : this.deltaX = c(d.wheelDeltaX) : (d.HORIZONTAL_AXIS || d.HORIZONTAL_AXIS === 0) && d.axis ===
        d.HORIZONTAL_AXIS && (this.deltaX = -d.detail / 3), this.deltaY === 0 && this.deltaX === 0 && d.wheelDelta &&
        (this.deltaY = c(d.wheelDelta)), this.target = d.target || d.targetNode
    }, {
      preventDefault: function() {
        this.browserEvent && (this.browserEvent.preventDefault ? this.browserEvent.preventDefault() : this.browserEvent
          .returnValue = !1)
      },
      stopPropagation: function() {
        this.browserEvent && (this.browserEvent.stopPropagation ? this.browserEvent.stopPropagation() : this.browserEvent
          .cancelBubble = !0)
      }
    });
  return {
    MouseEvent: d,
    DragMouseEvent: e,
    DropMouseEvent: f,
    MouseWheelEvent: g
  }
})