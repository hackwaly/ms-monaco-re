define("vs/languages/html/html.contribution", ["require", "exports", "vs/platform/platform",
  "vs/editor/modes/modesExtensions"
], function(e, t, n, i) {
  var o = n.Registry.as(i.Extensions.EditorModes);
  o.registerMode(["text/html"], new n.DeferredDescriptor("vs/languages/html/html", "HTMLMode"));
});