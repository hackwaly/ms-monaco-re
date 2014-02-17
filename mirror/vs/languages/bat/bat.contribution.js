define("vs/languages/bat/bat.contribution", ["require", "exports", "vs/platform/platform",
  "vs/editor/modes/modesExtensions"
], function(e, t, n, i) {
  var o = n.Registry.as(i.Extensions.EditorModes);
  o.registerMode(["text/x-bat"], new n.DeferredDescriptor("vs/languages/bat/bat", "BatMode"));
});