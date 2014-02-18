var __extends = this.__extends || function(d, b) {
    for (var p in b)
      if (b.hasOwnProperty(p)) {
        d[p] = b[p];
      }

    function __() {
      this.constructor = d;
    }
    __.prototype = b.prototype;
    d.prototype = new __;
  };

define(["require", "exports", "../lib/typescriptServices", "vs/base/objects", "vs/base/lib/winjs.base"], function(
  require, exports, __typescriptServices__, __objects__, __winjs__) {
  "use strict";
  var typescriptServices = __typescriptServices__;
  var objects = __objects__;
  var winjs = __winjs__;
  var Node = function() {
    function Node(name) {
      this.name = name;
      this.outgoing = {};
      this.incoming = {};
    }
    Node.prototype.getName = function() {
      return this.name;
    };
    Node.prototype.getOutgoing = function() {
      return Object.keys(this.outgoing);
    };
    Node.prototype.getIncoming = function() {
      return Object.keys(this.incoming);
    };
    return Node;
  }();
  var Graph = function() {
    function Graph() {
      this.store = {};
    }
    Graph.prototype.clone = function() {
      var graph = new Graph;
      graph.store = objects.clone(this.store);
      return graph;
    };
    Graph.prototype.merge = function(other) {
      var _this = this;
      if (this === other) {
        return;
      }
      var keys = Object.keys(other.store);
      keys.forEach(function(name) {
        if (!_this.hasNode(name)) {
          _this.insertNode(name);
        }
      });
      keys.forEach(function(name) {
        var otherNode = other.store[name];
        otherNode.getOutgoing().forEach(function(outgoing) {
          _this.insertEdge(name, outgoing);
        });
      });
    };
    Graph.prototype.isEmpty = function() {
      return Object.keys(this.store).length === 0;
    };
    Graph.prototype.hasNode = function(name) {
      return this.store.hasOwnProperty(name);
    };
    Graph.prototype.insertNode = function(name) {
      var node = new Node(name);
      this.store[name] = node;
      return node;
    };
    Graph.prototype.insertEdge = function(from, to) {
      if (!this.hasNode(from)) {
        this.insertNode(from);
      }
      if (!this.hasNode(to)) {
        this.insertNode(to);
      }
      this.store[from].outgoing[to] = true;
      this.store[to].incoming[from] = true;
      return this.store[to];
    };
    Graph.prototype.removeEdges = function(from) {
      var to = [];
      for (var _i = 0; _i < arguments.length - 1; _i++) {
        to[_i] = arguments[_i + 1];
      }
      if (!this.hasNode(from)) {
        return;
      }
      var node = this.store[from];

      var len = to.length;

      var i;

      var target;
      if (to.length === 0) {
        to = Object.keys(node.outgoing);
        len = to.length;
      }
      for (i = 0; i < len; i++) {
        if (!this.store.hasOwnProperty(to[i])) {
          continue;
        }
        target = this.store[to[i]];
        delete node.outgoing[target.name];
        delete target.incoming[from];
      }
    };
    Graph.prototype.removeNode = function(name) {
      var _this = this;
      if (!this.store.hasOwnProperty(name)) {
        return false;
      }
      delete this.store[name];
      Object.keys(this.store).forEach(function(n) {
        var node = _this.store[n];
        delete node.incoming[name];
        delete node.outgoing[name];
      });
      return true;
    };
    Graph.prototype.nodes = function() {
      var _this = this;
      return Object.keys(this.store).map(function(name) {
        return _this.store[name];
      });
    };
    Graph.prototype.node = function(name) {
      if (!this.store.hasOwnProperty(name)) {
        return null;
      }
      return this.store[name];
    };
    Graph.prototype.traverse = function(name, callback, seen) {
      if (typeof seen === "undefined") {
        seen = {};
      }
      var _this = this;
      if (!this.store.hasOwnProperty(name)) {
        return;
      }
      if (seen[name] === true) {
        return;
      }
      seen[name] = true;
      var node = this.store[name];
      callback(node);
      Object.keys(node.outgoing).forEach(function(name) {
        _this.traverse(name, callback, seen);
      });
    };
    Graph.prototype.toJSON = function() {
      var keys = Object.keys(this.store);

      var index = {};

      var inverseIndex = {};

      var graph = [];
      for (var i = 0; i < keys.length; i++) {
        var key = keys[i];
        index[key] = i;
        inverseIndex[i] = key;
      }
      for (var i = 0; i < keys.length; i++) {
        var key = keys[i];

        var outgoing = this.store[key].getOutgoing();
        graph.push(i);
        graph.push(outgoing.length);
        for (var j = 0; j < outgoing.length; j++) {
          var pathOutgoing = outgoing[j];

          var indexOutgoing = index[pathOutgoing];
          graph.push(indexOutgoing);
        }
      }
      return {
        i: inverseIndex,
        g: graph
      };
    };
    Graph.fromJSON = function(data) {
      var graph = new Graph;

      var name;

      var edgeCount;
      for (var key in data.i) {
        if (data.i.hasOwnProperty(key)) {
          name = data.i[key];
          graph.insertNode(name);
        }
      }
      for (var i = 0, len = data.g.length; i < len; i++) {
        name = data.i[data.g[i]];
        edgeCount = data.g[++i];
        while (edgeCount > 0) {
          graph.insertEdge(name, data.i[data.g[++i]]);
          edgeCount -= 1;
        }
      }
      return graph;
    };
    return Graph;
  }();
  exports.Graph = Graph;

  function findRootAlike(graph, seen) {
    var nodes = graph.nodes().filter(function(node) {
      return !seen.hasOwnProperty(node.getName());
    });
    if (nodes.length === 0) {
      return null;
    }
    nodes.sort(function(a, b) {
      var diff = a.getIncoming().length - b.getIncoming().length;
      if (diff === 0) {
        diff = b.getOutgoing().length - a.getOutgoing().length;
      }
      if (diff === 0) {
        diff = a.getName().localeCompare(b.getName());
      }
      return diff;
    });
    return nodes[0];
  }

  function computeTransitiveClosure(graph) {
    var root;

    var nodes = [];

    var name;

    var seen = {};
    while ((root = findRootAlike(graph, seen)) !== null) {
      graph.traverse(root.getName(), function(node) {
        name = node.getName();
        if (!seen[name]) {
          seen[name] = true;
          nodes.unshift(node);
        }
      });
    }
    return nodes;
  }
  exports.computeTransitiveClosure = computeTransitiveClosure;

  function buildDependencyGraph(loader, files, options) {
    var graph = new Graph;

    var collector = new ScannerBasedCollector;

    var file;

    var alreadyInGraph;
    files = files.slice(0);
    files.sort(function(a, b) {
      return b.references.length - a.references.length;
    });
    return new winjs.Promise(function(c, e, p) {
      function f() {
        if (files.length === 0) {
          c(graph);
          return;
        }
        file = files.shift();
        alreadyInGraph = graph.hasNode(options.nodeName(file.path));
        if (alreadyInGraph) {
          return f();
        }
        file.resolve(loader, collector.consume.bind(collector), options).then(function() {
          exports.fillGraph(graph, graph.insertNode(options.nodeName(file.path)), options, file);
          f();
        });
      }
      f();
    });
  }
  exports.buildDependencyGraph = buildDependencyGraph;

  function fillGraph(graph, from, options, file) {
    file.references.forEach(function(reference) {
      if (reference.error && !reference.file) {
        var error = {
          message: reference.error.message,
          path: options.nodeName(file.path),
          offset: reference.offset,
          length: reference.length,
          referenceType: reference instanceof TripleSlashReference ? 1 << 0 : 1 << 1
        };
        graph.insertEdge(from.getName(), "error:" + JSON.stringify(error));
      } else if (reference.file) {
        var node = graph.insertEdge(from.getName(), options.nodeName(reference.file.path));
        if (!reference.error) {
          exports.fillGraph(graph, node, options, reference.file);
        }
      }
    });
  }
  exports.fillGraph = fillGraph;
  var Reference = function() {
    function Reference(offset, length, path) {
      this.offset = offset;
      this.length = length;
      this.path = path;
    }
    return Reference;
  }();
  exports.Reference = Reference;
  var TripleSlashReference = function(_super) {
    __extends(TripleSlashReference, _super);

    function TripleSlashReference() {
      _super.apply(this, arguments);
    }
    TripleSlashReference.REGEXP = /^(\/\/\/\s*<reference\s+path=)('|")(.+?)\2\s*(static=('|")(.+?)\2\s*)*\/>/im;
    return TripleSlashReference;
  }(Reference);
  exports.TripleSlashReference = TripleSlashReference;
  var ImportReference = function(_super) {
    __extends(ImportReference, _super);

    function ImportReference(offset, length, path) {
      _super.call(this, offset, length, path);
      this.isRelative = this.path.indexOf("./") === 0 || this.path.indexOf("../") === 0;
      this.isRooted = this.path.indexOf("/") === 0;
      this.isAbsolute = !this.isRelative && !this.isRooted;
    }
    ImportReference.TS = ".ts";
    ImportReference.DTS = ".d.ts";
    return ImportReference;
  }(Reference);
  exports.ImportReference = ImportReference;
  var File = function() {
    function File(path, content) {
      this.path = path;
      this.content = content;
      this.references = [];
    }
    File.prototype.resolve = function(loader, collect, options, seen) {
      if (typeof seen === "undefined") {
        seen = {};
      }
      var _this = this;
      this.references = collect(this.content);
      seen[this.path] = true;
      return new winjs.Promise(function(success, error, progress) {
        var c = _this.references.length;

        var less = function() {
          if (--c === 0) {
            success(null);
          }
        };

        var more = function() {
          c += 1;
        };
        if (c === 0) {
          success(null);
          return;
        }
        _this.references.forEach(function(reference) {
          loader.load(_this.path, reference, options).then(function(file) {
            if (file && seen[file.path]) {
              reference.file = file;
              reference.error = {
                message: "cyclic reference",
                path: file.path
              };
            } else {
              reference.file = file;
              if (options.recursive && reference.file instanceof File) {
                more();
                file.resolve(loader, collect, options, seen).then(function() {
                  less();
                }, error);
              }
            }
            less();
          }, function(err) {
            reference.error = err;
            less();
          });
        });
      });
    };
    return File;
  }();
  exports.File = File;
  var Scanner = function() {
    function Scanner(value) {
      this.value = value;
      var simpleText = typescriptServices.TypeScript.SimpleText.fromString(value);
      this.scanner = new typescriptServices.TypeScript.Scanner(null, simpleText, typescriptServices.TypeScript.LanguageVersion
        .EcmaScript5);
      this.nextTokens = [];
      this.offset = 0;
    }
    Scanner.prototype.next = function() {
      if (this.nextTokens.length === 0) {
        var token = this.scanner.scan([], true);

        var leadingTrivia = token.leadingTrivia();

        var trailingTrivia = token.trailingTrivia();

        var currentOffset = this.scanner.absoluteIndex();
        for (var i = 0, len = leadingTrivia.count(); i < len; i++) {
          var trivia = leadingTrivia.syntaxTriviaAt(i);
          this.add(trivia.kind(), this.offset, trivia.fullWidth(), trivia.fullText());
          this.offset += trivia.fullWidth();
        }
        this.add(token.kind(), this.offset, token.width(), token.valueText());
        this.offset += token.width();
        for (var i = 0, len = trailingTrivia.count(); i < len; i++) {
          var trivia = trailingTrivia.syntaxTriviaAt(i);
          this.add(trivia.kind(), this.offset, trivia.fullWidth(), trivia.fullText());
          this.offset += trivia.fullWidth();
        }
      }
      return this.nextTokens.shift();
    };
    Scanner.prototype.add = function(kind, offset, length, text) {
      switch (kind) {
        case typescriptServices.TypeScript.SyntaxKind.WhitespaceTrivia:
        case typescriptServices.TypeScript.SyntaxKind.NewLineTrivia:
          return;
      }
      this.nextTokens.push({
        kind: kind,
        offset: offset,
        length: length,
        text: text
      });
    };
    return Scanner;
  }();
  var ScannerBasedCollector = function() {
    function ScannerBasedCollector() {
      this.references = [];
    }
    ScannerBasedCollector.prototype.consume = function(value) {
      var idx = this.references.length;

      var scanner = new Scanner(value);

      var token;

      function nextToken() {
        token = scanner.next();
        return token;
      }
      while (nextToken().kind !== typescriptServices.TypeScript.SyntaxKind.EndOfFileToken) {
        if (token.kind === typescriptServices.TypeScript.SyntaxKind.ImportKeyword) {
          nextToken();
          if (token.kind === typescriptServices.TypeScript.SyntaxKind.IdentifierName) {
            nextToken();
            if (token.kind === typescriptServices.TypeScript.SyntaxKind.EqualsToken) {
              nextToken();
              if (token.kind === typescriptServices.TypeScript.SyntaxKind.ModuleKeyword) {
                nextToken();
                if (token.kind === typescriptServices.TypeScript.SyntaxKind.OpenParenToken) {
                  nextToken();
                  if (token.kind === typescriptServices.TypeScript.SyntaxKind.StringLiteral) {
                    var moduleId = token.text;
                    var offset = token.offset;
                    var length = token.length;
                    nextToken();
                    if (token.kind === typescriptServices.TypeScript.SyntaxKind.CloseParenToken) {
                      this.references.push(new ImportReference(offset + 1, -2 + length, moduleId));
                    }
                  }
                }
              }
            }
          }
        } else if (token.kind === typescriptServices.TypeScript.SyntaxKind.SingleLineCommentTrivia) {
          var comment = token.text;

          var offset = token.offset;

          var length = token.length;

          var match = TripleSlashReference.REGEXP.exec(comment);
          if (match) {
            this.references.push(new TripleSlashReference(offset + match[1].length + match[2].length, match[3].length,
              match[3]));
          }
        }
      }
      return this.references.slice(idx);
    };
    return ScannerBasedCollector;
  }();
  exports.ScannerBasedCollector = ScannerBasedCollector;

  function collect(value) {
    return (new ScannerBasedCollector).consume(value);
  }
  exports.collect = collect;
});