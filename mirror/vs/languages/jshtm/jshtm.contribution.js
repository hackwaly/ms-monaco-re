define('vs/languages/jshtm/jshtm.contribution', [
  'require',
  'exports',
  'vs/platform/platform',
  'vs/editor/modes/modesExtensions'
], function(e, t, n, i) {
  var o = n.Registry.as(i.Extensions.EditorModes);
  o.registerMode(['text/x-jshtm'], new n.DeferredDescriptor('vs/languages/jshtm/jshtm', 'JSHTMHTMLMode'));
})