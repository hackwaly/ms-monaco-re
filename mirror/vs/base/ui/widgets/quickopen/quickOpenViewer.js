var __extends = this.__extends || function(a, b) {
    function d() {
      this.constructor = a
    }
    for (var c in b) b.hasOwnProperty(c) && (a[c] = b[c]);
    d.prototype = b.prototype, a.prototype = new d
  };
define(["require", "exports", "vs/base/lib/winjs.base", "vs/base/dom/builder", "vs/base/ui/widgets/tree/treeDefaults",
  "vs/base/ui/widgets/highlightedLabel", "vs/base/ui/widgets/quickopen/quickOpenModel"
], function(a, b, c, d, e, f, g) {
  var h = c,
    i = d,
    j = e,
    k = f,
    l = g,
    m = i.$,
    n = function() {
      function a() {}
      return a.prototype.getId = function(b, c) {
        return c instanceof l.QuickOpenModel ? a.ROOT : c instanceof l.QuickOpenEntry ? c.getId() : null
      }, a.prototype.hasChildren = function(a, b) {
        return b instanceof l.QuickOpenModel ? b.getEntries().length > 0 : !1
      }, a.prototype.getChildren = function(a, b) {
        return b instanceof l.QuickOpenModel ? h.Promise.as(b.getEntries()) : h.Promise.as([])
      }, a.prototype.getParent = function(a, b) {
        return h.Promise.as(null)
      }, a.ROOT = "__root__", a
    }();
  b.DataSource = n;
  var o = function() {
    function a() {}
    return a.prototype.getHeight = function(a, b) {
      return b instanceof l.QuickOpenEntryItem ? b.getHeight() : 24
    }, a.prototype.render = function(a, b, c, d) {
      var e = null;
      if (b instanceof l.QuickOpenEntry) {
        var f = b;
        if (f instanceof l.QuickOpenEntryItem) return b.render(a, c, d);
        if (f instanceof l.QuickOpenEntryGroup) {
          var g = f;
          g.showBorder() && m(c).addClass("results-group-separator"), g.getGroupLabel() && m(c).div(function(a) {
            a.addClass("results-group"), a.attr({
              text: g.getGroupLabel()
            })
          })
        }
        m(c).div(function(a) {
          a.addClass("quick-open-entry"), f.getIcon() && a.append(m("span", {
            "class": "quick-open-entry-icon " + f.getIcon()
          }));
          var b = f.getHighlights();
          if (b && b.length > 0) {
            var c = a.getProperty("highlightedLabel");
            c || (c = new k.HighlightedLabel(a), a.setProperty("highlightedLabel", c)), e = function() {
              c.destroy()
            }, c.setValue(f.getLabel(), b)
          } else f.getLabel() && a.span({
            text: f.getLabel(),
            "class": "quick-open-entry-label"
          });
          f.getDescription() && a.span({
            text: f.getDescription(),
            "class": "quick-open-entry-description"
          })
        })
      }
      return e
    }, a
  }();
  b.Renderer = o;
  var p = function(a) {
    function b() {
      a.apply(this, arguments)
    }
    return __extends(b, a), b.prototype.onClick = function(a, b, c) {
      return this.onLeftClick(a, b, c)
    }, b
  }(j.DefaultController);
  b.Controller = p
})