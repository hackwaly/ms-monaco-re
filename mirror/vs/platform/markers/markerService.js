define("vs/platform/markers/markerService", ["require", "exports", "vs/platform/services", "vs/base/eventEmitter",
  "./markers"
], function(e, t, n, i, o) {
  var r = function(e) {
    function t() {
      e.call(this);

      this._markerSets = {};
    }
    __extends(t, e);

    t.prototype.getMarkerSet = function(e) {
      var t = this._markerSets[e.toExternal()];
      return "undefined" == typeof t ? null : t;
    };

    t.prototype.change = function(e) {
      var t = [];

      var i = this;

      var o = {
        replaceMarkerSet: function(e) {
          t.push(i.__replaceMarkerSet(e));
        },
        deleteMarkerSet: function(e) {
          var n = i.__deleteMarkerSet(e);
          null !== n && t.push(n);
        },
        processMarkerUpdate: function(e) {
          var n = i.__processMarkerUpdate(e);
          null !== n && t.push(n);
        }
      };
      e(o);

      this.emit(n.MarkerServiceConstants.SERVICE_CHANGED, {
        kind: n.MarkerServiceConstants.SERVICE_CHANGED,
        source: this,
        markerSetEvents: t
      });
    };

    t.prototype.__deleteMarkerSet = function(e) {
      var t = e.toExternal();

      var i = this._markerSets[t];
      return "undefined" == typeof i ? null : (delete this._markerSets[t], {
        kind: n.MarkerServiceConstants.SET_REMOVED,
        resource: e,
        oldValue: i,
        newValue: null
      });
    };

    t.prototype.__replaceMarkerSet = function(e) {
      var t = e.getAssociatedResource().toExternal();

      var i = this._markerSets[t];
      this._markerSets[t] = e;

      return i ? {
        kind: n.MarkerServiceConstants.SET_CHANGED,
        resource: e.getAssociatedResource(),
        oldValue: i,
        newValue: e
      } : {
        kind: n.MarkerServiceConstants.SET_ADDED,
        resource: e.getAssociatedResource(),
        oldValue: null,
        newValue: e
      };
    };

    t.prototype.__processMarkerUpdate = function(e) {
      var t = e.getAssociatedResource().toExternal();

      var i = this._markerSets[t];

      var r = null;
      return i ? (r = o.processMarkerUpdate(e, i), i === r ? {
        kind: n.MarkerServiceConstants.SET_CHANGED,
        resource: i.getAssociatedResource(),
        oldValue: i,
        newValue: r,
        groupDetails: {
          groupId: e.getId()
        }
      } : (this._markerSets[t] = r, {
        kind: n.MarkerServiceConstants.SET_CHANGED,
        resource: i.getAssociatedResource(),
        oldValue: i,
        newValue: r
      })) : (r = o.processMarkerUpdate(e, null), this._markerSets[t] = r, {
        kind: n.MarkerServiceConstants.SET_ADDED,
        resource: r.getAssociatedResource(),
        oldValue: null,
        newValue: r
      });
    };

    return t;
  }(i.EventEmitter);
  t.MarkerService = r;
});