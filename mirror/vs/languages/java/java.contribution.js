define("vs/languages/java/java.contribution", ["require", "exports", "vs/platform/platform",
  "vs/editor/modes/modesExtensions"
], function(e, t, n, i) {
  var o = n.Registry.as(i.Extensions.EditorModes);
  o.registerMode(["text/x-java-source"], new n.DeferredDescriptor("vs/languages/java/java", "JMode"));
});