define(["require", "exports", "vs/editor/core/model/modelEditOperation"], function(a, b, c) {
  var d = c,
    e = function() {
      function a(a) {
        this.model = a, this.currentOpenStackElement = null, this.past = [], this.future = []
      }
      return a.prototype.pushStackElement = function() {
        this.currentOpenStackElement !== null && (this.past.push(this.currentOpenStackElement), this.currentOpenStackElement =
          null)
      }, a.prototype.clear = function() {
        this.currentOpenStackElement = null, this.past = [], this.future = []
      }, a.prototype.pushEditOperation = function(a, b, c) {
        this.future = [], this.currentOpenStackElement || (this.currentOpenStackElement = {
          beforeCursorState: a,
          editOperations: [],
          afterCursorState: null
        });
        var e = d.ModelEditOperation.execute(this.model, {
          operations: b
        });
        return this.currentOpenStackElement.editOperations.push(e), this.currentOpenStackElement.afterCursorState = c ?
          c(e.operations) : null, this.currentOpenStackElement.afterCursorState
      }, a.prototype.undo = function() {
        this.pushStackElement();
        if (this.past.length > 0) {
          var a = this.past.pop();
          for (var b = a.editOperations.length - 1; b >= 0; b--) a.editOperations[b] = d.ModelEditOperation.execute(
            this.model, a.editOperations[b]);
          return this.future.push(a), a.beforeCursorState
        }
        return null
      }, a.prototype.redo = function() {
        if (this.future.length > 0) {
          if (this.currentOpenStackElement) throw new Error("How is this possible?");
          var a = this.future.pop();
          for (var b = 0; b < a.editOperations.length; b++) a.editOperations[b] = d.ModelEditOperation.execute(this.model,
            a.editOperations[b]);
          return this.past.push(a), a.afterCursorState
        }
        return null
      }, a
    }();
  b.EditStack = e
})