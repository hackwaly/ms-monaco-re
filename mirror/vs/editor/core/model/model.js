define("vs/editor/core/model/model", ["require", "exports", "vs/base/severity", "vs/base/strings", "vs/base/objects",
  "vs/base/network", "vs/editor/core/constants", "vs/editor/core/range", "vs/platform/markers/markers",
  "vs/editor/editor", "vs/editor/core/model/editableTextModel"
], function(e, t, n, i, o, r, s, a, u, l, c) {
  var d = 0;

  var h = 1e3;

  var p = function(e) {
    function t(t, n, i, o) {
      if ("undefined" == typeof i) {
        i = null;
      }

      if ("undefined" == typeof o) {
        o = null;
      }

      e.call(this, [s.EventType.ModelPropertiesChanged, s.EventType.ModelDispose], t, n);

      d++;

      this.id = "$model" + d;

      if ("undefined" == typeof i || null === i) {
        i = new r.URL("inMemory://model/" + d);
      }

      this._markerService = o;

      this._associatedResource = i;

      this._markerDecorationIds = {};

      this.getMode().bindModel(this);

      this._extraProperties = {};

      this._addWordRegExpProperty();
    }
    __extends(t, e);

    t.prototype.destroy = function() {
      this.dispose();
    };

    t.prototype.dispose = function() {
      this.emit(s.EventType.ModelDispose);

      if (this.getMode()) {
        this.getMode().unbindModel(this);
      }

      e.prototype.dispose.call(this);
    };

    t.prototype._reset = function(t, n) {
      var i = this.getMode();

      var o = e.prototype._reset.call(this, t, n);

      var n = this.getMode();
      i !== n && (i.unbindModel(this), n.bindModel(this));

      return o;
    };

    t.prototype.getAssociatedResource = function() {
      return this._associatedResource;
    };

    t.prototype.setProperty = function(e, t) {
      this._extraProperties[e] = t;

      this.emitModelPropertiesChangedEvent();
    };

    t.prototype.getProperty = function(e) {
      return this._extraProperties.hasOwnProperty(e) ? this._extraProperties[e] : null;
    };

    t.prototype.getProperties = function() {
      return o.clone(this._extraProperties);
    };

    t.prototype.findMatches = function(e, t, n, o, r) {
      if ("" === e) {
        return [];
      }
      var s = null;
      try {
        s = i.createRegExp(e, n, o, r);
      } catch (u) {
        return [];
      }
      if (i.regExpLeadsToEndlessLoop(s)) {
        return [];
      }
      var l;
      l = a.isIRange(t) ? t : t ? this.getEditableRange() : this.getFullModelRange();

      return this.doFindMatches(l, s);
    };

    t.prototype._addWordRegExpProperty = function() {
      var e = this._getWordDefinition();
      this.setProperty("$WordDefinitionForMirrorModel", {
        source: e.source,
        flags: (e.global ? "g" : "") + (e.ignoreCase ? "i" : "") + (e.multiline ? "m" : "")
      });
    };

    t.prototype.doFindMatches = function(e, t) {
      var n;

      var i = [];

      var o = 0;
      if (e.startLineNumber === e.endLineNumber) {
        n = this._lines[e.startLineNumber - 1].text.substring(e.startColumn - 1, e.endColumn - 1);
        o = this.findMatchesInLine(t, n, e.startLineNumber, e.startColumn - 1, o, i);
        return i;
      }
      n = this._lines[e.startLineNumber - 1].text.substring(e.startColumn - 1);

      o = this.findMatchesInLine(t, n, e.startLineNumber, e.startColumn - 1, o, i);
      for (var r = e.startLineNumber + 1; r < e.endLineNumber && h >= o; r++) {
        o = this.findMatchesInLine(t, this._lines[r - 1].text, r, 0, o, i);
      }
      h >= o && (n = this._lines[e.endLineNumber - 1].text.substring(0, e.endColumn - 1), o = this.findMatchesInLine(
        t, n, e.endLineNumber, 0, o, i));

      return i;
    };

    t.prototype.findMatchesInLine = function(e, t, n, i, o, r) {
      var s;
      do
        if (s = e.exec(t), s && (r.push(new a.Range(n, s.index + 1 + i, n, s.index + 1 + s[0].length + i)), o++, o >
          h)) {
          return o;
        } while (s);
      return o;
    };

    t.prototype.emitModelPropertiesChangedEvent = function() {
      var e = {
        properties: this._extraProperties
      };
      this.emit(s.EventType.ModelPropertiesChanged, e);
    };

    t.prototype._publishMarkerUpdate = function(e) {
      var t = u.createMarkerUpdateFromJson(e);
      if (null !== this._markerService) {
        this._markerService.change(function(e) {
          e.processMarkerUpdate(t);
        });
      }
      for (var n = t.getId(), i = this._markerDecorationIds[n] || [], o = [], r = t.getMarkers(), s = 0; s < r.length; s++) {
        var a = r[s];
        if ("object" == typeof a.range) {
          o.push({
            range: a.range,
            options: this._createDecorationOption(a)
          });
        }
      }
      this._markerDecorationIds[t.getId()] = this.deltaDecorations(i, o);
    };

    t.prototype._createDecorationOption = function(e) {
      var t = e.severity === n.Severity.Error;
      return {
        stickiness: 1,
        isOverlay: !0,
        className: t ? s.ClassName.EditorErrorDecoration : s.ClassName.EditorWarningDecoration,
        hoverMessage: e.text,
        overviewRuler: {
          color: t ? "rgba(255,18,18,0.7)" : "rgba(18,136,18,0.7)",
          position: 4
        },
        glyphMarginClassName: t ? "glyph-error" : "glyph-warning"
      };
    };

    return t;
  }(c.EditableTextModel);
  t.Model = p;
});