define("vs/languages/typescript/resources/remoteModels", ["require", "exports", "vs/editor/core/model/mirrorModel"],
  function(e, t, n) {
    var r = function(e) {
      function t(n, r) {
        e.call(this, [], 1, t.normalize(r), n);
      }
      __extends(t, e);

      t.normalize = function(e) {
        e.length > 0 && e.charCodeAt(0) === t._bom && (e = e.substring(1));

        return e.replace(/\r\n/g, "\n");
      };

      t._bom = 65279;

      return t;
    }(n.AbstractMirrorModel);
    t.RemoteModel = r;
    var i = function(e) {
      function t(t, n) {
        e.call(this, t, n);
      }
      __extends(t, e);

      return t;
    }(r);
    t.DefaultLibModel = i;
  });