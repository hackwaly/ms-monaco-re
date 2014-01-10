define(["require", "exports", 'vs/nls'], function(require, exports, __nls__) {
  /*---------------------------------------------------------
   * Copyright (C) Microsoft Corporation. All rights reserved.
   *--------------------------------------------------------*/
  'use strict';

  var nls = __nls__;



  exports.snippets = [{
    type: 'snippet',
    label: 'foreach =>',
    codeSnippet: [
      '{{array}}.forEach(({{element}}:{{type}}) => {',
      '\t{{}}',
      '});'
    ].join('\n'),
    documentationLabel: nls.localize('foreach.snippet', "For-Each Loop using =>")
  }, {
    type: 'snippet',
    label: 'jsdoc comment',
    codeSnippet: [
      '/**',
      ' * {{}}',
      ' */'
    ].join('\n'),
    documentationLabel: nls.localize('jsdoc.snippet', "jsdoc snippet")
  }, {
    type: 'snippet',
    label: 'ctor',
    codeSnippet: [
      '/**',
      ' *',
      ' */',
      'constructor() {',
      '\tsuper();',
      '\t{{}}',
      '}'
    ].join('\n'),
    documentationLabel: nls.localize('constructor.snippet', "Constructor")
  }, {
    type: 'snippet',
    label: 'class',
    codeSnippet: [
      '/**',
      ' * {{name}}',
      ' */',
      'class {{name}} {',
      '\tconstructor({{parameters}}) {',
      '\t\t{{}}',
      '\t}',
      '}'
    ].join('\n'),
    documentationLabel: nls.localize('class.snippet', "Class Definition")
  }, {
    type: 'snippet',
    label: 'public method',
    codeSnippet: [
      '/**',
      ' * {{name}}',
      ' */',
      'public {{name}}() {',
      '\t{{}}',
      '}'
    ].join('\n'),
    documentationLabel: nls.localize('publicmethod.snippet', "Public Method Definition")
  }, {
    type: 'snippet',
    label: 'private method',
    codeSnippet: [
      'private {{name}}() {',
      '\t{{}}',
      '}'
    ].join('\n'),
    documentationLabel: nls.localize('privatemethod.snippet', "Private Method Definition")
  }];
});