var __extends = this.__extends || function(a, b) {
    function d() {
      this.constructor = a
    }
    for (var c in b) b.hasOwnProperty(c) && (a[c] = b[c]);
    d.prototype = b.prototype, a.prototype = new d
  };
define(["require", "exports", "vs/nls", "vs/base/lib/winjs.base", "vs/base/dom/builder", "vs/base/ui/actions",
  "vs/base/lifecycle", "vs/base/dom/dom", "vs/base/ui/events", "vs/base/types", "vs/base/eventEmitter",
  "vs/base/dom/keyboardEvent", "vs/css!./actionbar"
], function(a, b, c, d, e, f, g, h, i, j, k, l) {
  function E(a, b) {
    if (a.button !== 0) return;
    a.type === r.EventType.MOUSE_DOWN ? b.addClass("active") : b.removeClass("active")
  }
  var m = c,
    n = d,
    o = e,
    p = f,
    q = g,
    r = h,
    s = i,
    t = j,
    u = k,
    v = l,
    w = o.$,
    x = function(a) {
      function b(b, c) {
        var d = this;
        a.call(this), this._callOnDispose = [], this._context = b || this, this.action = c;
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
                  d._updateUnknown(a)
              }
            })
          });
          this._callOnDispose.push(e)
        }
      }
      return __extends(b, a), b.prototype.getAction = function() {
        return this.action
      }, b.prototype.setActionContext = function(a) {
        this._context = a
      }, b.prototype.render = function(a) {
        var b = this;
        this.builder = o.Build.withElement(a), this.builder.on(r.EventType.CLICK, function(a) {
          b.onClick(a)
        }), this.builder.on("mousedown", function(a) {
          a.button === 0 && b.action.enabled && b.builder.addClass("active")
        }), this.builder.on(["mouseup", "mouseout"], function(a) {
          a.button === 0 && b.action.enabled && b.builder.removeClass("active")
        })
      }, b.prototype.onClick = function(a) {
        r.EventHelper.stop(a, !0), this.runAction(a)
      }, b.prototype.runAction = function(a) {
        var b = this;
        if (!this.action.enabled) return;
        this.emit(s.EventType.BEFORE_RUN, {
          action: this.action
        }), n.Promise.as(this.action.run(this._context || a)).then(function(a) {
          b.emit(s.EventType.RUN, {
            action: b.action,
            result: a
          })
        }, function(a) {
          b.emit(s.EventType.RUN, {
            action: b.action,
            error: a
          })
        }).done()
      }, b.prototype.focus = function() {
        this.builder.domFocus()
      }, b.prototype._updateEnabled = function() {}, b.prototype._updateLabel = function() {}, b.prototype._updateClass =
        function() {}, b.prototype._updateChecked = function() {}, b.prototype._updateUnknown = function(a) {}, b.prototype
        .dispose = function() {
          a.prototype.dispose.call(this), q.cAll(this._callOnDispose)
      }, b
    }(u.EventEmitter);
  b.BaseActionItem = x, b.Separator = {
    id: "actions.monaco.separator",
    "class": "separator",
    label: "",
    checked: !1,
    enabled: !1,
    run: function() {
      return null
    }
  };
  var y = function(a) {
    function b(b, c, d) {
      typeof d == "undefined" && (d = {}), a.call(this, b, c), this.options = d, this.options.icon = d.icon !==
        undefined ? d.icon : !1, this.options.label = d.label !== undefined ? d.label : !0, this.cssClass = ""
    }
    return __extends(b, a), b.prototype.render = function(b) {
      a.prototype.render.call(this, b), this.$e = w("a.action-label").attr("tabIndex", "-1").appendTo(this.builder),
        this.$e.attr({
          role: "menuitem"
        }), !this.options.label && this.getAction().label && this.options.icon && this.$e.attr({
          title: this.getAction().label
        }), this._updateClass(), this._updateLabel(), this._updateEnabled(), this._updateChecked()
    }, b.prototype.focus = function() {
      this.$e.domFocus()
    }, b.prototype._updateLabel = function() {
      this.options.label && this.$e.text(this.getAction().label)
    }, b.prototype._updateClass = function() {
      this.cssClass && this.$e.removeClass(this.cssClass), this.options.icon ? (this.cssClass = this.getAction().class,
        this.$e.addClass("icon"), this.$e.addClass(this.cssClass), this._updateEnabled()) : this.$e.removeClass(
        "icon")
    }, b.prototype._updateEnabled = function() {
      this.getAction().enabled ? (this.builder.removeClass("disabled"), this.$e.removeClass("disabled")) : (this.builder
        .addClass("disabled"), this.$e.addClass("disabled"))
    }, b.prototype._updateChecked = function() {
      this.getAction().checked ? this.$e.addClass("checked") : this.$e.removeClass("checked")
    }, b
  }(x);
  b.ActionItem = y;
  var z = function(a) {
    function b(b) {
      a.call(this, null, b), this.callOnDispose = []
    }
    return __extends(b, a), b.prototype.render = function(b) {
      var c = document.createElement("div");
      o.Build.withElement(c).addClass("progress-item");
      var d = document.createElement("div");
      o.Build.withElement(d).addClass("label"), d.textContent = this.getAction().label, d.title = this.getAction().label,
        a.prototype.render.call(this, d);
      var e = document.createElement("div");
      e.textContent = "…", o.Build.withElement(e).addClass("tag", "progress");
      var f = document.createElement("div");
      f.textContent = "✓", o.Build.withElement(f).addClass("tag", "done");
      var g = document.createElement("div");
      g.textContent = "!", o.Build.withElement(g).addClass("tag", "error"), this.callOnDispose.push(this.addListener(
        s.EventType.BEFORE_RUN, function() {
          o.Build.withElement(e).addClass("active"), o.Build.withElement(f).removeClass("active"), o.Build.withElement(
            g).removeClass("active")
        })), this.callOnDispose.push(this.addListener(s.EventType.RUN, function(a) {
        o.Build.withElement(e).removeClass("active"), a.error ? (o.Build.withElement(f).removeClass("active"), o.Build
          .withElement(g).addClass("active")) : (o.Build.withElement(g).removeClass("active"), o.Build.withElement(
          f).addClass("active"))
      })), c.appendChild(d), c.appendChild(e), c.appendChild(f), c.appendChild(g), b.appendChild(c)
    }, b.prototype.dispose = function() {
      q.cAll(this.callOnDispose), a.prototype.dispose.call(this)
    }, b
  }(x);
  b.ProgressItem = z,
  function(a) {
    a[a.HORIZONTAL = 1] = "HORIZONTAL", a[a.VERTICAL = 2] = "VERTICAL"
  }(b.ActionsOrientation || (b.ActionsOrientation = {}));
  var A = b.ActionsOrientation,
    B = {
      orientation: A.HORIZONTAL,
      context: null
    }, C = function(a) {
      function b(b, c) {
        typeof c == "undefined" && (c = B);
        var d = this;
        a.call(this), this.builder = b, this.options = c, this.items = [], this.focusedItem = undefined, this.domNode =
          document.createElement("div"), this.domNode.className = "monaco-action-bar", this.options.orientation === A
          .VERTICAL && (this.domNode.className += " vertical"), o.Build.withElement(this.domNode).on(r.EventType.KEY_DOWN,
            function(a) {
              var b = new v.KeyboardEvent(a),
                c = !0;
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
                  c = !1
              }
              c && (b.preventDefault(), b.stopPropagation())
            }), o.Build.withElement(this.domNode).on(r.EventType.KEY_UP, function(a) {
            var b = new v.KeyboardEvent(a);
            switch (b.asString()) {
              case "Enter":
                d.doTrigger(a), b.preventDefault(), b.stopPropagation()
            }
          }), this.actionsList = document.createElement("ul"), this.actionsList.className = "actions-container", this
          .actionsList.setAttribute("role", "menu"), this.actionsList.setAttribute("aria-label", m.localize(
            "actionBarAccessibleLabel", "Action Bar")), this.domNode.appendChild(this.actionsList), b && b.getHTMLElement()
          .appendChild(this.domNode)
      }
      return __extends(b, a), b.prototype.getContainer = function() {
        return o.Build.withElement(this.domNode)
      }, b.prototype.push = function(a, b) {
        typeof b == "undefined" && (b = {});
        var c = this;
        t.isArray(a) || (a = [a]);
        var d = t.isNumber(b.index) ? b.index : null;
        a.forEach(function(a) {
          var e = document.createElement("li");
          e.className = "action-item", e.setAttribute("role", "presentation");
          var f = null;
          c.options.actionItemProvider && (f = c.options.actionItemProvider(a)), f || (f = new y(c.options.context,
            a, b)), f.setActionContext(c.options.context), c.addEmitter(f), f.render(e), d === null || d < 0 || d >=
            c.actionsList.children.length ? c.actionsList.appendChild(e) : c.actionsList.insertBefore(e, c.actionsList
              .children[d++]), c.items.push(f)
        })
      }, b.prototype.clear = function() {
        var a;
        while (a = this.items.pop()) a.dispose();
        w(this.actionsList).empty()
      }, b.prototype.isEmpty = function() {
        return this.items.length === 0
      }, b.prototype.onContentsChange = function() {
        this.emit(s.EventType.CONTENTS_CHANGED)
      }, b.prototype.focus = function() {
        this.doFocus()
      }, b.prototype.doFocus = function(a) {
        var b = this.items.length;
        if (b === 0) return;
        typeof a == "undefined" ? typeof this.focusedItem == "undefined" && (this.focusedItem = 0) : typeof this.focusedItem ==
          "undefined" ? this.focusedItem = 0 : a ? (this.focusedItem += 1, this.focusedItem >= b && (this.focusedItem =
            0)) : (this.focusedItem -= 1, this.focusedItem < 0 && (this.focusedItem = b - 1));
        for (var c = 0; c < this.items.length; c++) {
          var d = this.items[c];
          if (!(d instanceof x)) continue;
          var e = d;
          c === this.focusedItem ? (e.focus(), e.builder.addClass("focused")) : e.builder.removeClass("focused")
        }
      }, b.prototype.doTrigger = function(a) {
        if (typeof this.focusedItem == "undefined") return;
        this.items[this.focusedItem].runAction(a)
      }, b.prototype.dispose = function() {
        this.items !== null && this.clear(), this.items = null, this.getContainer().destroy(), a.prototype.dispose.call(
          this)
      }, b.DEFAULT_OPTIONS = {
        orientation: A.HORIZONTAL
      }, b
    }(u.EventEmitter);
  b.ActionBar = C;
  var D = function(a) {
    function b(b, c) {
      typeof c == "undefined" && (c = {});
      var d = this;
      a.call(this), this.builder = b, this.options = c, this.listeners = [], this.domNodeBuilder = b.div({
        "class": "monaco-actions-widget"
      }, function(a) {
        d.primaryActionBar = new C(a), d.secondaryActionBar = new C(a, {
          orientation: A.VERTICAL
        }), d.primaryActionBar.getContainer().addClass("primary"), d.secondaryActionBar.getContainer().addClass(
          "secondary"), a.div({
          "class": "more",
          text: m.localize("more", "…")
        }).on([r.EventType.CLICK], function(a, b) {
          r.EventHelper.stop(a, !0), d.toggleMore()
        }).on([r.EventType.MOUSE_DOWN, r.EventType.MOUSE_UP, r.EventType.MOUSE_OUT], E)
      }), this.listeners.push(this.primaryActionBar.addListener(s.EventType.BEFORE_RUN, function(a) {
        a.actionType = "primary", d.emit(s.EventType.BEFORE_RUN, a)
      })), this.listeners.push(this.primaryActionBar.addListener(s.EventType.RUN, function(a) {
        a.actionType = "primary", d.emit(s.EventType.RUN, a)
      })), this.listeners.push(this.secondaryActionBar.addListener(s.EventType.BEFORE_RUN, function(a) {
        a.actionType = "secondary", d.emit(s.EventType.BEFORE_RUN, a)
      })), this.listeners.push(this.secondaryActionBar.addListener(s.EventType.RUN, function(a) {
        a.actionType = "secondary", d.emit(s.EventType.RUN, a)
      })), this.updateView()
    }
    return __extends(b, a), b.prototype.updateView = function() {
      this.primaryActionBar.items.length === 0 ? this.domNodeBuilder.removeClass("hasPrimary") : this.domNodeBuilder.addClass(
        "hasPrimary"), this.secondaryActionBar.items.length === 0 ? this.domNodeBuilder.removeClass("hasSecondary") :
        this.domNodeBuilder.addClass("hasSecondary")
    }, b.prototype.getContainer = function() {
      return o.Build.withBuilder(this.domNodeBuilder)
    }, b.prototype.toggleMore = function(a, b) {
      var c = "more";
      typeof a == "undefined" && (a = !this.domNodeBuilder.hasClass(c)), a ? this.domNodeBuilder.addClass("more") :
        this.domNodeBuilder.removeClass("more"), b !== !0 && this.emit(s.EventType.TOGGLE, {
          expanded: a
        })
    }, b.prototype.push = function(a, b) {
      typeof b == "undefined" && (b = {});
      var c = this,
        d = [];
      return t.isArray(a) || (a = [a]), a.forEach(function(a) {
        b.secondary ? c.secondaryActionBar.push(a, b) : c.primaryActionBar.push(a, b)
      }), this.updateView(), d.length === 1 ? d[0] : d
    }, b.prototype.clear = function() {
      this.primaryActionBar.clear(), this.secondaryActionBar.clear(), this.toggleMore(!1)
    }, b.prototype.update = function() {
      this.updateView()
    }, b.prototype.dispose = function() {
      var b;
      while (b = this.listeners.pop()) b();
      this.primaryActionBar.dispose(), this.secondaryActionBar.dispose(), this.domNodeBuilder.empty(), a.prototype.dispose
        .call(this)
    }, b
  }(u.EventEmitter);
  b.ActionsWidget = D
})