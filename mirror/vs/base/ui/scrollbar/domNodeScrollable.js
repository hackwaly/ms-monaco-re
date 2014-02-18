define(["vs/base/lib/winjs.base", "vs/base/dom/dom", "./scrollable", "vs/base/eventEmitter"], function(a, b, c, d) {
  var e = b;

  var f = c.Scrollable;

  var g = d.EventEmitter;

  var h = a.Class.derive(f, function(b) {
    f.call(this);

    this.domNode = b;
  }, {
    getScrollHeight: function() {
      return this.domNode.scrollHeight;
    },
    getScrollWidth: function() {
      return this.domNode.scrollWidth;
    },
    getScrollLeft: function() {
      return this.domNode.scrollLeft;
    },
    setScrollLeft: function(a) {
      this.domNode.scrollLeft = a;
    },
    getScrollTop: function() {
      return this.domNode.scrollTop;
    },
    setScrollTop: function(a) {
      this.domNode.scrollTop = a;
    },
    addListener: function(a, b) {
      var c = g.prototype.addListener.call(this, a, b);

      var d = e.addListener(this.domNode, a, function(b) {
        this.emit(a, {
          browserEvent: b
        });
      }.bind(this));
      return function() {
        d();

        c();
      };
    }
  });
  return {
    DomNodeScrollable: h
  };
});