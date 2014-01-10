define(["require", "exports"], function(a, b) {
  (function(a) {
    a[a.LTR = 0] = "LTR", a[a.RTL = 1] = "RTL"
  })(b.SelectionDirection || (b.SelectionDirection = {}));
  var c = b.SelectionDirection;
  (function(a) {
    a[a.TextDefined = 0] = "TextDefined", a[a.LF = 1] = "LF", a[a.CRLF = 2] = "CRLF"
  })(b.EndOfLinePreference || (b.EndOfLinePreference = {}));
  var d = b.EndOfLinePreference;
  (function(a) {
    a[a.EXACT = 0] = "EXACT", a[a.ABOVE = 1] = "ABOVE", a[a.BELOW = 2] = "BELOW"
  })(b.ContentWidgetPositionPreference || (b.ContentWidgetPositionPreference = {}));
  var e = b.ContentWidgetPositionPreference;
  (function(a) {
    a[a.TOP_RIGHT_CORNER = 0] = "TOP_RIGHT_CORNER"
  })(b.OverlayWidgetPositionPreference || (b.OverlayWidgetPositionPreference = {}));
  var f = b.OverlayWidgetPositionPreference;
  (function(a) {
    a[a.UNKNOWN = 0] = "UNKNOWN", a[a.TEXTAREA = 1] = "TEXTAREA", a[a.GUTTER_GLYPH_MARGIN = 2] =
      "GUTTER_GLYPH_MARGIN", a[a.GUTTER_LINE_NUMBERS = 3] = "GUTTER_LINE_NUMBERS", a[a.GUTTER_LINE_DECORATIONS = 4] =
      "GUTTER_LINE_DECORATIONS", a[a.GUTTER_VIEW_ZONE = 5] = "GUTTER_VIEW_ZONE", a[a.CONTENT_TEXT = 6] =
      "CONTENT_TEXT", a[a.CONTENT_EMPTY = 7] = "CONTENT_EMPTY", a[a.CONTENT_VIEW_ZONE = 8] = "CONTENT_VIEW_ZONE", a[
        a.CONTENT_WIDGET = 9] = "CONTENT_WIDGET", a[a.OVERVIEW_RULER = 10] = "OVERVIEW_RULER", a[a.SCROLLBAR = 11] =
      "SCROLLBAR", a[a.OVERLAY_WIDGET = 12] = "OVERLAY_WIDGET"
  })(b.MouseTargetType || (b.MouseTargetType = {}));
  var g = b.MouseTargetType
})