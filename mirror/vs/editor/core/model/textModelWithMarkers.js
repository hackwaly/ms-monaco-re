define("vs/editor/core/model/textModelWithMarkers", ["require", "exports", "vs/editor/core/model/textModelWithTokens",
  "vs/editor/core/position"
], function(e, t, n, i) {
  var o = function(e) {
    function t(t, n, i) {
      e.call(this, t, n, i);

      this._lastMarkerId = 0;

      this._markerIdToMarker = {};
    }
    __extends(t, e);

    t.prototype.dispose = function() {
      this._markerIdToMarker = null;

      e.prototype.dispose.call(this);
    };

    t.prototype._reset = function(t, n) {
      this._markerIdToMarker = {};

      return e.prototype._reset.call(this, t, n);
    };

    t.prototype._addMarker = function(e, t, n) {
      var o = this.validatePosition(new i.Position(e, t));

      var r = {
        id: (++this._lastMarkerId).toString(),
        column: o.column,
        stickToPreviousCharacter: n,
        oldLineNumber: 0,
        oldColumn: 0,
        line: null
      };
      this._markerIdToMarker[r.id] = r;

      this._lines[o.lineNumber - 1].addMarker(r);

      return r.id;
    };

    t.prototype._changeMarker = function(e, t, n) {
      if (this._markerIdToMarker.hasOwnProperty(e)) {
        var o = this._markerIdToMarker[e];

        var r = this.validatePosition(new i.Position(t, n));
        r.lineNumber !== o.line.lineNumber && (o.line.removeMarker(o), this._lines[r.lineNumber - 1].addMarker(o));

        o.column = r.column;
      }
    };

    t.prototype._changeMarkerStickiness = function(e, t) {
      if (this._markerIdToMarker.hasOwnProperty(e)) {
        var n = this._markerIdToMarker[e];
        n.stickToPreviousCharacter !== t && (n.stickToPreviousCharacter = t);
      }
    };

    t.prototype._getMarker = function(e) {
      if (this._markerIdToMarker.hasOwnProperty(e)) {
        var t = this._markerIdToMarker[e];
        return new i.Position(t.line.lineNumber, t.column);
      }
      return null;
    };

    t.prototype._getLineMarkers = function(e) {
      return this._lines[e - 1].markers.slice(0);
    };

    t.prototype._removeMarker = function(e) {
      if (this._markerIdToMarker.hasOwnProperty(e)) {
        var t = this._markerIdToMarker[e];
        t.line.removeMarker(t);

        delete this._markerIdToMarker[e];
      }
    };

    t.prototype._getMarkersInMap = function(e) {
      var t;

      var n = [];
      for (t in e) {
        e.hasOwnProperty(t) && this._markerIdToMarker.hasOwnProperty(t) && n.push(this._markerIdToMarker[t]);
      }
      return n;
    };

    return t;
  }(n.TextModelWithTokens);
  t.TextModelWithMarkers = o;
});