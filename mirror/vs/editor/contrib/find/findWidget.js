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

define(["require", "exports", "vs/base/ui/widgets/findInput", "./findModel", "vs/base/dom/dom", "vs/base/errors",
  "vs/base/dom/keyboardEvent", "vs/base/env", "vs/nls", "vs/base/dom/builder", "vs/base/dom/mouseEvent",
  "vs/base/eventEmitter", "vs/editor/editor", "vs/css!./findWidget"
], function(a, b, c, d, e, f, g, h, i, j, k, l, m) {
  var n = c;

  var o = d;

  var p = e;

  var q = f;

  var r = g;

  var s = h;

  var t = i;

  var u = j;

  var v = k;

  var w = l;

  var x = m;

  var y = function(a) {
    function b(b) {
      a.call(this);

      this.codeEditor = b;

      this.domNode = null;

      this.findInput = null;

      this.replaceInputElement = null;

      this.toggleReplaceBtn = null;

      this.isVisible = !1;

      this.isReplaceVisible = !1;

      this.isReplaceEnabled = !1;

      this.listenersToRemove = [];

      this.model = null;

      this.modelListenersToRemove = [];

      this.buildDomNode();

      this.codeEditor.addOverlayWidget(this);
    }
    __extends(b, a);

    b.prototype.getId = function() {
      return b.ID;
    };

    b.prototype.getDomNode = function() {
      return this.domNode;
    };

    b.prototype.destroy = function() {
      this.removeModel();

      this.findInput.destroy();

      this.listenersToRemove.forEach(function(a) {
        a();
      });

      this.listenersToRemove = [];
    };

    b.prototype.setState = function(a) {
      this.findInput.setValue(a.searchString);

      this.findInput.setCaseSensitive(a.properties.matchCase);

      this.findInput.setWholeWords(a.properties.wholeWord);

      this.findInput.setRegex(a.properties.isRegex);

      this.replaceInputElement.value = a.replaceString;

      if (a.isReplaceEnabled) {
        this._enableReplace(!1);
      } else {
        this._disableReplace(!1);
      }

      this.onFindValueChange();
    };

    b.prototype.getState = function() {
      var a = {
        searchString: this.findInput.getValue(),
        replaceString: this.replaceInputElement.value,
        properties: {
          isRegex: this.findInput.getRegex(),
          wholeWord: this.findInput.getWholeWords(),
          matchCase: this.findInput.getCaseSensitive()
        },
        isReplaceEnabled: this.isReplaceEnabled,
        isVisible: this.isVisible
      };
      return a;
    };

    b.prototype.setModel = function(a) {
      var b = this;
      this.removeModel();

      if (a) {
        this.model = a;
        this.modelListenersToRemove.push(this.model.addListener("start", function(a) {
          b.reveal(a.shouldFocus);

          b.setState(a.state);

          if (a.shouldFocus) {
            b.findInput.select();
          }
        }));
        this.modelListenersToRemove.push(this.model.addListener("matches", function(a) {
          var c = a.position;

          var d = a.count;
          p.toggleClass(b.domNode, "no-results", b.findInput.getValue() !== "" && a.count === 0);
        }));
      } else {
        this.hide();
      }
    };

    b.prototype._enableReplace = function(a) {
      this.isReplaceEnabled = !0;

      if (!this.codeEditor.getConfiguration().readOnly && !this.isReplaceVisible) {
        this.replaceInputElement.disabled = !1;
        this.isReplaceVisible = !0;
        p.addClass(this.domNode, "replace");
        p.removeClass(this.toggleReplaceBtn, "collapse");
        p.addClass(this.toggleReplaceBtn, "expand");
      }

      if (a) {
        this.emit(b.USER_INPUT_EVENT);
      }
    };

    b.prototype._disableReplace = function(a) {
      this.isReplaceEnabled = !1;

      if (this.isReplaceVisible) {
        this.replaceInputElement.disabled = !0;
        p.removeClass(this.domNode, "replace");
        p.removeClass(this.toggleReplaceBtn, "expand");
        p.addClass(this.toggleReplaceBtn, "collapse");
        this.isReplaceVisible = !1;
      }

      if (a) {
        this.emit(b.USER_INPUT_EVENT);
      }
    };

    b.prototype.removeModel = function() {
      if (this.model !== null) {
        this.modelListenersToRemove.forEach(function(a) {
          a();
        });
        this.modelListenersToRemove = [];
        this.model = null;
      }
    };

    b.prototype.onFindInputKeyDown = function(a) {
      var c = this;

      var d = new r.KeyboardEvent(a);

      var e = !1;
      if (d.asString() === (s.browser.isMacintosh ? "Meta-H" : "Ctrl-H") || d.asString() === "DownArrow") {
        this._enableReplace(!0);
        this.replaceInputElement.select();
        this.replaceInputElement.focus();
        d.preventDefault();
        e = !0;
      }
      if (!e && d.asString() === "Enter") {
        this.codeEditor.getAction(o.NEXT_MATCH_FIND_ID).run().done(null, q.onUnexpectedError);
        d.preventDefault();
        e = !0;
      }

      if (!e && d.asString() === "Shift-Enter") {
        this.codeEditor.getAction(o.PREVIOUS_MATCH_FIND_ID).run().done(null, q.onUnexpectedError);
        d.preventDefault();
        e = !0;
      }

      if (!e) {
        setTimeout(function() {
          c.onFindValueChange();

          c.emit(b.USER_INPUT_EVENT);
        }, 10);
      }
    };

    b.prototype.onReplaceInputKeyDown = function(a) {
      var c = this;

      var d = new r.KeyboardEvent(a);

      var e = !1;
      if (d.asString() === (s.browser.isMacintosh ? "Meta-H" : "Ctrl-H") || d.asString() === "UpArrow") {
        this.findInput.select();
        this.findInput.focus();
        d.preventDefault();
        e = !0;
      }
      if (!e && d.asString() === "Enter") {
        this.codeEditor.getAction(o.REPLACE_ID).run().done(null, q.onUnexpectedError);
        d.preventDefault();
        e = !0;
      }

      if (!e && d.asString() === (s.browser.isMacintosh ? "Meta-Enter" : "Ctrl-Enter")) {
        this.codeEditor.getAction(o.REPLACE_ALL_ID).run().done(null, q.onUnexpectedError);
        d.preventDefault();
        e = !0;
      }

      if (!e) {
        setTimeout(function() {
          c.emit(b.USER_INPUT_EVENT);
        }, 10);
      }
    };

    b.prototype.onFindValueChange = function() {
      if (this.findInput.getValue().length === 0) {
        this.$prevBtn.addClass("disabled");
        this.$nextBtn.addClass("disabled");
        this.$replaceBtn.addClass("disabled");
        this.$replaceAllBtn.addClass("disabled");
      } else {
        this.$prevBtn.removeClass("disabled");
        this.$nextBtn.removeClass("disabled");
        this.$replaceBtn.removeClass("disabled");
        this.$replaceAllBtn.removeClass("disabled");
      }
    };

    b.prototype.buildDomNode = function() {
      var a = this;
      this.findInput = (new n.FindInput(null, {
        width: b.FIND_INPUT_AREA_WIDTH,
        label: t.localize("label.find", "Find"),
        placeholder: t.localize("placeholder.find", "Find"),
        validation: function(a) {
          if (a.length === 0) {
            return "";
          }
          if (!this.findInput.getRegex()) {
            return "";
          }
          try {
            new RegExp(a);

            return "";
          } catch (b) {
            return b.message;
          }
        }.bind(this)
      })).on("keydown", function(b) {
        a.onFindInputKeyDown(b);
      }).on(n.FindInput.OPTION_CHANGE, function() {
        a.emit(b.USER_INPUT_EVENT);
      });
      var c = document.createElement("div");
      c.title = t.localize("label.previousMatchButton", "Previous Match (Shift-F3)");

      this.$prevBtn = u.Build.withElement(c).addClass("button previous").on("click", function(b) {
        var c = new v.MouseEvent(b);
        a.codeEditor.getAction(o.PREVIOUS_MATCH_FIND_ID).run().done(null, q.onUnexpectedError);

        a.findInput.focus();

        c.preventDefault();
      }, this.listenersToRemove);
      var d = document.createElement("div");
      d.title = t.localize("label.nextMatchButton", "Next Match (F3)");

      this.$nextBtn = u.Build.withElement(d).addClass("button next").on("click", function(b) {
        var c = new v.MouseEvent(b);
        a.codeEditor.getAction(o.NEXT_MATCH_FIND_ID).run().done(null, q.onUnexpectedError);

        a.findInput.focus();

        c.preventDefault();
      }, this.listenersToRemove);
      var e = document.createElement("div");
      e.title = t.localize("label.closeButton", "Close (Escape)");

      u.Build.withElement(e).addClass("button close").on("click", function(c) {
        a.hide();

        a.emit(b.USER_CLOSED_EVENT);
        var d = new v.MouseEvent(c);
        d.preventDefault();
      }, this.listenersToRemove);
      var f = document.createElement("div");
      u.Build.withElement(f).addClass("find-part");

      f.appendChild(this.findInput.domNode);

      f.appendChild(c);

      f.appendChild(d);

      f.appendChild(e);

      this.replaceInputElement = document.createElement("input");

      u.Build.withElement(this.replaceInputElement).addClass("replace-input").attr({
        placeholder: t.localize("placeholder.replace", "Replace"),
        "aria-label": t.localize("label.replace", "Replace"),
        disabled: "true"
      }).style({
        width: b.REPLACE_INPUT_AREA_WIDTH + "px"
      }).on("keydown", function(b) {
        a.onReplaceInputKeyDown(b);
      });
      var g = document.createElement("div");
      this.$replaceAllBtn = u.Build.withElement(g).text(t.localize("replaceAll", "Replace all")).addClass(
        "button wide").on("click", function(b) {
        var c = new v.MouseEvent(b);
        a.codeEditor.getAction(o.REPLACE_ALL_ID).run().done(null, q.onUnexpectedError);

        c.preventDefault();
      }, this.listenersToRemove);
      var h = document.createElement("div");
      this.$replaceBtn = u.Build.withElement(h).text(t.localize("replace", "Replace")).addClass("button wide").on(
        "click", function(b) {
          var c = new v.MouseEvent(b);
          a.codeEditor.getAction(o.REPLACE_ID).run().done(null, q.onUnexpectedError);

          c.preventDefault();
        }, this.listenersToRemove);
      var i = document.createElement("div");
      u.Build.withElement(i).addClass("replace-part");

      i.appendChild(this.replaceInputElement);

      i.appendChild(h);

      i.appendChild(g);

      this.toggleReplaceBtn = document.createElement("div");
      var j = u.Build.withElement(this.toggleReplaceBtn);
      j.addClass("button toggle left").on("click", function(b) {
        var c = new v.MouseEvent(b);
        if (a.isReplaceVisible) {
          a._disableReplace(!0);
        } else {
          a._enableReplace(!0);
        }

        c.preventDefault();
      }, this.listenersToRemove);

      j.addClass(this.isReplaceVisible ? "expand" : "collapse");

      this.domNode = document.createElement("div");
      var k = u.Build.withElement(this.domNode);
      k.addClass("editor-widget find-widget").addClass("monaco-editor-background");

      if (!this.codeEditor.getConfiguration().readOnly) {
        k.addClass("can-replace");
      }

      this.domNode.appendChild(this.toggleReplaceBtn);

      this.domNode.appendChild(f);

      this.domNode.appendChild(i);
    };

    b.prototype.reveal = function(a) {
      var b = this;
      if (!this.isVisible) {
        this.findInput.enable();
        this.isVisible = !0;
        window.setTimeout(function() {
          p.addClass(b.domNode, "visible");

          if (!a) {
            p.addClass(b.domNode, "noanimation");
            window.setTimeout(function() {
              p.removeClass(b.domNode, "noanimation");
            }, 200);
          }
        }, 0);
        this.codeEditor.layoutOverlayWidget(this);
      }
    };

    b.prototype.hide = function() {
      if (this.isVisible) {
        this.findInput.disable();
        p.removeClass(this.domNode, "visible");
        this.isVisible = !1;
        this.codeEditor.focus();
        this.codeEditor.layoutOverlayWidget(this);
      }
    };

    b.prototype.getPosition = function() {
      return this.isVisible ? {
        preference: x.OverlayWidgetPositionPreference.TOP_RIGHT_CORNER
      } : null;
    };

    b.ID = "editor.contrib.findWidget";

    b.USER_CLOSED_EVENT = "close";

    b.USER_INPUT_EVENT = "userInputEvent";

    b.WIDGET_WIDTH = 317;

    b.PART_WIDTH = 300;

    b.FIND_INPUT_AREA_WIDTH = b.PART_WIDTH - 54;

    b.REPLACE_INPUT_AREA_WIDTH = b.PART_WIDTH - 112;

    return b;
  }(w.EventEmitter);
  b.FindWidget = y;
});