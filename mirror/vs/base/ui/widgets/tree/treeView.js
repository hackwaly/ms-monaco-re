define("vs/base/ui/widgets/tree/treeView", ["require", "exports", "./tree", "vs/base/env", "vs/base/lib/winjs.base",
  "vs/base/dom/dom", "vs/base/types", "vs/base/eventEmitter", "vs/base/diff/diff", "vs/base/dom/touch",
  "vs/base/dom/mouseEvent", "vs/base/dom/keyboardEvent", "vs/base/ui/scrollbar/impl/scrollableElement"
], function(e, t, n, i, o, r, s, a, u, l, c, d, h) {
  var p = function() {
    function e(e, t, n) {
      if ("undefined" == typeof t) {
        t = 0;
      }

      if ("undefined" == typeof n) {
        n = e.length;
      }

      this.items = e;

      this.start = t;

      this.end = n;

      this.index = t - 1;
    }
    e.prototype.next = function() {
      this.index = Math.min(this.index + 1, this.end);

      return this.index === this.end ? null : this.items[this.index];
    };

    return e;
  }();
  t.ArrayIterator = p;
  var f = function() {
    function e(e) {
      this.elements = e;
    }
    e.prototype.update = function() {};

    e.prototype.getData = function() {
      return this.elements;
    };

    return e;
  }();
  t.ElementsDragAndDropData = f;
  var g = function() {
    function e() {}
    e.prototype.update = function(e) {
      this.types = e.dataTransfer.types || this.types;

      this.files = e.dataTransfer.files || this.files;
    };

    e.prototype.getData = function() {
      return {
        types: this.types,
        files: this.files
      };
    };

    return e;
  }();
  t.DesktopDragAndDropData = g;
  var m = function() {
    function e(e, t, n) {
      this.context = e;

      this.model = t;

      this.id = this.model.id;

      this.top = n;

      this.height = t.getHeight();

      this._styles = {};

      if (t.isExpanded()) {
        this.addClass("expanded");
      }
    }
    Object.defineProperty(e.prototype, "expanded", {
      set: function(e) {
        e ? this.addClass("expanded") : this.removeClass("expanded");
      },
      enumerable: !0,
      configurable: !0
    });

    Object.defineProperty(e.prototype, "loading", {
      set: function(e) {
        e ? this.addClass("loading") : this.removeClass("loading");
      },
      enumerable: !0,
      configurable: !0
    });

    Object.defineProperty(e.prototype, "draggable", {
      get: function() {
        return this._draggable;
      },
      set: function(e) {
        this._draggable = e;

        this.render(!0);
      },
      enumerable: !0,
      configurable: !0
    });

    Object.defineProperty(e.prototype, "dropTarget", {
      set: function(e) {
        e ? this.addClass("drop-target") : this.removeClass("drop-target");
      },
      enumerable: !0,
      configurable: !0
    });

    e.prototype.addClass = function(e) {
      this._styles[e] = !0;

      this.render(!0);
    };

    e.prototype.removeClass = function(e) {
      delete this._styles[e];

      this.render(!0);
    };

    e.prototype.render = function(e) {
      if ("undefined" == typeof e) {
        e = !1;
      }
      var t = this;
      if (this.row) {
        var n = ["row"];
        n.push.apply(n, Object.keys(this._styles));

        if (this.model.hasChildren()) {
          n.push("has-children");
        }

        this.row.className = n.join(" ");

        this.row.draggable = this.draggable;

        this.row.style.height = this.height + "px";

        this.row.style.paddingLeft = this.context.options.twistiePixels + (this.model.getDepth() - 1) * this.context.options
          .indentPixels + "px";
        var i = this.context.dnd.getDragURI(this.context.tree, this.model.getElement());
        if (i !== this.uri) {
          if (this.unbindDragStart) {
            this.unbindDragStart();
            delete this.unbindDragStart;
          }
          i ? (this.uri = i, this.draggable = !0, this.unbindDragStart = r.addListener(this.row, "dragstart",
            function(e) {
              t.onDragStart(e);
            })) : this.uri = null;
        }

        if (!e) {
          this.renderCleanupFn = this.context.renderer.render(this.context.tree, this.model.getElement(), this.row.firstChild,
            this.renderCleanupFn);
        }
      }
    };

    e.prototype.insertInDOM = function(e, t) {
      if (!this.row) {
        var n = document.createElement("div");
        n.className = "content";

        this.row = document.createElement("div");

        this.row[_.BINDING] = this;

        this.row.appendChild(n);
      }
      if (!this.row.parentElement) {
        null === t ? e.appendChild(this.row) : e.insertBefore(this.row, t);
        this.render();
      }
    };

    e.prototype.removeFromDOM = function() {
      if (this.row) {
        if (this.unbindDragStart) {
          this.unbindDragStart();
          this.unbindDragStart = null;
        }
        if (this.renderCleanupFn) {
          this.renderCleanupFn(this.context.tree, this.model.getElement());
        }
        this.uri = null;
        this.row.parentElement.removeChild(this.row);
        this.row = null;
      }
    };

    e.prototype.dispose = function() {
      this.renderCleanupFn = null;

      this.row = null;

      this.model = null;
    };

    return e;
  }();
  t.ViewItem = m;
  var v = function(e) {
    function t(t, n, i) {
      e.call(this, t, n, 0);

      this.row = i;
    }
    __extends(t, e);

    t.prototype.render = function() {
      if (this.row) {
        var e = ["monaco-vtree-wrapper"];
        e.push.apply(e, Object.keys(this._styles));

        if (this.model.hasChildren()) {
          e.push("has-children");
        }

        this.row.className = e.join(" ");
      }
    };

    t.prototype.insertInDOM = function() {};

    t.prototype.removeFromDOM = function() {};

    return t;
  }(m);

  var y = function(e) {
    function t(t) {
      e.call(this);

      this.context = t;

      this.heightMap = [];

      this.indexes = {};
    }
    __extends(t, e);

    t.prototype.getTotalHeight = function() {
      var e = this.heightMap[this.heightMap.length - 1];
      return e ? e.top + e.height : 0;
    };

    t.prototype.onInsertItems = function(e, t) {
      if ("undefined" == typeof t) {
        t = null;
      }
      var n;

      var i;

      var o;

      var r;

      var a;

      var u = s.isArray(e) ? new p(e) : e;

      var l = 0;
      null === t ? (o = 0, a = 0) : (o = this.indexes[t] + 1, a = this.heightMap[o - 1].top + this.heightMap[o - 1].height);
      for (var c = this.heightMap.splice.bind(this.heightMap, o, 0), d = []; n = u.next();) {
        i = new m(this.context, n, a + l);
        this.emit("viewItem:create", {
          item: i.model
        });
        this.indexes[n.id] = o++;
        d.push(i);
        l += i.height;
      }
      for (c.apply(this.heightMap, d), r = o; r < this.heightMap.length; r++) {
        i = this.heightMap[r];
        i.top += l;
        this.indexes[i.id] = r;
      }
      for (r = d.length - 1; r >= 0; r--) {
        this.onInsertItem(d[r]);
      }
      for (r = o; r < this.heightMap.length; r++) {
        this.onRefreshItem(this.heightMap[r]);
      }
    };

    t.prototype.onInsertItem = function() {};

    t.prototype.onRemoveItems = function(e) {
      for (var t, n, i, o = s.isArray(e) ? new p(e) : e, r = null, a = 0; t = o.next();) {
        t = t.id || t;
        i = this.indexes[t];
        n = this.heightMap[i];
        a -= n.height;
        delete this.indexes[t];
        this.onRemoveItem(n);
        if (null === r) {
          r = i;
        }
      }
      if (0 !== a)
        for (this.heightMap.splice(r, i - r + 1), i = r; i < this.heightMap.length; i++) {
          n = this.heightMap[i];
          n.top += a;
          this.indexes[n.id] = i;
          this.onRefreshItem(n);
        }
    };

    t.prototype.onRemoveItem = function() {};

    t.prototype.onRefreshItemSet = function(e) {
      var t = this;
      this.onRefreshItems(e.sort(function(e, n) {
        return t.indexes[e.id] - t.indexes[n.id];
      }));
    };

    t.prototype.onRefreshItems = function(e) {
      for (var t, n, i, o, r = s.isArray(e) ? new p(e) : e, a = null, u = 0; t = r.next();) {
        for (o = this.indexes[t.id]; 0 !== u && null !== a && o > a; a++) {
          n = this.heightMap[a];
          n.top += u;
          this.onRefreshItem(n);
        }
        n = this.heightMap[o];

        i = t.getHeight();

        n.top += u;

        u += i - n.height;

        n.height = i;

        this.onRefreshItem(n, !0);

        a = o + 1;
      }
      if (0 !== u && null !== a)
        for (; a < this.heightMap.length; a++) {
          n = this.heightMap[a];
          n.top += u;
          this.onRefreshItem(n);
        }
    };

    t.prototype.onRefreshItem = function(e, t) {
      if ("undefined" == typeof t) {
        t = !1;
      }
    };

    t.prototype.itemsCount = function() {
      return this.heightMap.length;
    };

    t.prototype.itemAt = function(e) {
      return this.heightMap[this.indexAt(e)].id;
    };

    t.prototype.withItemsInRange = function(e, t, n) {
      e = this.indexAt(e);

      t = this.indexAt(t);
      for (var i = e; t >= i; i++) {
        n(this.heightMap[i].id);
      }
    };

    t.prototype.indexAt = function(e) {
      for (var t, n, i = 0, o = this.heightMap.length; o > i;)
        if (t = Math.floor((i + o) / 2), n = this.heightMap[t], e < n.top) {
          o = t;
        } else {
          if (!(e >= n.top + n.height)) {
            return t;
          }
          if (i === t) break;
          i = t;
        }
      return this.heightMap.length;
    };

    t.prototype.indexAfter = function(e) {
      return Math.min(this.indexAt(e) + 1, this.heightMap.length);
    };

    t.prototype.itemAtIndex = function(e) {
      return this.heightMap[e];
    };

    t.prototype.itemAfter = function(e) {
      return this.heightMap[this.indexes[e.id] + 1] || null;
    };

    t.prototype.dispose = function() {
      this.heightMap = null;

      this.indexes = null;
    };

    return t;
  }(a.EventEmitter);
  t.HeightMap = y;
  var _ = function(e) {
    function t(t, n) {
      var o = this;
      e.call(this, t);

      this.isRefreshing = !1;

      this.refreshingPreviousChildrenIds = {};

      this.treeContext = t;

      this.modelListeners = [];

      this.viewListeners = [];

      this.dragAndDropListeners = [];

      this.model = null;

      this.items = {};

      this.domNode = document.createElement("div");

      this.domNode.className = "monaco-vtree";

      this.domNode.tabIndex = 0;

      if (this.treeContext.options.alwaysFocused) {
        r.addClass(this.domNode, "focused");
      }

      if (this.treeContext.options.bare) {
        r.addClass(this.domNode, "bare");
      }

      this.wrapper = document.createElement("div");

      this.wrapper.className = "monaco-vtree-wrapper";

      this.scrollableElement = new h.ScrollableElement(this.wrapper, {
        scrollable: this,
        horizontal: t.options.horizontalScrollMode || "hidden",
        vertical: t.options.verticalScrollMode || "auto"
      });

      i.browser.isIE11orEarlier ? (this.wrapper.style.msTouchAction = "none", this.wrapper.style.msContentZooming =
        "none") : this.wrapperGesture = new l.Gesture(this.wrapper);

      this.rowsContainer = document.createElement("div");

      this.rowsContainer.className = "rows";

      this.fakeRow = document.createElement("div");

      this.fakeRow.className = "row fake";

      this.fakeContent = document.createElement("div");

      this.fakeContent.className = "content";

      this.fakeRow.appendChild(this.fakeContent);

      this.rowsContainer.appendChild(this.fakeRow);
      var s = r.trackFocus(this.domNode);
      s.addFocusListener(function(e) {
        return o.onFocus(e);
      });

      s.addBlurListener(function(e) {
        return o.onBlur(e);
      });

      this.viewListeners.push(function() {
        s.dispose();
      });

      this.viewListeners.push(r.addListener(this.domNode, "keydown", function(e) {
        return o.onKeyDown(e);
      }));

      this.viewListeners.push(r.addListener(this.domNode, "keyup", function(e) {
        return o.onKeyUp(e);
      }));

      this.viewListeners.push(r.addListener(this.domNode, "mousedown", function(e) {
        return o.onMouseDown(e);
      }));

      this.viewListeners.push(r.addListener(this.wrapper, "click", function(e) {
        return o.onClick(e);
      }));

      this.viewListeners.push(r.addListener(this.domNode, "contextmenu", function(e) {
        return o.onContextMenu(e);
      }));

      this.viewListeners.push(r.addListener(this.wrapper, l.EventType.Tap, function(e) {
        return o.onTap(e);
      }));

      this.viewListeners.push(r.addListener(this.wrapper, l.EventType.Change, function(e) {
        return o.onTouchChange(e);
      }));

      if (i.browser.isIE11orEarlier) {
        this.viewListeners.push(r.addListener(this.wrapper, "MSPointerDown", function(e) {
          return o.onMsPointerDown(e);
        }));
        this.viewListeners.push(r.addListener(this.wrapper, "MSGestureTap", function(e) {
          return o.onMsGestureTap(e);
        }));
        this.viewListeners.push(r.addThrottledListener(this.wrapper, "MSGestureChange", function(e) {
          return o.onThrottledMsGestureChange(e);
        }, function(e, t) {
          var n = {
            translationY: t.translationY,
            translationX: t.translationX
          };
          e && (n.translationY += e.translationY, n.translationX += e.translationX);

          return n;
        }));
      }

      this.viewListeners.push(r.addListener(window, "dragover", function(e) {
        return o.onDragOver(e);
      }));

      this.viewListeners.push(r.addListener(window, "drop", function(e) {
        return o.onDrop(e);
      }));

      this.viewListeners.push(r.addListener(window, "dragend", function(e) {
        return o.onDragEnd(e);
      }));

      this.viewListeners.push(r.addListener(window, "dragleave", function(e) {
        return o.onDragOver(e);
      }));

      this.wrapper.appendChild(this.rowsContainer);

      this.domNode.appendChild(this.scrollableElement.getDomNode());

      n.appendChild(this.domNode);

      this._scrollTop = 0;

      this.viewTop = 0;

      this._viewHeight = 0;

      this.renderTop = 0;

      this.renderHeight = 0;

      this.didJustPressContextMenuKey = !1;

      this.currentDropTarget = null;

      this.currentDropTargets = [];

      this.shouldInvalidateDropReaction = !1;

      this.dragAndDropScrollInterval = null;

      this.dragAndDropScrollTimeout = null;

      this.onHiddenScrollTop = null;

      this.onRowsChanged();

      this.layout();
    }
    __extends(t, e);

    t.prototype.getHTMLElement = function() {
      return this.domNode;
    };

    t.prototype.focus = function() {
      this.domNode.focus();
    };

    t.prototype.isFocused = function() {
      return document.activeElement === this.domNode;
    };

    t.prototype.blur = function() {
      this.domNode.blur();
    };

    t.prototype.onVisible = function() {
      var e = this;
      this.scrollTop = this.onHiddenScrollTop;

      this.onHiddenScrollTop = null;

      this.scrollableElement.onElementDimensions();

      this.scrollableElement.onElementInternalDimensions();

      if (i.browser.isIE11orEarlier) {
        this.msGesture = new MSGesture;
        setTimeout(function() {
          return e.msGesture.target = e.wrapper;
        }, 100);
      }
    };

    t.prototype.onHidden = function() {
      this.onHiddenScrollTop = this.scrollTop;
    };

    t.prototype.isTreeVisible = function() {
      return null === this.onHiddenScrollTop;
    };

    t.prototype.layout = function(e) {
      if (this.isTreeVisible()) {
        this.viewTop = r.getTopLeftOffset(this.wrapper).top;
        this.viewHeight = e || r.getContentHeight(this.wrapper);
        this.scrollTop = this.scrollTop;
        this.scrollableElement.onElementDimensions();
        this.scrollableElement.onElementInternalDimensions();
      }
    };

    t.prototype.render = function(e, t) {
      var n;

      var i;

      var o = e + t;

      var r = this.scrollTop + this.viewHeight;

      var s = e;
      s = Math.max(s, 0);
      var a = o;

      var u = 0 === r ? 0 : r;
      for (n = this.indexAfter(a) - 1, i = this.indexAt(Math.max(u, s)); n >= i; n--) {
        this.insertItemInDOM(this.itemAtIndex(n));
      }
      for (n = Math.min(this.indexAt(this.renderTop), this.indexAfter(a)) - 1, i = this.indexAt(s); n >= i; n--) {
        this.insertItemInDOM(this.itemAtIndex(n));
      }
      for (n = this.indexAt(this.renderTop), i = Math.min(this.indexAt(s), this.indexAfter(u)); i > n; n++) {
        this.removeItemFromDOM(this.itemAtIndex(n));
      }
      for (n = Math.max(this.indexAfter(a), this.indexAt(this.renderTop)), i = this.indexAfter(u); i > n; n++) {
        this.removeItemFromDOM(this.itemAtIndex(n));
      }
      var l = this.itemAtIndex(this.indexAt(s));
      if (l) {
        this.rowsContainer.style.top = l.top - s + "px";
      }

      this.renderTop = s;

      this.renderHeight = a - s;
    };

    t.prototype.setModel = function(e) {
      var t = this;
      this.releaseModel();

      this.model = e;

      this.modelListeners.push(this.model.addBulkListener(function(e) {
        return t.onModelEvents(e);
      }));
    };

    t.prototype.onModelEvents = function(e) {
      for (var t = [], n = 0, i = e.length; i > n; n++) {
        var o = e[n];

        var r = o.getData();
        switch (o.getType()) {
          case "refreshing":
            this.onRefreshing();
            break;
          case "refreshed":
            this.onRefreshed();
            break;
          case "clearingInput":
            this.onClearingInput(r);
            break;
          case "setInput":
            this.onSetInput(r);
            break;
          case "item:childrenRefreshing":
            this.onItemChildrenRefreshing(r);
            break;
          case "item:childrenRefreshed":
            this.onItemChildrenRefreshed(r);
            break;
          case "item:refresh":
            t.push(r.item);
            break;
          case "item:expanding":
            this.onItemExpanding(r);
            break;
          case "item:expanded":
            this.onItemExpanded(r);
            break;
          case "item:collapsing":
            this.onItemCollapsing(r);
            break;
          case "item:reveal":
            this.onItemReveal(r);
            break;
          case "item:addTrait":
            this.onItemAddTrait(r);
            break;
          case "item:removeTrait":
            this.onItemRemoveTrait(r);
        }
      }
      if (t.length > 0) {
        this.onItemsRefresh(t);
      }
    };

    t.prototype.onRefreshing = function() {
      this.isRefreshing = !0;
    };

    t.prototype.onRefreshed = function() {
      this.isRefreshing = !1;

      this.onRowsChanged();
    };

    t.prototype.onRowsChanged = function() {
      if (!this.isRefreshing) {
        this.scrollTop = this.scrollTop;
        this.scrollableElement.onElementInternalDimensions();
      }
    };

    t.prototype.withFakeRow = function(e) {
      return e(this.fakeContent);
    };

    t.prototype.focusNextPage = function(e) {
      var t = this;

      var n = this.indexAt(this.scrollTop + this.viewHeight);
      n = 0 === n ? 0 : n - 1;
      var i = this.itemAtIndex(n).model.getElement();

      var o = this.model.getFocus();
      if (o !== i) {
        this.model.setFocus(i, e);
      } else {
        var r = this.scrollTop;
        this.scrollTop += this.viewHeight;

        if (this.scrollTop !== r) {
          setTimeout(function() {
            t.focusNextPage(e);
          }, 0);
        }
      }
    };

    t.prototype.focusPreviousPage = function(e) {
      var t;

      var n = this;
      t = 0 === this.scrollTop ? this.indexAt(this.scrollTop) : this.indexAfter(this.scrollTop - 1);
      var i = this.itemAtIndex(t).model.getElement();

      var o = this.model.getFocus();
      if (o !== i) {
        this.model.setFocus(i, e);
      } else {
        var r = this.scrollTop;
        this.scrollTop -= this.viewHeight;

        if (this.scrollTop !== r) {
          setTimeout(function() {
            n.focusPreviousPage(e);
          }, 0);
        }
      }
    };

    Object.defineProperty(t.prototype, "viewHeight", {
      get: function() {
        return this._viewHeight;
      },
      set: function(e) {
        this.render(this.scrollTop, e);

        this._viewHeight = e;
      },
      enumerable: !0,
      configurable: !0
    });

    t.prototype.getScrollHeight = function() {
      return this.getTotalHeight();
    };

    t.prototype.getScrollWidth = function() {
      return 0;
    };

    t.prototype.getScrollLeft = function() {
      return 0;
    };

    t.prototype.setScrollLeft = function() {};

    Object.defineProperty(t.prototype, "scrollTop", {
      get: function() {
        return this._scrollTop;
      },
      set: function(e) {
        this.setScrollTop(e);
      },
      enumerable: !0,
      configurable: !0
    });

    t.prototype.getScrollTop = function() {
      return this._scrollTop;
    };

    t.prototype.setScrollTop = function(e) {
      e = Math.min(e, this.getTotalHeight() - this.viewHeight);

      e = Math.max(e, 0);

      this.render(e, this.viewHeight);

      this._scrollTop = e;

      this.emit("scroll", {
        vertical: !0,
        horizontal: !1
      });
    };

    t.prototype.addScrollListener = function(e) {
      return this.addListener2("scroll", e);
    };

    t.prototype.onClearingInput = function(e) {
      var t = e.item;
      if (t) {
        this.onRemoveItems(t.getNavigator());
        this.onRowsChanged();
      }
    };

    t.prototype.onSetInput = function(e) {
      this.inputItem = new v(this.treeContext, e.item, this.wrapper);

      this.emit("viewItem:create", {
        item: this.inputItem.model
      });
    };

    t.prototype.onItemChildrenRefreshing = function(e) {
      var n = e.item;

      var i = this.items[n.id];
      if (i && (i.loadingPromise = o.Promise.timeout(t.LOADING_DECORATION_DELAY).then(function() {
        i.loadingPromise = null;

        i.loading = !0;
      })), !e.isNested) {
        for (var r, s = [], a = n.getNavigator(); r = a.next();) {
          s.push(r.id);
        }
        this.refreshingPreviousChildrenIds[n.id] = s;
      }
    };

    t.prototype.onItemChildrenRefreshed = function(e) {
      var t = e.item;

      var n = this.items[t.id];
      if (n && (n.loadingPromise && (n.loadingPromise.cancel(), n.loadingPromise = null), n.loading = !1), !e.isNested) {
        for (var i, o = this.refreshingPreviousChildrenIds[t.id], r = [], s = t.getNavigator(); i = s.next();) {
          r.push(i);
        }
        for (var a = new u.LcsDiff({
          getLength: function() {
            return o.length;
          },
          getElementHash: function(e) {
            return o[e];
          }
        }, {
          getLength: function() {
            return r.length;
          },
          getElementHash: function(e) {
            return r[e].id;
          }
        }, null), l = a.ComputeDiff(), c = 0, d = l.length; d > c; c++) {
          var h = l[c];
          if (h.originalLength > 0 && this.onRemoveItems(new p(o, h.originalStart, h.originalStart + h.originalLength)),
            h.modifiedLength > 0) {
            var f = r[h.modifiedStart - 1] || t;
            f = f.getDepth() > 0 ? f : null;

            this.onInsertItems(new p(r, h.modifiedStart, h.modifiedStart + h.modifiedLength), f ? f.id : null);
          }
        }
        if (l.length) {
          this.onRowsChanged();
        }
      }
    };

    t.prototype.onItemsRefresh = function(e) {
      var t = this;
      e = e.filter(function(e) {
        return t.items.hasOwnProperty(e.id);
      });

      this.onRefreshItemSet(e);

      this.onRowsChanged();
    };

    t.prototype.onItemExpanding = function(e) {
      var t = this.items[e.item.id];
      t.expanded = !0;
    };

    t.prototype.onItemExpanded = function(e) {
      var t = e.item;

      var n = this.items[t.id];
      if (n) {
        n.expanded = !0;
        this.onInsertItems(t.getNavigator(), t.id);
        this.onRowsChanged();
      }
    };

    t.prototype.onItemCollapsing = function(e) {
      var t = e.item;

      var n = this.items[t.id];
      if (n) {
        n.expanded = !1;
        this.onRemoveItems(t.getNavigator());
        this.onRowsChanged();
      }
    };

    t.prototype.onItemReveal = function(e) {
      var t = e.item;

      var n = e.relativeTop;

      var i = this.items[t.id];
      if (i)
        if (null !== n) {
          n = 0 > n ? 0 : n;

          n = n > 1 ? 1 : n;
          var o = i.height - this.viewHeight;
          this.scrollTop = o * n + i.top;
        } else {
          var r = i.top + i.height;

          var s = this.scrollTop + this.viewHeight;
          i.top < this.scrollTop ? this.scrollTop = i.top : r >= s && (this.scrollTop = r - this.viewHeight);
        }
    };

    t.prototype.onItemAddTrait = function(e) {
      var t = e.item;

      var n = e.trait;

      var i = this.items[t.id];
      if (i) {
        i.addClass(n);
      }

      if ("highlighted" === n) {
        r.addClass(this.domNode, n);
        this.highlightedItemWasDraggable = !! i.draggable;
        if (i.draggable) {
          i.draggable = !1;
        }
      }
    };

    t.prototype.onItemRemoveTrait = function(e) {
      var t = e.item;

      var n = e.trait;

      var i = this.items[t.id];
      if (i) {
        i.removeClass(n);
      }

      if ("highlighted" === n) {
        r.removeClass(this.domNode, n);
        if (this.highlightedItemWasDraggable) {
          i.draggable = !0;
        }
        delete this.highlightedItemWasDraggable;
      }
    };

    t.prototype.onInsertItem = function(e) {
      var t = this;
      e.onDragStart = function(n) {
        t.onDragStart(e, n);
      };

      e.needsRender = !0;

      this.refreshViewItem(e);

      this.items[e.id] = e;
    };

    t.prototype.onRefreshItem = function(e, t) {
      if ("undefined" == typeof t) {
        t = !1;
      }

      e.needsRender = e.needsRender || t;

      this.refreshViewItem(e);
    };

    t.prototype.onRemoveItem = function(e) {
      this.removeItemFromDOM(e);

      e.dispose();

      this.emit("viewItem:dispose", {
        item: this.inputItem.model
      });

      delete this.items[e.id];
    };

    t.prototype.refreshViewItem = function(e) {
      e.render();

      this.shouldBeRendered(e) ? this.insertItemInDOM(e) : this.removeItemFromDOM(e);
    };

    t.prototype.onClick = function(e) {
      if (!this.lastPointerType || "mouse" === this.lastPointerType) {
        var t = new c.StandardMouseEvent(e);

        var n = this.getItemAround(t.target);
        if (n) {
          this.treeContext.controller.onClick(this.treeContext.tree, n.model.getElement(), t);
        }
      }
    };

    t.prototype.onTap = function(e) {
      var t = this.getItemAround(e.initialTarget);
      if (t) {
        this.treeContext.controller.onTap(this.treeContext.tree, t.model.getElement(), e);
      }
    };

    t.prototype.onTouchChange = function(e) {
      e.preventDefault();

      e.stopPropagation();

      this.scrollTop -= e.translationY;
    };

    t.prototype.onContextMenu = function(e) {
      var t;

      var i;
      if (e instanceof KeyboardEvent || this.didJustPressContextMenuKey) {
        this.didJustPressContextMenuKey = !1;
        var o = new d.KeyboardEvent(e);
        if (i = this.model.getFocus(), !i) return;
        var s = this.context.dataSource.getId(this.context.tree, i);

        var a = this.items[s];

        var u = r.getDomNodePosition(a.row);
        t = new n.KeyboardContextMenuEvent(u.left + u.width, u.top, o);
      } else {
        var l = new c.StandardMouseEvent(e);

        var h = this.getItemAround(l.target);
        if (!h) return;
        i = h.model.getElement();

        t = new n.MouseContextMenuEvent(l);
      }
      this.treeContext.controller.onContextMenu(this.treeContext.tree, i, t);
    };

    t.prototype.onKeyDown = function(e) {
      var t = new d.KeyboardEvent(e);
      this.didJustPressContextMenuKey = "ContextMenu" === t.key || t.shiftKey && "F10" === t.key;

      if (this.didJustPressContextMenuKey) {
        t.preventDefault();
        t.stopPropagation();
      }

      if (!(t.target && t.target.tagName && "input" === t.target.tagName.toLowerCase())) {
        this.treeContext.controller.onKeyDown(this.treeContext.tree, t);
      }
    };

    t.prototype.onKeyUp = function(e) {
      if (this.didJustPressContextMenuKey) {
        this.onContextMenu(e);
      }

      this.didJustPressContextMenuKey = !1;

      this.treeContext.controller.onKeyUp(this.treeContext.tree, new d.KeyboardEvent(e));
    };

    t.prototype.onMouseDown = function() {
      this.didJustPressContextMenuKey = !1;
    };

    t.prototype.onDragStart = function(e, t) {
      this.model.setHighlight();

      t.dataTransfer.effectAllowed = "copyMove";

      t.dataTransfer.setData("URL", e.uri);

      if (t.dataTransfer.setDragImage && e.row) {
        t.dataTransfer.setDragImage(e.row, t.offsetX || 6, t.offsetY || 6);
      }

      this.currentDragAndDropData = new f([e.model.getElement()]);

      this.treeContext.dnd.onDragStart(this.treeContext.tree, this.currentDragAndDropData, new c.DragMouseEvent(t));
    };

    t.prototype.setupDragAndDropScrollInterval = function() {
      var e = this;
      if (!this.dragAndDropScrollInterval) {
        this.dragAndDropScrollInterval = window.setInterval(function() {
          if (void 0 !== e.dragAndDropMouseY) {
            var t = e.dragAndDropMouseY - e.viewTop;

            var n = 0;

            var i = e.viewHeight - 35;
            35 > t ? n = Math.max(-14, .2 * (t - 35)) : t > i && (n = Math.min(14, .2 * (t - i)));

            e.scrollTop += n;
          }
        }, 10);
        this.cancelDragAndDropScrollTimeout();
        this.dragAndDropScrollTimeout = window.setTimeout(function() {
          e.cancelDragAndDropScrollInterval();

          e.dragAndDropScrollTimeout = null;
        }, 1e3);
      }
    };

    t.prototype.cancelDragAndDropScrollInterval = function() {
      if (this.dragAndDropScrollInterval) {
        window.clearInterval(this.dragAndDropScrollInterval);
        this.dragAndDropScrollInterval = null;
      }

      this.cancelDragAndDropScrollTimeout();
    };

    t.prototype.cancelDragAndDropScrollTimeout = function() {
      if (this.dragAndDropScrollTimeout) {
        window.clearTimeout(this.dragAndDropScrollTimeout);
        this.dragAndDropScrollTimeout = null;
      }
    };

    t.prototype.onDragOver = function(e) {
      var t = this;

      var n = new c.DragMouseEvent(e);

      var i = this.getItemAround(n.target);
      if (!i) {
        this.currentDropTarget && (this.currentDropTargets.forEach(function(e) {
          return e.dropTarget = !1;
        }), this.currentDropTargets = [], this.currentDropPromise && (this.currentDropPromise.cancel(), this.currentDropPromise =
          null));
        this.cancelDragAndDropScrollInterval();
        delete this.currentDropTarget;
        delete this.currentDropElement;
        delete this.dragAndDropMouseY;
        return !1;
      }
      if (this.setupDragAndDropScrollInterval(), this.dragAndDropMouseY = n.posy, !this.currentDragAndDropData) {
        if (!n.dataTransfer.types) {
          return !1;
        }
        this.currentDragAndDropData = new g;
      }
      this.currentDragAndDropData.update(n);
      var r;

      var s;

      var a = i.model;
      do {
        if (r = a ? a.getElement() : this.model.getInput(), s = this.treeContext.dnd.onDragOver(this.treeContext.tree,
          this.currentDragAndDropData, r, n), 3 !== s) break;
        a = a && a.parent;
      } while (a);
      if (!a) {
        delete this.currentDropElement;
        return !1;
      }
      var u = 1 === s || 2 === s;
      u ? (this.currentDropElement = a.getElement(), n.preventDefault(), n.dataTransfer.dropEffect = n.ctrlKey ?
        "copy" : "move") : delete this.currentDropElement;
      var l = a.id === this.inputItem.id ? this.inputItem : this.items[a.id];
      if ((this.shouldInvalidateDropReaction || this.currentDropTarget !== l || this.currentDropElementReaction !== s) &&
        (this.shouldInvalidateDropReaction = !1, this.currentDropTarget && (this.currentDropTargets.forEach(function(
          e) {
          return e.dropTarget = !1;
        }), this.currentDropTargets = [], this.currentDropPromise && (this.currentDropPromise.cancel(), this.currentDropPromise =
          null)), this.currentDropTarget = l, this.currentDropElementReaction = s, u)) {
        if (this.currentDropTarget && (this.currentDropTarget.dropTarget = !0, this.currentDropTargets.push(this.currentDropTarget)),
          2 === s)
          for (var d, h = a.getNavigator(); d = h.next();) {
            i = this.items[d.id];
            if (i) {
              i.dropTarget = !0;
              this.currentDropTargets.push(i);
            }
          }
        this.currentDropPromise = o.Promise.timeout(500).then(function() {
          return t.treeContext.tree.expand(t.currentDropElement).then(function() {
            t.shouldInvalidateDropReaction = !0;
          });
        });
      }
      return !0;
    };

    t.prototype.onDrop = function(e) {
      if (this.currentDropElement) {
        var t = new c.DragMouseEvent(e);
        t.preventDefault();

        this.currentDragAndDropData.update(t);

        this.treeContext.dnd.drop(this.treeContext.tree, this.currentDragAndDropData, this.currentDropElement, t);

        this.onDragEnd(e);
      }
      this.cancelDragAndDropScrollInterval();
    };

    t.prototype.onDragEnd = function() {
      if (this.currentDropTarget) {
        this.currentDropTargets.forEach(function(e) {
          return e.dropTarget = !1;
        });
        this.currentDropTargets = [];
      }

      if (this.currentDropPromise) {
        this.currentDropPromise.cancel();
        this.currentDropPromise = null;
      }

      this.cancelDragAndDropScrollInterval();

      delete this.currentDragAndDropData;

      delete this.currentDropElement;

      delete this.currentDropTarget;

      delete this.dragAndDropMouseY;
    };

    t.prototype.onFocus = function() {
      if (!this.treeContext.options.alwaysFocused) {
        r.addClass(this.domNode, "focused");
      }
    };

    t.prototype.onBlur = function() {
      if (!this.treeContext.options.alwaysFocused) {
        r.removeClass(this.domNode, "focused");
      }
    };

    t.prototype.onMsPointerDown = function(e) {
      if (this.msGesture) {
        var t = e.pointerType;
        this.lastPointerType = t === (e.MSPOINTER_TYPE_MOUSE || "mouse") ? "mouse" : t === (e.MSPOINTER_TYPE_TOUCH ||
          "touch") ? "touch" : "pen";

        if ("mouse" !== this.lastPointerType) {
          this.msGesture.addPointer(e.pointerId);
        }
      }
    };

    t.prototype.onThrottledMsGestureChange = function(e) {
      this.scrollTop -= e.translationY;
    };

    t.prototype.onMsGestureTap = function(e) {
      e.initialTarget = document.elementFromPoint(e.clientX, e.clientY);

      this.onTap(e);
    };

    t.prototype.insertItemInDOM = function(e) {
      var t = null;

      var n = this.itemAfter(e);
      if (n && n.row) {
        t = n.row;
      }

      e.insertInDOM(this.rowsContainer, t);
    };

    t.prototype.removeItemFromDOM = function(e) {
      e.removeFromDOM();
    };

    t.prototype.shouldBeRendered = function(e) {
      return e.top < this.renderTop + this.renderHeight && e.top + e.height > this.renderTop;
    };

    t.prototype.getItemAround = function(e) {
      var n = this.inputItem;
      do {
        if (e[t.BINDING] && (n = e[t.BINDING]), e === this.wrapper || e === this.domNode) {
          return n;
        }
        if (e === document.body) {
          return null;
        }
      } while (e = e.parentElement);
    };

    t.prototype.releaseModel = function() {
      if (this.model) {
        for (; this.modelListeners.length;) {
          this.modelListeners.pop()();
        }
        this.model = null;
      }
    };

    t.prototype.dispose = function() {
      for (this.scrollableElement.destroy(), this.releaseModel(), this.modelListeners = null; this.viewListeners.length;) {
        this.viewListeners.pop()();
      }
      this.viewListeners = null;

      if (this.domNode.parentNode) {
        this.domNode.parentNode.removeChild(this.domNode);
      }

      this.domNode = null;

      if (this.wrapperGesture) {
        this.wrapperGesture.dispose();
        this.wrapperGesture = null;
      }

      e.prototype.dispose.call(this);
    };

    t.BINDING = "monaco-vtree-row";

    t.LOADING_DECORATION_DELAY = 800;

    return t;
  }(y);
  t.TreeView = _;
});