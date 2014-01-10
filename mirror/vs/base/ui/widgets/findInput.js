define(["require", "exports", "vs/nls", "vs/base/dom/builder", "vs/base/dom/dom", "vs/base/dom/mouseEvent",
  "vs/base/strings", "vs/css!./findInput"
], function(a, b, c, d, e, f, g) {
  var h = c,
    i = d,
    j = e,
    k = f,
    l = g,
    m = function() {
      function a(a, b, c, d) {
        var e = this;
        this.actionClassName = a, this.title = b, this.isChecked = c, this.onChange = d, this.listenersToRemove = [],
          this.domNode = document.createElement("div"), this.domNode.title = b, this.render(), i.Build.withElement(
            this.domNode).on("click", function(a) {
            var b = new k.MouseEvent(a);
            e.isChecked = !e.isChecked, e.render(), e.onChange(), b.preventDefault()
          }, this.listenersToRemove)
      }
      return a.prototype.render = function() {
        this.domNode.className = this.className()
      }, a.prototype.setChecked = function(a) {
        this.isChecked = a, this.render()
      }, a.prototype.className = function() {
        return "custom-checkbox " + this.actionClassName + " " + (this.isChecked ? "checked" : "unchecked")
      }, a.prototype.width = function() {
        return 23
      }, a.prototype.destroy = function() {
        this.listenersToRemove.forEach(function(a) {
          a()
        }), this.listenersToRemove = []
      }, a
    }();
  b.CustomCheckbox = m;
  var n = function() {
    function a(a, b) {
      this.onOptionChange = null, this.width = b.width || 100, this.placeholder = b.placeholder || "", this.validation =
        b.validation, this.label = b.label || h.localize("defaultLabel", "input"), this.listenersToRemove = [], this.regex =
        null, this.wholeWords = null, this.caseSensitive = null, this.domNode = null, this.inputNode = null, this.validationNode =
        null, this.buildDomNode(), Boolean(a) && a.appendChild(this.domNode)
    }
    return a.prototype.destroy = function() {
      this.regex.destroy(), this.wholeWords.destroy(), this.caseSensitive.destroy(), this.listenersToRemove.forEach(
        function(a) {
          a()
        }), this.listenersToRemove = []
    }, a.prototype.on = function(b, c) {
      switch (b) {
        case "keydown":
        case "keyup":
          i.Build.withElement(this.inputNode).on(b, c, this.listenersToRemove);
          break;
        case a.OPTION_CHANGE:
          this.onOptionChange = c
      }
      return this
    }, a.prototype.enable = function() {
      this.inputNode.disabled = !1
    }, a.prototype.disable = function() {
      this.inputNode.disabled = !0
    }, a.prototype.setWidth = function(a) {
      this.width = a, this.domNode.style.width = this.width + "px", this.setInputWidth()
    }, a.prototype.getValue = function() {
      return this.inputNode.value
    }, a.prototype.setValue = function(a) {
      this.inputNode.value = a
    }, a.prototype.select = function() {
      this.inputNode.select()
    }, a.prototype.focus = function() {
      this.inputNode.focus()
    }, a.prototype.getCaseSensitive = function() {
      return this.caseSensitive.isChecked
    }, a.prototype.setCaseSensitive = function(a) {
      this.caseSensitive.setChecked(a), this.setInputWidth()
    }, a.prototype.getWholeWords = function() {
      return this.wholeWords.isChecked
    }, a.prototype.setWholeWords = function(a) {
      this.wholeWords.setChecked(a), this.setInputWidth()
    }, a.prototype.getRegex = function() {
      return this.regex.isChecked
    }, a.prototype.setRegex = function(a) {
      this.regex.setChecked(a), this.setInputWidth()
    }, a.prototype.setInputWidth = function() {
      var a = this.width - this.caseSensitive.width() - this.wholeWords.width() - this.regex.width() - 4;
      this.inputNode.style.width = a + "px"
    }, a.prototype.buildDomNode = function() {
      var a = this;
      this.inputNode = document.createElement("input"), i.Build.withElement(this.inputNode).addClass("input").attr({
        placeholder: this.placeholder || "",
        wrap: "off",
        autocorrect: "off",
        autocapitalize: "off",
        spellcheck: "false",
        "aria-label": this.label
      }).type("text").on(j.EventType.KEY_UP, function(b, c) {
        Boolean(a.validation) && a.validate()
      }), this.domNode = document.createElement("div"), this.domNode.style.width = this.width + "px", i.Build.withElement(
        this.domNode).addClass("monaco-findInput"), this.regex = new m("regex", h.localize("regexDescription",
        "Use regular expression"), !1, function() {
        a.onOptionChange(null), a.inputNode.focus(), a.setInputWidth(), a.validate()
      }), this.wholeWords = new m("whole-word", h.localize("wordsDescription", "Match whole word"), !1, function() {
        a.onOptionChange(null), a.inputNode.focus(), a.setInputWidth(), a.validate()
      }), this.caseSensitive = new m("case-sensitive", h.localize("caseDescription", "Match case"), !1, function() {
        a.onOptionChange(null), a.inputNode.focus(), a.setInputWidth(), a.validate()
      }), this.setInputWidth(), this.domNode.appendChild(this.inputNode), this.domNode.appendChild(this.regex.domNode),
        this.domNode.appendChild(this.wholeWords.domNode), this.domNode.appendChild(this.caseSensitive.domNode)
    }, a.prototype.validate = function() {
      var a = l.trim(this.inputNode.value),
        b = this.validation(l.trim(a));
      if (b === "") this.validationNode && i.$(this.domNode).removeChild(this.validationNode), this.validationNode =
        null, this.inputNode.setAttribute("title", "");
      else {
        var c = document.createElement("span");
        c.className = "text-measure", c.textContent = a, this.domNode.appendChild(c);
        if (!this.validationNode) {
          var d = document.createElement("div");
          d.className = "validation-decoration", this.domNode.insertBefore(d, this.inputNode), this.validationNode =
            i.$(d), this.inputNode.setAttribute("title", b)
        }
        this.validationNode.size(c.offsetWidth, c.offsetHeight), this.domNode.removeChild(c)
      }
    }, a.OPTION_CHANGE = "optionChange", a
  }();
  b.FindInput = n
})