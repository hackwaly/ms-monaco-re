var __extends = this.__extends || function(a, b) {
    function d() {
      this.constructor = a
    }
    for (var c in b) b.hasOwnProperty(c) && (a[c] = b[c]);
    d.prototype = b.prototype, a.prototype = new d
  };
define(["require", "exports", "vs/base/worker/workerClient", "vs/editor/core/constants", "vs/editor/editor"], function(
  a, b, c, d, e) {
  var f = c,
    g = d,
    h = e,
    i = function(a) {
      function b(b, c, d) {
        a.call(this, new f.DefaultWorkerFactory(c), "vs/editor/worker/editorWorkerServer"), this.languageModeModuleId =
          b, this.friendlyModuleId = this.languageModeModuleId;
        var e = this.friendlyModuleId.lastIndexOf("/");
        e >= 0 && (this.friendlyModuleId = this.friendlyModuleId.substr(e + 1));
        var g = {
          languageModeModuleId: b,
          extraData: d.extraData,
          configData: d.configData,
          workspace: d.contextService ? d.contextService.getWorkspace() : undefined,
          configuration: d.contextService ? d.contextService.getConfiguration() : undefined,
          options: d.contextService ? d.contextService.getOptions() : undefined,
          participants: d.participants ? d.participants.map(function(a) {
            return {
              moduleId: a.getModuleId(),
              ctorName: a.getCtorName()
            }
          }) : []
        };
        this.onModuleLoaded = this.request("initialize", g), this.models = {}, this.modelsUnbind = {}, this.modelsDecorations = {},
          this.modelsValidateTimeout = {}, this.modelsValidateRequest = {}
      }
      return __extends(b, a), b.prototype._decodeMessageName = function(a) {
        var b = a.type;
        return a.type === "rawRequest" && (b = a.payload.name), this.friendlyModuleId + " - " + b
      }, b.prototype.addWorkerParticipant = function(a) {
        this.request("addWorkerParticipant", {
          moduleId: a.getModuleId(),
          ctorName: a.getCtorName()
        })
      }, b.prototype.modelDecorationsUpdate = function(a) {
        if (this.models.hasOwnProperty(a.modelId)) {
          var b = this.models[a.modelId],
            c = [];
          for (var d in a.decorations) a.decorations.hasOwnProperty(d) && c.push(a.decorations[d]);
          this.modelsDecorations[b.id] = b.deltaDecorations(this.modelsDecorations[b.id] || [], c)
        }
      }, b.prototype.unbindModel = function(a) {
        this.modelsUnbind[a.id](), delete this.modelsUnbind[a.id], delete this.models[a.id], delete this.modelsDecorations[
          a.id], this.modelsValidateTimeout.hasOwnProperty(a.id) && (window.clearTimeout(this.modelsValidateTimeout[a
          .id]), delete this.modelsValidateTimeout[a.id]), this.modelsValidateRequest.hasOwnProperty(a.id) && (this.modelsValidateRequest[
          a.id].cancel(), delete this.modelsValidateRequest[a.id]), this.request("modelDestroy", [a.getAssociatedResource()],
          0)
      }, b.prototype._mixinProperties = function(a, b, c) {
        for (var d = 0; d < c.length; d++) a[c[d]] = b[c[d]];
        return a
      }, b.prototype._setupValidation = function(a) {
        var b = this,
          c = a.id,
          d = a.getAssociatedResource();
        this.modelsValidateTimeout.hasOwnProperty(c) && (window.clearTimeout(this.modelsValidateTimeout[c]), delete this
          .modelsValidateTimeout[c]), this.modelsValidateRequest.hasOwnProperty(c) && (this.modelsValidateRequest[c].cancel(),
          delete this.modelsValidateRequest[c]), this.modelsValidateTimeout[c] = window.setTimeout(function() {
          delete b.modelsValidateTimeout[c], b.modelsValidateRequest[c] = b.request("validate", [d, !1])
        }, 500)
      }, b.prototype.bindModel = function(a) {
        var b = this;
        this.request("modelInitialize", [a.id, a.getVersionId(), a.getValue(h.EndOfLinePreference.LF), a.getProperties(),
          a.getAssociatedResource()
        ], 0), this._setupValidation(a), this.models[a.id] = a, this.modelsUnbind[a.id] = a.addBulkListener(function(
          c) {
          var d = [],
            e = !1;
          for (var f = 0, h = c.length; f < h; f++) {
            var i = c[f],
              j = i.getData();
            switch (i.getType()) {
              case g.EventType.ModelContentChanged:
                switch (j.changeType) {
                  case g.EventType.ModelContentChangedFlush:
                    d.push(b._mixinProperties({
                      type: i.getType()
                    }, j, ["changeType", "detail", "versionId"]));
                    break;
                  case g.EventType.ModelContentChangedLinesDeleted:
                    d.push(b._mixinProperties({
                      type: i.getType()
                    }, j, ["changeType", "fromLineNumber", "toLineNumber", "versionId"]));
                    break;
                  case g.EventType.ModelContentChangedLinesInserted:
                    d.push(b._mixinProperties({
                      type: i.getType()
                    }, j, ["changeType", "fromLineNumber", "toLineNumber", "detail", "versionId"]));
                    break;
                  case g.EventType.ModelContentChangedLineChanged:
                    d.push(b._mixinProperties({
                      type: i.getType()
                    }, j, ["changeType", "lineNumber", "detail", "versionId"]))
                }
                e = !0;
                break;
              case g.EventType.ModelPropertiesChanged:
                d.push(b._mixinProperties({
                  type: i.getType()
                }, j, ["properties"]))
            }
          }
          d.length > 0 && b._sendModelEvent(a, d), e && b._setupValidation(a)
        })
      }, b.prototype._sendModelEvent = function(a, b) {
        this.request("modelEvents", [a.getAssociatedResource(), b], 0)
      }, b.prototype._onError = function(a, b) {
        console.error("[" + this.languageModeModuleId + "]: " + a), console.error(b)
      }, b.prototype.publishMarkerUpdates = function(a) {
        for (var b = 0; b < a.length; b++) {
          var c = a[b],
            d = c.model.id,
            e = this.models[d];
          e && e._publishMarkerUpdate(c)
        }
      }, b
    }(f.WorkerClient);
  b.EditorWorkerClient = i
})