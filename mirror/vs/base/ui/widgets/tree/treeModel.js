define("vs/base/ui/widgets/tree/treeModel", ["require", "exports", "vs/base/assert", "vs/base/eventEmitter",
  "vs/base/lib/winjs.base"
], function(e, t, n, i, o) {
  var r = function(e) {
    function t(t) {
      e.call(this);

      this._item = t;
    }
    __extends(t, e);

    Object.defineProperty(t.prototype, "item", {
      get: function() {
        return this._item;
      },
      enumerable: !0,
      configurable: !0
    });

    t.prototype.dispose = function() {
      this.emit("unlock");

      e.prototype.dispose.call(this);
    };

    return t;
  }(i.EventEmitter);
  t.LockData = r;
  var s = function() {
    function e() {
      this.locks = Object.create({});
    }
    e.prototype.isLocked = function(e) {
      return !!this.locks[e.id];
    };

    e.prototype.run = function(e, t) {
      var n = this;

      var i = this.getLock(e);
      if (i) {
        var s;
        return new o.Promise(function(o, r) {
          s = i.addOneTimeListener("unlock", function() {
            return n.run(e, t).then(o, r);
          });
        }, function() {
          return s();
        });
      }
      var a;
      return new o.Promise(function(i, o) {
        if (e.isDisposed()) {
          return o(new Error("Item is disposed."));
        }
        var s = n.locks[e.id] = new r(e);
        return a = t().then(function(t) {
          delete n.locks[e.id];

          s.dispose();

          return t;
        }).then(i, o);
      }, function() {
        return a.cancel();
      });
    };

    e.prototype.getLock = function(e) {
      var t;
      for (t in this.locks) {
        var n = this.locks[t];
        if (e.intersects(n.item)) {
          return n;
        }
      }
      return null;
    };

    return e;
  }();
  t.Lock = s;
  var a = function(e) {
    function t() {
      e.call(this);

      this.items = {};
    }
    __extends(t, e);

    t.prototype.register = function(e) {
      n.ok(!this.isRegistered(e.id));

      this.items[e.id] = e;

      this.emit("register", e);
    };

    t.prototype.deregister = function(e) {
      n.ok(this.isRegistered(e.id));

      delete this.items[e.id];

      this.emit("deregister", e);
    };

    t.prototype.isRegistered = function(e) {
      return this.items.hasOwnProperty(e);
    };

    t.prototype.getItem = function(e) {
      return this.items[e] || null;
    };

    t.prototype.dispose = function() {
      e.prototype.dispose.call(this);

      delete this.items;
    };

    return t;
  }(i.EventEmitter);
  t.ItemRegistry = a;
  var u = function(e) {
    function t(t, n, i, o, r) {
      e.call(this);

      this.registry = n;

      this.context = i;

      this.lock = o;

      this.element = r;

      this.id = t;

      this.registry.register(this);

      this.doesHaveChildren = this.context.dataSource.hasChildren(this.context.tree, this.element);

      this.needsChildrenRefresh = !0;

      this.parent = null;

      this.previous = null;

      this.next = null;

      this.firstChild = null;

      this.lastChild = null;

      this.userContent = null;

      this.traits = {};

      this.depth = 0;

      this.maxDepth = 0;

      this.expanded = !1;

      this.emit("item:create", {
        item: this
      });

      this.visible = this._isVisible();

      this.height = this._getHeight();

      this._isDisposed = !1;
    }
    __extends(t, e);

    t.prototype.getElement = function() {
      return this.element;
    };

    t.prototype.hasChildren = function() {
      return this.doesHaveChildren;
    };

    t.prototype.getDepth = function() {
      return this.depth;
    };

    t.prototype.getMaxDepth = function() {
      return this.maxDepth;
    };

    t.prototype.isVisible = function() {
      return this.visible;
    };

    t.prototype.setVisible = function(e) {
      this.visible = e;
    };

    t.prototype.isExpanded = function() {
      return this.expanded;
    };

    t.prototype._setExpanded = function(e) {
      this.expanded = e;
    };

    t.prototype.reveal = function(e) {
      if ("undefined" == typeof e) {
        e = null;
      }
      var t = {
        item: this,
        relativeTop: e
      };
      this.emit("item:reveal", t);
    };

    t.prototype.expand = function() {
      var e = this;
      if (this.isExpanded() || !this.doesHaveChildren || this.lock.isLocked(this)) {
        return o.Promise.as(!1);
      }
      var t = this.lock.run(this, function() {
        var t;

        var n = {
          item: e
        };
        e.emit("item:expanding", n);

        t = e.needsChildrenRefresh ? e.refreshChildren(!1, !0, !0) : o.Promise.as(null);

        return t.then(function() {
          e._setExpanded(!0);

          e.emit("item:expanded", n);

          return !0;
        });
      });
      return t.then(function(t) {
        return e.isDisposed() ? !1 : t && null !== e.firstChild && e.firstChild === e.lastChild && e.firstChild.isVisible() ?
          e.firstChild.expand().then(function() {
            return !0;
          }) : t;
      });
    };

    t.prototype.collapse = function(e) {
      if ("undefined" == typeof e) {
        e = !1;
      }
      var t = this;
      if (e) {
        var n = o.Promise.as(null);
        this.forEachChild(function(e) {
          n = n.then(function() {
            return e.collapse(!0);
          });
        });

        return n.then(function() {
          return t.collapse(!1);
        });
      }
      return !this.isExpanded() || this.lock.isLocked(this) ? o.Promise.as(!1) : this.lock.run(this, function() {
        var e = {
          item: t
        };
        t.emit("item:collapsing", e);

        t._setExpanded(!1);

        t.emit("item:collapsed", e);

        return o.Promise.as(!0);
      });
    };

    t.prototype.addTrait = function(e) {
      var t = {
        item: this,
        trait: e
      };
      this.traits[e] = !0;

      this.emit("item:addTrait", t);
    };

    t.prototype.removeTrait = function(e) {
      var t = {
        item: this,
        trait: e
      };
      delete this.traits[e];

      this.emit("item:removeTrait", t);
    };

    t.prototype.hasTrait = function(e) {
      return this.traits[e] || !1;
    };

    t.prototype.getAllTraits = function() {
      var e;

      var t = [];
      for (e in this.traits) {
        if (this.traits.hasOwnProperty(e) && this.traits[e]) {
          t.push(e);
        }
      }
      return t;
    };

    t.prototype.getHeight = function() {
      return this.height;
    };

    t.prototype.refreshChildren = function(e, n, i) {
      if ("undefined" == typeof n) {
        n = !1;
      }

      if ("undefined" == typeof i) {
        i = !1;
      }
      var r = this;
      if (!i && !this.isExpanded()) {
        this.needsChildrenRefresh = !0;
        return o.Promise.as(this);
      }
      this.needsChildrenRefresh = !1;
      var s = function() {
        var i = {
          item: r,
          isNested: n
        };
        r.emit("item:childrenRefreshing", i);
        var s;
        s = r.doesHaveChildren ? r.context.dataSource.getChildren(r.context.tree, r.element) : o.Promise.as([]);

        return s.then(function(n) {
          n = n ? n.slice(0) : [];

          n = r.sort(n);
          for (var i = {}; null !== r.firstChild;) {
            i[r.firstChild.id] = r.firstChild;
            r.removeChild(r.firstChild);
          }
          for (var s = 0, a = n.length; a > s; s++) {
            var u = n[s];

            var l = r.context.dataSource.getId(r.context.tree, u);

            var c = i[l] || new t(l, r.registry, r.context, r.lock, u);
            if (e) {
              c.needsChildrenRefresh = e;
            }

            delete i[l];

            r.addChild(c);
          }
          for (var d in i) {
            if (i.hasOwnProperty(d)) {
              i[d].dispose();
            }
          }
          return e ? o.Promise.join(r.mapEachChild(function(t) {
            return t.doRefresh(e, !0);
          })) : o.Promise.as(null);
        }).then(function() {
          r.emit("item:childrenRefreshed", i);
        });
      };
      return n ? s() : this.lock.run(this, s);
    };

    t.prototype.doRefresh = function(e, t) {
      if ("undefined" == typeof t) {
        t = !1;
      }
      var n = {
        item: this
      };
      this.doesHaveChildren = this.context.dataSource.hasChildren(this.context.tree, this.element);

      this.height = this._getHeight();

      this.setVisible(this._isVisible());

      this.emit("item:refresh", n);

      return this.refreshChildren(e, t);
    };

    t.prototype.refresh = function(e) {
      return this.doRefresh(e);
    };

    t.prototype.getNavigator = function() {
      return new c(this);
    };

    t.prototype.intersects = function(e) {
      return this.isAncestorOf(e) || e.isAncestorOf(this);
    };

    t.prototype.isAncestorOf = function(e) {
      for (; e;) {
        if (e.id === this.id) {
          return !0;
        }
        e = e.parent;
      }
      return !1;
    };

    t.prototype.addChild = function(e, t) {
      if ("undefined" == typeof t) {
        t = this.lastChild;
      }
      var n = null === this.firstChild;

      var i = null === t;

      var o = t === this.lastChild;
      if (n) {
        this.firstChild = this.lastChild = e;
        e.next = e.previous = null;
      }

      {
        if (i) {
          this.firstChild.previous = e;
          e.next = this.firstChild;
          e.previous = null;
          this.firstChild = e;
        } {
          if (o) {
            this.lastChild.next = e;
            e.next = null;
            e.previous = this.lastChild;
            this.lastChild = e;
          } {
            e.previous = t;
            e.next = t.next;
            t.next.previous = e;
            t.next = e;
          }
        }
      }

      e.parent = this;

      e.depth = this.depth + 1;
      for (var r = this, s = e.maxDepth + 1; r && r.maxDepth < s;) {
        r.maxDepth = s++;
        r = r.parent;
      }
    };

    t.prototype.removeChild = function(e) {
      var t = this.firstChild === e;

      var n = this.lastChild === e;
      if (t && n) {
        this.firstChild = this.lastChild = null;
      }

      {
        if (t) {
          e.next.previous = null;
          this.firstChild = e.next;
        } {
          if (n) {
            e.previous.next = null;
            this.lastChild = e.previous;
          } {
            e.next.previous = e.previous;
            e.previous.next = e.next;
          }
        }
      }

      e.parent = null;

      e.depth = null;
      for (var i = this, o = e.maxDepth + 1; i && i.maxDepth === o;) {
        o = i.maxDepth + 1;
        i.maxDepth = Math.max.apply(null, this.mapEachChild(function(e) {
          return e.maxDepth;
        })) + 1;
        i = i.parent;
      }
    };

    t.prototype.forEachChild = function(e) {
      for (var t, n = this.firstChild; n;) {
        t = n.next;
        e(n);
        n = t;
      }
    };

    t.prototype.mapEachChild = function(e) {
      var t = [];
      this.forEachChild(function(n) {
        t.push(e(n));
      });

      return t;
    };

    t.prototype.sort = function(e) {
      var t = this;
      return this.context.sorter ? e.sort(function(e, n) {
        return t.context.sorter.compare(t.context.tree, e, n);
      }) : e;
    };

    t.prototype._getHeight = function() {
      return this.context.renderer.getHeight(this.context.tree, this.element);
    };

    t.prototype._isVisible = function() {
      return this.context.filter.isVisible(this.context.tree, this.element);
    };

    t.prototype.isDisposed = function() {
      return this._isDisposed;
    };

    t.prototype.dispose = function() {
      this.forEachChild(function(e) {
        return e.dispose();
      });

      delete this.parent;

      delete this.previous;

      delete this.next;

      delete this.firstChild;

      delete this.lastChild;
      var t = {
        item: this
      };
      this.emit("item:dispose", t);

      this.registry.deregister(this);

      e.prototype.dispose.call(this);

      this._isDisposed = !0;
    };

    return t;
  }(i.EventEmitter);
  t.Item = u;
  var l = function(e) {
    function t(t, n, i, o, r) {
      e.call(this, t, n, i, o, r);
    }
    __extends(t, e);

    t.prototype.isVisible = function() {
      return !1;
    };

    t.prototype.setVisible = function() {};

    t.prototype.isExpanded = function() {
      return !0;
    };

    t.prototype._setExpanded = function() {};

    t.prototype.render = function() {};

    t.prototype._getHeight = function() {
      return 0;
    };

    t.prototype._isVisible = function() {
      return !1;
    };

    return t;
  }(u);

  var c = function() {
    function e(e, t) {
      if ("undefined" == typeof t) {
        t = !0;
      }

      this.item = e;

      this.start = t ? e : null;
    }
    e.lastDescendantOf = function(t) {
      return t ? t.isVisible() && t.isExpanded() && null !== t.lastChild ? e.lastDescendantOf(t.lastChild) : t : null;
    };

    e.prototype.current = function() {
      return this.item || null;
    };

    e.prototype.next = function() {
      if (this.item)
        do
          if ((this.item instanceof l || this.item.isVisible() && this.item.isExpanded()) && this.item.firstChild) {
            this.item = this.item.firstChild;
          } else if (this.item === this.start) {
        this.item = null;
      } else {
        for (; this.item && this.item !== this.start && !this.item.next;) {
          this.item = this.item.parent;
        }
        if (this.item === this.start) {
          this.item = null;
        }

        this.item = this.item ? this.item.next : null;
      }
      while (this.item && !this.item.isVisible());
      return this.item || null;
    };

    e.prototype.previous = function() {
      if (this.item)
        do {
          var t = e.lastDescendantOf(this.item.previous);
          this.item = t ? t : this.item.parent && this.item.parent !== this.start && this.item.parent.isVisible() ?
            this.item.parent : null;
        } while (this.item && !this.item.isVisible());
      return this.item || null;
    };

    e.prototype.parent = function() {
      if (this.item) {
        var e = this.item.parent;
        this.item = e && e !== this.start && e.isVisible() ? e : null;
      }
      return this.item || null;
    };

    e.prototype.first = function() {
      this.item = this.start;

      this.next();

      return this.item || null;
    };

    e.prototype.last = function() {
      this.start && this.start.isExpanded() && (this.item = this.start.lastChild, this.item && !this.item.isVisible() &&
        this.previous());

      return this.item || null;
    };

    return e;
  }();
  t.TreeNavigator = c;
  var d = function(e) {
    function t(t) {
      e.call(this);

      this.context = t;

      this.input = null;

      this.traitsToItems = {};
    }
    __extends(t, e);

    t.prototype.setInput = function(e) {
      var t = this;

      var n = {
        item: this.input
      };
      this.emit("clearingInput", n);

      this.setSelection([]);

      this.setFocus();

      this.setHighlight();

      this.lock = new s;

      if (this.input) {
        this.input.dispose();
      }

      if (this.registry) {
        this.registry.dispose();
        this.unbindRegistryListener();
      }

      this.registry = new a;

      this.unbindRegistryListener = this.registry.addListener("register", function(e) {
        var n = t.addEmitter(e);

        var i = t.registry.addListener("deregister", function(o) {
          if (o.id === e.id) {
            for (var r = o.getAllTraits(), s = 0, a = r.length; a > s; s++) {
              var u = r[s];
              delete t.traitsToItems[u][o.id];
            }
            n();

            i();
          }
        });
      });
      var i = this.context.dataSource.getId(this.context.tree, e);
      this.input = new l(i, this.registry, this.context, this.lock, e);

      n = {
        item: this.input
      };

      this.emit("setInput", n);

      return this.refresh(this.input);
    };

    t.prototype.getInput = function() {
      return this.input ? this.input.getElement() : null;
    };

    t.prototype.refresh = function(e, t) {
      if ("undefined" == typeof e) {
        e = null;
      }

      if ("undefined" == typeof t) {
        t = !0;
      }
      var n = this;

      var i = this.getItem(e);
      if (!i) {
        return o.Promise.as(null);
      }
      var r = {
        item: i,
        recursive: t
      };
      this.emit("refreshing", r);

      return i.refresh(t).then(function() {
        n.emit("refreshed", r);
      });
    };

    t.prototype.refreshAll = function(e, t) {
      if ("undefined" == typeof t) {
        t = !0;
      }
      var n = this;

      var i = [];
      this.deferredEmit(function() {
        for (var o = 0, r = e.length; r > o; o++) {
          i.push(n.refresh(e[o], t));
        }
      });

      return o.Promise.join(i);
    };

    t.prototype.expand = function(e) {
      var t = this.getItem(e);
      return t ? t.expand() : o.Promise.as(!1);
    };

    t.prototype.expandAll = function(e) {
      for (var t = [], n = 0, i = e.length; i > n; n++) {
        t.push(this.expand(e[n]));
      }
      return o.Promise.join(t);
    };

    t.prototype.collapse = function(e, t) {
      if ("undefined" == typeof t) {
        t = !1;
      }
      var n = this.getItem(e);
      return n ? n.collapse(t) : o.Promise.as(!1);
    };

    t.prototype.collapseAll = function(e, t) {
      if ("undefined" == typeof e) {
        e = null;
      }

      if ("undefined" == typeof t) {
        t = !1;
      }

      if (!e) {
        e = [this.input];
        t = !0;
      }
      for (var n = [], i = 0, r = e.length; r > i; i++) {
        n.push(this.collapse(e[i], t));
      }
      return o.Promise.join(n);
    };

    t.prototype.toggleExpansion = function(e) {
      return this.isExpanded(e) ? this.collapse(e) : this.expand(e);
    };

    t.prototype.toggleExpansionAll = function(e) {
      for (var t = [], n = 0, i = e.length; i > n; n++) {
        t.push(this.toggleExpansion(e[n]));
      }
      return o.Promise.join(t);
    };

    t.prototype.isExpanded = function(e) {
      var t = this.getItem(e);
      return t ? t.isExpanded() : !1;
    };

    t.prototype.reveal = function(e, t) {
      if ("undefined" == typeof t) {
        t = null;
      }
      var n = this;
      return this.resolveUnknownParentChain(e).then(function(e) {
        var t = o.Promise.as(null);
        e.forEach(function(e) {
          t = t.then(function() {
            return n.expand(e);
          });
        });

        return t;
      }).then(function() {
        var i = n.getItem(e);
        if (i) {
          i.reveal(t);
        }
      });
    };

    t.prototype.resolveUnknownParentChain = function(e) {
      var t = this;
      return this.context.dataSource.getParent(this.context.tree, e).then(function(e) {
        return e ? t.resolveUnknownParentChain(e).then(function(t) {
          t.push(e);

          return t;
        }) : o.Promise.as([]);
      });
    };

    t.prototype.setHighlight = function(e, t) {
      this.getHighlight();
      this.setTraits("highlighted", e ? [e] : []);
      var n = {
        highlight: this.getHighlight(),
        payload: t
      };
      this.emit("highlight", n);
    };

    t.prototype.getHighlight = function() {
      var e = this.getElementsWithTrait("highlighted");
      return 0 === e.length ? null : e[0];
    };

    t.prototype.isHighlighted = function(e) {
      var t = this.getItem(e);
      return t ? t.hasTrait("highlighted") : !1;
    };

    t.prototype.select = function(e, t) {
      this.selectAll([e], t);
    };

    t.prototype.selectAll = function(e, t) {
      this.addTraits("selected", e);
      var n = {
        selection: this.getSelection(),
        payload: t
      };
      this.emit("selection", n);
    };

    t.prototype.deselect = function(e, t) {
      this.deselectAll([e], t);
    };

    t.prototype.deselectAll = function(e, t) {
      this.removeTraits("selected", e);
      var n = {
        selection: this.getSelection(),
        payload: t
      };
      this.emit("selection", n);
    };

    t.prototype.setSelection = function(e, t) {
      this.setTraits("selected", e);
      var n = {
        selection: this.getSelection(),
        payload: t
      };
      this.emit("selection", n);
    };

    t.prototype.isSelected = function(e) {
      var t = this.getItem(e);
      return t ? t.hasTrait("selected") : !1;
    };

    t.prototype.getSelection = function() {
      return this.getElementsWithTrait("selected");
    };

    t.prototype.selectNext = function(e, t) {
      if ("undefined" == typeof e) {
        e = 1;
      }
      for (var n, i = this.getSelection(), o = i.length > 0 ? i[0] : this.input, r = this.getNavigator(o, !1), s = 0; e >
        s && (n = r.next(), n); s++) {
        o = n;
      }
      this.setSelection([o], t);
    };

    t.prototype.selectPrevious = function(e, t) {
      if ("undefined" == typeof e) {
        e = 1;
      }
      var n = this.getSelection();

      var i = null;

      var o = null;
      if (0 === n.length) {
        for (var r = this.getNavigator(this.input); i = r.next();) {
          o = i;
        }
        this.setSelection([o], t);

        return void 0;
      }
      i = n[0];
      for (var r = this.getNavigator(i, !1), s = 0; e > s && (o = r.previous(), o); s++) {
        i = o;
      }
      this.setSelection([i], t);
    };

    t.prototype.selectParent = function(e) {
      var t = this.getSelection();

      var n = t.length > 0 ? t[0] : this.input;

      var i = this.getNavigator(n, !1);

      var o = i.parent();
      if (o) {
        this.setSelection([o], e);
      }
    };

    t.prototype.setFocus = function(e, t) {
      this.setTraits("focused", e ? [e] : []);
      var n = {
        focus: this.getFocus(),
        payload: t
      };
      this.emit("focus", n);
    };

    t.prototype.isFocused = function(e) {
      var t = this.getItem(e);
      return t ? t.hasTrait("focused") : !1;
    };

    t.prototype.getFocus = function() {
      var e = this.getElementsWithTrait("focused");
      return 0 === e.length ? null : e[0];
    };

    t.prototype.focusNext = function(e, t) {
      if ("undefined" == typeof e) {
        e = 1;
      }
      for (var n, i = this.getFocus() || this.input, o = this.getNavigator(i, !1), r = 0; e > r && (n = o.next(), n); r++) {
        i = n;
      }
      this.setFocus(i, t);
    };

    t.prototype.focusPrevious = function(e, t) {
      if ("undefined" == typeof e) {
        e = 1;
      }
      for (var n, i = this.getFocus() || this.input, o = this.getNavigator(i, !1), r = 0; e > r && (n = o.previous(),
        n); r++) {
        i = n;
      }
      this.setFocus(i, t);
    };

    t.prototype.focusParent = function(e) {
      var t = this.getFocus() || this.input;

      var n = this.getNavigator(t, !1);

      var i = n.parent();
      if (i) {
        this.setFocus(i, e);
      }
    };

    t.prototype.focusFirst = function(e) {
      var t = this.getNavigator(this.input);

      var n = t.first();
      if (n) {
        this.setFocus(n, e);
      }
    };

    t.prototype.focusLast = function(e) {
      var t = this.getNavigator(this.input);

      var n = t.last();
      if (n) {
        this.setFocus(n, e);
      }
    };

    t.prototype.getNavigator = function(e, t) {
      "undefined" == typeof e && (e = null);

      "undefined" == typeof t && (t = !0);

      return new c(this.getItem(e), t);
    };

    t.prototype.isElementInTree = function(e) {
      return this.registry.isRegistered(this.context.dataSource.getId(this.context.tree, e));
    };

    t.prototype.getItem = function(e) {
      "undefined" == typeof e && (e = null);

      return null === e ? this.input : e instanceof u ? e : "string" == typeof e ? this.registry.getItem(e) : this.registry
        .getItem(this.context.dataSource.getId(this.context.tree, e));
    };

    t.prototype.addTraits = function(e, t) {
      for (var n, i = this.traitsToItems[e] || {}, o = 0, r = t.length; r > o; o++) {
        n = this.getItem(t[o]);
        if (n) {
          n.addTrait(e);
          i[n.id] = n;
        }
      }
      this.traitsToItems[e] = i;
    };

    t.prototype.removeTraits = function(e, t) {
      var n;

      var i;

      var o = this.traitsToItems[e] || {};
      if (0 === t.length) {
        for (i in o) {
          if (o.hasOwnProperty(i)) {
            n = o[i];
            n.removeTrait(e);
          }
        }
        delete this.traitsToItems[e];
      } else
        for (var r = 0, s = t.length; s > r; r++) {
          n = this.getItem(t[r]);
          if (n) {
            n.removeTrait(e);
            delete o[n.id];
          }
        }
    };

    t.prototype.setTraits = function(e, t) {
      if (0 === t.length) {
        this.removeTraits(e, t);
      } else {
        for (var n, i = {}, o = 0, r = t.length; r > o; o++) {
          n = this.getItem(t[o]);
          if (n) {
            i[n.id] = n;
          }
        }
        var s;

        var a = this.traitsToItems[e] || {};

        var u = [];
        for (s in a) {
          if (a.hasOwnProperty(s)) {
            if (i.hasOwnProperty(s)) {
              delete i[s];
            } {
              u.push(a[s]);
            }
          }
        }
        for (var o = 0, r = u.length; r > o; o++) {
          n = u[o];
          n.removeTrait(e);
          delete a[n.id];
        }
        for (s in i) {
          if (i.hasOwnProperty(s)) {
            n = i[s];
            n.addTrait(e);
            a[s] = n;
          }
        }
        this.traitsToItems[e] = a;
      }
    };

    t.prototype.getElementsWithTrait = function(e) {
      var t;

      var n = [];

      var i = this.traitsToItems[e] || {};
      for (t in i) {
        if (i.hasOwnProperty(t)) {
          n.push(i[t].getElement());
        }
      }
      return n;
    };

    t.prototype.dispose = function() {
      if (this.registry) {
        this.registry.dispose();
        this.registry = null;
      }

      e.prototype.dispose.call(this);
    };

    return t;
  }(i.EventEmitter);
  t.TreeModel = d;
});