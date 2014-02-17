define("vs/languages/javascript/javascript.contribution", ["require", "exports", "vs/nls!vs/editor/editor.main",
  "vs/platform/platform", "vs/platform/configurationRegistry", "vs/editor/modes/modesExtensions",
  "./javascript.configuration"
], function(e, t, n, i, o, r, s) {
  var a = i.Registry.as(r.Extensions.EditorModes);
  a.registerMode(["text/javascript"], new i.DeferredDescriptor("vs/languages/javascript/javascript", "JSVSMode"));
  var u = i.Registry.as(o.Extensions.Configuration);
  u.registerConfiguration({
    id: r.LANGUAGE_CONFIGURATION + "/vs.languages.javascript",
    type: "object",
    title: n.localize("vs_languages_javascript_javascript.contribution", 0),
    description: n.localize("vs_languages_javascript_javascript.contribution", 1),
    properties: {
      suggestSettings: {
        type: "object",
        description: n.localize("vs_languages_javascript_javascript.contribution", 2),
        "default": s.defaultSuggestSettions,
        properties: {
          alwaysAllWords: {
            type: "boolean",
            "default": !1,
            description: n.localize("vs_languages_javascript_javascript.contribution", 3)
          },
          useCodeSnippetsOnMethodSuggest: {
            type: "boolean",
            "default": !1,
            description: n.localize("vs_languages_javascript_javascript.contribution", 4)
          }
        }
      },
      validationSettings: {
        description: n.localize("vs_languages_javascript_javascript.contribution", 5),
        "default": s.defaultValidationSettings,
        type: ["object", "array"],
        properties: {
          scope: {
            type: "string",
            "default": "/",
            description: n.localize("vs_languages_javascript_javascript.contribution", 6)
          },
          codeGenTarget: {
            "enum": ["ES5", "ES3"],
            "default": "ES5",
            description: n.localize("vs_languages_javascript_javascript.contribution", 7)
          },
          noLib: {
            type: "boolean",
            "default": !1,
            description: n.localize("vs_languages_javascript_javascript.contribution", 8)
          },
          lint: {
            type: "object",
            description: n.localize("vs_languages_javascript_javascript.contribution", 9),
            properties: {
              curlyBracketsMustNotBeOmitted: {
                "enum": ["ignore", "warning", "error"],
                "default": "warning",
                description: n.localize("vs_languages_javascript_javascript.contribution", 10)
              },
              emptyBlocksWithoutComment: {
                "enum": ["ignore", "warning", "error"],
                "default": "warning",
                description: n.localize("vs_languages_javascript_javascript.contribution", 11)
              },
              comparisonOperatorsNotStrict: {
                "enum": ["ignore", "warning", "error"],
                "default": "warning",
                description: n.localize("vs_languages_javascript_javascript.contribution", 12)
              },
              missingSemicolon: {
                "enum": ["ignore", "warning", "error"],
                "default": "warning",
                description: n.localize("vs_languages_javascript_javascript.contribution", 13)
              },
              reservedKeywords: {
                "enum": ["ignore", "warning", "error"],
                "default": "error",
                description: n.localize("vs_languages_javascript_javascript.contribution", 14)
              },
              typeScriptSpecifics: {
                "enum": ["ignore", "warning", "error"],
                "default": "error",
                description: n.localize("vs_languages_javascript_javascript.contribution", 15)
              },
              unknownTypeOfResults: {
                "enum": ["ignore", "warning", "error"],
                "default": "warning",
                description: n.localize("vs_languages_javascript_javascript.contribution", 16)
              },
              semicolonsInsteadOfBlocks: {
                "enum": ["ignore", "warning", "error"],
                "default": "warning",
                description: n.localize("vs_languages_javascript_javascript.contribution", 17)
              },
              functionsInsideLoops: {
                "enum": ["ignore", "warning", "error"],
                "default": "warning",
                description: n.localize("vs_languages_javascript_javascript.contribution", 18)
              },
              newOnLowercaseFunctions: {
                "enum": ["ignore", "warning", "error"],
                "default": "warning",
                description: n.localize("vs_languages_javascript_javascript.contribution", 19)
              },
              tripleSlashReferenceAlike: {
                "enum": ["ignore", "warning", "error"],
                "default": "warning",
                description: n.localize("vs_languages_javascript_javascript.contribution", 20)
              },
              unusedVariables: {
                "enum": ["ignore", "warning", "error"],
                "default": "warning",
                description: n.localize("vs_languages_javascript_javascript.contribution", 21)
              },
              unusedFunctions: {
                "enum": ["ignore", "warning", "error"],
                "default": "warning",
                description: n.localize("vs_languages_javascript_javascript.contribution", 22)
              },
              newOnReturningFunctions: {
                "enum": ["ignore", "warning", "error"],
                "default": "warning",
                description: n.localize("vs_languages_javascript_javascript.contribution", 23)
              },
              redeclaredVariables: {
                "enum": ["ignore", "warning", "error"],
                "default": "warning",
                description: n.localize("vs_languages_javascript_javascript.contribution", 24)
              },
              undeclaredVariables: {
                "enum": ["ignore", "warning", "error"],
                "default": "error",
                description: n.localize("vs_languages_javascript_javascript.contribution", 25)
              },
              unknownProperty: {
                "enum": ["ignore", "warning", "error"],
                "default": "ignore",
                description: n.localize("vs_languages_javascript_javascript.contribution", 26)
              },
              primitivesInInstanceOf: {
                "enum": ["ignore", "warning", "error"],
                "default": "error",
                description: n.localize("vs_languages_javascript_javascript.contribution", 27)
              },
              mixedTypesArithmetics: {
                "enum": ["ignore", "warning", "error"],
                "default": "warning",
                description: n.localize("vs_languages_javascript_javascript.contribution", 28)
              },
              forcedTypeConversion: {
                "enum": ["ignore", "warning", "error"],
                "default": "warning",
                description: n.localize("vs_languages_javascript_javascript.contribution", 29)
              }
            }
          }
        }
      }
    }
  });
});