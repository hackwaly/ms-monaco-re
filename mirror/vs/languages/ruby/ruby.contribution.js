define("vs/languages/ruby/ruby.contribution", ["require", "exports", "vs/editor/modes/modesExtensions",
  "vs/platform/platform"
], function(e, t, n, i) {
  var o = i.Registry.as(n.Extensions.EditorModes);
  o.registerMode(["text/x-ruby", "text/ruby"], new i.DeferredDescriptor("vs/languages/ruby/ruby", "RubyMode"));
});