define("vs/languages/json/json.contribution", ["require", "exports", "vs/nls!vs/editor/editor.main",
  "vs/platform/configurationRegistry", "vs/platform/platform", "vs/editor/modes/modesExtensions"
], function(e, t, n, i, o, r) {
  var s = o.Registry.as(r.Extensions.EditorModes);
  s.registerMode(["application/json"], new o.DeferredDescriptor("vs/languages/json/json", "JSONMode"));
  var a = o.Registry.as(i.Extensions.Configuration);
  a.registerConfiguration({
    id: r.LANGUAGE_CONFIGURATION + "/vs.languages.json",
    type: "object",
    title: n.localize("vs_languages_json_json.contribution", 0),
    description: n.localize("vs_languages_json_json.contribution", 1),
    properties: {
      schemas: {
        type: "array",
        description: n.localize("vs_languages_json_json.contribution", 2),
        items: {
          type: "object",
          properties: {
            schemaPath: {
              type: "string",
              "default": "/user.schema.json",
              description: n.localize("vs_languages_json_json.contribution", 3)
            },
            filePattern: {
              type: "string",
              "default": ".*\\.json",
              description: n.localize("vs_languages_json_json.contribution", 4)
            }
          }
        }
      }
    }
  });
});