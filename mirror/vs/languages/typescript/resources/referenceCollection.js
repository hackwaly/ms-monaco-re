var __extends = this.__extends || function(d, b) {
    for (var p in b)
      if (b.hasOwnProperty(p)) d[p] = b[p];

    function __() {
      this.constructor = d;
    }
    __.prototype = b.prototype;
    d.prototype = new __();
  };
define(["require", "exports", 'vs/languages/typescript/service/references', 'vs/editor/worker/resourceService',
  'vs/base/lib/winjs.base', 'vs/base/eventEmitter', 'vs/editor/core/constants'
], function(require, exports, __references__, __resourceService__, __winjs__, __emitter__, __constants__) {
  /*---------------------------------------------------------
   * Copyright (C) Microsoft Corporation. All rights reserved.
   *--------------------------------------------------------*/
  'use strict';

  var references = __references__;

  var resourceService = __resourceService__;
  var winjs = __winjs__;
  var emitter = __emitter__;
  var constants = __constants__;

  var MirrorModelListener = (function(_super) {
    __extends(MirrorModelListener, _super);

    function MirrorModelListener(target, throttleDelay) {
      _super.call(this);
      this.target = target;
      this.throttleDelay = throttleDelay;
      this.throttle = winjs.Promise.as(null);
    }
    MirrorModelListener.prototype.onChange = function(events) {
      var _this = this;
      // Filter out events that aren't modifiactions
      var processEvents = events.some(function(event) {
        switch (event.getType()) {
          case constants.EventType.ModelContentChangedLineChanged:
          case constants.EventType.ModelContentChangedLinesInserted:
          case constants.EventType.ModelContentChangedLinesDeleted:
          case constants.EventType.ModelContentChangedFlush:
            return true;
          default:
            return false;
        }
      });

      if (processEvents) {
        return;
      }

      this.throttle.cancel();
      this.throttle = winjs.Promise.timeout(this.throttleDelay);
      this.throttle.then(function() {
        _this.onContentChange();
      });
    };

    MirrorModelListener.prototype.onContentChange = function() {
      throw new Error('implement me');
    };
    return MirrorModelListener;
  })(emitter.EventEmitter);
  exports.MirrorModelListener = MirrorModelListener;

  var ReferencesState = (function(_super) {
    __extends(ReferencesState, _super);

    function ReferencesState(target) {
      _super.call(this, target, 500);

      this.references = references.collect(this.target.getValue());
      this.referencesVersionId = this.target.versionId;
    }
    ReferencesState.prototype.needsUpdate = function() {
      if (!this.graph) {
        return true;
      }

      if (this.referencesVersionId > this.graphVersionId) {
        return true;
      }

      return false;
    };

    ReferencesState.prototype.setGraph = function(graph, versionId) {
      this.graph = graph;
      this.graphVersionId = versionId;
    };

    ReferencesState.prototype.getGraph = function() {
      return this.graph;
    };

    ReferencesState.prototype.getReferences = function() {
      return this.references;
    };

    ReferencesState.prototype.onContentChange = function() {
      function hash(reference) {
        return reference.path + reference.offset + reference.length;
      }
      var newReferences = references.collect(this.target.getValue()),
        isOutdated = false;

      if (newReferences.length !== this.references.length) {
        isOutdated = true;
      } else {
        var map = {};
        this.references.forEach(function(reference) {
          map[hash(reference)] = true;
        });
        isOutdated = newReferences.some(function(reference) {
          return !map[hash(reference)];
        });
      }

      if (isOutdated) {
        this.references = newReferences;
        this.referencesVersionId = this.target.versionId;
        this.emit(ReferencesState.EVENTS.OnReferencesChanged, {
          resource: this.target.getAssociatedResource()
        });
      }
    };
    ReferencesState.NAME = 'typescript.ReferencesState';
    ReferencesState.EVENTS = {
      OnReferencesChanged: 'onReferencesChanged'
    };
    return ReferencesState;
  })(MirrorModelListener);
  exports.ReferencesState = ReferencesState;
});