var __extends = this.__extends || function(a, b) {
    function d() {
      this.constructor = a;
    }
    for (var c in b) {
      if (b.hasOwnProperty(c)) {
        a[c] = b[c];
      }
    }
    d.prototype = b.prototype;

    a.prototype = new d;
  };

define(["require", "exports", "vs/base/lib/winjs.base", "vs/base/types", "vs/base/strings", "vs/base/assert",
  "vs/base/dom/dom", "vs/base/dom/browserService", "vs/css!./builder"
], function(a, b, c, d, e, f, g, h) {
  function v(a, b) {
    l.ok(!(a instanceof J), "Expected HTMLElement as parameter");

    return new J(a, b);
  }

  function w(a) {
    return new K(a);
  }

  function x(a, b) {
    l.ok(a instanceof J || a instanceof K, "Expected Builder as parameter");

    return a instanceof K ? new K(a) : new J(a.getHTMLElement(), b);
  }

  function y(a) {
    return new K(a);
  }

  function z() {
    return new J(null, !0);
  }

  function A(a, b) {
    l.ok(j.isString(a), "Expected String as parameter");
    var c = n.getService().document.getElementById(a);
    return c ? new J(c, b) : null;
  }

  function B(a, c) {
    l.ok(j.isString(a), "Expected String as parameter");
    var d = n.getService().document.querySelectorAll(a);

    var e = [];
    for (var f = 0; f < d.length; f++) {
      e.push(b.withElement(d.item(f), c));
    }
    return new K(e);
  }

  function C(a) {
    a[o] || (a[o] = {});

    return a[o];
  }

  function D(a, b, c) {
    C(a)[b] = c;
  }

  function E(a, b, c) {
    var d = C(a)[b];
    return j.isUndefined(d) ? c : d;
  }

  function F(a, b) {
    delete C(a)[b];
  }

  function G(a, c) {
    b.setPropertyOnElement(a, p, c);
  }

  function H(a) {
    b.removePropertyFromElement(a, p);
  }

  function I(a) {
    return b.getPropertyFromElement(a, p);
  }
  var i = c;

  var j = d;

  var k = e;

  var l = f;

  var m = g;

  var n = h;

  var o = "_msDataKey";

  var p = "__$binding";

  var q = "__$listeners";

  var r = "__$visibility";

  var s = function() {
    function a(a, b) {
      this.x = a;

      this.y = b;
    }
    return a;
  }();
  b.Position = s;
  var t = function() {
    function a(a, b, c, d) {
      this.top = a;

      this.right = b;

      this.bottom = c;

      this.left = d;
    }
    return a;
  }();
  b.Box = t;
  var u = function() {
    function a(a, b) {
      this.width = a;

      this.height = b;
    }
    a.prototype.substract = function(b) {
      return new a(this.width - b.left - b.right, this.height - b.top - b.bottom);
    };

    return a;
  }();
  b.Dimension = u;

  b.withElement = v;

  b.withElements = w;

  b.withBuilder = x;

  b.withBuilders = y;

  b.offDOM = z;

  b.withElementById = A;

  b.withElementsBySelector = B;

  b.Select = function(a, c) {
    return b.withElementsBySelector(a, c);
  };

  b.Build = {
    withElement: b.withElement,
    withBuilder: b.withBuilder,
    offDOM: b.offDOM,
    withElementById: b.withElementById,
    withElementsBySelector: b.withElementsBySelector
  };

  b.setPropertyOnElement = D;

  b.getPropertyFromElement = E;

  b.removePropertyFromElement = F;

  b.bindElement = G;

  b.unbindElement = H;

  b.getBindingFromElement = I;

  b.Binding = {
    setPropertyOnElement: b.setPropertyOnElement,
    getPropertyFromElement: b.getPropertyFromElement,
    removePropertyFromElement: b.removePropertyFromElement,
    bindElement: b.bindElement,
    unbindElement: b.unbindElement,
    getBindingFromElement: b.getBindingFromElement
  };
  var J = function() {
    function a(a, b) {
      this.offdom = b;

      this.container = a;

      this.currentElement = a;

      this.createdElements = [];

      this.toUnbind = {};

      this.captureToUnbind = {};

      this.browserService = n.getService();
    }
    a.prototype.asContainer = function() {
      return b.withBuilder(this, this.offdom);
    };

    a.prototype.clone = function() {
      var b = new a(this.container, this.offdom);
      b.currentElement = this.currentElement;

      b.createdElements = this.createdElements;

      b.captureToUnbind = this.captureToUnbind;

      b.toUnbind = this.toUnbind;

      return b;
    };

    a.prototype.and = function(b) {
      if (!(b instanceof a) && !(b instanceof K)) {
        b = new a(b, this.offdom);
      }
      var c = [this];
      if (b instanceof K)
        for (var d = 0; d < b.length; d++) {
          c.push(b.item(d));
        } else {
          c.push(b);
        }
      return new K(c);
    };

    a.prototype.build = function(b, c) {
      l.ok(this.offdom, "This builder was not created off-dom, so build() can not be called.");

      if (b) {
        if (b instanceof a) {
          b = b.getHTMLElement();
        }
      } else {
        b = this.container;
      }

      l.ok(b, "Builder can only be build() with a container provided.");

      l.ok(m.isHTMLElement(b), "The container must either be a HTMLElement or a Builder.");
      var d = b;

      var e;

      var f;

      var g = d.childNodes;
      if (j.isNumber(c) && c < g.length)
        for (e = 0, f = this.createdElements.length; e < f; e++) {
          d.insertBefore(this.createdElements[e], g[c++]);
        } else
          for (e = 0, f = this.createdElements.length; e < f; e++) {
            d.appendChild(this.createdElements[e]);
          }
      return this;
    };

    a.prototype.appendTo = function(b, c) {
      if (b) {
        if (b instanceof a) {
          b = b.getHTMLElement();
        }
      } else {
        b = this.container;
      }

      l.ok(b, "Builder can only be build() with a container provided.");

      l.ok(m.isHTMLElement(b), "The container must either be a HTMLElement or a Builder.");
      var d = b;
      if (this.currentElement.parentNode) {
        this.currentElement.parentNode.removeChild(this.currentElement);
      }
      var e = d.childNodes;
      j.isNumber(c) && c < e.length ? d.insertBefore(this.currentElement, e[c]) : d.appendChild(this.currentElement);

      return this;
    };

    a.prototype.append = function(c, d) {
      l.ok(c, "Need a child to append");

      m.isHTMLElement(c) && (c = b.withElement(c));

      l.ok(c instanceof a || c instanceof K, "Need a child to append");

      c.appendTo(this, d);

      return this;
    };

    a.prototype.offDOM = function() {
      this.currentElement.parentNode && this.currentElement.parentNode.removeChild(this.currentElement);

      return this;
    };

    a.prototype.getHTMLElement = function() {
      return this.currentElement;
    };

    a.prototype.getContainer = function() {
      return this.container;
    };

    a.prototype.div = function(a, b) {
      return this.doElement("div", a, b);
    };

    a.prototype.p = function(a, b) {
      return this.doElement("p", a, b);
    };

    a.prototype.ul = function(a, b) {
      return this.doElement("ul", a, b);
    };

    a.prototype.ol = function(a, b) {
      return this.doElement("ol", a, b);
    };

    a.prototype.li = function(a, b) {
      return this.doElement("li", a, b);
    };

    a.prototype.span = function(a, b) {
      return this.doElement("span", a, b);
    };

    a.prototype.img = function(a, b) {
      return this.doElement("img", a, b);
    };

    a.prototype.a = function(a, b) {
      return this.doElement("a", a, b);
    };

    a.prototype.header = function(a, b) {
      return this.doElement("header", a, b);
    };

    a.prototype.section = function(a, b) {
      return this.doElement("section", a, b);
    };

    a.prototype.footer = function(a, b) {
      return this.doElement("footer", a, b);
    };

    a.prototype.element = function(a, b, c) {
      return this.doElement(a, b, c);
    };

    a.prototype.doElement = function(b, c, d) {
      var e = this.browserService.document.createElement(b);
      this.currentElement = e;

      if (this.offdom) {
        this.createdElements.push(e);
      }

      if (j.isObject(c)) {
        this.attr(c);
      }

      if (j.isFunction(c)) {
        d = c;
      }
      if (j.isFunction(d)) {
        var f = new a(e);
        d.call(f, f);
      }
      this.offdom || this.container.appendChild(e);

      return this;
    };

    a.prototype.domFocus = function() {
      this.currentElement.focus();

      return this;
    };

    a.prototype.hasFocus = function() {
      var a = this.browserService.document.activeElement;
      return a === this.currentElement;
    };

    a.prototype.domSelect = function() {
      this.currentElement.select();

      return this;
    };

    a.prototype.domBlur = function() {
      this.currentElement.blur();

      return this;
    };

    a.prototype.domClick = function() {
      this.currentElement.click();

      return this;
    };

    a.prototype.on = function(a, b, c, d) {
      var e = this;
      if (j.isArray(a)) {
        a.forEach(function(a) {
          e.on(a, b, c, d);
        });
      } else {
        var f = a;

        var g = m.addListener(this.currentElement, f, function(a) {
          b(a, e, g);
        }, d || !1);
        if (d) {
          if (!this.captureToUnbind[f]) {
            this.captureToUnbind[f] = [];
          }
          this.captureToUnbind[f].push(g);
        } else {
          if (!this.toUnbind[f]) {
            this.toUnbind[f] = [];
          }
          this.toUnbind[f].push(g);
        }
        var h = this.getProperty(q, []);
        h.push(g);

        this.setProperty(q, h);

        if (c && j.isArray(c)) {
          c.push(g);
        }
      }
      return this;
    };

    a.prototype.off = function(a, b) {
      var c = this;
      if (j.isArray(a)) {
        a.forEach(function(a) {
          c.off(a);
        });
      } else {
        var d = a;
        if (b) {
          if (this.captureToUnbind[d])
            while (this.captureToUnbind[d].length) {
              this.captureToUnbind[d].pop()();
            }
        } else if (this.toUnbind[d])
          while (this.toUnbind[d].length) {
            this.toUnbind[d].pop()();
          }
      }
      return this;
    };

    a.prototype.once = function(a, b, c, d) {
      var e = this;
      if (j.isArray(a)) {
        a.forEach(function(a) {
          e.once(a, b);
        });
      } else var f = a;

      var g = m.addListener(this.currentElement, f, function(a) {
        b(a, e, g);

        g();
      }, d || !1);
      return this;
    };

    a.prototype.preventDefault = function(a, b, c, d) {
      var e = function(a) {
        a.preventDefault();

        if (b) {
          if (a.stopPropagation) {
            a.stopPropagation();
          } else {
            a.cancelBubble = !0;
          }
        }
      };
      return this.on(a, e, c);
    };

    a.prototype.attr = function(a, b) {
      if (j.isObject(a)) {
        for (var c in a)
          if (a.hasOwnProperty(c)) {
            var d = a[c];
            this.doSetAttr(c, d);
          }
        return this;
      }
      return j.isString(a) && !j.isString(b) ? this.currentElement.getAttribute(a) : (j.isString(a) && (j.isString(b) ||
        (b = String(b)), this.doSetAttr(a, b)), this);
    };

    a.prototype.doSetAttr = function(a, b) {
      if (a === "class") {
        a = "addClass";
      }

      if (this[a]) {
        if (j.isArray(b)) {
          this[a].apply(this, b);
        } else {
          this[a].call(this, b);
        }
      } else {
        this.currentElement.setAttribute(a, b);
      }
    };

    a.prototype.id = function(a) {
      this.currentElement.setAttribute("id", a);

      return this;
    };

    a.prototype.src = function(a) {
      this.currentElement.setAttribute("src", a);

      return this;
    };

    a.prototype.href = function(a) {
      this.currentElement.setAttribute("href", a);

      return this;
    };

    a.prototype.title = function(a) {
      this.currentElement.setAttribute("title", a);

      return this;
    };

    a.prototype.name = function(a) {
      this.currentElement.setAttribute("name", a);

      return this;
    };

    a.prototype.type = function(a) {
      this.currentElement.setAttribute("type", a);

      return this;
    };

    a.prototype.value = function(a) {
      this.currentElement.setAttribute("value", a);

      return this;
    };

    a.prototype.alt = function(a) {
      this.currentElement.setAttribute("alt", a);

      return this;
    };

    a.prototype.draggable = function(a) {
      this.currentElement.setAttribute("draggable", a ? "true" : "false");

      return this;
    };

    a.prototype.tabindex = function(a) {
      this.currentElement.setAttribute("tabindex", a.toString());

      return this;
    };

    a.prototype.style = function(a, b) {
      if (j.isObject(a)) {
        for (var c in a)
          if (a.hasOwnProperty(c)) {
            var d = a[c];
            this.doSetStyle(c, d);
          }
      } else {
        if (j.isString(a) && !j.isString(b)) {
          return this.currentElement.style[this.cssKeyToJavaScriptProperty(a)];
        }
        if (j.isString(a) && j.isString(b)) {
          this.doSetStyle(a, b);
        }
      }
      return this;
    };

    a.prototype.doSetStyle = function(a, b) {
      if (a.indexOf("-") >= 0) {
        var c = a.split("-");
        a = c[0];
        for (var d = 1; d < c.length; d++) {
          var e = c[d];
          a = a + e.charAt(0).toUpperCase() + e.substr(1);
        }
      }
      this.currentElement.style[this.cssKeyToJavaScriptProperty(a)] = b;
    };

    a.prototype.cssKeyToJavaScriptProperty = function(a) {
      if (a.indexOf("-") >= 0) {
        var b = a.split("-");
        a = b[0];
        for (var c = 1; c < b.length; c++) {
          var d = b[c];
          a = a + d.charAt(0).toUpperCase() + d.substr(1);
        }
      } else {
        if (a === "float") {
          a = "cssFloat";
        }
      }
      return a;
    };

    a.prototype.getComputedStyle = function() {
      return m.getComputedStyle(this.currentElement);
    };

    a.prototype.addClass = function() {
      var a = [];
      for (var b = 0; b < arguments.length - 0; b++) {
        a[b] = arguments[b + 0];
      }
      var c = this;
      a.forEach(function(a) {
        var b = a.split(" ");
        b.forEach(function(a) {
          m.addClass(c.currentElement, a);
        });
      });

      return this;
    };

    a.prototype.setClass = function(a, b) {
      typeof b == "undefined" && (b = null);

      b === null ? this.currentElement.className = a : b ? this.addClass(a) : this.removeClass(a);

      return this;
    };

    a.prototype.hasClass = function(a) {
      return m.hasClass(this.currentElement, a);
    };

    a.prototype.removeClass = function() {
      var a = [];
      for (var b = 0; b < arguments.length - 0; b++) {
        a[b] = arguments[b + 0];
      }
      var c = this;
      a.forEach(function(a) {
        var b = a.split(" ");
        b.forEach(function(a) {
          m.removeClass(c.currentElement, a);
        });
      });

      return this;
    };

    a.prototype.swapClass = function(a, b) {
      this.hasClass(a) ? (this.removeClass(a), this.addClass(b)) : (this.removeClass(b), this.addClass(a));

      return this;
    };

    a.prototype.toggleClass = function(a) {
      this.hasClass(a) ? this.removeClass(a) : this.addClass(a);

      return this;
    };

    a.prototype.color = function(a) {
      this.currentElement.style.color = a;

      return this;
    };

    a.prototype.background = function(a) {
      this.currentElement.style.backgroundColor = a;

      return this;
    };

    a.prototype.padding = function(a, b, c, d) {
      return j.isString(a) && a.indexOf(" ") >= 0 ? this.padding.apply(this, a.split(" ")) : (a !== null && (this.currentElement
        .style.paddingTop = this.toPixel(a)), b !== null && (this.currentElement.style.paddingRight = this.toPixel(
        b)), c !== null && (this.currentElement.style.paddingBottom = this.toPixel(c)), d !== null && (this.currentElement
        .style.paddingLeft = this.toPixel(d)), this);
    };

    a.prototype.margin = function(a, b, c, d) {
      return j.isString(a) && a.indexOf(" ") >= 0 ? this.margin.apply(this, a.split(" ")) : (a !== null && (this.currentElement
          .style.marginTop = this.toPixel(a)), b !== null && (this.currentElement.style.marginRight = this.toPixel(b)),
        c !== null && (this.currentElement.style.marginBottom = this.toPixel(c)), d !== null && (this.currentElement.style
          .marginLeft = this.toPixel(d)), this);
    };

    a.prototype.position = function(a, b, c, d, e) {
      return j.isString(a) && a.indexOf(" ") >= 0 ? this.position.apply(this, a.split(" ")) : (a !== null && (this.currentElement
          .style.top = this.toPixel(a)), b !== null && (this.currentElement.style.right = this.toPixel(b)), c !==
        null && (this.currentElement.style.bottom = this.toPixel(c)), d !== null && (this.currentElement.style.left =
          this.toPixel(d)), e || (e = "absolute"), this.currentElement.style.position = e, this);
    };

    a.prototype.size = function(a, b) {
      return j.isString(a) && a.indexOf(" ") >= 0 ? this.size.apply(this, a.split(" ")) : (a !== null && (this.currentElement
        .style.width = this.toPixel(a)), b !== null && (this.currentElement.style.height = this.toPixel(b)), this);
    };

    a.prototype.minSize = function(a, b) {
      return j.isString(a) && a.indexOf(" ") >= 0 ? this.minSize.apply(this, a.split(" ")) : (a !== null && (this.currentElement
          .style.minWidth = this.toPixel(a)), b !== null && (this.currentElement.style.minHeight = this.toPixel(b)),
        this);
    };

    a.prototype.maxSize = function(a, b) {
      return j.isString(a) && a.indexOf(" ") >= 0 ? this.maxSize.apply(this, a.split(" ")) : (a !== null && (this.currentElement
          .style.maxWidth = this.toPixel(a)), b !== null && (this.currentElement.style.maxHeight = this.toPixel(b)),
        this);
    };

    a.prototype.float = function(a) {
      this.currentElement.style.cssFloat = a;

      this.currentElement.style.styleFloat = a;

      return this;
    };

    a.prototype.clear = function(a) {
      this.currentElement.style.clear = a;

      return this;
    };

    a.prototype.normal = function() {
      this.currentElement.style.fontStyle = "normal";

      this.currentElement.style.fontWeight = "normal";

      this.currentElement.style.textDecoration = "none";

      return this;
    };

    a.prototype.italic = function() {
      this.currentElement.style.fontStyle = "italic";

      return this;
    };

    a.prototype.bold = function() {
      this.currentElement.style.fontWeight = "bold";

      return this;
    };

    a.prototype.underline = function() {
      this.currentElement.style.textDecoration = "underline";

      return this;
    };

    a.prototype.overflow = function(a) {
      this.currentElement.style.overflow = a;

      return this;
    };

    a.prototype.display = function(a) {
      this.currentElement.style.display = a;

      return this;
    };

    a.prototype.show = function() {
      this.hasClass("hidden") && this.removeClass("hidden");

      this.attr("aria-hidden", "false");

      this.cancelVisibilityPromise();

      return this;
    };

    a.prototype.showDelayed = function(a) {
      var b = this;
      this.cancelVisibilityPromise();
      var c = i.Promise.timeout(a);
      this.setProperty(r, c);

      c.done(function() {
        b.removeProperty(r);

        b.show();
      });

      return this;
    };

    a.prototype.hide = function() {
      this.hasClass("hidden") || this.addClass("hidden");

      this.attr("aria-hidden", "true");

      this.cancelVisibilityPromise();

      return this;
    };

    a.prototype.isHidden = function() {
      return this.hasClass("hidden") || this.currentElement.style.display === "none";
    };

    a.prototype.toggleVisibility = function() {
      this.cancelVisibilityPromise();

      this.swapClass("builder-visible", "hidden");

      this.isHidden() ? this.attr("aria-hidden", "true") : this.attr("aria-hidden", "false");

      return this;
    };

    a.prototype.cancelVisibilityPromise = function() {
      var a = this.getProperty(r);
      if (a) {
        a.cancel();
        this.removeProperty(r);
      }
    };

    a.prototype.border = function(a, b, c) {
      return j.isString(a) && a.indexOf(" ") >= 0 ? this.border.apply(this, a.split(" ")) : (this.currentElement.style
        .borderWidth = this.toPixel(a), c && (this.currentElement.style.borderColor = c), b && (this.currentElement.style
          .borderStyle = b), this);
    };

    a.prototype.borderTop = function(a, b, c) {
      return j.isString(a) && a.indexOf(" ") >= 0 ? this.borderTop.apply(this, a.split(" ")) : (this.currentElement.style
        .borderTopWidth = this.toPixel(a), c && (this.currentElement.style.borderTopColor = c), b && (this.currentElement
          .style.borderTopStyle = b), this);
    };

    a.prototype.borderBottom = function(a, b, c) {
      return j.isString(a) && a.indexOf(" ") >= 0 ? this.borderBottom.apply(this, a.split(" ")) : (this.currentElement
        .style.borderBottomWidth = this.toPixel(a), c && (this.currentElement.style.borderBottomColor = c), b && (
          this.currentElement.style.borderBottomStyle = b), this);
    };

    a.prototype.borderLeft = function(a, b, c) {
      return j.isString(a) && a.indexOf(" ") >= 0 ? this.borderLeft.apply(this, a.split(" ")) : (this.currentElement.style
        .borderLeftWidth = this.toPixel(a), c && (this.currentElement.style.borderLeftColor = c), b && (this.currentElement
          .style.borderLeftStyle = b), this);
    };

    a.prototype.borderRight = function(a, b, c) {
      return j.isString(a) && a.indexOf(" ") >= 0 ? this.borderRight.apply(this, a.split(" ")) : (this.currentElement
        .style.borderRightWidth = this.toPixel(a), c && (this.currentElement.style.borderRightColor = c), b && (this.currentElement
          .style.borderRightStyle = b), this);
    };

    a.prototype.textAlign = function(a) {
      this.currentElement.style.textAlign = a;

      return this;
    };

    a.prototype.verticalAlign = function(a) {
      this.currentElement.style.verticalAlign = a;

      return this;
    };

    a.prototype.toPixel = function(a) {
      return a.toString().indexOf("px") === -1 ? a.toString() + "px" : a;
    };

    a.prototype.innerHtml = function(a, b) {
      b ? this.currentElement.innerHTML += a : this.currentElement.innerHTML = a;

      return this;
    };

    a.prototype.text = function(a, b) {
      b ? this.currentElement.children.length === 0 ? this.currentElement.textContent += a : this.currentElement.appendChild(
        this.browserService.document.createTextNode(a)) : this.currentElement.textContent = a;

      return this;
    };

    a.prototype.safeInnerHtml = function(a, b) {
      return this.innerHtml(k.escape(a), b);
    };

    a.prototype.insertHtmlBeforeBegin = function(a) {
      this.currentElement.insertAdjacentHTML("beforeBegin", a);

      return this;
    };

    a.prototype.insertHtmlAfterBegin = function(a) {
      this.currentElement.insertAdjacentHTML("afterBegin", a);

      return this;
    };

    a.prototype.insertHtmlBeforeEnd = function(a) {
      this.currentElement.insertAdjacentHTML("beforeEnd", a);

      return this;
    };

    a.prototype.insertHtmlAfterEnd = function(a) {
      this.currentElement.insertAdjacentHTML("afterEnd", a);

      return this;
    };

    a.prototype.bind = function(a) {
      b.bindElement(this.currentElement, a);

      return this;
    };

    a.prototype.unbind = function() {
      b.unbindElement(this.currentElement);

      return this;
    };

    a.prototype.getBinding = function() {
      return b.getBindingFromElement(this.currentElement);
    };

    a.prototype.setProperty = function(a, c) {
      b.setPropertyOnElement(this.currentElement, a, c);

      return this;
    };

    a.prototype.getProperty = function(a, c) {
      return b.getPropertyFromElement(this.currentElement, a, c);
    };

    a.prototype.removeProperty = function(a) {
      delete C(this.currentElement)[a];

      return this;
    };

    a.prototype.parent = function(a) {
      l.ok(!this.offdom, "Builder was created with offdom = true and thus has no parent set");

      return b.withElement(this.currentElement.parentNode, a);
    };

    a.prototype.children = function(a) {
      var c = this.currentElement.children;

      var d = [];
      for (var e = 0; e < c.length; e++) {
        d.push(b.withElement(c.item(e), a));
      }
      return new K(d);
    };

    a.prototype.removeChild = function(a) {
      this.currentElement === a.parent().getHTMLElement() && this.currentElement.removeChild(a.getHTMLElement());

      return this;
    };

    a.prototype.select = function(a, c) {
      l.ok(j.isString(a), "Expected String as parameter");
      var d = this.currentElement.querySelectorAll(a);

      var e = [];
      for (var f = 0; f < d.length; f++) {
        e.push(b.withElement(d.item(f), c));
      }
      return new K(e);
    };

    a.prototype.matches = function(a) {
      var b = this.currentElement;

      var c = b.webkitMatchesSelector || b.mozMatchesSelector || b.msMatchesSelector || b.oMatchesSelector;
      return c && c.call(b, a);
    };

    a.prototype.isEmpty = function() {
      return !this.currentElement.childNodes || this.currentElement.childNodes.length === 0;
    };

    a.prototype.unbindDescendants = function(a) {
      for (var b = 0, c = a.children.length; b < c; b++) {
        var d = a.children.item(b);
        if (C(d)) {
          var e = C(d)[q];
          if (j.isArray(e))
            while (e.length) {
              e.pop()();
            }
          delete d[o];
        }
        this.unbindDescendants(d);
      }
    };

    a.prototype.empty = function() {
      this.unbindDescendants(this.currentElement);

      m.clearNode(this.currentElement);

      this.offdom && (this.createdElements = []);

      return this;
    };

    a.prototype.destroy = function() {
      if (this.currentElement.parentNode) {
        this.currentElement.parentNode.removeChild(this.currentElement);
      }

      this.empty();
      if (C(this.currentElement)) {
        var a = C(this.currentElement)[q];
        if (j.isArray(a))
          while (a.length) {
            a.pop()();
          }
        delete this.currentElement[o];
      }
      var b;
      for (b in this.toUnbind)
        if (this.toUnbind.hasOwnProperty(b) && j.isArray(this.toUnbind[b]))
          while (this.toUnbind[b].length) {
            this.toUnbind[b].pop()();
          }
      for (b in this.captureToUnbind)
        if (this.captureToUnbind.hasOwnProperty(b) && j.isArray(this.captureToUnbind[b]))
          while (this.captureToUnbind[b].length) {
            this.captureToUnbind[b].pop()();
          }
      this.currentElement = null;

      this.container = null;

      this.offdom = null;

      this.createdElements = null;

      this.captureToUnbind = null;

      this.toUnbind = null;
    };

    a.prototype.getPositionRelativeTo = function(b) {
      if (b instanceof a) {
        b = b.getHTMLElement();
      }
      var c = m.getRelativeLeft(this.currentElement, b);

      var d = m.getRelativeTop(this.currentElement, b);
      return new t(d, -1, -1, c);
    };

    a.prototype.getPosition = function() {
      var a = m.getTopLeftOffset(this.currentElement);
      return new t(a.top, -1, -1, a.left);
    };

    a.prototype.getTotalSize = function() {
      var a = m.getTotalWidth(this.currentElement);

      var b = m.getTotalHeight(this.currentElement);
      return new u(a, b);
    };

    a.prototype.getContentSize = function() {
      var a = m.getContentWidth(this.currentElement);

      var b = m.getContentHeight(this.currentElement);
      return new u(a, b);
    };

    a.prototype.getClientArea = function() {
      if (this.currentElement !== this.browserService.document.body) {
        var a = m.getDomNodePosition(this.currentElement);
        return new u(a.width, a.height);
      }
      if (this.browserService.window.innerWidth && this.browserService.window.innerHeight) {
        return new u(this.browserService.window.innerWidth, this.browserService.window.innerHeight);
      }
      if (this.browserService.document.body && this.browserService.document.body.clientWidth && this.browserService.document
        .body.clientWidth) {
        return new u(this.browserService.document.body.clientWidth, this.browserService.document.body.clientHeight);
      }
      if (this.browserService.document.documentElement && this.browserService.document.documentElement.clientWidth &&
        this.browserService.document.documentElement.clientHeight) {
        return new u(this.browserService.document.documentElement.clientWidth, this.browserService.document.documentElement
          .clientHeight);
      }
      throw new Error("Unable to figure out browser width and height");
    };

    return a;
  }();
  b.Builder = J;
  var K = function(a) {
    function c(d) {
      l.ok(j.isArray(d) || d instanceof c, "Expected Array or MultiBuilder as parameter");

      a.call(this);

      this.length = 0;

      this.builders = [];
      if (j.isArray(d))
        for (var e = 0; e < d.length; e++) {
          if (d[e] instanceof HTMLElement) {
            this.push(b.withElement(d[e]));
          } else {
            this.push(d[e]);
          }
        } else
          for (var e = 0; e < d.length; e++) {
            this.push(d.item(e));
          }
      var f = this;

      var g = function(a) {
        f[a] = function() {
          var b = Array.prototype.slice.call(arguments);

          var d;

          var e = !1;
          for (var g = 0; g < f.length; g++) {
            var h = f.item(g)[a].apply(f.item(g), b);
            if (h instanceof c) {
              if (!d) {
                d = [];
              }

              e = !0;
              for (var i = 0; i < h.length; i++) {
                d.push(h.item(i));
              }
            } else {
              if (!j.isUndefined(h) && !(h instanceof J)) {
                if (!d) {
                  d = [];
                }
                d.push(h);
              }
            }
          }
          return d && e ? new c(d) : d || f;
        };
      };
      for (var h in J.prototype) {
        if (h !== "clone" && h !== "and" && J.prototype.hasOwnProperty(h) && j.isFunction(J.prototype[h])) {
          g(h);
        }
      }
    }
    __extends(c, a);

    c.prototype.item = function(a) {
      return this.builders[a];
    };

    c.prototype.push = function() {
      var a = [];
      for (var b = 0; b < arguments.length - 0; b++) {
        a[b] = arguments[b + 0];
      }
      for (var c = 0; c < a.length; c++) {
        this.builders.push(a[c]);
      }
      this.length = this.builders.length;
    };

    c.prototype.pop = function() {
      var a = this.builders.pop();
      this.length = this.builders.length;

      return a;
    };

    c.prototype.concat = function(a) {
      var b = this.builders.concat(a);
      this.length = this.builders.length;

      return b;
    };

    c.prototype.shift = function() {
      var a = this.builders.shift();
      this.length = this.builders.length;

      return a;
    };

    c.prototype.unshift = function(a) {
      var b = this.builders.unshift(a);
      this.length = this.builders.length;

      return b;
    };

    c.prototype.slice = function(a, b) {
      var c = this.builders.slice(a, b);
      this.length = this.builders.length;

      return c;
    };

    c.prototype.splice = function(a, b) {
      var c = this.builders.splice(a, b);
      this.length = this.builders.length;

      return c;
    };

    c.prototype.clone = function() {
      return new c(this);
    };

    c.prototype.and = function(a) {
      if (!(a instanceof J) && !(a instanceof c)) {
        a = new J(a);
      }
      var b = [];
      if (a instanceof c)
        for (var d = 0; d < a.length; d++) {
          b.push(a.item(d));
        } else {
          b.push(a);
        }
      this.push.apply(this, b);

      return this;
    };

    return c;
  }(J);
  b.MultiBuilder = K;
  var L = /([\w\-]+)?(#([\w\-]+))?((.([\w\-]+))*)/;
  b.$ = function(a) {
    if (j.isUndefined(a)) {
      return b.offDOM();
    }
    if (!a) throw new Error("Bad use of $");
    if (m.isHTMLElement(a) || a === window) {
      return b.withElement(a);
    }
    if (a instanceof J) {
      return b.withBuilder(a);
    }
    if (j.isString(a)) {
      if (a[0] === "<") {
        var c;

        var d = n.getService().document.createElement("div");
        d.innerHTML = k.format.apply(k, arguments);
        if (d.children.length === 0) throw new Error("Bad use of $");
        if (d.children.length === 1) {
          c = d.firstChild;
          d.removeChild(c);
          return b.withElement(c);
        }
        var e = [];
        while (d.firstChild) {
          c = d.firstChild;
          d.removeChild(c);
          e.push(b.withElement(c));
        }
        return new K(e);
      }
      if (arguments.length === 1) {
        var f = L.exec(a);
        if (!f) throw new Error("Bad use of $");
        var g = f[1] || "div";

        var h = f[3] || undefined;

        var i = (f[4] || "").replace(/\./g, " ");

        var l = {};
        h && (l.id = h);

        i && (l["class"] = i);

        return b.offDOM().element(g, l);
      }
      var o = b.offDOM();
      o.element.apply(o, arguments);

      return o;
    }
    throw new Error("Bad use of $");
  };

  b.$.Box = t;

  b.$.Dimension = u;

  b.$.Position = s;

  b.$.Builder = J;

  b.$.MultiBuilder = K;

  b.$.Select = b.Select;

  b.$.Build = b.Build;

  b.$.Binding = b.Binding;
});