define("vs/editor/core/model/modelLine", ["require", "exports", "vs/editor/modes/modes", "vs/base/arrays"], function(e,
  t, n, i) {
  var o = function() {
    function e(e, t) {
      this.lineNumber = e;

      this.text = t;

      this.state = null;

      this.modeTransitions = null;

      this.isInvalid = !1;

      this.markers = [];

      this._recreateLineTokens(null);
    }
    e.prototype._recreateLineTokens = function(t) {
      0 === this.text.length ? t = e.DEFAULT_TOKENS_EMPTY_TEXT : t && 0 !== t.length || (t = e.DEFAULT_TOKENS_NON_EMPTY_TEXT);

      this.lineTokens = new r(t, this.text.length);
    };

    e.prototype.insertText = function(t, n, i, o) {
      var r = this.text;

      var s = r.length + 1;

      var a = this.lineTokens.getTokens();

      var u = i.text.length;
      n = Math.max(1, n);

      n = Math.min(n, s);
      var l;

      var c;
      if (u > 0) {
        var d = r.substring(0, n - 1) + i.text + r.substring(n - 1, r.length);
        if (a !== e.DEFAULT_TOKENS_NON_EMPTY_TEXT && a !== e.DEFAULT_TOKENS_EMPTY_TEXT) {
          var h;
          for (l = 0, c = a.length; c > l; l++) {
            h = a[l];
            if (h.startIndex >= n - 1 && h.startIndex > 0) {
              h.startIndex += u;
            }
          }
        }
        var p;
        for (l = 0, c = this.markers.length; c > l; l++) {
          p = this.markers[l];
          if (p.column > n || p.column === n && (o || !p.stickToPreviousCharacter)) {
            t[p.id] = !0;
            p.oldLineNumber = p.oldLineNumber || this.lineNumber;
            p.oldColumn = p.oldColumn || p.column;
            p.column += u;
          }
        }
        this.text = d;

        this._recreateLineTokens(a);
      }
      if (i.markers)
        for (l = 0, c = i.markers.length; c > l; l++) {
          p = i.markers[l];
          t[p.id] = !0;
          p.oldLineNumber = p.oldLineNumber || this.lineNumber;
          p.oldColumn = p.oldColumn || p.column;
          p.line = this;
          p.column += n - 1;
          this.markers.push(p);
        }
    };

    e.prototype.removeText = function(t, n, i, o, r) {
      var s = i;

      var a = "";

      var u = [];

      var l = this.text;

      var c = l.length + 1;

      var d = this.lineTokens.getTokens();
      n = Math.max(1, n);

      i = Math.max(1, i);

      n = Math.min(n, c);

      i = Math.min(i, c);
      var h;
      if (i > n && i > 1 && c > n) {
        a = l.substring(n - 1, i - 1);
        var p = l.substring(0, n - 1) + l.substring(i - 1, l.length);
        if (d !== e.DEFAULT_TOKENS_NON_EMPTY_TEXT && d !== e.DEFAULT_TOKENS_EMPTY_TEXT) {
          var f;

          var g;
          for (h = 0; h < d.length; h++) {
            var f = d[h].startIndex;

            var g = f;
            f >= i - 1 ? g = f - a.length : f >= n - 1 && (g = n - 1);

            g >= p.length ? (d.splice(h, 1), h--) : (d[h].startIndex = g, h > 0 && d[h - 1].startIndex >= g && (d.splice(
              h - 1, 1), h--));
          }
        }
        this.text = p;

        this._recreateLineTokens(d);
      }
      var m;
      for (h = 0; h < this.markers.length; h++) {
        m = this.markers[h];
        m.column > s || m.column === s && (r || !m.stickToPreviousCharacter) ? (t[m.id] = !0, m.oldLineNumber = m.oldLineNumber ||
          this.lineNumber, m.oldColumn = m.oldColumn || m.column, m.column -= a.length) : (m.column > n || m.column ===
          n && (r || !m.stickToPreviousCharacter)) && (t[m.id] = !0, m.oldLineNumber = m.oldLineNumber || this.lineNumber,
          m.oldColumn = m.oldColumn || m.column, o ? (m.line = null, m.column -= n - 1, this.markers.splice(h, 1), h--,
            u.push(m)) : m.column = n);
      }
      return {
        text: a,
        markers: u
      };
    };

    e.prototype.addMarker = function(e) {
      e.line = this;

      this.markers.push(e);
    };

    e.prototype.addMarkers = function(e) {
      var t;

      var n;
      for (t = 0, n = e.length; n > t; t++) {
        e[t].line = this;
      }
      this.markers = this.markers.concat(e);
    };

    e.prototype.removeMarker = function(e) {
      var t = this._indexOfMarkerId(e.id);
      if (t >= 0) {
        this.markers.splice(t, 1);
      }

      e.line = null;
    };

    e.prototype._indexOfMarkerId = function(e) {
      var t;

      var n;

      var i = this.markers;
      for (t = 0, n = i.length; n > t; t++)
        if (i[t].id === e) {
          return t;
        }
      return -1;
    };

    e.prototype.setTokens = function(e) {
      this._recreateLineTokens(e);
    };

    e.DEFAULT_TOKENS_NON_EMPTY_TEXT = [{
      startIndex: 0,
      type: "",
      bracket: 0
    }];

    e.DEFAULT_TOKENS_EMPTY_TEXT = [];

    return e;
  }();
  t.ModelLine = o;
  var r = function() {
    function e(e, t) {
      this.tokens = e;

      this.textLength = t;
    }
    e.prototype.getTokens = function() {
      return this.tokens;
    };

    e.prototype.getTextLength = function() {
      return this.textLength;
    };

    e.prototype.equals = function(e) {
      return this === e;
    };

    e.prototype.findIndexOfOffset = function(e) {
      return i.findIndexInSegmentsArray(this.tokens, e);
    };

    return e;
  }();
  t.LineTokens = r;
});