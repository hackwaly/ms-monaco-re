define(["require", "exports", "./tree", "vs/base/env", "vs/base/errors"], function(a, b, c, d, e) {
  var f = c;

  var g = d;

  var h = e;

  var i = function() {
    function a() {}
    a.prototype.getHeight = function(a, b) {
      return 20;
    };

    a.prototype.render = function(a, b, c) {
      c.textContent = "" + b;

      return null;
    };

    return a;
  }();
  b.DefaultRenderer = i;
  var j = function() {
    function a() {
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
    }
    a.prototype.onClick = function(a, b, c) {
      var d = g.browser.isMacintosh;

      var e = d ? c.metaKey : c.ctrlKey;
      return c.middleButton || e ? !1 : c.target && c.target.tagName && c.target.tagName.toLowerCase() === "input" ? !
        1 : this.onLeftClick(a, b, c);
    };

    a.prototype.onLeftClick = function(a, b, c) {
      var d = {
        origin: "mouse"
      };
      a.getInput() === b ? (a.clearFocus(d), a.clearSelection(d)) : (c.preventDefault(), c.stopPropagation(), a.setSelection(
        [b], d), a.setFocus(b, d), a.isExpanded(b) ? a.collapse(b).done(null, h.onUnexpectedError) : a.expand(b).done(
        null, h.onUnexpectedError));

      return !0;
    };

    a.prototype.onContextMenu = function(a, b, c) {
      return !1;
    };

    a.prototype.onKeyDown = function(a, b) {
      return this.onKey(this.downKeyBindings, a, b);
    };

    a.prototype.onKeyUp = function(a, b) {
      return this.onKey(this.upKeyBindings, a, b);
    };

    a.prototype.onKey = function(a, b, c) {
      var d = a[c.asString()];
      return d && d(b, c) ? (c.preventDefault(), c.stopPropagation(), !0) : !1;
    };

    a.prototype.onUp = function(a, b) {
      var c = {
        origin: "keyboard"
      };
      a.getHighlight() ? a.clearHighlight(c) : (a.focusPrevious(1, c), a.reveal(a.getFocus()));

      return !0;
    };

    a.prototype.onPageUp = function(a, b) {
      var c = {
        origin: "keyboard"
      };
      a.getHighlight() ? a.clearHighlight(c) : (a.focusPreviousPage(c), a.reveal(a.getFocus()));

      return !0;
    };

    a.prototype.onDown = function(a, b) {
      var c = {
        origin: "keyboard"
      };
      a.getHighlight() ? a.clearHighlight(c) : (a.focusNext(1, c), a.reveal(a.getFocus()));

      return !0;
    };

    a.prototype.onPageDown = function(a, b) {
      var c = {
        origin: "keyboard"
      };
      a.getHighlight() ? a.clearHighlight(c) : (a.focusNextPage(c), a.reveal(a.getFocus()));

      return !0;
    };

    a.prototype.onLeft = function(a, b) {
      var c = {
        origin: "keyboard"
      };
      if (a.getHighlight()) {
        a.clearHighlight(c);
      } else {
        var d = a.getFocus();
        a.collapse(d).done(function(b) {
          if (d && !b) {
            a.focusParent(c);
          }
        });
      }
      return !0;
    };

    a.prototype.onRight = function(a, b) {
      var c = {
        origin: "keyboard"
      };
      if (a.getHighlight()) {
        a.clearHighlight(c);
      } else {
        var d = a.getFocus();
        a.expand(d).done(null, h.onUnexpectedError);
      }
      return !0;
    };

    a.prototype.onEnter = function(a, b) {
      var c = {
        origin: "keyboard"
      };
      if (a.getHighlight()) {
        return !1;
      }
      var d = a.getFocus();
      d && a.setSelection([d], c);

      return !0;
    };

    a.prototype.onSpace = function(a, b) {
      if (a.getHighlight()) {
        return !1;
      }
      var c = a.getFocus();
      c && a.toggleExpansion(c);

      return !0;
    };

    a.prototype.onEscape = function(a, b) {
      var c = {
        origin: "keyboard"
      };
      return a.getHighlight() ? (a.clearHighlight(c), !0) : a.getFocus() || a.getSelection().length ? (a.clearFocus(c),
        a.clearSelection(c), !0) : !1;
    };

    return a;
  }();
  b.DefaultController = j;
  var k = function() {
    function a() {}
    a.prototype.getDragURI = function(a, b) {
      return null;
    };

    a.prototype.onDragStart = function(a, b, c) {
      return;
    };

    a.prototype.onDragOver = function(a, b, c, d) {
      return null;
    };

    a.prototype.drop = function(a, b, c, d) {
      return;
    };

    return a;
  }();
  b.DefaultDragAndDrop = k;
  var l = function() {
    function a() {}
    a.prototype.isVisible = function(a, b) {
      return !0;
    };

    return a;
  }();
  b.DefaultFilter = l;
  var m = function() {
    function a() {}
    a.prototype.compare = function(a, b, c) {
      return 0;
    };

    return a;
  }();
  b.DefaultSorter = m;
});