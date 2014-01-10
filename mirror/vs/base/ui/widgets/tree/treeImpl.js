var __extends = this.__extends || function(a, b) {
    function d() {
      this.constructor = a
    }
    for (var c in b) b.hasOwnProperty(c) && (a[c] = b[c]);
    d.prototype = b.prototype, a.prototype = new d
  };
define(["require", "exports", "vs/base/types", "vs/base/ui/widgets/tree/treeDefaults", "vs/base/eventEmitter",
  "./treeModel", "./treeView", "vs/css!./tree"
], function(a, b, c, d, e, f, g) {
  var h = c,
    i = d,
    j = e,
    k = f,
    l = g,
    m = function() {
      function a(a, b, c) {
        typeof c == "undefined" && (c = {}), this.tree = a, this.configuration = b, this.options = c;
        if (!b.dataSource) throw new Error("You must provide a Data Source to the tree.");
        this.dataSource = b.dataSource, this.renderer = b.renderer || new i.DefaultRenderer, this.controller = b.controller ||
          new i.DefaultController, this.dnd = b.dnd || new i.DefaultDragAndDrop, this.filter = b.filter || new i.DefaultFilter,
          this.sorter = b.sorter || null;
        var d = [this.dataSource, this.renderer, this.controller, this.dnd, this.filter, this.sorter];
        d.forEach(function(b) {
          b && h.isFunction(b.setTree) && b.setTree(a)
        })
      }
      return a
    }();
  b.TreeContext = m;
  var n = function(a) {
    function b(b, c, d) {
      typeof d == "undefined" && (d = {}), a.call(this), this.container = b, this.configuration = c, this.options = d,
        this.options.twistiePixels = typeof this.options.twistiePixels == "number" ? this.options.twistiePixels : 20,
        this.options.indentPixels = typeof this.options.indentPixels == "number" ? this.options.indentPixels : 10,
        this.options.alwaysFocused = this.options.alwaysFocused === !0 ? !0 : !1, this.options.bare = this.options.bare === !
        0 ? !0 : !1, this.context = new m(this, c, d), this.model = new k.TreeModel(this.context), this.view = new l.TreeView(
          this.context, this.container), this.view.setModel(this.model), this.addEmitter(this.model)
    }
    return __extends(b, a), b.prototype.getHTMLElement = function() {
      return this.view.getHTMLElement()
    }, b.prototype.layout = function(a) {
      this.view.layout(a)
    }, b.prototype.DOMFocus = function() {
      this.view.focus()
    }, b.prototype.isDOMFocused = function() {
      return this.view.isFocused()
    }, b.prototype.DOMBlur = function() {
      this.view.blur()
    }, b.prototype.onVisible = function() {
      this.view.onVisible()
    }, b.prototype.onHidden = function() {
      this.view.onHidden()
    }, b.prototype.setInput = function(a) {
      return this.model.setInput(a)
    }, b.prototype.getInput = function() {
      return this.model.getInput()
    }, b.prototype.refresh = function(a, b) {
      return typeof a == "undefined" && (a = null), typeof b == "undefined" && (b = !0), this.model.refresh(a, b)
    }, b.prototype.refreshAll = function(a, b) {
      return typeof b == "undefined" && (b = !0), this.model.refreshAll(a, b)
    }, b.prototype.expand = function(a) {
      return this.model.expand(a)
    }, b.prototype.expandAll = function(a) {
      return this.model.expandAll(a)
    }, b.prototype.collapse = function(a, b) {
      return typeof b == "undefined" && (b = !1), this.model.collapse(a)
    }, b.prototype.collapseAll = function(a, b) {
      return typeof a == "undefined" && (a = null), typeof b == "undefined" && (b = !1), this.model.collapseAll(a, b)
    }, b.prototype.toggleExpansion = function(a) {
      return this.model.toggleExpansion(a)
    }, b.prototype.toggleExpansionAll = function(a) {
      return this.model.toggleExpansionAll(a)
    }, b.prototype.isExpanded = function(a) {
      return this.model.isExpanded(a)
    }, b.prototype.reveal = function(a, b) {
      return typeof b == "undefined" && (b = null), this.model.reveal(a, b)
    }, b.prototype.setHighlight = function(a, b) {
      this.model.setHighlight(a, b)
    }, b.prototype.getHighlight = function() {
      return this.model.getHighlight()
    }, b.prototype.isHighlighted = function(a) {
      return this.model.isFocused(a)
    }, b.prototype.clearHighlight = function(a) {
      this.model.setHighlight(null, a)
    }, b.prototype.select = function(a, b) {
      this.model.select(a, b)
    }, b.prototype.selectAll = function(a, b) {
      this.model.selectAll(a, b)
    }, b.prototype.deselect = function(a, b) {
      this.model.deselect(a, b)
    }, b.prototype.deselectAll = function(a, b) {
      this.model.deselectAll(a, b)
    }, b.prototype.setSelection = function(a, b) {
      this.model.setSelection(a, b)
    }, b.prototype.isSelected = function(a) {
      return this.model.isSelected(a)
    }, b.prototype.getSelection = function() {
      return this.model.getSelection()
    }, b.prototype.clearSelection = function(a) {
      this.model.setSelection([], a)
    }, b.prototype.selectNext = function(a, b) {
      this.model.selectNext(a, b)
    }, b.prototype.selectPrevious = function(a, b) {
      this.model.selectPrevious(a, b)
    }, b.prototype.selectParent = function(a) {
      this.model.selectParent(a)
    }, b.prototype.setFocus = function(a, b) {
      this.model.setFocus(a, b)
    }, b.prototype.isFocused = function(a) {
      return this.model.isFocused(a)
    }, b.prototype.getFocus = function() {
      return this.model.getFocus()
    }, b.prototype.focusNext = function(a, b) {
      this.model.focusNext(a, b)
    }, b.prototype.focusPrevious = function(a, b) {
      this.model.focusPrevious(a, b)
    }, b.prototype.focusParent = function(a) {
      this.model.focusParent(a)
    }, b.prototype.focusFirst = function(a) {
      this.model.focusFirst(a)
    }, b.prototype.focusLast = function(a) {
      this.model.focusLast(a)
    }, b.prototype.focusNextPage = function(a) {
      this.view.focusNextPage(a)
    }, b.prototype.focusPreviousPage = function(a) {
      this.view.focusPreviousPage(a)
    }, b.prototype.clearFocus = function(a) {
      this.model.setFocus(null, a)
    }, b.prototype.withFakeRow = function(a) {
      return this.view.withFakeRow(a)
    }, b.prototype.dispose = function() {
      this.model !== null && (this.model.dispose(), this.model = null), this.view !== null && (this.view.dispose(),
        this.view = null), a.prototype.dispose.call(this)
    }, b
  }(j.EventEmitter);
  b.Tree = n
})