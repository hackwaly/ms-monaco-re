define('vs/languages/xml/xml.contribution', [
  'require',
  'exports',
  'vs/platform/platform',
  'vs/editor/modes/modesExtensions'
], function(e, t, n, i) {
  var o = n.Registry.as(i.Extensions.EditorModes);
  o.registerMode([
    'text/xml',
    'application/xml',
    'application/xaml+xml'
  ], new n.DeferredDescriptor('vs/languages/xml/xml', 'XMLMode'));
})