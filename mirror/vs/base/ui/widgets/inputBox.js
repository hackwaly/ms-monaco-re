define("vs/base/ui/widgets/inputBox", ["require", "exports", "vs/base/env", "vs/base/dom/builder", "vs/base/dom/dom",
  "vs/base/dom/htmlContent", "vs/base/eventEmitter", "vs/base/ui/widgets/contextview/contextview",
  "vs/css!./inputBox"
], function(e, t, n, i, o, r, s) {
  var a = i.$;
  ! function(e) {
    e[e.INFO = 1] = "INFO";

    e[e.WARNING = 2] = "WARNING";

    e[e.ERROR = 3] = "ERROR";
  }(t.MessageType || (t.MessageType = {}));
  var u = (t.MessageType, function(e) {
    function t(t, i, r) {
      var s = this;
      e.call(this);

      this.state = "idle";

      this.contextViewProvider = i;

      this.$placeholderShim = null;

      this.message = null;

      this.placeholder = r && r.placeholder || "";

      this.ariaLabel = r && r.ariaLabel || "";

      r && r.validationOptions && (this.validation = r.validationOptions.validation, this.showValidationMessage = r
        .validationOptions.showMessage || !1);

      this.$el = a(".monaco-inputbox.idle").appendTo(t);
      var u = a(".wrapper").appendTo(this.$el);

      var l = {
        wrap: "off",
        autocorrect: "off",
        autocapitalize: "off",
        spellcheck: "false"
      };
      this.ariaLabel && (l["aria-label"] = this.ariaLabel);

      !n.browser.isIE11orEarlier && this.placeholder && (l.placeholder = this.placeholder);

      this.$input = a("input.input").type("text").attr(l).on(o.EventType.INPUT, function() {
        s.onValueChange();
      }).on(o.EventType.BLUR, function() {
        s._hideMessage();
      }).on(o.EventType.FOCUS, function() {
        s._showMessage();
      });

      this.placeholder && n.browser.isIE11orEarlier && (this.$placeholderShim = a("label.placeholder-shim").appendTo(
        u).attr({
        text: this.placeholder,
        "for": "input"
      }).on(o.EventType.CLICK, function(e) {
        o.EventHelper.stop(e, !0);

        s.$input.domFocus();
      }), n.browser.isIE9 && this.$input.on("keyup", function() {
        return s.onValueChange();
      }));

      this.$input.appendTo(u);
    }
    __extends(t, e);

    t.prototype.setContextViewProvider = function(e) {
      this.contextViewProvider = e;
    };

    Object.defineProperty(t.prototype, "inputElement", {
      get: function() {
        return this.$input.getHTMLElement();
      },
      enumerable: !0,
      configurable: !0
    });

    Object.defineProperty(t.prototype, "value", {
      get: function() {
        return this.inputElement.value;
      },
      set: function(e) {
        this.inputElement.value !== e && (this.inputElement.value = e, this.onValueChange());
      },
      enumerable: !0,
      configurable: !0
    });

    t.prototype.cursorIsAtBeginning = function() {
      var e = this.inputElement.selectionStart;

      var t = this.inputElement.selectionEnd;
      return e === t && 0 === e;
    };

    t.prototype.cursorIsAtEnd = function() {
      var e = this.inputElement.selectionStart;

      var t = this.inputElement.selectionEnd;

      var n = this.inputElement.value.length;
      return e === t && e === n;
    };

    t.prototype.focus = function() {
      this.$input.domFocus();
    };

    t.prototype.hasFocus = function() {
      return this.$input.hasFocus();
    };

    t.prototype.select = function(e) {
      "undefined" == typeof e && (e = null);

      this.$input.domSelect(e);
    };

    t.prototype.enable = function() {
      this.inputElement.removeAttribute("disabled");
    };

    t.prototype.disable = function() {
      this.$input.attr({
        disabled: !0
      });

      this._hideMessage();
    };

    Object.defineProperty(t.prototype, "width", {
      get: function() {
        return this.$input.getTotalSize().width;
      },
      set: function(e) {
        this.$input.size(e);
      },
      enumerable: !0,
      configurable: !0
    });

    t.prototype.showMessage = function(e) {
      this.message = e;

      this.$el.removeClass("idle info warning error").addClass(this.classForType(e.type));

      this.hasFocus() && this._showMessage();
    };

    t.prototype.hideMessage = function() {
      this.message = null;

      this.$el.removeClass("info warning error").addClass("idle");

      this._hideMessage();
    };

    t.prototype.validate = function() {
      var e = null;
      this.validation && (e = this.validation(this.value), e ? this.showMessage(e) : this.hideMessage());

      return !e;
    };

    t.prototype.classForType = function(e) {
      switch (e) {
        case 1:
          return "info";
        case 2:
          return "warning";
        default:
          return "error";
      }
    };

    t.prototype._showMessage = function() {
      var e = this;
      if (this.contextViewProvider && this.showValidationMessage && this.message) {
        var t;
        this.state = "open";

        this.contextViewProvider.showContextView({
          getAnchor: function() {
            return e.$el.getHTMLElement();
          },
          anchorAlignment: 1,
          render: function(n) {
            var i = e.$el.getTotalSize();
            t = a("div.monaco-inputbox-container").style({
              width: i.width + "px"
            }).appendTo(n);
            var o = r.renderHtml({
              tagName: "span",
              className: "monaco-inputbox-message",
              formattedText: e.message.content
            });

            var s = a(o).addClass(e.classForType(e.message.type)).appendTo(t);
            return {
              dispose: function() {
                s.destroy();

                t.destroy();
              }
            };
          },
          layout: function() {
            var n = e.$el.getTotalSize();
            t.style({
              width: n.width + "px"
            });
          }
        });
      }
    };

    t.prototype._hideMessage = function() {
      this.contextViewProvider && "open" === this.state && (this.state = "idle", this.contextViewProvider.hideContextView());
    };

    t.prototype.onValueChange = function() {
      this.emit("change", this.value);

      this.validate();

      this.$placeholderShim && (this.value ? this.$placeholderShim.hide() : this.$placeholderShim.show());
    };

    t.prototype.dispose = function() {
      this.$el && (this.$el.dispose(), this.$el = null, this.$input.dispose(), this.$input = null);

      this.$placeholderShim && (this.$placeholderShim.dispose(), this.$placeholderShim = null);

      this.contextViewProvider = null;

      this.message = null;

      this.placeholder = null;

      this.ariaLabel = null;

      this.validation = null;

      this.showValidationMessage = null;

      this.state = null;

      e.prototype.dispose.call(this);
    };

    return t;
  }(s.EventEmitter));
  t.InputBox = u;
});