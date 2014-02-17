define("vs/base/ui/widgets/quickopen/quickOpenModel", ["require", "exports", "vs/base/types"], function(e, t, n) {
  ! function(e) {
    e[e.PREVIEW = 0] = "PREVIEW";

    e[e.OPEN = 1] = "OPEN";
  }(t.Mode || (t.Mode = {}));
  var i = (t.Mode, 0);

  var o = function() {
    function e() {
      this.id = (i++).toString();

      this.highlights = [];
    }
    e.prototype.getId = function() {
      return this.id;
    };

    e.prototype.getLabel = function() {
      return null;
    };

    e.prototype.getMeta = function() {
      return null;
    };

    e.prototype.getIcon = function() {
      return null;
    };

    e.prototype.getDescription = function() {
      return null;
    };

    e.prototype.getPath = function() {
      return null;
    };

    e.prototype.setHighlights = function(e) {
      this.highlights = e;
    };

    e.prototype.getHighlights = function() {
      return this.highlights;
    };

    e.prototype.run = function() {
      return !1;
    };

    return e;
  }();
  t.QuickOpenEntry = o;
  var r = function(e) {
    function t() {
      e.apply(this, arguments);
    }
    __extends(t, e);

    t.prototype.getHeight = function() {
      return 0;
    };

    t.prototype.render = function() {
      return null;
    };

    return t;
  }(o);
  t.QuickOpenEntryItem = r;
  var s = function(e) {
    function t(t, n, i) {
      e.call(this);

      this.entry = t;

      this.groupLabel = n;

      this.withBorder = i;
    }
    __extends(t, e);

    t.prototype.getGroupLabel = function() {
      return this.groupLabel;
    };

    t.prototype.setGroupLabel = function(e) {
      this.groupLabel = e;
    };

    t.prototype.showBorder = function() {
      return this.withBorder;
    };

    t.prototype.setShowBorder = function(e) {
      this.withBorder = e;
    };

    t.prototype.getLabel = function() {
      return this.entry ? this.entry.getLabel() : e.prototype.getLabel.call(this);
    };

    t.prototype.getMeta = function() {
      return this.entry ? this.entry.getMeta() : e.prototype.getMeta.call(this);
    };

    t.prototype.getPath = function() {
      return this.entry ? this.entry.getPath() : e.prototype.getPath.call(this);
    };

    t.prototype.getIcon = function() {
      return this.entry ? this.entry.getIcon() : e.prototype.getIcon.call(this);
    };

    t.prototype.getDescription = function() {
      return this.entry ? this.entry.getDescription() : e.prototype.getDescription.call(this);
    };

    t.prototype.getEntry = function() {
      return this.entry;
    };

    t.prototype.getHighlights = function() {
      return this.entry ? this.entry.getHighlights() : e.prototype.getHighlights.call(this);
    };

    t.prototype.setHighlights = function(t) {
      if (this.entry) {
        this.entry.setHighlights(t);
      } else {
        e.prototype.setHighlights.call(this, t);
      }
    };

    t.prototype.run = function(t, n) {
      return this.entry ? this.entry.run(t, n) : e.prototype.run.call(this, t, n);
    };

    return t;
  }(o);
  t.QuickOpenEntryGroup = s;
  var a = function() {
    function e() {
      this._entries = [];
    }
    Object.defineProperty(e.prototype, "entries", {
      get: function() {
        return this._entries;
      },
      set: function(e) {
        this._entries = e;
      },
      enumerable: !0,
      configurable: !0
    });

    e.prototype.addEntries = function(e) {
      if (n.isArray(e)) {
        this._entries = this._entries.concat(e);
      }
    };

    e.prototype.setEntries = function(e) {
      if (n.isArray(e)) {
        this._entries = e;
      }
    };

    e.prototype.getEntries = function() {
      return this._entries;
    };

    return e;
  }();
  t.QuickOpenModel = a;
});