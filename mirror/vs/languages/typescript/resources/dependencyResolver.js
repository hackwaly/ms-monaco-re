define(["require", "exports", 'vs/base/lib/winjs.base', 'vs/base/types'], function(require, exports, __winjs__,
  __types__) {
  /*---------------------------------------------------------
   * Copyright (C) Microsoft Corporation. All rights reserved.
   *--------------------------------------------------------*/
  'use strict';

  var winjs = __winjs__;

  var types = __types__;

  (function(Events) {
    Events.OnReferencesChanged = 'onReferencesChanged';
  })(exports.Events || (exports.Events = {}));
  var Events = exports.Events;

  var NullDependencyResolver = (function() {
    function NullDependencyResolver() {}
    NullDependencyResolver.prototype.fetchDependencies = function(resource) {
      return winjs.Promise.as([]);
    };
    return NullDependencyResolver;
  })();
  exports.NullDependencyResolver = NullDependencyResolver;

  var CompositeDependencyResolver = (function() {
    function CompositeDependencyResolver(delegates) {
      this.delegates = delegates;
    }
    CompositeDependencyResolver.prototype.fetchDependencies = function(resource) {
      var promises = this.delegates.map(function(delegate) {
        return delegate.fetchDependencies(resource);
      });

      return winjs.Promise.join(promises).then(function(values) {
        var result = [];
        for (var i = 0; i < values.length; i++) {
          var value = values[i];
          result.push.apply(result, value);
        }
        return result;
      });
    };

    CompositeDependencyResolver.prototype.dispose = function() {
      for (var i = 0; i < this.delegates.length; i++) {
        var delegate = this.delegates[i];
        if (types.isFunction(delegate.dispose)) {
          delegate.dispose();
        }
      }
    };
    return CompositeDependencyResolver;
  })();
  exports.CompositeDependencyResolver = CompositeDependencyResolver;
});