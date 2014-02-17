define('vs/languages/sass/sass.contribution', [
  'require',
  'exports',
  'vs/editor/modes/modesExtensions',
  'vs/platform/platform'
], function(e, t, n, i) {
  var o = i.Registry.as(n.Extensions.EditorModes);
  o.registerMode([
    'text/x-scss',
    'text/scss'
  ], new i.DeferredDescriptor('vs/languages/sass/sass', 'SASSMode'));
})