define(["require", "exports"], function(a, b) {
  function c(a) {
    if (a.isText) {
      return document.createTextNode(a.text);
    }
    var c = a.tagName || "div";

    var d = document.createElement(c);
    a.className && (d.className = a.className);

    a.text && (d.textContent = a.text);

    a.style && d.setAttribute("style", a.style);

    a.customStyle && Object.keys(a.customStyle).forEach(function(b) {
      d.style[b] = a.customStyle[b];
    });

    a.children && a.children.forEach(function(a) {
      d.appendChild(b.renderHtml(a));
    });

    return d;
  }
  b.renderHtml = c;
});