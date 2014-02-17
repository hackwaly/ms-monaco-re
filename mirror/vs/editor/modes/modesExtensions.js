define("vs/editor/modes/modesExtensions", ["require", "exports", "vs/base/lib/winjs.base", "vs/base/objects",
  "vs/base/types", "vs/platform/platform", "./modesFilters", "./stream", "vs/editor/worker/editorWorkerClient",
  "vs/editor/modes/modes", "vs/base/performance/timer", "vs/editor/modes/nullMode", "vs/base/arrays"
], function(e, t, n, i, o, r, s, a, u, l, c, d, h) {
  t.isDigit = function() {
    var e = "0".charCodeAt(0);

    var t = "1".charCodeAt(0);

    var n = "2".charCodeAt(0);

    var i = "3".charCodeAt(0);

    var o = "4".charCodeAt(0);

    var r = "5".charCodeAt(0);

    var s = "6".charCodeAt(0);

    var a = "7".charCodeAt(0);

    var u = "8".charCodeAt(0);

    var l = "9".charCodeAt(0);

    var c = "a".charCodeAt(0);

    var d = "b".charCodeAt(0);

    var h = "c".charCodeAt(0);

    var p = "d".charCodeAt(0);

    var f = "e".charCodeAt(0);

    var g = "f".charCodeAt(0);

    var m = "A".charCodeAt(0);

    var v = "B".charCodeAt(0);

    var y = "C".charCodeAt(0);

    var _ = "D".charCodeAt(0);

    var b = "E".charCodeAt(0);

    var C = "F".charCodeAt(0);
    return function(w, E) {
      var S = w.charCodeAt(0);
      switch (E) {
        case 1:
          return S === e;
        case 2:
          return S >= e && t >= S;
        case 3:
          return S >= e && n >= S;
        case 4:
          return S >= e && i >= S;
        case 5:
          return S >= e && o >= S;
        case 6:
          return S >= e && r >= S;
        case 7:
          return S >= e && s >= S;
        case 8:
          return S >= e && a >= S;
        case 9:
          return S >= e && u >= S;
        case 10:
          return S >= e && l >= S;
        case 11:
          return S >= e && l >= S || S === c || S === m;
        case 12:
          return S >= e && l >= S || S >= c && d >= S || S >= m && v >= S;
        case 13:
          return S >= e && l >= S || S >= c && h >= S || S >= m && y >= S;
        case 14:
          return S >= e && l >= S || S >= c && p >= S || S >= m && _ >= S;
        case 15:
          return S >= e && l >= S || S >= c && f >= S || S >= m && b >= S;
        default:
          return S >= e && l >= S || S >= c && g >= S || S >= m && C >= S;
      }
    };
  }();
  var p = function() {
    function e(e, t, n) {
      this.startIndex = e;

      this.type = t;

      this.bracket = n;
    }
    return e;
  }();

  var f = function() {
    function e(e, t, n) {
      if ("undefined" == typeof e) {
        e = null;
      }

      if ("undefined" == typeof t) {
        t = null;
      }

      if ("undefined" == typeof n) {
        n = !1;
      }

      this.id = e;

      this.workerModule = t;

      this.supportsNestedMode = n;

      this.workerPool = [];

      this._defaultWorker = null;

      this.models = {};

      this._options = null;

      this.validationSupport = this;

      this.autoValidateDelay = 500;

      this.tokenizationSupport = this;

      this.occurrencesSupport = this;

      this.suggestSupport = this;

      this.inplaceReplaceSupport = this;

      this.diffSupport = this;

      this.dirtyDiffSupport = this;

      this.linkSupport = this;

      this.configSupport = this;

      this.electricCharacterSupport = this;

      this.commentsSupport = this;

      this.characterPairSupport = this;

      this.tokenTypeClassificationSupport = this;

      this.inEditorActionsSupport = this;
    }
    e.prototype.getId = function() {
      return this.id;
    };

    e.prototype._models = function() {
      return this.models;
    };

    e.prototype.injectContextService = function(e) {
      this.contextService = e;
    };

    e.prototype._getOrCreateNullWorker = function() {
      if (null === e.NULL_WORKER_INSTANCE) try {
        e.NULL_WORKER_INSTANCE = new u.EditorWorkerClient(e.NULL_WORKER_ID, "nullWorker", {
          contextService: this.contextService,
          participants: [],
          configData: {},
          extraData: null
        });
      } catch (t) {
        console.error(t);
      }
      return e.NULL_WORKER_INSTANCE;
    };

    e.prototype._registerWorker = function(e) {
      var t = this;
      if (e) {
        this.workerPool.push(e);
        Object.keys(this.models).forEach(function(n) {
          e.bindModel(t.models[n]);
        });
      }
    };

    e.prototype._newCustomWorker = function(n, i) {
      if (!this.workerModule || this.workerModule === e.NULL_WORKER_ID) {
        return null;
      }
      if (!this.contextService) {
        return null;
      }
      if (o.isUndefinedOrNull(i)) {
        i = this.workerModule.substring(this.workerModule.lastIndexOf("/") + 1);
      }
      var s = [];

      var a = this.getId();
      if (null !== a && a.length > 0) {
        var l = r.Registry.as(t.Extensions.EditorModes);
        l.getWorkerParticipants(a).forEach(function(e) {
          s.push(e);
        });
      }
      try {
        var c = new u.EditorWorkerClient(this.workerModule, i, {
          contextService: this.contextService,
          participants: s,
          configData: this._options,
          extraData: n
        });
        this._registerWorker(c);

        return c;
      } catch (d) {
        console.error(d);

        return void 0;
      }
    };

    e.prototype.getWorkers = function() {
      return this.workerPool.slice(0);
    };

    e.prototype.workerRequest = function(e, t, i) {
      if ("undefined" == typeof t) {
        t = null;
      }
      var o = c.start(1, e.commandName || e.command);

      var r = function() {
        o.stop();
      };
      i || (this.ensureWorkers(), i = this._defaultWorker);

      return i ? n.decoratePromise(i.request(e.command, e.params), r, r) : n.Promise.as(t);
    };

    e.prototype.ensureWorkers = function() {
      if (!this.nullWorker) {
        this.nullWorker = this._getOrCreateNullWorker();
        this._registerWorker(this.nullWorker);
      }

      if (!this._defaultWorker) {
        this._defaultWorker = this._newCustomWorker();
      }

      if (!this._defaultWorker) {
        this._defaultWorker = this.nullWorker;
      }
    };

    e.prototype.bindModel = function(e) {
      this.ensureWorkers();

      this.models[e.id] = e;

      this.workerPool.forEach(function(t) {
        t.bindModel(e);
      });
    };

    e.prototype.unbindModel = function(e) {
      delete this.models[e.id];

      this.workerPool.forEach(function(t) {
        t.unbindModel(e);
      });
    };

    e.prototype.validate = function(e) {
      return this.request("validate", null, e);
    };

    e.prototype.getFilter = function() {
      return s.DefaultFilter;
    };

    e.prototype.suggest = function(e, t, n) {
      return this.request("suggest", n, e, t);
    };

    e.prototype.getTriggerCharacters = function() {
      return [];
    };

    e.prototype.shouldAutotriggerSuggest = function(t, n, i) {
      return this._handleEvent(t, n, i, function(t, n, i, o) {
        return t instanceof e ? t.shouldAutotriggerSuggestImpl(n, i.tokens, o) : t.suggestSupport ? t.suggestSupport
          .shouldAutotriggerSuggest(n, i, o) : void 0;
      });
    };

    e.prototype.shouldAutotriggerSuggestImpl = function() {
      return !1;
    };

    e.prototype.shouldShowEmptySuggestionList = function() {
      return !0;
    };

    e.prototype.shouldTriggerParameterHints = function() {
      return !0;
    };

    e.prototype.findOccurrences = function(e, t, n, i) {
      "undefined" == typeof n && (n = !1);

      return this.request("findOccurrences", i, e, t, n);
    };

    e.prototype.format = function(e, t, n) {
      return this.request("format", null, e, t, n);
    };

    e.prototype.navigateValueSet = function(e, t, n, i) {
      return this.request("navigateValueSet", i, e, t, n);
    };

    e.prototype.getActionsAtPosition = function(e, t, n) {
      return this.request("getActionsAtPosition", n, e, t);
    };

    e.prototype.computeDiff = function(e, t, n) {
      return this.request("computeDiff", n || this.nullWorker, e, t);
    };

    e.prototype.computeDirtyDiff = function(e, t) {
      return this.request("computeDirtyDiff", t || this.nullWorker, e);
    };

    e.prototype.computeLinks = function(e, t) {
      return this.request("computeLinks", t || this.nullWorker, e);
    };

    e.prototype.configure = function(e) {
      var t = this;
      if (o.isEmptyObject(e)) {
        return n.Promise.as(!0);
      }
      this._options = e;
      var i = this.workerPool.map(function(i) {
        return i === t.nullWorker ? n.Promise.as(null) : t.request("configure", i, e);
      });
      return n.Promise.join(i);
    };

    e.prototype.onEnter = function(t, n, i) {
      return this._handleEvent(t, n, i, function(t, n, i, o) {
        return t instanceof e ? t.onEnterImpl(n, i.tokens, o) : t.electricCharacterSupport ? t.electricCharacterSupport
          .onEnter(n, i, o) : void 0;
      });
    };

    e.prototype.onEnterImpl = function() {
      return null;
    };

    e.prototype.onElectricCharacter = function(t, n, i) {
      return this._handleEvent(t, n, i, function(t, n, i, o) {
        return t instanceof e ? t.onElectricCharacterImpl(n, i.tokens, o) : t.electricCharacterSupport ? t.electricCharacterSupport
          .onElectricCharacter(n, i, o) : void 0;
      });
    };

    e.prototype.onElectricCharacterImpl = function() {
      return null;
    };

    e.prototype.getElectricCharacters = function() {
      return [];
    };

    e.prototype.request = function(e, t) {
      for (var n = [], i = 0; i < arguments.length - 2; i++) {
        n[i] = arguments[i + 2];
      }
      return this.workerRequest({
        command: e,
        params: n
      }, null, t);
    };

    e.prototype.getInitialState = function() {
      throw new Error("Abstract Method");
    };

    e.prototype.getNonWordTokenTypes = function() {
      return [];
    };

    e.prototype.getWordDefinition = function() {
      return d.NullMode.DEFAULT_WORD_REGEXP;
    };

    e.prototype.getAutoClosingPairs = function() {
      return [];
    };

    e.prototype.shouldAutoClosePair = function(t, n, i, o) {
      return this._handleEvent(n, i, o, function(n, i, o, r) {
        return n instanceof e ? n.shouldAutoClosePairImpl(t, i, o.tokens, r) : n.characterPairSupport ? n.characterPairSupport
          .shouldAutoClosePair(t, i, o, r) : void 0;
      });
    };

    e.prototype.shouldAutoClosePairImpl = function() {
      return !0;
    };

    e.prototype.getSurroundingPairs = function() {
      return this.getAutoClosingPairs();
    };

    e.prototype.getCommentsConfiguration = function() {
      return null;
    };

    e.prototype._handleEvent = function(e, t, n, i) {
      if (0 === t.tokens.length || !this.supportsNestedMode) {
        return i(this, e, t, n);
      }
      var o = t.modeTransitions;

      var r = t.tokens;

      var s = h.findIndexInSegmentsArray(o, n);

      var a = o[s].mode;

      var u = o[s].startIndex;

      var l = h.findIndexInSegmentsArray(r, u);

      var c = -1;

      var d = -1;
      if (s + 1 < o.length) {
        d = h.findIndexInSegmentsArray(r, o[s + 1].startIndex);
        c = r[d].startIndex;
      }

      {
        d = r.length;
        c = e.length;
      }
      for (var f, g = [], m = r[l].startIndex, v = l; d > v; v++) {
        f = r[v];
        g.push(new p(f.startIndex - m, f.type, f.bracket));
      }
      var y = e.substring(m, c);

      var _ = n - m;

      var b = {
        tokens: g,
        modeTransitions: [{
          startIndex: 0,
          mode: a
        }],
        actualStopOffset: 0,
        endState: null
      };
      return i(a, y, b, _);
    };

    e.prototype._getEmbeddedLevel = function(e) {
      for (var t = -1; e;) {
        t++;
        e = e.getStateData();
      }
      return t;
    };

    e.prototype._nestedTokenize = function(e, t, n, i, o, r) {
      for (var s = t.getStateData(), a = this.getLeavingNestedModeData(e, s), u = t; u.getStateData() && u.getStateData()
        .getMode() !== this;) {
        u = u.getStateData();
      }
      var l = u.getMode();
      if (!a) {
        var c;
        c = l.tokenizationSupport ? l.tokenizationSupport.tokenize(e, t, n, i) : d.nullTokenize(l, e, t, n);

        c.tokens = o.concat(c.tokens);

        c.modeTransitions = r.concat(c.modeTransitions);

        return c;
      }
      var h = a.nestedModeBuffer;
      if (h.length > 0) {
        var p;
        p = l.tokenizationSupport ? l.tokenizationSupport.tokenize(h, t, n, i) : d.nullTokenize(l, h, t, n);

        t = p.endState;

        o = o.concat(p.tokens);

        r = r.concat(p.modeTransitions);
      }
      var f = a.bufferAfterNestedMode;

      var g = a.stateAfterNestedMode;
      g.setStateData(s.getStateData());

      this.onReturningFromNestedMode(g, t);

      return this._myTokenize(f, g, n + h.length, i, o, r);
    };

    e.prototype._myTokenize = function(t, n, i, o, r, s) {
      var u;

      var l;

      var c = new a.LineStream(t);

      var d = null;
      n = n.clone();

      if (s.length <= 0 || s[s.length - 1].mode !== this) {
        s.push({
          startIndex: i,
          mode: this
        });
      }
      for (var h = Math.min(o - i, t.length), f = 0; c.pos() < h;) {
        l = c.pos();
        do {
          if (u = n.tokenize(c), null === u || void 0 === u || (void 0 === u.type || null === u.type) && (void 0 ===
            u.nextState || null === u.nextState)) throw new Error("Tokenizer must return a valid state");
          if (u.nextState && (u.nextState.setStateData(n.getStateData()), n = u.nextState), c.pos() <= l) throw new Error(
            "Stream did not advance while tokenizing.");
        } while (!u.type && "" !== u.type);
        if ((d !== u.type || u.bracket || null === d) && r.push(new p(l + i, u.type, u.bracket || f)), d = u.type,
          this.supportsNestedMode && this.enterNestedMode(n)) {
          var g = this._getEmbeddedLevel(n);
          if (g < e.MAX_EMBEDDED_LEVELS) {
            var m = this.getNestedModeInitialState(n);
            if (!c.eos()) {
              var v = t.substr(c.pos());
              return this._nestedTokenize(v, m, i + c.pos(), o, r, s);
            }
            n = m;
          }
        }
      }
      return {
        tokens: r,
        actualStopOffset: c.pos() + i,
        modeTransitions: s,
        endState: n
      };
    };

    e.prototype.tokenize = function(e, t, n, i) {
      "undefined" == typeof n && (n = 0);

      "undefined" == typeof i && (i = n + e.length);

      return t.getMode() !== this ? this._nestedTokenize(e, t, n, i, [], []) : this._myTokenize(e, t, n, i, [], []);
    };

    e.prototype.enterNestedMode = function() {
      return !1;
    };

    e.prototype.getNestedMode = function() {
      return null;
    };

    e.prototype.getNestedModeInitialState = function(e) {
      var t;

      var n = this.getNestedMode(e);
      t = n.tokenizationSupport ? n.tokenizationSupport.getInitialState() : new d.NullState(n, null);

      t.setStateData(e);

      return t;
    };

    e.prototype.getLeavingNestedModeData = function() {
      return null;
    };

    e.prototype.onReturningFromNestedMode = function() {};

    e.NULL_WORKER_ID = "vs/languages/nullWorker";

    e.NULL_WORKER_INSTANCE = null;

    e.MAX_EMBEDDED_LEVELS = 5;

    return e;
  }();
  t.AbstractMode = f;
  var g = function() {
    function e() {}
    e.tokenize = function(e, t) {
      for (var n = {
        tagName: "div",
        style: "white-space: pre",
        children: []
      }, i = e.split("\n"), o = t.tokenizationSupport.getInitialState(), r = 0; r < i.length; r++) {
        var s = i[r];

        var a = 0;

        var u = t.tokenizationSupport.tokenize(s, o);
        o = u.endState;
        for (var l = u.tokens, c = 0; c < l.length; c++) {
          var d = l[c];
          e = "";

          if (c < l.length - 1) {
            e = s.substring(a, l[c + 1].startIndex);
            a = l[c + 1].startIndex;
          }

          {
            e = s.substr(a);
          }
          var h = "token";
          if (d.type) {
            h += " " + d.type.split(".").join(" ");
          }

          n.children.push({
            tagName: "span",
            className: h,
            text: e
          });
        }
        if (r < i.length - 1) {
          n.children.push({
            tagName: "br"
          });
        }
      }
      return n;
    };

    return e;
  }();
  t.TextToHtmlTokenizer = g;
  var m = function() {
    function e(e, t) {
      if ("undefined" == typeof t) {
        t = null;
      }

      this.mode = e;

      this.stateData = t;
    }
    e.prototype.getMode = function() {
      return this.mode;
    };

    e.prototype.clone = function() {
      var e = this.makeClone();
      e.initializeFrom(this);

      return e;
    };

    e.prototype.makeClone = function() {
      throw new Error("Abstract Method");
    };

    e.prototype.initializeFrom = function(e) {
      this.stateData = null !== e.stateData ? e.stateData.clone() : null;
    };

    e.prototype.getStateData = function() {
      return this.stateData;
    };

    e.prototype.setStateData = function(e) {
      this.stateData = e;
    };

    e.prototype.equals = function(t) {
      if (null === t || this.mode !== t.getMode()) {
        return !1;
      }
      if (!(t instanceof e)) {
        return !1;
      }
      var n = t;
      return null === this.stateData && null === n.stateData ? !0 : null === this.stateData || null === n.stateData ? !
        1 : this.stateData.equals(n.stateData);
    };

    e.prototype.tokenize = function() {
      throw new Error("Abstract Method");
    };

    return e;
  }();
  t.AbstractState = m;

  t.LANGUAGE_CONFIGURATION = "languages";

  t.Extensions = {
    EditorModes: "editor.modes"
  };
  var v = {};

  var y = {};

  var _ = {};

  var b = {};

  var C = {};

  var w = {};

  var E = function() {
    function e() {
      this._modeCreationRequests = {};

      this._modesRegistryInjector = null;
    }
    e.prototype.injectInjectorService = function(e) {
      this._modesRegistryInjector = e;
    };

    e.prototype.registerWorkerParticipant = function(e, t) {
      if (!v.hasOwnProperty(e)) {
        v[e] = [];
      }

      v[e].push(t);
    };

    e.prototype.getWorkerParticipants = function(e) {
      return v.hasOwnProperty(e) ? v[e] : [];
    };

    e.prototype.isRegisteredMode = function(e) {
      return y.hasOwnProperty(e);
    };

    e.prototype.getRegisteredModes = function() {
      var e;

      var t = [];
      for (e in y) {
        t.push(e);
      }
      return t;
    };

    e.prototype.registerMode = function(e, t) {
      e.forEach(function(e) {
        y[e] = t;
      });
    };

    e.prototype.configureMode = function(e, t) {
      this.doConfigureMode(e, t, C, _);
    };

    e.prototype.configureModeById = function(e, t) {
      this.doConfigureMode(e, t, w, b);
    };

    e.prototype.doConfigureMode = function(e, t, n, o) {
      if (n.hasOwnProperty(e)) {
        var r = n[e];
        if (r && r.configSupport) {
          r.configSupport.configure(t);
        }
      } else {
        var s = o[e] || {};
        s = i.mixin(s, t);

        o[e] = s;
      }
    };

    e.prototype.getMode = function(e) {
      if (!e) {
        return null;
      }
      for (var t = e.split(","), n = 0; n < t.length; n++) {
        var i = t[n].trim();

        var o = this.getOrCreateOneModeSync(i);
        if (o) {
          return o;
        }
      }
      return null;
    };

    e.prototype.getOrCreateOneModeSync = function(e) {
      if (C.hasOwnProperty(e)) {
        return C[e];
      }
      if (!this.isRegisteredMode(e)) {
        return null;
      }
      var t = y[e].syncLoadAndCreate(this._modesRegistryInjector);
      t && (C[e] = t, w[t.getId()] = t, t.configSupport && (_.hasOwnProperty(e) && t.configSupport.configure(_[e] || {}),
        b.hasOwnProperty(t.getId()) && t.configSupport.configure(b[t.getId()] || {})));

      return t;
    };

    e.prototype.getModeDescriptor = function(e) {
      if (e)
        for (var t = e.split(","), n = 0; n < t.length; n++) {
          var i = t[n].trim();
          if (this.isRegisteredMode(i)) {
            return y[i];
          }
        }
      return null;
    };

    e.prototype.getOrCreateMode = function(e) {
      if (!e) {
        return n.Promise.as(null);
      }
      for (var t = e.split(","), i = 0; i < t.length; i++) {
        var o = t[i].trim();
        if (this.isRegisteredMode(o)) {
          return this.getOrCreateOneModeAsync(o);
        }
      }
      return n.Promise.as(null);
    };

    e.prototype.getOrCreateOneModeAsync = function(e) {
      var t = this;
      return C.hasOwnProperty(e) ? n.Promise.as(C[e]) : (this._modeCreationRequests.hasOwnProperty(e) || (this._modeCreationRequests[
        e] = y[e].loadAndCreate(this._modesRegistryInjector).then(function(n) {
        C[e] = n;

        w[n.getId()] = n;

        n && n.configSupport && (_.hasOwnProperty(e) && n.configSupport.configure(_[e] || {}), b.hasOwnProperty(
          n.getId()) && n.configSupport.configure(b[n.getId()] || {}));

        delete t._modeCreationRequests[e];

        return n;
      })), this._modeCreationRequests[e]);
    };

    return e;
  }();
  r.Registry.add(t.Extensions.EditorModes, new E);
});