var __extends = this.__extends || function(a, b) {
    function d() {
      this.constructor = a
    }
    for (var c in b) b.hasOwnProperty(c) && (a[c] = b[c]);
    d.prototype = b.prototype, a.prototype = new d
  };
define(["require", "exports"], function(a, b) {
  var c = function() {
    function a() {
      this.eventMap = {}
    }
    return a.prototype.removeEventListener = function(a, b, c) {
      if (a in this.eventMap) {
        var d = this.eventMap[a];
        d.splice(d.indexOf(b), 1)
      }
    }, a.prototype.addEventListener = function(a, b, c) {
      a in this.eventMap ? this.eventMap[a].push(b) : this.eventMap[a] = [b]
    }, a.prototype.dispatchEvent = function(a) {
      return this.eventMap[a.type].forEach(function(b) {
        b(a)
      }), a.defaultPrevented
    }, a
  }();
  b.MockEventTarget = c;
  var d = function(a) {
    function b(b) {
      a.call(this), this.ENTITY_REFERENCE_NODE = Node.ENTITY_REFERENCE_NODE, this.ATTRIBUTE_NODE = Node.ATTRIBUTE_NODE,
        this.DOCUMENT_FRAGMENT_NODE = Node.DOCUMENT_FRAGMENT_NODE, this.TEXT_NODE = Node.TEXT_NODE, this.ELEMENT_NODE =
        Node.ELEMENT_NODE, this.COMMENT_NODE = Node.COMMENT_NODE, this.DOCUMENT_POSITION_DISCONNECTED = Node.DOCUMENT_POSITION_DISCONNECTED,
        this.DOCUMENT_POSITION_CONTAINED_BY = Node.DOCUMENT_POSITION_CONTAINED_BY, this.DOCUMENT_POSITION_CONTAINS =
        Node.DOCUMENT_POSITION_CONTAINS, this.DOCUMENT_TYPE_NODE = Node.DOCUMENT_TYPE_NODE, this.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC =
        Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC, this.DOCUMENT_NODE = Node.DOCUMENT_NODE, this.ENTITY_NODE =
        Node.ENTITY_NODE, this.PROCESSING_INSTRUCTION_NODE = Node.PROCESSING_INSTRUCTION_NODE, this.CDATA_SECTION_NODE =
        Node.CDATA_SECTION_NODE, this.NOTATION_NODE = Node.NOTATION_NODE, this.DOCUMENT_POSITION_FOLLOWING = Node.DOCUMENT_POSITION_FOLLOWING,
        this.DOCUMENT_POSITION_PRECEDING = Node.DOCUMENT_POSITION_PRECEDING, this.nodeName = b, this._childNodes = [],
        this.attributes = []
    }
    return __extends(b, a), Object.defineProperty(b.prototype, "lastChild", {
      get: function() {
        return this._childNodes[this._childNodes.length - 1]
      },
      enumerable: !0,
      configurable: !0
    }), Object.defineProperty(b.prototype, "firstChild", {
      get: function() {
        return this._childNodes[0]
      },
      enumerable: !0,
      configurable: !0
    }), Object.defineProperty(b.prototype, "childNodes", {
      get: function() {
        var a = this._childNodes;
        return a.item || (a.item = function(a) {
          return this[a]
        }.bind(a)), a
      },
      enumerable: !0,
      configurable: !0
    }), Object.defineProperty(b.prototype, "textContent", {
      get: function() {
        var a = this;
        return this._childNodes.filter(function(b) {
          return b.nodeType === a.TEXT_NODE
        }).map(function(a) {
          return a.wholeText
        }).join("")
      },
      set: function(a) {
        this._childNodes = [], this.appendChild(this.ownerDocument.createTextNode(a))
      },
      enumerable: !0,
      configurable: !0
    }), b.prototype.removeChild = function(a) {
      var b = this._childNodes.indexOf(a);
      if (b >= 0) {
        var c = this._childNodes.splice(b, 1);
        return c[0]
      }
      return null
    }, b.prototype.appendChild = function(a) {
      return this._childNodes.push(a), a
    }, b.prototype.isSupported = function(a, b) {
      throw new Error("Not implemented!")
    }, b.prototype.isEqualNode = function(a) {
      throw new Error("Not implemented!")
    }, b.prototype.lookupPrefix = function(a) {
      throw new Error("Not implemented!")
    }, b.prototype.isDefaultNamespace = function(a) {
      throw new Error("Not implemented!")
    }, b.prototype.compareDocumentPosition = function(a) {
      throw new Error("Not implemented!")
    }, b.prototype.normalize = function() {
      throw new Error("Not implemented!")
    }, b.prototype.isSameNode = function(a) {
      return this === a
    }, b.prototype.hasAttributes = function() {
      return this.attributes.length > 0
    }, b.prototype.lookupNamespaceURI = function(a) {
      throw new Error("Not implemented!")
    }, b.prototype.cloneNode = function(a) {
      throw new Error("Not implemented!")
    }, b.prototype.hasChildNodes = function() {
      return this.childNodes.length > 0
    }, b.prototype.replaceChild = function(a, b) {
      throw new Error("Not implemented!")
    }, b.prototype.insertBefore = function(a, b) {
      throw new Error("Not implemented!")
    }, b
  }(c);
  b.MockNode = d;
  var e = function(a) {
    function b(b) {
      a.call(this, b), this.name = b, this.expando = !1
    }
    return __extends(b, a), Object.defineProperty(b.prototype, "specified", {
      get: function() {
        return !!this.value
      },
      enumerable: !0,
      configurable: !0
    }), b
  }(d);
  b.MockAttribute = e;
  var f = function(a) {
    function b(b) {
      a.call(this, b), this.tagName = b
    }
    return __extends(b, a), b.prototype.getAttribute = function(a) {
      var b = this.attributes.filter(function(b) {
        return b.name === a
      });
      return b.length ? b[0].value : ""
    }, b.prototype.getElementsByTagNameNS = function(a, b) {
      throw new Error("Not implemented!")
    }, b.prototype.hasAttributeNS = function(a, b) {
      throw new Error("Not implemented!")
    }, b.prototype.getBoundingClientRect = function() {
      throw new Error("Not implemented!")
    }, b.prototype.getAttributeNS = function(a, b) {
      throw new Error("Not implemented!")
    }, b.prototype.getAttributeNodeNS = function(a, b) {
      throw new Error("Not implemented!")
    }, b.prototype.setAttributeNodeNS = function(a) {
      throw new Error("Not implemented!")
    }, b.prototype.hasAttribute = function(a) {
      var b = this.attributes.filter(function(b) {
        return b.name === a
      });
      return b.length > 0
    }, b.prototype.removeAttribute = function(a) {
      this.attributes = this.attributes.filter(function(b) {
        return b.name !== a
      })
    }, b.prototype.setAttributeNS = function(a, b, c) {
      throw new Error("Not implemented!")
    }, b.prototype.getAttributeNode = function(a) {
      throw new Error("Not implemented!")
    }, b.prototype.getElementsByTagName = function(a) {
      throw new Error("Not implemented!")
    }, b.prototype.setAttributeNode = function(a) {
      throw new Error("Not implemented!")
    }, b.prototype.getClientRects = function() {
      throw new Error("Not implemented!")
    }, b.prototype.removeAttributeNode = function(a) {
      throw new Error("Not implemented!")
    }, b.prototype.setAttribute = function(a, b) {
      this.hasAttribute(a) && this.removeAttribute(a);
      var c = this.ownerDocument.createAttribute(a);
      c.ownerElement = this, c.value = b, this.attributes.push(c)
    }, b.prototype.removeAttributeNS = function(a, b) {
      throw new Error("Not implemented!")
    }, b.prototype.querySelectorAll = function(a) {
      throw new Error("Not implemented!")
    }, b.prototype.querySelector = function(a) {
      throw new Error("Not implemented!")
    }, Object.defineProperty(b.prototype, "childElementCount", {
      get: function() {
        var a = this;
        return this._childNodes.filter(function(b) {
          return b.nodeType === a.ELEMENT_NODE
        }).length
      },
      enumerable: !0,
      configurable: !0
    }), Object.defineProperty(b.prototype, "lastElementChild", {
      get: function() {
        var a = this,
          b = this._childNodes.filter(function(b) {
            return b.nodeType === a.ELEMENT_NODE
          });
        return b[b.length - 1]
      },
      enumerable: !0,
      configurable: !0
    }), Object.defineProperty(b.prototype, "firstElementChild", {
      get: function() {
        var a = this,
          b = this._childNodes.filter(function(b) {
            return b.nodeType === a.ELEMENT_NODE
          });
        return b[0]
      },
      enumerable: !0,
      configurable: !0
    }), b.prototype.msMatchesSelector = function(a) {
      throw new Error("Not implemented!")
    }, b.prototype.fireEvent = function(a, b) {
      throw new Error("Not implemented!")
    }, b.prototype.msGetRegionContent = function() {
      throw new Error("Not implemented!")
    }, b.prototype.msReleasePointerCapture = function(a) {
      throw new Error("Not implemented!")
    }, b.prototype.msSetPointerCapture = function(a) {
      throw new Error("Not implemented!")
    }, b
  }(d);
  b.MockElement = f;
  var g = function(a) {
    function b(b) {
      a.call(this, b), this.nodeType = this.TEXT_NODE, this.length = b.length, this.data = b
    }
    return __extends(b, a), b.prototype.deleteData = function(a, b) {
      throw new Error("Not implemented!")
    }, b.prototype.replaceData = function(a, b, c) {
      throw new Error("Not implemented!")
    }, b.prototype.appendData = function(a) {
      throw new Error("Not implemented!")
    }, b.prototype.insertData = function(a, b) {
      throw new Error("Not implemented!")
    }, b.prototype.substringData = function(a, b) {
      throw new Error("Not implemented!")
    }, b
  }(d);
  b.MockCharacterData = g;
  var h = function(a) {
    function b(b) {
      a.call(this, b), this.wholeText = b
    }
    return __extends(b, a), b.prototype.splitText = function(a) {
      throw new Error("Not implemented!")
    }, b.prototype.replaceWholeText = function(a) {
      throw new Error("Not implemented!")
    }, b.prototype.swapNode = function(a) {
      throw new Error("Not implemented!")
    }, b.prototype.removeNode = function(a) {
      throw new Error("Not implemented!")
    }, b.prototype.replaceNode = function(a) {
      throw new Error("Not implemented!")
    }, b
  }(g);
  b.MockText = h;
  var i = function(a) {
    function b(b) {
      a.call(this, b), this.style = {}, this.nodeType = this.ELEMENT_NODE
    }
    return __extends(b, a), Object.defineProperty(b.prototype, "className", {
      get: function() {
        return this.getAttribute("class")
      },
      set: function(a) {
        this.setAttribute("class", a)
      },
      enumerable: !0,
      configurable: !0
    }), Object.defineProperty(b.prototype, "id", {
      get: function() {
        return this.getAttribute("id")
      },
      set: function(a) {
        this.setAttribute("id", a)
      },
      enumerable: !0,
      configurable: !0
    }), Object.defineProperty(b.prototype, "children", {
      get: function() {
        var a = this,
          b = this._childNodes.filter(function(b) {
            return b.nodeType === a.ELEMENT_NODE
          });
        return b.item || (b.item = function(a) {
          return this[a]
        }.bind(b)), b
      },
      enumerable: !0,
      configurable: !0
    }), Object.defineProperty(b.prototype, "outerHTML", {
      get: function() {
        var a = new s(this);
        return a.toString(!0)
      },
      enumerable: !0,
      configurable: !0
    }), Object.defineProperty(b.prototype, "innerHTML", {
      get: function() {
        var a = new s(this);
        return a.toString()
      },
      set: function(a) {
        var b = this,
          c = new r(this.ownerDocument),
          d = c.parse(a);
        d.forEach(function(a) {
          b.appendChild(a)
        })
      },
      enumerable: !0,
      configurable: !0
    }), b
  }(f);
  b.MockHTMLElement = i;
  var j = function() {
    function a() {}
    return a.prototype.createElement = function(a) {
      var b = new i(a);
      return b.ownerDocument = this, b
    }, a.prototype.createTextNode = function(a) {
      var b = new h(a);
      return b.ownerDocument = this, b
    }, a.prototype.createAttribute = function(a) {
      var b = new e(a);
      return b.ownerDocument = this, b
    }, a
  }();
  b.MockDocument = j;
  var k = function() {
    function a() {}
    return a
  }();
  b.MockWindow = k;
  var l = function() {
    function a(a) {
      this.name = "error", this.message = a
    }
    return a.prototype.consumeCharacter = function(a) {
      return this
    }, a.prototype.onTransition = function(a, b) {}, a
  }(),
    m = function() {
      function a() {
        this.name = "text", this.textContent = ""
      }
      return a.prototype.consumeCharacter = function(a) {
        var b = a.next();
        switch (b) {
          case "<":
            return new n;
          case ">":
            return new l("Unexpected >");
          default:
            return this.textContent += b, this
        }
      }, a.prototype.onTransition = function(a, b) {
        if (this.textContent) {
          var c = a.document.createTextNode(this.textContent);
          a.currentNode ? a.currentNode.appendChild(c) : a.root.push(c)
        }
      }, a
    }(),
    n = function() {
      function a() {
        this.name = "tag", this.tagName = "", this.isClosing = !1, this.attributes = {}
      }
      return a.prototype.consumeCharacter = function(a) {
        var b = a.next();
        switch (b) {
          case "/":
            return this.isClosing = !0, this;
          case ">":
            return this.tagName ? new m : new l("No tag name specified");
          case " ":
            return this.tagName ? this.isClosing ? new l("Closing tags cannot have attributes") : new o(this) : new l(
              "Tag name must be first.");
          default:
            return this.tagName += b, this
        }
      }, a.prototype.onTransition = function(a, b) {
        var c = this;
        if (this.tagName && b !== "attribute")
          if (this.isClosing) {
            if (a.openElements[a.openElements.length - 1].tagName !== this.tagName) throw new Error(
              "Mismatched closing tag:" + this.tagName);
            a.openElements.pop(), a.openElements.length ? a.currentNode = a.openElements[a.openElements.length - 1] :
              a.currentNode = null
          } else {
            var d = a.document.createElement(this.tagName);
            Object.keys(this.attributes).forEach(function(a) {
              d.setAttribute(a, c.attributes[a])
            }), a.currentNode ? a.currentNode.appendChild(d) : a.root.push(d), a.openElements.push(d), a.currentNode =
              d
          }
      }, a
    }(),
    o = function() {
      function a(a) {
        this.name = "attribute", this.tag = a, this.inValue = !1, this.attributeName = ""
      }
      return a.prototype.consumeCharacter = function(a) {
        var b = a.next();
        switch (b) {
          case " ":
            return this.inValue ? this.tag : this;
          case "=":
            return this.inValue = !0, new p(this);
          case ">":
            return a.back(), this.tag;
          default:
            return this.inValue === !1 && (this.attributeName += b), this
        }
      }, a.prototype.onTransition = function(a, b) {
        b !== "attributeValue" && (this.tag.attributes[this.attributeName] = this.attributeValue)
      }, a
    }(),
    p = function() {
      function a(a) {
        this.name = "attributeValue", this.attribute = a, this.value = "", this.quote = !1
      }
      return a.prototype.consumeCharacter = function(a) {
        var b = a.next();
        switch (b) {
          case '"':
            return this.quote === !1 ? (this.quote = !0, this) : this.attribute;
          default:
            if (this.quote === !1) return new l('Expected " character');
            return this.value += b, this
        }
      }, a.prototype.onTransition = function(a, b) {
        this.attribute.attributeValue = this.value
      }, a
    }(),
    q = function() {
      function a(a) {
        this.index = 0, this.text = a
      }
      return a.prototype.more = function() {
        return this.index < this.text.length
      }, a.prototype.next = function() {
        if (this.index >= this.text.length) throw new Error("Past end of string!");
        return this.text[this.index++]
      }, a.prototype.back = function() {
        this.index--
      }, a
    }(),
    r = function() {
      function a(a) {
        this.document = a, this.root = [], this.openElements = [], this.currentNode = null, this.activeState = new m
      }
      return a.prototype.parse = function(a) {
        var b = new q(a);
        while (b.more()) {
          var c = this.activeState.consumeCharacter(b);
          c !== this.activeState && (this.activeState.onTransition(this, c.name), this.activeState = c)
        }
        if (this.activeState.name === "error") throw new Error(this.activeState.message);
        if (this.openElements.length !== 0) throw new Error("Elements not closed: " + this.openElements.map(function(
          a) {
          return a.tagName
        }).join());
        return this.root
      }, a
    }(),
    s = function() {
      function a(a) {
        this.root = a
      }
      return a.prototype.print = function(a) {
        var b = "";
        switch (a.nodeType) {
          case a.ELEMENT_NODE:
            b += this.printElement(a);
            break;
          case a.TEXT_NODE:
            b += this.printText(a)
        }
        return b
      }, a.prototype.printChildren = function(a) {
        var b = "";
        if (a.hasChildNodes())
          for (var c = 0; c < a.childNodes.length; c++) b += this.print(a.childNodes.item(c));
        return b
      }, a.prototype.printElement = function(a) {
        var b = ["<"];
        return b.push(a.tagName), a.hasAttributes() && b.push(a.attributes.reduce(function(a, b) {
          var c = [a, b.name];
          return b.value && c.push('="', b.value, '"'), c.join("")
        }, " ")), b.push(">"), b.push(this.printChildren(a)), b.push("</"), b.push(a.tagName), b.push(">"), b.join("")
      }, a.prototype.printText = function(a) {
        return a.wholeText
      }, a.prototype.toString = function(a) {
        return a ? this.print(this.root) : this.printChildren(this.root)
      }, a
    }()
})