define("vs/base/ui/widgets/tree/treeImpl", ["require", "exports", "vs/base/types",
  "vs/base/ui/widgets/tree/treeDefaults", "vs/base/eventEmitter", "./treeModel", "./treeView", "vs/css!./tree"
], function(e, t, n, i, o, r, s) {
  var a = function() {
    function e(e, t, o) {
      if ("undefined" == typeof o && (o = {}), this.tree = e, this.configuration = t, this.options = o, !t.dataSource)
        throw new Error("You must provide a Data Source to the tree.");
      this.dataSource = t.dataSource;

      this.renderer = t.renderer || new i.DefaultRenderer;

      this.controller = t.controller || new i.DefaultController;

      this.dnd = t.dnd || new i.DefaultDragAndDrop;

      this.filter = t.filter || new i.DefaultFilter;

      this.sorter = t.sorter || null;
      var r = [this.dataSource, this.renderer, this.controller, this.dnd, this.filter, this.sorter];
      r.forEach(function(t) {
        if (t && n.isFunction(t.setTree)) {
          t.setTree(e);
        }
      });
    }
    return e;
  }();
  t.TreeContext = a;
  var u = function(e) {
    function t(t, n, i) {
      if ("undefined" == typeof i) {
        i = {};
      }

      e.call(this);

      this.container = t;

      this.configuration = n;

      this.options = i;

      this.options.twistiePixels = "number" == typeof this.options.twistiePixels ? this.options.twistiePixels : 32;

      this.options.indentPixels = "number" == typeof this.options.indentPixels ? this.options.indentPixels : 12;

      this.options.alwaysFocused = this.options.alwaysFocused === !0 ? !0 : !1;

      this.options.bare = this.options.bare === !0 ? !0 : !1;

      this.context = new a(this, n, i);

      this.model = new r.TreeModel(this.context);

      this.view = new s.TreeView(this.context, this.container);

      this.view.setModel(this.model);

      this.addEmitter(this.model);

      this.addEmitter(this.view);
    }
    __extends(t, e);

    t.prototype.getHTMLElement = function() {
      return this.view.getHTMLElement();
    };

    t.prototype.layout = function(e) {
      this.view.layout(e);
    };

    t.prototype.DOMFocus = function() {
      this.view.focus();
    };

    t.prototype.isDOMFocused = function() {
      return this.view.isFocused();
    };

    t.prototype.DOMBlur = function() {
      this.view.blur();
    };

    t.prototype.onVisible = function() {
      this.view.onVisible();
    };

    t.prototype.onHidden = function() {
      this.view.onHidden();
    };

    t.prototype.setInput = function(e) {
      return this.model.setInput(e);
    };

    t.prototype.getInput = function() {
      return this.model.getInput();
    };

    t.prototype.refresh = function(e, t) {
      "undefined" == typeof e && (e = null);

      "undefined" == typeof t && (t = !0);

      return this.model.refresh(e, t);
    };

    t.prototype.refreshAll = function(e, t) {
      "undefined" == typeof t && (t = !0);

      return this.model.refreshAll(e, t);
    };

    t.prototype.expand = function(e) {
      return this.model.expand(e);
    };

    t.prototype.expandAll = function(e) {
      return this.model.expandAll(e);
    };

    t.prototype.collapse = function(e, t) {
      "undefined" == typeof t && (t = !1);

      return this.model.collapse(e);
    };

    t.prototype.collapseAll = function(e, t) {
      "undefined" == typeof e && (e = null);

      "undefined" == typeof t && (t = !1);

      return this.model.collapseAll(e, t);
    };

    t.prototype.toggleExpansion = function(e) {
      return this.model.toggleExpansion(e);
    };

    t.prototype.toggleExpansionAll = function(e) {
      return this.model.toggleExpansionAll(e);
    };

    t.prototype.isExpanded = function(e) {
      return this.model.isExpanded(e);
    };

    t.prototype.reveal = function(e, t) {
      "undefined" == typeof t && (t = null);

      return this.model.reveal(e, t);
    };

    t.prototype.setHighlight = function(e, t) {
      this.model.setHighlight(e, t);
    };

    t.prototype.getHighlight = function() {
      return this.model.getHighlight();
    };

    t.prototype.isHighlighted = function(e) {
      return this.model.isFocused(e);
    };

    t.prototype.clearHighlight = function(e) {
      this.model.setHighlight(null, e);
    };

    t.prototype.select = function(e, t) {
      this.model.select(e, t);
    };

    t.prototype.selectAll = function(e, t) {
      this.model.selectAll(e, t);
    };

    t.prototype.deselect = function(e, t) {
      this.model.deselect(e, t);
    };

    t.prototype.deselectAll = function(e, t) {
      this.model.deselectAll(e, t);
    };

    t.prototype.setSelection = function(e, t) {
      this.model.setSelection(e, t);
    };

    t.prototype.isSelected = function(e) {
      return this.model.isSelected(e);
    };

    t.prototype.getSelection = function() {
      return this.model.getSelection();
    };

    t.prototype.clearSelection = function(e) {
      this.model.setSelection([], e);
    };

    t.prototype.selectNext = function(e, t) {
      this.model.selectNext(e, t);
    };

    t.prototype.selectPrevious = function(e, t) {
      this.model.selectPrevious(e, t);
    };

    t.prototype.selectParent = function(e) {
      this.model.selectParent(e);
    };

    t.prototype.setFocus = function(e, t) {
      this.model.setFocus(e, t);
    };

    t.prototype.isFocused = function(e) {
      return this.model.isFocused(e);
    };

    t.prototype.getFocus = function() {
      return this.model.getFocus();
    };

    t.prototype.focusNext = function(e, t) {
      this.model.focusNext(e, t);
    };

    t.prototype.focusPrevious = function(e, t) {
      this.model.focusPrevious(e, t);
    };

    t.prototype.focusParent = function(e) {
      this.model.focusParent(e);
    };

    t.prototype.focusFirst = function(e) {
      this.model.focusFirst(e);
    };

    t.prototype.focusLast = function(e) {
      this.model.focusLast(e);
    };

    t.prototype.focusNextPage = function(e) {
      this.view.focusNextPage(e);
    };

    t.prototype.focusPreviousPage = function(e) {
      this.view.focusPreviousPage(e);
    };

    t.prototype.clearFocus = function(e) {
      this.model.setFocus(null, e);
    };

    t.prototype.withFakeRow = function(e) {
      return this.view.withFakeRow(e);
    };

    t.prototype.dispose = function() {
      if (null !== this.model) {
        this.model.dispose();
        this.model = null;
      }

      if (null !== this.view) {
        this.view.dispose();
        this.view = null;
      }

      e.prototype.dispose.call(this);
    };

    return t;
  }(o.EventEmitter);
  t.Tree = u;
});