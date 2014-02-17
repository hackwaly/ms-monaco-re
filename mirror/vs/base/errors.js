define("vs/base/errors", ["require", "exports", "vs/nls!vs/editor/worker/editorWorkerServer", "./objects", "./env",
  "./types"
], function(e, t, n, i, o, r) {
  function s(e) {
    t.errorHandler.setUnexpectedErrorHandler(e);
  }

  function a(e, n) {
    if ("undefined" == typeof n) {
      n = null;
    }

    t.errorHandler.onUnexpectedError(e, n);
  }

  function u(e, t) {
    var i = e.errorCode;

    var o = e.errorMessage;
    return null !== i && null !== o ? n.localize("vs_base_errors", 0, i, o) : null !== o ? o : t && null !== e.responseText ?
      e.responseText : null;
  }

  function l(e, t) {
    var i = u(e, t);
    return 401 === e.status ? null !== i ? n.localize("vs_base_errors", 1, i) : n.localize("vs_base_errors", 2) : i ?
      i : e.status > 0 && null !== e.statusText ? t && null !== e.responseText && e.responseText.length > 0 ? n.localize(
        "vs_base_errors", 3, e.statusText, e.status, e.responseText) : n.localize("vs_base_errors", 4, e.statusText,
        e.status) : t && null !== e.responseText && e.responseText.length > 0 ? n.localize("vs_base_errors", 5, e.responseText) :
      n.localize("vs_base_errors", 6);
  }

  function c(e, t) {
    return l(new C(e), t);
  }

  function d(e, t) {
    return t && e.message && (e.stack || e.stacktrace) ? n.localize("vs_base_errors", 7, e.message, e.stack || e.stacktrace) :
      e.message ? e.message : n.localize("vs_base_errors", 8);
  }

  function h(e, t) {
    if ("undefined" == typeof t && (t = !1), !e) {
      return n.localize("vs_base_errors", 9);
    }
    if (r.isString(e)) {
      return e;
    }
    if (e instanceof C) {
      return l(e, t);
    }
    if (!r.isUndefinedOrNull(e.status)) {
      return c(e, t);
    }
    if (e.detail) {
      var i = e.detail;
      if (i.error) {
        if (i.error && !r.isUndefinedOrNull(i.error.status)) {
          return c(i.error, t);
        }
        if (!r.isArray(i.error)) {
          return d(i.error, t);
        }
        for (var o = 0; o < i.error.length; o++)
          if (i.error[o] && !r.isUndefinedOrNull(i.error[o].status)) {
            return c(i.error[o], t);
          }
      }
      if (i.exception) {
        return r.isUndefinedOrNull(i.exception.status) ? d(i.exception, t) : c(i.exception, t);
      }
    }
    return e.stack ? d(e, t) : e.message ? e.message : n.localize("vs_base_errors", 10);
  }

  function p(e) {
    if (e)
      if (r.isArray(e)) {
        for (var t = 0; t < e.length; t++)
          if (e[t] && e[t].status) {
            return e[t].status;
          }
      } else if (e.status) {
      return e.status;
    }
    return -1;
  }

  function f(e) {
    return e instanceof Error && "Canceled" === e.name && "Canceled" === e.message;
  }

  function g() {
    return new Error("Canceled");
  }

  function m() {
    return new Error("not implemented");
  }

  function v(e) {
    return e ? new Error("illegeal argument: " + e) : new Error("illegeal argument");
  }

  function y(e) {
    return e ? new Error("illegeal state: " + e) : new Error("illegeal state");
  }

  function _() {
    return new Error(n.localize("vs_base_errors", 11));
  }
  var b = function() {
    function e() {
      this.listeners = [];

      this.unexpectedErrorHandler = function(e) {
        setTimeout(function() {
          if (o.isTesting() && e.stack) throw new Error(e.stack);
          throw e;
        }, 0);
      };
    }
    e.prototype.addListener = function(e) {
      var t = this;
      this.listeners.push(e);

      return function() {
        t._removeListener(e);
      };
    };

    e.prototype.emit = function(e, t, n) {
      if ("undefined" == typeof t) {
        t = null;
      }

      if ("undefined" == typeof n) {
        n = null;
      }

      this.listeners.forEach(function(i) {
        i(e, t, n);
      });
    };

    e.prototype._removeListener = function(e) {
      this.listeners.splice(this.listeners.indexOf(e), 1);
    };

    e.prototype.setUnexpectedErrorHandler = function(e) {
      this.unexpectedErrorHandler = e;
    };

    e.prototype.getUnexpectedErrorHandler = function() {
      return this.unexpectedErrorHandler;
    };

    e.prototype.onUnexpectedError = function(e, n) {
      if ("undefined" == typeof n) {
        n = null;
      }

      this.unexpectedErrorHandler(e, n);

      this.emit(e, n, t.toErrorMessage(e, !0));
    };

    return e;
  }();
  t.ErrorHandler = b;

  t.errorHandler = new b;

  t.setUnexpectedErrorHandler = s;

  t.onUnexpectedError = a;
  var C = function() {
    function e(e) {
      if (this.status = e.status, this.statusText = e.statusText, this.responseText = e.responseText, this.errorMessage =
        null, this.errorCode = null, this.errorObject = null, this.responseText) try {
        var n = JSON.parse(this.responseText);
        this.errorMessage = n.message;

        this.errorCode = n.code;

        this.errorObject = n;
      } catch (i) {}
      this.message = t.toErrorMessage(this, !1);
    }
    return e;
  }();
  t.ConnectionError = C;

  i.derive(Error, C);

  t.toErrorMessage = h;

  t.getHttpStatus = p;

  t.isPromiseCanceledError = f;

  t.canceled = g;

  t.notImplemented = m;

  t.illegalArgument = v;

  t.illegalState = y;

  t.loaderError = _;
});