define('vs/editor/core/config/elementSizeObserver', [
  'require',
  'exports'
], function(e, t) {
  var n = function() {
    function e(e, t) {
      this.referenceDomElement = e, this.changeCallback = t, this.measureReferenceDomElementToken = -1, this.width = -
        1, this.height = -1, this.measureReferenceDomElement(!1);
    }
    return e.prototype.getWidth = function() {
      return this.width;
    }, e.prototype.getHeight = function() {
      return this.height;
    }, e.prototype.dispose = function() {
      this.stopObserving();
    }, e.prototype.startObserving = function() {
      var e = this; - 1 === this.measureReferenceDomElementToken && (this.measureReferenceDomElementToken = window.setInterval(
        function() {
          return e.measureReferenceDomElement(!0);
        }, 100));
    }, e.prototype.stopObserving = function() {
      -1 !== this.measureReferenceDomElementToken && (window.clearInterval(this.measureReferenceDomElementToken),
        this.measureReferenceDomElementToken = -1);
    }, e.prototype.observe = function() {
      this.measureReferenceDomElement(!0);
    }, e.prototype.measureReferenceDomElement = function(e) {
      var t = Math.max(5, this.referenceDomElement ? this.referenceDomElement.clientWidth : 0),
        n = Math.max(5, this.referenceDomElement ? this.referenceDomElement.clientHeight : 0);
      (this.width !== t || this.height !== n) && (this.width = t, this.height = n, e && this.changeCallback());
    }, e;
  }();
  t.ElementSizeObserver = n;
})