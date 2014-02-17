define("vs/base/ui/widgets/leftRightWidget/leftRightWidget", ["require", "exports", "vs/base/dom/builder",
  "vs/css!./leftRightWidget"
], function(e, t, n) {
  var i = n.$;

  var o = function() {
    function e(e, t, n) {
      this.$el = i(".monaco-left-right-widget").appendTo(e);

      this.toDispose = [n(i(".right").appendTo(this.$el).getHTMLElement()), t(i("span.left").appendTo(this.$el).getHTMLElement())]
        .filter(function(e) {
          return !!e;
        });
    }
    e.prototype.dispose = function() {
      this.$el && (this.$el.destroy(), this.$el = null);
    };

    return e;
  }();
  t.LeftRightWidget = o;
});