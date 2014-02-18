var __extends = this.__extends || function(d, b) {
    for (var p in b)
      if (b.hasOwnProperty(p)) {
        d[p] = b[p];
      }

    function __() {
      this.constructor = d;
    }
    __.prototype = b.prototype;
    d.prototype = new __;
  };

define(["require", "exports", "vs/languages/typescript/lib/typescriptServices"], function(require, exports,
  __typeScriptServices__) {
  "use strict";
  var typeScriptServices = __typeScriptServices__;
  var ConsoleLogger = function() {
    function ConsoleLogger() {
      this.logger = console.warn;
    }
    ConsoleLogger.prototype.information = function() {
      this.logger = console.log;
      return false;
    };
    ConsoleLogger.prototype.debug = function() {
      this.logger = console.log;
      return false;
    };
    ConsoleLogger.prototype.warning = function() {
      this.logger = console.warn;
      return true;
    };
    ConsoleLogger.prototype.error = function() {
      this.logger = console.error;
      return true;
    };
    ConsoleLogger.prototype.fatal = function() {
      this.logger = console.error;
      return true;
    };
    ConsoleLogger.prototype.log = function(s) {};
    return ConsoleLogger;
  }();
  exports.ConsoleLogger = ConsoleLogger;
  var MirrorModelSnapshot = function() {
    function MirrorModelSnapshot(model) {
      this.model = model;
      this.versionId = model.versionId;
      this.open = false;
      this.value = model.getValue();
      this.length = this.value.length;
      this.changeRange = new typeScriptServices.TypeScript.TextChangeRange(new typeScriptServices.TypeScript.TextSpan(
        0, this.length), this.length);
    }
    MirrorModelSnapshot.prototype.getText = function(start, end) {
      return this.value.substring(start, end);
    };
    MirrorModelSnapshot.prototype.getLength = function() {
      return this.length;
    };
    MirrorModelSnapshot.prototype.getLineStartPositions = function() {
      if (!this.lineStarts) {
        this.lineStarts = [];
        for (var i = 0, len = this.model.getLineCount(); i < len; i++) {
          this.lineStarts.push(this.model.getLineStart(i + 1));
        }
      }
      return this.lineStarts;
    };
    MirrorModelSnapshot.prototype.getTextChangeRangeSinceVersion = function(scriptVersion) {
      return this.changeRange;
    };
    return MirrorModelSnapshot;
  }();
  var LanguageServiceHost = function(_super) {
    __extends(LanguageServiceHost, _super);

    function LanguageServiceHost() {
      _super.call(this);
      this._compilationSettings = new typeScriptServices.TypeScript.CompilationSettings;
      this._resourceSet = {};
    }
    Object.defineProperty(LanguageServiceHost.prototype, "resourceService", {
      set: function(service) {
        this._resourceService = service;
      },
      enumerable: true,
      configurable: true
    });
    Object.defineProperty(LanguageServiceHost.prototype, "resources", {
      set: function(resources) {
        var copyResourceSet = {};
        for (var i = 0, len = resources.length; i < len; i++) {
          var element = resources[i];

          var model = this._resourceService.get(element);
          if (!model) {
            console.warn(element.toExternal() + " NOT found");
            continue;
          }
          var url = element.toExternal();

          var versionId = model.versionId;

          var currentSnapshot = this._resourceSet[url];
          if (currentSnapshot && currentSnapshot.versionId === versionId) {
            copyResourceSet[url] = currentSnapshot;
          } else {
            copyResourceSet[url] = new MirrorModelSnapshot(model);
          }
        }
        this._resourceSet = copyResourceSet;
      },
      enumerable: true,
      configurable: true
    });
    Object.defineProperty(LanguageServiceHost.prototype, "compilationSettings", {
      set: function(settings) {
        this._compilationSettings = settings;
      },
      enumerable: true,
      configurable: true
    });
    LanguageServiceHost.prototype.isScriptFileName = function(fileName) {
      return this._resourceSet.hasOwnProperty(fileName);
    };
    LanguageServiceHost.prototype.getCompilationSettings = function() {
      return this._compilationSettings;
    };
    LanguageServiceHost.prototype.getScriptFileNames = function() {
      return Object.keys(this._resourceSet);
    };
    LanguageServiceHost.prototype.getScriptVersion = function(fileName) {
      return this._resourceSet[fileName].versionId;
    };
    LanguageServiceHost.prototype.getScriptIsOpen = function(fileName) {
      return this._resourceSet[fileName].open;
    };
    LanguageServiceHost.prototype.getScriptSnapshot = function(fileName) {
      return this._resourceSet[fileName];
    };
    LanguageServiceHost.prototype.getDiagnosticsObject = function() {
      return this;
    };
    return LanguageServiceHost;
  }(ConsoleLogger);
  exports.LanguageServiceHost = LanguageServiceHost;
});