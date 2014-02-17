define("vs/languages/css/css.contribution", ["require", "exports", "vs/nls!vs/editor/editor.main",
  "vs/platform/platform", "vs/editor/modes/modesExtensions", "vs/editor/editorExtensions",
  "vs/platform/configurationRegistry", "vs/languages/less/editor/colorContribution", "vs/base/env"
], function(e, t, n, i, o, r, s, a, u) {
  var l = i.Registry.as(o.Extensions.EditorModes);
  l.registerMode(["text/css"], new i.DeferredDescriptor("vs/languages/css/css", "CSSMode"));

  u.enableGlobalCSSRuleChecker && l.registerWorkerParticipant("vs.languages.css", new i.DeferredDescriptor(
    "vs/languages/css/monacoParticipant", "WorkerParticipant"));

  i.Registry.as(r.Extensions.EditorContributions).registerEditorContribution(new i.BaseDescriptor(a.ColorContribution));
  var c = i.Registry.as(s.Extensions.Configuration);
  c.registerConfiguration({
    id: o.LANGUAGE_CONFIGURATION + "/vs.languages.css",
    type: "object",
    title: n.localize("vs_languages_css_css.contribution", 0),
    description: n.localize("vs_languages_css_css.contribution", 1),
    properties: {
      "box-model": {
        type: "string",
        "enum": ["ignore", "warning", "error"],
        "default": "ignore",
        description: n.localize("vs_languages_css_css.contribution", 2)
      },
      "compatible-vendor-prefixes": {
        type: "string",
        "enum": ["ignore", "warning", "error"],
        "default": "warning",
        description: n.localize("vs_languages_css_css.contribution", 3)
      },
      "display-property-grouping": {
        type: "string",
        "enum": ["ignore", "warning", "error"],
        "default": "warning",
        description: n.localize("vs_languages_css_css.contribution", 4)
      },
      "duplicate-background-images": {
        type: "string",
        "enum": ["ignore", "warning", "error"],
        "default": "ignore",
        description: n.localize("vs_languages_css_css.contribution", 5)
      },
      "duplicate-properties": {
        type: "string",
        "enum": ["ignore", "warning", "error"],
        "default": "warning",
        description: n.localize("vs_languages_css_css.contribution", 6)
      },
      "empty-rules": {
        type: "string",
        "enum": ["ignore", "warning", "error"],
        "default": "warning",
        description: n.localize("vs_languages_css_css.contribution", 7)
      },
      gradients: {
        type: "string",
        "enum": ["ignore", "warning", "error"],
        "default": "warning",
        description: n.localize("vs_languages_css_css.contribution", 8)
      },
      ids: {
        type: "string",
        "enum": ["ignore", "warning", "error"],
        "default": "ignore",
        description: n.localize("vs_languages_css_css.contribution", 9)
      },
      important: {
        type: "string",
        "enum": ["ignore", "warning", "error"],
        "default": "ignore",
        description: n.localize("vs_languages_css_css.contribution", 10)
      },
      "known-properties": {
        type: "string",
        "enum": ["ignore", "warning", "error"],
        "default": "ignore",
        description: n.localize("vs_languages_css_css.contribution", 11)
      },
      "outline-none": {
        type: "string",
        "enum": ["ignore", "warning", "error"],
        "default": "warning",
        description: n.localize("vs_languages_css_css.contribution", 12)
      },
      "overqualified-elements": {
        type: "string",
        "enum": ["ignore", "warning", "error"],
        "default": "ignore",
        description: n.localize("vs_languages_css_css.contribution", 13)
      },
      "qualified-headings": {
        type: "string",
        "enum": ["ignore", "warning", "error"],
        "default": "ignore",
        description: n.localize("vs_languages_css_css.contribution", 14)
      },
      "regex-selectors": {
        type: "string",
        "enum": ["ignore", "warning", "error"],
        "default": "ignore",
        description: n.localize("vs_languages_css_css.contribution", 15)
      },
      shorthand: {
        type: "string",
        "enum": ["ignore", "warning", "error"],
        "default": "ignore",
        description: n.localize("vs_languages_css_css.contribution", 16)
      },
      "text-indent": {
        type: "string",
        "enum": ["ignore", "warning", "error"],
        "default": "ignore",
        description: n.localize("vs_languages_css_css.contribution", 17)
      },
      "unique-headings": {
        type: "string",
        "enum": ["ignore", "warning", "error"],
        "default": "ignore",
        description: n.localize("vs_languages_css_css.contribution", 18)
      },
      "universal-selector": {
        type: "string",
        "enum": ["ignore", "warning", "error"],
        "default": "ignore",
        description: n.localize("vs_languages_css_css.contribution", 19)
      },
      "unqualified-attributes": {
        type: "string",
        "enum": ["ignore", "warning", "error"],
        "default": "ignore",
        description: n.localize("vs_languages_css_css.contribution", 20)
      },
      "vendor-prefix": {
        type: "string",
        "enum": ["ignore", "warning", "error"],
        "default": "warning",
        description: n.localize("vs_languages_css_css.contribution", 21)
      },
      "zero-units": {
        type: "string",
        "enum": ["ignore", "warning", "error"],
        "default": "warning",
        description: n.localize("vs_languages_css_css.contribution", 22)
      }
    }
  });
});