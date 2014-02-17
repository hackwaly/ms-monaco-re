define('vs/languages/less/less.contribution', [
  'require',
  'exports',
  'vs/editor/modes/modesExtensions',
  'vs/editor/editorExtensions',
  'vs/platform/platform',
  'vs/languages/less/editor/colorContribution'
], function(e, t, n, i, o, r) {
  o.Registry.as(i.Extensions.EditorContributions).registerEditorContribution(new o.BaseDescriptor(r.ColorContribution));
  var s = o.Registry.as(n.Extensions.EditorModes);
  s.registerMode([
    'text/x-less',
    'text/less'
  ], new o.DeferredDescriptor('vs/languages/less/less', 'LESSMode'));
})