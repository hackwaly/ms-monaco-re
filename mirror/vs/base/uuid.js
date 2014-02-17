define('vs/base/uuid', [
  'require',
  'exports',
  'vs/base/assert'
], function(e, t, n) {
  function i(e) {
    return Math.floor(e * Math.random());
  }

  function o() {
    var e = i(3);
    return u[e];
  }

  function r() {
    var e = [
      i(4294967295),
      i(65535),
      l + i(4095),
      o() + i(4095),
      i(281474976710655)
    ];
    return new a(e);
  }

  function s(e) {
    var t = e.split('-'),
      n = [];
    if (5 !== t.length || 8 !== t[0].length || 4 !== t[1].length || 4 !== t[2].length || 4 !== t[3].length || 12 !==
      t[4].length)
      throw new Error('invalid uuid');
    return n = t.map(function(e) {
      var t = parseInt(e, 16);
      if (isNaN(t))
        throw new Error('invalid uuid');
      return t;
    }), new a(n);
  }
  var a = function() {
    function e(e) {
      this.numbers = e, n.ok(e[2] >= 16384 && e[2] < 20480, 'illegal version bit'), n.ok(e[3] >= 32768 && e[3] <
        49152, 'illegal timehigh bit');
    }
    return e.prototype.equals = function(e) {
      return this.asHex() === e.asHex();
    }, e.toHexString = function(e, t) {
      for (var n = e.toString(16), i = t - n.length; i-- > 0;)
        n = '0' + n;
      return n;
    }, e.prototype.asHex = function() {
      return this.asHexCached || (this.asHexCached = [
        e.toHexString(this.numbers[0], 8),
        e.toHexString(this.numbers[1], 4),
        e.toHexString(this.numbers[2], 4),
        e.toHexString(this.numbers[3], 4),
        e.toHexString(this.numbers[4], 12)
      ].join('-')), this.asHexCached;
    }, e.prototype.toString = function() {
      return this.asHex();
    }, e;
  }(),
    u = [
      36863,
      40959,
      45055,
      49151
    ],
    l = 16384;
  t.v4 = r, t.parse = s;
})