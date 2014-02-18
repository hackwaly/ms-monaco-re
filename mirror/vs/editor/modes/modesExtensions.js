define(["require", "exports", "vs/base/lib/winjs.base", "vs/base/objects", "vs/base/types", "vs/platform/platform",
  "./modesFilters", "./stream", "vs/editor/worker/editorWorkerClient", "vs/editor/modes/modes",
  "vs/base/performance/timer", "vs/editor/modes/nullMode", "vs/platform/services", "vs/base/arrays"
], function(a, b, c, d, e, f, g, h, i, j, k, l, m, n) {
  var o = c;

  var p = d;

  var q = e;

  var r = f;

  var s = g;

  var t = h;

  var u = i;

  var v = j;

  var w = k;

  var x = l;

  var y = m;

  var z = n;
  b.isDigit = function() {
    var a = "0123456789abcdef";

    var b = {};
    for (var c = 0; c < a.length; c++) {
      b[a.charAt(c).toLowerCase()] = c + 1;
      b[a.charAt(c).toUpperCase()] = c + 1;
    }
    return function(c, d) {
      return b[c] ? b[c] <= d : !1;
    };
  }();
  var A = function() {
    function a(a, b, c) {
      if (typeof a == "undefined") {
        a = null;
      }

      if (typeof b == "undefined") {
        b = null;
      }

      if (typeof c == "undefined") {
        c = !1;
      }

      this.id = a;

      this.workerModule = b;

      this.supportsNestedMode = c;

      this.workerPool = [];

      this.defaultWorker = null;

      this.models = {};

      this.options = null;

      this.validationSupport = this;

      this.tokenizationSupport = this;

      this.occurrencesSupport = this;

      this.suggestSupport = this;

      this.parameterHintsSupport = this;

      this.formattingSupport = this;

      this.inplaceReplaceSupport = this;

      this.diffSupport = this;

      this.dirtyDiffSupport = this;

      this.linkSupport = this;

      this.configSupport = this;

      this.electricCharacterSupport = this;

      this.commentsSupport = this;

      this.characterPairSupport = this;

      this.tokenTypeClassificationSupport = this;
    }
    a.prototype.getId = function() {
      return this.id;
    };

    a.prototype._models = function() {
      return this.models;
    };

    a.prototype.injectContextService = function(a) {
      this.contextService = a;
    };

    a.prototype.newWorker = function(a, c) {
      var d = this;
      if (!this.workerModule) {
        return null;
      }
      if (!this.contextService) {
        return null;
      }
      if (q.isUndefinedOrNull(c)) {
        c = this.workerModule.substring(this.workerModule.lastIndexOf("/") + 1);
      }
      var e = [];

      var f = this.getId();
      if (f !== null && f.length > 0) {
        var g = r.Registry.as(b.Extensions.EditorModes);
        g.getWorkerParticipants(f).forEach(function(a) {
          e.push(a);
        });
      }
      try {
        var h = new u.EditorWorkerClient(this.workerModule, c, {
          contextService: this.contextService,
          participants: e,
          configData: this.options,
          extraData: a
        });
        this.workerPool.push(h);

        Object.keys(this.models).forEach(function(a) {
          h.bindModel(d.models[a]);
        });

        return h;
      } catch (i) {
        console.error(i);

        return undefined;
      }
    };

    a.prototype.getWorkers = function() {
      return this.workerPool.slice(0);
    };

    a.prototype.workerRequest = function(a, b, c) {
      if (typeof b == "undefined") {
        b = null;
      }
      var d = w.start(w.Topic.LANGUAGES, a.commandName || a.command);

      var e = function() {
        d.stop();
      };
      c || (this.ensureDefaultWorker(), c = this.defaultWorker);

      return c ? o.decoratePromise(c.request(a.command, a.params), e, e) : o.Promise.as(b);
    };

    a.prototype.ensureDefaultWorker = function() {
      if (!this.defaultWorker) {
        this.defaultWorker = this.newWorker();
      }
    };

    a.prototype.bindModel = function(a) {
      this.ensureDefaultWorker();

      this.models[a.id] = a;

      this.workerPool.forEach(function(b) {
        b.bindModel(a);
      });
    };

    a.prototype.unbindModel = function(a) {
      delete this.models[a.id];

      this.workerPool.forEach(function(b) {
        b.unbindModel(a);
      });
    };

    a.prototype.validate = function(a) {
      return this.request("validate", null, a);
    };

    a.prototype.getFilter = function() {
      return s.DefaultFilter;
    };

    a.prototype.suggest = function(a, b, c) {
      return this.request("suggest", c, a, b);
    };

    a.prototype.getTriggerCharacters = function() {
      return [];
    };

    a.prototype.shouldAutotriggerSuggest = function(b, c, d) {
      return this._handleEvent(b, c, d, function(b, c, d, e) {
        if (b instanceof a) {
          return b.shouldAutotriggerSuggestImpl(c, d.tokens, e);
        }
        if (b.suggestSupport) {
          return b.suggestSupport.shouldAutotriggerSuggest(c, d, e);
        }
      });
    };

    a.prototype.shouldAutotriggerSuggestImpl = function(a, b, c) {
      return !1;
    };

    a.prototype.shouldShowEmptySuggestionList = function() {
      return !0;
    };

    a.prototype.getParameterHints = function(a, b, c) {
      return o.Promise.as(null);
    };

    a.prototype.getParameterHintsTriggerCharacters = function() {
      return ["(", ","];
    };

    a.prototype.findOccurrences = function(a, b, c, d) {
      typeof c == "undefined" && (c = !1);

      return this.request("findOccurrences", d, a, b, c);
    };

    a.prototype.format = function(a, b, c) {
      return this.request("format", null, a, b, c);
    };

    a.prototype.navigateValueSet = function(a, b, c, d) {
      return this.request("navigateValueSet", d, a, b, c);
    };

    a.prototype.computeDiff = function(a, b, c) {
      return this.request("computeDiff", c, a, b);
    };

    a.prototype.computeDirtyDiff = function(a, b) {
      return this.request("computeDirtyDiff", b, a);
    };

    a.prototype.computeLinks = function(a) {
      return this.request("computeLinks", null, a);
    };

    a.prototype.configure = function(a) {
      var b = this;
      if (q.isEmptyObject(a)) {
        return o.Promise.as(!0);
      }
      this.options = a;
      var c = this.workerPool.map(function(c) {
        return b.request("configure", c, a);
      });
      return o.Promise.join(c);
    };

    a.prototype.onEnter = function(b, c, d) {
      return this._handleEvent(b, c, d, function(b, c, d, e) {
        if (b instanceof a) {
          return b.onEnterImpl(c, d.tokens, e);
        }
        if (b.electricCharacterSupport) {
          return b.electricCharacterSupport.onEnter(c, d, e);
        }
      });
    };

    a.prototype.onEnterImpl = function(a, b, c) {
      return null;
    };

    a.prototype.onElectricCharacter = function(b, c, d) {
      return this._handleEvent(b, c, d, function(b, c, d, e) {
        if (b instanceof a) {
          return b.onElectricCharacterImpl(c, d.tokens, e);
        }
        if (b.electricCharacterSupport) {
          return b.electricCharacterSupport.onElectricCharacter(c, d, e);
        }
      });
    };

    a.prototype.onElectricCharacterImpl = function(a, b, c) {
      return null;
    };

    a.prototype.getElectricCharacters = function() {
      return [];
    };

    a.prototype.request = function(a, b) {
      var c = [];
      for (var d = 0; d < arguments.length - 2; d++) {
        c[d] = arguments[d + 2];
      }
      return this.workerRequest({
        command: a,
        params: c
      }, null, b);
    };

    a.prototype.getInitialState = function() {
      throw new Error("Abstract Method");
    };

    a.prototype.getNonWordTokenTypes = function() {
      return [];
    };

    a.prototype.getWordDefinition = function() {
      return x.NullMode.DEFAULT_WORD_REGEXP;
    };

    a.prototype.getAutoClosingPairs = function() {
      return [];
    };

    a.prototype.shouldAutoClosePair = function(b, c, d, e) {
      return this._handleEvent(c, d, e, function(c, d, e, f) {
        if (c instanceof a) {
          return c.shouldAutoClosePairImpl(b, d, e.tokens, f);
        }
        if (c.characterPairSupport) {
          return c.characterPairSupport.shouldAutoClosePair(b, d, e, f);
        }
      });
    };

    a.prototype.shouldAutoClosePairImpl = function(a, b, c, d) {
      return !0;
    };

    a.prototype.getSurroundingPairs = function() {
      return this.getAutoClosingPairs();
    };

    a.prototype.getCommentsConfiguration = function() {
      return null;
    };

    a.prototype._handleEvent = function(a, b, c, d) {
      if (b.tokens.length === 0 || !this.supportsNestedMode) {
        return d(this, a, b, c);
      }
      var e = b.modeTransitions;

      var f = b.tokens;

      var g = z.findIndexInSegmentsArray(e, c);

      var h = e[g].mode;

      var i = e[g].startIndex;

      var j = z.findIndexInSegmentsArray(f, i);

      var k = -1;

      var l = -1;
      if (g + 1 < e.length) {
        l = z.findIndexInSegmentsArray(f, e[g + 1].startIndex);
        k = f[l].startIndex;
      } else {
        l = f.length;
        k = a.length;
      }
      var m = [];

      var n = f[j].startIndex;

      var o;
      for (var p = j; p < l; p++) {
        o = f[p];
        m.push({
          startIndex: o.startIndex - n,
          type: o.type,
          bracket: o.bracket
        });
      }
      var q = a.substring(n, k);

      var r = c - n;

      var s = {
        tokens: m,
        modeTransitions: [{
          startIndex: 0,
          mode: h
        }],
        actualStopOffset: 0,
        endState: null
      };
      return d(h, q, s, r);
    };

    a.prototype._getEmbeddedLevel = function(a) {
      var b = -1;
      while (a) {
        b++;
        a = a.getStateData();
      }
      return b;
    };

    a.prototype._nestedTokenize = function(a, b, c, d, e, f) {
      var g = b.getStateData();

      var h = this.getLeavingNestedModeData(a, g);

      var i = b;
      while (i.getStateData() && i.getStateData().getMode() !== this) {
        i = i.getStateData();
      }
      var j = i.getMode();
      if (!h) {
        var k;
        j.tokenizationSupport ? k = j.tokenizationSupport.tokenize(a, b, c, d) : k = x.nullTokenize(j, a, b, c);

        k.tokens = e.concat(k.tokens);

        k.modeTransitions = f.concat(k.modeTransitions);

        return k;
      }
      var l = h.nestedModeBuffer;
      if (l.length > 0) {
        var m;
        if (j.tokenizationSupport) {
          m = j.tokenizationSupport.tokenize(l, b, c, d);
        } else {
          m = x.nullTokenize(j, l, b, c);
        }

        b = m.endState;

        e = e.concat(m.tokens);

        f = f.concat(m.modeTransitions);
      }
      var n = h.bufferAfterNestedMode;

      var o = h.stateAfterNestedMode;
      o.setStateData(g.getStateData());

      this.onReturningFromNestedMode(o, b);

      return this._myTokenize(n, o, c + l.length, d, e, f);
    };

    a.prototype._myTokenize = function(b, c, d, e, f, g) {
      var h = new t.LineStream(b);

      var i;

      var j;

      var k;

      var l = null;

      var m;
      c = c.clone();

      if (g.length <= 0 || g[g.length - 1].mode !== this) {
        g.push({
          startIndex: d,
          mode: this
        });
      }
      var n = Math.min(e - d, b.length);
      while (h.pos() < n) {
        j = h.pos();

        k = null;
        while (k === null) {
          i = c.tokenize(h);
          if (i === null || i === undefined || !(i.type !== undefined && i.type !== null || i.nextState !== undefined &&
            i.nextState !== null)) throw new Error("Tokenizer must return a valid state");
          k = i.type !== null && i.type !== undefined ? i.type : null;

          m = i.bracket !== null && i.bracket !== undefined ? i.bracket : v.Bracket.None;

          if (i.nextState !== undefined && i.nextState !== null) {
            i.nextState.setStateData(c.getStateData());
            c = i.nextState;
          }
          if (h.pos() <= j) throw new Error("Stream did not advance while tokenizing.");
        }
        if (l === null || l !== k || m !== v.Bracket.None) {
          f.push({
            startIndex: j + d,
            type: k,
            bracket: m
          });
        }

        l = k;
        if (this.supportsNestedMode && this.enterNestedMode(c)) {
          var o = this._getEmbeddedLevel(c);
          if (o < a.MAX_EMBEDDED_LEVELS) {
            var p = this.getNestedModeInitialState(c);
            if (!h.eos()) {
              var q = b.substr(h.pos());
              return this._nestedTokenize(q, p, d + h.pos(), e, f, g);
            }
            c = p;
          }
        }
      }
      return {
        tokens: f,
        actualStopOffset: h.pos() + d,
        modeTransitions: g,
        endState: c
      };
    };

    a.prototype.tokenize = function(a, b, c, d) {
      typeof c == "undefined" && (c = 0);

      typeof d == "undefined" && (d = c + a.length);

      return b.getMode() !== this ? this._nestedTokenize(a, b, c, d, [], []) : this._myTokenize(a, b, c, d, [], []);
    };

    a.prototype.enterNestedMode = function(a) {
      return !1;
    };

    a.prototype.getNestedMode = function(a) {
      return null;
    };

    a.prototype.getNestedModeInitialState = function(a) {
      var b = this.getNestedMode(a);

      var c;
      b.tokenizationSupport ? c = b.tokenizationSupport.getInitialState() : c = new x.NullState(b, null);

      c.setStateData(a);

      return c;
    };

    a.prototype.getLeavingNestedModeData = function(a, b) {
      return null;
    };

    a.prototype.onReturningFromNestedMode = function(a, b) {};

    a.MAX_EMBEDDED_LEVELS = 5;

    return a;
  }();
  b.AbstractMode = A;
  var B = function() {
    function a() {}
    a.tokenize = function(a, b) {
      var c = {
        tagName: "div",
        style: "white-space: pre",
        children: []
      };

      var d = a.split("\n");

      var e = b.tokenizationSupport.getInitialState();
      for (var f = 0; f < d.length; f++) {
        var g = d[f];

        var h = 0;

        var i = b.tokenizationSupport.tokenize(g, e);
        e = i.endState;
        var j = i.tokens;
        for (var k = 0; k < j.length; k++) {
          var l = j[k];
          a = "";

          if (k < j.length - 1) {
            a = g.substring(h, j[k + 1].startIndex);
            h = j[k + 1].startIndex;
          } else {
            a = g.substr(h);
          }
          var m = "token";
          if (l.type) {
            m += " " + l.type.split(".").join(" ");
          }

          c.children.push({
            tagName: "span",
            className: m,
            text: a
          });
        }
        if (f < d.length - 1) {
          c.children.push({
            tagName: "br"
          });
        }
      }
      return c;
    };

    return a;
  }();
  b.TextToHtmlTokenizer = B;
  var C = function() {
    function a(a, b) {
      if (typeof b == "undefined") {
        b = null;
      }

      this.mode = a;

      this.stateData = b;
    }
    a.prototype.getMode = function() {
      return this.mode;
    };

    a.prototype.clone = function() {
      var a = this.makeClone();
      a.initializeFrom(this);

      return a;
    };

    a.prototype.makeClone = function() {
      throw new Error("Abstract Method");
    };

    a.prototype.initializeFrom = function(a) {
      this.stateData = a.stateData !== null ? a.stateData.clone() : null;
    };

    a.prototype.getStateData = function() {
      return this.stateData;
    };

    a.prototype.setStateData = function(a) {
      this.stateData = a;
    };

    a.prototype.equals = function(b) {
      if (b === null || this.mode !== b.getMode()) {
        return !1;
      }
      if (b instanceof a) {
        var c = b;
        return this.stateData === null && c.stateData === null ? !0 : this.stateData === null || c.stateData === null ? !
          1 : this.stateData.equals(c.stateData);
      }
      return !1;
    };

    a.prototype.tokenize = function(a) {
      throw new Error("Abstract Method");
    };

    return a;
  }();
  b.AbstractState = C;

  b.LANGUAGE_CONFIGURATION = "languages";

  b.Extensions = {
    EditorModes: "editor.modes"
  };
  var D = {};

  var E = {};

  var F = {};

  var G = {};

  var H = {};

  var I = {};

  var J = function() {
    function a() {
      this._modeCreationRequests = {};

      this._modesRegistryInjector = null;
    }
    a.prototype.injectInjectorService = function(a) {
      this._modesRegistryInjector = a;
    };

    a.prototype.registerWorkerParticipant = function(a, b) {
      if (!D.hasOwnProperty(a)) {
        D[a] = [];
      }

      D[a].push(b);
    };

    a.prototype.getWorkerParticipants = function(a) {
      return D.hasOwnProperty(a) ? D[a] : [];
    };

    a.prototype.isRegisteredMode = function(a) {
      return E.hasOwnProperty(a);
    };

    a.prototype.registerMode = function(a, b) {
      a.forEach(function(a) {
        E[a] = b;
      });
    };

    a.prototype.configureMode = function(a, b) {
      this.doConfigureMode(a, b, H, F);
    };

    a.prototype.configureModeById = function(a, b) {
      this.doConfigureMode(a, b, I, G);
    };

    a.prototype.doConfigureMode = function(a, b, c, d) {
      if (c.hasOwnProperty(a)) {
        var e = c[a];
        if (e && e.configSupport) {
          e.configSupport.configure(b);
        }
      } else {
        var f = d[a] || {};
        f = p.mixin(f, b);

        d[a] = f;
      }
    };

    a.prototype.getMode = function(a) {
      if (!a) {
        return null;
      }
      var b = a.split(",");
      for (var c = 0; c < b.length; c++) {
        var d = b[c].trim();

        var e = this.getOrCreateOneModeSync(d);
        if (e) {
          return e;
        }
      }
      return null;
    };

    a.prototype.getOrCreateOneModeSync = function(a) {
      if (H.hasOwnProperty(a)) {
        return H[a];
      }
      if (!this.isRegisteredMode(a)) {
        return null;
      }
      var b = E[a].syncLoadAndCreate(this._modesRegistryInjector);
      b && (H[a] = b, I[b.getId()] = b, b.configSupport && (F.hasOwnProperty(a) && b.configSupport.configure(F[a] || {}),
        G.hasOwnProperty(b.getId()) && b.configSupport.configure(G[b.getId()] || {})));

      return b;
    };

    a.prototype.getOrCreateMode = function(a) {
      if (!a) {
        return o.Promise.as(null);
      }
      var b = a.split(",");
      for (var c = 0; c < b.length; c++) {
        var d = b[c].trim();
        if (this.isRegisteredMode(d)) {
          return this.getOrCreateOneModeAsync(d);
        }
      }
      return o.Promise.as(null);
    };

    a.prototype.getOrCreateOneModeAsync = function(a) {
      var b = this;
      return H.hasOwnProperty(a) ? o.Promise.as(H[a]) : (this._modeCreationRequests.hasOwnProperty(a) || (this._modeCreationRequests[
        a] = E[a].loadAndCreate(this._modesRegistryInjector).then(function(c) {
        H[a] = c;

        I[c.getId()] = c;

        c && c.configSupport && (F.hasOwnProperty(a) && c.configSupport.configure(F[a] || {}), G.hasOwnProperty(
          c.getId()) && c.configSupport.configure(G[c.getId()] || {}));

        delete b._modeCreationRequests[a];

        return c;
      })), this._modeCreationRequests[a]);
    };

    return a;
  }();
  r.Registry.mixin(b.Extensions.EditorModes, new J);
});