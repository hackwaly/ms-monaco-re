define("vs/base/dom/mockDom", ["require", "exports"], function(e, t) {
  var n = function() {
    function e() {
      this.eventMap = {};
    }
    e.prototype.removeEventListener = function(e, t) {
      if (e in this.eventMap) {
        var n = this.eventMap[e];
        n.splice(n.indexOf(t), 1);
      }
    };

    e.prototype.addEventListener = function(e, t) {
      e in this.eventMap ? this.eventMap[e].push(t) : this.eventMap[e] = [t];
    };

    e.prototype.dispatchEvent = function(e) {
      this.eventMap[e.type].forEach(function(t) {
        t(e);
      });

      return e.defaultPrevented;
    };

    return e;
  }();
  t.MockEventTarget = n;
  var i = function(e) {
    function t(t) {
      e.call(this);

      this.ENTITY_REFERENCE_NODE = Node.ENTITY_REFERENCE_NODE;

      this.ATTRIBUTE_NODE = Node.ATTRIBUTE_NODE;

      this.DOCUMENT_FRAGMENT_NODE = Node.DOCUMENT_FRAGMENT_NODE;

      this.TEXT_NODE = Node.TEXT_NODE;

      this.ELEMENT_NODE = Node.ELEMENT_NODE;

      this.COMMENT_NODE = Node.COMMENT_NODE;

      this.DOCUMENT_POSITION_DISCONNECTED = Node.DOCUMENT_POSITION_DISCONNECTED;

      this.DOCUMENT_POSITION_CONTAINED_BY = Node.DOCUMENT_POSITION_CONTAINED_BY;

      this.DOCUMENT_POSITION_CONTAINS = Node.DOCUMENT_POSITION_CONTAINS;

      this.DOCUMENT_TYPE_NODE = Node.DOCUMENT_TYPE_NODE;

      this.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC = Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC;

      this.DOCUMENT_NODE = Node.DOCUMENT_NODE;

      this.ENTITY_NODE = Node.ENTITY_NODE;

      this.PROCESSING_INSTRUCTION_NODE = Node.PROCESSING_INSTRUCTION_NODE;

      this.CDATA_SECTION_NODE = Node.CDATA_SECTION_NODE;

      this.NOTATION_NODE = Node.NOTATION_NODE;

      this.DOCUMENT_POSITION_FOLLOWING = Node.DOCUMENT_POSITION_FOLLOWING;

      this.DOCUMENT_POSITION_PRECEDING = Node.DOCUMENT_POSITION_PRECEDING;

      this.nodeName = t;

      this._childNodes = [];

      this._attributes = [];
    }
    __extends(t, e);

    Object.defineProperty(t.prototype, "attributes", {
      get: function() {
        return this._attributes;
      },
      enumerable: !0,
      configurable: !0
    });

    Object.defineProperty(t.prototype, "lastChild", {
      get: function() {
        return this._childNodes[this._childNodes.length - 1];
      },
      enumerable: !0,
      configurable: !0
    });

    Object.defineProperty(t.prototype, "firstChild", {
      get: function() {
        return this._childNodes[0];
      },
      enumerable: !0,
      configurable: !0
    });

    Object.defineProperty(t.prototype, "childNodes", {
      get: function() {
        var e = this._childNodes;
        e.item || (e.item = function(e) {
          return this[e];
        }.bind(e));

        return e;
      },
      enumerable: !0,
      configurable: !0
    });

    Object.defineProperty(t.prototype, "textContent", {
      get: function() {
        var e = this;
        return this._childNodes.filter(function(t) {
          return t.nodeType === e.TEXT_NODE;
        }).map(function(e) {
          return e.wholeText;
        }).join("");
      },
      set: function(e) {
        this._childNodes = [];

        this.appendChild(this.ownerDocument.createTextNode(e));
      },
      enumerable: !0,
      configurable: !0
    });

    t.prototype.removeChild = function(e) {
      var t = this._childNodes.indexOf(e);
      if (t >= 0) {
        var n = this._childNodes.splice(t, 1);
        return n[0];
      }
      return null;
    };

    t.prototype.appendChild = function(e) {
      this._childNodes.push(e);

      return e;
    };

    t.prototype.isSupported = function() {
      throw new Error("Not implemented!");
    };

    t.prototype.isEqualNode = function() {
      throw new Error("Not implemented!");
    };

    t.prototype.lookupPrefix = function() {
      throw new Error("Not implemented!");
    };

    t.prototype.isDefaultNamespace = function() {
      throw new Error("Not implemented!");
    };

    t.prototype.compareDocumentPosition = function() {
      throw new Error("Not implemented!");
    };

    t.prototype.normalize = function() {
      throw new Error("Not implemented!");
    };

    t.prototype.isSameNode = function(e) {
      return this === e;
    };

    t.prototype.hasAttributes = function() {
      return this.attributes.length > 0;
    };

    t.prototype.lookupNamespaceURI = function() {
      throw new Error("Not implemented!");
    };

    t.prototype.cloneNode = function() {
      throw new Error("Not implemented!");
    };

    t.prototype.hasChildNodes = function() {
      return this.childNodes.length > 0;
    };

    t.prototype.replaceChild = function() {
      throw new Error("Not implemented!");
    };

    t.prototype.insertBefore = function() {
      throw new Error("Not implemented!");
    };

    return t;
  }(n);
  t.MockNode = i;
  var o = function(e) {
    function t(t) {
      e.call(this, t);

      this.name = t;

      this.expando = !1;
    }
    __extends(t, e);

    Object.defineProperty(t.prototype, "specified", {
      get: function() {
        return !!this.value;
      },
      enumerable: !0,
      configurable: !0
    });

    return t;
  }(i);
  t.MockAttribute = o;
  var r = function(e) {
    function t(t) {
      e.call(this, t);

      this.tagName = t;
    }
    __extends(t, e);

    t.prototype.getAttribute = function(e) {
      var t = this._attributes.filter(function(t) {
        return t.name === e;
      });
      return t.length ? t[0].value : "";
    };

    t.prototype.getElementsByTagNameNS = function() {
      throw new Error("Not implemented!");
    };

    t.prototype.hasAttributeNS = function() {
      throw new Error("Not implemented!");
    };

    t.prototype.getBoundingClientRect = function() {
      throw new Error("Not implemented!");
    };

    t.prototype.getAttributeNS = function() {
      throw new Error("Not implemented!");
    };

    t.prototype.getAttributeNodeNS = function() {
      throw new Error("Not implemented!");
    };

    t.prototype.setAttributeNodeNS = function() {
      throw new Error("Not implemented!");
    };

    t.prototype.hasAttribute = function(e) {
      var t = this._attributes.filter(function(t) {
        return t.name === e;
      });
      return t.length > 0;
    };

    t.prototype.removeAttribute = function(e) {
      this._attributes = this._attributes.filter(function(t) {
        return t.name !== e;
      });
    };

    t.prototype.setAttributeNS = function() {
      throw new Error("Not implemented!");
    };

    t.prototype.getAttributeNode = function() {
      throw new Error("Not implemented!");
    };

    t.prototype.getElementsByTagName = function() {
      throw new Error("Not implemented!");
    };

    t.prototype.setAttributeNode = function() {
      throw new Error("Not implemented!");
    };

    t.prototype.getClientRects = function() {
      throw new Error("Not implemented!");
    };

    t.prototype.removeAttributeNode = function() {
      throw new Error("Not implemented!");
    };

    t.prototype.setAttribute = function(e, t) {
      if (this.hasAttribute(e)) {
        this.removeAttribute(e);
      }
      var n = this.ownerDocument.createAttribute(e);
      n.ownerElement = this;

      n.value = t;

      this._attributes.push(n);
    };

    t.prototype.removeAttributeNS = function() {
      throw new Error("Not implemented!");
    };

    t.prototype.querySelectorAll = function() {
      throw new Error("Not implemented!");
    };

    t.prototype.querySelector = function() {
      throw new Error("Not implemented!");
    };

    Object.defineProperty(t.prototype, "childElementCount", {
      get: function() {
        var e = this;
        return this._childNodes.filter(function(t) {
          return t.nodeType === e.ELEMENT_NODE;
        }).length;
      },
      enumerable: !0,
      configurable: !0
    });

    Object.defineProperty(t.prototype, "lastElementChild", {
      get: function() {
        var e = this;

        var t = this._childNodes.filter(function(t) {
          return t.nodeType === e.ELEMENT_NODE;
        });
        return t[t.length - 1];
      },
      enumerable: !0,
      configurable: !0
    });

    Object.defineProperty(t.prototype, "firstElementChild", {
      get: function() {
        var e = this;

        var t = this._childNodes.filter(function(t) {
          return t.nodeType === e.ELEMENT_NODE;
        });
        return t[0];
      },
      enumerable: !0,
      configurable: !0
    });

    t.prototype.msMatchesSelector = function() {
      throw new Error("Not implemented!");
    };

    t.prototype.fireEvent = function() {
      throw new Error("Not implemented!");
    };

    t.prototype.msZoomTo = function() {};

    t.prototype.msRequestFullscreen = function() {};

    t.prototype.msGetUntransformedBounds = function() {
      throw new Error("Not implemented!");
    };

    t.prototype.msGetRegionContent = function() {
      throw new Error("Not implemented!");
    };

    t.prototype.msReleasePointerCapture = function() {
      throw new Error("Not implemented!");
    };

    t.prototype.msSetPointerCapture = function() {
      throw new Error("Not implemented!");
    };

    return t;
  }(i);
  t.MockElement = r;
  var s = function(e) {
    function t(t) {
      e.call(this, t);

      this.nodeType = this.TEXT_NODE;

      this.length = t.length;

      this.data = t;
    }
    __extends(t, e);

    t.prototype.deleteData = function() {
      throw new Error("Not implemented!");
    };

    t.prototype.replaceData = function() {
      throw new Error("Not implemented!");
    };

    t.prototype.appendData = function() {
      throw new Error("Not implemented!");
    };

    t.prototype.insertData = function() {
      throw new Error("Not implemented!");
    };

    t.prototype.substringData = function() {
      throw new Error("Not implemented!");
    };

    return t;
  }(i);
  t.MockCharacterData = s;
  var a = function(e) {
    function t(t) {
      e.call(this, t);

      this.wholeText = t;
    }
    __extends(t, e);

    t.prototype.splitText = function() {
      throw new Error("Not implemented!");
    };

    t.prototype.replaceWholeText = function() {
      throw new Error("Not implemented!");
    };

    t.prototype.swapNode = function() {
      throw new Error("Not implemented!");
    };

    t.prototype.removeNode = function() {
      throw new Error("Not implemented!");
    };

    t.prototype.replaceNode = function() {
      throw new Error("Not implemented!");
    };

    return t;
  }(s);
  t.MockText = a;
  var u = function(e) {
    function t(t) {
      e.call(this, t);

      this.style = {};

      this.nodeType = this.ELEMENT_NODE;
    }
    __extends(t, e);

    Object.defineProperty(t.prototype, "className", {
      get: function() {
        return this.getAttribute("class");
      },
      set: function(e) {
        this.setAttribute("class", e);
      },
      enumerable: !0,
      configurable: !0
    });

    Object.defineProperty(t.prototype, "id", {
      get: function() {
        return this.getAttribute("id");
      },
      set: function(e) {
        this.setAttribute("id", e);
      },
      enumerable: !0,
      configurable: !0
    });

    Object.defineProperty(t.prototype, "children", {
      get: function() {
        var e = this;

        var t = this._childNodes.filter(function(t) {
          return t.nodeType === e.ELEMENT_NODE;
        });
        t.item || (t.item = function(e) {
          return this[e];
        }.bind(t));

        return t;
      },
      enumerable: !0,
      configurable: !0
    });

    Object.defineProperty(t.prototype, "outerHTML", {
      get: function() {
        var e = new y(this);
        return e.toString(!0);
      },
      enumerable: !0,
      configurable: !0
    });

    Object.defineProperty(t.prototype, "innerHTML", {
      get: function() {
        var e = new y(this);
        return e.toString();
      },
      set: function(e) {
        var t = this;

        var n = new v(this.ownerDocument);

        var i = n.parse(e);
        i.forEach(function(e) {
          t.appendChild(e);
        });
      },
      enumerable: !0,
      configurable: !0
    });

    return t;
  }(r);
  t.MockHTMLElement = u;
  var l = function() {
    function e() {}
    e.prototype.createElement = function(e) {
      var t = new u(e);
      t.ownerDocument = this;

      return t;
    };

    e.prototype.createTextNode = function(e) {
      var t = new a(e);
      t.ownerDocument = this;

      return t;
    };

    e.prototype.createAttribute = function(e) {
      var t = new o(e);
      t.ownerDocument = this;

      return t;
    };

    return e;
  }();
  t.MockDocument = l;
  var c = function() {
    function e() {}
    return e;
  }();
  t.MockWindow = c;
  var d = function() {
    function e(e) {
      this.name = "error";

      this.message = e;
    }
    e.prototype.consumeCharacter = function() {
      return this;
    };

    e.prototype.onTransition = function() {};

    return e;
  }();

  var h = function() {
    function e() {
      this.name = "text";

      this.textContent = "";
    }
    e.prototype.consumeCharacter = function(e) {
      var t = e.next();
      switch (t) {
        case "<":
          return new p;
        case ">":
          return new d("Unexpected >");
        default:
          this.textContent += t;

          return this;
      }
    };

    e.prototype.onTransition = function(e) {
      if (this.textContent) {
        var t = e.document.createTextNode(this.textContent);
        e.currentNode ? e.currentNode.appendChild(t) : e.root.push(t);
      }
    };

    return e;
  }();

  var p = function() {
    function e() {
      this.name = "tag";

      this.tagName = "";

      this.isClosing = !1;

      this.attributes = {};
    }
    e.prototype.consumeCharacter = function(e) {
      var t = e.next();
      switch (t) {
        case "/":
          this.isClosing = !0;

          return this;
        case ">":
          return this.tagName ? new h : new d("No tag name specified");
        case " ":
          return this.tagName ? this.isClosing ? new d("Closing tags cannot have attributes") : new f(this) : new d(
            "Tag name must be first.");
        default:
          this.tagName += t;

          return this;
      }
    };

    e.prototype.onTransition = function(e, t) {
      var n = this;
      if (this.tagName && "attribute" !== t)
        if (this.isClosing) {
          if (e.openElements[e.openElements.length - 1].tagName !== this.tagName) throw new Error(
            "Mismatched closing tag:" + this.tagName);
          e.openElements.pop();

          e.currentNode = e.openElements.length ? e.openElements[e.openElements.length - 1] : null;
        } else {
          var i = e.document.createElement(this.tagName);
          Object.keys(this.attributes).forEach(function(e) {
            i.setAttribute(e, n.attributes[e]);
          });

          e.currentNode ? e.currentNode.appendChild(i) : e.root.push(i);

          e.openElements.push(i);

          e.currentNode = i;
        }
    };

    return e;
  }();

  var f = function() {
    function e(e) {
      this.name = "attribute";

      this.tag = e;

      this.inValue = !1;

      this.attributeName = "";
    }
    e.prototype.consumeCharacter = function(e) {
      var t = e.next();
      switch (t) {
        case " ":
          return this.inValue ? this.tag : this;
        case "=":
          this.inValue = !0;

          return new g(this);
        case ">":
          e.back();

          return this.tag;
        default:
          this.inValue === !1 && (this.attributeName += t);

          return this;
      }
    };

    e.prototype.onTransition = function(e, t) {
      if ("attributeValue" !== t) {
        this.tag.attributes[this.attributeName] = this.attributeValue;
      }
    };

    return e;
  }();

  var g = function() {
    function e(e) {
      this.name = "attributeValue";

      this.attribute = e;

      this.value = "";

      this.quote = !1;
    }
    e.prototype.consumeCharacter = function(e) {
      var t = e.next();
      switch (t) {
        case '"':
          return this.quote === !1 ? (this.quote = !0, this) : this.attribute;
        default:
          return this.quote === !1 ? new d('Expected " character') : (this.value += t, this);
      }
    };

    e.prototype.onTransition = function() {
      this.attribute.attributeValue = this.value;
    };

    return e;
  }();

  var m = function() {
    function e(e) {
      this.index = 0;

      this.text = e;
    }
    e.prototype.more = function() {
      return this.index < this.text.length;
    };

    e.prototype.next = function() {
      if (this.index >= this.text.length) throw new Error("Past end of string!");
      return this.text[this.index++];
    };

    e.prototype.back = function() {
      this.index--;
    };

    return e;
  }();

  var v = function() {
    function e(e) {
      this.document = e;

      this.root = [];

      this.openElements = [];

      this.currentNode = null;

      this.activeState = new h;
    }
    e.prototype.parse = function(e) {
      for (var t = new m(e); t.more();) {
        var n = this.activeState.consumeCharacter(t);
        if (n !== this.activeState) {
          this.activeState.onTransition(this, n.name);
          this.activeState = n;
        }
      }
      if ("error" === this.activeState.name) throw new Error(this.activeState.message);
      if (0 !== this.openElements.length) throw new Error("Elements not closed: " + this.openElements.map(function(e) {
        return e.tagName;
      }).join());
      return this.root;
    };

    return e;
  }();

  var y = function() {
    function e(e) {
      this.root = e;
    }
    e.prototype.print = function(e) {
      var t = "";
      switch (e.nodeType) {
        case e.ELEMENT_NODE:
          t += this.printElement(e);
          break;
        case e.TEXT_NODE:
          t += this.printText(e);
      }
      return t;
    };

    e.prototype.printChildren = function(e) {
      var t = "";
      if (e.hasChildNodes())
        for (var n = 0; n < e.childNodes.length; n++) {
          t += this.print(e.childNodes.item(n));
        }
      return t;
    };

    e.prototype.printElement = function(e) {
      var t = ["<"];
      if (t.push(e.tagName), e.hasAttributes()) {
        var n = e.attributes;
        t.push(n.reduce(function(e, t) {
          var n = [e, t.name];
          t.value && n.push('="', t.value, '"');

          return n.join("");
        }, " "));
      }
      t.push(">");

      t.push(this.printChildren(e));

      t.push("</");

      t.push(e.tagName);

      t.push(">");

      return t.join("");
    };

    e.prototype.printText = function(e) {
      return e.wholeText;
    };

    e.prototype.toString = function(e) {
      return e ? this.print(this.root) : this.printChildren(this.root);
    };

    return e;
  }();
});