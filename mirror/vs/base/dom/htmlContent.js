define("vs/base/dom/htmlContent", ["require", "exports", "vs/base/dom/dom"], function(e, t, n) {
  function i(e, n) {
    if (e.isText) {
      return document.createTextNode(e.text);
    }
    var i = e.tagName || "div";

    var s = document.createElement(i);
    e.className && (s.className = e.className);

    e.text && (s.textContent = e.text);

    e.style && s.setAttribute("style", e.style);

    e.customStyle && Object.keys(e.customStyle).forEach(function(t) {
      s.style[t] = e.customStyle[t];
    });

    e.children && e.children.forEach(function(e) {
      s.appendChild(t.renderHtml(e));
    });

    e.formattedText && o(s, r(e.formattedText), n);

    return s;
  }

  function o(e, t, i) {
    var r;
    if (2 === t.type) {
      r = document.createTextNode(t.content);
    } else if (3 === t.type) {
      r = document.createElement("b");
    } else if (4 === t.type) {
      r = document.createElement("i");
    } else if (5 === t.type) {
      var s = document.createElement("a");
      s.href = "#";

      n.addStandardDisposableListener(s, "click", function(e) {
        i(t.index, e);
      });

      r = s;
    } else {
      if (7 === t.type) {
        r = document.createElement("br");
      } else {
        if (1 === t.type) {
          r = e;
        }
      }
    }
    if (e !== r) {
      e.appendChild(r);
    }

    if (Array.isArray(t.children)) {
      t.children.forEach(function(e) {
        o(r, e, i);
      });
    }
  }

  function r(e) {
    for (var t = {
      type: 1,
      children: []
    }, n = 0, i = t, o = [], r = new l(e); !r.eos();) {
      var u = r.next();
      if (s(u) && u === r.peek()) {
        r.advance();

        if (2 === i.type) {
          i = o.pop();
        }
        var c = a(u);
        if (i.type === c || 5 === i.type && 6 === c) {
          i = o.pop();
        } else {
          var d = {
            type: c,
            children: []
          };
          if (5 === c) {
            d.index = n;
            n++;
          }

          i.children.push(d);

          o.push(i);

          i = d;
        }
      } else if ("\n" === u) {
        if (2 === i.type) {
          i = o.pop();
        }
        i.children.push({
          type: 7
        });
      } else if (2 !== i.type) {
        var h = {
          type: 2,
          content: u
        };
        i.children.push(h);

        o.push(i);

        i = h;
      } else {
        i.content += u;
      }
    }
    if (2 === i.type && (i = o.pop()), o.length) throw new Error("Incorrectly formatted string literal");
    return t;
  }

  function s(e) {
    return 0 !== a(e);
  }

  function a(e) {
    switch (e) {
      case "*":
        return 3;
      case "_":
        return 4;
      case "[":
        return 5;
      case "]":
        return 6;
      default:
        return 0;
    }
  }
  t.renderHtml = i;
  var u;

  var l = function() {
    function e(e) {
      this.source = e;

      this.index = 0;
    }
    e.prototype.eos = function() {
      return this.index >= this.source.length;
    };

    e.prototype.next = function() {
      var e = this.peek();
      this.advance();

      return e;
    };

    e.prototype.peek = function() {
      return this.source[this.index];
    };

    e.prototype.advance = function() {
      this.index++;
    };

    return e;
  }();
  ! function(e) {
    e[e.Invalid = 0] = "Invalid";

    e[e.Root = 1] = "Root";

    e[e.Text = 2] = "Text";

    e[e.Bold = 3] = "Bold";

    e[e.Italics = 4] = "Italics";

    e[e.Action = 5] = "Action";

    e[e.ActionClose = 6] = "ActionClose";

    e[e.NewLine = 7] = "NewLine";
  }(u || (u = {}));
});