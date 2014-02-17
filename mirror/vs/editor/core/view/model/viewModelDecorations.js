define("vs/editor/core/view/model/viewModelDecorations", ["require", "exports", "vs/editor/core/range",
  "vs/editor/core/view/viewContext"
], function(e, t, n, i) {
  var o = function() {
    function e(e, t, n) {
      this.editorId = e;

      this.configuration = t;

      this.converter = n;

      this.decorations = [];
    }
    e.prototype.dispose = function() {
      this.converter = null;

      this.decorations = null;
    };

    e.compareDecorations = function(e, t) {
      return n.compareRangesUsingStarts(e.range, t.range);
    };

    e.prototype.reset = function(t) {
      var n;

      var i;

      var o;

      var r;

      var s = t.getAllDecorations(this.editorId, this.configuration.editor.readOnly);
      for (this.decorations = [], n = 0, i = s.length; i > n; n++) {
        o = s[n];
        r = {
          id: o.id,
          options: o.options,
          ownerId: o.ownerId,
          modelRange: o.range,
          range: this.converter.convertModelRangeToViewRange(o.range, o.options.isWholeLine)
        };
        this.decorations[n] = r;
      }
      this.decorations.sort(e.compareDecorations);
    };

    e.prototype.onModelDecorationsChanged = function(t, n) {
      var o;

      var r;

      var s;

      var a = !1;

      var u = {};

      var l = {};

      var c = this.configuration.editor.readOnly;
      for (r = 0, s = t.addedOrChangedDecorations.length; s > r; r++) {
        o = t.addedOrChangedDecorations[r];
        if (!(c && o.isForValidation || o.ownerId && o.ownerId !== this.editorId)) {
          l[o.id] = o;
        }
      }
      for (r = 0, s = t.removedDecorations.length; s > r; r++) {
        u[t.removedDecorations[r]] = !0;
      }
      var d;

      var h = {};
      for (r = 0, s = this.decorations.length; s > r; r++) {
        d = this.decorations[r];
        if (l.hasOwnProperty(d.id)) {
          h[d.id] = !0;
          o = l[d.id];
          d.options = o.options;
          d.modelRange = o.range;
          d.range = this.converter.convertModelRangeToViewRange(o.range, o.options.isWholeLine);
          a = !0;
        }
        if (u.hasOwnProperty(d.id)) {
          this.decorations.splice(r, 1);
          s--;
          r--;
          a = !0;
        }
      }
      var p;
      for (p in l) {
        if (!h.hasOwnProperty(p) && l.hasOwnProperty(p)) {
          o = l[p];
          d = {
            id: o.id,
            options: o.options,
            ownerId: o.ownerId,
            modelRange: o.range,
            range: this.converter.convertModelRangeToViewRange(o.range, o.options.isWholeLine)
          };
          this.decorations.push(d);
          a = !0;
        }
      }
      if (a) {
        this.decorations.sort(e.compareDecorations);
        var f = null;
        n(i.EventNames.DecorationsChangedEvent, f);
      }
    };

    e.prototype.onLineMappingChanged = function(t) {
      var o;

      var r;

      var s;

      var a;

      var u = this.decorations;

      var l = !1;
      for (r = 0, a = u.length; a > r; r++) {
        o = u[r];
        s = this.converter.convertModelRangeToViewRange(o.modelRange, o.options.isWholeLine);
        if (!(l || n.equalsRange(s, o.range))) {
          l = !0;
        }
        o.range = s;
      }
      if (l) {
        this.decorations.sort(e.compareDecorations);
        var c = null;
        t(i.EventNames.DecorationsChangedEvent, c);
      }
    };

    e.prototype.getAllDecorations = function() {
      return this.decorations;
    };

    e.prototype.getInlineDecorations = function(e) {
      return this.getDecorationsInLines(e, e, !0);
    };

    e.prototype.getDecorationsInRange = function(e) {
      return this.getDecorationsInLines(e.startLineNumber, e.endLineNumber, !1);
    };

    e.prototype.getDecorationsInLines = function(e, t, n) {
      var i;

      var o;

      var r;

      var s;

      var a = [];

      var u = 0;

      var l = this.decorations;
      for (r = 0, s = l.length; s > r && (i = l[r], o = i.range, !(o.startLineNumber > t)); r++) {
        if (!(o.endLineNumber < e)) {
          if (!n || i.options.inlineClassName) {
            a[u++] = i;
          }
        }
      }
      return a;
    };

    return e;
  }();
  t.ViewModelDecorations = o;
});