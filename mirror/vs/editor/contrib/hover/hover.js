define(["require", "exports", "vs/editor/core/constants", "vs/platform/platform", "vs/editor/editorExtensions",
  "vs/editor/editor", "vs/base/env", "vs/editor/contrib/hover/modesContentHover",
  "vs/editor/contrib/hover/modesGlyphHover", "vs/css!./hover"
], function(a, b, c, d, e, f, g, h, i) {
  var j = c,
    k = d,
    l = e,
    m = f,
    n = g,
    o = h,
    p = i,
    q = function() {
      function a(a) {
        var b = this;
        this._editor = a, this._toUnhook = [], a.getConfiguration().hover && (this._toUnhook.push(this._editor.addListener(
          j.EventType.MouseMove, function(a) {
            return b._onEditorMouseMove(a)
          })), this._toUnhook.push(this._editor.addListener(j.EventType.MouseLeave, function(a) {
          return b._hideWidgets()
        })), this._toUnhook.push(this._editor.addListener(j.EventType.KeyDown, function(a) {
          return b._onKeyDown(a)
        })), this._toUnhook.push(this._editor.addListener(j.EventType.ModelChanged, function() {
          return b._hideWidgets()
        })), this._toUnhook.push(this._editor.addListener("scroll", function() {
          return b._hideWidgets()
        })), this._contentWidget = new o.ModesContentHoverWidget(a), this._glyphWidget = new p.ModesGlyphHoverWidget(
          a))
      }
      return a.prototype._onEditorMouseMove = function(a) {
        var b = a.target.type,
          c = n.browser.isMacintosh ? "metaKey" : "ctrlKey";
        if (b === m.MouseTargetType.CONTENT_WIDGET && a.target.detail === o.ModesContentHoverWidget.ID && !a.event[c])
          return;
        if (b === m.MouseTargetType.OVERLAY_WIDGET && a.target.detail === p.ModesGlyphHoverWidget.ID && !a.event[c])
          return;
        b === m.MouseTargetType.CONTENT_TEXT ? (this._glyphWidget.hide(), this._contentWidget.startShowingAt(a.target
          .range)) : b === m.MouseTargetType.GUTTER_GLYPH_MARGIN ? (this._contentWidget.hide(), this._glyphWidget.startShowingAt(
          a.target.position.lineNumber)) : this._hideWidgets()
      }, a.prototype._onKeyDown = function(a) {
        var b = n.browser.isMacintosh ? "Meta" : "Ctrl";
        a.key !== b && this._hideWidgets()
      }, a.prototype._hideWidgets = function() {
        this._glyphWidget.hide(), this._contentWidget.hide()
      }, a.prototype.getId = function() {
        return a.ID
      }, a.prototype.dispose = function() {
        this._glyphWidget && (this._glyphWidget.dispose(), this._glyphWidget = null), this._contentWidget && (this._contentWidget
          .dispose(), this._contentWidget = null);
        while (this._toUnhook.length > 0) this._toUnhook.pop()()
      }, a.ID = "editor.contrib.hover", a
    }(),
    r = k.Registry.as(l.Extensions.EditorContributions);
  r.registerEditorContribution(new k.BaseDescriptor(q))
})