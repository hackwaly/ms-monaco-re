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

define(["require", "exports", "vs/base/lib/winjs.base", "vs/base/network", "vs/base/eventEmitter", "vs/base/arrays",
  "vs/base/lifecycle", "./remoteModels", "./referenceCollection", "../service/references",
  "vs/editor/core/model/mirrorModel", "./dependencyResolver", "vs/platform/markers/markers"
], function(require, exports, __winjs__, __network__, __eventEmitter__, __arrays__, __lifecycle__, __remoteModels__,
  __modelListener__, __references__, __mirrorModel__, __dependencyResolver__, __markers__) {
  "use strict";
  var winjs = __winjs__;
  var network = __network__;
  var eventEmitter = __eventEmitter__;
  var arrays = __arrays__;
  var lifecycle = __lifecycle__;
  var remoteModels = __remoteModels__;
  var modelListener = __modelListener__;
  var references = __references__;
  var mirrorModel = __mirrorModel__;
  var dependencyResolver = __dependencyResolver__;
  var markers = __markers__;
  var paths;
  (function(paths) {
    function normalize(path) {
      return path.replace(/\\/g, "/");
    }
    paths.normalize = normalize;

    function dirname(folder) {
      var idx = folder.lastIndexOf("/");
      if (idx === -1) {
        return folder;
      }
      return folder.substring(0, idx);
    }
    paths.dirname = dirname;

    function join() {
      var parts = [];
      for (var _i = 0; _i < arguments.length - 0; _i++) {
        parts[_i] = arguments[_i + 0];
      }
      var allParts = [];
      for (var i = 0; i < parts.length; i++) {
        allParts.push.apply(allParts, parts[i].split("/"));
      }
      for (var i = 0; i < allParts.length; i++) {
        var part = allParts[i];
        if (part === ".") {
          allParts.splice(i, 1);
          i -= 1;
        } else if (i > 0 && part === "..") {
          allParts.splice(i - 1, 2);
          i -= 2;
        }
      }
      return allParts.join("/");
    }
    paths.join = join;
  })(paths || (paths = {}));
  var FileServiceBasedLoader = function() {
    function FileServiceBasedLoader(resourceService, requestService) {
      this.resourceService = resourceService;
      this.requestService = requestService;
    }
    FileServiceBasedLoader.prototype.load = function(relativeTo, reference, option) {
      var _this = this;
      if (!(reference instanceof references.TripleSlashReference)) {
        return winjs.Promise.wrapError("only triple slash references are supported");
      }
      var url = new network.URL(paths.join(paths.dirname(relativeTo), paths.normalize(reference.path)));

      var path = this.requestService.getPath("root", url);

      var requestUrl = new network.URL(this.requestService.getRequestUrl("root", path, true));
      if (this.resourceService.contains(requestUrl)) {
        var model = this.resourceService.get(requestUrl);
        return winjs.Promise.as(new references.File(requestUrl.toExternal(), model.getValue()));
      } else {
        return this.requestService.makeRequest({
          url: requestUrl.toExternal()
        }).then(function(request) {
          var file = new references.File(requestUrl.toExternal(), request.responseText);

          var model = new remoteModels.RemoteModel(requestUrl, request.responseText);
          if (!_this.resourceService.contains(requestUrl)) {
            _this.resourceService.insert(requestUrl, model);
          }
          return file;
        });
      }
    };
    FileServiceBasedLoader.prototype.dispose = function() {};
    return FileServiceBasedLoader;
  }();
  var FileBasedResolver = function(_super) {
    __extends(FileBasedResolver, _super);

    function FileBasedResolver(resourceService, requestService, markerService) {
      _super.call(this);
      this.resourceService = resourceService;
      this.requestService = requestService;
      this.markerService = markerService;
      this.callOnDispose = [];
      this.fileLoader = new FileServiceBasedLoader(resourceService, requestService);
      this.loadRecursivelyValue = true;
    }
    FileBasedResolver.prototype.dispose = function() {
      lifecycle.cAll(this.callOnDispose);
    };
    FileBasedResolver.prototype.loadRecursively = function(value) {
      if (typeof value !== "undefined") {
        this.loadRecursivelyValue = value;
      }
      return this.loadRecursivelyValue;
    };
    FileBasedResolver.prototype.fetchDependencies = function(resource) {
      var _this = this;
      if (!resource || resource.getScheme() === network.schemas.inMemory) {
        return winjs.Promise.as([]);
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
      var referencesState = this.resourceService.getLinked(resource, modelListener.ReferencesState.NAME);

      var file = new references.File(resource.toExternal(), model.getValue());

      var versionId = model.versionId;
      return references.buildDependencyGraph(this.fileLoader, [file], {
        recursive: this.loadRecursively(),
        nodeName: function(a) {
          return a;
        }
      }).then(function(graph) {
        var errors = [];
        graph.nodes().forEach(function(node) {
          if (node.getName().indexOf("error:") === 0) {
            graph.removeNode(node.getName());
            var data = JSON.parse(node.getName().substring(6));
            errors.push(data);
          }
        });
        _this.markerService.createPublisher().changeMarkers(resource, FileBasedResolver.ID, function(accessor) {
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
        referencesState.setGraph(graph, versionId);
        return _this.resourcesFromGraph(graph, resource);
      });
    };
    FileBasedResolver.prototype.resourcesFromReferenceState = function(model) {
      var _this = this;
      var resource = model.getAssociatedResource();

      var referencesState = this.resourceService.getLinked(resource, modelListener.ReferencesState.NAME);
      if (!referencesState) {
        referencesState = new modelListener.ReferencesState(model);
        this.callOnDispose.push(referencesState.addListener(modelListener.ReferencesState.EVENTS.OnReferencesChanged,
          function(e) {
            return _this.onReferenceStateChanged(e);
          }));
        this.resourceService.insertLinked(resource, modelListener.ReferencesState.NAME, referencesState);
        return null;
      } else if (!referencesState.needsUpdate()) {
        return this.resourcesFromGraph(referencesState.getGraph(), resource);
      } else {
        return null;
      }
    };
    FileBasedResolver.prototype.onReferenceStateChanged = function(e) {
      this.emit(dependencyResolver.Events.OnReferencesChanged, e);
    };
    FileBasedResolver.prototype.resourcesFromGraph = function(graph, resource) {
      var result = [];
      graph.traverse(resource.toExternal(), function(node) {
        result.unshift(new network.URL(node.getName()));
      });
      result.pop();
      return result;
    };
    FileBasedResolver.ID = "typescript.resolver.file";
    return FileBasedResolver;
  }(eventEmitter.EventEmitter);
  exports.FileBasedResolver = FileBasedResolver;
  var BaselibDependencyResolver = function() {
    function BaselibDependencyResolver(resourceService, requestService, delegate) {
      this.resourceService = resourceService;
      this.requestService = requestService;
      this.delegate = delegate;
      this.baselibs = [];
    }
    BaselibDependencyResolver.prototype.setBaselibs = function(libs) {
      this.baselibs = libs;
    };
    BaselibDependencyResolver.prototype.fetchDependencies = function(resource) {
      var _this = this;
      var promises = [];
      this.baselibs.forEach(function(lib) {
        if (_this.resourceService.contains(lib)) {
          promises.push(winjs.Promise.as(lib));
        } else {
          promises.push(_this.requestService.makeRequest({
            url: lib.toExternal()
          }).then(function(request) {
            var model = new remoteModels.DefaultLibModel(lib, request.responseText);
            _this.resourceService.insert(lib, model);
            return lib;
          }, function() {
            console.warn("TS - " + lib.toExternal() + " can not be loaded as base lib");
            return null;
          }));
        }
      });
      return winjs.Promise.join(promises).then(function(resources) {
        promises = [];
        resources.forEach(function(resource) {
          if (!resource) {
            return;
          }
          promises.push(_this.delegate.fetchDependencies(resource).then(function(resources) {
            resources.push(resource);
            return resources;
          }));
        });
        return winjs.Promise.join(promises);
      }).then(function(resources) {
        return arrays.merge(resources);
      });
    };
    return BaselibDependencyResolver;
  }();
  exports.BaselibDependencyResolver = BaselibDependencyResolver;
  var ProjectFileDependencyResolver = function() {
    function ProjectFileDependencyResolver(projectFile, resourceService, requestService, delegate) {
      this.projectFile = projectFile;
      this.resourceService = resourceService;
      this.requestService = requestService;
      this.delegate = delegate;
      this.loadFailureCount = 0;
    }
    ProjectFileDependencyResolver.prototype.fetchDependencies = function(resource) {
      var _this = this;
      var projectFilePromise;
      if (this.loadFailureCount >= 3) {
        return this.delegate.fetchDependencies(resource);
      } else if (!this.resourceService.contains(this.projectFile)) {
        projectFilePromise = this.requestService.makeRequest({
          url: this.projectFile.toExternal()
        }).then(function(request) {
          var model = new remoteModels.DefaultLibModel(_this.projectFile, request.responseText);
          _this.resourceService.insert(_this.projectFile, model);
          return _this.projectFile;
        }, function(e) {
          _this.loadFailureCount++;
          throw e;
        });
      } else {
        projectFilePromise = winjs.Promise.as(this.projectFile);
      }
      return projectFilePromise.then(function(resource) {
        return _this.delegate.fetchDependencies(resource);
      }, function() {
        return _this.delegate.fetchDependencies(resource);
      });
    };
    return ProjectFileDependencyResolver;
  }();
  exports.ProjectFileDependencyResolver = ProjectFileDependencyResolver;
});