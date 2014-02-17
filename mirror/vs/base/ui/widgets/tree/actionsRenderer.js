define("vs/base/ui/widgets/tree/actionsRenderer", ["require", "exports", "vs/base/dom/builder", "vs/base/dom/dom",
  "vs/base/ui/events", "vs/base/ui/widgets/actionbar", "vs/css!./actionsRenderer"
], function(e, t, n, i, o, r) {
  var s = n.$;

  var a = function() {
    function e(e) {
      this.actionProvider = e;
    }
    e.prototype.getHeight = function(e, t) {
      return this.getContentHeight(e, t);
    };

    e.prototype.render = function(e, t, n) {
      var a = this;
      i.clearNode(n);
      var u;

      var l;

      var c = s(n).addClass("actions");

      var d = s(".sub-content").appendTo(c);
      if (this.actionProvider.hasActions(e, t)) {
        c.addClass("has-actions");
        u = new r.ActionBar(s(".primary-action-bar").appendTo(c), {
          context: this.getActionContext(e, t)
        });
        this.actionProvider.getActions(e, t).then(function(e) {
          u.push(e, {
            icon: !0,
            label: !1
          });
        });
        l = u.addListener2(o.EventType.RUN, function(e) {
          if (e.error) {
            a.onError(e.error);
          }
        });
      } else {
        c.removeClass("has-actions");
      }
      var h = this.renderContents(e, t, d.getHTMLElement(), function() {});
      return function() {
        if (h) {
          h(e, t);
        }

        if (l) {
          l.dispose();
        }

        if (u) {
          u.dispose();
        }
      };
    };

    e.prototype.getContentHeight = function() {
      return 20;
    };

    e.prototype.renderContents = function() {
      return null;
    };

    e.prototype.getActionContext = function() {
      return null;
    };

    e.prototype.onError = function() {};

    e.prototype.dispose = function() {
      this.actionProvider = null;
    };

    return e;
  }();
  t.ActionsRenderer = a;
});