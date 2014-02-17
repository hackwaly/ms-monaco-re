define("vs/editor/core/view/viewController", ["require", "exports", "vs/editor/core/internalConstants",
  "vs/editor/core/constants", "vs/editor/core/position"
], function(e, t, n, i, o) {
  var r = function() {
    function e(e, t, n) {
      this.viewModel = e;

      this.configuration = t;

      this.outgoingEventBus = n;
    }
    e.prototype.paste = function(e, t, i) {
      this.configuration.handlerDispatcher.trigger(e, n.Handler.Paste, {
        text: t,
        pasteOnNewLine: i
      });
    };

    e.prototype.type = function(e, t) {
      this.configuration.handlerDispatcher.trigger(e, n.Handler.Type, {
        text: t
      });
    };

    e.prototype.cut = function(e) {
      this.configuration.handlerDispatcher.trigger(e, n.Handler.Cut, null);
    };

    e.prototype.moveTo = function(e, t, i) {
      this.configuration.handlerDispatcher.trigger(e, n.Handler.MoveTo, {
        position: this.convertViewToModelPosition(t, i),
        viewPosition: new o.Position(t, i)
      });
    };

    e.prototype.moveToSelect = function(e, t, i) {
      this.configuration.handlerDispatcher.trigger(e, n.Handler.MoveToSelect, {
        position: this.convertViewToModelPosition(t, i),
        viewPosition: new o.Position(t, i)
      });
    };

    e.prototype.createCursor = function(e, t, i, r) {
      this.configuration.handlerDispatcher.trigger(e, n.Handler.CreateCursor, {
        position: this.convertViewToModelPosition(t, i),
        viewPosition: new o.Position(t, i),
        wholeLine: r
      });
    };

    e.prototype.lastCursorMoveToSelect = function(e, t, i) {
      this.configuration.handlerDispatcher.trigger(e, n.Handler.LastCursorMoveToSelect, {
        position: this.convertViewToModelPosition(t, i),
        viewPosition: new o.Position(t, i)
      });
    };

    e.prototype.wordSelect = function(e, t, i, o) {
      this.configuration.handlerDispatcher.trigger(e, n.Handler.WordSelect, {
        position: this.convertViewToModelPosition(t, i),
        preference: o
      });
    };

    e.prototype.wordSelectDrag = function(e, t, i, o) {
      this.configuration.handlerDispatcher.trigger(e, n.Handler.WordSelectDrag, {
        position: this.convertViewToModelPosition(t, i),
        preference: o
      });
    };

    e.prototype.lastCursorWordSelect = function(e, t, i, o) {
      this.configuration.handlerDispatcher.trigger(e, n.Handler.LastCursorWordSelect, {
        position: this.convertViewToModelPosition(t, i),
        preference: o
      });
    };

    e.prototype.lineSelect = function(e, t, i) {
      this.configuration.handlerDispatcher.trigger(e, n.Handler.LineSelect, {
        position: this.convertViewToModelPosition(t, i),
        viewPosition: new o.Position(t, i)
      });
    };

    e.prototype.lineSelectDrag = function(e, t, i) {
      this.configuration.handlerDispatcher.trigger(e, n.Handler.LineSelectDrag, {
        position: this.convertViewToModelPosition(t, i),
        viewPosition: new o.Position(t, i)
      });
    };

    e.prototype.lastCursorLineSelect = function(e, t, i) {
      this.configuration.handlerDispatcher.trigger(e, n.Handler.LastCursorLineSelect, {
        position: this.convertViewToModelPosition(t, i),
        viewPosition: new o.Position(t, i)
      });
    };

    e.prototype.lastCursorLineSelectDrag = function(e, t, i) {
      this.configuration.handlerDispatcher.trigger(e, n.Handler.LastCursorLineSelectDrag, {
        position: this.convertViewToModelPosition(t, i),
        viewPosition: new o.Position(t, i)
      });
    };

    e.prototype.selectAll = function(e) {
      this.configuration.handlerDispatcher.trigger(e, n.Handler.SelectAll, null);
    };

    e.prototype.convertViewToModelPosition = function(e, t) {
      return this.viewModel.convertViewPositionToModelPosition(e, t);
    };

    e.prototype.convertViewToModelRange = function(e) {
      return this.viewModel.convertViewRangeToModelRange(e);
    };

    e.prototype.convertViewToModelMouseEvent = function(e) {
      if (e.target) {
        if (e.target.position) {
          e.target.position = this.convertViewToModelPosition(e.target.position.lineNumber, e.target.position.column);
        }
        if (e.target.range) {
          e.target.range = this.convertViewToModelRange(e.target.range);
        }
      }
    };

    e.prototype.emitKeyDown = function(e) {
      this.outgoingEventBus.emit(i.EventType.KeyDown, e);
    };

    e.prototype.emitKeyUp = function(e) {
      this.outgoingEventBus.emit(i.EventType.KeyUp, e);
    };

    e.prototype.emitContextMenu = function(e) {
      this.convertViewToModelMouseEvent(e);

      this.outgoingEventBus.emit(i.EventType.ContextMenu, e);
    };

    e.prototype.emitMouseMove = function(e) {
      this.convertViewToModelMouseEvent(e);

      this.outgoingEventBus.emit(i.EventType.MouseMove, e);
    };

    e.prototype.emitMouseLeave = function(e) {
      this.convertViewToModelMouseEvent(e);

      this.outgoingEventBus.emit(i.EventType.MouseLeave, e);
    };

    e.prototype.emitMouseUp = function(e) {
      this.convertViewToModelMouseEvent(e);

      this.outgoingEventBus.emit(i.EventType.MouseUp, e);
    };

    e.prototype.emitMouseDown = function(e) {
      this.convertViewToModelMouseEvent(e);

      this.outgoingEventBus.emit(i.EventType.MouseDown, e);
    };

    return e;
  }();
  t.ViewController = r;
});