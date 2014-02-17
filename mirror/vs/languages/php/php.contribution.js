define("vs/languages/php/php.contribution", ["require", "exports", "vs/platform/platform",
  "vs/editor/modes/modesExtensions"
], function(e, t, n, i) {
  var o = n.Registry.as(i.Extensions.EditorModes);
  o.registerMode(["application/x-php"], new n.DeferredDescriptor("vs/languages/php/php", "PHPMode"));
});