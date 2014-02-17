define("vs/base/ui/widgets/findInput", ["require", "exports", "vs/nls!vs/editor/editor.main", "vs/base/dom/builder",
  "vs/base/dom/mouseEvent", "vs/base/dom/keyboardEvent", "vs/base/ui/widgets/inputBox", "vs/css!./findInput"
], function(e, t, n, i, o, r, s) {
  var a = i.$;

  var u = function() {
    function e(e, t, n, i) {
      var s = this;
      this.actionClassName = e;

      this.title = t;

      this.isChecked = n;

      this.onChange = i;

      this.listenersToRemove = [];

      this.domNode = document.createElement("div");

      this.domNode.title = t;

      this.render();

      a(this.domNode).attr({
        "aria-checked": "false",
        "aria-label": this.title,
        tabindex: 0,
        role: "checkbox"
      });

      a(this.domNode).on("click", function(e) {
        var t = new o.StandardMouseEvent(e);
        s.isChecked = !s.isChecked;

        s.render();

        s.onChange();

        t.preventDefault();
      }, this.listenersToRemove);

      a(this.domNode).on("keydown", function(e) {
        var t = new r.KeyboardEvent(e);
        ("Space" === t.key || "Enter" === t.key) && (s.isChecked = !s.isChecked, s.render(), s.onChange(), t.preventDefault());
      }, this.listenersToRemove);
    }
    e.prototype.render = function() {
      this.domNode.className = this.className();
    };

    e.prototype.setChecked = function(e) {
      this.isChecked = e;

      a(this.domNode).attr("aria-checked", this.isChecked);

      this.render();
    };

    e.prototype.className = function() {
      return "custom-checkbox " + this.actionClassName + " " + (this.isChecked ? "checked" : "unchecked");
    };

    e.prototype.width = function() {
      return 22;
    };

    e.prototype.destroy = function() {
      this.listenersToRemove.forEach(function(e) {
        e();
      });

      this.listenersToRemove = [];
    };

    return e;
  }();
  t.CustomCheckbox = u;
  var l = function() {
    function e(e, t, i) {
      this.contextViewProvider = t;

      this.onOptionChange = null;

      this.width = i.width || 100;

      this.placeholder = i.placeholder || "";

      this.validation = i.validation;

      this.label = i.label || n.localize("vs_base_ui_widgets_findInput", 0);

      this.listenersToRemove = [];

      this.regex = null;

      this.wholeWords = null;

      this.caseSensitive = null;

      this.domNode = null;

      this.inputNode = null;

      this.inputBox = null;

      this.validationNode = null;

      this.buildDomNode();

      Boolean(e) && e.appendChild(this.domNode);
    }
    e.prototype.destroy = function() {
      this.regex.destroy();

      this.wholeWords.destroy();

      this.caseSensitive.destroy();

      this.listenersToRemove.forEach(function(e) {
        e();
      });

      this.listenersToRemove = [];
    };

    e.prototype.on = function(t, n) {
      switch (t) {
        case "keydown":
        case "keyup":
          a(this.inputBox.inputElement).on(t, n);
          break;
        case "click":
          a(this.inputBox.inputElement).on(t, n);
          break;
        case e.OPTION_CHANGE:
          this.onOptionChange = n;
      }
      return this;
    };

    e.prototype.enable = function() {
      a(this.domNode).removeClass("disabled");

      this.inputBox.enable();
    };

    e.prototype.disable = function() {
      a(this.domNode).addClass("disabled");

      this.inputBox.disable();
    };

    e.prototype.clear = function() {
      this.clearValidation();

      this.setValue("");

      this.focus();
    };

    e.prototype.setWidth = function(e) {
      this.width = e;

      this.domNode.style.width = this.width + "px";

      this.contextViewProvider.layout();

      this.setInputWidth();
    };

    e.prototype.cursorIsAtBeginning = function() {
      return this.inputBox.cursorIsAtBeginning();
    };

    e.prototype.cursorIsAtEnd = function() {
      return this.inputBox.cursorIsAtEnd();
    };

    e.prototype.getValue = function() {
      return this.inputBox.value;
    };

    e.prototype.setValue = function(e) {
      this.inputBox.value !== e && (this.inputBox.value = e);
    };

    e.prototype.select = function() {
      this.inputBox.select();
    };

    e.prototype.focus = function() {
      this.inputBox.focus();
    };

    e.prototype.getCaseSensitive = function() {
      return this.caseSensitive.isChecked;
    };

    e.prototype.setCaseSensitive = function(e) {
      this.caseSensitive.setChecked(e);

      this.setInputWidth();
    };

    e.prototype.getWholeWords = function() {
      return this.wholeWords.isChecked;
    };

    e.prototype.setWholeWords = function(e) {
      this.wholeWords.setChecked(e);

      this.setInputWidth();
    };

    e.prototype.getRegex = function() {
      return this.regex.isChecked;
    };

    e.prototype.setRegex = function(e) {
      this.regex.setChecked(e);

      this.setInputWidth();
    };

    e.prototype.setInputWidth = function() {
      var e = this.width - this.caseSensitive.width() - this.wholeWords.width() - this.regex.width();
      this.inputBox.width = e;
    };

    e.prototype.buildDomNode = function() {
      var e = this;
      this.domNode = document.createElement("div");

      this.domNode.style.width = this.width + "px";

      a(this.domNode).addClass("monaco-findInput");

      this.inputBox = new s.InputBox(this.domNode, this.contextViewProvider, {
        placeholder: this.placeholder || "",
        ariaLabel: this.label || "",
        validationOptions: {
          validation: this.validation || null,
          showMessage: !0
        }
      });

      this.regex = new u("regex", n.localize("vs_base_ui_widgets_findInput", 1), !1, function() {
        e.onOptionChange(null);

        e.inputBox.focus();

        e.setInputWidth();

        e.validate();
      });

      this.wholeWords = new u("whole-word", n.localize("vs_base_ui_widgets_findInput", 2), !1, function() {
        e.onOptionChange(null);

        e.inputBox.focus();

        e.setInputWidth();

        e.validate();
      });

      this.caseSensitive = new u("case-sensitive", n.localize("vs_base_ui_widgets_findInput", 3), !1, function() {
        e.onOptionChange(null);

        e.inputBox.focus();

        e.setInputWidth();

        e.validate();
      });

      this.setInputWidth();
      var t = document.createElement("div");
      t.className = "controls";

      t.appendChild(this.caseSensitive.domNode);

      t.appendChild(this.wholeWords.domNode);

      t.appendChild(this.regex.domNode);

      this.domNode.appendChild(t);
    };

    e.prototype.validate = function() {
      this.inputBox.validate();
    };

    e.prototype.showMessage = function(e) {
      this.inputBox.showMessage(e);
    };

    e.prototype.clearMessage = function() {
      this.inputBox.hideMessage();
    };

    e.prototype.clearValidation = function() {
      this.inputBox.hideMessage();
    };

    e.OPTION_CHANGE = "optionChange";

    return e;
  }();
  t.FindInput = l;
});