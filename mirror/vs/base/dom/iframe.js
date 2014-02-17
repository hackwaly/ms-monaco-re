define("vs/base/dom/iframe", ["require", "exports"], function(e, t) {
  function n(e) {
    if (!e.parent || e.parent === e) return null;
    try {
      var t = e.location;

      var n = e.parent.location;
      if (t.protocol !== n.protocol || t.hostname !== n.hostname || t.port !== n.port) a = !0;

      return null;
    } catch (i) {
      a = !0;

      return null;
    }
    return e.parent;
  }

  function i(e, t) {
    for (var n, i = e.document.getElementsByTagName("iframe"), o = 0, r = i.length; r > o; o++)
      if (n = i[o], n.contentWindow === t) return n;
    return null;
  }

  function o() {
    if (!u) {
      u = [];
      var e;

      var t = window;
      do e = n(t);

      e ? u.push({
        window: t,
        iframeElement: i(e, t)
      }) : u.push({
        window: t,
        iframeElement: null
      });

      t = e;
      while (t);
    }
    return u.slice(0);
  }

  function r() {
    u || t.getSameOriginWindowChain();

    return a;
  }

  function s(e, n) {
    if (!n || e === n) return {
      top: 0,
      left: 0
    };
    for (var i = 0, o = 0, r = t.getSameOriginWindowChain(), s = 0; s < r.length; s++) {
      var a = r[s];
      if (a.window === n) break;
      if (!a.iframeElement) break;
      var u = a.iframeElement.getBoundingClientRect();
      i += u.top;

      o += u.left;
    }
    return {
      top: i,
      left: o
    };
  }
  var a = !1;

  var u = null;
  t.getSameOriginWindowChain = o;

  t.hasDifferentOriginAncestor = r;

  t.getPositionOfChildWindowRelativeToAncestorWindow = s;
});