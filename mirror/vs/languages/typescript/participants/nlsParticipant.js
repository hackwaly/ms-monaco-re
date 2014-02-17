"use strict";

var __extends = this.__extends || function(e, t) {
    function n() {
      this.constructor = e;
    }
    for (var r in t) {
      t.hasOwnProperty(r) && (e[r] = t[r]);
    }
    n.prototype = t.prototype;

    e.prototype = new n;
  };

define("vs/languages/typescript/participants/nlsParticipant", ["require", "exports",
  "vs/nls!vs/languages/typescript/participants/nlsParticipant", "vs/base/severity", "vs/base/strings",
  "vs/platform/markers/markers", "../lib/typescriptServices"
], function(e, t, n, r, i, o, s) {
  var a = function(e) {
    function t(t) {
      e.call(this);

      this._markers = t;
    }
    __extends(t, e);

    t.prototype.visitToken = function(i) {
      var a = this.position() + i.leadingTriviaWidth();

      var l = i.width();
      i.kind() === s.SyntaxKind.StringLiteral && i.text().charCodeAt(0) === t._DoubleQuote && this._markers.push(o.createTextMarker(
        r.Severity.Info, 0, n.localize("vs_languages_typescript_participants_nlsParticipant", 0), a, l));

      e.prototype.visitToken.call(this, i);
    };

    t.prototype.visitInvocationExpression = function(t) {
      if (t.expression.kind() !== s.SyntaxKind.MemberAccessExpression) {
        return e.prototype.visitInvocationExpression.call(this, t);
      }
      var n = t.expression;
      return n.expression.kind() === s.SyntaxKind.IdentifierName && i.equalsIgnoreCase(n.expression.text(), "nls") ?
        n.name.kind() !== s.SyntaxKind.IdentifierName || "localize" !== n.name.text() ? e.prototype.visitInvocationExpression
        .call(this, t) : (this.skip(t), void 0) : e.prototype.visitInvocationExpression.call(this, t);
    };

    t.prototype.visitMemberAccessExpression = function(t) {
      if (t.name.kind() !== s.SyntaxKind.IdentifierName || !i.equalsIgnoreCase("nls", t.name.text())) {
        return e.prototype.visitMemberAccessExpression.call(this, t);
      }
      if (t.expression.kind() !== s.SyntaxKind.InvocationExpression) {
        return e.prototype.visitMemberAccessExpression.call(this, t);
      }
      var n = t.expression;
      return n.kind() === s.SyntaxKind.IdentifierName && i.equalsIgnoreCase("localize", n.expression.fullText()) ? (
        this.skip(t), void 0) : e.prototype.visitMemberAccessExpression.call(this, t);
    };

    t._DoubleQuote = '"'.charCodeAt(0);

    return t;
  }(s.PositionTrackingWalker);

  var l = function() {
    function e() {
      this._markers = [];
    }
    e.prototype.validate = function(e, t, n) {
      var r = this;
      this._markers.length = 0;

      n.sourceUnit().accept(new a(this._markers));

      t.changeMarkers(e.getAssociatedResource(), function(e) {
        r._markers.forEach(function(t) {
          return e.addMarker(t);
        });
      });
    };

    e.ID = "vs.languages.typescript.nlsParticipant";

    return e;
  }();
  t.WorkerParticipant = l;
});