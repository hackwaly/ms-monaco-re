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

define(["require", "exports", "vs/base/lib/winjs.base", "vs/base/strings", "vs/base/env", "vs/base/network",
  "vs/editor/core/model/mirrorModel", "./remoteModels", "./referenceCollection", "../service/references",
  "./dependencyResolverFiles", "vs/platform/markers/markers"
], function(require, exports, __winjs__, __strings__, __env__, __network__, __mirrorModel__, __remoteModels__,
  __modelListener__, __references__, __dependencyResolverFiles__, __markers__) {
  "use strict";
  var winjs = __winjs__;
  var strings = __strings__;
  var env = __env__;
  var network = __network__;
  var mirrorModel = __mirrorModel__;
  var remoteModels = __remoteModels__;
  var modelListener = __modelListener__;
  var references = __references__;
  var dependencyResolverFiles = __dependencyResolverFiles__;
  var markers = __markers__;
  var xhr;
  (function(xhr) {
    function parseHeader(raw) {
      var idx1;

      var idx2;

      var offset = 0;

      var result = {};
      while (true) {
        idx1 = raw.indexOf(":", offset);
        idx2 = raw.indexOf("\n", idx1 + 1);
        if (idx1 < 0 || idx2 < 0) {
          break;
        }
        result[raw.substring(offset, idx1).trim()] = raw.substring(idx1 + 1, idx2).trim();
        offset = idx2 + 1;
      }
      return result;
    }
    xhr.parseHeader = parseHeader;

    function fetchChunkedData(service, options) {
      var from = 0;

      var to = -1;

      var c;

      var e;

      var p;

      var elements = [];

      var canceled = false;

      function onData(text) {
        if (canceled) {
          e("canceled");
          return;
        }
        var idx = text.indexOf("\r\n\r\n", from);
        if (idx === -1) {
          return;
        }
        var header = parseHeader(text.substring(from, idx));

        var length = Number(header["Content-Length"]);
        if (idx + 4 + length > text.length) {
          return;
        }
        elements.push({
          header: header,
          body: text.substr(idx + 4, length)
        });
        p(elements[elements.length - 1]);
        from = idx + 4 + length;
        onData(text);
      }
      var promise = new winjs.Promise(function(_c, _e, _p) {
        c = _c;
        e = _e;

        p = _p;
      }, function() {
        canceled = true;
      });
      service.makeRequest(options).then(function(request) {
        onData(request.responseText);
        c(elements);
      }, function(error) {
        e(error);
      }, function(request) {
        if (env.browser.isIE10) {
          return;
        }
        if (request.readyState === 3) {
          onData(request.responseText);
        }
      }).done(null, function(error) {
        e(error);
      });
      return promise;
    }
    xhr.fetchChunkedData = fetchChunkedData;
  })(xhr || (xhr = {}));
  var GraphBasedResolver = function(_super) {
    __extends(GraphBasedResolver, _super);

    function GraphBasedResolver() {
      _super.apply(this, arguments);
    }
    GraphBasedResolver.prototype.setModuleSystems = function(modules) {
      this.modules = modules;
    };
    GraphBasedResolver.prototype.onReferenceStateChanged = function(e) {
      var _this = this;
      if (typeof this.delayHandle !== "undefined") {
        clearTimeout(this.delayHandle);
      }
      this.delayHandle = setTimeout(function() {
        _this.superOnReferenceStateChanged(e);
      }, 1e3);
    };
    GraphBasedResolver.prototype.superOnReferenceStateChanged = function(e) {
      _super.prototype.onReferenceStateChanged.call(this, e);
    };
    GraphBasedResolver.prototype.fetchDependencies = function(resource) {
      var _this = this;
      if (!resource) {
        return winjs.Promise.as([]);
      }
      var path = this.requestService.getPath("root", resource);
      if (!path) {
        return _super.prototype.fetchDependencies.call(this, resource);
      }
      var element = this.resourceService.get(resource);
      if (!(element instanceof mirrorModel.MirrorModel)) {
        return winjs.Promise.as([]);
      }
      var model = element;

      var cachedResult = this.resourcesFromReferenceState(model);
      if (cachedResult) {
        return winjs.Promise.as(cachedResult);
      }
      var url = this.builtRequestUrl(resource, "typeScriptDependencyGraph");

      var versionId = model.versionId;

      var referenceState = this.resourceService.getLinked(resource, modelListener.ReferencesState.NAME);
      return this.requestService.makeRequest({
        url: url
      }).then(function(request) {
        var data = JSON.parse(request.responseText);

        var errors = [];

        var graph = _this.parseGraph(data, errors);
        _this.markerService.createPublisher().changeMarkers(resource, GraphBasedResolver.ID, function(accessor) {
          for (var i = 0, len = errors.length; i < len; i++) {
            var error = errors[i];
            if (error.referenceType !== 1 << 0) {
              continue;
            }
            var url = new network.URL(_this.requestService.getRequestUrl("root", error.path, true));

            var marker = markers.createTextMarker(markers.Severity.Error, 1, error.message, error.offset, error.length);
            accessor.addMarker(marker);
          }
        });
        referenceState.setGraph(graph, versionId);
        return _this.resourcesFromGraph(graph, resource);
      }).then(function(resources) {
        var missing = [];
        for (var i = 0; i < resources.length; i++) {
          if (!_this.resourceService.contains(resources[i])) {
            missing.push(_this.requestService.getPath("root", resources[i]));
          }
        }
        if (missing.length === 0) {
          return winjs.Promise.as(resources);
        }
        return xhr.fetchChunkedData(_this.requestService, {
          type: "POST",
          url: _this.requestService.getRequestUrl("typeScriptFiles"),
          headers: {
            "Content-Type": "application/json"
          },
          data: JSON.stringify(missing)
        }).then(function() {
          return resources;
        }, function(err) {
          return resources;
        }, function(chunk) {
          if (typeof chunk.header["IsError"] !== "undefined") {
            return;
          }
          var path = chunk.header["Path"];

          var url = new network.URL(_this.requestService.getRequestUrl("root", path, true));

          var model = new remoteModels.RemoteModel(url, chunk.body);
          if (!_this.resourceService.contains(url)) {
            _this.resourceService.insert(url, model);
          }
        });
      });
    };
    GraphBasedResolver.prototype.builtRequestUrl = function(resource, service) {
      var path = this.requestService.getPath("root", resource);

      var config = this.modules.getModuleConfiguration(resource);
      var url = strings.format("{0}?type={1}&baseurl={2}", this.requestService.getRequestUrl(service, path),
        encodeURIComponent(config.moduleType), encodeURIComponent(config.baseurl));
      if (!this.loadRecursively()) {
        url += "&flat";
      }
      return url;
    };
    GraphBasedResolver.prototype.parseGraph = function(data, errorsOut) {
      var rootRequestUrl = this.requestService.getRequestUrl("root", "", true);

      var indexKeys = Object.keys(data.i);
      for (var i = 0; i < indexKeys.length; i++) {
        if (data.i[indexKeys[i]].indexOf("error:") !== 0) {
          data.i[indexKeys[i]] = rootRequestUrl + data.i[indexKeys[i]].substring(1);
        }
      }
      var graph = references.Graph.fromJSON(data);

      var nodes = graph.nodes();
      for (var i = 0; i < nodes.length; i++) {
        var node = nodes[i];
        if (node.getName().indexOf("error:") === 0) {
          graph.removeNode(node.getName());
          errorsOut.push(JSON.parse(node.getName().substring(6)));
        }
      }
      return graph;
    };
    GraphBasedResolver.ID = "typescript.graphResolver";
    return GraphBasedResolver;
  }(dependencyResolverFiles.FileBasedResolver);
  exports.GraphBasedResolver = GraphBasedResolver;
});