define(["require", "exports", 'vs/base/strings'], function(require, exports, __strings__) {
  /*---------------------------------------------------------
   * Copyright (C) Microsoft Corporation. All rights reserved.
   *--------------------------------------------------------*/
  'use strict';


  var strings = __strings__;

  var Edit = (function() {
    function Edit(offset, length, text) {
      this.offset = offset;
      this.length = length;
      this.text = text || '';
      this.parent = null;
      this.children = [];
    }
    Edit.prototype.isNoop = function() {
      return this.length === 0 && this.text.length === 0;
    };

    Edit.prototype.isDelete = function() {
      return this.length > 0 && this.text.length === 0;
    };

    Edit.prototype.isInsert = function() {
      return this.length === 0 && this.text.length > 0;
    };

    Edit.prototype.isReplace = function() {
      return this.length > 0 && this.text.length > 0;
    };

    Edit.prototype.getRightMostChild = function() {
      var len = this.children.length;
      if (len === 0) {
        return this;
      } else {
        return this.children[len - 1].getRightMostChild();
      }
    };

    Edit.prototype.remove = function() {
      if (this.parent) {
        return this.parent.removeChild(this);
      } else {
        return false;
      }
    };

    Edit.prototype.addChild = function(edit) {
      // reparent
      edit.parent = this;

      // find insertion point
      var i, len;
      for (i = 0, len = this.children.length; i < len; i++) {
        if (this.children[i].offset > edit.offset) {
          break;
        }
      }

      // insert
      this.children.splice(i, 0, edit);
    };

    Edit.prototype.removeChild = function(edit) {
      var idx = this.children.indexOf(edit);
      if (idx === -1) {
        return false;
      } else {
        edit.parent = null;
        this.children.splice(idx, 1);
        return true;
      }
    };

    Edit.prototype.insert = function(edit) {
      if (this.enclosedBy(edit)) {
        edit.insert(this);
        return edit;
      }

      // check with children
      var i, len, child;

      for (i = 0, len = this.children.length; i < len; i++) {
        child = this.children[i];

        if (child.enclosedBy(edit)) {
          // reparent children that are enclosed
          this.removeChild(child);
          edit.insert(child);
          len--;
          i--;
        } else if (child.encloses(edit)) {
          // enclosed by a child
          child.insert(edit);
          return this;
        }
      }

      // not enclosed by my children
      this.addChild(edit);

      return this;
    };

    Edit.prototype.enclosedBy = function(edit) {
      return edit.encloses(this);
    };

    Edit.prototype.encloses = function(edit) {
      if (this.offset > edit.offset || edit.offset >= this.offset + this.length) {
        return false;
      }
      if (edit.offset + edit.length > this.offset + this.length) {
        return false;
      }
      return true;
    };
    return Edit;
  })();
  exports.Edit = Edit;

  var TextEdit = (function() {
    function TextEdit(model) {
      this.model = model;
      this.modelVersion = model.versionId;
      this.edit = new Edit(0, this.model.getValue().length, null);
    }
    TextEdit.prototype.replace = function(offset, length, text) {
      if (typeof length === "undefined") {
        length = 0;
      }
      if (typeof text === "undefined") {
        text = null;
      }
      var edit = new Edit(offset, length, text);
      if (edit.isNoop()) {
        return;
      }
      this.edit = this.edit.insert(edit);
    };

    TextEdit.prototype.apply = function() {
      if (this.model.versionId !== this.modelVersion) {
        throw new Error('illegal state - model has been changed');
      }

      var value = this.model.getValue(),
        child;

      while ((child = this.edit.getRightMostChild()) !== this.edit) {
        value = strings.splice(value, child.offset, child.length, child.text);
        child.parent.length += child.text.length - child.length;
        child.remove();
      }

      return value;
    };
    return TextEdit;
  })();

  function create(model) {
    return new TextEdit(model);
  }
  exports.create = create;
});