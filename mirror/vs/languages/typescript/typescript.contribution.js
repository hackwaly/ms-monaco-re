define(["require", "exports", 'vs/nls', 'vs/platform/platform', 'vs/editor/modes/modesExtensions',
  'vs/editor/editorExtensions', './editor/workerStatusReporter', 'vs/platform/configurationRegistry', 'vs/base/env'
], function(require, exports, __nls__, __platform__, __modesExtensions__, __editorExtensions__,
  __workerStatusReporter__, __ConfigurationRegistry__, __env__) {
  /*---------------------------------------------------------
   * Copyright (C) Microsoft Corporation. All rights reserved.
   *--------------------------------------------------------*/
  'use strict';

  var nls = __nls__;
  var platform = __platform__;
  var modesExtensions = __modesExtensions__;
  var editorExtensions = __editorExtensions__;
  var workerStatusReporter = __workerStatusReporter__;
  var ConfigurationRegistry = __ConfigurationRegistry__;
  var env = __env__;

  var modesRegistry = platform.Registry.as(modesExtensions.Extensions.EditorModes);
  modesRegistry.registerMode(['text/typescript'], new platform.DeferredDescriptor(
    'vs/languages/typescript/typescript', 'TypeScriptMode'));

  if (env.enableNLSWarnings) {
    modesRegistry.registerWorkerParticipant('vs.languages.typescript', new platform.DeferredDescriptor(
      'vs/languages/typescript/participants/nlsParticipant', 'WorkerParticipant'));
  }

  if (env.enableEditorLanguageServiceIndicator) {
    (platform.Registry.as(editorExtensions.Extensions.EditorContributions)).registerEditorContribution(new platform.BaseDescriptor(
      workerStatusReporter.StatusPresenter));
  }

  if (false) {
    modesRegistry.registerWorkerParticipant('vs.languages.typescript', new platform.DeferredDescriptor(
      'vs/languages/typescript/participants/symbolUsageParticipant', 'WorkerParticipant'));
  }

  var configurationRegistry = platform.Registry.as(ConfigurationRegistry.Extensions.Configuration);
  configurationRegistry.registerConfiguration({
    'path': [modesExtensions.LANGUAGE_CONFIGURATION, "vs.languages.typescript"],
    'configuration': {
      'id': 'typeScriptConfiguration',
      'type': 'object',
      'title': nls.localize('tsConfigurationTitle', "TypeScript configuration"),
      'description': nls.localize('tsConfigurationDescription',
        "This is used to configure the TypeScript language."),
      'properties': {
        'useCodeSnippetsOnMethodSuggest': {
          'type': 'boolean',
          'default': 'true',
          'description': nls.localize('useCodeSnippetsOnMethodSuggest',
            "Controls if completing a method will automatically insert parameters")
        },
        'showTypeScriptWarnings': {
          'type': 'boolean',
          'default': 'true',
          'description': nls.localize('showTypeScriptWarnings',
            "Controls if TypeScript warnings should be displayed")
        },
        'completeFunctionsAsInvocation': {
          'type': 'boolean',
          'description': nls.localize('completeFunctionsAsInvocation',
            "Controls if completions of functions should automatically add parentheses ")
        },
        'useResidentFlagAggressively': {
          'type': 'boolean',
          'default': 'true'
        }
      }
    }
  });
});