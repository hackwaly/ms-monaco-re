define("vs/languages/typescript/service/references", ["require", "exports", "../lib/typescriptServices",
  "vs/base/objects", "vs/base/lib/winjs.base"
], function(e, t, n, r, i) {
  function o(e, t) {
    var n = e.nodes().filter(function(e) {
      return !t.hasOwnProperty(e.getName());
    });
    return 0 === n.length ? null : (n.sort(function(e, t) {
      var n = e.getIncoming().length - t.getIncoming().length;
      0 === n && (n = t.getOutgoing().length - e.getOutgoing().length);

      0 === n && (n = e.getName().localeCompare(t.getName()));

      return n;
    }), n[0]);
  }

  function s(e) {
    for (var t, n, r = [], i = {}; null !== (t = o(e, i));) {
      e.traverse(t.getName(), function(e) {
        n = e.getName();

        i[n] || (i[n] = !0, r.unshift(e));
      });
    }
    return r;
  }

  function a(e, n, r) {
    var o;

    var s;

    var a = new p;

    var l = new y;
    n = n.slice(0);

    n.sort(function(e, t) {
      return t.references.length - e.references.length;
    });

    return new i.Promise(function(i) {
      function c() {
        return 0 === n.length ? (i(a), void 0) : (o = n.shift(), (s = a.hasNode(r.nodeName(o.path))) ? c() : (o.resolve(
          e, l.consume.bind(l), r).then(function() {
          t.fillGraph(a, a.insertNode(r.nodeName(o.path)), r, o);

          c();
        }), void 0));
      }
      c();
    });
  }

  function l(e, n, r, i) {
    i.references.forEach(function(o) {
      if (o.error && !o.file) {
        var s = {
          message: o.error.message,
          path: r.nodeName(i.path),
          offset: o.offset,
          length: o.length,
          referenceType: o instanceof d ? 1 : 2
        };
        e.insertEdge(n.getName(), "error:" + JSON.stringify(s));
      } else if (o.file) {
        var a = e.insertEdge(n.getName(), r.nodeName(o.file.path));
        o.error || t.fillGraph(e, a, r, o.file);
      }
    });
  }

  function c(e) {
    return (new y).consume(e);
  }
  var u = function() {
    function e(e) {
      this.name = e;

      this.outgoing = {};

      this.incoming = {};
    }
    e.prototype.getName = function() {
      return this.name;
    };

    e.prototype.getOutgoing = function() {
      return Object.keys(this.outgoing);
    };

    e.prototype.getIncoming = function() {
      return Object.keys(this.incoming);
    };

    return e;
  }();

  var p = function() {
    function e() {
      this.store = {};
    }
    e.prototype.clone = function() {
      var t = new e;
      t.store = r.clone(this.store);

      return t;
    };

    e.prototype.merge = function(e) {
      var t = this;
      if (this !== e) {
        var n = Object.keys(e.store);
        n.forEach(function(e) {
          t.hasNode(e) || t.insertNode(e);
        });

        n.forEach(function(n) {
          var r = e.store[n];
          r.getOutgoing().forEach(function(e) {
            t.insertEdge(n, e);
          });
        });
      }
    };

    e.prototype.isEmpty = function() {
      return 0 === Object.keys(this.store).length;
    };

    e.prototype.hasNode = function(e) {
      return this.store.hasOwnProperty(e);
    };

    e.prototype.insertNode = function(e) {
      var t = new u(e);
      this.store[e] = t;

      return t;
    };

    e.prototype.insertEdge = function(e, t) {
      this.hasNode(e) || this.insertNode(e);

      this.hasNode(t) || this.insertNode(t);

      this.store[e].outgoing[t] = !0;

      this.store[t].incoming[e] = !0;

      return this.store[t];
    };

    e.prototype.removeEdges = function(e) {
      for (var t = [], n = 0; n < arguments.length - 1; n++) {
        t[n] = arguments[n + 1];
      }
      if (this.hasNode(e)) {
        var r;

        var i;

        var o = this.store[e];

        var s = t.length;
        for (0 === t.length && (t = Object.keys(o.outgoing), s = t.length), r = 0; s > r; r++) {
          this.store.hasOwnProperty(t[r]) && (i = this.store[t[r]], delete o.outgoing[i.name], delete i.incoming[e]);
        }
      }
    };

    e.prototype.removeNode = function(e) {
      var t = this;
      return this.store.hasOwnProperty(e) ? (delete this.store[e], Object.keys(this.store).forEach(function(n) {
        var r = t.store[n];
        delete r.incoming[e];

        delete r.outgoing[e];
      }), !0) : !1;
    };

    e.prototype.nodes = function() {
      var e = this;
      return Object.keys(this.store).map(function(t) {
        return e.store[t];
      });
    };

    e.prototype.node = function(e) {
      return this.store.hasOwnProperty(e) ? this.store[e] : null;
    };

    e.prototype.traverse = function(e, t, n) {
      "undefined" == typeof n && (n = {});
      var r = this;
      if (this.store.hasOwnProperty(e) && n[e] !== !0) {
        n[e] = !0;
        var i = this.store[e];
        t(i);

        Object.keys(i.outgoing).forEach(function(e) {
          r.traverse(e, t, n);
        });
      }
    };

    e.prototype.toJSON = function() {
      for (var e = Object.keys(this.store), t = {}, n = {}, r = [], i = 0; i < e.length; i++) {
        var o = e[i];
        t[o] = i;

        n[i] = o;
      }
      for (var i = 0; i < e.length; i++) {
        var o = e[i];

        var s = this.store[o].getOutgoing();
        r.push(i);

        r.push(s.length);
        for (var a = 0; a < s.length; a++) {
          var l = s[a];

          var c = t[l];
          r.push(c);
        }
      }
      return {
        i: n,
        g: r
      };
    };

    e.fromJSON = function(t) {
      var n;

      var r;

      var i = new e;
      for (var o in t.i) {
        t.i.hasOwnProperty(o) && (n = t.i[o], i.insertNode(n));
      }
      for (var s = 0, a = t.g.length; a > s; s++)
        for (n = t.i[t.g[s]], r = t.g[++s]; r > 0;) {
          i.insertEdge(n, t.i[t.g[++s]]);
          r -= 1;
        }
      return i;
    };

    return e;
  }();
  t.Graph = p;

  t.computeTransitiveClosure = s;

  t.buildDependencyGraph = a;

  t.fillGraph = l;
  var h = function() {
    function e(e, t, n) {
      this.offset = e;

      this.length = t;

      this.path = n;
    }
    return e;
  }();
  t.Reference = h;
  var d = function(e) {
    function t() {
      e.apply(this, arguments);
    }
    __extends(t, e);

    t.REGEXP = /^(\/\/\/\s*<reference\s+path=)('|")(.+?)\2\s*(static=('|")(.+?)\2\s*)*/im;

    return t;
  }(h);
  t.TripleSlashReference = d;
  var m = function(e) {
    function t(t, n, r) {
      e.call(this, t, n, r);

      this.isRelative = 0 === this.path.indexOf("./") || 0 === this.path.indexOf("../");

      this.isRooted = 0 === this.path.indexOf("/");

      this.isAbsolute = !this.isRelative && !this.isRooted;
    }
    __extends(t, e);

    t.TS = ".ts";

    t.DTS = ".d.ts";

    t.JS = ".js";

    return t;
  }(h);
  t.ImportReference = m;
  var f = function(e) {
    function t() {
      e.apply(this, arguments);
    }
    __extends(t, e);

    return t;
  }(m);
  t.RequireReference = f;
  var g = function() {
    function e(e, t) {
      this.path = e;

      this.content = t;

      this.references = [];
    }
    e.prototype.resolve = function(t, n, r, o) {
      "undefined" == typeof o && (o = {});
      var s = this;
      this.references = n(this.content);

      o[this.path] = !0;

      return new i.Promise(function(i, a) {
        var l = s.references.length;

        var c = function() {
          0 === --l && i(null);
        };

        var u = function() {
          l += 1;
        };
        return 0 === l ? (i(null), void 0) : (s.references.forEach(function(i) {
          t.load(s.path, i, r).then(function(s) {
            s && o[s.path] ? (i.file = s, i.error = {
              message: "cyclic reference",
              path: s.path
            }) : (i.file = s, r.recursive && i.file instanceof e && (u(), s.resolve(t, n, r, o).then(function() {
              c();
            }, a)));

            c();
          }, function(e) {
            i.error = e;

            c();
          });
        }), void 0);
      });
    };

    return e;
  }();
  t.File = g;
  var v = function() {
    function e(e) {
      this.value = e;
      var t = n.SimpleText.fromString(e);
      this.scanner = new n.Scanner(null, t, 1);

      this.nextTokens = [];

      this.offset = 0;
    }
    e.prototype.next = function() {
      if (0 === this.nextTokens.length) {
        for (var e = this.scanner.scan([], !0), t = e.leadingTrivia(), n = e.trailingTrivia(), r = 0, i = t.count(); i >
          r; r++) {
          var o = t.syntaxTriviaAt(r);
          this.add(o.kind(), this.offset, o.fullWidth(), o.fullText());

          this.offset += o.fullWidth();
        }
        this.add(e.kind(), this.offset, e.width(), e.valueText());

        this.offset += e.width();
        for (var r = 0, i = n.count(); i > r; r++) {
          var o = n.syntaxTriviaAt(r);
          this.add(o.kind(), this.offset, o.fullWidth(), o.fullText());

          this.offset += o.fullWidth();
        }
      }
      return this.nextTokens.shift();
    };

    e.prototype.add = function(e, t, r, i) {
      switch (e) {
        case n.SyntaxKind.WhitespaceTrivia:
        case n.SyntaxKind.NewLineTrivia:
          return;
      }
      this.nextTokens.push({
        kind: e,
        offset: t,
        length: r,
        text: i
      });
    };

    return e;
  }();

  var y = function() {
    function e() {
      this.references = [];
    }
    e.prototype.consume = function(e) {
      function t(e) {
        "undefined" == typeof e && (e = !0);

        i = r;
        do {
          r = s.next();
        } while (!e && (r.kind === n.SyntaxKind.SingleLineCommentTrivia || r.kind === n.SyntaxKind.MultiLineCommentTrivia));
        return r;
      }
      for (var r, i, o = this.references.length, s = new v(e); t().kind !== n.SyntaxKind.EndOfFileToken;) {
        var a = !1;
        if (r.kind === n.SyntaxKind.SingleLineCommentTrivia) {
          var l = r.text;

          var c = r.offset;

          var u = r.length;

          var p = d.REGEXP.exec(l);
          p && this.references.push(new d(c + p[1].length + p[2].length, p[3].length, p[3]));
        } else {
          r.kind === n.SyntaxKind.ImportKeyword && (t(), r.kind === n.SyntaxKind.IdentifierName && (t(), r.kind === n
            .SyntaxKind.EqualsToken && (t(), a = !0)));
        }
        if ((a || !i || i.kind !== n.SyntaxKind.DotToken) && r.kind === n.SyntaxKind.RequireKeyword && (t(), r.kind ===
          n.SyntaxKind.OpenParenToken && (t(), r.kind === n.SyntaxKind.StringLiteral))) {
          var h = r.text;

          var c = r.offset;

          var u = r.length;
          t();

          r.kind === n.SyntaxKind.CloseParenToken && (a ? this.references.push(new m(c + 1, -2 + u, h)) : this.references
            .push(new f(c + 1, -2 + u, h)));
        }
        if (r.kind === n.SyntaxKind.IdentifierName && "define" === r.text && (t(), r.kind === n.SyntaxKind.OpenParenToken &&
          (t(!1), r.kind === n.SyntaxKind.StringLiteral && (t(!1), r.kind === n.SyntaxKind.CommaToken && t(!1)), r.kind ===
            n.SyntaxKind.OpenBracketToken)))
          for (t(!1); r.kind === n.SyntaxKind.StringLiteral;) {
            "exports" !== r.text && "require" !== r.text && "module" !== r.text && this.references.push(new f(r.offset +
              1, -2 + r.length, r.text));
            t(!1);
            r.kind === n.SyntaxKind.CommaToken && t(!1);
          }
      }
      return this.references.slice(o);
    };

    return e;
  }();
  t.ScannerBasedCollector = y;

  t.collect = c;
});