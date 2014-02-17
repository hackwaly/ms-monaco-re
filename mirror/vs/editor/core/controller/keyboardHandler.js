define("vs/editor/core/controller/keyboardHandler", ["require", "exports", "vs/editor/core/range",
  "vs/editor/core/position", "vs/base/dom/keyboardController", "vs/base/dom/dom", "vs/base/env",
  "vs/editor/core/view/viewContext", "vs/editor/editor", "vs/editor/core/view/viewEventHandler",
  "vs/base/time/schedulers"
], function(e, t, n, i, o, r, s, a, u, l, c) {
  var d;
  ! function(e) {
    e[e.Type = 0] = "Type";

    e[e.Paste = 1] = "Paste";
  }(d || (d = {}));
  var h = function() {
    function e(e, t, n, i) {
      this.value = e;

      this.selectionStart = t;

      this.selectionEnd = n;

      this.selectionToken = i;
    }
    e.fromTextArea = function(t, n) {
      return new e(t.value, t.selectionStart, t.selectionEnd, n);
    };

    e.fromEditorSelectionAndPreviousState = function(t, i, o) {
      if (s.browser.isIPad) return new e("", 0, 0, u);
      var r = 100;

      var a = 0;

      var u = i.startLineNumber;

      var l = i.startColumn;

      var c = i.endLineNumber;

      var d = i.endColumn;

      var h = t.getLineMaxColumn(c);
      i.isEmpty() && o !== u && (l = 1, d = h);
      var p = "";

      var f = Math.max(1, u - a);
      u > f && (p = t.getValueInRange(new n.Range(f, 1, u, 1), 1));

      p += t.getValueInRange(new n.Range(u, 1, u, l), 1);

      p.length > r && (p = p.substring(p.length - r, p.length));
      var g = "";

      var m = Math.min(c + a, t.getLineCount());
      g += t.getValueInRange(new n.Range(c, d, c, h), 1);

      m > c && (g = "\n" + t.getValueInRange(new n.Range(c + 1, 1, m, t.getLineMaxColumn(m)), 1));

      g.length > r && (g = g.substring(0, r));
      var v = t.getValueInRange(new n.Range(u, l, c, d), 1);
      v.length > 2 * r && (v = v.substring(0, r) + String.fromCharCode(8230) + v.substring(v.length - r, v.length));

      return new e(p + v + g, p.length, p.length + v.length, u);
    };

    e.prototype.getSelectionStart = function() {
      return this.selectionStart;
    };

    e.prototype.resetSelection = function() {
      this.selectionStart = this.value.length;

      this.selectionEnd = this.value.length;
    };

    e.prototype.getValue = function() {
      return this.value;
    };

    e.prototype.getSelectionToken = function() {
      return this.selectionToken;
    };

    e.prototype.applyToTextArea = function(e, t) {
      if (e.value !== this.value && (e.value = this.value), t) try {
        e.focus();

        e.setSelectionRange(this.selectionStart, this.selectionEnd);
      } catch (n) {}
    };

    e.prototype.extractNewText = function(e) {
      if (this.selectionStart !== this.selectionEnd) return "";
      if (!e) return this.value;
      var t = e.value.substring(0, e.selectionStart);

      var n = e.value.substring(e.selectionEnd, e.value.length);
      s.browser.isIE11orEarlier && document.queryCommandValue("OverWrite") && (n = n.substr(1));
      var i = this.value;
      i.substring(0, t.length) === t && (i = i.substring(t.length));

      i.substring(i.length - n.length, i.length) === n && (i = i.substring(0, i.length - n.length));

      return i;
    };

    return e;
  }();

  var p = function(e) {
    function t(t, a, u) {
      var l = this;
      e.call(this);

      this.context = t;

      this.viewController = a;

      this.textArea = u.textArea;

      this.viewHelper = u;

      this.selection = new n.Range(1, 1, 1, 1);

      this.cursorPosition = new i.Position(1, 1);

      this.contentLeft = 0;

      this.contentWidth = 0;

      this.scrollLeft = 0;

      this.asyncReadFromTextArea = new c.RunOnceScheduler(null, 0);

      this.asyncSetSelectionToTextArea = new c.RunOnceScheduler(function() {
        return l._writePlaceholderAndSelectTextArea();
      }, 0);

      this.asyncTriggerCut = new c.RunOnceScheduler(function() {
        return l._triggerCut();
      }, 0);

      this.previousSetTextAreaState = null;

      this.hasFocus = !1;

      this.justHadAPaste = !1;

      this.justHadACut = !1;

      this.lastKeyPressTime = 0;

      this.lastCompositionEndTime = 0;

      this.lastValueWrittenToTheTextArea = "";

      this.kbController = new o.KeyboardController(this.textArea);

      this.listenersToRemove = [];

      this.listenersToRemove.push(this.kbController.addListener("keydown", function(e) {
        return l._onKeyDown(e);
      }));

      this.listenersToRemove.push(this.kbController.addListener("keyup", function(e) {
        return l._onKeyUp(e);
      }));

      this.listenersToRemove.push(this.kbController.addListener("keypress", function(e) {
        return l._onKeyPress(e);
      }));

      this.compositionCount = 0;

      this.listenersToRemove.push(r.addListener(this.textArea, "compositionstart", function() {
        0 === l.compositionCount && l.showTextAreaAtCursor();

        l.compositionCount++;

        l.asyncReadFromTextArea.cancel();
      }));

      this.listenersToRemove.push(r.addListener(this.textArea, "compositionend", function() {
        l.compositionCount--;

        0 === l.compositionCount && l.hideTextArea();

        l.lastCompositionEndTime = (new Date).getTime();

        l._scheduleReadFromTextArea(0);
      }));

      s.browser.isIPad && this.listenersToRemove.push(r.addListener(this.textArea, "input", function() {
        var e = (new Date).getTime();

        var t = e - l.lastKeyPressTime;
        500 >= t && (l._scheduleReadFromTextArea(0), l.lastKeyPressTime = 0);
      }));

      s.browser.isMacintosh && this.listenersToRemove.push(r.addListener(this.textArea, "input", function() {
        if (l.justHadAPaste) l.justHadAPaste = !1;

        return void 0;
        if (l.justHadACut) l.justHadACut = !1;

        return void 0;
        var e = (new Date).getTime();

        var t = e - l.lastKeyPressTime;
        if (!(500 >= t)) {
          var n = e - l.lastCompositionEndTime;
          if (!(500 >= n || l.compositionCount > 0 || l.textArea.selectionStart !== l.textArea.selectionEnd)) {
            var i;

            var o = l.textArea.value;
            if (s.browser.isChrome) {
              var r = l.lastValueWrittenToTheTextArea.substring(1);
              if (o.length <= r.length) return;
              if (o.substring(o.length - r.length) !== r) return;
              i = o.substring(0, o.length - r.length);
            } else i = o;
            console.log("DEDUCED input: <<<" + i + ">>>");
          }
        }
      }));

      this.listenersToRemove.push(r.addListener(this.textArea, "cut", function(e) {
        return l._onCut(e);
      }));

      this.listenersToRemove.push(r.addListener(this.textArea, "copy", function(e) {
        return l._onCopy(e);
      }));

      this.listenersToRemove.push(r.addListener(this.textArea, "paste", function(e) {
        return l._onPaste(e);
      }));

      this.listenersToRemove.push(r.addListener(this.textArea, "contextmenu", function() {
        r.selectTextInInputElement(l.textArea);

        l.asyncSetSelectionToTextArea.cancel();
      }));

      this._writePlaceholderAndSelectTextArea();

      this.context.addEventHandler(this);
    }
    __extends(t, e);

    t.prototype.dispose = function() {
      this.context.removeEventHandler(this);

      this.listenersToRemove.forEach(function(e) {
        e();
      });

      this.listenersToRemove = [];

      this.kbController.dispose();

      this.asyncReadFromTextArea.dispose();

      this.asyncSetSelectionToTextArea.dispose();

      this.asyncTriggerCut.dispose();
    };

    t.prototype.showTextAreaAtCursor = function() {
      var e;

      var t;

      var i;
      s.browser.isIE11orEarlier ? (e = this.selection.startLineNumber, t = this.selection.startColumn, i = this.previousSetTextAreaState
        .getSelectionStart() + 1) : (e = this.cursorPosition.lineNumber, t = this.cursorPosition.column, i = t);
      var o = {
        range: new n.Range(e, t, e, t),
        revealVerticalInCenter: !1,
        revealHorizontal: !0
      };
      this.context.privateViewEventBus.emit(a.EventNames.RevealRangeEvent, o);
      var u = this.viewHelper.visibleRangeForPositionRelativeToEditor(e, t);

      var l = this.viewHelper.visibleRangeForPositionRelativeToEditor(e, i);
      s.browser.isIE11orEarlier ? u && l && (this.textArea.style.top = u.top + "px", this.textArea.style.left = this.contentLeft +
        u.left - l.left - this.scrollLeft + "px", this.textArea.style.width = this.contentWidth + "px") : (u && (this
        .textArea.style.left = this.contentLeft + u.left - this.scrollLeft + "px", this.textArea.style.top = u.top +
        "px"), this.setTextAreaState(new h("", 0, 0, 0), !1));

      this.textArea.style.height = this.context.configuration.editor.lineHeight + "px";

      r.addClass(this.viewHelper.viewDomNode, "ime-input");
    };

    t.prototype.hideTextArea = function() {
      this.textArea.style.height = "";

      this.textArea.style.width = "";

      this.textArea.style.left = "0px";

      this.textArea.style.top = "0px";

      r.removeClass(this.viewHelper.viewDomNode, "ime-input");
    };

    t.prototype.onScrollChanged = function(e) {
      this.scrollLeft = e.scrollLeft;

      return !1;
    };

    t.prototype.onViewFocusChanged = function(e) {
      this.hasFocus = e;

      this.hasFocus && this.asyncSetSelectionToTextArea.schedule();

      return !1;
    };

    t.prototype.onCursorSelectionChanged = function(e) {
      this.selection = e.selection;

      this.asyncSetSelectionToTextArea.schedule();

      return !1;
    };

    t.prototype.onCursorPositionChanged = function(e) {
      this.cursorPosition = e.position;

      return !1;
    };

    t.prototype.onLayoutChanged = function(e) {
      this.contentLeft = e.contentLeft;

      this.contentWidth = e.contentWidth;

      return !1;
    };

    t.prototype.setTextAreaState = function(e, t) {
      var n = t && this.hasFocus && !s.isTesting();
      n || e.resetSelection();

      this.lastValueWrittenToTheTextArea = e.getValue();

      e.applyToTextArea(this.textArea, n);

      this.previousSetTextAreaState = e;
    };

    t.prototype._onKeyDown = function(e) {
      this.viewController.emitKeyDown(e);
    };

    t.prototype._onKeyUp = function(e) {
      this.viewController.emitKeyUp(e);
    };

    t.prototype._onKeyPress = function(e) {
      if (this.hasFocus) {
        if (s.browser.isOpera && s.browser.isWindows) {
          if ("Ctrl-X" === e.asString()) this._onCut(null);

          return void 0;
          if ("Ctrl-V" === e.asString()) this._onPaste(null);

          return void 0;
          if ("Ctrl-C" === e.asString()) this._onCopy(null);

          return void 0;
        }
        this.lastKeyPressTime = (new Date).getTime();

        s.browser.isIPad || this._scheduleReadFromTextArea(0);
      }
    };

    t.prototype._scheduleReadFromTextArea = function(e) {
      var t = this;
      this.asyncSetSelectionToTextArea.cancel();

      this.asyncReadFromTextArea.setRunner(function() {
        return t._readFromTextArea(e);
      });

      this.asyncReadFromTextArea.schedule();
    };

    t.prototype._readFromTextArea = function(e) {
      var t = this.previousSetTextAreaState ? this.previousSetTextAreaState.getSelectionToken() : 0;

      var n = h.fromTextArea(this.textArea, t);

      var i = n.extractNewText(this.previousSetTextAreaState);
      "" !== i && (0 === e ? this.executeType(i) : this.executePaste(i));

      this.previousSetTextAreaState = n;

      this.asyncSetSelectionToTextArea.schedule();
    };

    t.prototype.executePaste = function(e) {
      "" !== e && this.viewController.paste("keyboard", e, !1);
    };

    t.prototype.executeType = function(e) {
      "" !== e && this.viewController.type("keyboard", e);
    };

    t.prototype._writePlaceholderAndSelectTextArea = function() {
      if (this.compositionCount <= 0) {
        var e = this.previousSetTextAreaState ? this.previousSetTextAreaState.getSelectionToken() : 0;

        var t = h.fromEditorSelectionAndPreviousState(this.context.model, this.selection, e);
        this.setTextAreaState(t, !0);
      }
    };

    t.prototype._onPaste = function(e) {
      e && e.clipboardData ? (e.preventDefault(), this.executePaste(e.clipboardData.getData("text/plain"))) : e &&
        window.clipboardData ? (e.preventDefault(), this.executePaste(window.clipboardData.getData("Text"))) : (this.textArea
          .selectionStart !== this.textArea.selectionEnd && this.setTextAreaState(new h("", 0, 0, 0), !1), this._scheduleReadFromTextArea(
            1));

      this.justHadAPaste = !0;
    };

    t.prototype._onCopy = function(e) {
      this._ensureClipboardGetsEditorSelection(e);
    };

    t.prototype._triggerCut = function() {
      this.viewController.cut("keyboard");
    };

    t.prototype._onCut = function(e) {
      this._ensureClipboardGetsEditorSelection(e);

      this.asyncTriggerCut.schedule();

      this.justHadACut = !0;
    };

    t.prototype._ensureClipboardGetsEditorSelection = function(e) {
      var t = this._getPlainTextToCopy();
      e && e.clipboardData ? (e.clipboardData.setData("text/plain", t), e.preventDefault()) : e && window.clipboardData ?
        (window.clipboardData.setData("Text", t), e.preventDefault()) : this.setTextAreaState(new h(t, 0, t.length, 0), !
        0);
    };

    t.prototype._getPlainTextToCopy = function() {
      var e = s.browser.isWindows ? "\r\n" : "\n";

      var t = s.browser.isWindows ? 2 : 1;

      var i = this.context.model.getSelections();
      if (1 === i.length) {
        var o = this.selection;
        return o.isEmpty() ? "" : this.context.model.getValueInRange(o, t);
      }
      i = i.slice(0).sort(n.compareRangesUsingStarts);
      for (var r = [], a = 0; a < i.length; a++) r.push(this.context.model.getValueInRange(i[a], t));
      return r.join(e);
    };

    return t;
  }(l.ViewEventHandler);
  t.KeyboardHandler = p;
});