define('vs/languages/vb/vb.contribution', [
  'require',
  'exports',
  'vs/platform/platform',
  'vs/editor/modes/modesExtensions'
], function(e, t, n, i) {
  var o = n.Registry.as(i.Extensions.EditorModes);
  o.registerMode(['text/x-vb'], new n.DeferredDescriptor('vs/languages/vb/vb', 'VBMode'));
})