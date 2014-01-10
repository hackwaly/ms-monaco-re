define(["require", "exports", "vs/base/assert"], function(a, b, c) {
  function f(a) {
    return Math.floor(a * Math.random())
  }

  function h() {
    var a = f(3);
    return g[a]
  }

  function j() {
    var a = [f(4294967295), f(65535), i + f(4095), h() + f(4095), f(0xffffffffffff)];
    return new e(a)
  }

  function k(a) {
    var b = a.split("-"),
      c = [];
    if (b.length !== 5 || b[0].length !== 8 || b[1].length !== 4 || b[2].length !== 4 || b[3].length !== 4 || b[4].length !==
      12) throw new Error("invalid uuid");
    return c = b.map(function(a) {
      var b = parseInt(a, 16);
      if (isNaN(b)) throw new Error("invalid uuid");
      return b
    }), new e(c)
  }
  var d = c,
    e = function() {
      function a(a) {
        this.numbers = a, d.ok(a[2] >= 16384 && a[2] < 20480, "illegal version bit"), d.ok(a[3] >= 32768 && a[3] <
          49152, "illegal timehigh bit")
      }
      return a.prototype.equals = function(a) {
        return this.asHex() === a.asHex()
      }, a.toHexString = function(a, b) {
        var c = a.toString(16),
          d = b - c.length;
        while (d-- > 0) c = "0" + c;
        return c
      }, a.prototype.asHex = function() {
        return this.asHexCached || (this.asHexCached = [a.toHexString(this.numbers[0], 8), a.toHexString(this.numbers[
          1], 4), a.toHexString(this.numbers[2], 4), a.toHexString(this.numbers[3], 4), a.toHexString(this.numbers[
          4], 12)].join("-")), this.asHexCached
      }, a
    }(),
    g = [36863, 40959, 45055, 49151],
    i = 16384;
  b.v4 = j, b.parse = k
})