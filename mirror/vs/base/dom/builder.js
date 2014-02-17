define("vs/base/dom/builder", ["require", "exports", "vs/base/lib/winjs.base", "vs/base/types", "vs/base/strings",
  "vs/base/assert", "vs/base/dom/dom", "vs/base/dom/browserService", "vs/css!./builder"
], function(e, t, n, i, o, r, s, a) {
  function u(e, t) {
    r.ok(i.isString(e), "Expected String as parameter");
    var n = a.getService().document.getElementById(e);
    return n ? new T(n, t) : null;
  }

  function l(e) {
    e[b] || (e[b] = {});

    return e[b];
  }

  function c(e) {
    return !!e[b];
  }

  function d(e, t) {
    return e instanceof N ? new N(e) : new T(e.getHTMLElement(), t);
  }

  function h(e, t) {
    return new T(e, t);
  }

  function p() {
    return new T(null, !0);
  }

  function f(e, t, n) {
    l(e)[t] = n;
  }

  function g(e, t, n) {
    if (c(e)) {
      var o = l(e)[t];
      if (!i.isUndefined(o)) {
        return o;
      }
    }
    return n;
  }

  function m(e, t) {
    c(e) && delete l(e)[t];
  }

  function v(e, n) {
    t.setPropertyOnElement(e, C, n);
  }

  function y(e) {
    t.removePropertyFromElement(e, C);
  }

  function _(e) {
    return t.getPropertyFromElement(e, C);
  }
  t.withElementById = u;

  t.Build = {
    withElementById: t.withElementById
  };
  var b = "_msDataKey";

  var C = "__$binding";

  var w = "__$listeners";

  var E = "__$visibility";

  var S = function() {
    function e(e, t) {
      this.x = e;

      this.y = t;
    }
    return e;
  }();
  t.Position = S;
  var x = function() {
    function e(e, t, n, i) {
      this.top = e;

      this.right = t;

      this.bottom = n;

      this.left = i;
    }
    return e;
  }();
  t.Box = x;
  var L = function() {
    function e(e, t) {
      this.width = e;

      this.height = t;
    }
    e.prototype.substract = function(t) {
      return new e(this.width - t.left - t.right, this.height - t.top - t.bottom);
    };

    return e;
  }();
  t.Dimension = L;
  var T = function() {
    function e(e, t) {
      this.offdom = t;

      this.container = e;

      this.currentElement = e;

      this.createdElements = [];

      this.toUnbind = {};

      this.captureToUnbind = {};

      this.browserService = a.getService();
    }
    e.prototype.asContainer = function() {
      return d(this, this.offdom);
    };

    e.prototype.clone = function() {
      var t = new e(this.container, this.offdom);
      t.currentElement = this.currentElement;

      t.createdElements = this.createdElements;

      t.captureToUnbind = this.captureToUnbind;

      t.toUnbind = this.toUnbind;

      return t;
    };

    e.prototype.and = function(t) {
      t instanceof e || t instanceof N || (t = new e(t, this.offdom));
      var n = [this];
      if (t instanceof N)
        for (var i = 0; i < t.length; i++) {
          n.push(t.item(i));
        } else {
          n.push(t);
        }
      return new N(n);
    };

    e.prototype.build = function(t, n) {
      r.ok(this.offdom, "This builder was not created off-dom, so build() can not be called.");

      t ? t instanceof e && (t = t.getHTMLElement()) : t = this.container;

      r.ok(t, "Builder can only be build() with a container provided.");

      r.ok(s.isHTMLElement(t), "The container must either be a HTMLElement or a Builder.");
      var o;

      var a;

      var u = t;

      var l = u.childNodes;
      if (i.isNumber(n) && n < l.length)
        for (o = 0, a = this.createdElements.length; a > o; o++) {
          u.insertBefore(this.createdElements[o], l[n++]);
        } else
          for (o = 0, a = this.createdElements.length; a > o; o++) {
            u.appendChild(this.createdElements[o]);
          }
      return this;
    };

    e.prototype.appendTo = function(t, n) {
      t ? t instanceof e && (t = t.getHTMLElement()) : t = this.container;

      r.ok(t, "Builder can only be build() with a container provided.");

      r.ok(s.isHTMLElement(t), "The container must either be a HTMLElement or a Builder.");
      var o = t;
      this.currentElement.parentNode && this.currentElement.parentNode.removeChild(this.currentElement);
      var a = o.childNodes;
      i.isNumber(n) && n < a.length ? o.insertBefore(this.currentElement, a[n]) : o.appendChild(this.currentElement);

      return this;
    };

    e.prototype.append = function(t, n) {
      r.ok(t, "Need a child to append");

      s.isHTMLElement(t) && (t = h(t));

      r.ok(t instanceof e || t instanceof N, "Need a child to append");

      t.appendTo(this, n);

      return this;
    };

    e.prototype.offDOM = function() {
      this.currentElement.parentNode && this.currentElement.parentNode.removeChild(this.currentElement);

      return this;
    };

    e.prototype.getHTMLElement = function() {
      return this.currentElement;
    };

    e.prototype.getContainer = function() {
      return this.container;
    };

    e.prototype.div = function(e, t) {
      return this.doElement("div", e, t);
    };

    e.prototype.p = function(e, t) {
      return this.doElement("p", e, t);
    };

    e.prototype.ul = function(e, t) {
      return this.doElement("ul", e, t);
    };

    e.prototype.ol = function(e, t) {
      return this.doElement("ol", e, t);
    };

    e.prototype.li = function(e, t) {
      return this.doElement("li", e, t);
    };

    e.prototype.span = function(e, t) {
      return this.doElement("span", e, t);
    };

    e.prototype.img = function(e, t) {
      return this.doElement("img", e, t);
    };

    e.prototype.a = function(e, t) {
      return this.doElement("a", e, t);
    };

    e.prototype.header = function(e, t) {
      return this.doElement("header", e, t);
    };

    e.prototype.section = function(e, t) {
      return this.doElement("section", e, t);
    };

    e.prototype.footer = function(e, t) {
      return this.doElement("footer", e, t);
    };

    e.prototype.element = function(e, t, n) {
      return this.doElement(e, t, n);
    };

    e.prototype.doElement = function(t, n, o) {
      var r = this.browserService.document.createElement(t);
      if (this.currentElement = r, this.offdom && this.createdElements.push(r), i.isObject(n) && this.attr(n), i.isFunction(
        n) && (o = n), i.isFunction(o)) {
        var s = new e(r);
        o.call(s, s);
      }
      this.offdom || this.container.appendChild(r);

      return this;
    };

    e.prototype.domFocus = function() {
      this.currentElement.focus();

      return this;
    };

    e.prototype.hasFocus = function() {
      var e = this.browserService.document.activeElement;
      return e === this.currentElement;
    };

    e.prototype.domSelect = function(e) {
      "undefined" == typeof e && (e = null);
      var t = this.currentElement;
      t.select();

      e && t.setSelectionRange(e.start, e.end);

      return this;
    };

    e.prototype.domBlur = function() {
      this.currentElement.blur();

      return this;
    };

    e.prototype.domClick = function() {
      this.currentElement.click();

      return this;
    };

    e.prototype.on = function(e, t, n, o) {
      var r = this;
      if (i.isArray(e)) {
        e.forEach(function(e) {
          r.on(e, t, n, o);
        });
      } else {
        var a = e;

        var u = s.addListener(this.currentElement, a, function(e) {
          t(e, r, u);
        }, o || !1);
        o ? (this.captureToUnbind[a] || (this.captureToUnbind[a] = []), this.captureToUnbind[a].push(u)) : (this.toUnbind[
          a] || (this.toUnbind[a] = []), this.toUnbind[a].push(u));
        var l = this.getProperty(w, []);
        l.push(u);

        this.setProperty(w, l);

        n && i.isArray(n) && n.push(u);
      }
      return this;
    };

    e.prototype.off = function(e, t) {
      var n = this;
      if (i.isArray(e)) {
        e.forEach(function(e) {
          n.off(e);
        });
      } else {
        var o = e;
        if (t) {
          if (this.captureToUnbind[o])
            for (; this.captureToUnbind[o].length;) {
              this.captureToUnbind[o].pop()();
            }
        } else if (this.toUnbind[o])
          for (; this.toUnbind[o].length;) {
            this.toUnbind[o].pop()();
          }
      }
      return this;
    };

    e.prototype.once = function(e, t, n, o) {
      var r = this;
      if (i.isArray(e)) {
        e.forEach(function(e) {
          r.once(e, t);
        });
      } else var a = e;

      var u = s.addListener(this.currentElement, a, function(e) {
        t(e, r, u);

        u();
      }, o || !1);
      return this;
    };

    e.prototype.preventDefault = function(e, t, n) {
      var i = function(e) {
        e.preventDefault();

        t && (e.stopPropagation ? e.stopPropagation() : e.cancelBubble = !0);
      };
      return this.on(e, i, n);
    };

    e.prototype.attr = function(e, t) {
      if (i.isObject(e)) {
        for (var n in e)
          if (e.hasOwnProperty(n)) {
            var o = e[n];
            this.doSetAttr(n, o);
          }
        return this;
      }
      return i.isString(e) && !i.isString(t) ? this.currentElement.getAttribute(e) : (i.isString(e) && (i.isString(t) ||
        (t = String(t)), this.doSetAttr(e, t)), this);
    };

    e.prototype.doSetAttr = function(e, t) {
      "class" === e && (e = "addClass");

      this[e] ? i.isArray(t) ? this[e].apply(this, t) : this[e].call(this, t) : this.currentElement.setAttribute(e, t);
    };

    e.prototype.id = function(e) {
      this.currentElement.setAttribute("id", e);

      return this;
    };

    e.prototype.src = function(e) {
      this.currentElement.setAttribute("src", e);

      return this;
    };

    e.prototype.href = function(e) {
      this.currentElement.setAttribute("href", e);

      return this;
    };

    e.prototype.title = function(e) {
      this.currentElement.setAttribute("title", e);

      return this;
    };

    e.prototype.name = function(e) {
      this.currentElement.setAttribute("name", e);

      return this;
    };

    e.prototype.type = function(e) {
      this.currentElement.setAttribute("type", e);

      return this;
    };

    e.prototype.value = function(e) {
      this.currentElement.setAttribute("value", e);

      return this;
    };

    e.prototype.alt = function(e) {
      this.currentElement.setAttribute("alt", e);

      return this;
    };

    e.prototype.draggable = function(e) {
      this.currentElement.setAttribute("draggable", e ? "true" : "false");

      return this;
    };

    e.prototype.tabindex = function(e) {
      this.currentElement.setAttribute("tabindex", e.toString());

      return this;
    };

    e.prototype.style = function(e, t) {
      if (i.isObject(e)) {
        for (var n in e)
          if (e.hasOwnProperty(n)) {
            var o = e[n];
            this.doSetStyle(n, o);
          }
      } else {
        if (i.isString(e) && !i.isString(t)) {
          return this.currentElement.style[this.cssKeyToJavaScriptProperty(e)];
        }
        i.isString(e) && i.isString(t) && this.doSetStyle(e, t);
      }
      return this;
    };

    e.prototype.doSetStyle = function(e, t) {
      if (e.indexOf("-") >= 0) {
        var n = e.split("-");
        e = n[0];
        for (var i = 1; i < n.length; i++) {
          var o = n[i];
          e = e + o.charAt(0).toUpperCase() + o.substr(1);
        }
      }
      this.currentElement.style[this.cssKeyToJavaScriptProperty(e)] = t;
    };

    e.prototype.cssKeyToJavaScriptProperty = function(e) {
      if (e.indexOf("-") >= 0) {
        var t = e.split("-");
        e = t[0];
        for (var n = 1; n < t.length; n++) {
          var i = t[n];
          e = e + i.charAt(0).toUpperCase() + i.substr(1);
        }
      } else {
        "float" === e && (e = "cssFloat");
      }
      return e;
    };

    e.prototype.getComputedStyle = function() {
      return s.getComputedStyle(this.currentElement);
    };

    e.prototype.addClass = function() {
      for (var e = [], t = 0; t < arguments.length - 0; t++) {
        e[t] = arguments[t + 0];
      }
      var n = this;
      e.forEach(function(e) {
        var t = e.split(" ");
        t.forEach(function(e) {
          s.addClass(n.currentElement, e);
        });
      });

      return this;
    };

    e.prototype.setClass = function(e, t) {
      "undefined" == typeof t && (t = null);

      null === t ? this.currentElement.className = e : t ? this.addClass(e) : this.removeClass(e);

      return this;
    };

    e.prototype.hasClass = function(e) {
      return s.hasClass(this.currentElement, e);
    };

    e.prototype.removeClass = function() {
      for (var e = [], t = 0; t < arguments.length - 0; t++) {
        e[t] = arguments[t + 0];
      }
      var n = this;
      e.forEach(function(e) {
        var t = e.split(" ");
        t.forEach(function(e) {
          s.removeClass(n.currentElement, e);
        });
      });

      return this;
    };

    e.prototype.swapClass = function(e, t) {
      this.hasClass(e) ? (this.removeClass(e), this.addClass(t)) : (this.removeClass(t), this.addClass(e));

      return this;
    };

    e.prototype.toggleClass = function(e) {
      this.hasClass(e) ? this.removeClass(e) : this.addClass(e);

      return this;
    };

    e.prototype.color = function(e) {
      this.currentElement.style.color = e;

      return this;
    };

    e.prototype.background = function(e) {
      this.currentElement.style.backgroundColor = e;

      return this;
    };

    e.prototype.padding = function(e, t, n, o) {
      return i.isString(e) && e.indexOf(" ") >= 0 ? this.padding.apply(this, e.split(" ")) : (i.isUndefinedOrNull(e) ||
        (this.currentElement.style.paddingTop = this.toPixel(e)), i.isUndefinedOrNull(t) || (this.currentElement.style
          .paddingRight = this.toPixel(t)), i.isUndefinedOrNull(n) || (this.currentElement.style.paddingBottom = this
          .toPixel(n)), i.isUndefinedOrNull(o) || (this.currentElement.style.paddingLeft = this.toPixel(o)), this);
    };

    e.prototype.margin = function(e, t, n, o) {
      return i.isString(e) && e.indexOf(" ") >= 0 ? this.margin.apply(this, e.split(" ")) : (i.isUndefinedOrNull(e) ||
        (this.currentElement.style.marginTop = this.toPixel(e)), i.isUndefinedOrNull(t) || (this.currentElement.style
          .marginRight = this.toPixel(t)), i.isUndefinedOrNull(n) || (this.currentElement.style.marginBottom = this.toPixel(
          n)), i.isUndefinedOrNull(o) || (this.currentElement.style.marginLeft = this.toPixel(o)), this);
    };

    e.prototype.position = function(e, t, n, o, r) {
      return i.isString(e) && e.indexOf(" ") >= 0 ? this.position.apply(this, e.split(" ")) : (i.isUndefinedOrNull(e) ||
        (this.currentElement.style.top = this.toPixel(e)), i.isUndefinedOrNull(t) || (this.currentElement.style.right =
          this.toPixel(t)), i.isUndefinedOrNull(n) || (this.currentElement.style.bottom = this.toPixel(n)), i.isUndefinedOrNull(
          o) || (this.currentElement.style.left = this.toPixel(o)), r || (r = "absolute"), this.currentElement.style.position =
        r, this);
    };

    e.prototype.size = function(e, t) {
      return i.isString(e) && e.indexOf(" ") >= 0 ? this.size.apply(this, e.split(" ")) : (i.isUndefinedOrNull(e) ||
        (this.currentElement.style.width = this.toPixel(e)), i.isUndefinedOrNull(t) || (this.currentElement.style.height =
          this.toPixel(t)), this);
    };

    e.prototype.minSize = function(e, t) {
      return i.isString(e) && e.indexOf(" ") >= 0 ? this.minSize.apply(this, e.split(" ")) : (i.isUndefinedOrNull(e) ||
        (this.currentElement.style.minWidth = this.toPixel(e)), i.isUndefinedOrNull(t) || (this.currentElement.style.minHeight =
          this.toPixel(t)), this);
    };

    e.prototype.maxSize = function(e, t) {
      return i.isString(e) && e.indexOf(" ") >= 0 ? this.maxSize.apply(this, e.split(" ")) : (i.isUndefinedOrNull(e) ||
        (this.currentElement.style.maxWidth = this.toPixel(e)), i.isUndefinedOrNull(t) || (this.currentElement.style.maxHeight =
          this.toPixel(t)), this);
    };

    e.prototype.float = function(e) {
      this.currentElement.style.cssFloat = e;

      this.currentElement.style.styleFloat = e;

      return this;
    };

    e.prototype.clear = function(e) {
      this.currentElement.style.clear = e;

      return this;
    };

    e.prototype.normal = function() {
      this.currentElement.style.fontStyle = "normal";

      this.currentElement.style.fontWeight = "normal";

      this.currentElement.style.textDecoration = "none";

      return this;
    };

    e.prototype.italic = function() {
      this.currentElement.style.fontStyle = "italic";

      return this;
    };

    e.prototype.bold = function() {
      this.currentElement.style.fontWeight = "bold";

      return this;
    };

    e.prototype.underline = function() {
      this.currentElement.style.textDecoration = "underline";

      return this;
    };

    e.prototype.overflow = function(e) {
      this.currentElement.style.overflow = e;

      return this;
    };

    e.prototype.display = function(e) {
      this.currentElement.style.display = e;

      return this;
    };

    e.prototype.show = function() {
      this.hasClass("hidden") && this.removeClass("hidden");

      this.attr("aria-hidden", "false");

      this.cancelVisibilityPromise();

      return this;
    };

    e.prototype.showDelayed = function(e) {
      var t = this;
      this.cancelVisibilityPromise();
      var i = n.Promise.timeout(e);
      this.setProperty(E, i);

      i.done(function() {
        t.removeProperty(E);

        t.show();
      });

      return this;
    };

    e.prototype.hide = function() {
      this.hasClass("hidden") || this.addClass("hidden");

      this.attr("aria-hidden", "true");

      this.cancelVisibilityPromise();

      return this;
    };

    e.prototype.isHidden = function() {
      return this.hasClass("hidden") || "none" === this.currentElement.style.display;
    };

    e.prototype.toggleVisibility = function() {
      this.cancelVisibilityPromise();

      this.swapClass("builder-visible", "hidden");

      this.isHidden() ? this.attr("aria-hidden", "true") : this.attr("aria-hidden", "false");

      return this;
    };

    e.prototype.cancelVisibilityPromise = function() {
      var e = this.getProperty(E);
      e && (e.cancel(), this.removeProperty(E));
    };

    e.prototype.border = function(e, t, n) {
      return i.isString(e) && e.indexOf(" ") >= 0 ? this.border.apply(this, e.split(" ")) : (this.currentElement.style
        .borderWidth = this.toPixel(e), n && (this.currentElement.style.borderColor = n), t && (this.currentElement.style
          .borderStyle = t), this);
    };

    e.prototype.borderTop = function(e, t, n) {
      return i.isString(e) && e.indexOf(" ") >= 0 ? this.borderTop.apply(this, e.split(" ")) : (this.currentElement.style
        .borderTopWidth = this.toPixel(e), n && (this.currentElement.style.borderTopColor = n), t && (this.currentElement
          .style.borderTopStyle = t), this);
    };

    e.prototype.borderBottom = function(e, t, n) {
      return i.isString(e) && e.indexOf(" ") >= 0 ? this.borderBottom.apply(this, e.split(" ")) : (this.currentElement
        .style.borderBottomWidth = this.toPixel(e), n && (this.currentElement.style.borderBottomColor = n), t && (
          this.currentElement.style.borderBottomStyle = t), this);
    };

    e.prototype.borderLeft = function(e, t, n) {
      return i.isString(e) && e.indexOf(" ") >= 0 ? this.borderLeft.apply(this, e.split(" ")) : (this.currentElement.style
        .borderLeftWidth = this.toPixel(e), n && (this.currentElement.style.borderLeftColor = n), t && (this.currentElement
          .style.borderLeftStyle = t), this);
    };

    e.prototype.borderRight = function(e, t, n) {
      return i.isString(e) && e.indexOf(" ") >= 0 ? this.borderRight.apply(this, e.split(" ")) : (this.currentElement
        .style.borderRightWidth = this.toPixel(e), n && (this.currentElement.style.borderRightColor = n), t && (this.currentElement
          .style.borderRightStyle = t), this);
    };

    e.prototype.textAlign = function(e) {
      this.currentElement.style.textAlign = e;

      return this;
    };

    e.prototype.verticalAlign = function(e) {
      this.currentElement.style.verticalAlign = e;

      return this;
    };

    e.prototype.toPixel = function(e) {
      return -1 === e.toString().indexOf("px") ? e.toString() + "px" : e;
    };

    e.prototype.innerHtml = function(e, t) {
      t ? this.currentElement.innerHTML += e : this.currentElement.innerHTML = e;

      return this;
    };

    e.prototype.text = function(e, t) {
      t ? 0 === this.currentElement.children.length ? this.currentElement.textContent += e : this.currentElement.appendChild(
        this.browserService.document.createTextNode(e)) : this.currentElement.textContent = e;

      return this;
    };

    e.prototype.safeInnerHtml = function(e, t) {
      return this.innerHtml(o.escape(e), t);
    };

    e.prototype.insertHtmlBeforeBegin = function(e) {
      this.currentElement.insertAdjacentHTML("beforeBegin", e);

      return this;
    };

    e.prototype.insertHtmlAfterBegin = function(e) {
      this.currentElement.insertAdjacentHTML("afterBegin", e);

      return this;
    };

    e.prototype.insertHtmlBeforeEnd = function(e) {
      this.currentElement.insertAdjacentHTML("beforeEnd", e);

      return this;
    };

    e.prototype.insertHtmlAfterEnd = function(e) {
      this.currentElement.insertAdjacentHTML("afterEnd", e);

      return this;
    };

    e.prototype.bind = function(e) {
      t.bindElement(this.currentElement, e);

      return this;
    };

    e.prototype.unbind = function() {
      t.unbindElement(this.currentElement);

      return this;
    };

    e.prototype.getBinding = function() {
      return t.getBindingFromElement(this.currentElement);
    };

    e.prototype.setProperty = function(e, n) {
      t.setPropertyOnElement(this.currentElement, e, n);

      return this;
    };

    e.prototype.getProperty = function(e, n) {
      return t.getPropertyFromElement(this.currentElement, e, n);
    };

    e.prototype.removeProperty = function(e) {
      c(this.currentElement) && delete l(this.currentElement)[e];

      return this;
    };

    e.prototype.parent = function(e) {
      r.ok(!this.offdom, "Builder was created with offdom = true and thus has no parent set");

      return h(this.currentElement.parentNode, e);
    };

    e.prototype.children = function(e) {
      for (var t = this.currentElement.children, n = [], i = 0; i < t.length; i++) {
        n.push(h(t.item(i), e));
      }
      return new N(n);
    };

    e.prototype.removeChild = function(e) {
      this.currentElement === e.parent().getHTMLElement() && this.currentElement.removeChild(e.getHTMLElement());

      return this;
    };

    e.prototype.select = function(e, t) {
      r.ok(i.isString(e), "Expected String as parameter");
      for (var n = this.currentElement.querySelectorAll(e), o = [], s = 0; s < n.length; s++) {
        o.push(h(n.item(s), t));
      }
      return new N(o);
    };

    e.prototype.matches = function(e) {
      var t = this.currentElement;

      var n = t.webkitMatchesSelector || t.mozMatchesSelector || t.msMatchesSelector || t.oMatchesSelector;
      return n && n.call(t, e);
    };

    e.prototype.isEmpty = function() {
      return !this.currentElement.childNodes || 0 === this.currentElement.childNodes.length;
    };

    e.prototype.unbindDescendants = function(e) {
      if (e.children)
        for (var t = 0, n = e.children.length; n > t; t++) {
          var o = e.children.item(t);
          if (c(o)) {
            var r = l(o)[w];
            if (i.isArray(r))
              for (; r.length;) {
                r.pop()();
              }
            delete o[b];
          }
          this.unbindDescendants(o);
        }
    };

    e.prototype.empty = function() {
      this.unbindDescendants(this.currentElement);

      this.clearChildren();

      this.offdom && (this.createdElements = []);

      return this;
    };

    e.prototype.clearChildren = function() {
      s.clearNode(this.currentElement);

      return this;
    };

    e.prototype.destroy = function() {
      if (this.currentElement.parentNode && this.currentElement.parentNode.removeChild(this.currentElement), this.empty(),
        c(this.currentElement)) {
        var e = l(this.currentElement)[w];
        if (i.isArray(e))
          for (; e.length;) {
            e.pop()();
          }
        delete this.currentElement[b];
      }
      var t;
      for (t in this.toUnbind)
        if (this.toUnbind.hasOwnProperty(t) && i.isArray(this.toUnbind[t]))
          for (; this.toUnbind[t].length;) {
            this.toUnbind[t].pop()();
          }
      for (t in this.captureToUnbind)
        if (this.captureToUnbind.hasOwnProperty(t) && i.isArray(this.captureToUnbind[t]))
          for (; this.captureToUnbind[t].length;) {
            this.captureToUnbind[t].pop()();
          }
      this.currentElement = null;

      this.container = null;

      this.offdom = null;

      this.createdElements = null;

      this.captureToUnbind = null;

      this.toUnbind = null;
    };

    e.prototype.dispose = function() {
      this.destroy();
    };

    e.prototype.getPositionRelativeTo = function(t) {
      t instanceof e && (t = t.getHTMLElement());
      var n = s.getRelativeLeft(this.currentElement, t);

      var i = s.getRelativeTop(this.currentElement, t);
      return new x(i, -1, -1, n);
    };

    e.prototype.getPosition = function() {
      var e = s.getTopLeftOffset(this.currentElement);
      return new x(e.top, -1, -1, e.left);
    };

    e.prototype.getTotalSize = function() {
      var e = s.getTotalWidth(this.currentElement);

      var t = s.getTotalHeight(this.currentElement);
      return new L(e, t);
    };

    e.prototype.getContentSize = function() {
      var e = s.getContentWidth(this.currentElement);

      var t = s.getContentHeight(this.currentElement);
      return new L(e, t);
    };

    e.prototype.getClientArea = function() {
      if (this.currentElement !== this.browserService.document.body) {
        var e = s.getDomNodePosition(this.currentElement);
        return new L(e.width, e.height);
      }
      if (this.browserService.window.innerWidth && this.browserService.window.innerHeight) {
        return new L(this.browserService.window.innerWidth, this.browserService.window.innerHeight);
      }
      if (this.browserService.document.body && this.browserService.document.body.clientWidth && this.browserService.document
        .body.clientWidth) {
        return new L(this.browserService.document.body.clientWidth, this.browserService.document.body.clientHeight);
      }
      if (this.browserService.document.documentElement && this.browserService.document.documentElement.clientWidth &&
        this.browserService.document.documentElement.clientHeight) {
        return new L(this.browserService.document.documentElement.clientWidth, this.browserService.document.documentElement
          .clientHeight);
      }
      throw new Error("Unable to figure out browser width and height");
    };

    return e;
  }();
  t.Builder = T;
  var N = function(e) {
    function t(n) {
      if (r.ok(i.isArray(n) || n instanceof t, "Expected Array or MultiBuilder as parameter"), e.call(this), this.length =
        0, this.builders = [], i.isArray(n))
        for (var o = 0; o < n.length; o++) {
          n[o] instanceof HTMLElement ? this.push(h(n[o])) : this.push(n[o]);
        } else
          for (var o = 0; o < n.length; o++) {
            this.push(n.item(o));
          }
      var s = this;

      var a = function(e) {
        s[e] = function() {
          for (var n, o = Array.prototype.slice.call(arguments), r = !1, a = 0; a < s.length; a++) {
            var u = s.item(a)[e].apply(s.item(a), o);
            if (u instanceof t) {
              n || (n = []);

              r = !0;
              for (var l = 0; l < u.length; l++) {
                n.push(u.item(l));
              }
            } else {
              i.isUndefined(u) || u instanceof T || (n || (n = []), n.push(u));
            }
          }
          return n && r ? new t(n) : n || s;
        };
      };
      for (var u in T.prototype) {
        "clone" !== u && "and" !== u && T.prototype.hasOwnProperty(u) && i.isFunction(T.prototype[u]) && a(u);
      }
    }
    __extends(t, e);

    t.prototype.item = function(e) {
      return this.builders[e];
    };

    t.prototype.push = function() {
      for (var e = [], t = 0; t < arguments.length - 0; t++) {
        e[t] = arguments[t + 0];
      }
      for (var n = 0; n < e.length; n++) {
        this.builders.push(e[n]);
      }
      this.length = this.builders.length;
    };

    t.prototype.pop = function() {
      var e = this.builders.pop();
      this.length = this.builders.length;

      return e;
    };

    t.prototype.concat = function(e) {
      var t = this.builders.concat(e);
      this.length = this.builders.length;

      return t;
    };

    t.prototype.shift = function() {
      var e = this.builders.shift();
      this.length = this.builders.length;

      return e;
    };

    t.prototype.unshift = function(e) {
      var t = this.builders.unshift(e);
      this.length = this.builders.length;

      return t;
    };

    t.prototype.slice = function(e, t) {
      var n = this.builders.slice(e, t);
      this.length = this.builders.length;

      return n;
    };

    t.prototype.splice = function(e, t) {
      var n = this.builders.splice(e, t);
      this.length = this.builders.length;

      return n;
    };

    t.prototype.clone = function() {
      return new t(this);
    };

    t.prototype.and = function(e) {
      e instanceof T || e instanceof t || (e = new T(e));
      var n = [];
      if (e instanceof t)
        for (var i = 0; i < e.length; i++) {
          n.push(e.item(i));
        } else {
          n.push(e);
        }
      this.push.apply(this, n);

      return this;
    };

    return t;
  }(T);
  t.MultiBuilder = N;

  t.setPropertyOnElement = f;

  t.getPropertyFromElement = g;

  t.removePropertyFromElement = m;

  t.bindElement = v;

  t.unbindElement = y;

  t.getBindingFromElement = _;

  t.Binding = {
    setPropertyOnElement: t.setPropertyOnElement,
    getPropertyFromElement: t.getPropertyFromElement,
    removePropertyFromElement: t.removePropertyFromElement,
    bindElement: t.bindElement,
    unbindElement: t.unbindElement,
    getBindingFromElement: t.getBindingFromElement
  };
  var M = /([\w\-]+)?(#([\w\-]+))?((.([\w\-]+))*)/;
  t.$ = function(e) {
    if (i.isUndefined(e)) {
      return p();
    }
    if (!e) throw new Error("Bad use of $");
    if (s.isHTMLElement(e) || e === window) {
      return h(e);
    }
    if (i.isArray(e)) {
      return new N(e);
    }
    if (e instanceof T) {
      return d(e);
    }
    if (i.isString(e)) {
      if ("<" === e[0]) {
        var t;

        var n = a.getService().document.createElement("div");
        if (n.innerHTML = o.format.apply(o, arguments), 0 === n.children.length) throw new Error("Bad use of $");
        if (1 === n.children.length) {
          t = n.firstChild;
          n.removeChild(t);
          return h(t);
        }
        for (var r = []; n.firstChild;) {
          t = n.firstChild;
          n.removeChild(t);
          r.push(h(t));
        }
        return new N(r);
      }
      if (1 === arguments.length) {
        var u = M.exec(e);
        if (!u) throw new Error("Bad use of $");
        var l = u[1] || "div";

        var c = u[3] || void 0;

        var f = (u[4] || "").replace(/\./g, " ");

        var g = {};
        c && (g.id = c);

        f && (g["class"] = f);

        return p().element(l, g);
      }
      var m = p();
      m.element.apply(m, arguments);

      return m;
    }
    throw new Error("Bad use of $");
  };

  t.$.Box = x;

  t.$.Dimension = L;

  t.$.Position = S;

  t.$.Builder = T;

  t.$.MultiBuilder = N;

  t.$.Build = t.Build;

  t.$.Binding = t.Binding;
});