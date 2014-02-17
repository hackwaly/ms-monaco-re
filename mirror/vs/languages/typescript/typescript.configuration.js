define('vs/languages/typescript/typescript.configuration', [
  'require',
  'exports',
  'vs/base/objects',
  'vs/base/strings',
  'vs/base/severity'
], function(e, t, n, r, i) {
  function o(e, n) {
    return e instanceof a ? e : new a(e, n, t.defaultSuggestSettions);
  }

  function s(e, t) {
    return e instanceof a && (e = e.raw), t instanceof a && (t = t.raw), n.equals(e, t);
  }
  t.impilictAnyClassifier = function(e) {
    var t = /.*?(\d+):.*?/.exec(e.message());
    if (!t)
      return i.Severity.Error;
    var n = Number(t[1]);
    return isNaN(n) ? i.Severity.Error : n >= 7005 && 7015 >= n ? i.Severity.Warning : i.Severity.Error;
  }, t.defaultLintSettings = {
    emptyBlocksWithoutComment: 'ignore',
    curlyBracketsMustNotBeOmitted: 'ignore',
    comparisonOperatorsNotStrict: 'warning',
    missingSemicolon: 'warning',
    unknownTypeOfResults: 'warning',
    semicolonsInsteadOfBlocks: 'warning',
    functionsInsideLoops: 'warning',
    functionsWithoutReturnType: 'warning',
    tripleSlashReferenceAlike: 'warning',
    unusedImports: 'warning',
    unusedVariables: 'warning',
    unusedFunctions: 'warning',
    unusedMembers: 'warning'
  }, t.defaultValidationSettings = {
    codeGenTarget: 'ES5'
  }, t._internalDefaultValidationSettings = {
    scope: '/',
    noImplicitAny: !1,
    noLib: !1,
    extraLibs: ['vs/text!vs/languages/typescript/lib/lib.d.ts'],
    semanticValidation: !0,
    syntaxValidation: !0,
    codeGenTarget: 'ES5',
    moduleGenTarget: '',
    diagnosticClassifier: t.impilictAnyClassifier
  }, t.defaultSuggestSettions = {
    alwaysAllWords: !1,
    useCodeSnippetsOnMethodSuggest: !1
  };
  var a = function() {
    function e(e, t, i) {
      if (this._raw = e, this._raw) {
        if (this._raw.validationSettings) {
          Array.isArray(this._raw.validationSettings) || (this._raw.validationSettings = [this._raw.validationSettings]);
          var o = this._raw.validationSettings;
          if (0 === o.length)
            this._raw.validationSettings = [t];
          else {
            for (var s = !1, a = t, l = 0, c = o.length; c > l; l++) {
              var u = n.withDefaults(this._raw.validationSettings[l], a);
              u.scope = u.scope.replace(/\\/g, '/'), s = s || '/' === u.scope, r.startsWith(u.scope, '/') || (u.scope =
                '/' + u.scope), -1 === u.extraLibs.indexOf('vs/text!vs/languages/typescript/lib/lib.d.ts') && u.extraLibs
                .unshift('vs/text!vs/languages/typescript/lib/lib.d.ts'), this._raw.validationSettings[l] = u, a = u;
            }
            s || this._raw.validationSettings.unshift(t);
          }
        } else
          this._raw.validationSettings = [t];
        this._raw.suggestSettings = this._raw.suggestSettings ? n.withDefaults(this._raw.suggestSettings, i) : i;
      } else
        this._raw = {
          validationSettings: [t],
          suggestSettings: i
        };
    }
    return Object.defineProperty(e.prototype, 'raw', {
      get: function() {
        return this._raw;
      },
      enumerable: !0,
      configurable: !0
    }), Object.defineProperty(e.prototype, 'validationSettings', {
      get: function() {
        return this._raw.validationSettings.slice(0);
      },
      enumerable: !0,
      configurable: !0
    }), Object.defineProperty(e.prototype, 'suggestSettings', {
      get: function() {
        return n.clone(this._raw.suggestSettings);
      },
      enumerable: !0,
      configurable: !0
    }), Object.defineProperty(e.prototype, 'allowMultipleWorkers', {
      get: function() {
        return this._raw.allowMultipleWorkers;
      },
      enumerable: !0,
      configurable: !0
    }), e;
  }();
  t.sanitize = o, t.equal = s;
})