var __extends = this.__extends || function(a, b) {
    function d() {
      this.constructor = a
    }
    for (var c in b) b.hasOwnProperty(c) && (a[c] = b[c]);
    d.prototype = b.prototype, a.prototype = new d
  };
define(["require", "exports", "vs/base/dom/builder", "vs/base/dom/dom", "vs/base/eventEmitter",
  "vs/base/dom/mouseEvent", "vs/css!./sash"
], function(a, b, c, d, e, f) {
  var g = c,
    h = d,
    i = e,
    j = f,
    k = g.$,
    l = function(a) {
      function b(b, c) {
        var d = this;
        a.call(this), this.$e = k(".monaco-sash").appendTo(b).on("mousedown", function(a, b, c) {
          d.onMouseDown(a)
        }), this.dataProvider = c
      }
      return __extends(b, a), b.prototype.getHTMLElement = function() {
        return this.$e.getHTMLElement()
      }, b.prototype.onMouseDown = function(a) {
        var b = this;
        h.EventHelper.stop(a, !1);
        var c = new j.MouseEvent(a),
          d = c.posx;
        this.$e.addClass("active"), this.emit("start");
        var e = k("div").style({
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: 1e6,
          cursor: "ew-resize"
        }),
          f = k(window);
        f.on("mousemove", function(a) {
          h.EventHelper.stop(a, !1);
          var c = new j.MouseEvent(a),
            e = {
              startX: d,
              currentX: c.posx
            };
          b.emit("change", e)
        }).once("mouseup", function(a) {
          h.EventHelper.stop(a, !1);
          var c = new j.MouseEvent(a);
          b.$e.removeClass("active"), b.emit("end"), f.off("mousemove"), e.destroy()
        }), e.appendTo(document.body)
      }, b.prototype.layout = function() {
        this.$e.style({
          height: this.dataProvider.getSashHeight(this) + "px",
          top: this.dataProvider.getSashTop(this) + "px",
          left: this.dataProvider.getSashLeft(this) - this.$e.getTotalSize().width / 2 + "px"
        })
      }, b.prototype.show = function() {
        this.$e.show()
      }, b.prototype.hide = function() {
        this.$e.hide()
      }, b.prototype.dispose = function() {
        this.$e && (this.$e.destroy(), this.$e = null), a.prototype.dispose.call(this)
      }, b
    }(i.EventEmitter);
  b.Sash = l
})