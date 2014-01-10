var __extends = this.__extends || function(d, b) {
    for (var p in b)
      if (b.hasOwnProperty(p)) d[p] = b[p];

    function __() {
      this.constructor = d;
    }
    __.prototype = b.prototype;
    d.prototype = new __();
  };
define(["require", "exports", 'vs/base/network', 'vs/editor/core/model/mirrorModel'], function(require, exports,
  __network__, __mirrorModel__) {
  /*---------------------------------------------------------
   * Copyright (C) Microsoft Corporation. All rights reserved.
   *--------------------------------------------------------*/
  'use strict';

  var network = __network__;
  var mirrorModel = __mirrorModel__;

  var RemoteModel = (function(_super) {
    __extends(RemoteModel, _super);

    function RemoteModel(url, content, isGeneratedDFile) {
      if (typeof isGeneratedDFile === "undefined") {
        isGeneratedDFile = false;
      }
      _super.call(this, url.toExternal(), isGeneratedDFile ? -1 : 1, RemoteModel.normalize(content), url);

      if (isGeneratedDFile) {
        var path = url.toExternal();
        this.actualResource = new network.URL(path.substring(0, path.length - 5) + '.ts');
      }
    }
    RemoteModel.normalize = function(value) {
      if (value.length > 0 && value.charCodeAt(0) === RemoteModel._bom) {
        value = value.substring(1);
      }
      return value.replace(/\r\n/g, '\n');
    };

    RemoteModel.prototype.isGenerated = function() {
      return !!this.actualResource;
    };

    RemoteModel.prototype.getActualResource = function() {
      if (!this.actualResource) {
        return this.getAssociatedResource();
      } else {
        return this.actualResource;
      }
    };
    RemoteModel._bom = 65279;
    return RemoteModel;
  })(mirrorModel.MirrorModel);
  exports.RemoteModel = RemoteModel;

  var DefaultLibModel = (function(_super) {
    __extends(DefaultLibModel, _super);

    function DefaultLibModel(url, content) {
      _super.call(this, url, content, false);
    }
    return DefaultLibModel;
  })(RemoteModel);
  exports.DefaultLibModel = DefaultLibModel;

  var AllReferences = (function(_super) {
    __extends(AllReferences, _super);

    function AllReferences(url, content) {
      _super.call(this, url.toExternal(), -1, content, url);
    }
    return AllReferences;
  })(mirrorModel.MirrorModel);
  exports.AllReferences = AllReferences;
});