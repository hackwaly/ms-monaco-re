define("vs/base/ui/widgets/menu/menu", ["require", "exports", "vs/base/dom/builder", "vs/base/ui/widgets/actionbar",
  "vs/base/eventEmitter", "vs/css!./menu"
], function(e, t, n, i, o) {
  var r = n.$;

  var s = function(e) {
    function t(t, n, o) {
      "undefined" == typeof o && (o = {});

      e.call(this);

      r(t).addClass("monaco-menu-container");
      var s = r(".monaco-menu").appendTo(t);
      this.actionBar = new i.ActionBar(s, {
        orientation: 2,
        actionItemProvider: o.actionItemProvider,
        context: o.context,
        actionRunner: o.actionRunner
      });

      this.listener = this.addEmitter2(this.actionBar);

      this.actionBar.push(n, {
        icon: !0,
        label: !0
      });
    }
    __extends(t, e);

    t.prototype.focus = function() {
      this.actionBar.focus();
    };

    t.prototype.dispose = function() {
      e.prototype.dispose.call(this);

      this.actionBar && (this.actionBar.dispose(), this.actionBar = null);

      this.listener && (this.listener.dispose(), this.listener = null);
    };

    return t;
  }(o.EventEmitter);
  t.Menu = s;
});