define("vs/editor/worker/editorWorkerClient", ["require", "exports", "vs/base/worker/workerClient",
  "vs/editor/core/constants", "vs/editor/editor"
], function(e, t, n, i) {
  var o = function() {
    function e(e, t) {
      var n = this;
      this._request = t;

      this._model = e;

      this._url = this._model.getAssociatedResource();

      this._toUnbind = this._model.addBulkListener(function(e) {
        return n._onModelEvents(e);
      });

      this._validateTimeout = -1;

      this._validateRequest = null;

      this._setupValidation();

      this._sendInitialize();
    }
    e.prototype.dispose = function() {
      this._sendDestroy();

      this._url = null;

      this._request = null;

      this._model = null;

      this._toUnbind();

      this._toUnbind = null;

      this._clearTimersAndPromises();
    };

    e.prototype.publishMarkerUpdate = function(e) {
      this._model._publishMarkerUpdate(e);
    };

    e.prototype._clearTimersAndPromises = function() {
      -1 !== this._validateTimeout && (clearTimeout(this._validateTimeout), this._validateTimeout = -1);

      this._validateRequest && (this._validateRequest.cancel(), this._validateRequest = null);
    };

    e.prototype._onModelEvents = function(e) {
      var t;

      var n;

      var o = [];

      var r = !1;
      for (t = 0, n = e.length; n > t; t++) {
        var s = e[t];

        var a = s.getData();
        switch (s.getType()) {
          case i.EventType.ModelContentChanged:
            switch (a.changeType) {
              case i.EventType.ModelContentChangedFlush:
                o.push(this._mixinProperties({
                  type: s.getType()
                }, a, ["changeType", "detail", "versionId"]));
                break;
              case i.EventType.ModelContentChangedLinesDeleted:
                o.push(this._mixinProperties({
                  type: s.getType()
                }, a, ["changeType", "fromLineNumber", "toLineNumber", "versionId"]));
                break;
              case i.EventType.ModelContentChangedLinesInserted:
                o.push(this._mixinProperties({
                  type: s.getType()
                }, a, ["changeType", "fromLineNumber", "toLineNumber", "detail", "versionId"]));
                break;
              case i.EventType.ModelContentChangedLineChanged:
                o.push(this._mixinProperties({
                  type: s.getType()
                }, a, ["changeType", "lineNumber", "detail", "versionId"]));
            }
            r = !0;
            break;
          case i.EventType.ModelPropertiesChanged:
            o.push(this._mixinProperties({
              type: s.getType()
            }, a, ["properties"]));
        }
      }
      o.length > 0 && this._sendModelEvent(o);

      r && this._setupValidation();
    };

    e.prototype._mixinProperties = function(e, t, n) {
      for (var i = 0; i < n.length; i++) e[n[i]] = t[n[i]];
      return e;
    };

    e.prototype._setupValidation = function() {
      var e = this;
      this._clearTimersAndPromises();
      var t = this._model.getMode().validationSupport;
      t && t.autoValidateDelay >= 0 && (this._validateTimeout = setTimeout(function() {
        e._validateTimeout = -1;

        e._validateRequest = e._sendValidate();
      }, t.autoValidateDelay));
    };

    e.prototype._sendInitialize = function() {
      var e = this._model.getVersionId();

      var t = this._model.getValue(1);

      var n = this._model.getProperties();
      this._request("modelInitialize", [e, t, n, this._url], 0);
    };

    e.prototype._sendDestroy = function() {
      this._request("modelDestroy", [this._url], 0);
    };

    e.prototype._sendModelEvent = function(e) {
      this._request("modelEvents", [this._url, e], 0);
    };

    e.prototype._sendValidate = function() {
      return this._request("validate", [this._url]);
    };

    return e;
  }();

  var r = function(e) {
    function t(t, i, o) {
      e.call(this, new n.DefaultWorkerFactory(i), "vs/editor/worker/editorWorkerServer");

      this._languageModeModuleId = t;

      this.friendlyModuleId = this._languageModeModuleId;
      var r = this.friendlyModuleId.lastIndexOf("/");
      r >= 0 && (this.friendlyModuleId = this.friendlyModuleId.substr(r + 1));
      var s = {
        languageModeModuleId: t,
        extraData: o.extraData,
        configData: o.configData,
        workspace: o.contextService ? o.contextService.getWorkspace() : void 0,
        configuration: o.contextService ? o.contextService.getConfiguration() : void 0,
        options: o.contextService ? o.contextService.getOptions() : void 0,
        participants: o.participants ? o.participants.map(function(e) {
          return {
            moduleId: e.getModuleId(),
            ctorName: e.getCtorName()
          };
        }) : []
      };
      this.onModuleLoaded = this.request("initialize", s);

      this._models = {};
    }
    __extends(t, e);

    Object.defineProperty(t.prototype, "moduleIdentifier", {
      get: function() {
        return this._languageModeModuleId;
      },
      enumerable: !0,
      configurable: !0
    });

    t.prototype._decodeMessageName = function(e) {
      var t = e.type;
      "rawRequest" === e.type && (t = e.payload.name);

      return this.friendlyModuleId + " - " + t;
    };

    t.prototype.addWorkerParticipant = function(e) {
      this.request("addWorkerParticipant", {
        moduleId: e.getModuleId(),
        ctorName: e.getCtorName()
      });
    };

    t.prototype.bindModel = function(e) {
      var t = this;

      var n = e.getAssociatedResource().toExternal();
      this._models[n] = new o(e, function(e, n, i) {
        return t.request(e, n, i);
      });
    };

    t.prototype.unbindModel = function(e) {
      var t = e.getAssociatedResource().toExternal();
      this._models.hasOwnProperty(t) && (this._models[t].dispose(), delete this._models[t]);
    };

    t.prototype._onError = function(e, t) {
      console.error("[" + this._languageModeModuleId + "]: " + e);

      console.error(t);
    };

    t.prototype.publishMarkerUpdates = function(e) {
      for (var t = 0; t < e.length; t++) {
        var n = e[t];
        if (n.model) {
          var i = this._models[n.resource];
          i && i.publishMarkerUpdate(n);
        }
      }
    };

    return t;
  }(n.WorkerClient);
  t.EditorWorkerClient = r;
});