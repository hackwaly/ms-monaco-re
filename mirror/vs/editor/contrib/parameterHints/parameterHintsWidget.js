define(["require", "exports", "vs/base/dom/builder", "vs/editor/core/constants", "vs/editor/editor",
  "vs/css!./parameterHints"
], function(a, b, c, d, e) {
  var f = c,
    g = d,
    h = e,
    i = f.$,
    j = function() {
      function a(b, c, d) {
        var e = this;
        this.editor = c, this.modelListenersToRemove = [], this.model = null, this.isVisible = !1, this.setModel(b),
          this.triggerCharactersListeners = [];
        var f = function() {
          while (e.triggerCharactersListeners.length > 0) e.triggerCharactersListeners.pop()();
          if (e.editor.getModel()) {
            var a = e.editor.getModel().getMode();
            if (a.parameterHintsSupport) {
              var b = a.parameterHintsSupport.getParameterHintsTriggerCharacters();
              for (var c = 0; c < b.length; c++) e.triggerCharactersListeners.push(e.editor.addTypingListener(b[c],
                function() {
                  return e.model.trigger()
                }))
            }
          }
        };
        this.modelListenersToRemove.push(this.editor.addListener(g.EventType.ModelChanged, f)), this.modelListenersToRemove
          .push(this.editor.addListener(g.EventType.ModelModeChanged, f)), this.$el = i(
            ".editor-widget.parameter-hints-widget").on("click", function() {
            e.selectNext(), e.editor.focus()
          }), this.$wrapper = i(".wrapper.monaco-editor-background").appendTo(this.$el);
        var h = i(".buttons").appendTo(this.$wrapper),
          j = i(".button.previous").on("click", function(a) {
            a.preventDefault(), a.stopPropagation(), e.selectPrevious()
          }).appendTo(h),
          k = i(".button.next").on("click", function(a) {
            a.preventDefault(), a.stopPropagation(), e.selectNext()
          }).appendTo(h);
        this.$overloads = i(".overloads").appendTo(this.$wrapper), this.$signatures = i(".signatures").appendTo(this.$wrapper),
          this.signatureViews = [], this.currentSignature = 0, this.bindings = d.bindGroup(function(a) {
            a({
              key: "Escape"
            }, e.cancel.bind(e)), a({
              key: "UpArrow"
            }, e.selectPrevious.bind(e)), a({
              key: "DownArrow"
            }, e.selectNext.bind(e))
          }, {
            id: a.ID
          }), this.editor.addContentWidget(this), this.hide()
      }
      return a.prototype.setModel = function(a) {
        var b = this;
        this.releaseModel(), this.model = a, this.modelListenersToRemove.push(this.model.addListener("hint", function(
          a) {
          b.show(), b.render(a.hints), b.currentSignature = a.hints.currentSignature, b.select(b.currentSignature)
        })), this.modelListenersToRemove.push(this.model.addListener("cancel", function(a) {
          b.hide()
        }))
      }, a.prototype.show = function() {
        this.isVisible = !0, this.$el.removeClass("hidden"), this.bindings.activate(), this.editor.layoutContentWidget(
          this)
      }, a.prototype.hide = function() {
        this.isVisible = !1, this.bindings.deactivate(), this.$el.addClass("hidden"), this.editor.layoutContentWidget(
          this)
      }, a.prototype.getPosition = function() {
        return this.isVisible ? {
          position: this.editor.getPosition(),
          preference: [h.ContentWidgetPositionPreference.ABOVE, h.ContentWidgetPositionPreference.BELOW]
        } : null
      }, a.prototype.render = function(a) {
        a.signatures.length > 1 ? this.$el.addClass("multiple") : this.$el.removeClass("multiple"), this.$signatures.empty(),
          this.signatureViews = [];
        var b = 0,
          c = a.currentSignature;
        for (var d = 0, e = a.signatures.length; d < e; d++) {
          var f = a.signatures[d],
            g = this.renderSignature(this.$signatures, f, a.currentParameter);
          this.renderDocumentation(g, f, a.currentParameter);
          var h = g.getClientArea().height;
          this.signatureViews.push({
            top: b,
            height: h
          }), b += h
        }
      }, a.prototype.renderSignature = function(a, b, c) {
        var d = i(".signature").appendTo(a),
          e = b.label,
          f = b.parameters.length > 0;
        if (!f) d.append(i("span").text(b.label));
        else {
          var g = i("span.parameters"),
            h = 0;
          for (var j = 0, k = b.parameters.length; j < k; j++) {
            var l = b.parameters[j];
            (j === 0 ? d : g).append(i("span").text(b.label.substring(h, l.signatureLabelOffset))), g.append(i(
              "span.parameter").addClass(j === c ? "active" : "").text(b.label.substring(l.signatureLabelOffset, l.signatureLabelEnd))),
              h = l.signatureLabelEnd
          }
          d.append(g), d.append(i("span").text(b.label.substring(h)))
        }
        return d
      }, a.prototype.renderDocumentation = function(a, b, c) {
        b.documentation && a.append(i(".documentation").text(b.documentation));
        var d = b.parameters[c];
        if (d && d.documentation) {
          var e = i(".documentation");
          e.append(i("span.parameter").text(d.label)), e.append(i("span").text(d.documentation)), a.append(e)
        }
      }, a.prototype.select = function(a) {
        var b = this.signatureViews[a];
        this.$signatures.style({
          height: b.height + "px"
        }), this.$signatures.getHTMLElement().scrollTop = b.top, this.$overloads.text(a + 1 + "/" + this.signatureViews
          .length)
      }, a.prototype.selectNext = function() {
        return this.signatureViews.length < 2 ? (this.cancel(), !1) : (this.currentSignature = (this.currentSignature +
          1) % this.signatureViews.length, this.select(this.currentSignature), !0)
      }, a.prototype.selectPrevious = function() {
        return this.signatureViews.length < 2 ? (this.cancel(), !1) : (this.currentSignature--, this.currentSignature <
          0 && (this.currentSignature = this.signatureViews.length - 1), this.select(this.currentSignature), !0)
      }, a.prototype.cancel = function() {
        this.model.cancel()
      }, a.prototype.getDomNode = function() {
        return this.$el.getHTMLElement()
      }, a.prototype.getId = function() {
        return a.ID
      }, a.prototype.releaseModel = function() {
        var a;
        while (a = this.modelListenersToRemove.pop()) a();
        this.model && (this.model.dispose(), this.model = null)
      }, a.prototype.destroy = function() {
        this.releaseModel();
        while (this.triggerCharactersListeners.length > 0) this.triggerCharactersListeners.pop()();
        this.$overloads && (this.$overloads.destroy(), delete this.$overloads), this.$signatures && (this.$signatures
          .destroy(), delete this.$signatures), this.$wrapper && (this.$wrapper.destroy(), delete this.$wrapper),
          this.$el && (this.$el.destroy(), delete this.$el), this.bindings && (this.bindings.dispose(), delete this.bindings)
      }, a.ID = "editor.widget.parameterHintsWidget", a
    }();
  b.ParameterHintsWidget = j
})