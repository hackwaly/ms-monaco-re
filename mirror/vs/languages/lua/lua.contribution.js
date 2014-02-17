define('vs/languages/lua/lua.contribution', [
  'require',
  'exports',
  'vs/platform/platform',
  'vs/editor/modes/modesExtensions'
], function(e, t, n, i) {
  var o = n.Registry.as(i.Extensions.EditorModes);
  o.registerMode(['text/x-lua'], new n.DeferredDescriptor('vs/languages/lua/lua', 'LuaMode'));
})