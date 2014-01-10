var __extends = this.__extends || function(a, b) {
    function d() {
      this.constructor = a
    }
    for (var c in b) b.hasOwnProperty(c) && (a[c] = b[c]);
    d.prototype = b.prototype, a.prototype = new d
  };
define(["require", "exports", "vs/base/assert", "vs/base/eventEmitter", "vs/base/lib/winjs.base"], function(a, b, c, d,
  e) {
  var f = c,
    g = d,
    h = e,
    i = !1,
    j = function() {
      function a() {
        this.lockedItems = {}, this.lock = h.Promise.as(null)
      }
      return a.prototype.makePromise = function(a, b) {
        var c = this;
        return new h.Promise(function(d, e, f) {
          return c.lockedItems[a.id] = a, b().then(function(b) {
            return delete c.lockedItems[a.id], b
          }).then(d, e, f)
        })
      }, a.prototype.intersectLock = function(a) {
        var b;
        for (b in this.lockedItems)
          if (this.lockedItems.hasOwnProperty(b)) {
            var c = this.lockedItems[b];
            if (a.intersects(c)) return !0
          }
        return !1
      }, a.prototype.run = function(a, b) {
        var c = this,
          d = function() {
            return c.makePromise(a, b)
          }, e = this.lock;
        return this.intersectLock(a) ? this.lock = this.lock.then(d) : (e = d(), this.lock = h.Promise.join([this.lock,
          e
        ])), e
      }, a.prototype.isLocked = function(a) {
        return !!this.lockedItems[a.id]
      }, a
    }();
  b.Lock = j;
  var k = function(a) {
    function b() {
      a.call(this), this.items = {}
    }
    return __extends(b, a), b.prototype.register = function(a) {
      f.ok(!this.isRegistered(a.id)), this.items[a.id] = a, this.emit("register", a)
    }, b.prototype.deregister = function(a) {
      f.ok(this.isRegistered(a.id)), delete this.items[a.id], this.emit("deregister", a)
    }, b.prototype.isRegistered = function(a) {
      return this.items.hasOwnProperty(a)
    }, b.prototype.getItem = function(a) {
      return this.items[a] || null
    }, b.prototype.dispose = function() {
      a.prototype.dispose.call(this), delete this.items
    }, b
  }(g.EventEmitter);
  b.ItemRegistry = k;
  var l = function(a) {
    function b(b, c, d, e, f) {
      a.call(this), this.registry = c, this.context = d, this.lock = e, this.element = f, this.id = b, this.registry.register(
        this), this.doesHaveChildren = this.context.dataSource.hasChildren(this.context.tree, this.element), this.needsChildrenRefresh = !
        0, this.parent = null, this.previous = null, this.next = null, this.firstChild = null, this.lastChild = null,
        this.userContent = null, this.traits = {}, this.level = 0, this.expanded = !1, this.emit("item:create", {
          item: this
        }), this.visible = this._isVisible(), this.height = this._getHeight()
    }
    return __extends(b, a), b.prototype.getElement = function() {
      return this.element
    }, b.prototype.hasChildren = function() {
      return this.doesHaveChildren
    }, b.prototype.setHasChildren = function(a) {
      var b = a !== this.doesHaveChildren;
      this.doesHaveChildren = a;
      if (b) {
        var c = {
          item: this
        };
        this.emit("item:refresh", c)
      }
    }, b.prototype.getLevel = function() {
      return this.level
    }, b.prototype.isVisible = function() {
      return this.visible
    }, b.prototype.setVisible = function(a) {
      this.visible = a
    }, b.prototype.isExpanded = function() {
      return this.expanded
    }, b.prototype._setExpanded = function(a) {
      this.expanded = a
    }, b.prototype.reveal = function(a) {
      typeof a == "undefined" && (a = null);
      var b = {
        item: this,
        relativeTop: a
      };
      this.emit("item:reveal", b)
    }, b.prototype.expand = function() {
      var a = this;
      if (this.isExpanded() || !this.doesHaveChildren || this.lock.isLocked(this)) return h.Promise.as(!1);
      var b = this.lock.run(this, function() {
        var b = {
          item: a
        }, c;
        return a.emit("item:expanding", b), a.needsChildrenRefresh ? c = a.refreshChildren(!1, !0, !0) : c = h.Promise
          .as(null), c.then(function() {
            return a._setExpanded(!0), a.emit("item:expanded", b), !0
          })
      });
      return b.then(function(b) {
        return b && a.firstChild !== null && a.firstChild === a.lastChild ? a.firstChild.expand().then(function() {
          return !0
        }) : b
      })
    }, b.prototype.collapse = function(a) {
      typeof a == "undefined" && (a = !1);
      var b = this;
      if (a) {
        var c = h.Promise.as(null);
        return this.forEachChild(function(a) {
          c = c.then(function() {
            return a.collapse(!0)
          })
        }), c.then(function() {
          return b.collapse(!1)
        })
      }
      return !this.isExpanded() || this.lock.isLocked(this) ? h.Promise.as(!1) : this.lock.run(this, function() {
        var a = {
          item: b
        };
        return b.emit("item:collapsing", a), b._setExpanded(!1), b.emit("item:collapsed", a), h.Promise.as(!0)
      })
    }, b.prototype.addTrait = function(a) {
      var b = {
        item: this,
        trait: a
      };
      this.traits[a] = !0, this.emit("item:addTrait", b)
    }, b.prototype.removeTrait = function(a) {
      var b = {
        item: this,
        trait: a
      };
      delete this.traits[a], this.emit("item:removeTrait", b)
    }, b.prototype.hasTrait = function(a) {
      return this.traits[a] || !1
    }, b.prototype.getAllTraits = function() {
      var a = [],
        b;
      for (b in this.traits) this.traits.hasOwnProperty(b) && this.traits[b] && a.push(b);
      return a
    }, b.prototype.getHeight = function() {
      return this.height
    }, b.prototype.refreshChildren = function(a, c, d) {
      typeof c == "undefined" && (c = !1), typeof d == "undefined" && (d = !1);
      var e = this;
      if (!d && !this.isExpanded()) return this.needsChildrenRefresh = !0, h.Promise.as(this);
      this.needsChildrenRefresh = !1;
      var f, g = function() {
          var d = {
            item: e,
            isNested: c
          };
          e.emit("item:childrenRefreshing", d);
          var g;
          return e.doesHaveChildren ? g = e.context.dataSource.getChildren(e.context.tree, e.element) : g = h.Promise
            .as([]), g.then(function(c) {
              c = c ? c.slice(0) : [], c = e.sort(c), f = c.length > 0;
              var d = {};
              while (e.firstChild !== null) d[e.firstChild.id] = e.firstChild, e.removeChild(e.firstChild);
              for (var g = 0, i = c.length; g < i; g++) {
                var j = c[g],
                  k = e.context.dataSource.getId(e.context.tree, j),
                  l = d[k] || new b(k, e.registry, e.context, e.lock, j);
                a && (l.needsChildrenRefresh = a), delete d[k], e.addChild(l)
              }
              for (var k in d) d.hasOwnProperty(k) && d[k].dispose();
              return a ? h.Promise.join(e.mapEachChild(function(b) {
                return b.doRefresh(a, !0)
              })) : h.Promise.as(null)
            }).then(function() {
              e.emit("item:childrenRefreshed", d)
            })
        }, i = c ? g() : this.lock.run(this, g);
      return i.then(function() {
        e.setHasChildren(f);
        if (!e.doesHaveChildren) return e.collapse()
      })
    }, b.prototype.doRefresh = function(a, b) {
      typeof b == "undefined" && (b = !1);
      var c = {
        item: this
      };
      return this.doesHaveChildren = this.context.dataSource.hasChildren(this.context.tree, this.element), this.height =
        this._getHeight(), this.setVisible(this._isVisible()), this.emit("item:refresh", c), this.refreshChildren(a,
          b)
    }, b.prototype.refresh = function(a) {
      return this.doRefresh(a)
    }, b.prototype.getNavigator = function() {
      return new n(this)
    }, b.prototype.intersects = function(a) {
      return this.isAncestorOf(a) || a.isAncestorOf(this)
    }, b.prototype.isAncestorOf = function(a) {
      while (a) {
        if (a.id === this.id) return !0;
        a = a.parent
      }
      return !1
    }, b.prototype.addChild = function(a, b) {
      typeof b == "undefined" && (b = this.lastChild);
      var c = this.firstChild === null,
        d = b === null,
        e = b === this.lastChild;
      c ? (this.firstChild = this.lastChild = a, a.next = a.previous = null) : d ? (this.firstChild.previous = a, a.next =
        this.firstChild, a.previous = null, this.firstChild = a) : e ? (this.lastChild.next = a, a.next = null, a.previous =
        this.lastChild, this.lastChild = a) : (a.previous = b, a.next = b.next, b.next.previous = a, b.next = a), a.parent =
        this, a.level = this.level + 1
    }, b.prototype.removeChild = function(a) {
      var b = this.firstChild === a,
        c = this.lastChild === a;
      b && c ? this.firstChild = this.lastChild = null : b ? (a.next.previous = null, this.firstChild = a.next) : c ?
        (a.previous.next = null, this.lastChild = a.previous) : (a.next.previous = a.previous, a.previous.next = a.next),
        a.parent = null, a.level = null
    }, b.prototype.forEachChild = function(a) {
      var b = this.firstChild,
        c;
      while (b) c = b.next, a(b), b = c
    }, b.prototype.mapEachChild = function(a) {
      var b = [];
      return this.forEachChild(function(c) {
        b.push(a(c))
      }), b
    }, b.prototype.sort = function(a) {
      var b = this;
      return this.context.sorter ? a.sort(function(a, c) {
        return b.context.sorter.compare(b.context.tree, a, c)
      }) : a
    }, b.prototype._getHeight = function() {
      return this.context.renderer.getHeight(this.context.tree, this.element)
    }, b.prototype._isVisible = function() {
      return this.context.filter.isVisible(this.context.tree, this.element)
    }, b.prototype.dispose = function() {
      this.forEachChild(function(a) {
        return a.dispose()
      }), delete this.parent, delete this.previous, delete this.next, delete this.firstChild, delete this.lastChild;
      var b = {
        item: this
      };
      this.emit("item:dispose", b), this.registry.deregister(this), a.prototype.dispose.call(this)
    }, b
  }(g.EventEmitter);
  b.Item = l;
  var m = function(a) {
    function b(b, c, d, e, f) {
      a.call(this, b, c, d, e, f)
    }
    return __extends(b, a), b.prototype.isVisible = function() {
      return !1
    }, b.prototype.setVisible = function(a) {}, b.prototype.isExpanded = function() {
      return !0
    }, b.prototype._setExpanded = function(a) {}, b.prototype.render = function() {}, b.prototype._getHeight =
      function() {
        return 0
    }, b.prototype._isVisible = function() {
      return !1
    }, b
  }(l),
    n = function() {
      function a(a, b) {
        typeof b == "undefined" && (b = !0), this.item = a, this.start = b ? a : null
      }
      return a.lastDescendantOf = function(b) {
        return b ? !b.isVisible() || !b.isExpanded() || b.lastChild === null ? b : a.lastDescendantOf(b.lastChild) :
          null
      }, a.prototype.current = function() {
        return this.item || null
      }, a.prototype.next = function() {
        if (this.item)
          do
            if ((this.item instanceof m || this.item.isVisible() && this.item.isExpanded()) && this.item.firstChild)
              this.item = this.item.firstChild;
            else if (this.item === this.start) this.item = null;
        else {
          while (this.item && this.item !== this.start && !this.item.next) this.item = this.item.parent;
          this.item === this.start && (this.item = null), this.item = this.item ? this.item.next : null
        }
        while (this.item && !this.item.isVisible());
        return this.item || null
      }, a.prototype.previous = function() {
        if (this.item)
          do {
            var b = a.lastDescendantOf(this.item.previous);
            b ? this.item = b : this.item.parent && this.item.parent !== this.start && this.item.parent.isVisible() ?
              this.item = this.item.parent : this.item = null
          } while (this.item && !this.item.isVisible());
        return this.item || null
      }, a.prototype.parent = function() {
        if (this.item) {
          var a = this.item.parent;
          a && a !== this.start && a.isVisible() ? this.item = a : this.item = null
        }
        return this.item || null
      }, a.prototype.first = function() {
        return this.item = this.start, this.next(), this.item || null
      }, a.prototype.last = function() {
        return this.start && this.start.isExpanded() && (this.item = this.start.lastChild, this.item && !this.item.isVisible() &&
          this.previous()), this.item || null
      }, a
    }();
  b.TreeNavigator = n;
  var o = function(a) {
    function b(b) {
      a.call(this), this.context = b, this.input = null, this.traitsToItems = {}
    }
    return __extends(b, a), b.prototype.setInput = function(a) {
      var b = this,
        c = {
          item: this.input
        };
      this.emit("clearingInput", c), this.setSelection([]), this.setFocus(), this.setHighlight(), this.lock = new j,
        this.input && this.input.dispose(), this.registry && (this.registry.dispose(), this.unbindRegistryListener()),
        this.registry = new k, this.unbindRegistryListener = this.registry.addListener("register", function(a) {
          var c = b.addEmitter(a),
            d = b.registry.addListener("deregister", function(e) {
              if (e.id === a.id) {
                var f = e.getAllTraits();
                for (var g = 0, h = f.length; g < h; g++) {
                  var i = f[g];
                  delete b.traitsToItems[i][e.id]
                }
                c(), d()
              }
            })
        });
      var d = this.context.dataSource.getId(this.context.tree, a);
      return this.input = new m(d, this.registry, this.context, this.lock, a), c = {
        item: this.input
      }, this.emit("setInput", c), this.refresh(this.input)
    }, b.prototype.getInput = function() {
      return this.input ? this.input.getElement() : null
    }, b.prototype.refresh = function(a, b) {
      typeof a == "undefined" && (a = null), typeof b == "undefined" && (b = !0);
      var c = this;
      try {
        var d = this.getItem(a)
      } catch (e) {
        return h.Promise.as(null)
      }
      var f = {
        item: d,
        recursive: b
      };
      return this.emit("refreshing", f), d.refresh(b).then(function() {
        c.emit("refreshed", f)
      })
    }, b.prototype.refreshAll = function(a, b) {
      typeof b == "undefined" && (b = !0);
      var c = this,
        d = [];
      return this.deferredEmit(function() {
        for (var e = 0, f = a.length; e < f; e++) d.push(c.refresh(a[e], b))
      }), h.Promise.join(d)
    }, b.prototype.expand = function(a) {
      try {
        return this.getItem(a).expand()
      } catch (b) {
        return h.Promise.as(!1)
      }
    }, b.prototype.expandAll = function(a) {
      var b = [];
      for (var c = 0, d = a.length; c < d; c++) b.push(this.expand(a[c]));
      return h.Promise.join(b)
    }, b.prototype.collapse = function(a, b) {
      typeof b == "undefined" && (b = !1);
      try {
        return this.getItem(a).collapse(b)
      } catch (c) {
        return h.Promise.as(!1)
      }
    }, b.prototype.collapseAll = function(a, b) {
      typeof a == "undefined" && (a = null), typeof b == "undefined" && (b = !1), a || (a = [this.input], b = !0);
      var c = [];
      for (var d = 0, e = a.length; d < e; d++) c.push(this.collapse(a[d], b));
      return h.Promise.join(c)
    }, b.prototype.toggleExpansion = function(a) {
      return this.isExpanded(a) ? this.collapse(a) : this.expand(a)
    }, b.prototype.toggleExpansionAll = function(a) {
      var b = [];
      for (var c = 0, d = a.length; c < d; c++) b.push(this.toggleExpansion(a[c]));
      return h.Promise.join(b)
    }, b.prototype.isExpanded = function(a) {
      try {
        return this.getItem(a).isExpanded()
      } catch (b) {
        return !1
      }
    }, b.prototype.reveal = function(a, b) {
      typeof b == "undefined" && (b = null);
      var c = this;
      return this.resolveUnknownParentChain(a).then(function(a) {
        var b = h.Promise.as(null);
        return a.forEach(function(a) {
          b = b.then(function() {
            return c.expand(a)
          })
        }), b
      }).then(function() {
        try {
          c.getItem(a).reveal(b)
        } catch (d) {}
      })
    }, b.prototype.resolveUnknownParentChain = function(a) {
      var b = this;
      return this.context.dataSource.getParent(this.context.tree, a).then(function(a) {
        return a ? b.resolveUnknownParentChain(a).then(function(b) {
          return b.push(a), b
        }) : h.Promise.as([])
      })
    }, b.prototype.setHighlight = function(a, b) {
      var c = this.getHighlight();
      this.setTraits("highlighted", a ? [a] : []), c && this.isElementInTree(c) && c !== a && this.refresh(c, !1);
      var d = {
        highlight: this.getHighlight(),
        payload: b
      };
      this.emit("highlight", d)
    }, b.prototype.getHighlight = function() {
      var a = this.getElementsWithTrait("highlighted");
      return a.length === 0 ? null : a[0]
    }, b.prototype.isHighlighted = function(a) {
      try {
        return this.getItem(a).hasTrait("highlighted")
      } catch (b) {
        return !1
      }
    }, b.prototype.select = function(a, b) {
      this.selectAll([a], b)
    }, b.prototype.selectAll = function(a, b) {
      this.addTraits("selected", a);
      var c = {
        selection: this.getSelection(),
        payload: b
      };
      this.emit("selection", c)
    }, b.prototype.deselect = function(a, b) {
      this.deselectAll([a], b)
    }, b.prototype.deselectAll = function(a, b) {
      this.removeTraits("selected", a);
      var c = {
        selection: this.getSelection(),
        payload: b
      };
      this.emit("selection", c)
    }, b.prototype.setSelection = function(a, b) {
      this.setTraits("selected", a);
      var c = {
        selection: this.getSelection(),
        payload: b
      };
      this.emit("selection", c)
    }, b.prototype.isSelected = function(a) {
      try {
        return this.getItem(a).hasTrait("selected")
      } catch (b) {
        return !1
      }
    }, b.prototype.getSelection = function() {
      return this.getElementsWithTrait("selected")
    }, b.prototype.selectNext = function(a, b) {
      typeof a == "undefined" && (a = 1);
      var c = this.getSelection(),
        d = c.length > 0 ? c[0] : this.input,
        e, f = this.getNavigator(d, !1);
      for (var g = 0; g < a; g++) {
        e = f.next();
        if (!e) break;
        d = e
      }
      this.setSelection([d], b)
    }, b.prototype.selectPrevious = function(a, b) {
      typeof a == "undefined" && (a = 1);
      var c = this.getSelection();
      if (c.length === 0) {
        var d = this.getNavigator(this.input),
          e = null,
          f = null;
        while (e = d.next()) f = e;
        this.setSelection([f], b);
        return
      }
      var e = c[0],
        f, d = this.getNavigator(e, !1);
      for (var g = 0; g < a; g++) {
        f = d.previous();
        if (!f) break;
        e = f
      }
      this.setSelection([e], b)
    }, b.prototype.selectParent = function(a) {
      var b = this.getSelection(),
        c = b.length > 0 ? b[0] : this.input,
        d = this.getNavigator(c, !1),
        e = d.parent();
      e && this.setSelection([e], a)
    }, b.prototype.setFocus = function(a, b) {
      this.setTraits("focused", a ? [a] : []);
      var c = {
        focus: this.getFocus(),
        payload: b
      };
      this.emit("focus", c)
    }, b.prototype.isFocused = function(a) {
      try {
        return this.getItem(a).hasTrait("focused")
      } catch (b) {
        return !1
      }
    }, b.prototype.getFocus = function() {
      var a = this.getElementsWithTrait("focused");
      return a.length === 0 ? null : a[0]
    }, b.prototype.focusNext = function(a, b) {
      typeof a == "undefined" && (a = 1);
      var c = this.getFocus() || this.input,
        d, e = this.getNavigator(c, !1);
      for (var f = 0; f < a; f++) {
        d = e.next();
        if (!d) break;
        c = d
      }
      this.setFocus(c, b)
    }, b.prototype.focusPrevious = function(a, b) {
      typeof a == "undefined" && (a = 1);
      var c = this.getFocus() || this.input,
        d, e = this.getNavigator(c, !1);
      for (var f = 0; f < a; f++) {
        d = e.previous();
        if (!d) break;
        c = d
      }
      this.setFocus(c, b)
    }, b.prototype.focusParent = function(a) {
      var b = this.getFocus() || this.input,
        c = this.getNavigator(b, !1),
        d = c.parent();
      d && this.setFocus(d, a)
    }, b.prototype.focusFirst = function(a) {
      var b = this.getNavigator(this.input),
        c = b.first();
      c && this.setFocus(c, a)
    }, b.prototype.focusLast = function(a) {
      var b = this.getNavigator(this.input),
        c = b.last();
      c && this.setFocus(c, a)
    }, b.prototype.getNavigator = function(a, b) {
      typeof a == "undefined" && (a = null), typeof b == "undefined" && (b = !0);
      var c = null;
      try {
        c = this.getItem(a)
      } catch (d) {}
      return new n(c, b)
    }, b.prototype.isElementInTree = function(a) {
      return this.registry.isRegistered(this.context.dataSource.getId(this.context.tree, a))
    }, b.prototype.getItem = function(a) {
      typeof a == "undefined" && (a = null);
      var b;
      a === null ? b = this.input : a instanceof l ? b = a : typeof a == "string" ? b = this.registry.getItem(a) : b =
        this.registry.getItem(this.context.dataSource.getId(this.context.tree, a));
      if (b === null) throw new Error("No such element in the tree");
      return b
    }, b.prototype.addTraits = function(a, b) {
      var c = this.traitsToItems[a] || {}, d;
      for (var e = 0, f = b.length; e < f; e++) try {
        d = this.getItem(b[e]), d.addTrait(a), c[d.id] = d
      } catch (g) {}
      this.traitsToItems[a] = c
    }, b.prototype.removeTraits = function(a, b) {
      var c = this.traitsToItems[a] || {}, d, e;
      if (b.length === 0) {
        for (e in c) c.hasOwnProperty(e) && (d = c[e], d.removeTrait(a));
        delete this.traitsToItems[a]
      } else
        for (var f = 0, g = b.length; f < g; f++) try {
          d = this.getItem(b[f]), d.removeTrait(a), delete c[d.id]
        } catch (h) {}
    }, b.prototype.setTraits = function(a, b) {
      if (b.length === 0) this.removeTraits(a, b);
      else {
        var c = {}, d;
        for (var e = 0, f = b.length; e < f; e++) try {
          d = this.getItem(b[e]), c[d.id] = d
        } catch (g) {}
        var h = this.traitsToItems[a] || {}, i = [],
          j;
        for (j in h) h.hasOwnProperty(j) && (c.hasOwnProperty(j) ? delete c[j] : i.push(h[j]));
        for (var e = 0, f = i.length; e < f; e++) d = i[e], d.removeTrait(a), delete h[d.id];
        for (j in c) c.hasOwnProperty(j) && (d = c[j], d.addTrait(a), h[j] = d);
        this.traitsToItems[a] = h
      }
    }, b.prototype.getElementsWithTrait = function(a) {
      var b = [],
        c = this.traitsToItems[a] || {}, d;
      for (d in c) c.hasOwnProperty(d) && b.push(c[d].getElement());
      return b
    }, b.prototype.dispose = function() {
      this.registry && (this.registry.dispose(), this.registry = null), a.prototype.dispose.call(this)
    }, b
  }(g.EventEmitter);
  b.TreeModel = o
})