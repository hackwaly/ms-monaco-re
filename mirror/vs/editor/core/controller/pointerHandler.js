var __extends = this.__extends || function(a, b) {
    function d() {
      this.constructor = a
    }
    for (var c in b) b.hasOwnProperty(c) && (a[c] = b[c]);
    d.prototype = b.prototype, a.prototype = new d
  };
define(["require", "exports", "vs/base/dom/mouseEvent", "vs/base/dom/dom", "vs/editor/core/controller/mouseHandler"],
  function(a, b, c, d, e) {
    var f = c,
      g = d,
      h = e,
      i = function(a) {
        function b(b, c, d) {
          var e = this;
          a.call(this, b, c, d);
          var f = function(a, b) {
            var c = {
              translationY: b.translationY,
              translationX: b.translationX
            };
            return a && (c.translationY += a.translationY, c.translationX += a.translationX), c
          };
          this.viewHelper.linesContentDomNode.style.msTouchAction = "none", this.viewHelper.linesContentDomNode.style.msContentZooming =
            "none", window.setTimeout(function() {
              if (window.MSGesture) {
                var a = new MSGesture;
                a.target = e.viewHelper.linesContentDomNode, e.viewHelper.linesContentDomNode.addEventListener(
                  "MSPointerDown", function(b) {
                    var c = b.pointerType;
                    c === (b.MSPOINTER_TYPE_MOUSE || "mouse") ? e._lastPointerType = "mouse" : c === (b.MSPOINTER_TYPE_TOUCH ||
                      "touch") ? e._lastPointerType = "touch" : e._lastPointerType = "pen";
                    if (e._lastPointerType === "mouse") return;
                    a.addPointer(b.pointerId)
                  }), e.listenersToRemove.push(g.addThrottledListener(e.viewHelper.linesContentDomNode,
                  "MSGestureChange", function(a) {
                    return e._onGestureChange(a)
                  }, f)), e.listenersToRemove.push(g.addListener(e.viewHelper.linesContentDomNode, "MSGestureTap",
                  function(a) {
                    return e._onCaptureGestureTap(a)
                  }, !0))
              }
            }, 100), this._lastPointerType = "mouse"
        }
        return __extends(b, a), b.prototype._onMouseDown = function(b) {
          this._lastPointerType === "mouse" && a.prototype._onMouseDown.call(this, b)
        }, b.prototype._onCaptureGestureTap = function(a) {
          var b = this,
            c = new f.MouseEvent(a),
            d = g.getDomNodePosition(this.viewHelper.linesContentDomNode),
            e = this.mouseTargetFactory.createMouseTarget(d, c, !1);
          e.position && this.viewController.moveTo("mouse", e.position.lineNumber, e.position.column), c.browserEvent.fromElement ?
            (c.preventDefault(), this.viewHelper.textArea.focus()) : setTimeout(function() {
            b.viewHelper.textArea.focus()
          })
        }, b.prototype._onGestureChange = function(a) {
          this.viewHelper.setScrollTop(this.viewHelper.getScrollTop() - a.translationY), this.viewHelper.setScrollLeft(
            this.viewHelper.getScrollLeft() - a.translationX)
        }, b.prototype.dispose = function() {
          a.prototype.dispose.call(this)
        }, b
      }(h.MouseHandler),
      j = function() {
        function a(a, b, c) {
          window.navigator.msPointerEnabled ? this.handler = new i(a, b, c) : this.handler = new h.MouseHandler(a, b, c)
        }
        return a.prototype.onScrollChanged = function(a) {
          this.handler.onScrollChanged(a)
        }, a.prototype.dispose = function() {
          this.handler.dispose()
        }, a
      }();
    b.PointerHandler = j
  })