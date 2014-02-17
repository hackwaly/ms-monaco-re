define("vs/editor/contrib/parameterHints/parameterHintsWidget", ["require", "exports", "vs/base/dom/builder",
  "vs/editor/editor", "vs/css!./parameterHints"
], function(e, t, n) {
  var i = n.$;

  var o = function() {
    function e(t, n, o) {
      var r = this;
      this.editor = o;

      this.modelListenersToRemove = [];

      this.model = null;

      this.isVisible = !1;

      this.setModel(n);

      this.$el = i(".editor-widget.parameter-hints-widget").on("click", function() {
        r.selectNext();

        r.editor.focus();
      });

      this.$wrapper = i(".wrapper.monaco-editor-background").appendTo(this.$el);
      var s = i(".buttons").appendTo(this.$wrapper);
      i(".button.previous").on("click", function(e) {
        e.preventDefault();

        e.stopPropagation();

        r.selectPrevious();
      }).appendTo(s);

      i(".button.next").on("click", function(e) {
        e.preventDefault();

        e.stopPropagation();

        r.selectNext();
      }).appendTo(s);

      this.$overloads = i(".overloads").appendTo(this.$wrapper);

      this.$signatures = i(".signatures").appendTo(this.$wrapper);

      this.bindings = t.handlerService.bindGroup(function(e) {
        e({
          key: "Escape"
        }, r.cancel.bind(r));

        e({
          key: "UpArrow"
        }, r.selectPrevious.bind(r));

        e({
          key: "DownArrow"
        }, r.selectNext.bind(r));
      }, {
        id: e.ID
      });

      this.signatureViews = [];

      this.currentSignature = 0;

      this.editor.addContentWidget(this);

      this.hide();
    }
    e.prototype.setModel = function(e) {
      var t = this;
      this.releaseModel();

      this.model = e;

      this.modelListenersToRemove.push(this.model.addListener("hint", function(e) {
        t.show();

        t.render(e.hints);

        t.currentSignature = e.hints.currentSignature;

        t.select(t.currentSignature);
      }));

      this.modelListenersToRemove.push(this.model.addListener("cancel", function() {
        t.hide();
      }));
    };

    e.prototype.show = function() {
      if (this.bindings) {
        this.isVisible = !0;
        this.$el.removeClass("hidden");
        this.bindings.activate();
        this.editor.layoutContentWidget(this);
      }
    };

    e.prototype.hide = function() {
      if (this.bindings) {
        this.isVisible = !1;
        this.bindings.deactivate();
        this.$el.addClass("hidden");
        this.editor.layoutContentWidget(this);
      }
    };

    e.prototype.getPosition = function() {
      return this.isVisible ? {
        position: this.editor.getPosition(),
        preference: [1, 2]
      } : null;
    };

    e.prototype.render = function(e) {
      if (e.signatures.length > 1) {
        this.$el.addClass("multiple");
      }

      {
        this.$el.removeClass("multiple");
      }

      this.$signatures.empty();

      this.signatureViews = [];
      for (var t = 0, n = 0, i = e.signatures.length; i > n; n++) {
        var o = e.signatures[n];

        var r = this.renderSignature(this.$signatures, o, e.currentParameter);
        this.renderDocumentation(r, o, e.currentParameter);
        var s = r.getClientArea().height;
        this.signatureViews.push({
          top: t,
          height: s
        });

        t += s;
      }
    };

    e.prototype.renderSignature = function(e, t, n) {
      var o = i(".signature").appendTo(e);

      var r = (t.label, t.parameters.length > 0);
      if (r) {
        for (var s = i("span.parameters"), a = 0, u = 0, l = t.parameters.length; l > u; u++) {
          var c = t.parameters[u];
          (0 === u ? o : s).append(i("span").text(t.label.substring(a, c.signatureLabelOffset)));

          s.append(i("span.parameter").addClass(u === n ? "active" : "").text(t.label.substring(c.signatureLabelOffset,
            c.signatureLabelEnd)));

          a = c.signatureLabelEnd;
        }
        o.append(s);

        o.append(i("span").text(t.label.substring(a)));
      } else {
        o.append(i("span").text(t.label));
      }
      return o;
    };

    e.prototype.renderDocumentation = function(e, t, n) {
      if (t.documentation) {
        e.append(i(".documentation").text(t.documentation));
      }
      var o = t.parameters[n];
      if (o && o.documentation) {
        var r = i(".documentation");
        r.append(i("span.parameter").text(o.label));

        r.append(i("span").text(o.documentation));

        e.append(r);
      }
    };

    e.prototype.select = function(e) {
      var t = this.signatureViews[e];
      this.$signatures.style({
        height: t.height + "px"
      });

      this.$signatures.getHTMLElement().scrollTop = t.top;

      this.$overloads.text(e + 1 + "/" + this.signatureViews.length);
    };

    e.prototype.selectNext = function() {
      return this.signatureViews.length < 2 ? (this.cancel(), !1) : (this.currentSignature = (this.currentSignature +
        1) % this.signatureViews.length, this.select(this.currentSignature), !0);
    };

    e.prototype.selectPrevious = function() {
      return this.signatureViews.length < 2 ? (this.cancel(), !1) : (this.currentSignature--, this.currentSignature <
        0 && (this.currentSignature = this.signatureViews.length - 1), this.select(this.currentSignature), !0);
    };

    e.prototype.cancel = function() {
      this.model.cancel();
    };

    e.prototype.getDomNode = function() {
      return this.$el.getHTMLElement();
    };

    e.prototype.getId = function() {
      return e.ID;
    };

    e.prototype.releaseModel = function() {
      for (var e; e = this.modelListenersToRemove.pop();) {
        e();
      }
      if (this.model) {
        this.model.dispose();
        this.model = null;
      }
    };

    e.prototype.destroy = function() {
      this.releaseModel();

      if (this.$overloads) {
        this.$overloads.destroy();
        delete this.$overloads;
      }

      if (this.$signatures) {
        this.$signatures.destroy();
        delete this.$signatures;
      }

      if (this.$wrapper) {
        this.$wrapper.destroy();
        delete this.$wrapper;
      }

      if (this.$el) {
        this.$el.destroy();
        delete this.$el;
      }

      if (this.bindings) {
        this.bindings.dispose();
        delete this.bindings;
      }
    };

    e.ID = "editor.widget.parameterHintsWidget";

    return e;
  }();
  t.ParameterHintsWidget = o;
});