define(["require", "exports", "./dom"], function(a, b, c) {
  function f(a) {
    if (a[a.length - 1] === "%") throw new Error("Relative dimensions not supported");
    return parseInt(a, 10);
  }
  var d = c;

  var e = function() {
    function a() {
      this.measurements = [];
    }
    a.prototype.measure = function(a) {
      var b = this;
      this.measurements = [];
      var c = {
        create: function(a, b, c) {
          var d = document.createElement(a);
          d.className = b;

          d.textContent = c;

          return d;
        },
        measure: function(a, c) {
          b.measurements.push({
            domNode: a,
            measureFunc: c,
            container: null
          });
        }
      };
      a(c);

      this._doMeasurements();
    };

    a.prototype._doMeasurements = function() {
      var a;

      var b = this.measurements.length;

      var c;
      for (a = 0; a < b; a++) {
        c = this.measurements[a];
        c.container = document.createElement("div");
        c.container.style.position = "absolute";
        c.container.style.top = "-5000px";
        c.container.appendChild(c.domNode);
      }
      for (a = 0; a < b; a++) {
        document.body.appendChild(this.measurements[a].container);
      }
      for (a = 0; a < b; a++) {
        c = this.measurements[a];
        try {
          c.measureFunc(c.domNode, d.getComputedStyle(c.domNode));
        } catch (e) {
          console.error("Measurement failed");

          console.error(e);
        }
      }
      for (a = 0; a < b; a++) {
        document.body.removeChild(this.measurements[a].container);
      }
    };

    return a;
  }();
  b.MeasurementHelper = e;
  var g = function() {
    function a(a) {
      this._computedStyle = d.getComputedStyle(a);

      this._dimensions = {
        width: this._computedStyle.getPropertyValue("width"),
        height: this._computedStyle.getPropertyValue("height")
      };

      this._margin = {
        top: this._computedStyle.getPropertyValue("margin-top"),
        bottom: this._computedStyle.getPropertyValue("margin-bottom"),
        left: this._computedStyle.getPropertyValue("margin-left"),
        right: this._computedStyle.getPropertyValue("margin-right")
      };

      this._padding = {
        top: this._computedStyle.getPropertyValue("padding-top"),
        bottom: this._computedStyle.getPropertyValue("padding-bottom"),
        left: this._computedStyle.getPropertyValue("padding-left"),
        right: this._computedStyle.getPropertyValue("padding-right")
      };

      this._border = {
        top: this._computedStyle.getPropertyValue("border-top-width"),
        bottom: this._computedStyle.getPropertyValue("border-bottom-width"),
        left: this._computedStyle.getPropertyValue("border-left-width"),
        right: this._computedStyle.getPropertyValue("border-right-width")
      };
    }
    a.prototype.getComputedStyle = function() {
      return this._computedStyle;
    };

    a.prototype.getDimensions = function() {
      return this._dimensions;
    };

    a.prototype.getMargin = function() {
      return this._margin;
    };

    a.prototype.getPadding = function() {
      return this._padding;
    };

    a.prototype.getBorder = function() {
      return this._border;
    };

    a.prototype.getTotalWidth = function() {
      return f(this._margin.left) + f(this._border.left) + f(this._padding.left) + f(this._dimensions.width) + f(this
        ._padding.right) + f(this._border.right) + f(this._margin.right);
    };

    a.prototype.getTotalHeight = function() {
      return f(this._margin.top) + f(this._border.top) + f(this._padding.top) + f(this._dimensions.height) + f(this._padding
        .bottom) + f(this._border.bottom) + f(this._margin.bottom);
    };

    return a;
  }();
  b.ComputedDimensions = g;
});