define("vs/languages/typescript/service/outline", ["require", "exports", "vs/base/strings", "vs/base/arrays",
  "vs/languages/typescript/lib/typescriptServices"
], function(e, t, n, r, i) {
  function o(e) {
    switch (e) {
      case 1:
        return "function";
      case 3:
        return "variable";
      case 8:
        return "enum";
      case 6:
        return "module";
      case 5:
        return "interface";
      case 4:
        return "class";
      case 2:
        return "constructor";
      case 7:
        return "property";
      case 0:
        return "method";
    }
    return "property";
  }

  function s(e, t) {
    var n = {
      type: null,
      label: null,
      range: null,
      children: null
    };
    e.accept(new a(n, t));

    return n.children;
  }! function(e) {
    e[e.Method = 0] = "Method";

    e[e.Function = 1] = "Function";

    e[e.Constructor = 2] = "Constructor";

    e[e.Variable = 3] = "Variable";

    e[e.Class = 4] = "Class";

    e[e.Interface = 5] = "Interface";

    e[e.Module = 6] = "Module";

    e[e.Property = 7] = "Property";

    e[e.Enum = 8] = "Enum";

    e[e.Rule = 9] = "Rule";

    e[e.File = 10] = "File";
  }(t.Type || (t.Type = {}));
  var a = (t.Type, function(e) {
    function t(t, n) {
      e.call(this);

      this.currentParent = t;

      this.range = n;

      this._parentStack = [];
    }
    __extends(t, e);

    t.prototype.add = function(e, t, n) {
      var r = {
        label: n,
        type: o(e),
        range: this.range(this.position() + t.leadingTriviaWidth(), t.width())
      };
      this.currentParent.children ? this.currentParent.children.push(r) : this.currentParent.children = [r];

      return r;
    };

    t.prototype.parent = function(e, t, n, r) {
      var i = this.currentParent;
      this.currentParent = this.add(e, t, n);
      try {
        r();
      } finally {
        this.currentParent = i;
      }
    };

    t.prototype.visitNode = function(t) {
      this._parentStack.push(t);

      e.prototype.visitNode.call(this, t);

      this._parentStack.pop();
    };

    t.prototype._callSignatureText = function(e) {
      return e.callSignature ? e.callSignature.parameterList ? e.callSignature.parameterList.fullText() : n.empty :
        n.empty;
    };

    t.prototype.visitClassDeclaration = function(t) {
      var n = this;
      this.parent(4, t, t.identifier.valueText(), function() {
        e.prototype.visitClassDeclaration.call(n, t);
      });
    };

    t.prototype.visitInterfaceDeclaration = function(t) {
      var n = this;
      this.parent(5, t, t.identifier.valueText(), function() {
        e.prototype.visitInterfaceDeclaration.call(n, t);
      });
    };

    t.prototype.visitMemberFunctionDeclaration = function(t) {
      this.add(0, t, n.format("{0}{1}", t.propertyName.valueText(), this._callSignatureText(t)));

      e.prototype.skip.call(this, t);
    };

    t.prototype.visitMemberVariableDeclaration = function(t) {
      this.add(7, t, t.variableDeclarator.propertyName.valueText());

      e.prototype.skip.call(this, t);
    };

    t.prototype.visitGetAccessor = function(t) {
      this.add(7, t, t.propertyName.valueText());

      e.prototype.skip.call(this, t);
    };

    t.prototype.visitSetAccessor = function(t) {
      this.add(7, t, t.propertyName.valueText());

      e.prototype.skip.call(this, t);
    };

    t.prototype.visitEnumDeclaration = function(t) {
      var n = this;
      this.parent(8, t, t.identifier.valueText(), function() {
        e.prototype.visitEnumDeclaration.call(n, t);
      });
    };

    t.prototype.visitEnumElement = function(t) {
      this.add(7, t, t.propertyName.valueText());

      e.prototype.skip.call(this, t);
    };

    t.prototype.visitModuleDeclaration = function(t) {
      var n;
      t.stringLiteral ? n = t.stringLiteral.valueText() : t.name && (n = t.name.fullText());

      n && this.add(6, t, n);

      e.prototype.visitModuleDeclaration.call(this, t);
    };

    t.prototype.visitFunctionExpression = function(n) {
      if (n.identifier && this.add(1, n, n.identifier.valueText()), r.tail(this._parentStack, 1) instanceof i.ArgumentListSyntax &&
        r.tail(this._parentStack, 2) instanceof i.InvocationExpressionSyntax) {
        var o = r.tail(this._parentStack, 2);

        var s = o.expression;
        if (s.kind() === i.SyntaxKind.IdentifierName && s.valueText() === t._define) {
          return e.prototype.visitFunctionExpression.call(this, n);
        }
      }
      e.prototype.skip.call(this, n);
    };

    t.prototype.visitFunctionDeclaration = function(t) {
      this.add(1, t, n.format("{0}{1}", t.identifier.valueText(), this._callSignatureText(t)));

      e.prototype.skip.call(this, t);
    };

    t.prototype.visitVariableDeclarator = function(t) {
      this.add(3, t, t.propertyName.valueText());

      e.prototype.skip.call(this, t);
    };

    t.prototype.visitBinaryExpression = function(t) {
      t.operatorToken.kind() === i.SyntaxKind.EqualsToken && t.right.kind() === i.SyntaxKind.FunctionExpression &&
        t.left.kind() === i.SyntaxKind.MemberAccessExpression && this.add(7, t.left, t.left.name.valueText());

      e.prototype.skip.call(this, t);
    };

    t._define = "define";

    return t;
  }(i.PositionTrackingWalker));
  t.forSourceUnit = s;
});