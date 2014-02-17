define('vs/base/ui/scrollbar/impl/domNodeScrollable', [
  'require',
  'exports',
  'vs/base/dom/dom',
  'vs/base/dom/touch',
  'vs/base/eventEmitter'
], function(e, t, n, i, o) {
  var r = function() {
    function e(e) {
      this.eventEmitterHelper = new o.EventEmitter(), this.domNode = e, this.gestureHandler = new i.Gesture(this.domNode);
    }
    return e.prototype.getScrollHeight = function() {
      return this.domNode.scrollHeight;
    }, e.prototype.getScrollWidth = function() {
      return this.domNode.scrollWidth;
    }, e.prototype.getScrollLeft = function() {
      return this.domNode.scrollLeft;
    }, e.prototype.setScrollLeft = function(e) {
      this.domNode.scrollLeft = e;
    }, e.prototype.getScrollTop = function() {
      return this.domNode.scrollTop;
    }, e.prototype.setScrollTop = function(e) {
      this.domNode.scrollTop = e;
    }, e.prototype.addScrollListener = function(e) {
      var t = this,
        i = this.eventEmitterHelper.addListener2('scroll', e),
        o = n.addDisposableListener(this.domNode, 'scroll', function(e) {
          t.eventEmitterHelper.emit('scroll', {
            browserEvent: e
          });
        });
      return {
        dispose: function() {
          o.dispose(), i.dispose();
        }
      };
    }, e.prototype.dispose = function() {
      this.domNode = null, this.eventEmitterHelper.dispose(), this.gestureHandler && (this.gestureHandler.dispose(),
        this.gestureHandler = null);
    }, e;
  }();
  t.DomNodeScrollable = r;
})