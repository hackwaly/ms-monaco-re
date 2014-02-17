define("vs/editor/contrib/hover/hover", ["require", "exports", "vs/editor/core/constants", "vs/platform/platform",
  "vs/editor/editorExtensions", "vs/editor/editor", "vs/base/env", "vs/editor/contrib/hover/modesContentHover",
  "vs/editor/contrib/hover/modesGlyphHover", "vs/css!./hover"
], function(e, t, n, i, o, r, s, a, u) {
  var l = function() {
    function e(e) {
      var t = this;
      this._editor = e;

      this._toUnhook = [];

      if (e.getConfiguration().hover) {
        this._toUnhook.push(this._editor.addListener(n.EventType.MouseDown, function(e) {
          return t._onEditorMouseDown(e);
        }));
        this._toUnhook.push(this._editor.addListener(n.EventType.MouseMove, function(e) {
          return t._onEditorMouseMove(e);
        }));
        this._toUnhook.push(this._editor.addListener(n.EventType.MouseLeave, function() {
          return t._hideWidgets();
        }));
        this._toUnhook.push(this._editor.addListener(n.EventType.KeyDown, function(e) {
          return t._onKeyDown(e);
        }));
        this._toUnhook.push(this._editor.addListener(n.EventType.ModelChanged, function() {
          return t._hideWidgets();
        }));
        this._toUnhook.push(this._editor.addListener(n.EventType.ModelDecorationsChanged, function() {
          return t._onModelDecorationsChanged();
        }));
        this._toUnhook.push(this._editor.addListener("scroll", function() {
          return t._hideWidgets();
        }));
        this._contentWidget = new a.ModesContentHoverWidget(e);
        this._glyphWidget = new u.ModesGlyphHoverWidget(e);
      }
    }
    e.prototype._onModelDecorationsChanged = function() {
      this._contentWidget.onModelDecorationsChanged();

      this._glyphWidget.onModelDecorationsChanged();
    };

    e.prototype._onEditorMouseDown = function(e) {
      var t = e.target.type;
      if ((9 !== t || e.target.detail !== a.ModesContentHoverWidget.ID) && (12 !== t || e.target.detail !== u.ModesGlyphHoverWidget
        .ID)) {
        this._hideWidgets();
      }
    };

    e.prototype._onEditorMouseMove = function(e) {
      var t = e.target.type;

      var n = s.browser.isMacintosh ? "metaKey" : "ctrlKey";
      if ((9 !== t || e.target.detail !== a.ModesContentHoverWidget.ID || e.event[n]) && (12 !== t || e.target.detail !==
        u.ModesGlyphHoverWidget.ID || e.event[n])) {
        this._editor.getConfiguration().hover && 6 === t ? (this._glyphWidget.hide(), this._contentWidget.startShowingAt(
          e.target.range)) : this._editor.getConfiguration().hover && 2 === t ? (this._contentWidget.hide(), this._glyphWidget
          .startShowingAt(e.target.position.lineNumber)) : this._hideWidgets();
      }
    };

    e.prototype._onKeyDown = function(e) {
      var t = s.browser.isMacintosh ? "Meta" : "Ctrl";
      if (e.key !== t) {
        this._hideWidgets();
      }
    };

    e.prototype._hideWidgets = function() {
      this._glyphWidget.hide();

      this._contentWidget.hide();
    };

    e.prototype.getId = function() {
      return e.ID;
    };

    e.prototype.dispose = function() {
      for (this._glyphWidget && (this._glyphWidget.dispose(), this._glyphWidget = null), this._contentWidget && (this
        ._contentWidget.dispose(), this._contentWidget = null); this._toUnhook.length > 0;) {
        this._toUnhook.pop()();
      }
    };

    e.ID = "editor.contrib.hover";

    return e;
  }();

  var c = i.Registry.as(o.Extensions.EditorContributions);
  c.registerEditorContribution(new i.BaseDescriptor(l));
});