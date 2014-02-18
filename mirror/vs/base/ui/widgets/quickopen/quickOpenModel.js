var __extends = this.__extends || function(a, b) {
    function d() {
      this.constructor = a;
    }
    for (var c in b) {
      if (b.hasOwnProperty(c)) {
        a[c] = b[c];
      }
    }
    d.prototype = b.prototype;

    a.prototype = new d;
  };

define(["require", "exports", "vs/base/types"], function(a, b, c) {
  var d = c;
  (function(a) {
    a[a.PREVIEW = 0] = "PREVIEW";

    a[a.OPEN = 1] = "OPEN";
  })(b.Mode || (b.Mode = {}));
  var e = b.Mode;

  var f = 0;

  var g = function() {
    function a() {
      this.id = (f++).toString();

      this.highlights = [];
    }
    a.prototype.getId = function() {
      return this.id;
    };

    a.prototype.getLabel = function() {
      return null;
    };

    a.prototype.getIcon = function() {
      return null;
    };

    a.prototype.getDescription = function() {
      return null;
    };

    a.prototype.getPath = function() {
      return null;
    };

    a.prototype.setHighlights = function(a) {
      this.highlights = a;
    };

    a.prototype.getHighlights = function() {
      return this.highlights;
    };

    a.prototype.run = function(a) {
      return !1;
    };

    return a;
  }();
  b.QuickOpenEntry = g;
  var h = function(a) {
    function b() {
      a.apply(this, arguments);
    }
    __extends(b, a);

    b.prototype.getHeight = function() {
      return 0;
    };

    b.prototype.render = function(a, b, c) {
      return null;
    };

    return b;
  }(g);
  b.QuickOpenEntryItem = h;
  var i = function(a) {
    function b(b, c, d) {
      a.call(this);

      this.entry = b;

      this.groupLabel = c;

      this.withBorder = d;
    }
    __extends(b, a);

    b.prototype.getGroupLabel = function() {
      return this.groupLabel;
    };

    b.prototype.setGroupLabel = function(a) {
      this.groupLabel = a;
    };

    b.prototype.showBorder = function() {
      return this.withBorder;
    };

    b.prototype.setShowBorder = function(a) {
      this.withBorder = a;
    };

    b.prototype.getLabel = function() {
      return this.entry ? this.entry.getLabel() : a.prototype.getLabel.call(this);
    };

    b.prototype.getPath = function() {
      return this.entry ? this.entry.getPath() : a.prototype.getPath.call(this);
    };

    b.prototype.getIcon = function() {
      return this.entry ? this.entry.getIcon() : a.prototype.getIcon.call(this);
    };

    b.prototype.getDescription = function() {
      return this.entry ? this.entry.getDescription() : a.prototype.getDescription.call(this);
    };

    b.prototype.getHighlights = function() {
      return this.entry ? this.entry.getHighlights() : a.prototype.getHighlights.call(this);
    };

    b.prototype.setHighlights = function(b) {
      if (this.entry) {
        this.entry.setHighlights(b);
      } else {
        a.prototype.setHighlights.call(this, b);
      }
    };

    b.prototype.run = function(b) {
      return this.entry ? this.entry.run(b) : a.prototype.run.call(this, b);
    };

    return b;
  }(g);
  b.QuickOpenEntryGroup = i;
  var j = function() {
    function a() {
      this._entries = [];
    }
    Object.defineProperty(a.prototype, "entries", {
      get: function() {
        return this._entries;
      },
      enumerable: !0,
      configurable: !0
    });

    a.prototype.addEntries = function(a) {
      if (d.isArray(a)) {
        this._entries = this._entries.concat(a);
      }
    };

    a.prototype.setEntries = function(a) {
      if (d.isArray(a)) {
        this._entries = a;
      }
    };

    a.prototype.getEntries = function() {
      return this._entries;
    };

    return a;
  }();
  b.QuickOpenModel = j;
});