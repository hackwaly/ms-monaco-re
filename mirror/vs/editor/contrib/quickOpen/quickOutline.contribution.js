define('vs/editor/contrib/quickOpen/quickOutline.contribution', [
  'require',
  'exports',
  'vs/nls!vs/editor/editor.main',
  'vs/platform/platform',
  'vs/platform/actionRegistry',
  'vs/editor/editorExtensions',
  './quickOutline'
], function(e, t, n, i, o, r, s) {
  var a = i.Registry.as(r.Extensions.EditorContributions);
  a.registerEditorContribution(new o.ActionDescriptor(s.QuickOutlineAction, s.QuickOutlineAction.ID, n.localize(
    'vs_editor_contrib_quickOpen_quickOutline.contribution', 0), {
    ctrlCmd: !0,
    shift: !0,
    key: 'O'
  }, {
    ctrlCmd: !0,
    shift: !0,
    key: ','
  }));
})