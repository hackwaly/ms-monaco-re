"use strict";

var __extends = this.__extends || function(e, t) {
    function r() {
      this.constructor = e;
    }
    for (var n in t) {
      if (t.hasOwnProperty(n)) {
        e[n] = t[n];
      }
    }
    r.prototype = t.prototype;

    e.prototype = new r;
  };

define("vs/languages/nullWorker", ["require", "exports", "vs/editor/worker/modesWorker"], function(e, t, r) {
  var n = function(e) {
    function t() {
      e.apply(this, arguments);
    }
    __extends(t, e);

    return t;
  }(r.AbstractWorkerMode);
  t.value = new n;
});