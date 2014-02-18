define(["require", "exports", "vs/base/network", "vs/base/strings", "vs/platform/markers/markers", "vs/base/filters",
  "vs/editor/core/model/mirrorModel", "vs/languages/typescript/service/textEdit",
  "vs/languages/typescript/lib/typescriptServices", "vs/languages/typescript/resources/remoteModels",
  "vs/languages/lib/javascriptSnippets", "vs/languages/typescript/service/typescriptSnippets"
], function(require, exports, __Network__, __strings__, __markers__, __filters__, __MirrorModel__, __textEdit__,
  __TypeScriptServices__, __remoteModels__, __JavaScriptSnippets__, __TypeScriptSnippets__) {
  var Network = __Network__;
  var strings = __strings__;
  var markers = __markers__;
  var filters = __filters__;
  var MirrorModel = __MirrorModel__;
  var textEdit = __textEdit__;
  var TypeScriptServices = __TypeScriptServices__;
  var remoteModels = __remoteModels__;
  var JavaScriptSnippets = __JavaScriptSnippets__;
  var TypeScriptSnippets = __TypeScriptSnippets__;
  var LanguageServiceAdapter = function() {
    function LanguageServiceAdapter(host, languageService, resourceService) {
      this.host = host;
      this.resourceService = resourceService;
      this.setLanguageService(languageService);
      this.setSuggestConfiguration({});
    }
    LanguageServiceAdapter.prototype.setLanguageService = function(languageService) {
      this.languageService = languageService;
    };
    LanguageServiceAdapter.prototype.getLanguageSerivce = function() {
      return this.languageService;
    };
    LanguageServiceAdapter.prototype.setSuggestConfiguration = function(options) {
      this.suggestConfiguration = options;
    };
    LanguageServiceAdapter.prototype.getSyntacticDiagnostics = function(resources) {
      var result = [];
      var diagnostics = this.languageService.getSyntacticDiagnostics(resources.toExternal());
      LanguageServiceAdapter.appendMarkersFromDiagnostics(result, diagnostics);
      return result;
    };
    LanguageServiceAdapter.prototype.getSemanticDiagnostics = function(resources) {
      var result = [];
      var diagnostics = this.languageService.getSemanticDiagnostics(resources.toExternal());
      LanguageServiceAdapter.appendMarkersFromDiagnostics(result, diagnostics);
      return result;
    };
    LanguageServiceAdapter.appendMarkersFromDiagnostics = function(markerList, diagnostics) {
      for (var i = 0; i < diagnostics.length; i++) {
        var diag = diagnostics[i];
        markerList.push({
          type: "",
          code: -1,
          text: diag.text(),
          severity: markers.Severity.Error,
          offset: diag.start(),
          length: diag.length()
        });
      }
    };
    LanguageServiceAdapter.prototype.format = function(resource, range, options) {
      var model = this.resourceService.get(resource);

      var filename = model.getAssociatedResource().toExternal();

      var minChar = model.getOffsetFromPosition({
        lineNumber: range.startLineNumber,
        column: range.startColumn
      });

      var limChar = model.getOffsetFromPosition({
        lineNumber: range.endLineNumber,
        column: range.endColumn
      });
      var edits = this.languageService.getFormattingEditsForRange(filename, minChar, limChar, this.createFormatOptions(
        options));
      var result = this.applyTextEdits(edits, model, minChar, limChar);
      return result.text;
    };
    LanguageServiceAdapter.prototype.formatAfterKeystroke = function(resource, position, options) {
      var model = this.resourceService.get(resource);

      var filename = model.getAssociatedResource().toExternal();

      var offset = model.getOffsetFromPosition(position);

      var lineOffset = model.getOffsetFromPosition({
        lineNumber: position.lineNumber,
        column: 1
      });

      var lineLen = model.getLineContent(position.lineNumber).length;

      var ch = model.getValueInRange({
        startColumn: position.column,
        endColumn: position.column + 1,
        startLineNumber: position.lineNumber,
        endLineNumber: position.lineNumber
      });
      var edits = this.languageService.getFormattingEditsAfterKeystroke(filename, 1 + offset, ch, this.createFormatOptions(
        options));
      var result = this.applyTextEdits(edits, model, lineOffset, lineOffset + lineLen);
      return result;
    };
    LanguageServiceAdapter.prototype.createFormatOptions = function(options) {
      var formatOptions = new TypeScriptServices.Services.FormatCodeOptions;
      formatOptions.ConvertTabsToSpaces = options.insertSpaces;
      formatOptions.TabSize = options.tabSize;
      formatOptions.IndentSize = options.tabSize;
      formatOptions.InsertSpaceAfterCommaDelimiter = true;
      formatOptions.InsertSpaceBeforeAndAfterBinaryOperators = true;
      formatOptions.InsertSpaceAfterSemicolonInForStatements = true;
      return formatOptions;
    };
    LanguageServiceAdapter.prototype.applyTextEdits = function(edits, model, min, lim) {
      var edit = textEdit.create(model);

      var result;
      for (var i = 0; i < edits.length; i++) {
        edit.replace(edits[i].minChar, edits[i].limChar - edits[i].minChar, edits[i].text);
        min = Math.min(min, edits[i].minChar);
        lim = Math.max(lim, edits[i].limChar);
      }
      result = edit.apply();
      result = result.substring(min, lim + (result.length - model.getValue().length));
      return {
        text: result,
        range: this.rangeFromMinAndLim({
          minChar: min,
          limChar: lim
        }, model)
      };
    };
    LanguageServiceAdapter.prototype.getActionsAtPosition = function(resource, position) {
      var model = this.resourceService.get(resource);

      var filename = model.getAssociatedResource().toExternal();

      var offset = model.getOffsetFromPosition(position);

      var result = [];
      var tree = this.languageService.getSyntaxTree(filename);

      var token = tree.sourceUnit().findToken(offset);
      if (token.kind() === TypeScriptServices.TypeScript.SyntaxKind.IdentifierName) {
        result.push("editor.actions.rename");
        result.push("editor.actions.referenceSearch.trigger");
        result.push("editor.actions.previewDeclaration");
        result.push("editor.actions.goToDeclaration");
      }
      return result;
    };
    LanguageServiceAdapter.prototype.getOutline = function(resource) {
      var _this = this;
      var model = this.resourceService.get(resource);

      var filename = model.getAssociatedResource().toExternal();

      var items = this.languageService.getScriptLexicalStructure(filename);
      var roots = [];
      var parentPath = [];
      items.filter(function(item) {
        switch (item.kind) {
          case TypeScriptServices.Services.ScriptElementKind.moduleElement:
          case TypeScriptServices.Services.ScriptElementKind.scriptElement:
            return false;
        }
        return true;
      }).sort(function(left, right) {
        return left.minChar - right.minChar;
      }).map(function(item) {
        var node = {
          label: item.name,
          type: item.kind,
          range: _this.rangeFromMinAndLim(item, model),
          children: []
        };
        return node;
      }).forEach(function(node) {
        while (true) {
          var parent = parentPath[parentPath.length - 1];
          if (!parent) {
            parentPath.push(node);
            roots.push(node);
            break;
          } else if (_this.isSubRange(parent.range, node.range)) {
            parent.children.push(node);
            parentPath.push(node);
            break;
          } else {
            parentPath.pop();
          }
        }
      });
      return roots;
    };
    LanguageServiceAdapter.prototype.getNavigateToItems = function(search) {
      var fileNames = this.host.getScriptFileNames();

      var items;

      var types = [];
      for (var i = 0; i < fileNames.length; i++) {
        items = this.languageService.getScriptLexicalStructure(fileNames[i]);
        for (var j = 0; j < items.length; j++) {
          var item = items[j];

          var matches = LanguageServiceAdapter.FILTER(search, items[j].name);
          if (!matches) {
            continue;
          }
          var targetModel = this.resourceService.get(new Network.URL(item.fileName));
          if (!targetModel || this.isBaseLibModel(targetModel)) {
            continue;
          }
          types.push({
            containerName: item.containerName,
            name: item.name,
            type: item.kind,
            matchKind: item.matchKind,
            resourceUrl: targetModel.getAssociatedResource().toExternal(),
            range: this.rangeFromMinAndLim(item, targetModel)
          });
        }
      }
      return types;
    };
    LanguageServiceAdapter.prototype.findOccurrences = function(resource, position, strict) {
      var _this = this;
      var model = this.resourceService.get(resource);

      var filename = model.getAssociatedResource().toExternal();

      var offset = model.getOffsetFromPosition(position);

      var entries = this.languageService.getOccurrencesAtPosition(filename, offset);
      var elements = entries.map(function(entry) {
        return {
          kind: entry.isWriteAccess ? "write" : null,
          range: _this.rangeFromMinAndLim(entry, model)
        };
      });
      return elements;
    };
    LanguageServiceAdapter.prototype.findDeclaration = function(resource, position) {
      var model = this.resourceService.get(resource);

      var filename = model.getAssociatedResource().toExternal();

      var offset = model.getOffsetFromPosition(position);

      var infos = this.languageService.getDefinitionAtPosition(filename, offset);
      if (!infos || infos.length === 0) {
        return null;
      }
      var info = infos[0];
      if (!info.fileName) {
        return null;
      }
      var targetModel = this.resourceService.get(new Network.URL(info.fileName));
      if (this.isBaseLibModel(targetModel)) {
        return null;
      }
      var result = {
        resourceUrl: targetModel.getAssociatedResource().toExternal(),
        range: this.rangeFromMinAndLim(info, targetModel, true),
        preview: this.preview(targetModel, info.minChar, info.limChar)
      };
      return result;
    };
    LanguageServiceAdapter.prototype.findTypeDeclaration = function(resource, position) {
      return null;
    };
    LanguageServiceAdapter.prototype.findReferences = function(resource, position) {
      var _this = this;
      var model = this.resourceService.get(resource);

      var offset = model.getOffsetFromPosition(position);

      var filename = model.getAssociatedResource().toExternal();

      var infos = this.languageService.getReferencesAtPosition(filename, offset);
      var result = infos.filter(function(info) {
        return !_this.isBaseLibModel(_this.resourceService.get(new Network.URL(info.fileName)));
      }).map(function(info) {
        var targetModel = _this.resourceService.get(new Network.URL(info.fileName));
        var r = {
          resourceUrl: targetModel.getAssociatedResource().toExternal(),
          range: _this.rangeFromMinAndLim(info, targetModel),
          preview: _this.preview(targetModel, info.minChar, info.limChar)
        };
        return r;
      });
      return result;
    };
    LanguageServiceAdapter.prototype.getTypeInformationAtPosition = function(resource, position) {
      var model = this.resourceService.get(resource);

      var offset = model.getOffsetFromPosition(position);

      var filename = model.getAssociatedResource().toExternal();

      var info = this.languageService.getTypeAtPosition(filename, offset);
      if (!info) {
        return null;
      }
      var htmlContent = [];
      htmlContent.push({
        className: "type",
        text: info.memberName.toString()
      });
      htmlContent.push({
        className: "documentation",
        text: info.docComment
      });
      var result = {
        value: "",
        htmlContent: htmlContent,
        className: "typeInfo ts",
        range: this.rangeFromMinAndLim(info, model)
      };
      return result;
    };
    LanguageServiceAdapter.prototype.getRangesToPosition = function(resource, position) {
      var model = this.resourceService.get(resource);

      var offset = model.getOffsetFromPosition(position);

      var filename = model.getAssociatedResource().toExternal();
      var tree = this.languageService.getSyntaxTree(filename);

      var token = tree.sourceUnit().findToken(offset);

      var result = [];
      while (token !== null) {
        result.unshift({
          type: "node",
          range: this.rangeFromMinAndLim({
            minChar: token.start(),
            limChar: token.end()
          }, model)
        });
        token = token.parent();
      }
      return result;
    };
    LanguageServiceAdapter.append = function(suggestions, suggestionSet, suggestion) {
      var key = suggestion.type + suggestion.label + suggestion.codeSnippet;
      if (!suggestionSet[key]) {
        suggestionSet[key] = true;
        suggestions.push(suggestion);
      }
    };
    LanguageServiceAdapter.prototype.suggest = function(resource, position) {
      var model = this.resourceService.get(resource);

      var filename = resource.toExternal();

      var currentWord = model.getWordUntilPosition(position);

      var offset = model.getOffsetFromPosition(position);

      var completionOffset = offset - currentWord.length;

      var memberCompletion = model.getValue().charAt(completionOffset - 1) === ".";
      var suggestions = [];
      var completion = this.languageService.getCompletionsAtPosition(filename, completionOffset, memberCompletion);
      if (completion) {
        memberCompletion = completion.isMemberCompletion;
        var suggestionSet = {};

        function append(suggestion) {
          var key = suggestion.type + suggestion.label + suggestion.codeSnippet;
          if (!suggestionSet[key]) {
            suggestionSet[key] = true;
            suggestions.push(suggestion);
          }
        }
        completion.entries.forEach(function(entry) {
          if (!entry.name || !entry.kind) {
            return;
          }
          LanguageServiceAdapter.append(suggestions, suggestionSet, {
            type: LanguageServiceAdapter.convertScriptElementKindToSuggestionType(entry.kind),
            label: entry.name,
            codeSnippet: entry.name
          });
        });
      }
      var shouldIncludeSnippets = !memberCompletion;

      var shouldIncludeAllWords = this.suggestConfiguration.alwaysAllWords || !completion || completion.entries.length ===
        0;
      if (shouldIncludeAllWords) {
        model.getAllUniqueWords(currentWord).filter(function(word) {
          return !/^-?\d*\.?\d/.test(word);
        }).forEach(function(word) {
          var suggestion = {
            type: "text",
            label: word,
            codeSnippet: word
          };
          suggestions.push(suggestion);
        });
      }
      if (shouldIncludeSnippets) {
        suggestions.push.apply(suggestions, JavaScriptSnippets.snippets);
        suggestions.push.apply(suggestions, TypeScriptSnippets.snippets);
      }
      return suggestions;
    };
    LanguageServiceAdapter.prototype.getSuggestionDetails = function(resource, position, suggestion) {
      var model = this.resourceService.get(resource);

      var filename = resource.toExternal();

      var offset = model.getOffsetFromPosition(position);
      var detail = this.languageService.getCompletionEntryDetails(filename, offset, suggestion.label);
      suggestion.typeLabel = detail.type;
      suggestion.documentationLabel = detail.docComment;
      if (this.suggestConfiguration.useCodeSnippetsOnMethodSuggest && suggestion.type === "function") {
        var parsedSignature = LanguageServiceAdapter.parseMethodSignature(detail.type);
        var suggestionArgumentNames = parsedSignature.arguments.map(function(piece) {
          return "{{" + piece.name.trim() + "}}";
        });
        var codeSnippet = detail.name;
        if (suggestionArgumentNames.length > 0) {
          codeSnippet += "(" + suggestionArgumentNames.join(", ") + "){{}}";
        } else {
          codeSnippet += "()";
        }
        suggestion.codeSnippet = codeSnippet;
      }
      return suggestion;
    };
    LanguageServiceAdapter.convertScriptElementKindToSuggestionType = function(kind) {
      switch (kind) {
        case TypeScriptServices.Services.ScriptElementKind.primitiveType:
        case TypeScriptServices.Services.ScriptElementKind.keyword:
          return "keyword";
        case TypeScriptServices.Services.ScriptElementKind.variableElement:
        case TypeScriptServices.Services.ScriptElementKind.localVariableElement:
        case TypeScriptServices.Services.ScriptElementKind.memberVariableElement:
        case TypeScriptServices.Services.ScriptElementKind.memberGetAccessorElement:
        case TypeScriptServices.Services.ScriptElementKind.memberSetAccessorElement:
          return "field";
        case TypeScriptServices.Services.ScriptElementKind.functionElement:
        case TypeScriptServices.Services.ScriptElementKind.memberFunctionElement:
        case TypeScriptServices.Services.ScriptElementKind.constructSignatureElement:
        case TypeScriptServices.Services.ScriptElementKind.callSignatureElement:
          return "function";
      }
      return kind;
    };
    LanguageServiceAdapter.prototype.quickFix = function(resource, position) {
      var model = this.resourceService.get(resource);

      var filename = model.getAssociatedResource().toExternal();

      var offset = model.getOffsetFromPosition(position);

      var currentWord = model.getWordUntilPosition(position);

      var completionOffset = offset - currentWord.length;

      var memberCompletion = model.getValue().charAt(completionOffset - 1) === ".";

      var completion = this.languageService.getCompletionsAtPosition(filename, completionOffset, memberCompletion);
      var result = [];
      completion.entries.forEach(function(entry) {
        var score = strings.difference(currentWord, entry.name);
        if (score < currentWord.length / 2) {
          return;
        }
        result.push({
          type: LanguageServiceAdapter.convertScriptElementKindToSuggestionType(entry.kind),
          label: entry.name,
          codeSnippet: entry.name,
          score: score
        });
      });
      result.sort(function(a, b) {
        return b.score - a.score;
      });
      return result.slice(0, 3);
    };
    LanguageServiceAdapter.parseMethodSignature = function(signature) {
      var parsedArguments = [];
      var returnType = "";
      var currentArgumentName = "";

      var currentArgumentType = "";

      var isInName = true;
      var parensDepth = 1;

      var i;

      var len;

      var ch;
      for (i = 1, len = signature.length; i < len; i++) {
        ch = signature.charAt(i);
        if (ch === ")") {
          parensDepth--;
        }
        if (ch === "(") {
          parensDepth++;
        }
        if (parensDepth === 1 && ch === ":") {
          isInName = false;
          continue;
        }
        if (parensDepth === 1 && ch === ",") {
          parsedArguments.push({
            name: currentArgumentName,
            type: currentArgumentType
          });
          currentArgumentName = "";
          currentArgumentType = "";
          isInName = true;
          continue;
        }
        if (parensDepth === 0 && ch === ")") {
          if (currentArgumentName !== "") {
            parsedArguments.push({
              name: currentArgumentName,
              type: currentArgumentType
            });
          }
          break;
        }
        if (isInName) {
          currentArgumentName += ch;
        } else {
          currentArgumentType += ch;
        }
      }
      return {
        arguments: parsedArguments,
        flatArguments: signature.substr(0, i + 1),
        flatReturnType: signature.substr(i + 5)
      };
    };
    LanguageServiceAdapter.prototype.getParameterHints = function(resource, position) {
      var model = this.resourceService.get(resource);

      var offset = model.getOffsetFromPosition(position);

      var filename = model.getAssociatedResource().toExternal();

      var info = this.languageService.getSignatureAtPosition(filename, offset);
      if (!info) {
        return null;
      }

      function transformParameter(parameter) {
        return {
          label: parameter.name,
          documentation: parameter.docComment,
          signatureLabelOffset: parameter.minChar,
          signatureLabelEnd: parameter.limChar
        };
      }

      function transformSignature(signature) {
        return {
          label: signature.signatureInfo,
          documentation: signature.docComment,
          parameters: signature.parameters.map(function(parameter) {
            return transformParameter(parameter);
          })
        };
      }
      var result = {
        currentSignature: Math.max(0, info.activeFormal),
        currentParameter: Math.max(0, info.actual.currentParameter),
        signatures: info.formal.map(function(signature) {
          return transformSignature(signature);
        })
      };
      return result;
    };
    LanguageServiceAdapter.prototype.getEmitOutput = function(resource, type) {
      var output = this.languageService.getEmitOutput(resource.toExternal());

      var files = output.outputFiles;
      if (!files) {
        return null;
      }
      for (var i = 0, len = files.length; i < len; i++) {
        if (strings.endsWith(files[i].name, type)) {
          return files[i].text;
        }
      }
      return null;
    };
    LanguageServiceAdapter.prototype.isBaseLibModel = function(model) {
      return model instanceof remoteModels.DefaultLibModel;
    };
    LanguageServiceAdapter.prototype.rangeFromMinAndLim = function(thing, model, empty) {
      if (typeof empty === "undefined") {
        empty = false;
      }
      var offset = thing.minChar;
      var length = thing.limChar - thing.minChar;
      length = Math.max(1, length);
      var range = {};
      range.startLineNumber = model.getLineNumberFromOffset(offset);
      range.startColumn = 1 + offset - model.getLineStart(range.startLineNumber);
      if (empty) {
        range.endLineNumber = range.startLineNumber;
        range.endColumn = range.startColumn;
      } else {
        range.endLineNumber = model.getLineNumberFromOffset(offset + length);
        range.endColumn = 1 + offset + length - model.getLineStart(range.endLineNumber);
      }
      return range;
    };
    LanguageServiceAdapter.prototype.preview = function(model, offset, to, range) {
      if (typeof range === "undefined") {
        range = 200;
      }
      var tree = this.languageService.getSyntaxTree(model.getAssociatedResource().toExternal());

      var token = tree.sourceUnit().findToken(offset);

      var scope;
      while (token && !scope) {
        if (token.fullWidth() > range) {
          scope = token;
        }
        token = token.parent();
      }
      if (!scope) {
        scope = tree.sourceUnit().findToken(offset).root();
      }
      var shortValue = model.getValue().substring(scope.start(), scope.end());
      var shortModel = new MirrorModel.MirrorModel("__temp_model_", 0, shortValue);
      var shortOffset = offset - scope.start();

      var length = to - offset;

      var startLineNumber = shortModel.getLineNumberFromOffset(shortOffset);

      var startColumn = 1 + shortOffset - shortModel.getLineStart(startLineNumber);

      var endLineNumber = shortModel.getLineNumberFromOffset(shortOffset + length);

      var endColumn = 1 + (shortOffset + length) - shortModel.getLineStart(endLineNumber);
      shortModel.dispose();
      return {
        text: shortValue,
        range: {
          startLineNumber: startLineNumber,
          startColumn: startColumn,
          endLineNumber: endLineNumber,
          endColumn: endColumn
        }
      };
    };
    LanguageServiceAdapter.prototype.isSubRange = function(outer, inner) {
      if (outer.startLineNumber > inner.startLineNumber || outer.endLineNumber < inner.endLineNumber) {
        return false;
      }
      if (outer.startLineNumber === inner.startLineNumber) {
        if (outer.startColumn > inner.startColumn) {
          return false;
        }
      }
      if (outer.endLineNumber === inner.endLineNumber) {
        if (outer.endColumn < inner.endColumn) {
          return false;
        }
      }
      return true;
    };
    LanguageServiceAdapter.prototype.calculateStringDifference = function(first, second) {
      var lengthDifference = Math.abs(first.length - second.length);
      if (lengthDifference > 4) {
        return 0;
      }
      var LCS = [];
      var zeroArray = [];
      var i;

      var j;
      for (i = 0; i < second.length + 1; ++i) {
        zeroArray.push(0);
      }
      for (i = 0; i < first.length + 1; ++i) {
        LCS.push(zeroArray);
      }
      for (i = 1; i < first.length + 1; ++i) {
        for (j = 1; j < second.length + 1; ++j) {
          if (first[i - 1] === second[j - 1]) {
            LCS[i][j] = LCS[i - 1][j - 1] + 1;
          } else {
            LCS[i][j] = Math.max(LCS[i - 1][j], LCS[i][j - 1]);
          }
        }
      }
      return LCS[first.length][second.length] - Math.sqrt(lengthDifference);
    };
    LanguageServiceAdapter.FILTER = filters.or(filters.matchesPrefix, filters.matchesContiguousSubString, filters.matchesCamelCase);
    return LanguageServiceAdapter;
  }();
  exports.LanguageServiceAdapter = LanguageServiceAdapter;
});