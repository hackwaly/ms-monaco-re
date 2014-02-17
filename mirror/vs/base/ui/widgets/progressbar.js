define("vs/base/ui/widgets/progressbar", ["require", "exports", "vs/base/lib/winjs.base", "vs/base/assert",
  "vs/base/env", "vs/base/dom/builder", "vs/base/dom/dom", "vs/base/uuid", "vs/css!./progressbar"
], function(e, t, n, i, o, r, s, a) {
  var u = "done";

  var l = "active";

  var c = "infinite";

  var d = "discrete";

  var h = "progress-container";

  var p = "progress-bit";

  var f = r.$;

  var g = function() {
    function e(e) {
      this.toUnbind = [];

      this.workedVal = 0;

      this.create(e);
    }
    e.prototype.create = function(e) {
      var t = this;
      e.div({
        "class": h
      }, function(e) {
        t.element = e.clone();

        e.div({
          "class": p
        }).on([s.EventType.ANIMATION_START, s.EventType.ANIMATION_END, s.EventType.ANIMATION_ITERATION], function(e) {
          switch (e.type) {
            case s.EventType.ANIMATION_START:
            case s.EventType.ANIMATION_END:
              t.animationRunning = e.type === s.EventType.ANIMATION_START;
              break;
            case s.EventType.ANIMATION_ITERATION:
              t.animationStopToken && t.animationStopToken(null);
          }
        }, t.toUnbind);

        t.bit = e.getHTMLElement();
      });
    };

    e.prototype.off = function() {
      this.bit.style.width = "inherit";

      this.bit.style.opacity = "1";

      this.element.removeClass(l);

      this.element.removeClass(c);

      this.element.removeClass(d);

      this.workedVal = 0;

      this.totalWork = void 0;
    };

    e.prototype.done = function() {
      return this.doDone(!0);
    };

    e.prototype.stop = function() {
      return this.doDone(!1);
    };

    e.prototype.doDone = function(e) {
      var t = this;
      this.element.addClass(u);

      this.element.hasClass(c) ? (this.bit.style.opacity = "0", e ? n.Promise.timeout(200).then(function() {
        return t.off();
      }) : this.off()) : (this.bit.style.width = "inherit", e ? n.Promise.timeout(200).then(function() {
        return t.off();
      }) : this.off());

      return this;
    };

    e.prototype.infinite = function() {
      if (this.bit.style.width = "2%", this.bit.style.opacity = "1", this.element.removeClass(d), this.element.removeClass(
        u), this.element.addClass(l), this.element.addClass(c), !o.browser.hasCSSAnimationSupport()) {
        var e = a.v4().asHex();
        this.currentProgressToken = e;

        this.manualInfinite(e);
      }
      return this;
    };

    e.prototype.manualInfinite = function(e) {
      var t = this;
      this.bit.style.width = "5%";

      this.bit.style.display = "inherit";
      var i = 0;

      var o = function() {
        n.Promise.timeout(50).then(function() {
          e === t.currentProgressToken && (t.element.hasClass(u) ? (t.bit.style.display = "none", t.bit.style.left =
            "0") : t.element.isHidden() ? o() : (i = (i + 1) % 95, t.bit.style.left = i + "%", o()));
        });
      };
      o();
    };

    e.prototype.total = function(e) {
      this.workedVal = 0;

      this.totalWork = e;

      return this;
    };

    e.prototype.worked = function(e) {
      i.ok(!isNaN(this.totalWork), "Total work not set");

      e = Number(e);

      i.ok(!isNaN(e), "Value is not a number");

      e = Math.max(1, e);

      this.workedVal += e;

      this.workedVal = Math.min(this.totalWork, this.workedVal);

      this.element.hasClass(c) && this.element.removeClass(c);

      this.element.hasClass(d) || this.element.addClass(d);

      this.bit.style.width = 100 * (this.workedVal / this.totalWork) + "%";

      return this;
    };

    e.prototype.getContainer = function() {
      return f(this.element);
    };

    e.prototype.dispose = function() {
      for (; this.toUnbind.length;) {
        this.toUnbind.pop()();
      }
    };

    return e;
  }();
  t.ProgressBar = g;
});