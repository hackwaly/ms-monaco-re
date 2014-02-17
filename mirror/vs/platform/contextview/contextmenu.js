define('vs/platform/contextview/contextmenu', [
  'require',
  'exports',
  'vs/base/dom/builder',
  'vs/base/lifecycle',
  'vs/platform/services',
  'vs/base/dom/mouseEvent',
  'vs/base/ui/actions',
  'vs/base/ui/widgets/menu/menu',
  'vs/base/ui/events',
  'vs/css!./contextmenu'
], function(e, t, n, i, o, r, s, a, u) {
  var l = n.$,
    c = function() {
      function e(e) {
        var t = this;
        this.setContainer(e), this.actionRunner = new s.ActionRunner(), this.menuContainerElement = null, this.toDispose = [];
        var n = !1;
        this.toDispose.push(this.actionRunner.addListener2(u.EventType.BEFORE_RUN, function(e) {
          t.telemetryService && t.telemetryService.publicLog('workbenchActionExecuted', {
            id: e.action.id,
            From: 'contextMenu'
          }), n = !! e.retainActionItem, n || t.contextViewService.hideContextView(!1);
        })), this.toDispose.push(this.actionRunner.addListener2(u.EventType.RUN, function(e) {
          n && t.contextViewService.hideContextView(!1), n = !1, e.error && t.messageService.show(2, e.error);
        }));
      }
      return e.prototype.injectContextViewService = function(e) {
        this.contextViewService = e;
      }, e.prototype.injectTelemetryService = function(e) {
        this.telemetryService = e;
      }, e.prototype.injectMessageService = function(e) {
        this.messageService = e;
      }, e.prototype.setContainer = function(e) {
        var t = this;
        this.$el && (this.$el.off([
          'click',
          'mousedown'
        ]), this.$el = null), e && (this.$el = l(e), this.$el.on('mousedown', function(e) {
          return t.onMouseDown(e);
        }));
      }, e.prototype.showContextMenu = function(e, t) {
        var n = this;
        t.getActions().done(function(o) {
          n.contextViewService.showContextView({
            getAnchor: function() {
              return e;
            },
            canRelayout: !1,
            render: function(e) {
              n.menuContainerElement = e;
              var r = new a.Menu(e, o, {
                actionItemProvider: t.getActionItem,
                context: t.getActionsContext ? t.getActionsContext() : null,
                actionRunner: n.actionRunner
              }),
                s = r.addListener2(u.EventType.CANCEL, function() {
                  n.contextViewService.hideContextView(!0);
                }),
                l = r.addListener2(u.EventType.BLUR, function() {
                  n.contextViewService.hideContextView(!0);
                });
              return r.focus(), i.combinedDispose(s, l, r);
            },
            onHide: function(e) {
              t.onHide && t.onHide(e), n.menuContainerElement = null;
            }
          });
        });
      }, e.prototype.onMouseDown = function(e) {
        if (this.menuContainerElement) {
          for (var t = new r.StandardMouseEvent(e), n = t.target; n;) {
            if (n === this.menuContainerElement)
              return;
            n = n.parentElement;
          }
          this.contextViewService.hideContextView();
        }
      }, e.prototype.dispose = function() {
        this.setContainer(null);
      }, e;
    }();
  t.ContextMenuHandler = c;
})