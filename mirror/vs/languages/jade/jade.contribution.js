define('vs/languages/jade/jade.contribution', [
  'require',
  'exports',
  'vs/platform/platform',
  'vs/editor/modes/modesExtensions'
], function(e, t, n, i) {
  var o = n.Registry.as(i.Extensions.EditorModes);
  o.registerMode(['text/x-jade'], new n.DeferredDescriptor('vs/languages/jade/jade', 'JadeMode'));
})