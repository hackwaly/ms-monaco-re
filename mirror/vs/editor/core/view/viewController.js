define(["require", "exports", "vs/editor/core/constants", "vs/editor/core/position"], function(a, b, c, d) {
  var e = c;

  var f = d;

  var g = function() {
    function a(a, b, c) {
      this.viewModel = a;

      this.configuration = b;

      this.outgoingEventBus = c;
    }
    a.prototype.paste = function(a, b, c) {
      this.configuration.handlerDispatcher.trigger(a, e.Handler.Paste, {
        text: b,
        sameSource: c
      });
    };

    a.prototype.type = function(a, b) {
      this.configuration.handlerDispatcher.trigger(a, e.Handler.Type, {
        text: b
      });
    };

    a.prototype.cut = function(a) {
      this.configuration.handlerDispatcher.trigger(a, e.Handler.Cut, null);
    };

    a.prototype.moveTo = function(a, b, c) {
      this.configuration.handlerDispatcher.trigger(a, e.Handler.MoveTo, {
        position: this.convertViewToModelPosition(b, c),
        viewPosition: new f.Position(b, c)
      });
    };

    a.prototype.moveToSelect = function(a, b, c) {
      this.configuration.handlerDispatcher.trigger(a, e.Handler.MoveToSelect, {
        position: this.convertViewToModelPosition(b, c),
        viewPosition: new f.Position(b, c)
      });
    };

    a.prototype.createCursor = function(a, b, c, d) {
      this.configuration.handlerDispatcher.trigger(a, e.Handler.CreateCursor, {
        position: this.convertViewToModelPosition(b, c),
        viewPosition: new f.Position(b, c),
        wholeLine: d
      });
    };

    a.prototype.lastCursorMoveToSelect = function(a, b, c) {
      this.configuration.handlerDispatcher.trigger(a, e.Handler.LastCursorMoveToSelect, {
        position: this.convertViewToModelPosition(b, c),
        viewPosition: new f.Position(b, c)
      });
    };

    a.prototype.wordSelect = function(a, b, c, d) {
      this.configuration.handlerDispatcher.trigger(a, e.Handler.WordSelect, {
        position: this.convertViewToModelPosition(b, c),
        preference: d
      });
    };

    a.prototype.wordSelectDrag = function(a, b, c, d) {
      this.configuration.handlerDispatcher.trigger(a, e.Handler.WordSelectDrag, {
        position: this.convertViewToModelPosition(b, c),
        preference: d
      });
    };

    a.prototype.lastCursorWordSelect = function(a, b, c, d) {
      this.configuration.handlerDispatcher.trigger(a, e.Handler.LastCursorWordSelect, {
        position: this.convertViewToModelPosition(b, c),
        preference: d
      });
    };

    a.prototype.lineSelect = function(a, b, c) {
      this.configuration.handlerDispatcher.trigger(a, e.Handler.LineSelect, {
        position: this.convertViewToModelPosition(b, c),
        viewPosition: new f.Position(b, c)
      });
    };

    a.prototype.lineSelectDrag = function(a, b, c) {
      this.configuration.handlerDispatcher.trigger(a, e.Handler.LineSelectDrag, {
        position: this.convertViewToModelPosition(b, c),
        viewPosition: new f.Position(b, c)
      });
    };

    a.prototype.lastCursorLineSelect = function(a, b, c) {
      this.configuration.handlerDispatcher.trigger(a, e.Handler.LastCursorLineSelect, {
        position: this.convertViewToModelPosition(b, c),
        viewPosition: new f.Position(b, c)
      });
    };

    a.prototype.lastCursorLineSelectDrag = function(a, b, c) {
      this.configuration.handlerDispatcher.trigger(a, e.Handler.LastCursorLineSelectDrag, {
        position: this.convertViewToModelPosition(b, c),
        viewPosition: new f.Position(b, c)
      });
    };

    a.prototype.selectAll = function(a) {
      this.configuration.handlerDispatcher.trigger(a, e.Handler.SelectAll, null);
    };

    a.prototype.convertViewToModelPosition = function(a, b) {
      return this.viewModel.convertViewPositionToModelPosition(a, b);
    };

    a.prototype.convertViewToModelRange = function(a) {
      return this.viewModel.convertViewRangeToModelRange(a);
    };

    a.prototype.convertViewToModelMouseEvent = function(a) {
      if (a.target) {
        if (a.target.position) {
          a.target.position = this.convertViewToModelPosition(a.target.position.lineNumber, a.target.position.column);
        }
        if (a.target.range) {
          a.target.range = this.convertViewToModelRange(a.target.range);
        }
      }
    };

    a.prototype.emitKeyDown = function(a) {
      this.outgoingEventBus.emit(e.EventType.KeyDown, a);
    };

    a.prototype.emitKeyUp = function(a) {
      this.outgoingEventBus.emit(e.EventType.KeyUp, a);
    };

    a.prototype.emitContextMenu = function(a) {
      this.convertViewToModelMouseEvent(a);

      this.outgoingEventBus.emit(e.EventType.ContextMenu, a);
    };

    a.prototype.emitMouseMove = function(a) {
      this.convertViewToModelMouseEvent(a);

      this.outgoingEventBus.emit(e.EventType.MouseMove, a);
    };

    a.prototype.emitMouseLeave = function(a) {
      this.convertViewToModelMouseEvent(a);

      this.outgoingEventBus.emit(e.EventType.MouseLeave, a);
    };

    a.prototype.emitMouseUp = function(a) {
      this.convertViewToModelMouseEvent(a);

      this.outgoingEventBus.emit(e.EventType.MouseUp, a);
    };

    a.prototype.emitMouseDown = function(a) {
      this.convertViewToModelMouseEvent(a);

      this.outgoingEventBus.emit(e.EventType.MouseDown, a);
    };

    return a;
  }();
  b.ViewController = g;
});