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

define(["require", "exports", "vs/nls", "vs/base/lib/winjs.base", "vs/base/dom/builder", "vs/base/ui/actions",
  "vs/base/lifecycle", "vs/base/dom/dom", "vs/base/ui/events", "vs/base/types", "vs/base/eventEmitter",
  "vs/base/dom/keyboardEvent", "vs/css!./actionbar"
], function(a, b, c, d, e, f, g, h, i, j, k, l) {
  function E(a, b) {
    if (a.button !== 0) return;
    if (a.type === r.EventType.MOUSE_DOWN) {
      b.addClass("active");
    } else {
      b.removeClass("active");
    }
  }
  var m = c;

  var n = d;

  var o = e;

  var p = f;

  var q = g;

  var r = h;

  var s = i;

  var t = j;

  var u = k;

  var v = l;

  var w = o.$;

  var x = function(a) {
    function b(b, c) {
      var d = this;
      a.call(this);

      this._callOnDispose = [];

      this._context = b || this;

      this.action = c;
      if (c instanceof p.Action) {
        var e = c.addBulkListener(function(a) {
          a.forEach(function(a) {
            switch (a.getType()) {
              case p.Action.ENABLED:
                d._updateEnabled();
                break;
              case p.Action.LABEL:
                d._updateLabel();
                break;
              case p.Action.CLASS:
                d._updateClass();
                break;
              case p.Action.CHECKED:
                d._updateChecked();
                break;
              default:
                d._updateUnknown(a);
            }
          });
        });
        this._callOnDispose.push(e);
      }
    }
    __extends(b, a);

    b.prototype.getAction = function() {
      return this.action;
    };

    b.prototype.setActionContext = function(a) {
      this._context = a;
    };

    b.prototype.render = function(a) {
      var b = this;
      this.builder = o.Build.withElement(a);

      this.builder.on(r.EventType.CLICK, function(a) {
        b.onClick(a);
      });

      this.builder.on("mousedown", function(a) {
        if (a.button === 0 && b.action.enabled) {
          b.builder.addClass("active");
        }
      });

      this.builder.on(["mouseup", "mouseout"], function(a) {
        if (a.button === 0 && b.action.enabled) {
          b.builder.removeClass("active");
        }
      });
    };

    b.prototype.onClick = function(a) {
      r.EventHelper.stop(a, !0);

      this.runAction(a);
    };

    b.prototype.runAction = function(a) {
      var b = this;
      if (!this.action.enabled) return;
      this.emit(s.EventType.BEFORE_RUN, {
        action: this.action
      });

      n.Promise.as(this.action.run(this._context || a)).then(function(a) {
        b.emit(s.EventType.RUN, {
          action: b.action,
          result: a
        });
      }, function(a) {
        b.emit(s.EventType.RUN, {
          action: b.action,
          error: a
        });
      }).done();
    };

    b.prototype.focus = function() {
      this.builder.domFocus();
    };

    b.prototype._updateEnabled = function() {};

    b.prototype._updateLabel = function() {};

    b.prototype._updateClass = function() {};

    b.prototype._updateChecked = function() {};

    b.prototype._updateUnknown = function(a) {};

    b.prototype.dispose = function() {
      a.prototype.dispose.call(this);

      q.cAll(this._callOnDispose);
    };

    return b;
  }(u.EventEmitter);
  b.BaseActionItem = x;

  b.Separator = {
    id: "actions.monaco.separator",
    "class": "separator",
    label: "",
    checked: !1,
    enabled: !1,
    run: function() {
      return null;
    }
  };
  var y = function(a) {
    function b(b, c, d) {
      if (typeof d == "undefined") {
        d = {};
      }

      a.call(this, b, c);

      this.options = d;

      this.options.icon = d.icon !== undefined ? d.icon : !1;

      this.options.label = d.label !== undefined ? d.label : !0;

      this.cssClass = "";
    }
    __extends(b, a);

    b.prototype.render = function(b) {
      a.prototype.render.call(this, b);

      this.$e = w("a.action-label").attr("tabIndex", "-1").appendTo(this.builder);

      this.$e.attr({
        role: "menuitem"
      });

      if (!this.options.label && this.getAction().label && this.options.icon) {
        this.$e.attr({
          title: this.getAction().label
        });
      }

      this._updateClass();

      this._updateLabel();

      this._updateEnabled();

      this._updateChecked();
    };

    b.prototype.focus = function() {
      this.$e.domFocus();
    };

    b.prototype._updateLabel = function() {
      if (this.options.label) {
        this.$e.text(this.getAction().label);
      }
    };

    b.prototype._updateClass = function() {
      if (this.cssClass) {
        this.$e.removeClass(this.cssClass);
      }

      if (this.options.icon) {
        this.cssClass = this.getAction().class;
        this.$e.addClass("icon");
        this.$e.addClass(this.cssClass);
        this._updateEnabled();
      } else {
        this.$e.removeClass("icon");
      }
    };

    b.prototype._updateEnabled = function() {
      if (this.getAction().enabled) {
        this.builder.removeClass("disabled");
        this.$e.removeClass("disabled");
      } else {
        this.builder.addClass("disabled");
        this.$e.addClass("disabled");
      }
    };

    b.prototype._updateChecked = function() {
      if (this.getAction().checked) {
        this.$e.addClass("checked");
      } else {
        this.$e.removeClass("checked");
      }
    };

    return b;
  }(x);
  b.ActionItem = y;
  var z = function(a) {
    function b(b) {
      a.call(this, null, b);

      this.callOnDispose = [];
    }
    __extends(b, a);

    b.prototype.render = function(b) {
      var c = document.createElement("div");
      o.Build.withElement(c).addClass("progress-item");
      var d = document.createElement("div");
      o.Build.withElement(d).addClass("label");

      d.textContent = this.getAction().label;

      d.title = this.getAction().label;

      a.prototype.render.call(this, d);
      var e = document.createElement("div");
      e.textContent = "…";

      o.Build.withElement(e).addClass("tag", "progress");
      var f = document.createElement("div");
      f.textContent = "✓";

      o.Build.withElement(f).addClass("tag", "done");
      var g = document.createElement("div");
      g.textContent = "!";

      o.Build.withElement(g).addClass("tag", "error");

      this.callOnDispose.push(this.addListener(s.EventType.BEFORE_RUN, function() {
        o.Build.withElement(e).addClass("active");

        o.Build.withElement(f).removeClass("active");

        o.Build.withElement(g).removeClass("active");
      }));

      this.callOnDispose.push(this.addListener(s.EventType.RUN, function(a) {
        o.Build.withElement(e).removeClass("active");

        if (a.error) {
          o.Build.withElement(f).removeClass("active");
          o.Build.withElement(g).addClass("active");
        } else {
          o.Build.withElement(g).removeClass("active");
          o.Build.withElement(f).addClass("active");
        }
      }));

      c.appendChild(d);

      c.appendChild(e);

      c.appendChild(f);

      c.appendChild(g);

      b.appendChild(c);
    };

    b.prototype.dispose = function() {
      q.cAll(this.callOnDispose);

      a.prototype.dispose.call(this);
    };

    return b;
  }(x);
  b.ProgressItem = z;

  (function(a) {
    a[a.HORIZONTAL = 1] = "HORIZONTAL";

    a[a.VERTICAL = 2] = "VERTICAL";
  })(b.ActionsOrientation || (b.ActionsOrientation = {}));
  var A = b.ActionsOrientation;

  var B = {
    orientation: A.HORIZONTAL,
    context: null
  };

  var C = function(a) {
    function b(b, c) {
      if (typeof c == "undefined") {
        c = B;
      }
      var d = this;
      a.call(this);

      this.builder = b;

      this.options = c;

      this.items = [];

      this.focusedItem = undefined;

      this.domNode = document.createElement("div");

      this.domNode.className = "monaco-action-bar";

      if (this.options.orientation === A.VERTICAL) {
        this.domNode.className += " vertical";
      }

      o.Build.withElement(this.domNode).on(r.EventType.KEY_DOWN, function(a) {
        var b = new v.KeyboardEvent(a);

        var c = !0;
        switch (b.asString()) {
          case "UpArrow":
          case "LeftArrow":
            d.doFocus(!1);
            break;
          case "DownArrow":
          case "RightArrow":
            d.doFocus(!0);
            break;
          default:
            c = !1;
        }
        if (c) {
          b.preventDefault();
          b.stopPropagation();
        }
      });

      o.Build.withElement(this.domNode).on(r.EventType.KEY_UP, function(a) {
        var b = new v.KeyboardEvent(a);
        switch (b.asString()) {
          case "Enter":
            d.doTrigger(a);

            b.preventDefault();

            b.stopPropagation();
        }
      });

      this.actionsList = document.createElement("ul");

      this.actionsList.className = "actions-container";

      this.actionsList.setAttribute("role", "menu");

      this.actionsList.setAttribute("aria-label", m.localize("actionBarAccessibleLabel", "Action Bar"));

      this.domNode.appendChild(this.actionsList);

      if (b) {
        b.getHTMLElement().appendChild(this.domNode);
      }
    }
    __extends(b, a);

    b.prototype.getContainer = function() {
      return o.Build.withElement(this.domNode);
    };

    b.prototype.push = function(a, b) {
      if (typeof b == "undefined") {
        b = {};
      }
      var c = this;
      if (!t.isArray(a)) {
        a = [a];
      }
      var d = t.isNumber(b.index) ? b.index : null;
      a.forEach(function(a) {
        var e = document.createElement("li");
        e.className = "action-item";

        e.setAttribute("role", "presentation");
        var f = null;
        if (c.options.actionItemProvider) {
          f = c.options.actionItemProvider(a);
        }

        if (!f) {
          f = new y(c.options.context, a, b);
        }

        f.setActionContext(c.options.context);

        c.addEmitter(f);

        f.render(e);

        if (d === null || d < 0 || d >= c.actionsList.children.length) {
          c.actionsList.appendChild(e);
        } else {
          c.actionsList.insertBefore(e, c.actionsList.children[d++]);
        }

        c.items.push(f);
      });
    };

    b.prototype.clear = function() {
      var a;
      while (a = this.items.pop()) {
        a.dispose();
      }
      w(this.actionsList).empty();
    };

    b.prototype.isEmpty = function() {
      return this.items.length === 0;
    };

    b.prototype.onContentsChange = function() {
      this.emit(s.EventType.CONTENTS_CHANGED);
    };

    b.prototype.focus = function() {
      this.doFocus();
    };

    b.prototype.doFocus = function(a) {
      var b = this.items.length;
      if (b === 0) return;
      if (typeof a == "undefined") {
        if (typeof this.focusedItem == "undefined") {
          this.focusedItem = 0;
        }
      } else {
        if (typeof this.focusedItem == "undefined") {
          this.focusedItem = 0;
        } else {
          if (a) {
            this.focusedItem += 1;
            if (this.focusedItem >= b) {
              this.focusedItem = 0;
            }
          } else {
            this.focusedItem -= 1;
            if (this.focusedItem < 0) {
              this.focusedItem = b - 1;
            }
          }
        }
      }
      for (var c = 0; c < this.items.length; c++) {
        var d = this.items[c];
        if (!(d instanceof x)) continue;
        var e = d;
        if (c === this.focusedItem) {
          e.focus();
          e.builder.addClass("focused");
        } else {
          e.builder.removeClass("focused");
        }
      }
    };

    b.prototype.doTrigger = function(a) {
      if (typeof this.focusedItem == "undefined") return;
      this.items[this.focusedItem].runAction(a);
    };

    b.prototype.dispose = function() {
      if (this.items !== null) {
        this.clear();
      }

      this.items = null;

      this.getContainer().destroy();

      a.prototype.dispose.call(this);
    };

    b.DEFAULT_OPTIONS = {
      orientation: A.HORIZONTAL
    };

    return b;
  }(u.EventEmitter);
  b.ActionBar = C;
  var D = function(a) {
    function b(b, c) {
      if (typeof c == "undefined") {
        c = {};
      }
      var d = this;
      a.call(this);

      this.builder = b;

      this.options = c;

      this.listeners = [];

      this.domNodeBuilder = b.div({
        "class": "monaco-actions-widget"
      }, function(a) {
        d.primaryActionBar = new C(a);

        d.secondaryActionBar = new C(a, {
          orientation: A.VERTICAL
        });

        d.primaryActionBar.getContainer().addClass("primary");

        d.secondaryActionBar.getContainer().addClass("secondary");

        a.div({
          "class": "more",
          text: m.localize("more", "…")
        }).on([r.EventType.CLICK], function(a, b) {
          r.EventHelper.stop(a, !0);

          d.toggleMore();
        }).on([r.EventType.MOUSE_DOWN, r.EventType.MOUSE_UP, r.EventType.MOUSE_OUT], E);
      });

      this.listeners.push(this.primaryActionBar.addListener(s.EventType.BEFORE_RUN, function(a) {
        a.actionType = "primary";

        d.emit(s.EventType.BEFORE_RUN, a);
      }));

      this.listeners.push(this.primaryActionBar.addListener(s.EventType.RUN, function(a) {
        a.actionType = "primary";

        d.emit(s.EventType.RUN, a);
      }));

      this.listeners.push(this.secondaryActionBar.addListener(s.EventType.BEFORE_RUN, function(a) {
        a.actionType = "secondary";

        d.emit(s.EventType.BEFORE_RUN, a);
      }));

      this.listeners.push(this.secondaryActionBar.addListener(s.EventType.RUN, function(a) {
        a.actionType = "secondary";

        d.emit(s.EventType.RUN, a);
      }));

      this.updateView();
    }
    __extends(b, a);

    b.prototype.updateView = function() {
      if (this.primaryActionBar.items.length === 0) {
        this.domNodeBuilder.removeClass("hasPrimary");
      } else {
        this.domNodeBuilder.addClass("hasPrimary");
      }

      if (this.secondaryActionBar.items.length === 0) {
        this.domNodeBuilder.removeClass("hasSecondary");
      } else {
        this.domNodeBuilder.addClass("hasSecondary");
      }
    };

    b.prototype.getContainer = function() {
      return o.Build.withBuilder(this.domNodeBuilder);
    };

    b.prototype.toggleMore = function(a, b) {
      var c = "more";
      if (typeof a == "undefined") {
        a = !this.domNodeBuilder.hasClass(c);
      }

      if (a) {
        this.domNodeBuilder.addClass("more");
      } else {
        this.domNodeBuilder.removeClass("more");
      }

      if (b !== !0) {
        this.emit(s.EventType.TOGGLE, {
          expanded: a
        });
      }
    };

    b.prototype.push = function(a, b) {
      if (typeof b == "undefined") {
        b = {};
      }
      var c = this;

      var d = [];
      t.isArray(a) || (a = [a]);

      a.forEach(function(a) {
        if (b.secondary) {
          c.secondaryActionBar.push(a, b);
        } else {
          c.primaryActionBar.push(a, b);
        }
      });

      this.updateView();

      return d.length === 1 ? d[0] : d;
    };

    b.prototype.clear = function() {
      this.primaryActionBar.clear();

      this.secondaryActionBar.clear();

      this.toggleMore(!1);
    };

    b.prototype.update = function() {
      this.updateView();
    };

    b.prototype.dispose = function() {
      var b;
      while (b = this.listeners.pop()) {
        b();
      }
      this.primaryActionBar.dispose();

      this.secondaryActionBar.dispose();

      this.domNodeBuilder.empty();

      a.prototype.dispose.call(this);
    };

    return b;
  }(u.EventEmitter);
  b.ActionsWidget = D;
});