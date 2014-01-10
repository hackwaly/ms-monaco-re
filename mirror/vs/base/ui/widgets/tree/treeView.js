var __extends = this.__extends || function(a, b) {
    function d() {
      this.constructor = a
    }
    for (var c in b) b.hasOwnProperty(c) && (a[c] = b[c]);
    d.prototype = b.prototype, a.prototype = new d
  };
define(["require", "exports", "./tree", "vs/base/lib/winjs.base", "vs/base/dom/dom", "vs/base/dom/mouseEvent",
  "vs/base/dom/keyboardEvent", "vs/base/ui/scrollbar/scrollableElement"
], function(a, b, c, d, e, f, g, h) {
  var i = c,
    j = d,
    k = e,
    l = f,
    m = g,
    n = h,
    o = function() {
      function a(a) {
        this.elements = a
      }
      return a.prototype.update = function(a) {}, a.prototype.getData = function() {
        return this.elements
      }, a
    }();
  b.ElementsDragAndDropData = o;
  var p = function() {
    function a() {}
    return a.prototype.update = function(a) {
      this.types = a.dataTransfer.types || this.types, this.files = a.dataTransfer.files || this.files
    }, a.prototype.getData = function() {
      return {
        types: this.types,
        files: this.files
      }
    }, a
  }();
  b.DesktopDragAndDropData = p;
  var q = function() {
    function a(a, b) {
      this.model = a, this.id = this.model.id, this.top = b, this.height = a.getHeight()
    }
    return a
  }();
  b.ViewItem = q;
  var r = function() {
    function a() {
      this.heightMap = [], this.indexes = {}
    }
    return a.prototype.getTotalHeight = function() {
      var a = this.heightMap[this.heightMap.length - 1];
      return a ? a.top + a.height : 0
    }, a.prototype.onInsertItems = function(a, b) {
      typeof b == "undefined" && (b = null);
      var c, d, e, f, g, h = 0;
      b === null ? (e = 0, g = 0) : (e = this.indexes[b.id] + 1, g = this.heightMap[e - 1].top + this.heightMap[e - 1]
        .height);
      var i = this.heightMap.splice.bind(this.heightMap, e, 0),
        j = [];
      while (c = a.next()) d = new q(c, g + h), this.indexes[c.id] = e++, j.push(d), h += d.height, this.onInsertItem(
        d);
      if (h === 0) return;
      i.apply(this.heightMap, j);
      for (; e < this.heightMap.length; e++) d = this.heightMap[e], d.top += h, this.indexes[d.id] = e, this.onRefreshItem(
        d)
    }, a.prototype.onInsertItem = function(a) {}, a.prototype.onRemoveItems = function(a) {
      var b, c, d = null,
        e, f = 0;
      while (b = a.next()) e = this.indexes[b.id], c = this.heightMap[e], f -= c.height, delete this.indexes[b.id],
        this.onRemoveItem(c), d === null && (d = e);
      if (f === 0) return;
      this.heightMap.splice(d, e - d + 1);
      for (e = d; e < this.heightMap.length; e++) c = this.heightMap[e], c.top += f, this.indexes[c.id] = e, this.onRefreshItem(
        c)
    }, a.prototype.onRemoveItem = function(a) {}, a.prototype.onRefreshItemSet = function(a) {
      var b = this;
      this.onRefreshItems(new s(a.sort(function(a, c) {
        return b.indexes[a.id] - b.indexes[c.id]
      })))
    }, a.prototype.onRefreshItems = function(a) {
      var b, c, d, e, f = null,
        g = 0;
      while (b = a.next()) {
        e = this.indexes[b.id];
        for (; g !== 0 && f !== null && f < e; f++) c = this.heightMap[f], c.top += g, this.onRefreshItem(c);
        c = this.heightMap[e], d = b.getHeight(), c.top += g, g += d - c.height, c.height = d, this.onRefreshItem(c, !
          0), f = e + 1
      }
      if (g !== 0 && f !== null)
        for (; f < this.heightMap.length; f++) c = this.heightMap[f], c.top += g, this.onRefreshItem(c)
    }, a.prototype.onRefreshItem = function(a, b) {
      typeof b == "undefined" && (b = !1)
    }, a.prototype.itemsCount = function() {
      return this.heightMap.length
    }, a.prototype.itemAt = function(a) {
      return this.heightMap[this.indexAt(a)].id
    }, a.prototype.withItemsInRange = function(a, b, c) {
      a = this.indexAt(a), b = this.indexAt(b);
      for (var d = a; d <= b; d++) c(this.heightMap[d].id)
    }, a.prototype.indexAt = function(a) {
      var b = 0,
        c = this.heightMap.length,
        d, e;
      while (b < c) {
        d = Math.floor((b + c) / 2), e = this.heightMap[d];
        if (a < e.top) c = d;
        else {
          if (!(a >= e.top + e.height)) return d;
          if (b === d) break;
          b = d
        }
      }
      return this.heightMap.length
    }, a.prototype.indexAfter = function(a) {
      return Math.min(this.indexAt(a) + 1, this.heightMap.length)
    }, a.prototype.itemAtIndex = function(a) {
      return this.heightMap[a]
    }, a.prototype.dispose = function() {
      this.heightMap = null, this.indexes = null
    }, a
  }();
  b.HeightMap = r;
  var s = function() {
    function a(a) {
      this.items = a, this.index = -1
    }
    return a.prototype.current = function() {
      return this.items[this.index] || null
    }, a.prototype.next = function() {
      return this.index = Math.min(this.index + 1, this.items.length), this.items[this.index]
    }, a.prototype.previous = function() {
      return this.index = Math.max(this.index - 1, -1), this.items[this.index]
    }, a.prototype.parent = function() {
      return this.index = this.items.length, this.items[this.index]
    }, a.prototype.first = function() {
      return this.index = 0, this.items[this.index]
    }, a.prototype.last = function() {
      return this.index = this.items.length - 1, this.items[this.index]
    }, a
  }(),
    t = function(a) {
      function b(b, c) {
        a.call(this), this.isRefreshing = !1, this.context = b, this.modelListeners = [], this.viewListeners = [],
          this.dragAndDropListeners = [], this.model = null, this.items = {}, this.domNode = document.createElement(
            "div"), this.domNode.className = "monaco-vtree", this.domNode.tabIndex = 0, this.context.options.alwaysFocused &&
          k.addClass(this.domNode, "focused"), this.context.options.bare && k.addClass(this.domNode, "bare"), this.wrapper =
          document.createElement("div"), this.wrapper.className = "monaco-vtree-wrapper", this.scrollable = new n.ScrollableElement(
            this.wrapper, {
              horizontal: b.options.horizontalScrollMode || "hidden",
              vertical: b.options.verticalScrollMode || "auto"
            }), this.rowsContainer = document.createElement("div"), this.rowsContainer.className = "rows", this.fakeRow =
          document.createElement("div"), this.fakeRow.className = "row fake", this.fakeContent = document.createElement(
            "div"), this.fakeContent.className = "content", this.fakeRow.appendChild(this.fakeContent), this.rowsContainer
          .appendChild(this.fakeRow);
        var d = k.trackFocus(this.domNode);
        d.addFocusListener(this.onFocus.bind(this)), d.addBlurListener(this.onBlur.bind(this)), this.viewListeners.push(
          function() {
            d.dispose()
          }), this.viewListeners.push(k.addListener(this.domNode, "keydown", this.onKeyDown.bind(this))), this.viewListeners
          .push(k.addListener(this.domNode, "keyup", this.onKeyUp.bind(this))), this.viewListeners.push(k.addListener(
            this.wrapper, "click", this.onClick.bind(this))), this.viewListeners.push(k.addListener(this.wrapper,
            "contextmenu", this.onContextMenu.bind(this))), this.viewListeners.push(k.addListener(this.wrapper,
            "scroll", this.onScroll.bind(this))), this.viewListeners.push(k.addListener(window, "dragover", this.onDragOver
            .bind(this))), this.viewListeners.push(k.addListener(window, "drop", this.onDrop.bind(this))), this.viewListeners
          .push(k.addListener(window, "dragend", this.onDragEnd.bind(this))), this.viewListeners.push(k.addListener(
            window, "dragleave", this.onDragOver.bind(this))), this.wrapper.appendChild(this.rowsContainer), this.domNode
          .appendChild(this.scrollable.getDomNode()), c.appendChild(this.domNode), this.renderTop = 0, this.renderHeight =
          0, this.onRowsChanged(), this.layout(), this.currentDropFeedbackHTMLElements = [], this.dragAndDropScrollInterval =
          null, this.dragAndDropScrollTimeout = null, this.onHiddenScrollTop = null
      }
      return __extends(b, a), b.prototype.getHTMLElement = function() {
        return this.domNode
      }, b.prototype.focus = function() {
        this.domNode.focus()
      }, b.prototype.isFocused = function() {
        return document.activeElement === this.domNode
      }, b.prototype.blur = function() {
        this.domNode.blur()
      }, b.prototype.onVisible = function() {
        this.wrapper.scrollTop = this.onHiddenScrollTop, this.onHiddenScrollTop = null, this.scrollable.onElementDimensions(),
          this.scrollable.onElementInternalDimensions()
      }, b.prototype.onHidden = function() {
        this.onHiddenScrollTop = this.wrapper.scrollTop
      }, b.prototype.isTreeVisible = function() {
        return this.onHiddenScrollTop === null
      }, b.prototype.layout = function(a) {
        if (!this.isTreeVisible()) return;
        this.viewTop = k.getTopLeftOffset(this.wrapper).top;
        var b = this.wrapper.scrollTop,
          c = a || k.getContentHeight(this.wrapper);
        this.scrollable.onElementDimensions(), this.render(b, c)
      }, b.prototype.render = function(a, b) {
        var c = a + b,
          d = this.renderTop + this.renderHeight,
          e, f;
        for (e = this.indexAt(a), f = Math.min(this.indexAt(this.renderTop), this.indexAfter(c)); e < f; e++) this.insertItemInDOM(
          this.itemAtIndex(e));
        for (e = this.indexAt(Math.max(d, a)), f = this.indexAfter(c); e < f; e++) this.insertItemInDOM(this.itemAtIndex(
          e));
        for (e = this.indexAt(this.renderTop), f = Math.min(this.indexAt(a), this.indexAfter(d)); e < f; e++) this.removeItemFromDOM(
          this.itemAtIndex(e));
        for (e = Math.max(this.indexAfter(c), this.indexAt(this.renderTop)), f = this.indexAfter(d); e < f; e++) this
          .removeItemFromDOM(this.itemAtIndex(e));
        this.renderTop = a, this.renderHeight = b
      }, b.prototype.setModel = function(a) {
        this.releaseModel(), this.model = a, this.modelListeners.push(this.model.addBulkListener(this.onModelEvents.bind(
          this)))
      }, b.prototype.onModelEvents = function(a) {
        var b = [];
        for (var c = 0, d = a.length; c < d; c++) {
          var e = a[c],
            f = e.getData();
          switch (e.getType()) {
            case "refreshing":
              this.onRefreshing();
              break;
            case "refreshed":
              this.onRefreshed();
              break;
            case "clearingInput":
              this.onClearingInput(f);
              break;
            case "setInput":
              this.onSetInput(f);
              break;
            case "item:childrenRefreshing":
              this.onItemChildrenRefreshing(f);
              break;
            case "item:childrenRefreshed":
              this.onItemChildrenRefreshed(f);
              break;
            case "item:refresh":
              b.push(f.item);
              break;
            case "item:expanding":
              this.onItemExpanding(f);
              break;
            case "item:expanded":
              this.onItemExpanded(f);
              break;
            case "item:collapsing":
              this.onItemCollapsing(f);
              break;
            case "item:reveal":
              this.onItemReveal(f);
              break;
            case "item:addTrait":
              this.onItemAddTrait(f);
              break;
            case "item:removeTrait":
              this.onItemRemoveTrait(f)
          }
        }
        b.length > 0 && this.onItemsRefresh(b)
      }, b.prototype.onRefreshing = function() {
        this.isRefreshing = !0
      }, b.prototype.onRefreshed = function() {
        this.isRefreshing = !1, this.onRowsChanged()
      }, b.prototype.onRowsChanged = function() {
        if (this.isRefreshing) return;
        this.rowsContainer.style.height = this.getTotalHeight() + "px", this.scrollable.onElementInternalDimensions()
      }, b.prototype.withFakeRow = function(a) {
        return a(this.fakeContent)
      }, b.prototype.focusNextPage = function(a) {
        var b = this,
          c = this.indexAt(this.renderTop + this.renderHeight);
        c = c === 0 ? 0 : c - 1;
        var d = this.itemAtIndex(c).model.getElement(),
          e = this.model.getFocus();
        if (e !== d) this.model.setFocus(d, a);
        else {
          var f = this.wrapper.scrollTop;
          this.wrapper.scrollTop += this.renderHeight, this.wrapper.scrollTop !== f && setTimeout(function() {
            b.focusNextPage(a)
          }, 0)
        }
      }, b.prototype.focusPreviousPage = function(a) {
        var b = this,
          c;
        this.wrapper.scrollTop === 0 ? c = this.indexAt(this.renderTop) : c = this.indexAfter(this.renderTop - 1);
        var d = this.itemAtIndex(c).model.getElement(),
          e = this.model.getFocus();
        if (e !== d) this.model.setFocus(d, a);
        else {
          var f = this.wrapper.scrollTop;
          this.wrapper.scrollTop -= this.renderHeight, this.wrapper.scrollTop !== f && setTimeout(function() {
            b.focusPreviousPage(a)
          }, 0)
        }
      }, b.prototype.onClearingInput = function(a) {
        var b = a.item;
        b && (this.onRemoveItems(b.getNavigator()), this.onRowsChanged())
      }, b.prototype.onSetInput = function(a) {
        this.inputItem = new q(a.item, 0)
      }, b.prototype.onItemChildrenRefreshing = function(a) {
        var c = a.item,
          d = this.items[c.id];
        d && (d.loadingPromise = j.Promise.timeout(b.LOADING_DECORATION_DELAY).then(function() {
          d.loadingPromise = null, k.addClass(d.row, "loading")
        })), a.isNested || (this.onRemoveItems(c.getNavigator()), this.onRowsChanged())
      }, b.prototype.onItemChildrenRefreshed = function(a) {
        var b = a.item,
          c = this.items[b.id];
        c && (c.loadingPromise && (c.loadingPromise.cancel(), c.loadingPromise = null), k.removeClass(c.row,
          "loading")), a.isNested || (this.onInsertItems(b.getNavigator(), b.getLevel() === 0 ? null : b), this.onRowsChanged())
      }, b.prototype.onItemsRefresh = function(a) {
        var b = this;
        a = a.filter(function(a) {
          return b.items.hasOwnProperty(a.id)
        }), this.onRefreshItemSet(a), this.onRowsChanged()
      }, b.prototype.onItemExpanding = function(a) {
        var b = this.items[a.item.id];
        b && b.row && k.addClass(b.row, "expanded")
      }, b.prototype.onItemExpanded = function(a) {
        var b = a.item,
          c = this.items[b.id];
        c && c.row && (k.addClass(c.row, "expanded"), this.onInsertItems(b.getNavigator(), b), this.onRowsChanged())
      }, b.prototype.onItemCollapsing = function(a) {
        var b = a.item,
          c = this.items[b.id];
        c && c.row && (k.removeClass(c.row, "expanded"), this.onRemoveItems(b.getNavigator()), this.onRowsChanged())
      }, b.prototype.onItemReveal = function(a) {
        var b = a.item,
          c = a.relativeTop,
          d = this.items[b.id];
        if (d && d.row)
          if (c !== null) {
            c = c < 0 ? 0 : c, c = c > 1 ? 1 : c;
            var e = d.height - this.renderHeight;
            this.wrapper.scrollTop = e * c + d.top
          } else {
            var f = d.top + d.height,
              g = this.wrapper.scrollTop + this.renderHeight;
            d.top < this.wrapper.scrollTop ? this.wrapper.scrollTop = d.top : f >= g && (this.wrapper.scrollTop = f -
              this.renderHeight)
          }
      }, b.prototype.onItemAddTrait = function(a) {
        var b = a.item,
          c = a.trait,
          d = this.items[b.id];
        d && d.row && k.addClass(d.row, c), c === "highlighted" && (k.addClass(this.domNode, c), this.highlightedItemWasDraggable = !!
          d.row.draggable, d.row.draggable && (d.row.draggable = !1))
      }, b.prototype.onItemRemoveTrait = function(a) {
        var b = a.item,
          c = a.trait,
          d = this.items[b.id];
        d && d.row && k.removeClass(d.row, c), c === "highlighted" && (k.removeClass(this.domNode, c), this.highlightedItemWasDraggable &&
          (d.row.draggable = !0), delete this.highlightedItemWasDraggable)
      }, b.prototype.onInsertItem = function(a) {
        a.needsRender = !0, this.refreshViewItem(a), this.items[a.id] = a
      }, b.prototype.onRefreshItem = function(a, b) {
        typeof b == "undefined" && (b = !1), a.needsRender = a.needsRender || b, this.refreshViewItem(a)
      }, b.prototype.onRemoveItem = function(a) {
        this.removeItemFromDOM(a), a.renderCleanupFn && (a.renderCleanupFn(this.context.tree, a.model.getElement()),
          delete a.renderCleanupFn), delete a.row, delete a.content, delete a.model, delete this.items[a.id]
      }, b.prototype.refreshViewItem = function(a) {
        if (!a.row) {
          a.row = document.createElement("div"), a.row.className = "row", a.row[b.BINDING] = a, a.content = document.createElement(
            "div"), a.content.className = "content", a.row.appendChild(a.content);
          var c = a.model.getAllTraits();
          for (var d = 0, e = c.length; d < e; d++) k.addClass(a.row, c[d])
        }
        a.row.style.height = a.height + "px", a.row.style.top = a.top + "px", a.row.style.paddingLeft = this.context.options
          .twistiePixels + (a.model.getLevel() - 1) * this.context.options.indentPixels + "px", k.toggleClass(a.row,
            "has-children", a.model.hasChildren()), k.toggleClass(a.row, "expanded", a.model.isExpanded());
        var f = this.context.dnd.getDragURI(this.context.tree, a.model.getElement());
        f !== a.uri && (a.unbindDragStart && (a.unbindDragStart(), delete a.unbindDragStart), f ? (a.uri = f, a.row.draggable = !
          0, a.unbindDragStart = k.addListener(a.row, "dragstart", this.onDragStart.bind(this, a))) : delete a.uri),
          this.isVisible(a) ? this.insertItemInDOM(a) : this.removeItemFromDOM(a)
      }, b.prototype.onClick = function(a) {
        var b = new l.MouseEvent(a),
          c = this.getItemAround(b.target);
        this.context.controller.onClick(this.context.tree, c.model.getElement(), b)
      }, b.prototype.onContextMenu = function(a) {
        var b = new l.MouseEvent(a),
          c = this.getItemAround(b.target);
        this.context.controller.onContextMenu(this.context.tree, c.model.getElement(), b)
      }, b.prototype.onScroll = function(a) {
        this.render(this.wrapper.scrollTop, this.renderHeight)
      }, b.prototype.onKeyDown = function(a) {
        var b = new m.KeyboardEvent(a);
        if (b.target && b.target.tagName && b.target.tagName.toLowerCase() === "input") return;
        this.context.controller.onKeyDown(this.context.tree, b)
      }, b.prototype.onKeyUp = function(a) {
        this.context.controller.onKeyUp(this.context.tree, new m.KeyboardEvent(a))
      }, b.prototype.onDragStart = function(a, b) {
        this.model.setHighlight(), b.dataTransfer.effectAllowed = "copyMove", b.dataTransfer.setData("URL", a.uri), b
          .dataTransfer.setDragImage && b.dataTransfer.setDragImage(a.row, b.offsetX || 6, b.offsetY || 6), this.currentDragAndDropData =
          new o([a.model.getElement()]), this.context.dnd.onDragStart(this.context.tree, this.currentDragAndDropData,
            new l.DragMouseEvent(b))
      }, b.prototype.setupDragAndDropScrollInterval = function() {
        var a = this;
        this.dragAndDropScrollInterval || (this.dragAndDropScrollInterval = window.setInterval(function() {
          if (a.dragAndDropMouseY === undefined) return;
          var b = a.dragAndDropMouseY - a.viewTop,
            c = 0,
            d = a.renderHeight - 35;
          b < 35 ? c = Math.max(-14, .2 * (b - 35)) : b > d && (c = Math.min(14, .2 * (b - d))), a.wrapper.scrollTop +=
            c
        }, 10), this.cancelDragAndDropScrollTimeout(), this.dragAndDropScrollTimeout = window.setTimeout(function() {
          a.cancelDragAndDropScrollInterval(), a.dragAndDropScrollTimeout = null
        }, 1e3))
      }, b.prototype.cancelDragAndDropScrollInterval = function() {
        this.dragAndDropScrollInterval && (window.clearInterval(this.dragAndDropScrollInterval), this.dragAndDropScrollInterval =
          null), this.cancelDragAndDropScrollTimeout()
      }, b.prototype.cancelDragAndDropScrollTimeout = function() {
        this.dragAndDropScrollTimeout && (window.clearTimeout(this.dragAndDropScrollTimeout), this.dragAndDropScrollTimeout =
          null)
      }, b.prototype.onDragOver = function(a) {
        var b = this,
          c = new l.DragMouseEvent(a),
          d = this.getItemAround(c.target);
        if (!d) {
          if (this.currentDropHTMLElement) {
            var e;
            while (e = this.currentDropFeedbackHTMLElements.pop()) k.removeClass(e, "drop-target");
            this.currentDropPromise && (this.currentDropPromise.cancel(), this.currentDropPromise = null)
          }
          return this.cancelDragAndDropScrollInterval(), delete this.currentDropHTMLElement, delete this.currentDropElement,
            delete this.dragAndDropMouseY, !1
        }
        this.setupDragAndDropScrollInterval(), this.dragAndDropMouseY = c.posy;
        if (!this.currentDragAndDropData) {
          if (!c.dataTransfer.types) return !1;
          this.currentDragAndDropData = new p
        }
        this.currentDragAndDropData.update(c);
        var f = d.model,
          g, h = !1;
        do {
          e = f ? f.getElement() : this.model.getInput(), g = this.context.dnd.onDragOver(this.context.tree, this.currentDragAndDropData,
            e, c);
          if (g !== i.DragOverReaction.BUBBLE_UP) break;
          h = !0, f = f && f.parent
        } while (f);
        if (!f) return delete this.currentDropElement, !1;
        var m = g === i.DragOverReaction.ACCEPT;
        m ? (this.currentDropElement = f.getElement(), c.preventDefault(), c.dataTransfer.dropEffect = c.ctrlKey ?
          "copy" : "move") : delete this.currentDropElement;
        var n = f.id === this.inputItem.id ? this.wrapper : this.items[f.id].row;
        if (this.currentDropHTMLElement !== n || this.currentDropElementDidBubbleUp !== h) {
          if (this.currentDropHTMLElement) {
            var e;
            while (e = this.currentDropFeedbackHTMLElements.pop()) k.removeClass(e, "drop-target");
            this.currentDropPromise && (this.currentDropPromise.cancel(), this.currentDropPromise = null)
          }
          this.currentDropHTMLElement = n, this.currentDropElementDidBubbleUp = h;
          if (m) {
            k.addClass(this.currentDropHTMLElement, "drop-target"), this.currentDropFeedbackHTMLElements.push(this.currentDropHTMLElement);
            if (h) {
              var o = f.getNavigator(),
                q;
              while (q = o.next()) d = this.items[q.id], d && d.row && (k.addClass(d.row, "drop-target"), this.currentDropFeedbackHTMLElements
                .push(d.row))
            }
            this.currentDropPromise = j.Promise.timeout(500).then(function() {
              b.context.tree.expand(b.currentDropElement)
            })
          }
        }
        return !0
      }, b.prototype.onDrop = function(a) {
        if (this.currentDropElement) {
          var b = new l.DragMouseEvent(a);
          b.preventDefault(), this.currentDragAndDropData.update(b), this.context.dnd.drop(this.context.tree, this.currentDragAndDropData,
            this.currentDropElement, b), this.onDragEnd()
        }
        this.cancelDragAndDropScrollInterval()
      }, b.prototype.onDragEnd = function() {
        if (this.currentDropHTMLElement) {
          var a;
          while (a = this.currentDropFeedbackHTMLElements.pop()) k.removeClass(a, "drop-target")
        }
        this.currentDropPromise && (this.currentDropPromise.cancel(), this.currentDropPromise = null), this.cancelDragAndDropScrollInterval(),
          delete this.currentDragAndDropData, delete this.currentDropElement, delete this.currentDropHTMLElement,
          delete this.dragAndDropMouseY
      }, b.prototype.onFocus = function() {
        this.context.options.alwaysFocused || k.addClass(this.domNode, "focused")
      }, b.prototype.onBlur = function() {
        this.context.options.alwaysFocused || k.removeClass(this.domNode, "focused")
      }, b.prototype.insertItemInDOM = function(a) {
        a.needsRender && (a.renderCleanupFn = this.context.renderer.render(this.context.tree, a.model.getElement(), a
          .content, a.renderCleanupFn), a.needsRender = !1), this.isInDOM(a) || this.rowsContainer.appendChild(a.row)
      }, b.prototype.removeItemFromDOM = function(a) {
        this.isInDOM(a) && this.rowsContainer.removeChild(a.row)
      }, b.prototype.isVisible = function(a) {
        return a.top < this.renderTop + this.renderHeight && a.top + a.height > this.renderTop
      }, b.prototype.isInDOM = function(a) {
        return !!a.row && !! a.row.parentElement
      }, b.prototype.getItemAround = function(a) {
        var c = this.inputItem;
        do {
          a[b.BINDING] && (c = a[b.BINDING]);
          if (a === this.wrapper) return c;
          if (a === document.body) return null
        } while (a = a.parentElement)
      }, b.prototype.releaseModel = function() {
        if (this.model) {
          while (this.modelListeners.length) this.modelListeners.pop()();
          this.model = null
        }
      }, b.prototype.dispose = function() {
        this.scrollable.destroy(), this.releaseModel(), this.modelListeners = null;
        while (this.viewListeners.length) this.viewListeners.pop()();
        this.viewListeners = null, this.domNode.parentNode && this.domNode.parentNode.removeChild(this.domNode), this
          .domNode = null, a.prototype.dispose.call(this)
      }, b.BINDING = "monaco-vtree-row", b.BUFFER = 50, b.LOADING_DECORATION_DELAY = 800, b
    }(r);
  b.TreeView = t
})