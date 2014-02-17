define("vs/editor/contrib/find/findWidget", ["require", "exports", "vs/nls!vs/editor/editor.main", "vs/base/errors",
  "vs/base/eventEmitter", "vs/base/dom/dom", "vs/base/dom/keyboardEvent", "vs/base/ui/widgets/inputBox",
  "vs/base/ui/widgets/findInput", "vs/editor/editor", "./findModel", "vs/base/lifecycle", "vs/css!./findWidget"
], function(e, t, n, i, o, r, s, a, u, l, c, d) {
  var h = function(e) {
    function t(n, i) {
      e.call(this, [t._USER_INPUT_EVENT, t._USER_CLOSED_EVENT, t._USER_CLICKED_EVENT]);

      this._codeEditor = n;

      this._contextViewProvider = i;

      this._isVisible = !1;

      this._isReplaceVisible = !1;

      this._isReplaceEnabled = !1;

      this._toDispose = [];

      this._focusGrid = new f;

      this._toDispose.push(this._focusGrid);

      this._model = null;

      this._modelListenersToDispose = [];

      this._buildDomNode();

      this._codeEditor.addOverlayWidget(this);
    }
    __extends(t, e);

    t.prototype.dispose = function() {
      this._removeModel();

      this._findInput.destroy();

      this._replaceInputBox.dispose();

      this._toDispose = d.disposeAll(this._toDispose);
    };

    t.prototype.getId = function() {
      return t.ID;
    };

    t.prototype.getDomNode = function() {
      return this._domNode;
    };

    t.prototype.getPosition = function() {
      return this._isVisible ? {
        preference: 0
      } : null;
    };

    t.prototype._setState = function(e, t) {
      this._findInput.setValue(e.searchString);

      this._findInput.setCaseSensitive(e.properties.matchCase);

      this._findInput.setWholeWords(e.properties.wholeWord);

      this._findInput.setRegex(e.properties.isRegex);

      this._cancelSelectionFindBtn.setEnabled(t);

      this._replaceInputBox.value = e.replaceString;

      e.isReplaceRevealed ? this._enableReplace(!1) : this._disableReplace(!1);

      this._onFindValueChange();
    };

    t.prototype.getState = function() {
      var e = {
        searchString: this._findInput.getValue(),
        replaceString: this._replaceInputBox.value,
        properties: {
          isRegex: this._findInput.getRegex(),
          wholeWord: this._findInput.getWholeWords(),
          matchCase: this._findInput.getCaseSensitive()
        },
        isReplaceRevealed: this._isReplaceEnabled,
        isVisible: this._isVisible
      };
      return e;
    };

    t.prototype.setModel = function(e) {
      var t = this;
      this._removeModel();

      e ? (this._model = e, this._modelListenersToDispose.push(this._model.addStartEventListener(function(e) {
        t._reveal(e.shouldFocus);

        t._setState(e.state, e.selectionFindEnabled);

        if (e.shouldFocus) {
          t._findInput.select();
        }
      })), this._modelListenersToDispose.push(this._model.addMatchesUpdatedEventListener(function(e) {
        r.toggleClass(t._domNode, "no-results", "" !== t._findInput.getValue() && 0 === e.count && !e.matchesOnlyOutsideSelection);

        r.toggleClass(t._domNode, "no-results-in-selection", "" !== t._findInput.getValue() && 0 === e.count &&
          e.matchesOnlyOutsideSelection);
      }))) : this._hide(!1);
    };

    t.prototype._removeModel = function() {
      if (null !== this._model) {
        this._modelListenersToDispose = d.disposeAll(this._modelListenersToDispose);
        this._model = null;
      }
    };

    t.prototype._enableReplace = function(e) {
      this._isReplaceEnabled = !0;

      if (!(this._codeEditor.getConfiguration().readOnly || this._isReplaceVisible)) {
        this._replaceInputBox.enable();
        this._isReplaceVisible = !0;
        r.addClass(this._domNode, "replaceToggled");
        this._toggleReplaceBtn.toggleClass("collapse", !1);
        this._toggleReplaceBtn.toggleClass("expand", !0);
        this._toggleReplaceBtn.setExpanded(!0);
      }

      if (e) {
        this._emitUserInputEvent(!1);
      }
    };

    t.prototype._disableReplace = function(e) {
      this._isReplaceEnabled = !1;

      if (this._isReplaceVisible) {
        this._replaceInputBox.disable();
        r.removeClass(this._domNode, "replaceToggled");
        this._toggleReplaceBtn.toggleClass("expand", !1);
        this._toggleReplaceBtn.toggleClass("collapse", !0);
        this._toggleReplaceBtn.setExpanded(!1);
        this._isReplaceVisible = !1;
      }

      if (e) {
        this._emitUserInputEvent(!1);
      }
    };

    t.prototype._onFindInputKeyDown = function(e) {
      var t = this;

      var n = e.asString();

      var o = !1;
      switch (n) {
        case "Enter":
          this._codeEditor.getAction(c.NEXT_MATCH_FIND_ID).run().done(null, i.onUnexpectedError);

          o = !0;
          break;
        case "Shift-Enter":
          this._codeEditor.getAction(c.PREVIOUS_MATCH_FIND_ID).run().done(null, i.onUnexpectedError);

          o = !0;
          break;
        case "RightArrow":
          if (this._findInput.cursorIsAtEnd()) {
            o = this._focusGrid.onKeyDown(this._findInput, e);
          }
          break;
        case "LeftArrow":
          if (this._findInput.cursorIsAtBeginning()) {
            o = this._focusGrid.onKeyDown(this._findInput, e);
          }
          break;
        default:
          o = this._focusGrid.onKeyDown(this._findInput, e);
      }
      o ? e.preventDefault() : setTimeout(function() {
        t._onFindValueChange();

        t._emitUserInputEvent(!0);
      }, 10);
    };

    t.prototype._onReplaceInputKeyDown = function(e) {
      var t = this;

      var n = e.asString();

      var o = !1;
      switch (n) {
        case "Enter":
          this._codeEditor.getAction(c.REPLACE_ID).run().done(null, i.onUnexpectedError);

          o = !0;
          break;
        case "Meta-Enter":
        case "Ctrl-Enter":
          this._codeEditor.getAction(c.REPLACE_ALL_ID).run().done(null, i.onUnexpectedError);

          o = !0;
          break;
        case "RightArrow":
          if (this._replaceInputBox.cursorIsAtEnd()) {
            o = this._focusGrid.onKeyDown(this._replaceInputBox, e);
          }
          break;
        case "LeftArrow":
          if (this._replaceInputBox.cursorIsAtBeginning()) {
            o = this._focusGrid.onKeyDown(this._replaceInputBox, e);
          }
          break;
        default:
          o = this._focusGrid.onKeyDown(this._replaceInputBox, e);
      }
      o ? e.preventDefault() : setTimeout(function() {
        t._emitUserInputEvent(!0);
      }, 10);
    };

    t.prototype._onFindValueChange = function() {
      var e = this._findInput.getValue().length > 0;
      this._prevBtn.setEnabled(e);

      this._nextBtn.setEnabled(e);

      this._replaceBtn.setEnabled(e);

      this._replaceAllBtn.setEnabled(e);
    };

    t.prototype._buildFindPart = function() {
      var e = this;
      this._findInput = (new u.FindInput(null, this._contextViewProvider, {
        width: t.FIND_INPUT_AREA_WIDTH,
        label: n.localize("vs_editor_contrib_find_findWidget", 0),
        placeholder: n.localize("vs_editor_contrib_find_findWidget", 1),
        validation: function(t) {
          if (0 === t.length) {
            return null;
          }
          if (!e._findInput.getRegex()) {
            return null;
          }
          try {
            new RegExp(t);

            return null;
          } catch (n) {
            return {
              content: n.message
            };
          }
        }
      })).on("keydown", function(t) {
        e._onFindInputKeyDown(new s.KeyboardEvent(t));
      }).on("click", function() {
        e._emitClickEvent();
      }).on(u.FindInput.OPTION_CHANGE, function() {
        e._emitUserInputEvent(!0);
      });

      this._prevBtn = (new p(n.localize("vs_editor_contrib_find_findWidget", 2), "previous")).onTrigger(function() {
        e._codeEditor.getAction(c.PREVIOUS_MATCH_FIND_ID).run().done(null, i.onUnexpectedError);
      });

      this._toDispose.push(this._prevBtn);

      this._nextBtn = (new p(n.localize("vs_editor_contrib_find_findWidget", 3), "next")).onTrigger(function() {
        e._codeEditor.getAction(c.NEXT_MATCH_FIND_ID).run().done(null, i.onUnexpectedError);
      });

      this._toDispose.push(this._nextBtn);

      this._cancelSelectionFindBtn = (new p(n.localize("vs_editor_contrib_find_findWidget", 4), "cancelSelectionFind"))
        .onTrigger(function() {
          e._codeEditor.getAction(c.CANCEL_SELECTION_FIND_ID).run().done(null, i.onUnexpectedError);

          e._cancelSelectionFindBtn.setEnabled(!1);
        });

      this._toDispose.push(this._cancelSelectionFindBtn);

      this._closeBtn = (new p(n.localize("vs_editor_contrib_find_findWidget", 5), "close")).onTrigger(function() {
        e._hide(!0);

        e._emitClosedEvent();
      });

      this._toDispose.push(this._closeBtn);
      var o = document.createElement("div");
      o.className = "find-part";

      o.appendChild(this._findInput.domNode);

      o.appendChild(this._prevBtn.domNode);

      o.appendChild(this._nextBtn.domNode);

      o.appendChild(this._cancelSelectionFindBtn.domNode);

      o.appendChild(this._closeBtn.domNode);

      return o;
    };

    t.prototype._buildReplacePart = function() {
      var e = this;

      var o = document.createElement("div");
      o.className = "replace-input";

      o.style.width = t.REPLACE_INPUT_AREA_WIDTH + "px";

      this._replaceInputBox = new a.InputBox(o, null, {
        ariaLabel: n.localize("vs_editor_contrib_find_findWidget", 6),
        placeholder: n.localize("vs_editor_contrib_find_findWidget", 7)
      });

      this._toDispose.push(r.addStandardDisposableListener(this._replaceInputBox.inputElement, "keydown", function(t) {
        return e._onReplaceInputKeyDown(t);
      }));

      this._toDispose.push(r.addStandardDisposableListener(this._replaceInputBox.inputElement, "click", function() {
        return e._emitClickEvent();
      }));

      this._replaceInputBox.disable();

      this._replaceBtn = (new p(n.localize("vs_editor_contrib_find_findWidget", 8), "replace")).onTrigger(function() {
        e._codeEditor.getAction(c.REPLACE_ID).run().done(null, i.onUnexpectedError);
      });

      this._toDispose.push(this._replaceBtn);

      this._replaceAllBtn = (new p(n.localize("vs_editor_contrib_find_findWidget", 9), "replace-all")).onTrigger(
        function() {
          e._codeEditor.getAction(c.REPLACE_ALL_ID).run().done(null, i.onUnexpectedError);
        });

      this._toDispose.push(this._replaceAllBtn);
      var s = document.createElement("div");
      s.className = "replace-part";

      s.appendChild(o);

      s.appendChild(this._replaceBtn.domNode);

      s.appendChild(this._replaceAllBtn.domNode);

      return s;
    };

    t.prototype._buildDomNode = function() {
      var e = this;

      var t = this._buildFindPart();

      var i = this._buildReplacePart();
      this._toggleReplaceBtn = (new p(n.localize("vs_editor_contrib_find_findWidget", 10), "toggle left")).onTrigger(
        function() {
          e._isReplaceVisible ? e._disableReplace(!0) : e._enableReplace(!0);
        });

      this._toggleReplaceBtn.toggleClass("expand", this._isReplaceVisible);

      this._toggleReplaceBtn.toggleClass("collapse", !this._isReplaceVisible);

      this._toggleReplaceBtn.setExpanded(this._isReplaceVisible);

      this._toDispose.push(this._toggleReplaceBtn);

      this._domNode = document.createElement("div");

      this._domNode.className = "editor-widget find-widget";

      this._domNode.setAttribute("aria-hidden", "false");

      if (!this._codeEditor.getConfiguration().readOnly) {
        r.addClass(this._domNode, "can-replace");
      }

      this._focusGrid.setFocusGridElements([
        [this._toggleReplaceBtn, this._findInput, this._prevBtn, this._nextBtn, this._cancelSelectionFindBtn, this._closeBtn],
        [this._toggleReplaceBtn, this._replaceInputBox, this._replaceBtn, this._replaceAllBtn]
      ]);

      this._focusGrid.setOnBeforeFocusInterceptor(function(t, n) {
        if (1 === n) {
          e._enableReplace(!0);
        }
      });

      this._toggleReplaceBtn.onKeyDown(function(t) {
        return e._focusGrid.onKeyDown(e._toggleReplaceBtn, t);
      });

      this._prevBtn.onKeyDown(function(t) {
        return e._focusGrid.onKeyDown(e._prevBtn, t);
      });

      this._nextBtn.onKeyDown(function(t) {
        return e._focusGrid.onKeyDown(e._nextBtn, t);
      });

      this._cancelSelectionFindBtn.onKeyDown(function(t) {
        return e._focusGrid.onKeyDown(e._cancelSelectionFindBtn, t);
      });

      this._closeBtn.onKeyDown(function(t) {
        return e._focusGrid.onKeyDown(e._closeBtn, t);
      });

      this._replaceBtn.onKeyDown(function(t) {
        return e._focusGrid.onKeyDown(e._replaceBtn, t);
      });

      this._replaceAllBtn.onKeyDown(function(t) {
        return e._focusGrid.onKeyDown(e._replaceAllBtn, t);
      });

      this._domNode.appendChild(this._toggleReplaceBtn.domNode);

      this._domNode.appendChild(t);

      this._domNode.appendChild(i);
    };

    t.prototype._reveal = function(e) {
      var t = this;
      if (!this._isVisible) {
        this._findInput.enable();
        if (this._isReplaceVisible) {
          this._replaceInputBox.enable();
        }
        this._isVisible = !0;
        window.setTimeout(function() {
          r.addClass(t._domNode, "visible");

          if (!e) {
            r.addClass(t._domNode, "noanimation");
            window.setTimeout(function() {
              r.removeClass(t._domNode, "noanimation");
            }, 200);
          }
        }, 0);
        this._codeEditor.layoutOverlayWidget(this);
      }
    };

    t.prototype._hide = function(e) {
      if (this._isVisible) {
        this._findInput.disable();
        this._replaceInputBox.disable();
        r.removeClass(this._domNode, "visible");
        this._isVisible = !1;
        if (e) {
          this._codeEditor.focus();
        }
        this._codeEditor.layoutOverlayWidget(this);
      }
    };

    t.prototype.addUserInputEventListener = function(e) {
      return this.addListener2(t._USER_INPUT_EVENT, e);
    };

    t.prototype._emitUserInputEvent = function(e) {
      var n = {
        jumpToNextMatch: e
      };
      this.emit(t._USER_INPUT_EVENT, n);
    };

    t.prototype.addClosedEventListener = function(e) {
      return this.addListener2(t._USER_CLOSED_EVENT, e);
    };

    t.prototype._emitClosedEvent = function() {
      this.emit(t._USER_CLOSED_EVENT);
    };

    t.prototype.addClickEventListener = function(e) {
      return this.addListener2(t._USER_CLICKED_EVENT, e);
    };

    t.prototype._emitClickEvent = function() {
      this.emit(t._USER_CLICKED_EVENT);
    };

    t._USER_CLOSED_EVENT = "close";

    t._USER_INPUT_EVENT = "userInputEvent";

    t._USER_CLICKED_EVENT = "userClickedEvent";

    t.ID = "editor.contrib.findWidget";

    t.PART_WIDTH = 275;

    t.FIND_INPUT_AREA_WIDTH = t.PART_WIDTH - 54;

    t.REPLACE_INPUT_AREA_WIDTH = t.FIND_INPUT_AREA_WIDTH;

    return t;
  }(o.EventEmitter);
  t.FindWidget = h;
  var p = function() {
    function e(e, t) {
      var n = this;
      this._onTrigger = null;

      this._onKeyDown = null;

      this._domNode = document.createElement("div");

      this._domNode.title = e;

      this._domNode.tabIndex = 0;

      this._domNode.className = "button " + t;

      this._domNode.setAttribute("role", "button");

      this._domNode.setAttribute("aria-label", e);

      this._toDispose = [];

      this._toDispose.push(r.addStandardDisposableListener(this._domNode, "click", function(e) {
        n._invokeOnTrigger();

        e.preventDefault();
      }));

      this._toDispose.push(r.addStandardDisposableListener(this._domNode, "keydown", function(e) {
        var t = e.asString();
        return "Space" === t || "Enter" === t ? (n._invokeOnTrigger(), e.preventDefault(), void 0) : (n._invokeOnKeyDown(
          e), void 0);
      }));
    }
    e.prototype.dispose = function() {
      this._toDispose = d.disposeAll(this._toDispose);
    };

    Object.defineProperty(e.prototype, "domNode", {
      get: function() {
        return this._domNode;
      },
      enumerable: !0,
      configurable: !0
    });

    e.prototype.focus = function() {
      this._domNode.focus();
    };

    e.prototype.setEnabled = function(e) {
      r.toggleClass(this._domNode, "disabled", !e);

      this._domNode.setAttribute("aria-disabled", String(!e));
    };

    e.prototype.setExpanded = function(e) {
      this._domNode.setAttribute("aria-expanded", String(e));
    };

    e.prototype.toggleClass = function(e, t) {
      r.toggleClass(this._domNode, e, t);
    };

    e.prototype.onTrigger = function(e) {
      this._onTrigger = e;

      return this;
    };

    e.prototype.onKeyDown = function(e) {
      this._onKeyDown = e;

      return this;
    };

    e.prototype._invokeOnTrigger = function() {
      if (this._onTrigger) {
        this._onTrigger();
      }
    };

    e.prototype._invokeOnKeyDown = function(e) {
      if (this._onKeyDown) {
        this._onKeyDown(e);
      }
    };

    return e;
  }();

  var f = function() {
    function e() {
      this._grid = null;

      this._focusInterceptor = null;
    }
    e.prototype.dispose = function() {
      this._grid = null;

      this._focusInterceptor = null;
    };

    e.prototype.setOnBeforeFocusInterceptor = function(e) {
      this._focusInterceptor = e;
    };

    e.prototype.setFocusGridElements = function(e) {
      this._grid = e;
    };

    e.prototype._findFocusGridElement = function(e) {
      var t;

      var n;

      var i;

      var o;

      var r;
      for (t = 0, n = this._grid.length; n > t; t++)
        for (i = this._grid[t], o = 0, r = i.length; r > o; o++)
          if (i[o] === e) {
            return {
              rowIndex: t,
              colIndex: o
            };
          }
      return null;
    };

    e.prototype._focusOn = function(e, t, n) {
      if (0 > e || e >= this._grid.length) {
        return !1;
      }
      var i = this._grid[e];
      n && (0 > t && (t = 0), t >= i.length && (t = i.length - 1));

      return 0 > t || t >= i.length ? !1 : (this._focusInterceptor && this._focusInterceptor(i[t], e, t), i[t].focus(), !
        0);
    };

    e.prototype._goRight = function(e, t) {
      return this._focusOn(e, t + 1, !1);
    };

    e.prototype._goLeft = function(e, t) {
      return this._focusOn(e, t - 1, !1);
    };

    e.prototype._goUp = function(e, t) {
      return this._focusOn(e - 1, t, !0);
    };

    e.prototype._goDown = function(e, t) {
      return this._focusOn(e + 1, t, !0);
    };

    e.prototype._handleKeyDown = function(e, t, n) {
      switch (n) {
        case "LeftArrow":
          return this._goLeft(e, t);
        case "RightArrow":
          return this._goRight(e, t);
        case "UpArrow":
          return this._goUp(e, t);
        case "DownArrow":
          return this._goDown(e, t);
      }
      return !1;
    };

    e.prototype.onKeyDown = function(e, t) {
      var n = this._findFocusGridElement(e);
      return n ? this._handleKeyDown(n.rowIndex, n.colIndex, t.asString()) ? (t.preventDefault(), !0) : !1 : !1;
    };

    return e;
  }();
});