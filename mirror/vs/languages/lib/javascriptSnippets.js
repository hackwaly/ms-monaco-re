define('vs/languages/lib/javascriptSnippets', [
  'require',
  'exports',
  'vs/nls!vs/languages/typescript/typescriptWorker2'
], function(e, t, n) {
  t.snippets = [{
    type: 'snippet',
    label: 'define',
    codeSnippet: [
      'define([',
      '\t\'require\',',
      '\t\'{{require}}\'',
      '], function(require, {{factory}}) {',
      '\t\'use strict\';',
      '\t{{}}',
      '});'
    ].join('\n'),
    documentationLabel: n.localize('vs_languages_lib_javascriptSnippets', 0)
  }, {
    type: 'snippet',
    label: 'for',
    codeSnippet: [
      'for (var {{index}} = 0; {{index}} < {{array}}.length; {{index}}++) {',
      '\tvar {{element}} = {{array}}[{{index}}];',
      '\t{{}}',
      '}'
    ].join('\n'),
    documentationLabel: n.localize('vs_languages_lib_javascriptSnippets', 1)
  }, {
    type: 'snippet',
    label: 'foreach',
    codeSnippet: [
      '{{array}}.forEach(function({{element}}) {',
      '\t{{}}',
      '}, this);'
    ].join('\n'),
    documentationLabel: n.localize('vs_languages_lib_javascriptSnippets', 2)
  }, {
    type: 'snippet',
    label: 'forin',
    codeSnippet: [
      'for (var {{key}} in {{object}}) {',
      '\tif ({{object}}.hasOwnProperty({{key}})) {',
      '\t\tvar {{element}} = {{object}}[{{key}}];',
      '\t\t{{}}',
      '\t}',
      '}'
    ].join('\n'),
    documentationLabel: n.localize('vs_languages_lib_javascriptSnippets', 3)
  }, {
    type: 'snippet',
    label: 'function',
    codeSnippet: [
      'function {{name}}({{params}}) {',
      '\t{{}}',
      '}'
    ].join('\n'),
    documentationLabel: n.localize('vs_languages_lib_javascriptSnippets', 4)
  }, {
    type: 'snippet',
    label: 'if',
    codeSnippet: [
      'if ({{condition}}) {',
      '\t{{}}',
      '}'
    ].join('\n'),
    documentationLabel: n.localize('vs_languages_lib_javascriptSnippets', 5)
  }, {
    type: 'snippet',
    label: 'ifelse',
    codeSnippet: [
      'if ({{condition}}) {',
      '\t{{}}',
      '} else {',
      '\t',
      '}'
    ].join('\n'),
    documentationLabel: n.localize('vs_languages_lib_javascriptSnippets', 6)
  }, {
    type: 'snippet',
    label: 'new',
    codeSnippet: ['var {{name}} = new {{type}}({{arguments}});{{}}'].join('\n'),
    documentationLabel: n.localize('vs_languages_lib_javascriptSnippets', 7)
  }, {
    type: 'snippet',
    label: 'switch',
    codeSnippet: [
      'switch ({{key}}) {',
      '\tcase {{value}}:',
      '\t\t{{}}',
      '\t\tbreak;',
      '',
      '\tdefault:',
      '\t\tbreak;',
      '}'
    ].join('\n'),
    documentationLabel: n.localize('vs_languages_lib_javascriptSnippets', 8)
  }, {
    type: 'snippet',
    label: 'while',
    codeSnippet: [
      'while ({{condition}}) {',
      '\t{{}}',
      '}'
    ].join('\n'),
    documentationLabel: n.localize('vs_languages_lib_javascriptSnippets', 9)
  }, {
    type: 'snippet',
    label: 'dowhile',
    codeSnippet: [
      'do {',
      '\t{{}}',
      '} while ({{condition}});'
    ].join('\n'),
    documentationLabel: n.localize('vs_languages_lib_javascriptSnippets', 10)
  }, {
    type: 'snippet',
    label: 'trycatch',
    codeSnippet: [
      'try {',
      '\t{{}}',
      '} catch ({{error}}) {',
      '\t',
      '}'
    ].join('\n'),
    documentationLabel: n.localize('vs_languages_lib_javascriptSnippets', 11)
  }, {
    type: 'snippet',
    label: 'log',
    codeSnippet: ['console.log({{message}});{{}}'].join('\n'),
    documentationLabel: n.localize('vs_languages_lib_javascriptSnippets', 12)
  }, {
    type: 'snippet',
    label: 'settimeout',
    codeSnippet: [
      'setTimeout(function() {',
      '\t{{}}',
      '}, {{timeout}});'
    ].join('\n'),
    documentationLabel: n.localize('vs_languages_lib_javascriptSnippets', 13)
  }, {
    type: 'snippet',
    label: 'reference',
    codeSnippet: [
      '/// <reference path="{{path}}.ts" />',
      '{{}}'
    ].join('\n'),
    documentationLabel: n.localize('vs_languages_lib_javascriptSnippets', 14)
  }];
})