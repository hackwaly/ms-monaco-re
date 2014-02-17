define("vs/languages/typescript/service/languageServiceAdapter", ["require", "exports", "vs/base/collections",
  "vs/languages/typescript/lint/lint", "vs/base/paths", "vs/base/strings", "vs/base/severity", "vs/base/filters",
  "vs/editor/core/model/mirrorModel", "vs/languages/typescript/service/textEdit",
  "vs/languages/typescript/lib/typescriptServices", "vs/languages/typescript/resources/remoteModels",
  "vs/languages/lib/javascriptSnippets", "vs/languages/typescript/service/typescriptSnippets", "./outline",
  "./references"
], function(e, t, n, r, i, o, s, a, l, c, u, p, h, d, m, f) {
  var g = function() {
    function e(e, t, n, r) {
      this._compilationSettings = e;

      this._suggestSettings = t;

      this._host = n;

      this._languageService = r;

      this._applyTypeScriptCompilationSettings();
    }
    e.prototype._applyTypeScriptCompilationSettings = function() {
      var e = this._host.getCompilationSettings();
      e.useCaseSensitiveFileResolution = !1;

      e.noImplicitAny = this._compilationSettings.noImplicitAny;

      e.codeGenTarget = o.equalsIgnoreCase("ES3", this._compilationSettings.codeGenTarget) ? 0 : 1;

      e.moduleGenTarget = o.equalsIgnoreCase("commonjs", this._compilationSettings.moduleGenTarget) ? 1 : o.equalsIgnoreCase(
        "amd", this._compilationSettings.moduleGenTarget) ? 2 : 0;
    };

    Object.defineProperty(e.prototype, "languageService", {
      get: function() {
        return this._languageService;
      },
      enumerable: !0,
      configurable: !0
    });

    e.prototype.getExtraDiagnostics = function(e) {
      if (!this._compilationSettings.semanticValidation) {
        return [];
      }
      var t = r.check(this._compilationSettings.lint, this._languageService, e);
      return t.map(function(e) {
        return {
          code: 0,
          type: "",
          severity: e.severity,
          range: e.range,
          text: e.message
        };
      });
    };

    e.prototype.getSyntacticDiagnostics = function(e) {
      if (!this._compilationSettings.syntaxValidation) {
        return [];
      }
      var t = this._languageService.getSyntacticDiagnostics(e.toExternal());
      return this._toMarkers(e, t);
    };

    e.prototype.getSemanticDiagnostics = function(e) {
      if (!this._compilationSettings.semanticValidation) {
        return [];
      }
      var t = this._languageService.getSemanticDiagnostics(e.toExternal());
      return this._toMarkers(e, t);
    };

    e.prototype._toMarkers = function(e, t) {
      for (var n = [], r = 0; r < t.length; r++) {
        var i = t[r];

        var o = s.Severity.Error;
        this._compilationSettings.diagnosticClassifier && (o = this._compilationSettings.diagnosticClassifier(i));

        o && n.push({
          type: "",
          code: -1,
          text: i.text(),
          severity: o,
          range: this.rangeFromMinAndLim({
            minChar: i.start(),
            limChar: i.start() + i.length()
          }, e)
        });
      }
      return n;
    };

    e.prototype.format = function(e, t, n) {
      var r = this._host.getScriptSnapshotByUrl(e).model;

      var i = r.getAssociatedResource().toExternal();

      var o = r.getOffsetFromPosition({
        lineNumber: t.startLineNumber,
        column: t.startColumn
      });

      var s = r.getOffsetFromPosition({
        lineNumber: t.endLineNumber,
        column: t.endColumn
      });

      var a = this._languageService.getFormattingEditsForRange(i, o, s, this.createFormatOptions(n));

      var l = this.applyTextEdits(a, r, o, s);
      return l.text;
    };

    e.prototype.formatAfterKeystroke = function(e, t, n) {
      var r = this._host.getScriptSnapshotByUrl(e).model;

      var i = r.getAssociatedResource().toExternal();

      var o = r.getOffsetFromPosition(t);

      var s = r.getOffsetFromPosition({
        lineNumber: t.lineNumber,
        column: 1
      });

      var a = r.getLineContent(t.lineNumber).length;

      var l = r.getValueInRange({
        startColumn: t.column,
        endColumn: t.column + 1,
        startLineNumber: t.lineNumber,
        endLineNumber: t.lineNumber
      });

      var c = this._languageService.getFormattingEditsAfterKeystroke(i, 1 + o, l, this.createFormatOptions(n));

      var u = this.applyTextEdits(c, r, s, s + a);
      return u;
    };

    e.prototype.createFormatOptions = function(e) {
      var t = new u.Services.FormatCodeOptions;
      t.ConvertTabsToSpaces = e.insertSpaces;

      t.TabSize = e.tabSize;

      t.IndentSize = e.tabSize;

      t.InsertSpaceAfterCommaDelimiter = !0;

      t.InsertSpaceBeforeAndAfterBinaryOperators = !0;

      t.InsertSpaceAfterSemicolonInForStatements = !0;

      return t;
    };

    e.prototype.applyTextEdits = function(e, t, n, r) {
      for (var i, o = c.create(t), s = 0; s < e.length; s++) {
        o.replace(e[s].minChar, e[s].limChar - e[s].minChar, e[s].text);
        n = Math.min(n, e[s].minChar);
        r = Math.max(r, e[s].limChar);
      }
      i = o.apply();

      i = i.substring(n, r + (i.length - t.getValue().length));

      return {
        text: i,
        range: this.rangeFromMinAndLim({
          minChar: n,
          limChar: r
        }, t.getAssociatedResource())
      };
    };

    e.prototype.getActionsAtPosition = function(e, t) {
      var n = this._host.getScriptSnapshotByUrl(e).model;

      var r = n.getAssociatedResource().toExternal();

      var i = n.getOffsetFromPosition(t);

      var o = [];

      var s = this._languageService.getSyntaxTree(r);

      var a = s.sourceUnit().findToken(i);
      return a.kind() !== u.SyntaxKind.IdentifierName ? o : (o.push("editor.actions.changeAll"), o.push(
        "editor.actions.rename"), o.push("editor.actions.referenceSearch.trigger"), o.push(
        "editor.actions.previewDeclaration"), o.push("editor.actions.goToDeclaration"), o);
    };

    e.prototype.getOutline = function(e) {
      var t = this;

      var n = this._host.getScriptSnapshotByUrl(e).model;

      var r = n.getAssociatedResource().toExternal();

      var i = this._languageService.getSyntaxTree(r);
      return m.forSourceUnit(i.sourceUnit(), function(n, r) {
        return t.rangeFromMinAndLim({
          minChar: n,
          limChar: n + r
        }, e);
      });
    };

    e.prototype.getNavigateToItems = function(t) {
      for (var n, r = this._host.getScriptFileNames(), i = [], o = 0; o < r.length; o++) {
        n = this._languageService.getScriptLexicalStructure(r[o]);
        for (var s = 0; s < n.length; s++) {
          var a = n[s];

          var l = e.FILTER(t, n[s].name);
          if (l) {
            var c = this._host.getScriptSnapshot(a.fileName).model;
            c && !this.isBaseLibModel(c) && i.push({
              containerName: a.containerName,
              name: a.name,
              type: a.kind,
              matchKind: a.matchKind,
              resourceUrl: c.getAssociatedResource().toExternal(),
              range: this.rangeFromMinAndLim(a, c.getAssociatedResource())
            });
          }
        }
      }
      return i;
    };

    e.prototype.findOccurrences = function(e, t) {
      var n = this;

      var r = this._host.getScriptSnapshotByUrl(e).model;

      var i = r.getAssociatedResource().toExternal();

      var o = r.getOffsetFromPosition(t);

      var s = this._languageService.getOccurrencesAtPosition(i, o);

      var a = s.map(function(t) {
        return {
          kind: t.isWriteAccess ? "write" : null,
          range: n.rangeFromMinAndLim(t, e)
        };
      });
      return a;
    };

    e.prototype.findDeclaration = function(e, t) {
      var n = this._host.getScriptSnapshotByUrl(e).model;

      var r = n.getAssociatedResource().toExternal();

      var i = n.getOffsetFromPosition(t);

      var o = this._languageService.getDefinitionAtPosition(r, i);
      if (!o || 0 === o.length) {
        return null;
      }
      var s = o[0];
      if (!s.fileName) {
        return null;
      }
      var a = this._host.getScriptSnapshot(s.fileName).model;
      if (this.isBaseLibModel(a)) {
        return null;
      }
      var l = {
        resourceUrl: a.getAssociatedResource().toExternal(),
        range: this.rangeFromMinAndLim(s, a.getAssociatedResource(), !0),
        preview: this.preview(a, s.minChar, s.limChar)
      };
      return l;
    };

    e.prototype.findTypeDeclaration = function() {
      return null;
    };

    e.prototype.isExternallyVisibleSymbole = function(e, t) {
      var n = this._host.getScriptSnapshotByUrl(e).model;

      var r = n.getOffsetFromPosition(t);

      var i = n.getAssociatedResource().toExternal();

      var o = this._languageService.getTypeAtPosition(i, r);
      if (!o) {
        return !0;
      }
      switch (o.kind) {
        case u.Services.ScriptElementKind.localVariableElement:
        case u.Services.ScriptElementKind.localFunctionElement:
        case u.Services.ScriptElementKind.parameterElement:
          return !1;
      }
      return !0;
    };

    e.prototype.findReferences = function(e, t) {
      var n = this;

      var r = this._host.getScriptSnapshotByUrl(e).model;

      var i = r.getOffsetFromPosition(t);

      var o = r.getAssociatedResource().toExternal();

      var s = this._languageService.getReferencesAtPosition(o, i);

      var a = s.filter(function(e) {
        return !n.isBaseLibModel(n._host.getScriptSnapshot(e.fileName).model);
      }).map(function(e) {
        var t = n._host.getScriptSnapshot(e.fileName).model;

        var r = {
          resourceUrl: t.getAssociatedResource().toExternal(),
          range: n.rangeFromMinAndLim(e, t.getAssociatedResource()),
          preview: n.preview(t, e.minChar, e.limChar)
        };
        return r;
      });
      return a;
    };

    e.prototype.getTypeInformationAtPosition = function(e, t) {
      var n = this._host.getScriptSnapshotByUrl(e).model;

      var r = n.getOffsetFromPosition(t);

      var i = n.getAssociatedResource().toExternal();

      var o = this._languageService.getTypeAtPosition(i, r);
      if (!o) {
        return null;
      }
      var s = [{
        className: "type",
        text: o.memberName.toString()
      }, {
        className: "documentation",
        text: o.docComment
      }];

      var a = {
        value: "",
        htmlContent: s,
        className: "typeInfo ts",
        range: this.rangeFromMinAndLim(o, e)
      };
      return a;
    };

    e.prototype.getRangesToPosition = function(e, t) {
      for (var n = this._host.getScriptSnapshotByUrl(e).model, r = n.getOffsetFromPosition(t), i = n.getAssociatedResource()
          .toExternal(), o = this._languageService.getSyntaxTree(i), s = o.sourceUnit().findToken(r), a = []; null !==
        s;) {
        a.unshift({
          type: "node",
          range: this.rangeFromMinAndLim({
            minChar: s.start(),
            limChar: s.end()
          }, e)
        });
        s = s.parent();
      }
      return a;
    };

    e.prototype.suggest = function(e, t) {
      var r = this._host.getScriptSnapshotByUrl(e).model;

      var i = e.toExternal();

      var o = r.getWordUntilPosition(t);

      var s = r.getOffsetFromPosition(t);

      var a = s - o.length;

      var l = "." === r.getValue().charAt(a - 1);

      var c = this._languageService.getCompletionsAtPosition(i, a, l);

      var u = new n.DelegateHashSet(function(e) {
        return e.type + e.label + e.codeSnippet;
      });
      if (c) {
        l = c.isMemberCompletion;
        for (var p = 0, m = c.entries.length; m > p; p++) {
          var f = c.entries[p];
          u.add({
            label: f.name,
            codeSnippet: f.name,
            type: this.monacoTypeFromEntryKind(f.kind)
          });
        }
      }
      var g = !l;

      var v = this._suggestSettings.alwaysAllWords || !c || 0 === c.entries.length;
      if (g) {
        for (var p = 0, m = h.snippets.length; m > p; p++) {
          u.add(h.snippets[p]);
        }
        for (var p = 0, m = d.snippets.length; m > p; p++) {
          u.add(d.snippets[p]);
        }
      }
      v && r.getAllUniqueWords(o).filter(function(e) {
        return !/^-?\d*\.?\d/.test(e);
      }).forEach(function(e) {
        var t = {
          type: "text",
          label: e,
          codeSnippet: e
        };
        u.add(t);
      });

      return u.toArray();
    };

    e.prototype.monacoTypeFromEntryKind = function(e) {
      switch (e) {
        case u.Services.ScriptElementKind.primitiveType:
        case u.Services.ScriptElementKind.keyword:
          return "keyword";
        case u.Services.ScriptElementKind.variableElement:
        case u.Services.ScriptElementKind.localVariableElement:
        case u.Services.ScriptElementKind.memberVariableElement:
        case u.Services.ScriptElementKind.memberGetAccessorElement:
        case u.Services.ScriptElementKind.memberSetAccessorElement:
          return "field";
        case u.Services.ScriptElementKind.functionElement:
        case u.Services.ScriptElementKind.memberFunctionElement:
        case u.Services.ScriptElementKind.constructSignatureElement:
        case u.Services.ScriptElementKind.callSignatureElement:
          return "function";
      }
      return e;
    };

    e.prototype.getSuggestionDetails = function(e, t, n) {
      var r = this._host.getScriptSnapshotByUrl(e).model;

      var i = e.toExternal();

      var o = r.getOffsetFromPosition(t);

      var s = this._languageService.getCompletionEntryDetails(i, o, n.label);
      if (!s) {
        return n;
      }
      if (n.documentationLabel = s.docComment, n.typeLabel = s.type, n.codeSnippet = s.name, this._suggestSettings.useCodeSnippetsOnMethodSuggest &&
        "function" === this.monacoTypeFromEntryKind(s.kind)) {
        var a = this.parseMethodSignature(s.type);

        var l = a.arguments.map(function(e) {
          return "{{" + e.name.trim() + "}}";
        });

        var c = s.name;
        c += l.length > 0 ? "(" + l.join(", ") + "){{}}" : "()";

        n.codeSnippet = c;
      }
      return n;
    };

    e.prototype.quickFix = function(e, t) {
      var n = this._host.getScriptSnapshotByUrl(e).model;

      var r = n.getAssociatedResource().toExternal();

      var i = n.getOffsetFromPosition(t);

      var s = n.getWordUntilPosition(t);

      var a = i - s.length;

      var l = "." === n.getValue().charAt(a - 1);

      var c = this._languageService.getCompletionsAtPosition(r, a, l);

      var u = [];
      c.entries.forEach(function(e) {
        var t = o.difference(s, e.name);
        t < s.length / 2 || u.push({
          type: "field",
          label: e.name,
          codeSnippet: e.name,
          score: t
        });
      });

      u.sort(function(e, t) {
        return t.score - e.score;
      });

      return u.slice(0, 3);
    };

    e.prototype.parseMethodSignature = function(e) {
      var t;

      var n;

      var r;

      var i = [];

      var o = "";

      var s = "";

      var a = !0;

      var l = 1;
      for (t = 1, n = e.length; n > t; t++)
        if (r = e.charAt(t), ")" === r && l--, "(" === r && l++, 1 !== l || ":" !== r)
          if (1 !== l || "," !== r) {
            if (0 === l && ")" === r) {
              "" !== o && i.push({
                name: o,
                type: s
              });
              break;
            }
            a ? o += r : s += r;
          } else {
            i.push({
              name: o,
              type: s
            });
            o = "";
            s = "";
            a = !0;
          } else {
            a = !1;
          }
      return {
        arguments: i,
        flatArguments: e.substr(0, t + 1),
        flatReturnType: e.substr(t + 5)
      };
    };

    e.transformParameter = function(e) {
      return {
        label: e.name,
        documentation: e.docComment,
        signatureLabelOffset: e.minChar,
        signatureLabelEnd: e.limChar
      };
    };

    e.transformSignature = function(t) {
      return {
        label: t.signatureInfo,
        documentation: t.docComment,
        parameters: t.parameters.map(function(t) {
          return e.transformParameter(t);
        })
      };
    };

    e.prototype.getParameterHints = function(t, n) {
      var r = this._host.getScriptSnapshotByUrl(t).model;

      var i = r.getOffsetFromPosition(n);

      var o = r.getAssociatedResource().toExternal();

      var s = this._languageService.getSignatureAtPosition(o, i);
      if (!s) {
        return null;
      }
      var a = {
        currentSignature: Math.max(0, s.activeFormal),
        currentParameter: Math.max(0, s.actual.currentParameter),
        signatures: s.formal.map(function(t) {
          return e.transformSignature(t);
        })
      };
      return a;
    };

    e.prototype.getEmitOutput = function(e, t) {
      var n = this._languageService.getEmitOutput(e.toExternal());

      var r = n.outputFiles;
      if (!r) {
        return null;
      }
      for (var i = 0, s = r.length; s > i; i++)
        if (o.endsWith(r[i].name, t)) {
          return r[i].text;
        }
      return null;
    };

    e.prototype.findModuleReferences = function(e) {
      var t = this;

      var n = new Array;

      var r = this._host.getScriptSnapshot(e.toExternal()).model;
      f.collect(r.getValue()).forEach(function(o) {
        o instanceof f.ImportReference ? o.isRelative ? n.push({
          openInEditor: !0,
          range: r.getRangeFromOffsetAndLength(o.offset, o.length),
          url: i.join(i.dirname(e.toExternal()), o.path + ".ts")
        }) : n.push({
          openInEditor: !0,
          range: r.getRangeFromOffsetAndLength(o.offset, o.length),
          url: i.join(t._compilationSettings.scope, o.path + ".ts")
        }) : o instanceof f.TripleSlashReference && n.push({
          openInEditor: !0,
          range: r.getRangeFromOffsetAndLength(o.offset, o.length),
          url: i.join(i.dirname(e.toExternal()), o.path)
        });
      });

      return n;
    };

    e.prototype.isBaseLibModel = function(e) {
      return e instanceof p.DefaultLibModel;
    };

    e.prototype.rangeFromMinAndLim = function(e, t, n) {
      "undefined" == typeof n && (n = !1);
      var r = this._host.getScriptSnapshotByUrl(t).model;

      var i = e.minChar;

      var o = Math.max(1, e.limChar - e.minChar);
      if (n) {
        var s = r.getPositionFromOffset(i);
        return {
          startLineNumber: s.lineNumber,
          startColumn: s.column,
          endLineNumber: s.lineNumber,
          endColumn: s.column
        };
      }
      return r.getRangeFromOffsetAndLength(i, o);
    };

    e.prototype.preview = function(e, t, n, r) {
      "undefined" == typeof r && (r = 200);
      for (var i, o = this._languageService.getSyntaxTree(e.getAssociatedResource().toExternal()), s = o.sourceUnit()
          .findToken(t); s && !i;) {
        s.fullWidth() > r && (i = s);
        s = s.parent();
      }
      i || (i = o.sourceUnit().findToken(t).root());
      var a = e.getValue().substring(i.fullStart(), i.fullEnd());

      var c = new l.MirrorModel(0, a);

      var u = t - i.fullStart();

      var p = n - t;

      var h = c.getRangeFromOffsetAndLength(u, p);
      c.dispose();

      return {
        text: a,
        range: h
      };
    };

    e.FILTER = a.or(a.matchesPrefix, a.matchesContiguousSubString, a.matchesCamelCase);

    return e;
  }();
  t.LanguageServiceAdapter = g;
});