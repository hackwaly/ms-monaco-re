define('vs/languages/fsharp/fsharp.contribution', [
  'require',
  'exports',
  'vs/platform/platform',
  'vs/editor/modes/modesExtensions'
], function(e, t, n, i) {
  var o = n.Registry.as(i.Extensions.EditorModes);
  o.registerMode(['text/x-fsharp'], new n.DeferredDescriptor('vs/languages/fsharp/fsharp', 'FSMode'));
})