define("vs/languages/cpp/cpp.contribution", ["require", "exports", "vs/platform/platform",
  "vs/editor/modes/modesExtensions"
], function(e, t, n, i) {
  var o = n.Registry.as(i.Extensions.EditorModes);
  o.registerMode(["text/x-cpp"], new n.DeferredDescriptor("vs/languages/cpp/cpp", "CPPMode"));
});