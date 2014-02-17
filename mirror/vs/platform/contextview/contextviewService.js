define('vs/platform/contextview/contextviewService', [
  'require',
  'exports',
  'vs/base/ui/widgets/contextview/contextview',
  'vs/platform/contextview/contextmenu'
], function(e, t, n, i) {
  var o = function() {
    function e(e) {
      this.contextView = new n.ContextView(e), this.contextMenuHandler = new i.ContextMenuHandler(e);
    }
    return e.prototype.dispose = function() {
      this.contextView.dispose(), this.contextMenuHandler.dispose();
    }, e.prototype.injectInjectorService = function(e) {
      e.injectTo(this.contextMenuHandler);
    }, e.prototype.setContainer = function(e) {
      this.contextView.setContainer(e), this.contextMenuHandler.setContainer(e);
    }, e.prototype.showContextView = function(e) {
      this.contextView.show(e);
    }, e.prototype.layout = function() {
      this.contextView.layout();
    }, e.prototype.hideContextView = function(e) {
      this.contextView.hide(e);
    }, e.prototype.showContextMenu = function(e, t) {
      this.contextMenuHandler.showContextMenu(e, t);
    }, e;
  }();
  t.ContextViewService = o;
})