define(["require", "exports"], function(a, b) {
  var c = function() {
    function a(a, b) {
      this.referenceDomElement = a;

      this.changeCallback = b;

      this.measureReferenceDomElementToken = -1;

      this.width = -1;

      this.height = -1;

      this.measureReferenceDomElement();
    }
    a.prototype.dispose = function() {
      this.stopObserving();
    };

    a.prototype.startObserving = function() {
      var a = this;
      if (this.measureReferenceDomElementToken === -1) {
        this.measureReferenceDomElementToken = window.setInterval(function() {
          return a.measureReferenceDomElement();
        }, 100);
      }
    };

    a.prototype.stopObserving = function() {
      if (this.measureReferenceDomElementToken !== -1) {
        window.clearInterval(this.measureReferenceDomElementToken);
        this.measureReferenceDomElementToken = -1;
      }
    };

    a.prototype.observe = function() {
      this.measureReferenceDomElement();
    };

    a.prototype.measureReferenceDomElement = function() {
      var a = Math.max(5, this.referenceDomElement.clientWidth);

      var b = Math.max(5, this.referenceDomElement.clientHeight);
      if (this.width !== a || this.height !== b) {
        this.width = a;
        this.height = b;
        this.changeCallback(this.width, this.height);
      }
    };

    a.prototype.getReferenceElementWidth = function() {
      return;
    };

    return a;
  }();
  b.ElementSizeObserver = c;
});