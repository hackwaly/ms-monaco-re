define("vs/languages/ini/ini.contribution", ["require", "exports", "vs/platform/platform",
  "vs/editor/modes/modesExtensions"
], function(e, t, n, i) {
  var o = n.Registry.as(i.Extensions.EditorModes);
  o.registerMode(["text/x-ini"], new n.DeferredDescriptor("vs/languages/ini/ini", "INIMode"));
});