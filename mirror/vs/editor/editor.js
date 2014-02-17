define('vs/editor/editor', [
  'require',
  'exports'
], function(e, t) {
  ! function(e) {
    e[e.LTR = 0] = 'LTR', e[e.RTL = 1] = 'RTL';
  }(t.SelectionDirection || (t.SelectionDirection = {}));
  t.SelectionDirection;
  ! function(e) {
    e[e.Left = 1] = 'Left', e[e.Center = 2] = 'Center', e[e.Right = 4] = 'Right', e[e.Full = 7] = 'Full';
  }(t.OverviewRulerLane || (t.OverviewRulerLane = {}));
  t.OverviewRulerLane;
  ! function(e) {
    e[e.TextDefined = 0] = 'TextDefined', e[e.LF = 1] = 'LF', e[e.CRLF = 2] = 'CRLF';
  }(t.EndOfLinePreference || (t.EndOfLinePreference = {}));
  t.EndOfLinePreference;
  ! function(e) {
    e[e.AlwaysGrowsWhenTypingAtEdges = 0] = 'AlwaysGrowsWhenTypingAtEdges', e[e.NeverGrowsWhenTypingAtEdges = 1] =
      'NeverGrowsWhenTypingAtEdges', e[e.GrowsOnlyWhenTypingBefore = 2] = 'GrowsOnlyWhenTypingBefore', e[e.GrowsOnlyWhenTypingAfter =
        3] = 'GrowsOnlyWhenTypingAfter';
  }(t.TrackedRangeStickiness || (t.TrackedRangeStickiness = {}));
  t.TrackedRangeStickiness;
  ! function(e) {
    e[e.EXACT = 0] = 'EXACT', e[e.ABOVE = 1] = 'ABOVE', e[e.BELOW = 2] = 'BELOW';
  }(t.ContentWidgetPositionPreference || (t.ContentWidgetPositionPreference = {}));
  t.ContentWidgetPositionPreference;
  ! function(e) {
    e[e.TOP_RIGHT_CORNER = 0] = 'TOP_RIGHT_CORNER', e[e.TOP_CENTER = 1] = 'TOP_CENTER';
  }(t.OverlayWidgetPositionPreference || (t.OverlayWidgetPositionPreference = {}));
  t.OverlayWidgetPositionPreference;
  ! function(e) {
    e[e.UNKNOWN = 0] = 'UNKNOWN', e[e.TEXTAREA = 1] = 'TEXTAREA', e[e.GUTTER_GLYPH_MARGIN = 2] =
      'GUTTER_GLYPH_MARGIN', e[e.GUTTER_LINE_NUMBERS = 3] = 'GUTTER_LINE_NUMBERS', e[e.GUTTER_LINE_DECORATIONS = 4] =
      'GUTTER_LINE_DECORATIONS', e[e.GUTTER_VIEW_ZONE = 5] = 'GUTTER_VIEW_ZONE', e[e.CONTENT_TEXT = 6] =
      'CONTENT_TEXT', e[e.CONTENT_EMPTY = 7] = 'CONTENT_EMPTY', e[e.CONTENT_VIEW_ZONE = 8] = 'CONTENT_VIEW_ZONE', e[e
        .CONTENT_WIDGET = 9] = 'CONTENT_WIDGET', e[e.OVERVIEW_RULER = 10] = 'OVERVIEW_RULER', e[e.SCROLLBAR = 11] =
      'SCROLLBAR', e[e.OVERLAY_WIDGET = 12] = 'OVERLAY_WIDGET';
  }(t.MouseTargetType || (t.MouseTargetType = {}));
  t.MouseTargetType;
})