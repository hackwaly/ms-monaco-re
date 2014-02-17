define('vs/base/ui/widgets/countBadge/countBadge', [
  'require',
  'exports',
  'vs/base/dom/builder',
  'vs/base/strings',
  'vs/css!./countBadge'
], function(e, t, n, i) {
  var o = n.$,
    r = function() {
      function e(e, t, n) {
        this.$el = o('.monaco-count-badge').appendTo(e), this.titleFormat = n || '', this.setCount(t || 0);
      }
      return e.prototype.setCount = function(e) {
        this.count = e, this.render();
      }, e.prototype.setTitleFormat = function(e) {
        this.titleFormat = e, this.render();
      }, e.prototype.render = function() {
        this.$el.text('' + this.count), this.$el.title(i.format(this.titleFormat, this.count));
      }, e.prototype.dispose = function() {
        this.$el && (this.$el.destroy(), this.$el = null);
      }, e;
    }();
  t.CountBadge = r;
})