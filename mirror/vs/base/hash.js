define('vs/base/hash', [
  'require',
  'exports'
], function(e, t) {
  function n(e) {
    for (var t = 1540483477, n = 24, i = 0, o = e.length, r = o, s = 0 ^ r, a = i; r >= 2;) {
      var u = e.charCodeAt(a),
        l = e.charCodeAt(a + 1),
        c = u | l << 16;
      c *= t, c ^= c >> n, c *= t, s *= t, s ^= c, a += 2, r -= 2;
    }
    return 1 === r && (s ^= e.charCodeAt(a), s *= t), s ^= s >> 13, s *= t, s ^= s >> 15;
  }

  function i(e, t) {
    return (t << 5) + t + e & 2147483647;
  }
  t.computeMurmur2StringHashCode = n, t.combine = i;
})