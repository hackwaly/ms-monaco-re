define("vs/base/ui/widgets/highlightedLabel", ["require", "exports", "vs/base/dom/dom", "vs/base/objects",
  "vs/css!./highlightedlabel"
], function(e, t, n, i) {
  var o = function() {
    function e(e, t, n) {
      "undefined" == typeof t && (t = "");

      "undefined" == typeof n && (n = []);

      this.domNode = document.createElement("span");

      this.domNode.className = "monaco-highlighted-label";

      e.getHTMLElement().appendChild(this.domNode);

      this.text = t;

      this.highlights = n;

      this.renderedOnce = !1;
    }
    e.prototype.destroy = function() {
      this.text = null;

      this.highlights = null;
    };

    e.prototype.getHTMLElement = function() {
      return this.domNode;
    };

    e.prototype.setValue = function(e, t) {
      "undefined" == typeof e && (e = "");

      "undefined" == typeof t && (t = []);

      this.renderedOnce && this.text === e && i.equals(this.highlights, t) || (this.text = e, this.highlights = t,
        this.render(), this.renderedOnce = !0);
    };

    e.prototype.render = function() {
      n.clearNode(this.domNode);
      for (var e, t = [], i = 0, o = 0; o < this.highlights.length; o++) e = this.highlights[o];

      i < e.start && (t.push("<span>"), t.push(this.text.substring(i, e.start)), t.push("</span>"), i = e.end);

      t.push('<span class="highlight">');

      t.push(this.text.substring(e.start, e.end));

      t.push("</span>");

      i = e.end;
      i < this.text.length && (t.push("<span>"), t.push(this.text.substring(i)), t.push("</span>"));

      this.domNode.innerHTML = t.join("");
    };

    return e;
  }();
  t.HighlightedLabel = o;
});