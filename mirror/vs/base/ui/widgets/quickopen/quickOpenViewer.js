define("vs/base/ui/widgets/quickopen/quickOpenViewer", ["require", "exports", "vs/base/lib/winjs.base",
  "vs/base/dom/builder", "vs/base/ui/widgets/tree/treeDefaults", "vs/base/ui/widgets/highlightedLabel",
  "vs/base/ui/widgets/quickopen/quickOpenModel", "vs/base/ui/widgets/tree/actionsRenderer"
], function(e, t, n, i, o, r, s, a) {
  var u = i.$;

  var l = function() {
    function e() {}
    e.prototype.getId = function(t, n) {
      return n instanceof s.QuickOpenModel ? e.ROOT : n instanceof s.QuickOpenEntry ? n.getId() : null;
    };

    e.prototype.hasChildren = function(e, t) {
      return t instanceof s.QuickOpenModel ? t.getEntries().length > 0 : !1;
    };

    e.prototype.getChildren = function(e, t) {
      return t instanceof s.QuickOpenModel ? n.Promise.as(t.getEntries()) : n.Promise.as([]);
    };

    e.prototype.getParent = function() {
      return n.Promise.as(null);
    };

    e.ROOT = "__root__";

    return e;
  }();
  t.DataSource = l;
  var c = function() {
    function e() {}
    e.prototype.hasActions = function() {
      return !1;
    };

    e.prototype.getActions = function() {
      return n.Promise.as(null);
    };

    e.prototype.hasSecondaryActions = function() {
      return !1;
    };

    e.prototype.getSecondaryActions = function() {
      return n.Promise.as(null);
    };

    e.prototype.getActionItem = function() {
      return null;
    };

    return e;
  }();

  var d = function(e) {
    function t(t) {
      "undefined" == typeof t && (t = new c);

      e.call(this, t);
    }
    __extends(t, e);

    t.prototype.getHeight = function(e, t) {
      return t instanceof s.QuickOpenEntryItem ? t.getHeight() : 24;
    };

    t.prototype.renderContents = function(e, t, n, i) {
      var o = null;
      if (t instanceof s.QuickOpenEntry) {
        var a = t;
        if (a instanceof s.QuickOpenEntryItem) {
          return t.render(e, n, i);
        }
        if (a instanceof s.QuickOpenEntryGroup) {
          var l = a;
          l.showBorder() && u(n).addClass("results-group-separator");

          l.getGroupLabel() && u(n).div(function(e) {
            e.addClass("results-group");

            e.attr({
              text: l.getGroupLabel()
            });
          });
        }
        u(n).div(function(e) {
          e.addClass("quick-open-entry");

          a.getIcon() && e.append(u("span", {
            "class": "quick-open-entry-icon " + a.getIcon()
          }));
          var t = a.getHighlights();
          if (t && t.length > 0) {
            var n = e.getProperty("highlightedLabel");
            n || (n = new r.HighlightedLabel(e), e.setProperty("highlightedLabel", n));

            o = function() {
              n.destroy();
            };

            n.setValue(a.getLabel(), t);
          } else {
            a.getLabel() && e.span({
              text: a.getLabel(),
              "class": "quick-open-entry-label"
            });
          }
          a.getMeta() && e.span({
            text: a.getMeta(),
            "class": "quick-open-entry-meta"
          });

          a.getDescription() && e.span({
            text: a.getDescription(),
            "class": "quick-open-entry-description"
          });
        });
      }
      return o;
    };

    return t;
  }(a.ActionsRenderer);
  t.Renderer = d;
  var h = function(e) {
    function t() {
      e.apply(this, arguments);
    }
    __extends(t, e);

    t.prototype.onClick = function(e, t, n) {
      return this.onLeftClick(e, t, n);
    };

    t.prototype.onContextMenu = function(t, n, i) {
      i && (i.preventDefault(), i.stopPropagation());

      return e.prototype.onContextMenu.call(this, t, n, i);
    };

    return t;
  }(o.DefaultController);
  t.Controller = h;
});