define("vs/languages/powershell/powershell.contribution", ["require", "exports", "vs/platform/platform",
  "vs/editor/modes/modesExtensions"
], function(e, t, n, i) {
  var o = n.Registry.as(i.Extensions.EditorModes);
  o.registerMode(["text/x-powershell"], new n.DeferredDescriptor("vs/languages/powershell/powershell",
    "PowerShellMode"));
});