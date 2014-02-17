define("vs/languages/typescript/service/languageServiceHost2", ["require", "exports", "vs/base/collections",
  "vs/base/errors", "vs/languages/typescript/lib/typescriptServices",
  "vs/languages/typescript/resources/remoteModels"
], function(e, t, n, r, i, o) {
  var s = function() {
    function e() {
      this.logger = console.warn;
    }
    e.prototype.information = function() {
      this.logger = console.log;

      return !0;
    };

    e.prototype.debug = function() {
      this.logger = console.log;

      return !0;
    };

    e.prototype.warning = function() {
      this.logger = console.warn;

      return !0;
    };

    e.prototype.error = function() {
      this.logger = console.error;

      return !0;
    };

    e.prototype.fatal = function() {
      this.logger = console.error;

      return !0;
    };

    e.prototype.log = function() {};

    return e;
  }();
  t.ConsoleLogger = s;
  var a = function(e) {
    function t() {
      e.apply(this, arguments);
    }
    __extends(t, e);

    t.prototype.getDiagnosticsObject = function() {
      return this;
    };

    t.prototype.getLocalizedDiagnosticMessages = function() {
      return null;
    };

    t.prototype.getScriptSnapshot = function() {
      throw r.notImplemented();
    };

    t.prototype.resolveRelativePath = function() {
      throw r.notImplemented();
    };

    t.prototype.fileExists = function() {
      throw r.notImplemented();
    };

    t.prototype.directoryExists = function() {
      throw r.notImplemented();
    };

    t.prototype.getParentDirectory = function() {
      throw r.notImplemented();
    };

    return t;
  }(s);
  t.AbstractLanguageServiceHost = a;
  var l = function() {
    function e(e) {
      this._model = e;

      this._versionId = e.getVersionId();

      this._open = !(e instanceof o.RemoteModel);

      this._value = e.getValue();

      this._length = this._value.length;
    }
    Object.defineProperty(e.prototype, "model", {
      get: function() {
        return this._model;
      },
      enumerable: !0,
      configurable: !0
    });

    Object.defineProperty(e.prototype, "versionId", {
      get: function() {
        return this._versionId;
      },
      enumerable: !0,
      configurable: !0
    });

    Object.defineProperty(e.prototype, "open", {
      get: function() {
        return this._open;
      },
      enumerable: !0,
      configurable: !0
    });

    e.prototype.getText = function(e, t) {
      return this._value.substring(e, t);
    };

    e.prototype.getLength = function() {
      return this._length;
    };

    e.prototype.getLineStartPositions = function() {
      if (!this._lineStarts) {
        this._lineStarts = [];
        for (var e = 0, t = this._model.getLineCount(); t > e; e++) {
          this._lineStarts.push(this._model.getLineStart(e + 1));
        }
      }
      return this._lineStarts;
    };

    e.prototype.getTextChangeRangeSinceVersion = function() {
      return null;
    };

    return e;
  }();
  t.MirrorModelSnapshot = l;
  var c = function(e) {
    function t(t) {
      e.call(this);

      this._resourceService = t;

      this._resourceSet = {};

      this._compilationSettings = new i.CompilationSettings;
    }
    __extends(t, e);

    t.prototype.updateResources = function(e) {
      var t = this;
      e.forEach(function(e) {
        return t._updateResource(e);
      });
    };

    t.prototype._updateResource = function(e) {
      var t = e.toExternal();

      var r = this._resourceService.get(e);
      if (r) {
        var i = r.getVersionId();
        n.contains(this._resourceSet, t) && n.lookup(this._resourceSet, t).versionId === i || (this._resourceSet[t] =
          new l(r));
      } else {
        console.warn(e.toExternal() + " NOT found");
        delete this._resourceService[t];
      }
    };

    t.prototype.isScriptFileName = function(e) {
      return n.contains(this._resourceSet, e);
    };

    t.prototype.getCompilationSettings = function() {
      return this._compilationSettings;
    };

    t.prototype.getScriptFileNames = function() {
      return n.keys(this._resourceSet);
    };

    t.prototype.getScriptByteOrderMark = function() {
      return 1;
    };

    t.prototype.getScriptVersion = function(e) {
      return n.lookup(this._resourceSet, e).versionId;
    };

    t.prototype.getScriptIsOpen = function(e) {
      return n.lookup(this._resourceSet, e).open;
    };

    t.prototype.getScriptSnapshot = function(e) {
      return n.lookup(this._resourceSet, e);
    };

    t.prototype.getScriptSnapshotByUrl = function(e) {
      return n.lookup(this._resourceSet, e.toExternal());
    };

    return t;
  }(a);
  t.LanguageServiceHost = c;
});