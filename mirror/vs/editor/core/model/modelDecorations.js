define(["require", "exports"], function(a, b) {
  var c = function() {
    function a(a, b) {
      this.model = a;

      this.trackedRanges = b;

      this.lastDecorationId = 0;

      this.decorations = {};

      this.rangeIdToDecorationId = {};
    }
    a.prototype.clear = function() {
      this.decorations = {};

      this.rangeIdToDecorationId = {};
    };

    a.prototype.change = function(a, b, c) {
      var d = this;

      var e = {
        addDecoration: function(c, e) {
          return d._add(a, b, c, e);
        },
        changeDecoration: function(b, c) {
          d._change(a, b, c);
        },
        changeDecorationOptions: function(b, c) {
          d._changeOptions(a, b, c);
        },
        removeDecoration: function(b) {
          d._remove(a, b);
        },
        deltaDecorations: function(c, e) {
          return d._delta(a, b, c, e);
        }
      };

      var f = c(e);
      e.addDecoration = null;

      e.changeDecoration = null;

      e.removeDecoration = null;

      e.deltaDecorations = null;

      return f;
    };

    a.prototype.getAll = function(a) {
      var b = [];

      var c;

      var d;
      for (c in this.decorations)
        if (this.decorations.hasOwnProperty(c)) {
          d = this.decorations[c];
          if (a && d.ownerId && d.ownerId !== a) continue;
          b.push({
            id: d.id,
            ownerId: d.ownerId,
            range: this.trackedRanges.getRange(d.rangeId),
            options: d.options
          });
        }
      return b;
    };

    a.prototype.getLineDecorations = function(a, b) {
      return this.getLinesDecorations(a, a, b);
    };

    a.prototype.getLinesDecorations = function(a, b, c) {
      var d = [];

      var e;

      var f = this.trackedRanges.getLinesTrackedRanges(a, b);

      var g;
      for (g in f)
        if (f.hasOwnProperty(g) && this.rangeIdToDecorationId.hasOwnProperty(g)) {
          e = this.decorations[this.rangeIdToDecorationId[g]];
          if (c && e.ownerId && e.ownerId !== c) continue;
          d.push({
            id: e.id,
            ownerId: e.ownerId,
            range: f[g],
            options: e.options
          });
        }
      return d;
    };

    a.prototype.getOptions = function(a) {
      return this.decorations.hasOwnProperty(a) ? this.decorations[a].options : null;
    };

    a.prototype.getRange = function(a) {
      if (this.decorations.hasOwnProperty(a)) {
        var b = this.decorations[a];
        return this.trackedRanges.getRange(b.rangeId);
      }
      return null;
    };

    a.prototype.removeAllDecorationsWithOwnerId = function(a) {
      var b;

      var c;

      var d = [];
      for (b in this.decorations) {
        if (this.decorations.hasOwnProperty(b)) {
          c = this.decorations[b];
          if (c.ownerId === a) {
            d.push(c.id);
          }
        }
      }
      for (var e = 0; e < d.length; e++) {
        this._remove(null, d[e]);
      }
    };

    a.cleanClassName = function(a) {
      return a.replace(/[^a-z0-9\-]/gi, " ");
    };

    a.prototype._normalizeOptions = function(b) {
      return {
        className: a.cleanClassName(b.className || ""),
        hoverMessage: b.hoverMessage || "",
        htmlMessage: b.htmlMessage || [],
        isWholeLine: b.isWholeLine || !1,
        showInOverviewRuler: b.showInOverviewRuler || "",
        glyphMarginClassName: a.cleanClassName(b.glyphMarginClassName || ""),
        linesDecorationsClassName: a.cleanClassName(b.linesDecorationsClassName || ""),
        inlineClassName: a.cleanClassName(b.inlineClassName || "")
      };
    };

    a.prototype._add = function(a, b, c, d) {
      var e = this.trackedRanges.add(c);
      d = this._normalizeOptions(d);
      var f = {
        ownerId: b,
        id: (++this.lastDecorationId).toString(),
        rangeId: e,
        options: d
      };
      this.decorations[f.id] = f;

      this.rangeIdToDecorationId[e] = f.id;

      a.addNewDecoration(f.id);

      return f.id;
    };

    a.prototype._change = function(a, b, c) {
      if (this.decorations.hasOwnProperty(b)) {
        var d = this.decorations[b];

        var e = this.trackedRanges.getRange(d.rangeId);
        this.trackedRanges.change(d.rangeId, c);

        a.addMovedDecoration(b, e);
      }
    };

    a.prototype._changeOptions = function(a, b, c) {
      c = this._normalizeOptions(c);
      if (this.decorations.hasOwnProperty(b)) {
        var d = this.decorations[b];

        var e = d.options;
        d.options = c;

        a.addUpdatedDecoration(b, e);
      }
    };

    a.prototype._remove = function(a, b) {
      if (this.decorations.hasOwnProperty(b)) {
        var c = this.decorations[b];

        var d = null;
        if (a) {
          d = this.trackedRanges.getRange(c.rangeId);
        }

        this.trackedRanges.remove(c.rangeId);

        delete this.rangeIdToDecorationId[c.rangeId];

        delete this.decorations[b];

        if (a) {
          a.addRemovedDecoration(b, c.ownerId, d, c.options);
        }
      }
    };

    a.prototype._hashHTMLContent = function(a) {
      var b = this;

      var c = [a.tagName, a.text, a.className];
      a.children && a.children.forEach(function(a, d) {
        c.push("child" + d + "-" + b._hashHTMLContent(a));
      });

      return c.join("-");
    };

    a.prototype._decorationHash = function(a, b) {
      var c = this;

      var d = [a.startLineNumber.toString(), a.startColumn.toString(), a.endLineNumber.toString(), a.endColumn.toString(),
        b.className, b.hoverMessage, b.htmlMessage.reduce(function(a, b) {
          return a + c._hashHTMLContent(b);
        }, ""), b.isWholeLine + "", b.showInOverviewRuler, b.glyphMarginClassName, b.linesDecorationsClassName, b.inlineClassName
      ];
      return d.join("-");
    };

    a.prototype._delta = function(a, b, c, d) {
      var e = [];

      var f = [];

      var g;

      var h;
      for (g = 0, h = d.length; g < h; g++) {
        e[g] = this._normalizeOptions(d[g].options);
        f[g] = this.model.validateRange(d[g].range);
      }
      return this._deltaImpl(a, b, c, h, f, e);
    };

    a.prototype._deltaImpl = function(a, b, c, d, e, f) {
      var g;

      var h;

      var i = {};

      var j;

      var k;
      for (g = 0, h = c.length; g < h; g++) {
        if (this.decorations.hasOwnProperty(c[g])) {
          k = this.decorations[c[g]];
          j = this._decorationHash(this.trackedRanges.getRange(k.rangeId), k.options);
          i[j] = i[j] || [];
          i[j].push(c[g]);
        }
      }
      var l;

      var m;

      var n = [];

      var o = {};

      var p;

      var q;
      for (g = 0; g < d; g++) {
        j = this._decorationHash(e[g], f[g]);

        q = !1;
        if (i.hasOwnProperty(j)) {
          p = i[j];
          for (l = 0, m = p.length; l < m; l++)
            if (!o.hasOwnProperty(p[l])) {
              q = !0;

              o[p[l]] = !0;

              n.push(p[l]);
              break;
            }
        }
        if (!q) {
          n.push(this._add(a, b, e[g], f[g]));
        }
      }
      for (g = 0, h = c.length; g < h; g++) {
        if (!o.hasOwnProperty(c[g])) {
          this._remove(a, c[g]);
        }
      }
      return n;
    };

    a.prototype.onChangedRanges = function(a, b) {
      var c;

      var d;
      for (c in b) {
        if (b.hasOwnProperty(c) && this.rangeIdToDecorationId.hasOwnProperty(c)) {
          d = this.rangeIdToDecorationId[c];
          a.addMovedDecoration(d, b[c]);
        }
      }
    };

    a.prototype.getDecorationData = function(a) {
      var b = this.decorations[a];
      return {
        id: b.id,
        ownerId: b.ownerId,
        range: this.trackedRanges.getRange(b.rangeId),
        isForValidation: !1,
        options: b.options
      };
    };

    return a;
  }();
  b.ModelDecorations = c;
});