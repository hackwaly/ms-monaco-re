var __extends = this.__extends || function(a, b) {
    function d() {
      this.constructor = a
    }
    for (var c in b) b.hasOwnProperty(c) && (a[c] = b[c]);
    d.prototype = b.prototype, a.prototype = new d
  };
define(["require", "exports", "vs/base/eventEmitter", "vs/base/assert", "vs/editor/core/constants",
  "vs/editor/core/range", "vs/base/objects"
], function(a, b, c, d, e, f, g) {
  var h = c,
    i = d,
    j = e,
    k = f,
    l = g,
    m = {
      followsCaret: !0,
      ignoreCharChanges: !0,
      alwaysRevealFirst: !0
    }, n = function(a) {
      function b(b, c) {
        typeof c == "undefined" && (c = {});
        var d = this;
        a.call(this), this.editor = b, this.options = l.mixin(c, m, !1), this.disposed = !1, this.toUnbind = [], this
          .nextIdx = -1, this.ranges = [], this.ignoreSelectionChange = !1, this.revealFirst = this.options.alwaysRevealFirst,
          this.toUnbind.push(this.editor.addListener(j.EventType.Disposed, function() {
            return d.dispose()
          })), this.toUnbind.push(this.editor.addListener(j.EventType.DiffUpdated, function() {
            return d.onDiffUpdated()
          })), this.options.followsCaret && this.toUnbind.push(this.editor.getModifiedEditor().addListener(j.EventType
            .CursorPositionChanged, function(a) {
              if (d.ignoreSelectionChange) return;
              d.nextIdx = -1
            })), this.options.alwaysRevealFirst && this.toUnbind.push(this.editor.getModifiedEditor().addListener(j.EventType
            .ModelChanged, function(a) {
              d.revealFirst = !0
            })), this.init()
      }
      return __extends(b, a), b.prototype.init = function() {
        var a = this.editor.getLineChanges();
        if (!a) return
      }, b.prototype.onDiffUpdated = function() {
        this.init(), this.compute(this.editor.getLineChanges()), this.revealFirst && (this.revealFirst = !1, this.nextIdx = -
          1, this.next())
      }, b.prototype.compute = function(a) {
        var c = this;
        this.ranges = [], a.forEach(function(a) {
          !c.options.ignoreCharChanges && a.charChanges ? a.charChanges.forEach(function(a) {
            c.ranges.push({
              rhs: !0,
              range: new k.Range(a.modifiedStartLineNumber, a.modifiedStartColumn, a.modifiedEndLineNumber, a.modifiedEndColumn)
            })
          }) : c.ranges.push({
            rhs: !0,
            range: new k.Range(a.modifiedStartLineNumber, 1, a.modifiedStartLineNumber, 1)
          })
        }), this.ranges.sort(function(a, b) {
          return a.range.getStartPosition().isBeforeOrEqual(b.range.getStartPosition()) ? -1 : b.range.getStartPosition()
            .isBeforeOrEqual(a.range.getStartPosition()) ? 1 : 0
        }), this.emit(b.Events.UPDATED, {})
      }, b.prototype.initIdx = function(a) {
        var b = !1,
          c = this.editor.getPosition();
        for (var d = 0, e = this.ranges.length; d < e && !b; d++) {
          var f = this.ranges[d].range;
          c.isBeforeOrEqual(f.getStartPosition()) && (this.nextIdx = d + (a ? 0 : -1), b = !0)
        }
        b || (this.nextIdx = a ? 0 : this.ranges.length - 1), this.nextIdx < 0 && (this.nextIdx = this.ranges.length -
          1)
      }, b.prototype.move = function(a) {
        i.ok(!this.disposed, "Illegal State - diff navigator has been disposed");
        if (!this.canNavigate()) return;
        this.nextIdx === -1 ? this.initIdx(a) : a ? (this.nextIdx += 1, this.nextIdx >= this.ranges.length && (this.nextIdx =
          0)) : (this.nextIdx -= 1, this.nextIdx < 0 && (this.nextIdx = this.ranges.length - 1));
        var b = this.ranges[this.nextIdx];
        this.ignoreSelectionChange = !0;
        try {
          this.editor.setPosition(b.range.getStartPosition(), !0, !0, !0)
        } finally {
          this.ignoreSelectionChange = !1
        }
      }, b.prototype.canNavigate = function() {
        return this.ranges.length > 0
      }, b.prototype.next = function() {
        this.move(!0)
      }, b.prototype.previous = function() {
        this.move(!1)
      }, b.prototype.dispose = function() {
        while (this.toUnbind.length > 0) this.toUnbind.pop()();
        this.ranges = null, this.disposed = !0, a.prototype.dispose.call(this)
      }, b.Events = {
        UPDATED: "navigation.updated"
      }, b
    }(h.EventEmitter);
  b.DiffNavigator = n
})