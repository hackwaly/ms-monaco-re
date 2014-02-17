define('vs/editor/core/constants', [
  'require',
  'exports'
], function(e, t) {
  t.EditorType = {
    ICodeEditor: 'vs.editor.ICodeEditor',
    IDiffEditor: 'vs.editor.IDiffEditor',
    ITerminal: 'vs.editor.ITerminal'
  }, t.ClassName = {
    EditorWarningDecoration: 'greensquiggly',
    EditorErrorDecoration: 'redsquiggly'
  }, t.EventType = {
    Disposed: 'disposed',
    ConfigurationChanged: 'configurationChanged',
    ModelDispose: 'modelDispose',
    ModelChanged: 'modelChanged',
    ModelModeChanged: 'modelsModeChanged',
    ModelTokensChanged: 'modelTokensChanged',
    ModelContentChanged: 'contentChanged',
    ModelContentChangedFlush: 'flush',
    ModelContentChangedLinesDeleted: 'linesDeleted',
    ModelContentChangedLinesInserted: 'linesInserted',
    ModelContentChangedLineChanged: 'lineChanged',
    OnBeforeModelContentChangedFlush: 'onBeforeFlush',
    OnBeforeModelContentChangedLinesDeleted: 'onBeforeLinesDeleted',
    OnBeforeModelContentChangedLinesInserted: 'onBeforeLinesInserted',
    OnBeforeModelContentChangedLineChanged: 'onBeforeLineChanged',
    ModelPropertiesChanged: 'propertiesChanged',
    ModelDecorationsChanged: 'decorationsChanged',
    CursorPositionChanged: 'positionChanged',
    CursorSelectionChanged: 'selectionChanged',
    CursorRevealRange: 'revealRange',
    ViewFocusGained: 'focusGained',
    ViewFocusLost: 'focusLost',
    ViewFocusChanged: 'focusChanged',
    ViewScrollWidthChanged: 'scrollWidthChanged',
    ViewScrollHeightChanged: 'scrollHeightChanged',
    ViewScrollChanged: 'scrollChanged',
    ViewZonesChanged: 'zonesChanged',
    ViewLayoutChanged: 'viewLayoutChanged',
    ContextMenu: 'contextMenu',
    MouseDown: 'mousedown',
    MouseUp: 'mouseup',
    MouseMove: 'mousemove',
    MouseLeave: 'mouseleave',
    KeyDown: 'keydown',
    KeyUp: 'keyup',
    EditorLayout: 'editorLayout',
    DiffUpdated: 'diffUpdated'
  };
})