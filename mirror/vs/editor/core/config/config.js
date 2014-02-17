define("vs/editor/core/config/config", ["require", "exports", "vs/base/env", "vs/editor/core/internalConstants"],
  function(e, t, n, i) {
    function o(e, t) {
      return n.browser.isMacintosh ? {
        shift: e,
        alt: !0,
        key: t
      } : {
        ctrlCmd: !0,
        shift: e,
        key: t
      };
    }
    var r = function() {
      function e() {
        this.editor = {
          lineHeight: 20,
          lineNumbers: !0,
          selectOnLineNumbers: !0,
          lineNumbersMinChars: 5,
          glyphMargin: !1,
          lineDecorationsWidth: 10,
          revealHorizontalRightPadding: 30,
          tabSize: "auto",
          insertSpaces: "auto",
          roundedSelection: !0,
          theme: "vs",
          pageSize: 1,
          readOnly: !1,
          scrollbar: {
            verticalScrollbarSize: 14,
            horizontal: "auto",
            useShadows: !0,
            verticalHasArrows: !1,
            horizontalHasArrows: !1
          },
          overviewRulerLanes: 2,
          hideCursorInOverviewRuler: !1,
          scrollBeyondLastLine: !0,
          automaticLayout: !1,
          wrappingColumn: 300,
          wordWrapBreakBeforeCharacters: "{([+",
          wordWrapBreakAfterCharacters: " 	})]?|&,;",
          wordWrapBreakObtrusiveCharacters: ".",
          tabFocusMode: !1,
          longLineBoundary: 300,
          isDominatedByLongLines: !1,
          hover: !0,
          contextmenu: !0,
          quickSuggestions: !0,
          quickSuggestionsDelay: 500,
          iconsInSuggestions: !0,
          autoClosingBrackets: !0,
          formatOnType: !1,
          suggestOnTriggerCharacters: !0
        };

        this.keyBindings = {};
      }
      e.prototype.addKeyBinding = function(e, t) {
        this.keyBindings[e] = this.keyBindings[e] || [];

        this.keyBindings[e].push(t);
      };

      return e;
    }();
    t.ConfigClass = r;

    t.Config = new r;

    t.Config.addKeyBinding(i.Handler.CursorLeft, {
      key: "LeftArrow"
    });

    t.Config.addKeyBinding(i.Handler.CursorLeftSelect, {
      shift: !0,
      key: "LeftArrow"
    });

    t.Config.addKeyBinding(i.Handler.CursorRight, {
      key: "RightArrow"
    });

    t.Config.addKeyBinding(i.Handler.CursorRightSelect, {
      shift: !0,
      key: "RightArrow"
    });

    t.Config.addKeyBinding(i.Handler.CursorUp, {
      key: "UpArrow"
    });

    t.Config.addKeyBinding(i.Handler.CursorUpSelect, {
      shift: !0,
      key: "UpArrow"
    });

    t.Config.addKeyBinding(i.Handler.CursorDown, {
      key: "DownArrow"
    });

    t.Config.addKeyBinding(i.Handler.CursorDownSelect, {
      shift: !0,
      key: "DownArrow"
    });

    t.Config.addKeyBinding(i.Handler.CursorPageUp, {
      key: "PageUp"
    });

    t.Config.addKeyBinding(i.Handler.CursorPageUpSelect, {
      shift: !0,
      key: "PageUp"
    });

    t.Config.addKeyBinding(i.Handler.CursorPageDown, {
      key: "PageDown"
    });

    t.Config.addKeyBinding(i.Handler.CursorPageDownSelect, {
      shift: !0,
      key: "PageDown"
    });

    t.Config.addKeyBinding(i.Handler.CursorHome, {
      key: "Home"
    });

    t.Config.addKeyBinding(i.Handler.CursorHomeSelect, {
      shift: !0,
      key: "Home"
    });

    t.Config.addKeyBinding(i.Handler.CursorEnd, {
      key: "End"
    });

    t.Config.addKeyBinding(i.Handler.CursorEndSelect, {
      shift: !0,
      key: "End"
    });

    t.Config.addKeyBinding(i.Handler.Tab, {
      key: "Tab"
    });

    t.Config.addKeyBinding(i.Handler.Outdent, {
      shift: !0,
      key: "Tab"
    });

    t.Config.addKeyBinding(i.Handler.DeleteLeft, {
      key: "Backspace"
    });

    t.Config.addKeyBinding(i.Handler.DeleteLeft, {
      shift: !0,
      key: "Backspace"
    });

    t.Config.addKeyBinding(i.Handler.DeleteRight, {
      key: "Delete"
    });

    t.Config.addKeyBinding(i.Handler.DeleteRight, {
      shift: !0,
      key: "Delete"
    });

    t.Config.addKeyBinding(i.Handler.Indent, {
      ctrlCmd: !0,
      key: "]"
    });

    t.Config.addKeyBinding(i.Handler.Outdent, {
      ctrlCmd: !0,
      key: "["
    });

    t.Config.addKeyBinding(i.Handler.SelectAll, {
      ctrlCmd: !0,
      key: "A"
    });

    t.Config.addKeyBinding(i.Handler.Escape, {
      key: "Escape"
    });

    t.Config.addKeyBinding(i.Handler.LineInsertBefore, {
      ctrlCmd: !0,
      shift: !0,
      key: "Enter"
    });

    t.Config.addKeyBinding(i.Handler.LineInsertAfter, {
      ctrlCmd: !0,
      key: "Enter"
    });

    t.Config.addKeyBinding(i.Handler.AddCursorUp, {
      ctrlCmd: !0,
      alt: !0,
      key: "UpArrow"
    });

    t.Config.addKeyBinding(i.Handler.AddCursorDown, {
      ctrlCmd: !0,
      alt: !0,
      key: "DownArrow"
    });

    t.Config.addKeyBinding(i.Handler.CursorWordLeft, o(!1, "LeftArrow"));

    t.Config.addKeyBinding(i.Handler.CursorWordLeftSelect, o(!0, "LeftArrow"));

    t.Config.addKeyBinding(i.Handler.CursorWordRight, o(!1, "RightArrow"));

    t.Config.addKeyBinding(i.Handler.CursorWordRightSelect, o(!0, "RightArrow"));

    t.Config.addKeyBinding(i.Handler.CursorDownSelect, o(!0, "DownArrow"));

    t.Config.addKeyBinding(i.Handler.CursorUpSelect, o(!0, "UpArrow"));

    t.Config.addKeyBinding(i.Handler.DeleteWordLeft, o(!1, "Backspace"));

    t.Config.addKeyBinding(i.Handler.DeleteWordRight, o(!1, "Delete"));

    if (n.browser.isMacintosh) {
      t.Config.addKeyBinding(i.Handler.CursorTop, {
        ctrlCmd: !0,
        key: "UpArrow"
      });
      t.Config.addKeyBinding(i.Handler.CursorTopSelect, {
        ctrlCmd: !0,
        shift: !0,
        key: "UpArrow"
      });
      t.Config.addKeyBinding(i.Handler.CursorBottom, {
        ctrlCmd: !0,
        key: "DownArrow"
      });
      t.Config.addKeyBinding(i.Handler.CursorBottomSelect, {
        ctrlCmd: !0,
        shift: !0,
        key: "DownArrow"
      });
      if (n.browser.isOpera) {
        t.Config.addKeyBinding(i.Handler.Undo, {
          winCtrl: !0,
          key: "Z"
        });
        t.Config.addKeyBinding(i.Handler.Redo, {
          winCtrl: !0,
          key: "Y"
        });
      } else {
        t.Config.addKeyBinding(i.Handler.Undo, {
          ctrlCmd: !0,
          key: "Z"
        });
        t.Config.addKeyBinding(i.Handler.Redo, {
          ctrlCmd: !0,
          shift: !0,
          key: "Z"
        });
      }
      t.Config.addKeyBinding(i.Handler.CursorHome, {
        ctrlCmd: !0,
        key: "LeftArrow"
      });
      t.Config.addKeyBinding(i.Handler.CursorHomeSelect, {
        ctrlCmd: !0,
        shift: !0,
        key: "LeftArrow"
      });
      t.Config.addKeyBinding(i.Handler.CursorEnd, {
        ctrlCmd: !0,
        key: "RightArrow"
      });
      t.Config.addKeyBinding(i.Handler.CursorEndSelect, {
        ctrlCmd: !0,
        shift: !0,
        key: "RightArrow"
      });
      t.Config.addKeyBinding(i.Handler.CursorHome, {
        winCtrl: !0,
        key: "A"
      });
      t.Config.addKeyBinding(i.Handler.CursorLeft, {
        winCtrl: !0,
        key: "B"
      });
      t.Config.addKeyBinding(i.Handler.DeleteRight, {
        winCtrl: !0,
        key: "D"
      });
      t.Config.addKeyBinding(i.Handler.CursorEnd, {
        winCtrl: !0,
        key: "E"
      });
      t.Config.addKeyBinding(i.Handler.CursorRight, {
        winCtrl: !0,
        key: "F"
      });
      t.Config.addKeyBinding(i.Handler.DeleteLeft, {
        winCtrl: !0,
        key: "H"
      });
      t.Config.addKeyBinding(i.Handler.DeleteAllRight, {
        winCtrl: !0,
        key: "K"
      });
      t.Config.addKeyBinding(i.Handler.CursorDown, {
        winCtrl: !0,
        key: "N"
      });
      t.Config.addKeyBinding(i.Handler.LineBreakInsert, {
        winCtrl: !0,
        key: "O"
      });
      t.Config.addKeyBinding(i.Handler.CursorUp, {
        winCtrl: !0,
        key: "P"
      });
      t.Config.addKeyBinding(i.Handler.CursorPageDown, {
        winCtrl: !0,
        key: "V"
      });
    } else {
      t.Config.addKeyBinding(i.Handler.CursorTop, {
        ctrlCmd: !0,
        key: "Home"
      });
      t.Config.addKeyBinding(i.Handler.CursorTopSelect, {
        ctrlCmd: !0,
        shift: !0,
        key: "Home"
      });
      t.Config.addKeyBinding(i.Handler.CursorBottom, {
        ctrlCmd: !0,
        key: "End"
      });
      t.Config.addKeyBinding(i.Handler.CursorBottomSelect, {
        ctrlCmd: !0,
        shift: !0,
        key: "End"
      });
      t.Config.addKeyBinding(i.Handler.Undo, {
        ctrlCmd: !0,
        key: "Z"
      });
      t.Config.addKeyBinding(i.Handler.Redo, {
        ctrlCmd: !0,
        key: "Y"
      });
      t.Config.addKeyBinding(i.Handler.Redo, {
        ctrlCmd: !0,
        shift: !0,
        key: "Z"
      });
    }
  });