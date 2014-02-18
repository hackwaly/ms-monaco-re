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

define(["require", "exports", "vs/base/dom/mouseEvent", "vs/base/dom/dom", "vs/editor/core/controller/mouseHandler"],
  function(a, b, c, d, e) {
    var f = c;

    var g = d;

    var h = e;

    var i = function(a) {
      function b(b, c, d) {
        var e = this;
        a.call(this, b, c, d);
        var f = function(a, b) {
          var c = {
            translationY: b.translationY,
            translationX: b.translationX
          };
          a && (c.translationY += a.translationY, c.translationX += a.translationX);

          return c;
        };
        this.viewHelper.linesContentDomNode.style.msTouchAction = "none";

        this.viewHelper.linesContentDomNode.style.msContentZooming = "none";

        window.setTimeout(function() {
          if (window.MSGesture) {
            var a = new MSGesture;
            a.target = e.viewHelper.linesContentDomNode;

            e.viewHelper.linesContentDomNode.addEventListener("MSPointerDown", function(b) {
              var c = b.pointerType;
              if (c === (b.MSPOINTER_TYPE_MOUSE || "mouse")) {
                e._lastPointerType = "mouse";
              } else {
                if (c === (b.MSPOINTER_TYPE_TOUCH || "touch")) {
                  e._lastPointerType = "touch";
                } else {
                  e._lastPointerType = "pen";
                }
              }
              if (e._lastPointerType === "mouse") return;
              a.addPointer(b.pointerId);
            });

            e.listenersToRemove.push(g.addThrottledListener(e.viewHelper.linesContentDomNode, "MSGestureChange",
              function(a) {
                return e._onGestureChange(a);
              }, f));

            e.listenersToRemove.push(g.addListener(e.viewHelper.linesContentDomNode, "MSGestureTap", function(a) {
              return e._onCaptureGestureTap(a);
            }, !0));
          }
        }, 100);

        this._lastPointerType = "mouse";
      }
      __extends(b, a);

      b.prototype._onMouseDown = function(b) {
        if (this._lastPointerType === "mouse") {
          a.prototype._onMouseDown.call(this, b);
        }
      };

      b.prototype._onCaptureGestureTap = function(a) {
        var b = this;

        var c = new f.MouseEvent(a);

        var d = g.getDomNodePosition(this.viewHelper.linesContentDomNode);

        var e = this.mouseTargetFactory.createMouseTarget(d, c, !1);
        if (e.position) {
          this.viewController.moveTo("mouse", e.position.lineNumber, e.position.column);
        }

        if (c.browserEvent.fromElement) {
          c.preventDefault();
          this.viewHelper.textArea.focus();
        } else {
          setTimeout(function() {
            b.viewHelper.textArea.focus();
          });
        }
      };

      b.prototype._onGestureChange = function(a) {
        this.viewHelper.setScrollTop(this.viewHelper.getScrollTop() - a.translationY);

        this.viewHelper.setScrollLeft(this.viewHelper.getScrollLeft() - a.translationX);
      };

      b.prototype.dispose = function() {
        a.prototype.dispose.call(this);
      };

      return b;
    }(h.MouseHandler);

    var j = function() {
      function a(a, b, c) {
        if (window.navigator.msPointerEnabled) {
          this.handler = new i(a, b, c);
        } else {
          this.handler = new h.MouseHandler(a, b, c);
        }
      }
      a.prototype.onScrollChanged = function(a) {
        this.handler.onScrollChanged(a);
      };

      a.prototype.dispose = function() {
        this.handler.dispose();
      };

      return a;
    }();
    b.PointerHandler = j;
  });