define("vs/editor/core/model/textModelWithTrackedRanges", ["require", "exports", "vs/editor/editor",
  "vs/editor/core/model/textModelWithMarkers", "vs/editor/core/range"
], function(e, t, n, i, o) {
  var r = function(e) {
    function t(t, n, i) {
      e.call(this, t, n, i);

      this._lastRangeId = 0;

      this._ranges = {};

      this._markerIdToRangeId = {};

      this._multiLineTrackedRanges = {};
    }
    __extends(t, e);

    t.prototype.dispose = function() {
      this._ranges = null;

      this._markerIdToRangeId = null;

      this._multiLineTrackedRanges = null;

      e.prototype.dispose.call(this);
    };

    t.prototype._reset = function(t, n) {
      this._ranges = {};

      this._markerIdToRangeId = {};

      this._multiLineTrackedRanges = {};

      return e.prototype._reset.call(this, t, n);
    };

    t.prototype._setRangeIsMultiLine = function(e, t) {
      var n = this._multiLineTrackedRanges.hasOwnProperty(e);
      !n && t ? this._multiLineTrackedRanges[e] = !0 : n && !t && delete this._multiLineTrackedRanges[e];
    };

    t.prototype._shouldStartMarkerSticksToPreviousCharacter = function(e) {
      return 0 === e || 2 === e ? !0 : !1;
    };

    t.prototype._shouldEndMarkerSticksToPreviousCharacter = function(e) {
      return 1 === e || 2 === e ? !0 : !1;
    };

    t.prototype.addTrackedRange = function(e, t) {
      e = this.validateRange(e);
      var n = this._shouldStartMarkerSticksToPreviousCharacter(t);

      var i = this._shouldEndMarkerSticksToPreviousCharacter(t);

      var o = this._addMarker(e.startLineNumber, e.startColumn, n);

      var r = this._addMarker(e.endLineNumber, e.endColumn, i);

      var s = {
        id: (++this._lastRangeId).toString(),
        startMarkerId: o,
        endMarkerId: r
      };
      this._ranges[s.id] = s;

      this._markerIdToRangeId[o] = s.id;

      this._markerIdToRangeId[r] = s.id;

      this._setRangeIsMultiLine(s.id, e.startLineNumber !== e.endLineNumber);

      return s.id;
    };

    t.prototype.changeTrackedRange = function(e, t) {
      if (this._ranges.hasOwnProperty(e)) {
        t = this.validateRange(t);
        var n = this._ranges[e];
        this._changeMarker(n.startMarkerId, t.startLineNumber, t.startColumn);

        this._changeMarker(n.endMarkerId, t.endLineNumber, t.endColumn);

        this._setRangeIsMultiLine(n.id, t.startLineNumber !== t.endLineNumber);
      }
    };

    t.prototype.changeTrackedRangeStickiness = function(e, t) {
      if (this._ranges.hasOwnProperty(e)) {
        var n = this._ranges[e];
        this._changeMarkerStickiness(n.startMarkerId, this._shouldStartMarkerSticksToPreviousCharacter(t));

        this._changeMarkerStickiness(n.endMarkerId, this._shouldEndMarkerSticksToPreviousCharacter(t));
      }
    };

    t.prototype.removeTrackedRange = function(e) {
      if (this._ranges.hasOwnProperty(e)) {
        var t = this._ranges[e];
        this._removeMarker(t.startMarkerId);

        this._removeMarker(t.endMarkerId);

        this._setRangeIsMultiLine(t.id, !1);

        delete this._ranges[t.id];

        delete this._markerIdToRangeId[t.startMarkerId];

        delete this._markerIdToRangeId[t.endMarkerId];
      }
    };

    t.prototype._newEditorRange = function(e, t) {
      return t.isBefore(e) ? new o.Range(e.lineNumber, e.column, e.lineNumber, e.column) : new o.Range(e.lineNumber,
        e.column, t.lineNumber, t.column);
    };

    t.prototype.getTrackedRange = function(e) {
      var t = this._ranges[e];

      var n = this._getMarker(t.startMarkerId);

      var i = this._getMarker(t.endMarkerId);
      return this._newEditorRange(n, i);
    };

    t.prototype._getMultiLineTrackedRanges = function(e, t) {
      var n;

      var i;

      var o;

      var r;

      var s = [];
      for (n in this._multiLineTrackedRanges)
        if (this._multiLineTrackedRanges.hasOwnProperty(n)) {
          if (i = this._ranges[n], o = this._getMarker(i.startMarkerId), o.lineNumber > t) continue;
          if (r = this._getMarker(i.endMarkerId), r.lineNumber < e) continue;
          s.push({
            id: i.id,
            range: this._newEditorRange(o, r)
          });
        }
      return s;
    };

    t.prototype.getLinesTrackedRanges = function(e, t) {
      var n;

      var i;

      var o;

      var r;

      var s;

      var a;

      var u;

      var l;

      var c = this._getMultiLineTrackedRanges(e, t);

      var d = {};
      for (r = 0, s = c.length; s > r; r++) d[c[r].id] = !0;
      for (a = e; t >= a; a++)
        for (n = this._getLineMarkers(a), r = 0, s = n.length; s > r; r++) i = n[r];

      this._markerIdToRangeId.hasOwnProperty(i.id) && (o = this._markerIdToRangeId[i.id], d.hasOwnProperty(o) || (u =
        this._getMarker(this._ranges[o].startMarkerId), l = this._getMarker(this._ranges[o].endMarkerId), c.push({
          id: o,
          range: this._newEditorRange(u, l)
        }), d[o] = !0));
      return c;
    };

    t.prototype._onChangedMarkers = function(e) {
      var t;

      var n;

      var i;

      var o;

      var r;

      var s;

      var a = {};
      for (r = 0, s = e.length; s > r; r++) o = e[r];

      this._markerIdToRangeId.hasOwnProperty(o.id) && (i = this._markerIdToRangeId[o.id], n = this._ranges[i], a.hasOwnProperty(
          n.id) ? t = a[n.id] : (t = {
          startLineNumber: 0,
          startColumn: 0,
          endLineNumber: 0,
          endColumn: 0
        }, a[n.id] = t), o.id === n.startMarkerId ? (t.startLineNumber = o.oldLineNumber, t.startColumn = o.oldColumn) :
        (t.endLineNumber = o.oldLineNumber, t.endColumn = o.oldColumn), this._setRangeIsMultiLine(n.id, this._getMarker(
          n.startMarkerId).lineNumber !== this._getMarker(n.endMarkerId).lineNumber));
      return a;
    };

    return t;
  }(i.TextModelWithMarkers);
  t.TextModelWithTrackedRanges = r;
});