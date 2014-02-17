define('vs/editor/modes/monarch/monarchCommon', [
  'require',
  'exports'
], function(e, t) {
  function n() {
    return '0.96  (2013.01.22)';
  }

  function i(e) {
    return e ? !1 : !0;
  }

  function o(e, t) {
    return e.ignoreCase && t ? t.toLowerCase() : t;
  }

  function r(e) {
    return e.replace(g, function(e) {
      var t = f[e];
      return t ? t : '';
    });
  }

  function s(e) {
    return e.replace(/[&<>'"]/g, '_');
  }

  function a(e, t) {
    e.textContent += t;
  }

  function u(e, t) {
    if (e) {
      var n = document.getElementById(e);
      n && (a(n, t + '\n'), n.scrollTop && (n.scrollTop = n.scrollHeight));
    }
    console && console.log(t);
  }

  function l(e, t) {
    u(e.logConsole, t);
  }

  function c(e, t) {
    if (!e)
      throw new Error(t);
    if (t = e.displayName + ' highlighter: ' + t, e.logConsole) {
      var n = document.getElementById(e.logConsole);
      n && a(n, t + '\n');
    }
    if (!e.noThrow)
      throw new Error(t);
    console && console.log(t);
  }

  function d(e, n, i, o, r) {
    var s = /\$((\$)|(#)|(\d\d?)|[sS](\d\d?)|@(\w+))/g,
      a = null;
    return n.replace(s, function(n, s, u, l, c, d, h) {
      return t.empty(u) ? t.empty(l) ? !t.empty(c) && c < o.length ? t.fixCase(e, o[c]) : !t.empty(h) && e &&
        'string' == typeof e[h] ? e[h] : (null === a && (a = r.split('.'), a.unshift(r)), !t.empty(d) && d < a.length ?
          t.fixCase(e, a[d]) : '') : t.fixCase(e, i) : '$';
    });
  }

  function h(e, t) {
    for (; t && t.length > 0;) {
      var n = e.tokenizer[t];
      if (n)
        return n;
      var i = t.lastIndexOf('.');
      t = 0 > i ? null : t.substr(0, i);
    }
    return null;
  }

  function p(e, t) {
    for (; t && t.length > 0;) {
      var n = e.stateNames[t];
      if (n)
        return !0;
      var i = t.lastIndexOf('.');
      t = 0 > i ? null : t.substr(0, i);
    }
    return !1;
  }
  t.monarchPath = 'vs/editor/modes/monarch/monarch', t.version = n, t.empty = i, t.fixCase = o;
  var f = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '\'': '&apos;',
    '"': '&quot;'
  }, g = new RegExp('[' + Object.keys(f).join('') + ']', 'g');
  t.htmlEscape = r, t.sanitize = s, t.log = l, t.throwError = c, t.substituteMatches = d, t.findRules = h, t.stateExists =
    p;
})