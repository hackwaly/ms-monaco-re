define("vs/languages/typescript/editor/workerStatusReporter", ["require", "exports", "vs/editor/editor",
  "vs/editor/core/constants", "vs/editor/modes/modesExtensions", "vs/base/eventEmitter", "vs/base/dom/builder",
  "vs/css!./workerStatusReporter"
], function(e, t, n, i, o, r, s) {
  var a;

  var u = s.$;
  ! function(e) {
    e[e.Unknown = 0] = "Unknown";

    e[e.Updating = 1] = "Updating";

    e[e.Fetching = 2] = "Fetching";

    e[e.Error = 3] = "Error";

    e[e.Ok = 4] = "Ok";
  }(a || (a = {}));
  var l = function(e) {
    function t(t) {
      var n = this;
      e.call(this);

      this.worker = t;

      this.worker.request("setStatusReporting", [!0]);

      this.updateStatus(0);

      this.worker.addMessageHandler("ts.statusUpdate", function(e) {
        switch (e.status) {
          case 0:
            n.updateStatus(4);
            break;
          case 1:
            n.updateStatus(1);
            break;
          case 2:
            n.updateStatus(3);
            break;
          case 3:
            n.updateStatus(2);
            break;
          default:
            n.updateStatus(0);
        }
      });
    }
    __extends(t, e);

    t.prototype.getStatus = function() {
      return this.status;
    };

    t.prototype.updateStatus = function(e) {
      if (this.status !== e) {
        this.status = e;
        this.emit(t.Events.Updated, this.status);
      }
    };

    t.prototype.dispose = function() {
      this.worker.removeMessageHandler("ts.status");
    };

    t.Events = {
      Updated: "updated"
    };

    return t;
  }(r.EventEmitter);

  var c = function() {
    function e() {}
    e.prototype.getStatus = function(e) {
      if (!this.status) {
        this.status = [];
        for (var t = e.getWorkers(), n = 0, i = t.length; i > n; n++) {
          if ("vs/languages/typescript/typescriptWorker2" === t[n].moduleIdentifier) {
            this.status.push(new l(t[n]));
          }
        }
      }
      return this.status;
    };

    return e;
  }();

  var d = new c;

  var h = function() {
    function e(e) {
      var t = this;
      this.editor = e;

      this.callOnDispose = [];

      this.factory = d;

      this.created = !1;

      this.domNode = u(".monaco-typescript-status");

      this.editor.addOverlayWidget(this);

      this.onModelChange();

      this.callOnDispose.push(this.editor.addListener(i.EventType.ModelChanged, function() {
        return t.onModelChange();
      }));
    }
    e.prototype.getId = function() {
      return e.ID;
    };

    e.prototype.dispose = function() {
      for (; this.callOnDispose.length > 0;) {
        this.callOnDispose.pop()();
      }
    };

    e.prototype.onModelChange = function() {
      var e = this;

      var t = this.editor.getModel();
      if (t) {
        var n = t.getMode();
        if ("vs.languages.typescript" === n.getId() && n instanceof o.AbstractMode) {
          this.domNode.show();
          if (!this.created) {
            this.created = !0;
            this.factory.getStatus(n).forEach(function(t) {
              var n = u(".worker").appendTo(e.domNode);
              e.updateWidget(n, 0);

              e.callOnDispose.push(t.addListener(l.Events.Updated, function(t) {
                e.updateWidget(n, t);
              }));
            });
          }
        }

        {
          this.domNode.hide();
        }
      }
    };

    e.prototype.updateWidget = function(e, t) {
      if (t && 0 !== t) {
        if (4 === t) {
          e.attr("status", "ok");
        } {
          if (1 === t) {
            e.attr("status", "updating");
          } {
            if (2 === t) {
              e.attr("status", "fetching");
            } {
              if (3 === t) {
                e.attr("status", "error");
              }
            }
          }
        }
      }

      {
        e.attr("status", "unkown");
      }
    };

    e.prototype.getDomNode = function() {
      return this.domNode.getHTMLElement();
    };

    e.prototype.getPosition = function() {
      return {
        preference: 0
      };
    };

    e.ID = "typescript.status.reporter";

    return e;
  }();
  t.StatusPresenter = h;
});