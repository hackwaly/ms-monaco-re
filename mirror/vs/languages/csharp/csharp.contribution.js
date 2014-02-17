define('vs/languages/csharp/csharp.contribution', [
  'require',
  'exports',
  'vs/platform/platform',
  'vs/editor/modes/modesExtensions'
], function(e, t, n, i) {
  var o = n.Registry.as(i.Extensions.EditorModes);
  o.registerMode(['text/x-csharp'], new n.DeferredDescriptor('vs/languages/csharp/csharp', 'CSMode'));
})