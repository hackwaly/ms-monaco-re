define("vs/editor/core/view/viewOverlays", ["require", "exports", "vs/base/dom/dom", "vs/editor/core/view/viewPart"],
  function(e, t, n, i) {
    var o = function(e) {
      function t(t) {
        e.call(this, t);

        this._dynamicOverlays = [];

        this._overlays = [];

        this.domNode = document.createElement("div");

        this.domNode.className = "view-overlays";

        this.domNode.style.position = "absolute";

        this.domNode.setAttribute("role", "presentation");

        this.domNode.setAttribute("aria-hidden", "true");

        this._backgroundDomNode = document.createElement("div");

        this._backgroundDomNode.className = "background";

        this.domNode.appendChild(this._backgroundDomNode);

        this._staticDomNode = document.createElement("div");

        this._staticDomNode.className = "static";

        this.domNode.appendChild(this._staticDomNode);

        this._dynamicDomNode = document.createElement("div");

        this._dynamicDomNode.className = "dynamic";

        this.domNode.appendChild(this._dynamicDomNode);

        this._scrollHeight = 0;
      }
      __extends(t, e);

      t.prototype.dispose = function() {
        e.prototype.dispose.call(this);
        for (var t = 0; t < this._dynamicOverlays.length; t++) {
          this._dynamicOverlays[t].dispose();
        }
        this._dynamicOverlays = null;
        for (var t = 0; t < this._overlays.length; t++) {
          this._overlays[t].dispose();
        }
        this._overlays = null;
      };

      t.prototype.onViewFocusChanged = function(e) {
        var t = this;
        this._requestModificationFrame(function() {
          n.toggleClass(t._dynamicDomNode, "focused", e);
        });

        return !1;
      };

      t.prototype.onLayoutChanged = function(e) {
        var t = this;
        this._requestModificationFrame(function() {
          t._backgroundDomNode.style.width = e.width + "px";
        });

        return !1;
      };

      t.prototype.addDynamicOverlay = function(e) {
        this._dynamicOverlays.push(e);
      };

      t.prototype.addOverlay = function(e) {
        this._overlays.push(e);

        this._staticDomNode.appendChild(e.getDomNode());
      };

      t.prototype._render = function(e, t) {
        for (var n = this, i = !1, o = 0; !i && o < this._dynamicOverlays.length; o++) {
          i = this._dynamicOverlays[o].shouldCallRender() || i;
        }
        var r = null;
        if (i) {
          r = [];
          for (var o = 0; o < this._dynamicOverlays.length; o++) {
            r = r.concat(this._dynamicOverlays[o].render(e, t));
          }
        }
        for (var o = 0; o < this._overlays.length; o++) {
          this._overlays[o].prepareRender(e);
        }
        this._requestModificationFrame(function() {
          r && (n._dynamicDomNode.innerHTML = r.join(""));
          for (var t = 0; t < n._overlays.length; t++) {
            n._overlays[t].render(e);
          }
          n._scrollHeight !== e.scrollHeight && (n._scrollHeight = e.scrollHeight, n._backgroundDomNode.style.height =
            n._scrollHeight + "px");
          var i = e.getViewportVerticalOffsetForLineNumber(e.visibleRange.startLineNumber) + "px";
          n._backgroundDomNode.style.top !== i && (n._backgroundDomNode.style.top = i);
        });
      };

      t.prototype.onReadAfterForcedLayout = function(e, t) {
        this._render(e, t);

        return null;
      };

      t.prototype.onWriteAfterForcedLayout = function() {
        this._executeModificationRunners();
      };

      return t;
    }(i.ViewPart);
    t.ViewOverlays = o;
  });