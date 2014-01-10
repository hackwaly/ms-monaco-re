var __extends = this.__extends || function(a, b) {
    function d() {
      this.constructor = a
    }
    for (var c in b) b.hasOwnProperty(c) && (a[c] = b[c]);
    d.prototype = b.prototype, a.prototype = new d
  };
define(["require", "exports", "vs/nls", "vs/base/strings", "vs/base/lifecycle", "vs/base/errors", "vs/base/dom/builder",
  "vs/base/ui/actions", "vs/base/ui/widgets/actionbar", "vs/css!./actionsRenderer"
], function(a, b, c, d, e, f, g, h, i) {
  var j = c,
    k = d,
    l = e,
    m = f,
    n = g,
    o = h,
    p = i,
    q = n.$,
    r = function(a) {
      function b(c, d, e) {
        a.call(this, b.ID, j.localize("toggleActions", "Toggle Actions"), "toggle-more"), this.tree = c, this.element =
          d, this.data = e
      }
      return __extends(b, a), b.prototype.run = function() {
        var a = this,
          b;
        if (this.data.isMoreToggled) this.tree.clearHighlight(), this.data.isMoreToggled = !1, b = this.tree.refresh(
          this.element, !1);
        else {
          this.tree.setHighlight(this.element), this.data.isMoreToggled = !0;
          var c = this.tree.addListener("item:removeTrait", function(b) {
            if (b.trait === "highlighted") {
              c(), a.data.isMoreToggled = !1;
              try {
                a.tree.refresh(a.element, !1)
              } catch (d) {}
            }
          });
          b = this.tree.refresh(this.element, !1)
        }
        return b.then(function() {
          a.tree.DOMFocus()
        })
      }, b.ID = "base.tree.actions.toggleSecondaryActions", b
    }(o.Action);
  b.ToggleSecondaryActionsAction = r;
  var s = function() {
    function a() {}
    return a.prototype.ElementData = function() {
      this.isMoreToggled = !1, this.secondaryActionCount = 0, this.primaryActions = null, this.secondaryActions =
        null, this.subContainer = null, this.cleanupFn = null, this.primaryActionBar = null, this.secondaryActionBar =
        null, this.secondaryActionBarListener = null
    }, a
  }();
  b.ElementData = s;
  var t = function() {
    function a(a, b) {
      this.dataSource = a, this.actionProvider = b, this.elementsMap = {}, this.toDispose = []
    }
    return a.prototype.setTree = function(a) {
      this.toDispose.push(a.addListener2("item:create", this.onItemCreate.bind(this))), this.toDispose.push(a.addListener2(
        "item:dispose", this.onItemDispose.bind(this)))
    }, a.prototype.onItemCreate = function(a) {
      this.elementsMap[a.item.id] = new s
    }, a.prototype.onItemDispose = function(a) {
      delete this.elementsMap[a.item.id]
    }, a.prototype.getActionProvider = function() {
      return this.actionProvider
    }, a.prototype.getHeight = function(a, b) {
      var c = this.getKey(a, b),
        d = this.elementsMap[c];
      if (!d) throw new Error(k.format("Could not find data for element '{0}'.", c));
      var e = 0;
      return d.isMoreToggled && (e = 7 + Object.keys(d.secondaryActions).length * 20), this.getContentHeight(a, b) +
        e
    }, a.prototype.render = function(a, b, c) {
      var d = this.getKey(a, b),
        e = this.elementsMap[d];
      if (!e) throw new Error(k.format("Could not find data for element '{0}'", d));
      var f = q(c).addClass("actions");
      e.subContainer || (e.subContainer = q(".sub-content")), f.getHTMLElement().children[0] !== e.subContainer.getHTMLElement() &&
        e.subContainer.appendTo(f, 0), e.cleanupFn = this.renderContents(a, b, e.subContainer.getHTMLElement(), e.cleanupFn),
        e.isMoreToggled ? f.addClass("more") : f.removeClass("more");
      var g = this.actionProvider.hasActions(a, b),
        h = this.actionProvider.hasSecondaryActions(a, b);
      if (g || h) {
        e.primaryActionBar || (e.primaryActionBar = new p.ActionBar(q(".primary-action-bar").appendTo(f), {
          context: this.getActionContext(a, b)
        })), e.primaryActionBar.clear(), e.primaryActions = {};
        if (g) this.actionProvider.getActions(a, b).then(function(c) {
          e.primaryActionBar.push(c, {
            icon: !0,
            label: !1
          }), c.forEach(function(a) {
            e.primaryActions[a.id] = a
          });
          if (h) {
            var d = new r(a, b, e);
            e.primaryActionBar.push([d], {
              icon: !0,
              label: !1
            }), e.primaryActions[d.id] = d
          }
        });
        else {
          var i = new r(a, b, e);
          e.primaryActionBar.push([i], {
            icon: !0,
            label: !1
          }), e.primaryActions[i.id] = i
        } if (h) {
          if (e.isMoreToggled || !e.secondaryActions) e.secondaryActionBar || (e.secondaryActionBar = new p.ActionBar(
            q(".secondary-action-bar").appendTo(f), {
              orientation: p.ActionsOrientation.VERTICAL,
              context: this.getActionContext(a, b),
              actionItemProvider: this.actionProvider.getActionItem.bind(this.actionProvider, a, b)
            }), e.secondaryActionBarListener = e.secondaryActionBar.addListener("run", function() {
            e.isMoreToggled = !1;
            try {
              a.refresh(b)
            } catch (c) {}
          })), e.secondaryActions = {}, this.actionProvider.getSecondaryActions(a, b).then(function(a) {
            e.secondaryActionBar.clear(), e.secondaryActionBar.push(a), a.forEach(function(a) {
              e.secondaryActions[a.id] = a
            })
          })
        } else e.secondaryActionBar && (e.secondaryActionBar.dispose(), e.secondaryActionBar = null, e.secondaryActionBarListener(),
          e.secondaryActionBarListener = null)
      } else e.primaryActionBar && (e.primaryActionBar.dispose(), e.primaryActionBar = null), e.secondaryActionBar &&
        (e.secondaryActionBar.dispose(), e.secondaryActionBar = null, e.secondaryActionBarListener(), e.secondaryActionBarListener =
        null);
      return this.cleanup.bind(this, a, b, e)
    }, a.prototype.getContentHeight = function(a, b) {
      return 20
    }, a.prototype.renderContents = function(a, b, c, d) {
      return null
    }, a.prototype.getActionContext = function(a, b) {
      return null
    }, a.prototype.cleanup = function(a, b, c) {
      c.cleanupFn && (c.cleanupFn(a, b), c.cleanupFn = null), c.primaryActionBar && (c.primaryActionBar.dispose(), c.primaryActionBar =
        null), c.secondaryActionBar && (c.secondaryActionBar.dispose(), c.secondaryActionBar = null), c.secondaryActionBarListener &&
        (c.secondaryActionBarListener(), c.secondaryActionBarListener = null), c.subContainer && (c.subContainer.destroy(),
        c.subContainer = null)
    }, a.prototype.getKey = function(a, b) {
      return this.dataSource.getId(a, b)
    }, a.prototype.runAction = function(a, b, c) {
      var d = this.getKey(a, b),
        e = this.elementsMap[d];
      if (e) {
        var f;
        e.primaryActions && e.primaryActions[c] && e.primaryActions[c].enabled ? f = e.primaryActions[c].run(this.getActionContext(
          a, b)) : e.secondaryActions && e.secondaryActions[c] && e.secondaryActions[c].enabled && (f = e.secondaryActions[
          c].run(this.getActionContext(a, b))), f && f.done(null, m.onUnexpectedError)
      }
    }, a.prototype.dispose = function() {
      this.toDispose = l.disposeAll(this.toDispose)
    }, a.BINDING = "monaco-tree-actionsRenderer", a
  }();
  b.ActionsRenderer = t
})