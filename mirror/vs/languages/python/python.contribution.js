define("vs/languages/python/python.contribution", ["require", "exports", "vs/editor/modes/modesExtensions",
  "vs/platform/platform"
], function(e, t, n, i) {
  var o = i.Registry.as(n.Extensions.EditorModes);
  o.registerMode(["text/x-python", "text/python"], new i.DeferredDescriptor("vs/languages/python/python",
    "PythonMode"));
});