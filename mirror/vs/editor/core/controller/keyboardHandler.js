var __extends = this.__extends || function(a, b) {
    function d() {
      this.constructor = a
    }
    for (var c in b) b.hasOwnProperty(c) && (a[c] = b[c]);
    d.prototype = b.prototype, a.prototype = new d
  };
define(["require", "exports", "vs/editor/core/range", "vs/editor/core/position", "vs/base/dom/keyboardEvent",
  "vs/base/dom/dom", "vs/base/env", "vs/editor/core/view/viewContext", "vs/editor/editor",
  "vs/editor/core/view/viewEventHandler", "vs/base/time/schedulers"
], function(a, b, c, d, e, f, g, h, i, j, k) {
  var l = c,
    m = d,
    n = e,
    o = f,
    p = g,
    q = h,
    r = i,
    s = j,
    t = k,
    u = {
      "Ctrl-C": !0,
      "Ctrl-X": !0,
      "Meta-C": !0,
      "Meta-X": !0
    }, v = 9700,
    w = " ".charCodeAt(0),
    x = "	".charCodeAt(0),
    y = "<".charCodeAt(0),
    z = ">".charCodeAt(0),
    A = "&".charCodeAt(0),
    B;
  (function(a) {
    a[a.Type = 0] = "Type", a[a.Paste = 1] = "Paste"
  })(B || (B = {}));
  var C = function(a) {
    function b(b, c, d) {
      var e = this;
      a.call(this), this.context = b, this.viewController = c, this.textArea = d.textArea, this.viewHelper = d, this.accessiblilityOutput =
        d.accessiblilityOutput, this.selection = new l.Range(1, 1, 1, 1), this.cursorPosition = new m.Position(1, 1),
        this.contentLeft = 0, this.asyncReadFromTextArea = new t.RunOnceScheduler(null, 0), this.asyncSelectTextAreaOnFocus =
        new t.RunOnceScheduler(function() {
          return e._selectTextAreaIfFocused()
        }, 0), this.asyncSetSelectionToTextArea = new t.RunOnceScheduler(function() {
          return e._writePlaceholderAndSelectTextArea()
        }, 0), this.asyncTriggerCut = new t.RunOnceScheduler(function() {
          return e._triggerCut()
        }, 0), this.lastCopiedValue = null, this.hasFocus = !1, this.justHadAPaste = !1, this.justHadACut = !1, this.lastKeyPressTime =
        0, this.lastCompositionEndTime = 0, this.lastValueWrittenToTheTextArea = "", this.kbController = new n.KeyboardController(
          this.textArea), this.listenersToRemove = [], this.listenersToRemove.push(this.kbController.addListener(
          "keydown", function(a) {
            return e._onKeyDown(a)
          })), this.listenersToRemove.push(this.kbController.addListener("keyup", function(a) {
          return e._onKeyUp(a)
        })), this.listenersToRemove.push(this.kbController.addListener("keypress", function(a) {
          return e._onKeyPress(a)
        }));
      var f = 0;
      this.listenersToRemove.push(o.addListener(this.textArea, "compositionstart", function(a) {
        f === 0 && e.showTextAreaAtCursor(), f++, e.asyncReadFromTextArea.cancel()
      })), this.listenersToRemove.push(o.addListener(this.textArea, "compositionend", function(a) {
        f--, f === 0 && e.hideTextArea(), e.lastCompositionEndTime = (new Date).getTime(), e._scheduleReadFromTextArea(
          B.Type)
      })), p.browser.isMacintosh && this.listenersToRemove.push(o.addListener(this.textArea, "input", function(a) {
        if (e.justHadAPaste) {
          e.justHadAPaste = !1;
          return
        }
        if (e.justHadACut) {
          e.justHadACut = !1;
          return
        }
        var b = (new Date).getTime(),
          c = b - e.lastKeyPressTime;
        if (c <= 500) return;
        var d = b - e.lastCompositionEndTime;
        if (d <= 500) return;
        if (f > 0) return;
        if (e.textArea.selectionStart !== e.textArea.selectionEnd) return;
        var g, h = e.textArea.value;
        if (p.browser.isChrome) {
          var i = e.lastValueWrittenToTheTextArea.substring(1);
          if (h.length <= i.length) return;
          if (h.substring(h.length - i.length) !== i) return;
          g = h.substring(0, h.length - i.length)
        } else g = h;
        console.log("DEDUCED input: <<<" + g + ">>>")
      })), this.listenersToRemove.push(o.addListener(this.textArea, "cut", function(a) {
        return e._onCut(a)
      })), this.listenersToRemove.push(o.addListener(this.textArea, "copy", function(a) {
        return e._onCopy(a)
      })), this.listenersToRemove.push(o.addListener(this.textArea, "paste", function(a) {
        return e._onPaste(a)
      })), this.listenersToRemove.push(o.addListener(this.textArea, "contextmenu", function(a) {
        e.textArea.select(), e.asyncSelectTextAreaOnFocus.cancel()
      })), this._writePlaceholderAndSelectTextArea(), this.context.addEventHandler(this)
    }
    return __extends(b, a), b.prototype.dispose = function() {
      this.context.removeEventHandler(this), this.listenersToRemove.forEach(function(a) {
        a()
      }), this.listenersToRemove = [], this.kbController.destroy(), this.asyncReadFromTextArea.dispose(), this.asyncSelectTextAreaOnFocus
        .dispose(), this.asyncSetSelectionToTextArea.dispose(), this.asyncTriggerCut.dispose()
    }, b.prototype.showTextAreaAtCursor = function() {
      var a = new l.Range(this.cursorPosition.lineNumber, this.cursorPosition.column, this.cursorPosition.lineNumber,
        this.cursorPosition.column),
        b = {
          range: a,
          revealVerticalInCenter: !1,
          revealHorizontal: !0
        };
      this.context.privateViewEventBus.emit(q.EventNames.RevealRangeEvent, b);
      var c = this.viewHelper.visibleRangeForPositionRelativeToEditor(this.cursorPosition.lineNumber, this.cursorPosition
        .column);
      c && (this.textArea.style.left = this.contentLeft + c.left + "px", this.textArea.style.top = c.top + "px"),
        this.textArea.style.height = this.context.configuration.editor.lineHeight + "px", o.addClass(this.viewHelper.viewDomNode,
          "ime-input")
    }, b.prototype.hideTextArea = function() {
      this.textArea.style.height = "", this.textArea.style.left = "0px", this.textArea.style.top = "0px", o.removeClass(
        this.viewHelper.viewDomNode, "ime-input")
    }, b.prototype.onViewFocusChanged = function(a) {
      return this.hasFocus = a, this.hasFocus && this.asyncSelectTextAreaOnFocus.schedule(), !1
    }, b.prototype.onCursorSelectionChanged = function(a) {
      return this.selection = a.selection, this.asyncSetSelectionToTextArea.schedule(), !1
    }, b.prototype.onCursorPositionChanged = function(a) {
      return this.cursorPosition = a.position, !1
    }, b.prototype.onLayoutChanged = function(a) {
      return this.contentLeft = a.contentLeft, !1
    }, b.prototype.setTextAreaValue = function(a, b) {
      this.lastValueWrittenToTheTextArea = a, this.textArea.value = a, b && this.hasFocus && !p.isTesting() && this.textArea
        .select()
    }, b.prototype._onKeyDown = function(a) {
      this.viewController.emitKeyDown(a)
    }, b.prototype._onKeyUp = function(a) {
      this.viewController.emitKeyUp(a)
    }, b.prototype._onKeyPress = function(a) {
      if (!this.hasFocus) return;
      if (p.browser.isOpera && p.browser.isWindows) {
        if (a.asString() === "Ctrl-X") {
          this._onCut(null);
          return
        }
        if (a.asString() === "Ctrl-V") {
          this._onPaste(null);
          return
        }
        if (a.asString() === "Ctrl-C") {
          this._onCopy(null);
          return
        }
      }
      this.lastKeyPressTime = (new Date).getTime(), this._scheduleReadFromTextArea(B.Type)
    }, b.prototype._selectTextAreaIfFocused = function() {
      this.hasFocus && this.textArea.select()
    }, b.prototype._scheduleReadFromTextArea = function(a) {
      var b = this;
      this.asyncSetSelectionToTextArea.cancel(), this.asyncSelectTextAreaOnFocus.cancel(), this.asyncReadFromTextArea
        .setRunner(function() {
          return b._readFromTextArea(a)
        }), this.asyncReadFromTextArea.schedule()
    }, b.prototype._readFromTextArea = function(a) {
      if (this.textArea.selectionStart === this.textArea.selectionEnd) {
        var b = this.textArea.value;
        b !== "" && (this.setTextAreaValue("", !1), a === B.Type ? this.executeType(b) : this.executePaste(b))
      }
    }, b.prototype.executePaste = function(a) {
      if (a === "") return;
      var b = a === this.lastCopiedValue;
      this.viewController.paste("keyboard", a, b)
    }, b.prototype.executeType = function(a) {
      if (a === "") return;
      this.viewController.type("keyboard", a)
    }, b.prototype._writePlaceholderAndSelectTextArea = function() {
      var a = String.fromCharCode(v);
      (this.textArea.value !== a || this.textArea.selectionStart === this.textArea.selectionEnd) && this.setTextAreaValue(
        a, !0);
      if (p.browser.isIE10) {
        var b = this._getAccessibilityOutput();
        this.accessiblilityOutput.textContent = b
      }
    }, b.prototype._getAccessibilityOutput = function() {
      var a = this.selection,
        b = "";
      if (a.isEmpty()) {
        var c = a.startLineNumber;
        a = new l.Range(c, 1, c, this.context.model.getLineMaxColumn(c)), b = "\n"
      }
      return this.context.model.getValueInRange(a, r.EndOfLinePreference.LF) + b
    }, b.prototype._onPaste = function(a) {
      a && a.clipboardData ? (a.preventDefault(), this.executePaste(a.clipboardData.getData("text/plain"))) : a &&
        window.clipboardData ? (a.preventDefault(), this.executePaste(window.clipboardData.getData("Text"))) : (this.textArea
          .selectionStart !== this.textArea.selectionEnd && this.setTextAreaValue("", !1), this._scheduleReadFromTextArea(
            B.Paste)), this.justHadAPaste = !0
    }, b.prototype._onCopy = function(a) {
      this._ensureClipboardGetsEditorSelection(a)
    }, b.prototype._triggerCut = function() {
      this.viewController.cut("keyboard")
    }, b.prototype._onCut = function(a) {
      this._ensureClipboardGetsEditorSelection(a), this.asyncTriggerCut.schedule(), this.justHadACut = !0
    }, b.prototype._ensureClipboardGetsEditorSelection = function(a) {
      var b = this._getPlainTextToCopy();
      a && a.clipboardData ? (a.clipboardData.setData("text/plain", b), a.preventDefault()) : a && window.clipboardData ?
        (window.clipboardData.setData("Text", b), a.preventDefault()) : this.setTextAreaValue(b, !0), p.browser.isFirefox ?
        this.lastCopiedValue = b.replace(/\r\n/g, "\n") : this.lastCopiedValue = b
    }, b.prototype._getPlainTextToCopy = function() {
      var a = p.browser.isWindows ? "\r\n" : "\n",
        b = p.browser.isWindows ? r.EndOfLinePreference.CRLF : r.EndOfLinePreference.LF,
        c = this.context.model.getSelections();
      if (c.length === 1) {
        var d = this.selection;
        if (d.isEmpty()) {
          var e = this.context.model.convertViewPositionToModelPosition(d.startLineNumber, 1).lineNumber;
          return this.context.model.getModelLineContent(e) + a
        }
        return this.context.model.getValueInRange(d, b)
      }
      c = c.slice(0).sort(l.RangeUtils.compareRangesUsingStarts);
      var f = [];
      for (var g = 0; g < c.length; g++) f.push(this.context.model.getValueInRange(c[g], b));
      return f.join(a)
    }, b
  }(s.ViewEventHandler);
  b.KeyboardHandler = C
})