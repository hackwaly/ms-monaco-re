define("vs/languages/razor/razor.contribution", ["require", "exports", "vs/platform/platform",
  "vs/editor/modes/modesExtensions"
], function(e, t, n, i) {
  var o = n.Registry.as(i.Extensions.EditorModes);
  o.registerMode(["text/x-cshtml"], new n.DeferredDescriptor("vs/languages/razor/razor", "RAZORMode"));
});