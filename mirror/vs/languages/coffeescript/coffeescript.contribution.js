define('vs/languages/coffeescript/coffeescript.contribution', [
  'require',
  'exports',
  'vs/platform/platform',
  'vs/editor/modes/modesExtensions'
], function(e, t, n, i) {
  var o = n.Registry.as(i.Extensions.EditorModes);
  o.registerMode([
    'text/x-coffeescript',
    'text/coffeescript'
  ], new n.DeferredDescriptor('vs/languages/coffeescript/coffeescript', 'CoffeeMode'));
})