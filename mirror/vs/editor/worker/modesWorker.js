define('vs/editor/worker/modesWorker', [
  'require',
  'exports',
  'vs/base/lib/winjs.base',
  'vs/editor/diff/diffComputer',
  'vs/editor/modes/modesFilters',
  'vs/editor/core/model/textModel'
], function(e, t, n, i, o, r) {
  var s = function() {
    function e() {
      this.workerParticipants = [], this.autoValidateDelay = 500;
    }
    return e.prototype.injectPublisherService = function(e) {
      this.publisher = e;
    }, e.prototype.injectResourceService = function(e) {
      this.resourceService = e;
    }, e.prototype.injectDispatcherService = function(e) {
      this.dispatchService = e, this.dispatchService.register(this);
    }, e.prototype.injectMarkerService = function(e) {
      this.markerService = e;
    }, e.prototype.setExtraData = function() {}, e.prototype.addWorkerParticipant = function(e) {
      this.workerParticipants.push(e);
    }, e.prototype.validate = function(e) {
      var t = this;
      return this.markerService.createPublisher().batchChanges(function(n) {
        t.doValidate(e, n), t.triggerValidateParticipation(e, n);
      }), n.Promise.as(null);
    }, e.prototype.triggerValidateParticipation = function(e, t, n) {
      'undefined' == typeof n && (n = null);
      var i = this.resourceService.get(e);
      this.workerParticipants.forEach(function(e) {
        try {
          if ('function' != typeof e.validate)
            return;
          e.validate(i, t, n);
        } catch (o) {}
      });
    }, e.prototype.doValidate = function() {}, e.prototype.suggest = function(e, t) {
      var i = this,
        o = [],
        r = this.resourceService.get(e),
        s = r.getWordUntilPosition(t),
        a = {
          currentWord: s,
          suggestions: []
        };
      return o.push(this.doSuggest(e, t)), this.workerParticipants.forEach(function(e) {
        try {
          'function' == typeof e.suggest && o.push(e.suggest(t, r));
        } catch (n) {}
      }), n.Promise.join(o).then(function(e) {
        for (var t = i.getSuggestionFilterMain(), n = 0; n < e.length; n++)
          e[n].forEach(function(e) {
            t(s, e) && a.suggestions.push(e);
          });
        return a;
      }, function() {
        return a.currentWord = '', a.suggestions = [], a;
      });
    }, e.prototype.doSuggest = function(e, t) {
      var i = [];
      return i.push.apply(i, this.suggestWords(e, t)), i.push.apply(i, this.suggestSnippets(e, t)), n.Promise.as(i);
    }, e.prototype.suggestWords = function(e, t) {
      var n = this.resourceService.get(e),
        i = n.getWordUntilPosition(t),
        o = n.getAllUniqueWords(i);
      return o.filter(function(e) {
        return !/^-?\d*\.?\d/.test(e);
      }).map(function(e) {
        return {
          type: 'text',
          label: e,
          codeSnippet: e
        };
      });
    }, e.prototype.suggestSnippets = function() {
      return [];
    }, e.prototype.getSuggestionFilterMain = function() {
      var e = this.getSuggestionFilter();
      return this.workerParticipants.forEach(function(t) {
        'function' == typeof t.filter && (e = o.and(e, t.filter));
      }), e;
    }, e.prototype.getSuggestionFilter = function() {
      return e.filter;
    }, e.prototype.findOccurrences = function(e, t) {
      var i = this.resourceService.get(e),
        o = i.getWordAtPosition(t),
        r = [];
      return i.getAllWordsWithRange().forEach(function(e) {
        e.text === o && r.push({
          range: e.range
        });
      }), n.TPromise.as(r.slice(0, 1000));
    }, e.prototype.computeDiff = function(e, t) {
      var o = this.resourceService.get(e),
        r = this.resourceService.get(t);
      if (null !== o && null !== r) {
        var s = o.getRawLines(),
          a = r.getRawLines(),
          u = new i.DiffComputer(s, a, !0, !0);
        return n.TPromise.as(u.computeDiff());
      }
      return n.TPromise.as(null);
    }, e.prototype.computeDirtyDiff = function(e) {
      var t = this.resourceService.get(e),
        o = t.getProperty('original');
      if (o && null !== t) {
        var s = r.TextModel._splitText(o),
          a = s.lines.map(function(e) {
            return e.text;
          }),
          u = t.getRawLines(),
          l = new i.DiffComputer(a, u, !1, !0);
        return n.TPromise.as(l.computeDiff());
      }
      return n.TPromise.as([]);
    }, e.prototype.navigateValueSet = function(e, t, i) {
      var o = this.doNavigateValueSet(e, t, i, !0);
      return n.TPromise.as(o && o.value && o.range ? o : null);
    }, e.prototype.doNavigateValueSet = function(e, t, n, i) {
      var o, r = this.resourceService.get(e),
        s = {
          range: null,
          value: null
        };
      if (i)
        t.startColumn === t.endColumn && (t.endColumn += 1), o = r.getValueInRange(t), s.range = t;
      else {
        var a = {
          lineNumber: t.startLineNumber,
          column: t.startColumn
        }, u = r.getWordUntilPosition(a);
        if (o = r.getWordAtPosition(a), 0 !== o.indexOf(u))
          return null;
        if (o.length < t.endColumn - t.startColumn)
          return null;
        s.range = t, s.range.startColumn = a.column - u.length, s.range.endColumn = s.range.startColumn + o.length;
      }
      var l = this.numberReplace(o, n);
      if (null !== l)
        s.value = l;
      else {
        var c = this.textReplace(o, n);
        if (null !== c)
          s.value = c;
        else if (i)
          return this.doNavigateValueSet(e, t, n, !1);
      }
      return s;
    }, e.prototype.numberReplace = function(e, t) {
      var n = Math.pow(10, e.length - (e.lastIndexOf('.') + 1)),
        i = Number(e),
        o = parseFloat(e);
      return isNaN(i) || isNaN(o) || i !== o ? null : 0 !== i || t ? (i = Math.floor(i * n), i += t ? n : -n, String(
        i / n)) : null;
    }, e.prototype.textReplace = function() {
      return null;
    }, e.prototype.valueSetsReplace = function(e, t, n) {
      for (var i = null; e.length > 0 && null === i;)
        i = this.valueSetReplace(e.pop(), t, n);
      return i;
    }, e.prototype.valueSetReplace = function(e, t, n) {
      var i = e.indexOf(t);
      return i >= 0 ? (i += n ? 1 : -1, 0 > i ? i = e.length - 1 : i %= e.length, e[i]) : null;
    }, e.prototype.getActionsAtPosition = function(e, t) {
      var i = this.resourceService.get(e),
        o = i.getWordAtPosition(t);
      return o ? n.Promise.as(['editor.actions.changeAll']) : n.Promise.as([]);
    }, e.prototype.createLink = function(e, t, n, i) {
      return {
        range: {
          startLineNumber: t,
          startColumn: n + 1,
          endLineNumber: t,
          endColumn: i + 1
        },
        url: e.substring(n, i)
      };
    }, e.prototype.computeLinks = function(e) {
      var t, i, o = this.resourceService.get(e),
        r = [],
        s = [],
        a = 1,
        u = 9,
        l = 10;
      s[1] = {
        h: 2,
        H: 2
      }, s[2] = {
        t: 3,
        T: 3
      }, s[3] = {
        t: 4,
        T: 4
      }, s[4] = {
        p: 5,
        P: 5
      }, s[5] = {
        s: 6,
        S: 6,
        ':': 7
      }, s[6] = {
        ':': 7
      }, s[7] = {
        '/': 8
      }, s[8] = {
        '/': 9
      };
      var c = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-?=&#@:+%',
        d = [],
        h = 0;
      for (t = 0; t < c.length; t++)
        h = Math.max(h, c.charCodeAt(t));
      h = Math.max('<'.charCodeAt(0), '('.charCodeAt(0), '['.charCodeAt(0), '{'.charCodeAt(0));
      for (var t = 0; h >= t; t++)
        d[t] = String.fromCharCode(t);
      for (t = 0; t < c.length; t++)
        d[c.charCodeAt(t)] = null;
      d['<'.charCodeAt(0)] = '>', d['('.charCodeAt(0)] = ')', d['['.charCodeAt(0)] = ']', d['{'.charCodeAt(0)] = '}';
      var p, f, g, m, v, y, _, b, C;
      for (t = 1, i = o.getLineCount(); i >= t; t++) {
        for (p = o.getLineContent(t), f = 0, g = p.length, m = null, v = 0, y = a; g > f;)
          _ = p.charAt(f), C = !1, y === l ? (' ' === _ || '\t' === _ || _ === m) && (r.push(this.createLink(p, t, v,
            f)), C = !0) : y === u ? ' ' === _ || '\t' === _ || _ === m ? C = !0 : y = l : s[y].hasOwnProperty(_) ? y =
            s[y][_] : C = !0, C && (y = a, v = f + 1, b = p.charCodeAt(f), m = b < d.length ? d[b] : _), f++;
        y === l && r.push(this.createLink(p, t, v, g));
      }
      return n.TPromise.as(r);
    }, e.filter = o.DefaultFilter, e;
  }();
  t.AbstractWorkerMode = s;
})