var __extends = this.__extends || function(a, b) {
    function d() {
      this.constructor = a;
    }
    for (var c in b) {
      if (b.hasOwnProperty(c)) {
        a[c] = b[c];
      }
    }
    d.prototype = b.prototype;

    a.prototype = new d;
  };

define(["require", "exports", "vs/editor/editor", "vs/editor/core/constants", "vs/editor/modes/modesExtensions",
  "vs/base/eventEmitter", "vs/base/dom/builder", "vs/css!./workerStatusReporter"
], function(a, b, c, d, e, f, g) {
  var h = c;

  var i = d;

  var j = e;

  var k = f;

  var l = g;

  var m = l.$;

  var n;
  (function(a) {
    a[a.Unknown = 0] = "Unknown";

    a[a.Updating = 1] = "Updating";

    a[a.Fetching = 2] = "Fetching";

    a[a.Error = 3] = "Error";

    a[a.Ok = 4] = "Ok";
  })(n || (n = {}));
  var o = function(a) {
    function b(b) {
      var c = this;
      a.call(this);

      this.worker = b;

      this.worker.request("setStatusReporting", [!0]);

      this.updateStatus(n.Unknown);

      this.worker.addMessageHandler("ts.statusUpdate", function(a) {
        switch (a.status) {
          case 0:
            c.updateStatus(n.Ok);
            break;
          case 1:
            c.updateStatus(n.Updating);
            break;
          case 2:
            c.updateStatus(n.Error);
            break;
          case 3:
            c.updateStatus(n.Fetching);
            break;
          default:
            c.updateStatus(n.Unknown);
        }
      });
    }
    __extends(b, a);

    b.prototype.getStatus = function() {
      return this.status;
    };

    b.prototype.updateStatus = function(a) {
      if (this.status !== a) {
        this.status = a;
        this.emit(b.Events.Updated, this.status);
      }
    };

    b.prototype.dispose = function() {
      this.worker.removeMessageHandler("ts.status");
    };

    b.Events = {
      Updated: "updated"
    };

    return b;
  }(k.EventEmitter);

  var p = function() {
    function a() {}
    a.prototype.getStatus = function(a) {
      this.status || (this.status = a.getWorkers().map(function(a) {
        return new o(a);
      }));

      return this.status;
    };

    return a;
  }();

  var q = new p;

  var r = function() {
    function a(a) {
      var b = this;
      this.editor = a;

      this.callOnDispose = [];

      this.factory = q;

      this.created = !1;

      this.domNode = m(".monaco-typescript-status");

      this.editor.addOverlayWidget(this);

      this.onModelChange();

      this.callOnDispose.push(this.editor.addListener(i.EventType.ModelChanged, function() {
        return b.onModelChange();
      }));
    }
    a.prototype.getId = function() {
      return a.ID;
    };

    a.prototype.dispose = function() {
      while (this.callOnDispose.length > 0) {
        this.callOnDispose.pop()();
      }
    };

    a.prototype.onModelChange = function() {
      var a = this;

      var b = this.editor.getModel();
      if (!b) return;
      var c = b.getMode();
      if (c.getId() === "vs.languages.typescript" && c instanceof j.AbstractMode) {
        this.domNode.show();
        if (!this.created) {
          this.created = !0;
          this.factory.getStatus(c).forEach(function(b) {
            var c = m(".worker").appendTo(a.domNode);
            a.updateWidget(c, n.Unknown);

            a.callOnDispose.push(b.addListener(o.Events.Updated, function(b) {
              a.updateWidget(c, b);
            }));
          });
        }
      } else {
        this.domNode.hide();
      }
    };

    a.prototype.updateWidget = function(a, b) {
      if (!b || b === n.Unknown) {
        a.attr("status", "unkown");
      } else {
        if (b === n.Ok) {
          a.attr("status", "ok");
        } else {
          if (b === n.Updating) {
            a.attr("status", "updating");
          } else {
            if (b === n.Fetching) {
              a.attr("status", "fetching");
            } else {
              if (b === n.Error) {
                a.attr("status", "error");
              }
            }
          }
        }
      }
    };

    a.prototype.getDomNode = function() {
      return this.domNode.getHTMLElement();
    };

    a.prototype.getPosition = function() {
      return {
        preference: h.OverlayWidgetPositionPreference.TOP_RIGHT_CORNER
      };
    };

    a.ID = "typescript.status.reporter";

    return a;
  }();
  b.StatusPresenter = r;
});