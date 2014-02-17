define("vs/base/ui/widgets/actionbar", ["require", "exports", "vs/nls!vs/editor/editor.main", "vs/base/lifecycle",
  "vs/base/dom/builder", "vs/base/ui/actions", "vs/base/dom/dom", "vs/base/ui/events", "vs/base/types",
  "vs/base/eventEmitter", "vs/base/dom/keyboardEvent", "vs/css!./actionbar"
], function(e, t, n, i, o, r, s, a, u, l, c) {
  var d = o.$;

  var h = function(e) {
    function t(t, n) {
      var i = this;
      if (e.call(this), this._callOnDispose = [], this._context = t || this, this._action = n, n instanceof r.Action) {
        var o = n.addBulkListener(function(e) {
          e.forEach(function(e) {
            switch (e.getType()) {
              case r.Action.ENABLED:
                i._updateEnabled();
                break;
              case r.Action.LABEL:
                i._updateLabel();

                i._updateTitle();
                break;
              case r.Action.CLASS:
                i._updateClass();
                break;
              case r.Action.CHECKED:
                i._updateChecked();
                break;
              default:
                i._updateUnknown(e);
            }
          });
        });
        this._callOnDispose.push(o);
      }
    }
    __extends(t, e);

    Object.defineProperty(t.prototype, "callOnDispose", {
      get: function() {
        return this._callOnDispose;
      },
      enumerable: !0,
      configurable: !0
    });

    Object.defineProperty(t.prototype, "actionRunner", {
      set: function(e) {
        this._actionRunner = e;
      },
      enumerable: !0,
      configurable: !0
    });

    t.prototype.getAction = function() {
      return this._action;
    };

    t.prototype.isEnabled = function() {
      return this._action.enabled;
    };

    t.prototype.setActionContext = function(e) {
      this._context = e;
    };

    t.prototype.render = function(e) {
      var t = this;
      this.builder = d(e);

      this.builder.on(s.EventType.CLICK, function(e) {
        t.onClick(e);
      });

      this.builder.on("mousedown", function(e) {
        0 === e.button && t._action.enabled && t.builder.addClass("active");
      });

      this.builder.on(["mouseup", "mouseout"], function(e) {
        0 === e.button && t._action.enabled && t.builder.removeClass("active");
      });
    };

    t.prototype.onClick = function(e) {
      s.EventHelper.stop(e, !0);

      this._actionRunner.run(this._action, this._context || e);
    };

    t.prototype.focus = function() {
      this.builder.domFocus();

      this.builder.addClass("focused");
    };

    t.prototype.blur = function() {
      this.builder.removeClass("focused");
    };

    t.prototype._updateEnabled = function() {};

    t.prototype._updateLabel = function() {};

    t.prototype._updateTitle = function() {};

    t.prototype._updateClass = function() {};

    t.prototype._updateChecked = function() {};

    t.prototype._updateUnknown = function() {};

    t.prototype.dispose = function() {
      e.prototype.dispose.call(this);

      i.cAll(this._callOnDispose);
    };

    return t;
  }(l.EventEmitter);
  t.BaseActionItem = h;
  var p = function(e) {
    function t(n, i) {
      e.call(this, t.ID, n, n ? "separator text" : "separator");

      this.checked = !1;

      this.enabled = !1;

      this.order = i;
    }
    __extends(t, e);

    t.ID = "actions.monaco.separator";

    return t;
  }(r.Action);
  t.Separator = p;
  var f = function(e) {
    function t(t, n, i) {
      "undefined" == typeof i && (i = {});

      e.call(this, t, n);

      this.options = i;

      this.options.icon = void 0 !== i.icon ? i.icon : !1;

      this.options.label = void 0 !== i.label ? i.label : !0;

      this.cssClass = "";
    }
    __extends(t, e);

    t.prototype.render = function(t) {
      e.prototype.render.call(this, t);

      this.$e = d("a.action-label").attr("tabIndex", "-1").appendTo(this.builder);

      this.$e.attr({
        role: "menuitem"
      });

      this.options.label && this.options.keybinding && d("span.keybinding").text(this.options.keybinding).appendTo(
        this.builder);

      this._updateClass();

      this._updateLabel();

      this._updateTitle();

      this._updateEnabled();

      this._updateChecked();
    };

    t.prototype.focus = function() {
      e.prototype.focus.call(this);

      this.$e.domFocus();
    };

    t.prototype._updateLabel = function() {
      this.options.label && this.$e.text(this.getAction().label);
    };

    t.prototype._updateTitle = function() {
      if (!this.options.label && this.getAction().label && this.options.icon) {
        var e = this.getAction().label;
        this.options.keybinding && (e = n.localize("vs_base_ui_widgets_actionbar", 0, e, this.options.keybinding));

        this.$e.attr({
          title: e
        });
      }
    };

    t.prototype._updateClass = function() {
      this.cssClass && this.$e.removeClass(this.cssClass);

      this.options.icon ? (this.cssClass = this.getAction().class, this.$e.addClass("icon"), this.cssClass && this.$e
        .addClass(this.cssClass), this._updateEnabled()) : this.$e.removeClass("icon");
    };

    t.prototype._updateEnabled = function() {
      this.getAction().enabled ? (this.builder.removeClass("disabled"), this.$e.removeClass("disabled")) : (this.builder
        .addClass("disabled"), this.$e.addClass("disabled"));
    };

    t.prototype._updateChecked = function() {
      this.getAction().checked ? this.$e.addClass("checked") : this.$e.removeClass("checked");
    };

    return t;
  }(h);
  t.ActionItem = f;
  var g = function(e) {
    function t() {
      e.apply(this, arguments);
    }
    __extends(t, e);

    t.prototype.render = function(t) {
      var n = document.createElement("div");
      d(n).addClass("progress-item");
      var i = document.createElement("div");
      d(i).addClass("label");

      i.textContent = this.getAction().label;

      i.title = this.getAction().label;

      e.prototype.render.call(this, i);
      var o = document.createElement("div");
      o.textContent = "…";

      d(o).addClass("tag", "progress");
      var r = document.createElement("div");
      r.textContent = "✓";

      d(r).addClass("tag", "done");
      var s = document.createElement("div");
      s.textContent = "!";

      d(s).addClass("tag", "error");

      this.callOnDispose.push(this.addListener(a.EventType.BEFORE_RUN, function() {
        d(o).addClass("active");

        d(r).removeClass("active");

        d(s).removeClass("active");
      }));

      this.callOnDispose.push(this.addListener(a.EventType.RUN, function(e) {
        d(o).removeClass("active");

        e.error ? (d(r).removeClass("active"), d(s).addClass("active")) : (d(s).removeClass("active"), d(r).addClass(
          "active"));
      }));

      n.appendChild(i);

      n.appendChild(o);

      n.appendChild(r);

      n.appendChild(s);

      t.appendChild(n);
    };

    t.prototype.dispose = function() {
      i.cAll(this.callOnDispose);

      e.prototype.dispose.call(this);
    };

    return t;
  }(h);
  t.ProgressItem = g;

  (function(e) {
    e[e.HORIZONTAL = 1] = "HORIZONTAL";

    e[e.VERTICAL = 2] = "VERTICAL";
  })(t.ActionsOrientation || (t.ActionsOrientation = {}));
  var m = (t.ActionsOrientation, {
    orientation: 1,
    context: null
  });

  var v = function(e) {
    function t(t, i) {
      "undefined" == typeof i && (i = m);
      var o = this;
      e.call(this);

      this.builder = t;

      this.options = i;

      this.toDispose = [];

      this._actionRunner = this.options.actionRunner;

      this._actionRunner || (this._actionRunner = new r.ActionRunner, this.toDispose.push(this._actionRunner));

      this.toDispose.push(this.addEmitter2(this._actionRunner));

      this.items = [];

      this.focusedItem = void 0;

      this.domNode = document.createElement("div");

      this.domNode.className = "monaco-action-bar";

      this.domNode.tabIndex = 0;

      2 === this.options.orientation && (this.domNode.className += " vertical");

      d(this.domNode).on(s.EventType.KEY_DOWN, function(e) {
        var t = new c.KeyboardEvent(e);

        var n = !0;
        switch (t.asString()) {
          case "UpArrow":
          case "LeftArrow":
            o.focusPrevious();
            break;
          case "DownArrow":
          case "RightArrow":
            o.focusNext();
            break;
          case "Escape":
            o.cancel();
            break;
          case "Enter":
            break;
          default:
            n = !1;
        }
        n && (t.preventDefault(), t.stopPropagation());
      });

      d(this.domNode).on(s.EventType.KEY_UP, function(e) {
        var t = new c.KeyboardEvent(e);
        switch (t.asString()) {
          case "Enter":
            o.doTrigger(t);

            t.preventDefault();

            t.stopPropagation();
        }
      });
      var a = s.trackFocus(this.domNode);
      a.addBlurListener(function(e) {
        document.activeElement !== o.domNode && s.isAncestor(document.activeElement, o.domNode) || o.emit("blur", e);
      });

      this.actionsList = document.createElement("ul");

      this.actionsList.className = "actions-container";

      this.actionsList.setAttribute("role", "menu");

      this.actionsList.setAttribute("aria-label", n.localize("vs_base_ui_widgets_actionbar", 1));

      this.domNode.appendChild(this.actionsList);

      t && t.getHTMLElement().appendChild(this.domNode);
    }
    __extends(t, e);

    Object.defineProperty(t.prototype, "actionRunner", {
      get: function() {
        return this._actionRunner;
      },
      set: function(e) {
        e && (this._actionRunner = e, this.items.forEach(function(t) {
          return t.actionRunner = e;
        }));
      },
      enumerable: !0,
      configurable: !0
    });

    t.prototype.getContainer = function() {
      return d(this.domNode);
    };

    t.prototype.push = function(e, t) {
      "undefined" == typeof t && (t = {});
      var n = this;
      Array.isArray(e) || (e = [e]);
      var i = u.isNumber(t.index) ? t.index : null;
      e.forEach(function(e) {
        var o = document.createElement("li");
        o.className = "action-item";

        o.setAttribute("role", "presentation");
        var r = null;
        n.options.actionItemProvider && (r = n.options.actionItemProvider(e));

        r || (r = new f(n.options.context, e, t));

        r.actionRunner = n._actionRunner;

        r.setActionContext(n.options.context);

        n.addEmitter(r);

        r.render(o);

        null === i || 0 > i || i >= n.actionsList.children.length ? n.actionsList.appendChild(o) : n.actionsList.insertBefore(
          o, n.actionsList.children[i++]);

        n.items.push(r);
      });
    };

    t.prototype.clear = function() {
      for (var e; e = this.items.pop();) {
        e.dispose();
      }
      d(this.actionsList).empty();
    };

    t.prototype.length = function() {
      return this.items.length;
    };

    t.prototype.isEmpty = function() {
      return 0 === this.items.length;
    };

    t.prototype.onContentsChange = function() {
      this.emit(a.EventType.CONTENTS_CHANGED);
    };

    t.prototype.focus = function(e) {
      e && "undefined" == typeof this.focusedItem && (this.focusedItem = 0);

      this.updateFocus();
    };

    t.prototype.focusNext = function() {
      "undefined" == typeof this.focusedItem && (this.focusedItem = this.items.length - 1);
      var e;

      var t = this.focusedItem;
      do {
        this.focusedItem = (this.focusedItem + 1) % this.items.length;
        e = this.items[this.focusedItem];
      } while (this.focusedItem !== t && !e.isEnabled());
      this.focusedItem !== t || e.isEnabled() || (this.focusedItem = void 0);

      this.updateFocus();
    };

    t.prototype.focusPrevious = function() {
      "undefined" == typeof this.focusedItem && (this.focusedItem = 0);
      var e;

      var t = this.focusedItem;
      do {
        this.focusedItem = this.focusedItem - 1;
        this.focusedItem < 0 && (this.focusedItem = this.items.length - 1);
        e = this.items[this.focusedItem];
      } while (this.focusedItem !== t && !e.isEnabled());
      this.focusedItem !== t || e.isEnabled() || (this.focusedItem = void 0);

      this.updateFocus();
    };

    t.prototype.updateFocus = function() {
      if ("undefined" == typeof this.focusedItem) {
        this.domNode.focus();
        return void 0;
      }
      for (var e = 0; e < this.items.length; e++) {
        var t = this.items[e];

        var n = t;
        e === this.focusedItem ? u.isFunction(n.focus) && n.focus() : u.isFunction(n.blur) && n.blur();
      }
    };

    t.prototype.doTrigger = function(e) {
      if ("undefined" != typeof this.focusedItem) {
        var t = this.items[this.focusedItem];
        this.run(t._action, t._context || e).done();
      }
    };

    t.prototype.cancel = function() {
      this.emit(a.EventType.CANCEL);
    };

    t.prototype.run = function(e, t) {
      return this._actionRunner.run(e, t);
    };

    t.prototype.dispose = function() {
      null !== this.items && this.clear();

      this.items = null;

      this.toDispose = i.disposeAll(this.toDispose);

      this.getContainer().destroy();

      e.prototype.dispose.call(this);
    };

    t.DEFAULT_OPTIONS = {
      orientation: 1
    };

    return t;
  }(l.EventEmitter);
  t.ActionBar = v;
});