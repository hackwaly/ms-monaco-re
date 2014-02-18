define(["require", "exports", "vs/editor/core/range"], function(a, b, c) {
  var d = c;

  var e = function() {
    function a(a) {
      this.model = a;

      this.lastRangeId = 0;

      this.ranges = {};

      this.markerIdToRangeId = {};

      this.multiLineTrackedRanges = {};
    }
    a.prototype.clear = function() {
      this.ranges = {};

      this.markerIdToRangeId = {};

      this.multiLineTrackedRanges = {};
    };

    a.prototype._setRangeIsMultiLine = function(a, b) {
      var c = this.multiLineTrackedRanges.hasOwnProperty(a);
      if (!c && b) {
        this.multiLineTrackedRanges[a] = !0;
      } else {
        if (c && !b) {
          delete this.multiLineTrackedRanges[a];
        }
      }
    };

    a.prototype.add = function(a) {
      a = this.model.validateRange(a);
      var b = this.model._addMarker(a.startLineNumber - 1, a.startColumn, "start");

      var c = this.model._addMarker(a.endLineNumber - 1, a.endColumn, "end");

      var d = {
        id: (++this.lastRangeId).toString(),
        startMarkerId: b,
        endMarkerId: c
      };
      this.ranges[d.id] = d;

      this.markerIdToRangeId[b] = d.id;

      this.markerIdToRangeId[c] = d.id;

      this._setRangeIsMultiLine(d.id, a.startLineNumber !== a.endLineNumber);

      return d.id;
    };

    a.prototype.change = function(a, b) {
      if (this.ranges.hasOwnProperty(a)) {
        b = this.model.validateRange(b);
        var c = this.ranges[a];
        this.model._changeMarker(c.startMarkerId, b.startLineNumber - 1, b.startColumn);

        this.model._changeMarker(c.endMarkerId, b.endLineNumber - 1, b.endColumn);

        this._setRangeIsMultiLine(c.id, b.startLineNumber !== b.endLineNumber);
      }
    };

    a.prototype.remove = function(a) {
      if (this.ranges.hasOwnProperty(a)) {
        var b = this.ranges[a];
        this.model._removeMarker(b.startMarkerId);

        this.model._removeMarker(b.endMarkerId);

        this._setRangeIsMultiLine(b.id, !1);

        delete this.ranges[b.id];

        delete this.markerIdToRangeId[b.startMarkerId];

        delete this.markerIdToRangeId[b.endMarkerId];
      }
    };

    a.prototype.onChangedMarkers = function(a) {
      var b = {};

      var c;

      var d;

      var e;

      var f;
      for (var g in a) {
        if (a.hasOwnProperty(g.toString()) && this.markerIdToRangeId.hasOwnProperty(g.toString())) {
          f = a[g];
          e = this.markerIdToRangeId[g];
          d = this.ranges[e];
          if (b.hasOwnProperty(d.id)) {
            c = b[d.id];
          } else {
            c = {
              startLineNumber: 0,
              startColumn: 0,
              endLineNumber: 0,
              endColumn: 0
            };
            b[d.id] = c;
          }
          if (f.id === d.startMarkerId) {
            c.startLineNumber = f.oldLineIndex + 1;
            c.startColumn = f.oldColumn;
          } else {
            c.endLineNumber = f.oldLineIndex + 1;
            c.endColumn = f.oldColumn;
          }
          this._setRangeIsMultiLine(d.id, this.model._getMarkerLineNumber(d.startMarkerId) !== this.model._getMarkerLineNumber(
            d.endMarkerId));
        }
      }
      return b;
    };

    a.prototype._getMultiLineTrackedRanges = function(a, b) {
      var c = {};

      var d;

      var e;

      var f;

      var g;

      var h;

      var i;
      for (d in this.multiLineTrackedRanges)
        if (this.multiLineTrackedRanges.hasOwnProperty(d)) {
          e = this.ranges[d];

          f = this.model._getMarkerLineNumber(e.startMarkerId);
          if (f > b) continue;
          h = this.model._getMarkerLineNumber(e.endMarkerId);
          if (h < a) continue;
          g = this.model._getMarkerColumn(f, e.startMarkerId);

          i = this.model._getMarkerColumn(h, e.endMarkerId);

          c[e.id] = {
            startLineNumber: f,
            startColumn: g,
            endLineNumber: h,
            endColumn: i
          };
        }
      return c;
    };

    a.prototype.getLinesTrackedRanges = function(a, b) {
      var c = this._getMultiLineTrackedRanges(a, b);

      var d;

      var e;

      var f;

      var g;

      var h;

      var i;
      for (i = a; i <= b; i++) {
        d = this.model._getLineMarkers(i);
        for (g = 0, h = d.length; g < h; g++) {
          e = d[g];
          if (this.markerIdToRangeId.hasOwnProperty(e.id)) {
            f = this.markerIdToRangeId[e.id];
            if (this.ranges[f].startMarkerId === e.id) {
              if (c.hasOwnProperty(f)) {
                c[f].startColumn = e.column;
              } else {
                c[f] = {
                  startLineNumber: i,
                  startColumn: e.column,
                  endLineNumber: i,
                  endColumn: -1
                };
              }
            } else {
              if (c.hasOwnProperty(f)) {
                c[f].endColumn = e.column;
              } else {
                c[f] = {
                  startLineNumber: i,
                  startColumn: -1,
                  endLineNumber: i,
                  endColumn: e.column
                };
              }
            }
          }
        }
      }
      return c;
    };

    a.prototype.getStartLineNumber = function(a) {
      return this.model._getMarkerLineNumber(this.ranges[a].startMarkerId);
    };

    a.prototype.getEndLineNumber = function(a) {
      return this.model._getMarkerLineNumber(this.ranges[a].endMarkerId);
    };

    a.prototype.getRange = function(a) {
      var b = this.ranges[a];

      var c = this.model._getMarker(b.startMarkerId);

      var e = this.model._getMarker(b.endMarkerId);
      return new d.Range(c.lineNumber, c.column, e.lineNumber, e.column);
    };

    return a;
  }();
  b.TrackedRanges = e;
});