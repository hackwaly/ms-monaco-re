define("vs/languages/typescript/service/textEdit", ["require", "exports", "vs/base/strings"], function(e, t, n) {
  function r(e) {
    return new o(e);
  }
  var i = function() {
    function e(e, t, n) {
      this.offset = e;

      this.length = t;

      this.text = n || "";

      this.parent = null;

      this.children = [];
    }
    e.prototype.isNoop = function() {
      return 0 === this.length && 0 === this.text.length;
    };

    e.prototype.isDelete = function() {
      return this.length > 0 && 0 === this.text.length;
    };

    e.prototype.isInsert = function() {
      return 0 === this.length && this.text.length > 0;
    };

    e.prototype.isReplace = function() {
      return this.length > 0 && this.text.length > 0;
    };

    e.prototype.getRightMostChild = function() {
      var e = this.children.length;
      return 0 === e ? this : this.children[e - 1].getRightMostChild();
    };

    e.prototype.remove = function() {
      return this.parent ? this.parent.removeChild(this) : !1;
    };

    e.prototype.addChild = function(e) {
      e.parent = this;
      var t;

      var n;
      for (t = 0, n = this.children.length; n > t && !(this.children[t].offset > e.offset); t++);
      this.children.splice(t, 0, e);
    };

    e.prototype.removeChild = function(e) {
      var t = this.children.indexOf(e);
      return -1 === t ? !1 : (e.parent = null, this.children.splice(t, 1), !0);
    };

    e.prototype.insert = function(e) {
      if (this.enclosedBy(e)) e.insert(this);

      return e;
      var t;

      var n;

      var r;
      for (t = 0, n = this.children.length; n > t; t++)
        if (r = this.children[t], r.enclosedBy(e)) this.removeChild(r);

      e.insert(r);

      n--;

      t--;
      else if (r.encloses(e)) r.insert(e);

      return this;
      this.addChild(e);

      return this;
    };

    e.prototype.enclosedBy = function(e) {
      return e.encloses(this);
    };

    e.prototype.encloses = function(e) {
      if (this.offset === this.offset && this.length === e.length) return !1;
      var t = this.length - e.length;

      var n = e.offset - this.offset;
      return n >= 0 && t >= 0 && t >= n;
    };

    return e;
  }();
  t.Edit = i;
  var o = function() {
    function e(e) {
      this.model = e;

      this.modelVersion = e.getVersionId();

      this.edit = new i(0, this.model.getValue().length, null);
    }
    e.prototype.replace = function(e, t, n) {
      "undefined" == typeof t && (t = 0);

      "undefined" == typeof n && (n = null);
      var r = new i(e, t, n);
      r.isNoop() || (this.edit = this.edit.insert(r));
    };

    e.prototype.apply = function() {
      if (this.model.getVersionId() !== this.modelVersion) throw new Error("illegal state - model has been changed");
      for (var e, t = this.model.getValue();
        (e = this.edit.getRightMostChild()) !== this.edit;) t = n.splice(t, e.offset, e.length, e.text);

      e.parent.length += e.text.length - e.length;

      e.remove();
      return t;
    };

    return e;
  }();
  t.create = r;
});