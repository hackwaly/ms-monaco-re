define(["require", "exports", "vs/base/env", "vs/editor/core/constants"], function(a, b, c, d) {
  function h(a, b) {
    return e.browser.isMacintosh ? {
      shift: a,
      alt: !0,
      key: b
    } : {
      ctrlCmd: !0,
      shift: a,
      key: b
    }
  }
  var e = c,
    f = d,
    g = function() {
      function a() {
        this.editor = {
          lineHeight: 20,
          lineNumbers: !0,
          selectOnLineNumbers: !0,
          lineNumbersMinChars: 5,
          glyphMargin: !1,
          tabSize: 4,
          insertSpaces: !1,
          roundedSelection: !0,
          theme: "vs",
          pageSize: 1,
          readOnly: !1,
          scrollbar: {
            vertical: "auto",
            horizontal: "auto",
            useShadows: !0,
            verticalHasArrows: !1,
            horizontalHasArrows: !1
          },
          scrollBeyondLastLine: !0,
          automaticLayout: !1,
          wrappingColumn: 300,
          viewWordWrap: !1,
          wordWrapBreakBeforeCharacters: "{([+",
          wordWrapBreakAfterCharacters: " 	})]?|&,;",
          wordWrapBreakObtrusiveCharacters: ".",
          tabFocusMode: !1,
          stopLineTokenizationAfter: 1e3,
          stopRenderingLineAfter: 1e4,
          longLineBoundary: 300,
          isDominatedByLongLines: !1,
          hover: !0,
          quickSuggestions: !0,
          quickSuggestionsDelay: 500,
          iconsInSuggestions: !0,
          autoClosingBrackets: !0,
          formatOnType: !1,
          suggestOnTriggerCharacters: !0,
          gotoDefinitionWithMouse: !0
        }, this.keyBindings = {}
      }
      return a.prototype.addKeyBinding = function(a, b) {
        this.keyBindings[a] = this.keyBindings[a] || [], this.keyBindings[a].push(b)
      }, a
    }();
  b.ConfigClass = g, b.Config = new g, b.Config.addKeyBinding(f.Handler.CursorLeft, {
    key: "LeftArrow"
  }), b.Config.addKeyBinding(f.Handler.CursorLeftSelect, {
    shift: !0,
    key: "LeftArrow"
  }), b.Config.addKeyBinding(f.Handler.CursorRight, {
    key: "RightArrow"
  }), b.Config.addKeyBinding(f.Handler.CursorRightSelect, {
    shift: !0,
    key: "RightArrow"
  }), b.Config.addKeyBinding(f.Handler.CursorUp, {
    key: "UpArrow"
  }), b.Config.addKeyBinding(f.Handler.CursorUpSelect, {
    shift: !0,
    key: "UpArrow"
  }), b.Config.addKeyBinding(f.Handler.CursorDown, {
    key: "DownArrow"
  }), b.Config.addKeyBinding(f.Handler.CursorDownSelect, {
    shift: !0,
    key: "DownArrow"
  }), b.Config.addKeyBinding(f.Handler.CursorPageUp, {
    key: "PageUp"
  }), b.Config.addKeyBinding(f.Handler.CursorPageUpSelect, {
    shift: !0,
    key: "PageUp"
  }), b.Config.addKeyBinding(f.Handler.CursorPageDown, {
    key: "PageDown"
  }), b.Config.addKeyBinding(f.Handler.CursorPageDownSelect, {
    shift: !0,
    key: "PageDown"
  }), b.Config.addKeyBinding(f.Handler.CursorHome, {
    key: "Home"
  }), b.Config.addKeyBinding(f.Handler.CursorHomeSelect, {
    shift: !0,
    key: "Home"
  }), b.Config.addKeyBinding(f.Handler.CursorEnd, {
    key: "End"
  }), b.Config.addKeyBinding(f.Handler.CursorEndSelect, {
    shift: !0,
    key: "End"
  }), b.Config.addKeyBinding(f.Handler.Tab, {
    key: "Tab"
  }), b.Config.addKeyBinding(f.Handler.Outdent, {
    shift: !0,
    key: "Tab"
  }), b.Config.addKeyBinding(f.Handler.DeleteLeft, {
    key: "Backspace"
  }), b.Config.addKeyBinding(f.Handler.DeleteLeft, {
    shift: !0,
    key: "Backspace"
  }), b.Config.addKeyBinding(f.Handler.DeleteRight, {
    key: "Delete"
  }), b.Config.addKeyBinding(f.Handler.DeleteRight, {
    shift: !0,
    key: "Delete"
  }), b.Config.addKeyBinding(f.Handler.Indent, {
    ctrlCmd: !0,
    key: "]"
  }), b.Config.addKeyBinding(f.Handler.Outdent, {
    ctrlCmd: !0,
    key: "["
  }), b.Config.addKeyBinding(f.Handler.SelectAll, {
    ctrlCmd: !0,
    key: "A"
  }), b.Config.addKeyBinding(f.Handler.Escape, {
    key: "Escape"
  }), b.Config.addKeyBinding(f.Handler.LineInsertBefore, {
    ctrlCmd: !0,
    shift: !0,
    key: "Enter"
  }), b.Config.addKeyBinding(f.Handler.LineInsertAfter, {
    ctrlCmd: !0,
    key: "Enter"
  }), b.Config.addKeyBinding(f.Handler.AddCursorUp, {
    ctrlCmd: !0,
    alt: !0,
    key: "UpArrow"
  }), b.Config.addKeyBinding(f.Handler.AddCursorDown, {
    ctrlCmd: !0,
    alt: !0,
    key: "DownArrow"
  }), b.Config.addKeyBinding(f.Handler.CursorWordLeft, h(!1, "LeftArrow")), b.Config.addKeyBinding(f.Handler.CursorWordLeftSelect,
    h(!0, "LeftArrow")), b.Config.addKeyBinding(f.Handler.CursorWordRight, h(!1, "RightArrow")), b.Config.addKeyBinding(
    f.Handler.CursorWordRightSelect, h(!0, "RightArrow")), b.Config.addKeyBinding(f.Handler.CursorDownSelect, h(!0,
    "DownArrow")), b.Config.addKeyBinding(f.Handler.CursorUpSelect, h(!0, "UpArrow")), b.Config.addKeyBinding(f.Handler
    .DeleteWordLeft, h(!1, "Backspace")), b.Config.addKeyBinding(f.Handler.DeleteWordRight, h(!1, "Delete")), e.browser
    .isMacintosh ? (b.Config.addKeyBinding(f.Handler.CursorTop, {
      ctrlCmd: !0,
      key: "UpArrow"
    }), b.Config.addKeyBinding(f.Handler.CursorTopSelect, {
      ctrlCmd: !0,
      shift: !0,
      key: "UpArrow"
    }), b.Config.addKeyBinding(f.Handler.CursorBottom, {
      ctrlCmd: !0,
      key: "DownArrow"
    }), b.Config.addKeyBinding(f.Handler.CursorBottomSelect, {
      ctrlCmd: !0,
      shift: !0,
      key: "DownArrow"
    }), e.browser.isOpera ? (b.Config.addKeyBinding(f.Handler.Undo, {
      winCtrl: !0,
      key: "Z"
    }), b.Config.addKeyBinding(f.Handler.Redo, {
      winCtrl: !0,
      key: "Y"
    })) : (b.Config.addKeyBinding(f.Handler.Undo, {
      ctrlCmd: !0,
      key: "Z"
    }), b.Config.addKeyBinding(f.Handler.Redo, {
      ctrlCmd: !0,
      shift: !0,
      key: "Z"
    })), b.Config.addKeyBinding(f.Handler.CursorHome, {
      ctrlCmd: !0,
      key: "LeftArrow"
    }), b.Config.addKeyBinding(f.Handler.CursorHomeSelect, {
      ctrlCmd: !0,
      shift: !0,
      key: "LeftArrow"
    }), b.Config.addKeyBinding(f.Handler.CursorEnd, {
      ctrlCmd: !0,
      key: "RightArrow"
    }), b.Config.addKeyBinding(f.Handler.CursorEndSelect, {
      ctrlCmd: !0,
      shift: !0,
      key: "RightArrow"
    }), b.Config.addKeyBinding(f.Handler.CursorHome, {
      winCtrl: !0,
      key: "A"
    }), b.Config.addKeyBinding(f.Handler.CursorLeft, {
      winCtrl: !0,
      key: "B"
    }), b.Config.addKeyBinding(f.Handler.DeleteRight, {
      winCtrl: !0,
      key: "D"
    }), b.Config.addKeyBinding(f.Handler.CursorEnd, {
      winCtrl: !0,
      key: "E"
    }), b.Config.addKeyBinding(f.Handler.CursorRight, {
      winCtrl: !0,
      key: "F"
    }), b.Config.addKeyBinding(f.Handler.DeleteLeft, {
      winCtrl: !0,
      key: "H"
    }), b.Config.addKeyBinding(f.Handler.DeleteAllRight, {
      winCtrl: !0,
      key: "K"
    }), b.Config.addKeyBinding(f.Handler.CursorDown, {
      winCtrl: !0,
      key: "N"
    }), b.Config.addKeyBinding(f.Handler.LineBreakInsert, {
      winCtrl: !0,
      key: "O"
    }), b.Config.addKeyBinding(f.Handler.CursorUp, {
      winCtrl: !0,
      key: "P"
    }), b.Config.addKeyBinding(f.Handler.CursorPageDown, {
      winCtrl: !0,
      key: "V"
    })) : (b.Config.addKeyBinding(f.Handler.CursorTop, {
      ctrlCmd: !0,
      key: "Home"
    }), b.Config.addKeyBinding(f.Handler.CursorTopSelect, {
      ctrlCmd: !0,
      shift: !0,
      key: "Home"
    }), b.Config.addKeyBinding(f.Handler.CursorBottom, {
      ctrlCmd: !0,
      key: "End"
    }), b.Config.addKeyBinding(f.Handler.CursorBottomSelect, {
      ctrlCmd: !0,
      shift: !0,
      key: "End"
    }), b.Config.addKeyBinding(f.Handler.Undo, {
      ctrlCmd: !0,
      key: "Z"
    }), b.Config.addKeyBinding(f.Handler.Redo, {
      ctrlCmd: !0,
      key: "Y"
    }), b.Config.addKeyBinding(f.Handler.Redo, {
      ctrlCmd: !0,
      shift: !0,
      key: "Z"
    }))
})