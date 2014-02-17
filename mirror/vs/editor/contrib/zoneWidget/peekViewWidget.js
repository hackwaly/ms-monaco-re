define("vs/editor/contrib/zoneWidget/peekViewWidget", ["require", "exports", "vs/nls!vs/editor/editor.main",
  "vs/base/ui/widgets/actionbar", "vs/base/ui/actions", "vs/base/strings", "vs/base/dom/builder", "vs/base/dom/dom",
  "./zoneWidget", "vs/css!./peekViewWidget"
], function(e, t, n, i, o, r, s, a, u) {
  var l = function(e) {
    function t() {
      e.apply(this, arguments);
    }
    __extends(t, e);

    t.prototype.dispose = function() {
      this._isActive = !1;

      e.prototype.dispose.call(this);
    };

    Object.defineProperty(t.prototype, "isActive", {
      get: function() {
        return this._isActive;
      },
      enumerable: !0,
      configurable: !0
    });

    t.prototype.getActiveWidget = function() {
      return this;
    };

    t.prototype.show = function(t, n) {
      this._isActive = !0;

      e.prototype.show.call(this, t, n);
    };

    t.prototype.fillContainer = function(e) {
      s.$(e).addClass("peekview-widget");

      this._headElement = s.$(".head").getHTMLElement();

      this._bodyElement = s.$(".body").getHTMLElement();

      this._fillHead(this._headElement);

      this._fillBody(this._bodyElement);

      e.appendChild(this._headElement);

      e.appendChild(this._bodyElement);
    };

    t.prototype._fillHead = function() {
      var e = this;

      var t = s.$(".peekview-title").on(a.EventType.CLICK, function(t) {
        return e._onTitleClick(t);
      }).appendTo(this._headElement).getHTMLElement();
      this._filenameElement = s.$("span.filename").appendTo(t).getHTMLElement();

      this._dirnameElement = s.$("span.dirname").appendTo(t).getHTMLElement();

      this._actionbarWidget = new i.ActionBar;

      s.$(".peekview-actions").append(this._actionbarWidget.domNode).appendTo(this._headElement);

      this._actionbarWidget.push(new o.Action("peekview.close", n.localize(
        "vs_editor_contrib_zoneWidget_peekViewWidget", 0), "close-peekview-action", !0, function() {
        e.dispose();

        return null;
      }), {
        label: !1,
        icon: !0
      });
    };

    t.prototype._onTitleClick = function() {};

    t.prototype.setTitle = function(e, t) {
      s.$(this._filenameElement).safeInnerHtml(e);

      t ? s.$(this._dirnameElement).safeInnerHtml(r.rtrim(t, "/")) : a.clearNode(this._dirnameElement);
    };

    t.prototype._fillBody = function() {};

    t.prototype.doLayout = function(e) {
      var t = Math.ceil(1.2 * this.editor.getConfiguration().lineHeight);

      var n = e - (t + 2);
      this._doLayoutHead(t);

      this._doLayoutBody(n);
    };

    t.prototype._doLayoutHead = function(e) {
      this._headElement.style.height = r.format("{0}px", e);
    };

    t.prototype._doLayoutBody = function(e) {
      this._bodyElement.style.height = r.format("{0}px", e);
    };

    return t;
  }(u.ZoneWidget);
  t.PeekViewWidget = l;
});