define(["vs/base/lib/winjs.base", "vs/base/eventEmitter"], function(a, b) {
  var c = b.EventEmitter;

  var d = a.Class.derive(c, function() {
    c.call(this);
  }, {
    getScrollHeight: function() {},
    getScrollWidth: function() {},
    getScrollLeft: function() {},
    setScrollLeft: function(a) {},
    getScrollTop: function() {},
    setScrollTop: function(a) {}
  });
  return {
    Scrollable: d
  };
});