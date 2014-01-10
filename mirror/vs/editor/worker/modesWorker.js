define(["require", "exports", "vs/base/lib/winjs.base", "vs/editor/diff/diffComputer", "vs/editor/modes/modesFilters",
  "vs/editor/core/model/model"
], function(a, b, c, d, e, f) {
  var g = c,
    h = d,
    i = e,
    j = f,
    k = function() {
      function a() {
        this.workerParticipants = []
      }
      return a.prototype.injectPublisherService = function(a) {
        this.publisher = a
      }, a.prototype.injectResourceService = function(a) {
        this.resourceService = a
      }, a.prototype.injectDispatcherService = function(a) {
        this.dispatchService = a, this.dispatchService.register(this)
      }, a.prototype.injectMarkerService = function(a) {
        this.markerService = a
      }, a.prototype.setExtraData = function(a) {}, a.prototype.addWorkerParticipant = function(a) {
        this.workerParticipants.push(a)
      }, a.prototype.validate = function(a) {
        var b = this;
        return this.markerService.createPublisher().batchChanges(function(c) {
          b.doValidate(a, c)
        }), g.Promise.as(null)
      }, a.prototype.triggerValidateParticipation = function(a, b, c) {
        typeof c == "undefined" && (c = null);
        var d = this.resourceService.get(a);
        this.workerParticipants.forEach(function(a) {
          try {
            typeof a.validate == "function" && a.validate(d, b, c)
          } catch (e) {}
        })
      }, a.prototype.doValidate = function(a, b) {}, a.prototype.suggest = function(a, b) {
        var c = this,
          d = [],
          e = this.resourceService.get(a),
          f = e.getWordUntilPosition(b),
          h = {
            currentWord: f,
            suggestions: []
          };
        return d.push(this.doSuggest(a, b)), this.workerParticipants.forEach(function(a) {
          try {
            typeof a.suggest == "function" && d.push(a.suggest(b, e))
          } catch (c) {}
        }), g.Promise.join(d).then(function(a) {
          var b = c.getSuggestionFilterMain();
          for (var d = 0; d < a.length; d++) a[d].forEach(function(a) {
            b(f, a) && h.suggestions.push(a)
          });
          return h
        }, function(a) {
          return h.currentWord = "", h.suggestions = [], h
        })
      }, a.prototype.doSuggest = function(a, b) {
        var c = [];
        return c.push.apply(c, this.suggestWords(a, b)), c.push.apply(c, this.suggestSnippets(a, b)), g.Promise.as(c)
      }, a.prototype.suggestWords = function(a, b) {
        var c = this.resourceService.get(a),
          d = c.getWordUntilPosition(b),
          e = c.getAllUniqueWords(d);
        return e.filter(function(a) {
          return !/^-?\d*\.?\d/.test(a)
        }).map(function(a) {
          return {
            type: "text",
            label: a,
            codeSnippet: a
          }
        })
      }, a.prototype.suggestSnippets = function(a, b) {
        return []
      }, a.prototype.getSuggestionFilterMain = function() {
        var a = this.getSuggestionFilter();
        return this.workerParticipants.forEach(function(b) {
          typeof b.filter == "function" && (a = i.and(a, b.filter))
        }), a
      }, a.prototype.getSuggestionFilter = function() {
        return a.filter
      }, a.prototype.findOccurrences = function(a, b, c) {
        var d = this.resourceService.get(a),
          e = d.getWordAtPosition(b),
          f = [];
        return d.getAllWordsWithRange().forEach(function(a) {
          a.text === e && f.push({
            range: a.range
          })
        }), g.Promise.as(f)
      }, a.prototype.computeDiff = function(a, b) {
        var c = this.resourceService.get(a),
          d = this.resourceService.get(b);
        if (c !== null && d !== null) {
          var e = c.getRawLines(),
            f = d.getRawLines(),
            i = new h.DiffComputer(e, f, !0, !0);
          return g.Promise.as(i.computeDiff())
        }
        return g.Promise.as(null)
      }, a.prototype.computeDirtyDiff = function(a) {
        var b = this.resourceService.get(a),
          c = b.getProperty("original");
        if (c && b !== null) {
          var d = j.Model.splitText(c),
            e = d.lines.map(function(a) {
              return a.text
            }),
            f = b.getRawLines(),
            i = new h.DiffComputer(e, f, !1, !0);
          return g.Promise.as(i.computeDiff())
        }
        return g.Promise.as([])
      }, a.prototype.navigateValueSet = function(a, b, c) {
        var d = this.doNavigateValueSet(a, b, c, !0);
        return g.Promise.as(d && d.value && d.range ? d : null)
      }, a.prototype.doNavigateValueSet = function(a, b, c, d) {
        var e = this.resourceService.get(a),
          f = {
            range: null,
            value: null
          }, g;
        if (d) b.startColumn === b.endColumn && (b.endColumn += 1), g = e.getValueInRange(b), f.range = b;
        else {
          var h = {
            lineNumber: b.startLineNumber,
            column: b.startColumn
          }, i = e.getWordUntilPosition(h);
          g = e.getWordAtPosition(h);
          if (g.indexOf(i) !== 0) return null;
          if (g.length < b.endColumn - b.startColumn) return null;
          f.range = b, f.range.startColumn = h.column - i.length, f.range.endColumn = f.range.startColumn + g.length
        }
        var j = this.numberReplace(g, c);
        if (j !== null) f.value = j;
        else {
          var k = this.textReplace(g, c);
          if (k !== null) f.value = k;
          else if (d) return this.doNavigateValueSet(a, b, c, !1)
        }
        return f
      }, a.prototype.numberReplace = function(a, b) {
        var c = Math.pow(10, a.length - (a.lastIndexOf(".") + 1)),
          d = Number(a),
          e = parseFloat(a);
        return !isNaN(d) && !isNaN(e) && d === e ? d === 0 && !b ? null : (d = Math.floor(d * c), d += b ? c : -c,
          String(d / c)) : null
      }, a.prototype.textReplace = function(a, b) {
        return null
      }, a.prototype.valueSetsReplace = function(a, b, c) {
        var d = null;
        while (a.length > 0 && d === null) d = this.valueSetReplace(a.pop(), b, c);
        return d
      }, a.prototype.valueSetReplace = function(a, b, c) {
        var d = a.indexOf(b);
        return d >= 0 ? (d += c ? 1 : -1, d < 0 ? d = a.length - 1 : d %= a.length, a[d]) : null
      }, a.prototype.createLink = function(a, b, c, d) {
        return {
          range: {
            startLineNumber: b,
            startColumn: c + 1,
            endLineNumber: b,
            endColumn: d + 1
          },
          url: a.substring(c, d)
        }
      }, a.prototype.computeLinks = function(a) {
        var b, c, d = this.resourceService.get(a),
          e = [],
          f = [],
          h = 1,
          i = 9,
          j = 10;
        f[1] = {
          h: 2,
          H: 2
        }, f[2] = {
          t: 3,
          T: 3
        }, f[3] = {
          t: 4,
          T: 4
        }, f[4] = {
          p: 5,
          P: 5
        }, f[5] = {
          s: 6,
          S: 6,
          ":": 7
        }, f[6] = {
          ":": 7
        }, f[7] = {
          "/": 8
        }, f[8] = {
          "/": 9
        };
        var k = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-?=&#@:+%",
          l = [],
          m = 0;
        for (b = 0; b < k.length; b++) m = Math.max(m, k.charCodeAt(b));
        m = Math.max("<".charCodeAt(0), "(".charCodeAt(0), "[".charCodeAt(0), "{".charCodeAt(0));
        for (var b = 0; b <= m; b++) l[b] = String.fromCharCode(b);
        for (b = 0; b < k.length; b++) l[k.charCodeAt(b)] = null;
        l["<".charCodeAt(0)] = ">", l["(".charCodeAt(0)] = ")", l["[".charCodeAt(0)] = "]", l["{".charCodeAt(0)] =
          "}";
        var n, o, p, q, r, s, t, u, v;
        for (b = 1, c = d.getLineCount(); b <= c; b++) {
          n = d.getLineContent(b), o = 0, p = n.length, q = null, r = 0, s = h;
          while (o < p) {
            t = n.charAt(o), v = !1;
            if (s === j) {
              if (t === " " || t === "	" || t === q) e.push(this.createLink(n, b, r, o)), v = !0
            } else s === i ? t === " " || t === "	" || t === q ? v = !0 : s = j : f[s].hasOwnProperty(t) ? s = f[s][t] :
              v = !0;
            v && (s = h, r = o + 1, u = n.charCodeAt(o), u < l.length ? q = l[u] : q = t), o++
          }
          s === j && e.push(this.createLink(n, b, r, p))
        }
        return g.Promise.as(e)
      }, a.filter = i.DefaultFilter, a
    }();
  b.AbstractWorkerMode = k
})