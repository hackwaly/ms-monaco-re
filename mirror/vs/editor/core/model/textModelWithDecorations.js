define("vs/editor/core/model/textModelWithDecorations", ["require", "exports", "vs/editor/editor",
  "vs/editor/core/model/textModelWithTrackedRanges", "vs/editor/core/constants"
], function(e, t, n, i, o) {
  function r(e) {
    return e.replace(/[^a-z0-9\-]/gi, " ");
  }

  function s(e) {
    return {
      stickiness: e.stickiness || 0,
      className: r(e.className || ""),
      hoverMessage: e.hoverMessage || "",
      htmlMessage: e.htmlMessage || [],
      isWholeLine: e.isWholeLine || !1,
      overviewRuler: a(e.overviewRuler, e.showInOverviewRuler),
      glyphMarginClassName: r(e.glyphMarginClassName || ""),
      linesDecorationsClassName: r(e.linesDecorationsClassName || ""),
      inlineClassName: r(e.inlineClassName || "")
    };
  }

  function a(e, t) {
    "undefined" == typeof t && (t = null);
    var n = {
      color: "",
      position: 2
    };
    t && (n.color = t);

    e && e.color && (n.color = e.color);

    e && e.hasOwnProperty("position") && (n.position = e.position);

    return n;
  }

  function u(e, t) {
    var n = [t.stickiness, e.startLineNumber.toString(), e.startColumn.toString(), e.endLineNumber.toString(), e.endColumn
      .toString(), t.className, t.hoverMessage, t.htmlMessage.reduce(function(e, t) {
        return e + l(t);
      }, ""), t.isWholeLine + "", t.overviewRuler.color, t.overviewRuler.position, t.glyphMarginClassName, t.linesDecorationsClassName,
      t.inlineClassName
    ];
    return n.join("-");
  }

  function l(e) {
    var t = [e.tagName, e.text, e.className];
    e.children && e.children.forEach(function(e, n) {
      t.push("child" + n + "-" + l(e));
    });

    return t.join("-");
  }
  var c = function() {
    function e() {
      this.changedMarkers = {};

      this.oldDecorationRange = {};

      this.oldDecorationOptions = {};

      this.newOrChangedDecorations = {};

      this.removedDecorations = {};
    }
    e.prototype.addNewDecoration = function(e) {
      this.newOrChangedDecorations[e] = !0;
    };

    e.prototype.addRemovedDecoration = function(e, t, n, i) {
      this.newOrChangedDecorations.hasOwnProperty(e) && delete this.newOrChangedDecorations[e];

      this.oldDecorationRange.hasOwnProperty(e) || (this.oldDecorationRange[e] = n);

      this.oldDecorationOptions.hasOwnProperty(e) || (this.oldDecorationOptions[e] = i);

      this.removedDecorations[e] = !0;
    };

    e.prototype.addMovedDecoration = function(e, t) {
      this.oldDecorationRange.hasOwnProperty(e) || (this.oldDecorationRange[e] = t);

      this.newOrChangedDecorations[e] = !0;
    };

    e.prototype.addUpdatedDecoration = function(e, t) {
      this.oldDecorationOptions.hasOwnProperty(e) || (this.oldDecorationOptions[e] = t);

      this.newOrChangedDecorations[e] = !0;
    };

    return e;
  }();
  t.DeferredEventsBuilder = c;
  var d = function(e) {
    function t(t, n, i) {
      t.push(o.EventType.ModelDecorationsChanged);

      e.call(this, t, n, i);

      this.lastDecorationId = 0;

      this.decorations = {};

      this.rangeIdToDecorationId = {};

      this._currentDeferredEvents = null;
    }
    __extends(t, e);

    t.prototype.dispose = function() {
      this.decorations = null;

      this.rangeIdToDecorationId = null;

      e.prototype.dispose.call(this);
    };

    t.prototype._reset = function(t, n) {
      this.decorations = {};

      this.rangeIdToDecorationId = {};

      return e.prototype._reset.call(this, t, n);
    };

    t.prototype.changeDecorations = function(e, t) {
      "undefined" == typeof t && (t = 0);
      var n = this;
      return this._withDeferredEvents(function(i) {
        var o = {
          addDecoration: function(e, o) {
            return n._addDecorationImpl(i, t, e, o);
          },
          changeDecoration: function(e, t) {
            n._changeDecorationImpl(i, e, t);
          },
          changeDecorationOptions: function(e, t) {
            n._changeDecorationOptionsImpl(i, e, t);
          },
          removeDecoration: function(e) {
            n._removeDecorationImpl(i, e);
          },
          deltaDecorations: function(e, o) {
            return n._deltaDecorationsImpl(i, t, e, o);
          }
        };

        var r = e(o);
        o.addDecoration = null;

        o.changeDecoration = null;

        o.removeDecoration = null;

        o.deltaDecorations = null;

        return r;
      });
    };

    t.prototype.deltaDecorations = function(e, t, n) {
      "undefined" == typeof n && (n = 0);

      e || (e = []);

      return this.changeDecorations(function(n) {
        return n.deltaDecorations(e, t);
      }, n);
    };

    t.prototype.removeAllDecorationsWithOwnerId = function(e) {
      var t;

      var n;

      var i = [];
      for (t in this.decorations) this.decorations.hasOwnProperty(t) && (n = this.decorations[t], n.ownerId === e &&
        i.push(n.id));
      for (var o = 0; o < i.length; o++) this._removeDecorationImpl(null, i[o]);
    };

    t.prototype.getDecorationOptions = function(e) {
      return this.decorations.hasOwnProperty(e) ? this.decorations[e].options : null;
    };

    t.prototype.getDecorationRange = function(e) {
      if (this.decorations.hasOwnProperty(e)) {
        var t = this.decorations[e];
        return this.getTrackedRange(t.rangeId);
      }
      return null;
    };

    t.prototype.getLineDecorations = function(e, t, n) {
      "undefined" == typeof t && (t = 0);

      "undefined" == typeof n && (n = !1);

      return this.getLinesDecorations(e, e, t, n);
    };

    t.prototype._getDecorationsInRange = function(e, t, n, i, r, s) {
      var a;

      var u;

      var l;

      var c;

      var d = [];

      var h = this.getLinesTrackedRanges(e, n);
      for (u = 0, c = h.length; c > u; u++)
        if (l = h[u], this.rangeIdToDecorationId.hasOwnProperty(l.id)) {
          if (a = this.decorations[this.rangeIdToDecorationId[l.id]], r && a.ownerId && a.ownerId !== r) continue;
          if (s && (a.options.className === o.ClassName.EditorErrorDecoration || a.options.className === o.ClassName.EditorWarningDecoration))
            continue;
          if (l.range.startLineNumber === e && l.range.endColumn < t) continue;
          if (l.range.endLineNumber === n && l.range.startColumn > i) continue;
          d.push({
            id: a.id,
            ownerId: a.ownerId,
            range: l.range,
            options: a.options
          });
        }
      return d;
    };

    t.prototype.getLinesDecorations = function(e, t, n, i) {
      "undefined" == typeof n && (n = 0);

      "undefined" == typeof i && (i = !1);

      return this._getDecorationsInRange(e, 1, t, Number.MAX_VALUE, n, i);
    };

    t.prototype.getDecorationsInRange = function(e, t, n) {
      var i = this.validateRange(e);
      return this._getDecorationsInRange(i.startLineNumber, i.startColumn, i.endLineNumber, i.endColumn, t, n);
    };

    t.prototype.getAllDecorations = function(e, t) {
      "undefined" == typeof e && (e = 0);

      "undefined" == typeof t && (t = !1);
      var n;

      var i;

      var r = [];
      for (n in this.decorations)
        if (this.decorations.hasOwnProperty(n)) {
          if (i = this.decorations[n], e && i.ownerId && i.ownerId !== e) continue;
          if (t && (i.options.className === o.ClassName.EditorErrorDecoration || i.options.className === o.ClassName.EditorWarningDecoration))
            continue;
          r.push({
            id: i.id,
            ownerId: i.ownerId,
            range: this.getTrackedRange(i.rangeId),
            options: i.options
          });
        }
      return r;
    };

    t.prototype._withDeferredEvents = function(e) {
      var t = this;
      return this.deferredEmit(function() {
        var n = t._currentDeferredEvents ? !1 : !0;
        n && (t._currentDeferredEvents = new c);
        try {
          var i = e(t._currentDeferredEvents);
          n && t._handleCollectedEvents(t._currentDeferredEvents);
        } finally {
          n && (t._currentDeferredEvents = null);
        }
        return i;
      });
    };

    t.prototype._handleCollectedEvents = function(e) {
      var t = this._getMarkersInMap(e.changedMarkers);

      var n = this._onChangedMarkers(t);
      this._onChangedRanges(e, n);

      this._handleCollectedDecorationsEvents(e);
      for (var i = 0, o = t.length; o > i; i++) t[i].oldLineNumber = 0;

      t[i].oldColumn = 0;
    };

    t.prototype._onChangedRanges = function(e, t) {
      var n;

      var i;
      for (n in t) t.hasOwnProperty(n) && this.rangeIdToDecorationId.hasOwnProperty(n) && (i = this.rangeIdToDecorationId[
        n], e.addMovedDecoration(i, t[n]));
    };

    t.prototype._handleCollectedDecorationsEvents = function(e) {
      var t;

      var n;

      var i;

      var r = [];

      var s = [];

      var a = [];
      for (t in e.newOrChangedDecorations) e.newOrChangedDecorations.hasOwnProperty(t) && (a.push(t), n = this._getDecorationData(
          t), n.isForValidation = n.options.className === o.ClassName.EditorErrorDecoration || n.options.className ===
        o.ClassName.EditorWarningDecoration, r.push(n), e.oldDecorationRange.hasOwnProperty(t) && (i = e.oldDecorationRange[
            t], i.startLineNumber = i.startLineNumber || n.range.startLineNumber, i.startColumn = i.startColumn || n.range
          .startColumn, i.endLineNumber = i.endLineNumber || n.range.endLineNumber, i.endColumn = i.endColumn || n.range
          .endColumn));
      for (t in e.removedDecorations) e.removedDecorations.hasOwnProperty(t) && (a.push(t), s.push(t));
      if (a.length > 0) {
        var u = {
          ids: a,
          addedOrChangedDecorations: r,
          removedDecorations: s,
          oldOptions: e.oldDecorationOptions,
          oldRanges: e.oldDecorationRange
        };
        this.emitModelDecorationsChangedEvent(u);
      }
    };

    t.prototype._getDecorationData = function(e) {
      var t = this.decorations[e];
      return {
        id: t.id,
        ownerId: t.ownerId,
        range: this.getTrackedRange(t.rangeId),
        isForValidation: !1,
        options: t.options
      };
    };

    t.prototype.emitModelDecorationsChangedEvent = function(e) {
      this.emit(o.EventType.ModelDecorationsChanged, e);
    };

    t.prototype._addDecorationImpl = function(e, t, n, i) {
      i = s(i);
      var o = this.addTrackedRange(n, i.stickiness);

      var r = {
        ownerId: t,
        id: (++this.lastDecorationId).toString(),
        rangeId: o,
        options: i
      };
      this.decorations[r.id] = r;

      this.rangeIdToDecorationId[o] = r.id;

      e.addNewDecoration(r.id);

      return r.id;
    };

    t.prototype._changeDecorationImpl = function(e, t, n) {
      if (this.decorations.hasOwnProperty(t)) {
        var i = this.decorations[t];

        var o = this.getTrackedRange(i.rangeId);
        this.changeTrackedRange(i.rangeId, n);

        e.addMovedDecoration(t, o);
      }
    };

    t.prototype._changeDecorationOptionsImpl = function(e, t, n) {
      if (n = s(n), this.decorations.hasOwnProperty(t)) {
        var i = this.decorations[t];

        var o = i.options;
        o.stickiness !== n.stickiness && this.changeTrackedRangeStickiness(i.rangeId, n.stickiness);

        i.options = n;

        e.addUpdatedDecoration(t, o);
      }
    };

    t.prototype._removeDecorationImpl = function(e, t) {
      if (this.decorations.hasOwnProperty(t)) {
        var n = this.decorations[t];

        var i = null;
        e && (i = this.getTrackedRange(n.rangeId));

        this.removeTrackedRange(n.rangeId);

        delete this.rangeIdToDecorationId[n.rangeId];

        delete this.decorations[t];

        e && e.addRemovedDecoration(t, n.ownerId, i, n.options);
      }
    };

    t.prototype._deltaDecorationsImpl = function(e, t, n, i) {
      var o;

      var r;

      var a = [];

      var u = [];
      for (o = 0, r = i.length; r > o; o++) a[o] = s(i[o].options);

      u[o] = this.validateRange(i[o].range);
      return this._deltaImpl(e, t, n, r, u, a);
    };

    t.prototype._deltaImpl = function(e, t, n, i, o, r) {
      var s;

      var a;

      var l;

      var c;

      var d = {};
      for (s = 0, a = n.length; a > s; s++) this.decorations.hasOwnProperty(n[s]) && (c = this.decorations[n[s]], l =
        u(this.getTrackedRange(c.rangeId), c.options), d[l] = d[l] || [], d[l].push(n[s]));
      var h;

      var p;

      var f;

      var g;

      var m = [];

      var v = {};
      for (s = 0; i > s; s++) {
        if (l = u(o[s], r[s]), g = !1, d.hasOwnProperty(l))
          for (f = d[l], h = 0, p = f.length; p > h; h++)
            if (!v.hasOwnProperty(f[h])) {
              g = !0;

              v[f[h]] = !0;

              m.push(f[h]);
              break;
            }
        g || m.push(this._addDecorationImpl(e, t, o[s], r[s]));
      }
      for (s = 0, a = n.length; a > s; s++) v.hasOwnProperty(n[s]) || this._removeDecorationImpl(e, n[s]);
      return m;
    };

    return t;
  }(i.TextModelWithTrackedRanges);
  t.TextModelWithDecorations = d;
});