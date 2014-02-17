define('vs/editor/contrib/quickOpen/gotoLine.contribution', [
  'require',
  'exports',
  'vs/nls!vs/editor/editor.main',
  'vs/platform/platform',
  'vs/platform/actionRegistry',
  'vs/editor/editorExtensions',
  './gotoLine'
], function(e, t, n, i, o, r, s) {
  var a = i.Registry.as(r.Extensions.EditorContributions);
  a.registerEditorContribution(new o.ActionDescriptor(s.GotoLineAction, s.GotoLineAction.ID, n.localize(
    'vs_editor_contrib_quickOpen_gotoLine.contribution', 0), {
    ctrlCmd: !0,
    key: 'G'
  }));
})