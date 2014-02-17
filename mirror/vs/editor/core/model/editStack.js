define("vs/editor/core/model/editStack", ["require", "exports", "vs/editor/core/model/modelEditOperation"], function(e,
  t, n) {
  var i = function() {
    function e(e) {
      this.model = e;

      this.currentOpenStackElement = null;

      this.past = [];

      this.future = [];
    }
    e.prototype.pushStackElement = function() {
      null !== this.currentOpenStackElement && (this.past.push(this.currentOpenStackElement), this.currentOpenStackElement =
        null);
    };

    e.prototype.clear = function() {
      this.currentOpenStackElement = null;

      this.past = [];

      this.future = [];
    };

    e.prototype.pushEditOperation = function(e, t, i) {
      this.future = [];

      this.currentOpenStackElement || (this.currentOpenStackElement = {
        beforeCursorState: e,
        editOperations: [],
        afterCursorState: null
      });
      var o = n.ModelEditOperation.execute(this.model, {
        operations: t
      });
      this.currentOpenStackElement.editOperations.push(o);

      this.currentOpenStackElement.afterCursorState = i ? i(o.operations) : null;

      return this.currentOpenStackElement.afterCursorState;
    };

    e.prototype.undo = function() {
      if (this.pushStackElement(), this.past.length > 0) {
        for (var e = this.past.pop(), t = e.editOperations.length - 1; t >= 0; t--) e.editOperations[t] = n.ModelEditOperation
          .execute(this.model, e.editOperations[t]);
        this.future.push(e);

        return e.beforeCursorState;
      }
      return null;
    };

    e.prototype.redo = function() {
      if (this.future.length > 0) {
        if (this.currentOpenStackElement) throw new Error("How is this possible?");
        for (var e = this.future.pop(), t = 0; t < e.editOperations.length; t++) e.editOperations[t] = n.ModelEditOperation
          .execute(this.model, e.editOperations[t]);
        this.past.push(e);

        return e.afterCursorState;
      }
      return null;
    };

    return e;
  }();
  t.EditStack = i;
});