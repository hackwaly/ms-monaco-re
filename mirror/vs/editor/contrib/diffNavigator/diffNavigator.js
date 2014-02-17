define("vs/editor/contrib/diffNavigator/diffNavigator", ["require", "exports", "vs/base/eventEmitter", "vs/base/assert",
  "vs/editor/core/constants", "vs/editor/core/range", "vs/base/objects"
], function(e, t, n, i, o, r, s) {
  var a = {
    followsCaret: !0,
    ignoreCharChanges: !0,
    alwaysRevealFirst: !0
  };

  var u = function(e) {
    function t(n, i) {
      if ("undefined" == typeof i) {
        i = {};
      }
      var r = this;
      e.call(this, [t.Events.UPDATED]);

      this.editor = n;

      this.options = s.mixin(i, a, !1);

      this.disposed = !1;

      this.toUnbind = [];

      this.nextIdx = -1;

      this.ranges = [];

      this.ignoreSelectionChange = !1;

      this.revealFirst = this.options.alwaysRevealFirst;

      this.toUnbind.push(this.editor.addListener(o.EventType.Disposed, function() {
        return r.dispose();
      }));

      this.toUnbind.push(this.editor.addListener(o.EventType.DiffUpdated, function() {
        return r.onDiffUpdated();
      }));

      if (this.options.followsCaret) {
        this.toUnbind.push(this.editor.getModifiedEditor().addListener(o.EventType.CursorPositionChanged, function() {
          if (!r.ignoreSelectionChange) {
            r.nextIdx = -1;
          }
        }));
      }

      if (this.options.alwaysRevealFirst) {
        this.toUnbind.push(this.editor.getModifiedEditor().addListener(o.EventType.ModelChanged, function() {
          r.revealFirst = !0;
        }));
      }

      this.init();
    }
    __extends(t, e);

    t.prototype.init = function() {
      var e = this.editor.getLineChanges();
    };

    t.prototype.onDiffUpdated = function() {
      this.init();

      this.compute(this.editor.getLineChanges());

      if (this.revealFirst) {
        this.revealFirst = !1;
        this.nextIdx = -1;
        this.next();
      }
    };

    t.prototype.compute = function(e) {
      var n = this;
      this.ranges = [];

      if (e) {
        e.forEach(function(e) {
          if (!n.options.ignoreCharChanges && e.charChanges) {
            e.charChanges.forEach(function(e) {
              n.ranges.push({
                rhs: !0,
                range: new r.Range(e.modifiedStartLineNumber, e.modifiedStartColumn, e.modifiedEndLineNumber, e
                  .modifiedEndColumn)
              });
            });
          }

          {
            n.ranges.push({
              rhs: !0,
              range: new r.Range(e.modifiedStartLineNumber, 1, e.modifiedStartLineNumber, 1)
            });
          }
        });
      }

      this.ranges.sort(function(e, t) {
        return e.range.getStartPosition().isBeforeOrEqual(t.range.getStartPosition()) ? -1 : t.range.getStartPosition()
          .isBeforeOrEqual(e.range.getStartPosition()) ? 1 : 0;
      });

      this.emit(t.Events.UPDATED, {});
    };

    t.prototype.initIdx = function(e) {
      for (var t = !1, n = this.editor.getPosition(), i = 0, o = this.ranges.length; o > i && !t; i++) {
        var r = this.ranges[i].range;
        if (n.isBeforeOrEqual(r.getStartPosition())) {
          this.nextIdx = i + (e ? 0 : -1);
          t = !0;
        }
      }
      if (!t) {
        this.nextIdx = e ? 0 : this.ranges.length - 1;
      }

      if (this.nextIdx < 0) {
        this.nextIdx = this.ranges.length - 1;
      }
    };

    t.prototype.move = function(e) {
      if (i.ok(!this.disposed, "Illegal State - diff navigator has been disposed"), this.canNavigate()) {
        if (-1 === this.nextIdx) {
          this.initIdx(e);
        }

        {
          if (e) {
            this.nextIdx += 1;
            if (this.nextIdx >= this.ranges.length) {
              this.nextIdx = 0;
            }
          } {
            this.nextIdx -= 1;
            if (this.nextIdx < 0) {
              this.nextIdx = this.ranges.length - 1;
            }
          }
        }
        var t = this.ranges[this.nextIdx];
        this.ignoreSelectionChange = !0;
        try {
          this.editor.setPosition(t.range.getStartPosition(), !0, !0, !0);
        } finally {
          this.ignoreSelectionChange = !1;
        }
      }
    };

    t.prototype.canNavigate = function() {
      return this.ranges.length > 0;
    };

    t.prototype.next = function() {
      this.move(!0);
    };

    t.prototype.previous = function() {
      this.move(!1);
    };

    t.prototype.dispose = function() {
      for (; this.toUnbind.length > 0;) {
        this.toUnbind.pop()();
      }
      this.ranges = null;

      this.disposed = !0;

      e.prototype.dispose.call(this);
    };

    t.Events = {
      UPDATED: "navigation.updated"
    };

    return t;
  }(n.EventEmitter);
  t.DiffNavigator = u;
});