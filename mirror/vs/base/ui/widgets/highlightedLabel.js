define(["require", "exports", "vs/base/dom/dom", "vs/base/objects", "vs/css!./highlightedlabel"], function(a, b, c, d) {
  var e = c,
    f = d,
    g = function() {
      function a(a, b, c) {
        typeof b == "undefined" && (b = ""), typeof c == "undefined" && (c = []), this.domNode = document.createElement(
          "span"), this.domNode.className = "monaco-highlighted-label", a.getHTMLElement().appendChild(this.domNode),
          this.text = b, this.highlights = c, this.renderedOnce = !1
      }
      return a.prototype.destroy = function() {
        this.text = null, this.highlights = null
      }, a.prototype.getHTMLElement = function() {
        return this.domNode
      }, a.prototype.setValue = function(a, b) {
        typeof a == "undefined" && (a = ""), typeof b == "undefined" && (b = []);
        if (this.renderedOnce && this.text === a && f.equals(this.highlights, b)) return;
        this.text = a, this.highlights = b, this.render(), this.renderedOnce = !0
      }, a.prototype.render = function() {
        e.clearNode(this.domNode);
        var a = [],
          b, c = 0;
        for (var d = 0; d < this.highlights.length; d++) b = this.highlights[d], c < b.start && (a.push("<span>"), a.push(
          this.text.substring(c, b.start)), a.push("</span>"), c = b.end), a.push('<span class="highlight">'), a.push(
          this.text.substring(b.start, b.end)), a.push("</span>"), c = b.end;
        c < this.text.length && (a.push("<span>"), a.push(this.text.substring(c)), a.push("</span>")), this.domNode.innerHTML =
          a.join("")
      }, a
    }();
  b.HighlightedLabel = g
})