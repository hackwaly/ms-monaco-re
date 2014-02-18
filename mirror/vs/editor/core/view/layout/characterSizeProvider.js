define(["require", "exports", "vs/base/env"], function(a, b, c) {
  var d = c;

  var e = function() {
    function a(b) {
      this.configuration = b;

      this.charactersToMeasure = a.USUAL_CHARS;

      this.defaultCharWidth = 7.69921875;

      this.charWidths = {};
      var c = this._configurationHash();
      if (a.CHAR_MEASUREMENTS_CACHE.hasOwnProperty(c)) {
        this.charWidths = a.CHAR_MEASUREMENTS_CACHE[c];
        this.defaultCharWidth = this.charWidths[a.REFERENCE_CHARACTER];
      } else {
        if (!d.isTesting()) {
          this.doMeasurements();
        }
      }
    }
    a.prototype.doMeasurements = function() {
      var a = this._measureCharSizePart2(this._measureCharSizePart1());
      return a;
    };

    a.prototype.getCharWidth = function(a) {
      return this.charWidths.hasOwnProperty(a) ? this.charWidths[a] : this.defaultCharWidth;
    };

    a.prototype._configurationHash = function() {
      return this.configuration.editor.font;
    };

    a.prototype.maxDigitWidth = function() {
      var a = 0;
      for (var b = 0; b <= 9; b++) {
        a = Math.max(a, this.getCharWidth(b.toString()));
      }
      return a;
    };

    a.prototype._testElementId = function(a) {
      return "editorSizeProvider" + a;
    };

    a.prototype._createTestElement = function(a, b) {
      var c = document.createElement("span");
      c.id = this._testElementId(a);
      var d = b === " " ? "&nbsp;" : b;
      for (var e = 0; e < 8; e++) {
        d += d;
      }
      c.textContent = d;

      return c;
    };

    a.prototype._measureTestElementWidth = function(a) {
      return document.getElementById(this._testElementId(a)).offsetWidth / 256;
    };

    a.prototype._measureTestElementHeight = function(a) {
      return document.getElementById(this._testElementId(a)).offsetHeight;
    };

    a.prototype._createTestElements = function() {
      var a = document.createElement("div");
      a.className = this.configuration.getEditorClassName();

      a.style.width = "50000px";
      for (var b = 0, c = this.charactersToMeasure.length; b < c; b++) {
        a.appendChild(document.createElement("br"));
        a.appendChild(this._createTestElement(b, this.charactersToMeasure[b]));
      }
      return a;
    };

    a.prototype._measureCharSizePart1 = function() {
      var a = this._createTestElements();
      document.body.appendChild(a);

      return a;
    };

    a.prototype._measureCharSizePart2 = function(b) {
      var c;

      var d;

      var e;

      var f = !1;

      var g;

      var h;
      for (c = 0, d = this.charactersToMeasure.length; c < d; c++) {
        e = this.charactersToMeasure[c];
        g = this.charWidths.hasOwnProperty(e) ? this.charWidths[e] : 0;
        h = this._measureTestElementWidth(c);
        if (g !== h) {
          this.charWidths[e] = h;
          f = !0;
        }
      }
      document.body.removeChild(b);

      f && (a.CHAR_MEASUREMENTS_CACHE[this._configurationHash()] = this.charWidths, this.defaultCharWidth = this.charWidths[
        a.REFERENCE_CHARACTER]);

      return f;
    };

    a.USUAL_CHARS = "1234567890";

    a.REFERENCE_CHARACTER = "0";

    a.CHAR_MEASUREMENTS_CACHE = {};

    return a;
  }();
  b.CharacterSizeProvider = e;
});