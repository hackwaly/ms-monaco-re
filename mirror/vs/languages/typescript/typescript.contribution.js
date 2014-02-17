define("vs/languages/typescript/typescript.contribution", ["require", "exports", "vs/nls!vs/editor/editor.main",
  "vs/base/env", "vs/platform/platform", "vs/editor/modes/modesExtensions", "vs/editor/editorExtensions",
  "./editor/workerStatusReporter", "vs/platform/configurationRegistry", "./typescript.configuration"
], function(e, t, n, i, o, r, s, a, u, l) {
  var c = o.Registry.as(r.Extensions.EditorModes);
  c.registerMode(["text/typescript"], new o.DeferredDescriptor("vs/languages/typescript/typescript", "TypeScriptMode"));

  i.enableNLSWarnings && c.registerWorkerParticipant("vs.languages.typescript", new o.DeferredDescriptor(
    "vs/languages/typescript/participants/nlsParticipant", "WorkerParticipant"));

  i.enableEditorLanguageServiceIndicator && o.Registry.as(s.Extensions.EditorContributions).registerEditorContribution(
    new o.BaseDescriptor(a.StatusPresenter));
  var d = o.Registry.as(u.Extensions.Configuration);
  d.registerConfiguration({
    id: r.LANGUAGE_CONFIGURATION + "/vs.languages.typescript",
    type: "object",
    title: n.localize("vs_languages_typescript_typescript.contribution", 0),
    description: n.localize("vs_languages_typescript_typescript.contribution", 1),
    properties: {
      suggestSettings: {
        type: "object",
        description: n.localize("vs_languages_typescript_typescript.contribution", 2),
        "default": l.defaultSuggestSettions,
        properties: {
          alwaysAllWords: {
            type: "boolean",
            "default": !1,
            description: n.localize("vs_languages_typescript_typescript.contribution", 3)
          },
          useCodeSnippetsOnMethodSuggest: {
            type: "boolean",
            "default": !1,
            description: n.localize("vs_languages_typescript_typescript.contribution", 4)
          }
        }
      },
      allowMultipleWorkers: {
        type: "boolean",
        description: n.localize("vs_languages_typescript_typescript.contribution", 5),
        "default": !1
      },
      validationSettings: {
        description: n.localize("vs_languages_typescript_typescript.contribution", 6),
        "default": l.defaultValidationSettings,
        type: ["object", "array"],
        properties: {
          scope: {
            type: "string",
            "default": "/",
            description: n.localize("vs_languages_typescript_typescript.contribution", 7)
          },
          codeGenTarget: {
            "enum": ["ES5", "ES3"],
            "default": "ES5",
            description: n.localize("vs_languages_typescript_typescript.contribution", 8)
          },
          moduleGenTarget: {
            "enum": ["commonjs", "amd", ""],
            "default": "",
            description: n.localize("vs_languages_typescript_typescript.contribution", 9)
          },
          noImplicitAny: {
            type: "boolean",
            "default": !1,
            description: n.localize("vs_languages_typescript_typescript.contribution", 10)
          },
          noLib: {
            type: "boolean",
            "default": !1,
            description: n.localize("vs_languages_typescript_typescript.contribution", 11)
          },
          lint: {
            type: "object",
            description: n.localize("vs_languages_typescript_typescript.contribution", 12),
            properties: {
              curlyBracketsMustNotBeOmitted: {
                "enum": ["ignore", "warning", "error"],
                "default": "warning",
                description: n.localize("vs_languages_typescript_typescript.contribution", 13)
              },
              emptyBlocksWithoutComment: {
                "enum": ["ignore", "warning", "error"],
                "default": "warning",
                description: n.localize("vs_languages_typescript_typescript.contribution", 14)
              },
              comparisonOperatorsNotStrict: {
                "enum": ["ignore", "warning", "error"],
                "default": "warning",
                description: n.localize("vs_languages_typescript_typescript.contribution", 15)
              },
              missingSemicolon: {
                "enum": ["ignore", "warning", "error"],
                "default": "warning",
                description: n.localize("vs_languages_typescript_typescript.contribution", 16)
              },
              reservedKeywords: {
                "enum": ["ignore", "warning", "error"],
                "default": "error",
                description: n.localize("vs_languages_typescript_typescript.contribution", 17)
              },
              typeScriptSpecifics: {
                "enum": ["ignore", "warning", "error"],
                "default": "error",
                description: n.localize("vs_languages_typescript_typescript.contribution", 18)
              },
              unknownTypeOfResults: {
                "enum": ["ignore", "warning", "error"],
                "default": "warning",
                description: n.localize("vs_languages_typescript_typescript.contribution", 19)
              },
              semicolonsInsteadOfBlocks: {
                "enum": ["ignore", "warning", "error"],
                "default": "warning",
                description: n.localize("vs_languages_typescript_typescript.contribution", 20)
              },
              functionsInsideLoops: {
                "enum": ["ignore", "warning", "error"],
                "default": "warning",
                description: n.localize("vs_languages_typescript_typescript.contribution", 21)
              },
              newOnLowercaseFunctions: {
                "enum": ["ignore", "warning", "error"],
                "default": "warning",
                description: n.localize("vs_languages_typescript_typescript.contribution", 22)
              },
              tripleSlashReferenceAlike: {
                "enum": ["ignore", "warning", "error"],
                "default": "warning",
                description: n.localize("vs_languages_typescript_typescript.contribution", 23)
              },
              unusedVariables: {
                "enum": ["ignore", "warning", "error"],
                "default": "warning",
                description: n.localize("vs_languages_typescript_typescript.contribution", 24)
              },
              unusedFunctions: {
                "enum": ["ignore", "warning", "error"],
                "default": "warning",
                description: n.localize("vs_languages_typescript_typescript.contribution", 25)
              },
              unusedMembers: {
                "enum": ["ignore", "warning", "error"],
                "default": "warning",
                description: n.localize("vs_languages_typescript_typescript.contribution", 26)
              },
              functionsWithoutReturnType: {
                "enum": ["ignore", "warning", "error"],
                "default": "warning",
                description: n.localize("vs_languages_typescript_typescript.contribution", 27)
              }
            }
          }
        }
      }
    }
  });
});