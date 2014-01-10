define(["require", "exports", "vs/nls", "./objects", "./types"], function(a, b, c, d, e) {
  function j(a) {
    b.errorHandler.setUnexpectedErrorHandler(a)
  }

  function k(a, c) {
    typeof c == "undefined" && (c = null), b.errorHandler.onUnexpectedError(a, c)
  }

  function m(a, b) {
    var c = a.errorCode,
      d = a.errorMessage;
    return c !== null && d !== null ? f.localize("message", "{0}: {1}", c, d) : d !== null ? d : b && a.responseText !==
      null ? a.responseText : null
  }

  function n(a, b) {
    var c = m(a, b);
    return a.status === 401 ? c !== null ? f.localize("error.permission.verbose", "Permission Denied (HTTP {0})", c) :
      f.localize("error.permission", "Permission Denied") : c ? c : a.status > 0 && a.statusText !== null ? b && a.responseText !==
      null && a.responseText.length > 0 ? f.localize("error.http.verbose", "{0} (HTTP {1}: {2})", a.statusText, a.status,
        a.responseText) : f.localize("error.http", "{0} (HTTP {1})", a.statusText, a.status) : b && a.responseText !==
      null && a.responseText.length > 0 ? f.localize("error.connection.unknown.verbose",
        "Unknown Connection Error ({0})", a.responseText) : f.localize("error.connection.unknown",
        "An unknown connection error occurred. Either you are no longer connected to the internet or the server you are connected to is offline."
    )
  }

  function o(a, b) {
    return n(new l(a), b)
  }

  function p(a, b) {
    return b && a.message && (a.stack || a.stacktrace) ? f.localize("stackTrace.format", "{0}: {1}", a.message, a.stack ||
      a.stacktrace) : a.message ? a.message : f.localize("error.defaultMessage1",
      "An unknown error occurred. Please consult the log for more details.")
  }

  function q(a, b) {
    typeof b == "undefined" && (b = !1);
    if (!a) return f.localize("error.defaultMessage2",
      "An unknown error occurred. Please consult the log for more details.");
    if (h.isString(a)) return a;
    if (a instanceof l) return n(a, b);
    if (!h.isUndefinedOrNull(a.status)) return o(a, b);
    if (a.detail) {
      var c = a.detail;
      if (c.error) {
        if (c.error && !h.isUndefinedOrNull(c.error.status)) return o(c.error, b);
        if (!h.isArray(c.error)) return p(c.error, b);
        for (var d = 0; d < c.error.length; d++)
          if (c.error[d] && !h.isUndefinedOrNull(c.error[d].status)) return o(c.error[d], b)
      }
      if (c.exception) return h.isUndefinedOrNull(c.exception.status) ? p(c.exception, b) : o(c.exception, b)
    }
    return a.stack ? p(a, b) : a.message ? a.message : f.localize("error.defaultMessage3",
      "An unknown error occurred. Please consult the log for more details.")
  }

  function r(a) {
    if (a)
      if (h.isArray(a)) {
        for (var b = 0; b < a.length; b++)
          if (a[b] && a[b].status) return a[b].status
      } else if (a.status) return a.status;
    return -1
  }

  function s(a) {
    return a instanceof Error && a.name === "Canceled" && a.message === "Canceled"
  }

  function t() {
    return new Error("not implemented")
  }

  function u(a) {
    return new Error("illegeal argument: ")
  }
  var f = c,
    g = d,
    h = e,
    i = function() {
      function a() {
        this.listeners = [], this.unexpectedErrorHandler = function(a, b) {
          setTimeout(function() {
            throw a
          }, 0)
        }
      }
      return a.prototype.addListener = function(a) {
        var b = this;
        return this.listeners.push(a),
        function() {
          b._removeListener(a)
        }
      }, a.prototype.emit = function(a, b, c) {
        typeof b == "undefined" && (b = null), typeof c == "undefined" && (c = null), this.listeners.forEach(function(
          d) {
          d(a, b, c)
        })
      }, a.prototype._removeListener = function(a) {
        this.listeners.splice(this.listeners.indexOf(a), 1)
      }, a.prototype.setUnexpectedErrorHandler = function(a) {
        this.unexpectedErrorHandler = a
      }, a.prototype.getUnexpectedErrorHandler = function() {
        return this.unexpectedErrorHandler
      }, a.prototype.onUnexpectedError = function(a, c) {
        typeof c == "undefined" && (c = null), this.unexpectedErrorHandler(a, c), this.emit(a, c, b.toErrorMessage(a, !
          0))
      }, a
    }();
  b.ErrorHandler = i, b.errorHandler = new i, b.setUnexpectedErrorHandler = j, b.onUnexpectedError = k;
  var l = function() {
    function a(a) {
      this.status = a.status, this.statusText = a.statusText, this.responseText = a.responseText, this.errorMessage =
        null, this.errorCode = null, this.errorObject = null;
      if (this.responseText) try {
        var c = JSON.parse(this.responseText);
        this.errorMessage = c.message, this.errorCode = c.code, this.errorObject = c
      } catch (d) {}
      this.message = b.toErrorMessage(this, !1)
    }
    return a
  }();
  b.ConnectionError = l, g.derive(Error, l), b.toErrorMessage = q, b.getHttpStatus = r, b.isPromiseCanceledError = s,
    b.notImplemented = t, b.illegalArgument = u
})