define("vs/languages/javascript/javascript.configuration", ["require", "exports", "vs/base/severity",
  "vs/base/collections"
], function(e, t, n, i) {
  var o = function() {
    function e(e) {
      this._lintSettings = e;

      this._severities = {};

      this._severities[2011] = n.fromValue(e.forcedTypeConversion);

      this._severities[2111] = this._severities[2112] = this._severities[2113] = this._severities[2114] = n.fromValue(
        e.mixedTypesArithmetics);

      this._severities[2121] = this._severities[2120] = n.fromValue(e.primitivesInInstanceOf);

      this._severities[2094] = n.fromValue(e.unknownProperty);

      this._severities[2095] = n.fromValue(e.undeclaredVariables);

      this._severities[2134] = n.fromValue(e.redeclaredVariables);

      this._severities[2084] = n.fromValue(e.newOnReturningFunctions);
    }
    e.prototype.classify = function(e) {
      var t = /.*?(\d+):.*?/.exec(e.message());
      if (!t) {
        return n.Severity.Error;
      }
      var o = Number(t[1]);
      return isNaN(o) ? n.Severity.Error : 2e3 > o ? n.Severity.Error : 2094 === o && 0 !== i.lookup(this._severities,
        o) && /The property '[\w\d_]+' does not exist on value of type 'any'\./.test(e.text()) ? 0 : i.lookup(this._severities,
        o, 0);
    };

    return e;
  }();
  t.JavaScriptDiagnosticsClassifier = o;

  t.defaultLintSettings = {
    curlyBracketsMustNotBeOmitted: "ignore",
    emptyBlocksWithoutComment: "ignore",
    comparisonOperatorsNotStrict: "warning",
    missingSemicolon: "warning",
    reservedKeywords: "warning",
    typeScriptSpecifics: "warning",
    unknownTypeOfResults: "warning",
    semicolonsInsteadOfBlocks: "warning",
    functionsInsideLoops: "warning",
    tripleSlashReferenceAlike: "warning",
    unusedVariables: "warning",
    unusedFunctions: "warning",
    newOnLowercaseFunctions: "warning",
    newOnReturningFunctions: "warning",
    redeclaredVariables: "warning",
    undeclaredVariables: "error",
    unknownProperty: "ignore",
    primitivesInInstanceOf: "error",
    mixedTypesArithmetics: "warning",
    forcedTypeConversion: "warning"
  };

  t._internalDefaultValidationSettings = {
    scope: "/",
    noImplicitAny: !1,
    noLib: !1,
    extraLibs: ["vs/text!vs/languages/typescript/lib/lib.d.ts"],
    semanticValidation: !0,
    syntaxValidation: !0,
    codeGenTarget: "ES5",
    moduleGenTarget: "",
    lint: t.defaultLintSettings
  };

  t.defaultValidationSettings = {
    codeGenTarget: "ES5",
    lint: t.defaultLintSettings
  };

  t.defaultSuggestSettions = {
    alwaysAllWords: !1,
    useCodeSnippetsOnMethodSuggest: !1
  };
});