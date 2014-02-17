define("vs/languages/less/editor/colorContribution", ["require", "exports", "vs/base/lifecycle",
  "vs/base/time/schedulers", "vs/base/dom/dom", "vs/base/errors", "vs/base/strings", "vs/editor/core/constants",
  "vs/css!./colorContribution"
], function(e, t, n, i, o, r, s, a) {
  var u = function() {
    function e(e, t, n) {
      this.renderingDecorationId = e.addDecoration({
        startLineNumber: t.startLineNumber,
        startColumn: t.startColumn,
        endLineNumber: t.startLineNumber,
        endColumn: t.startColumn + 1
      }, {
        inlineClassName: "inline-color-decoration " + n
      });

      this.trackingDecorationId = e.addDecoration(t, {});
    }
    e.prototype.dispose = function(e) {
      e.removeDecoration(this.trackingDecorationId);

      e.removeDecoration(this.renderingDecorationId);
    };

    e.prototype.getColorValue = function(e) {
      var t = e.getDecorationRange(this.trackingDecorationId);
      return t ? e.getValueInRange(t) : "";
    };

    return e;
  }();

  var l = function() {
    function e(t) {
      var n = this;
      this._instanceCount = ++e.INSTANCE_COUNT;

      this._editor = t;

      this._callOnDispose = [];

      this._callOnModelChange = [];

      this._currentDecorations = [];

      this._currentDynamicColors = [];

      this._scheduler = new i.RunOnceScheduler(null, 250);

      this._currentFindColorDeclarationsPromise = null;

      this._callOnDispose.push(this._scheduler);

      this._callOnDispose.push(this._editor.addListener2(a.EventType.ModelChanged, function() {
        return n.onModelChange();
      }));

      this.onModelChange();
    }
    e.prototype.dispose = function() {
      var e = this;
      this._editor.changeDecorations(function(t) {
        for (var n = 0; n < e._currentDecorations.length; n++) {
          e._currentDecorations[n].dispose(t);
        }
      });

      o.removeCSSRulesWithPrefix(this.getCSSRuleName(-1));

      this._callOnDispose = n.disposeAll(this._callOnDispose);
    };

    e.prototype.getId = function() {
      return e.ID;
    };

    e.prototype.onModelChange = function() {
      var e = this;
      n.cAll(this._callOnModelChange);
      var t = this._editor.getModel();
      if (t) {
        var i = t.getMode();
        if ("function" == typeof i.findColorDeclarations) {
          this._scheduler.setRunner(function() {
            if (e._currentFindColorDeclarationsPromise) {
              e._currentFindColorDeclarationsPromise.cancel();
            }

            e._currentFindColorDeclarationsPromise = i.findColorDeclarations(t.getAssociatedResource());

            e._currentFindColorDeclarationsPromise.then(function(t) {
              e.renderAndTrackColors(t);
            }, function(e) {
              r.onUnexpectedError(e);
            });
          });
          this._scheduler.schedule();
          this._callOnModelChange.push(function() {
            e._scheduler.cancel();
          });
          this._callOnModelChange.push(function() {
            if (e._currentFindColorDeclarationsPromise) {
              e._currentFindColorDeclarationsPromise.cancel();
            }

            e._currentFindColorDeclarationsPromise = null;
          });
          this._callOnModelChange.push(t.addListener(a.EventType.ModelContentChanged, function() {
            return e._scheduler.schedule();
          }));
          this._callOnModelChange.push(t.addListener(a.EventType.ModelDecorationsChanged, function() {
            return e.onDecorationsChanged();
          }));
        }
      }
    };

    e.prototype.renderAndTrackColors = function(e) {
      var t;

      var n;

      var i = this;
      this._editor.changeDecorations(function(o) {
        for (t = 0, n = i._currentDecorations.length; n > t; t++) {
          i._currentDecorations[t].dispose(o);
        }
        for (i._currentDecorations = [], t = 0, n = e.length; n > t; t++) {
          i._currentDecorations.push(new u(o, e[t].range, i.getCSSRuleName(t)));
        }
      });

      this.onDecorationsChanged();
    };

    e.prototype.onDecorationsChanged = function() {
      var e;

      var t;

      var n;

      var i;

      var o;

      var r;

      var s = this;

      var a = this._editor.getModel();

      var u = [];
      this._editor.changeDecorations(function(l) {
        for (e = 0, t = s._currentDecorations.length; t > e; e++) {
          r = s._currentDecorations[e];
          n = a.getDecorationRange(r.trackingDecorationId);
          n && !n.isEmpty() ? (u[e] = a.getValueInRange(n).replace(/[^%#a-z0-9.,()]/gi, ""), i = a.getDecorationRange(
            r.renderingDecorationId), o = a.validateRange({
            startLineNumber: n.startLineNumber,
            startColumn: n.startColumn,
            endLineNumber: n.startLineNumber,
            endColumn: n.startColumn + 1
          }), i && i.equalsRange(o) || l.changeDecoration(r.renderingDecorationId, o)) : u[e] = "";
        }
        s.ensureColors(u);
      });
    };

    e.prototype.getCSSRuleName = function(e) {
      return 0 > e ? ".monaco-css-dynamic-" + this._instanceCount + "-" : ".monaco-css-dynamic-" + this._instanceCount +
        "-" + e + ":before";
    };

    e.prototype.ensureColors = function(e) {
      for (var t; this._currentDynamicColors.length > e.length;) {
        o.removeCSSRulesWithPrefix(this.getCSSRuleName(this._currentDynamicColors.length - 1));
        this._currentDynamicColors.pop();
      }
      for (t = this._currentDynamicColors.length; t < e.length; t++) {
        o.createCSSRule(this.getCSSRuleName(t), this.getCSSText(e[t]));
        this._currentDynamicColors.push(e[t]);
      }
      for (t = Math.min(e.length, this._currentDynamicColors.length) - 1; t >= 0; t--) {
        if (this._currentDynamicColors[t] !== e[t]) {
          var n = o.getCSSRule(this.getCSSRuleName(t));
          if (n) {
            n.style.backgroundColor = e[t];
          }
        }
        this._currentDynamicColors[t] = e[t];
      }
    };

    e.prototype.getCSSText = function(e) {
      return s.format("background-color:{0};", e);
    };

    e.ID = "css.editor.colorContribution";

    e.INSTANCE_COUNT = 0;

    return e;
  }();
  t.ColorContribution = l;
});