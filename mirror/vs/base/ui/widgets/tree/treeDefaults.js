define("vs/base/ui/widgets/tree/treeDefaults", ["require", "exports", "vs/base/env", "vs/base/errors"], function(e, t,
  n, i) {
  var o = function() {
    function e() {}
    e.prototype.getHeight = function() {
      return 20;
    };

    e.prototype.render = function(e, t, n) {
      n.textContent = "" + t;

      return null;
    };

    return e;
  }();
  t.DefaultRenderer = o;
  var r = function() {
    function e() {
      this.downKeyBindings = {
        Space: this.onSpace.bind(this),
        UpArrow: this.onUp.bind(this),
        PageUp: this.onPageUp.bind(this),
        DownArrow: this.onDown.bind(this),
        PageDown: this.onPageDown.bind(this),
        LeftArrow: this.onLeft.bind(this),
        RightArrow: this.onRight.bind(this),
        Escape: this.onEscape.bind(this)
      };

      this.upKeyBindings = {
        Enter: this.onEnter.bind(this)
      };

      n.browser.isMacintosh ? this.upKeyBindings["Meta-Enter"] = this.onEnter.bind(this) : this.upKeyBindings[
        "Ctrl-Enter"] = this.onEnter.bind(this);
    }
    e.prototype.onClick = function(e, t, i) {
      var o = n.browser.isMacintosh;
      return o && i.ctrlKey ? (i.preventDefault(), i.stopPropagation(), !1) : i.middleButton ? !1 : i.target && i.target
        .tagName && "input" === i.target.tagName.toLowerCase() ? !1 : this.onLeftClick(e, t, i);
    };

    e.prototype.onLeftClick = function(e, t, n, o) {
      "undefined" == typeof o && (o = "mouse");
      var r = {
        origin: o,
        originalEvent: n
      };
      e.getInput() === t ? (e.clearFocus(r), e.clearSelection(r)) : (n.preventDefault(), n.stopPropagation(), e.DOMFocus(),
        e.setSelection([t], r), e.setFocus(t, r), e.isExpanded(t) ? e.collapse(t).done(null, i.onUnexpectedError) : e
        .expand(t).done(null, i.onUnexpectedError));

      return !0;
    };

    e.prototype.onContextMenu = function() {
      return !1;
    };

    e.prototype.onTap = function(e, t, n) {
      var i = n.initialTarget;
      return i && i.tagName && "input" === i.tagName.toLowerCase() ? !1 : this.onLeftClick(e, t, n, "touch");
    };

    e.prototype.onKeyDown = function(e, t) {
      return this.onKey(this.downKeyBindings, e, t);
    };

    e.prototype.onKeyUp = function(e, t) {
      return this.onKey(this.upKeyBindings, e, t);
    };

    e.prototype.onKey = function(e, t, n) {
      var i = e[n.asString()];
      return i && i(t, n) ? (n.preventDefault(), n.stopPropagation(), !0) : !1;
    };

    e.prototype.onUp = function(e, t) {
      var n = {
        origin: "keyboard",
        originalEvent: t
      };
      e.getHighlight() ? e.clearHighlight(n) : (e.focusPrevious(1, n), e.reveal(e.getFocus()));

      return !0;
    };

    e.prototype.onPageUp = function(e, t) {
      var n = {
        origin: "keyboard",
        originalEvent: t
      };
      e.getHighlight() ? e.clearHighlight(n) : (e.focusPreviousPage(n), e.reveal(e.getFocus()));

      return !0;
    };

    e.prototype.onDown = function(e, t) {
      var n = {
        origin: "keyboard",
        originalEvent: t
      };
      e.getHighlight() ? e.clearHighlight(n) : (e.focusNext(1, n), e.reveal(e.getFocus()));

      return !0;
    };

    e.prototype.onPageDown = function(e, t) {
      var n = {
        origin: "keyboard",
        originalEvent: t
      };
      e.getHighlight() ? e.clearHighlight(n) : (e.focusNextPage(n), e.reveal(e.getFocus()));

      return !0;
    };

    e.prototype.onLeft = function(e, t) {
      var n = {
        origin: "keyboard",
        originalEvent: t
      };
      if (e.getHighlight()) e.clearHighlight(n);
      else {
        var i = e.getFocus();
        e.collapse(i).done(function(t) {
          i && !t && e.focusParent(n);
        });
      }
      return !0;
    };

    e.prototype.onRight = function(e, t) {
      var n = {
        origin: "keyboard",
        originalEvent: t
      };
      if (e.getHighlight()) e.clearHighlight(n);
      else {
        var o = e.getFocus();
        e.expand(o).done(null, i.onUnexpectedError);
      }
      return !0;
    };

    e.prototype.onEnter = function(e, t) {
      var n = {
        origin: "keyboard",
        originalEvent: t
      };
      if (e.getHighlight()) return !1;
      var i = e.getFocus();
      i && e.setSelection([i], n);

      return !0;
    };

    e.prototype.onSpace = function(e) {
      if (e.getHighlight()) return !1;
      var t = e.getFocus();
      t && e.toggleExpansion(t);

      return !0;
    };

    e.prototype.onEscape = function(e, t) {
      var n = {
        origin: "keyboard",
        originalEvent: t
      };
      return e.getHighlight() ? (e.clearHighlight(n), !0) : e.getFocus() || e.getSelection().length ? (e.clearFocus(n),
        e.clearSelection(n), !0) : !1;
    };

    return e;
  }();
  t.DefaultController = r;
  var s = function() {
    function e() {}
    e.prototype.getDragURI = function() {
      return null;
    };

    e.prototype.onDragStart = function() {};

    e.prototype.onDragOver = function() {
      return null;
    };

    e.prototype.drop = function() {};

    return e;
  }();
  t.DefaultDragAndDrop = s;
  var a = function() {
    function e() {}
    e.prototype.isVisible = function() {
      return !0;
    };

    return e;
  }();
  t.DefaultFilter = a;
  var u = function() {
    function e() {}
    e.prototype.compare = function() {
      return 0;
    };

    return e;
  }();
  t.DefaultSorter = u;
});