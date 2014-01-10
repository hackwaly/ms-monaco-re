define(["require", "exports", "vs/base/lib/winjs.base", "vs/base/assert", "vs/base/env", "vs/base/dom/builder",
  "vs/base/dom/dom", "vs/base/strings", "vs/css!./progressbar"
], function(a, b, c, d, e, f, g, h) {
  var i = c,
    j = d,
    k = e,
    l = f,
    m = g,
    n = h,
    o = "done",
    p = "active",
    q = "infinite",
    r = "discrete",
    s = "progress-container",
    t = "progress-bit",
    u = function() {
      function a(a) {
        this.toUnbind = [], this.workedVal = 0, this.create(a)
      }
      return a.prototype.create = function(a) {
        var b = this;
        a.div({
          "class": s
        }, function(a) {
          b.element = a.clone(), a.div({
            "class": t
          }).on([m.EventType.ANIMATION_START, m.EventType.ANIMATION_END, m.EventType.ANIMATION_ITERATION], function(
            a) {
            switch (a.type) {
              case m.EventType.ANIMATION_START:
              case m.EventType.ANIMATION_END:
                b.animationRunning = a.type === m.EventType.ANIMATION_START;
                break;
              case m.EventType.ANIMATION_ITERATION:
                b.animationStopToken && b.animationStopToken(null)
            }
          }, b.toUnbind), b.bit = a.getHTMLElement()
        })
      }, a.prototype.requestAnimationStop = function(a) {
        var b = this;
        return this.animationRunning ? (this.animationStopPromise || (this.animationStopPromise = (new i.Promise(
          function(a, c, d) {
            b.animationStopToken = a
          })).then(function() {
          b.animationStopToken = null, b.animationStopPromise = null
        })), a ? i.Promise.any([this.animationStopPromise, i.Promise.timeout(a)]) : this.animationStopPromise) : i.Promise
          .as(null)
      }, a.prototype.off = function() {
        this.bit.style.width = "inherit", this.bit.style.opacity = "1", this.element.removeClass(p), this.element.removeClass(
          q), this.element.removeClass(r), this.workedVal = 0, this.totalWork = undefined
      }, a.prototype.done = function() {
        return this.doDone(!0)
      }, a.prototype.stop = function() {
        return this.doDone(!1)
      }, a.prototype.doDone = function(a) {
        var b = this;
        return this.element.addClass(o), this.element.hasClass(q) ? (this.bit.style.opacity = "0", a ? i.Promise.timeout(
          200).then(function() {
          return b.off()
        }) : this.off()) : (this.bit.style.width = "inherit", a ? i.Promise.timeout(200).then(function() {
          return b.off()
        }) : this.off()), this
      }, a.prototype.infinite = function() {
        this.bit.style.width = "2%", this.bit.style.opacity = "1", this.element.removeClass(r), this.element.removeClass(
          o), this.element.addClass(p), this.element.addClass(q);
        if (!k.browser.hasCSSAnimationSupport()) {
          var a = n.generateUuid();
          this.currentProgressToken = a, this.manualInfinite(a)
        }
        return this
      }, a.prototype.manualInfinite = function(a) {
        var b = this;
        this.bit.style.width = "5%", this.bit.style.display = "inherit";
        var c = 0,
          d = function() {
            i.Promise.timeout(50).then(function() {
              if (a !== b.currentProgressToken) return;
              b.element.hasClass(o) ? (b.bit.style.display = "none", b.bit.style.left = "0") : b.element.isHidden() ?
                d() : (c = (c + 1) % 95, b.bit.style.left = c + "%", d())
            })
          };
        d()
      }, a.prototype.total = function(a) {
        return this.workedVal = 0, this.totalWork = a, this
      }, a.prototype.worked = function(a) {
        return j.ok(!isNaN(this.totalWork), "Total work not set"), a = Number(a), j.ok(!isNaN(a),
          "Value is not a number"), a = Math.max(1, a), this.workedVal += a, this.workedVal = Math.min(this.totalWork,
          this.workedVal), this.element.hasClass(q) && this.element.removeClass(q), this.element.hasClass(r) || this.element
          .addClass(r), this.bit.style.width = 100 * (this.workedVal / this.totalWork) + "%", this
      }, a.prototype.getContainer = function() {
        return l.Build.withBuilder(this.element)
      }, a.prototype.dispose = function() {
        while (this.toUnbind.length) this.toUnbind.pop()()
      }, a
    }();
  b.ProgressBar = u
})