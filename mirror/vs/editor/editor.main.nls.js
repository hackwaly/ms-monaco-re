define("vs/editor/editor.main.nls", [], {
  vs_base_errors: ["{0}: {1}", "Permission Denied (HTTP {0})", "Permission Denied", "{0} (HTTP {1}: {2})",
    "{0} (HTTP {1})", "Unknown Connection Error ({0})",
    "An unknown connection error occurred. Either you are no longer connected to the internet or the server you are connected to is offline.",
    "{0}: {1}", "An unknown error occurred. Please consult the log for more details.",
    "An unknown error occurred. Please consult the log for more details.",
    "An unknown error occurred. Please consult the log for more details.",
    "Failed to load a required file. Either you are no longer connected to the internet or the server you are connected to is offline. Please refresh the browser to try again."
  ],
  vs_platform_configurationRegistry: ["Configuration File", "This is a configuration file for the workbench",
    "Either 'user' or 'team'. User config files take precendence", "Configuration settings for particular languages"
  ],
  vs_base_strings: ["{0}-{1}-{2} {3}:{4}:{5}", "{0}:{1}:{2}", "{0}s", "{0}m", "{0}h", "{0}d"],
  vs_base_performance_timer: ["Cannot start a new timer from a stopped one."],
  vs_editor_core_config_configuration: ["Editor configuration", "This is used to configure the editor.",
    "Controls visibility of line numbers", "Controls visibility of the glyph margin", "Controls the size of tabs",
    "Controls if the editor will insert spaces for tabs", "Controls if selections have rounded corners",
    "Controls if the editor will scroll beyond the last line",
    "Controls after how many characters the editor will wrap to the next line. Setting this to 0 turns on viewport width wrapping",
    "Controls if quick suggestions should show up or not while typing",
    "Controls the delay in ms after which quick suggestions will show up",
    "Controls if the editor should automatically close brackets after opening them",
    "Controls if the editor should automatically format the line after typing",
    "Controls if suggestions should automatically show up when typing trigger characters",
    "Controls the number of decorations that can show up at the same position in the overview ruler",
    "Controls if the cursor should be hidden in the overview ruler.", "Console configuration",
    "This is used to configure the console.", "Controls visibility of line numbers",
    "Controls if selections have rounded corners",
    "Controls after how many characters the editor will wrap to the next line. Setting this to 0 turns on viewport width wrapping",
    "Controls the delay in ms after which quick suggestions will show up",
    "Controls if the console will scroll beyond the last line",
    "Controls if the cursor should be hidden in the overview ruler."
  ],
  vs_editor_core_controller_cursor: ["Unexpected exception while executing command."],
  vs_editor_core_view_viewImpl: ["Editor content"],
  vs_base_ui_widgets_findInput: ["input", "Use regular expression", "Match whole word", "Match case"],
  vs_editor_contrib_find_findWidget: ["Find", "Find", "Previous Match (Shift+F3)", "Next Match (F3)",
    "Cancel Selection Find", "Close (Escape)", "Replace", "Replace", "Replace", "Replace All", "Toggle Replace mode"
  ],
  vs_editor_contrib_find_find: ["Replace this instance", "Replace all instances", "Find", "Find next",
    "Find previous", "Cancel selection", "Replace", "Replace this instance", "Replace all instances"
  ],
  vs_editor_contrib_format_format: ["Format code"],
  vs_editor_contrib_rename_rename: [
    "Sorry, but rename can not yet be performed on symbols that are used in multiple files.", "Rename symbol",
    "Change all occurrences"
  ],
  vs_editor_contrib_comment_comment: ["Insert line comment", "Insert block comment"],
  vs_editor_contrib_linesOperations_linesOperations: ["Delete line", "Move line down", "Move line up",
    "Copy line down", "Copy line up"
  ],
  vs_base_ui_widgets_actionbar: ["{0} ({1})", "Action Bar"],
  vs_editor_contrib_zoneWidget_peekViewWidget: ["Close"],
  vs_editor_contrib_goToDeclaration_goToDeclaration: ["References", "Peek definition", "Go to definition",
    "Go to type"
  ],
  vs_editor_contrib_gotoError_gotoError: ["Did you mean: {0}", "Go to next marker", "Go to previous marker"],
  vs_editor_contrib_inPlaceReplace_inPlaceReplace: ["Replace with previous value", "Replace with next value"],
  vs_editor_contrib_suggest_suggestWidget: ["Loading...", "No suggestions."],
  vs_editor_contrib_parameterHints_parameterHints: ["Trigger parameter hints"],
  vs_editor_contrib_suggest_suggest: ["Trigger suggest"],
  vs_editor_contrib_smartSelect_smartSelect: ["Expand select", "Shrink select"],
  vs_editor_contrib_smartSelect_jumpToBracket: ["Go to bracket"],
  vs_editor_contrib_color_colorPicker: ["Color Picker Action"],
  vs_editor_core_model_textModelWithTokens: ["The mode has failed while tokenizing the input."],
  vs_editor_contrib_referenceSearch_referenceSearchWidget: ["{0} references", "{0} reference", "no preview available",
    "References"
  ],
  vs_editor_contrib_referenceSearch_referenceSearch: ["Find all references", "Loading...", "Show references"],
  vs_editor_contrib_links_links: ["Cmd + click to follow link", "Ctrl + click to follow link"],
  vs_platform_handlerService: ["Ctrl", "Shift", "Alt", "Meta"],
  vs_editor_contrib_inEditorActions_inEditorActions: ["Open editor actions", "{0} ({1})"],
  vs_editor_contrib_toggleTabFocusMode_toggleTabFocusMode: ["Toggle use of tab key for setting focus"],
  vs_editor_contrib_contextmenu_contextmenu: [", ", "Show editor context menu"],
  vs_editor_contrib_quickOpen_quickOutline: ["Go to symbol", "symbols ({0})", "modules ({0})", "classes ({0})",
    "interfaces ({0})", "methods ({0})", "functions ({0})", "properties ({0})", "variables ({0})", "variables ({0})",
    "constructors ({0})", "calls ({0})"
  ],
  "vs_editor_contrib_quickOpen_quickOutline.contribution": ["Go to symbol"],
  vs_editor_contrib_quickOpen_gotoLine: ["Type a line number between 1 and {0} to navigate to",
    "Type a line number to navigate to", "Go to line {0}", "Go to line"
  ],
  "vs_editor_contrib_quickOpen_gotoLine.contribution": ["Go to line"],
  "vs_languages_css_css.contribution": ["CSS configuration", "This is used to configure the CSS language.",
    "Don't use width or height when using padding or border.",
    "Include all compatible vendor prefixes to reach a wider range of users.",
    "Certain properties shouldn't be used with certain display property values.",
    "Every background-image should be unique. Use a common class for e.g. sprites.",
    "Duplicate properties must appear one after the other.",
    "Rules without any properties specified should be removed.",
    "When using a vendor-prefixed gradient, make sure to use them all.",
    "Selectors should not contain IDs because these rules are too tightly coupled with the HTML.",
    "Using !important overides any cascaded rule and may lead to specificity war.",
    "Properties should be known (listed in CSS specification) or be a vendor-prefixed property.",
    "Use of outline: none or outline: 0 should be limited to :focus rules.",
    "Don't use classes or IDs with elements (a.foo or a#foo).", "Headings should not be qualified (namespaced).",
    "Selectors that look like regular expressions are slow and should be avoided.",
    "Use shorthand properties where possible.", "Checks for text indent less than -99px.",
    "Headings should be defined only once.", "The universal selector (*) is known to be slow.",
    "Unqualified attribute selectors are known to be slow.",
    "When using a vendor-prefixed property, make sure to include the standard one.",
    "You don't need to specify units when a value is 0."
  ],
  "vs_languages_javascript_javascript.contribution": ["JavaScript configuration",
    "This is used to configure the JavaScript language.", "Controls how JavaScript IntelliSense works.",
    "Always include all words from the current document.", "Complete functions with their parameter signature.",
    "Controls how JavaScript validation works.",
    "When having multiple validating settings, defines the sub-folder to which they apply.",
    "Specifies which version of ECMA-Script is used.", "Do not use typings for the DOM and browser environment.",
    "Controls various aspects of validation.", "Don't spare curly brackets.", "Empty block should have a comment.",
    "Use '!==' and '===' instead of '!=' and '=='.", "Missing semicolon.", "Don't use reserved keywords.",
    "Don't use a TypeScript specific language construct in JavaScript.",
    "Unexpected output of the 'typeof'-operator.", "Semicolon instead of block.", "Function inside loop.",
    "Function with lowercase name used as constructor.", "Looks for mistyped triple-slash references.",
    "Unused local variable.", "Unused local function.", "Function with return-statement used as constructor.",
    "Don't re-declare a variable and change its type.", "Don't use an undeclared variable.",
    "Don't use an unknown property.", "Don't use instanceof with primitive types.",
    "Only use numbers for arthimetic operations.", "Don't re-declare a variable type by an assignment."
  ],
  "vs_languages_json_json.contribution": ["JSON configuration", "Used to configure JSON settings and schemas.",
    "Associate schemas to JSON files in the current project", "A relative path to a schema in the current directory",
    "A regular expression to match against when resolving JSON files to schemas."
  ],
  "vs_languages_typescript_typescript.contribution": ["TypeScript configuration",
    "This is used to configure the TypeScript language.", "Controls how JavaScript IntelliSense works.",
    "Always include all words from the current document.", "Complete functions with their parameter signature.",
    "Allows TypeScript to use more than one web worker. Changes will only be effective after a browser refresh.",
    "Controls how TypeScript validation works.",
    "When having multiple validating settings, defines the sub-folder to which they apply.",
    "Specifies which version of ECMA-Script is used.", "Specifies the module system being used.",
    "Enfore explicit any type declarations.", "Do not use typings for the DOM and browser environment.",
    "Controls various aspects of validation.", "Don't spare curly brackets.", "Empty block should have a comment.",
    "Use '!==' and '===' instead of '!=' and '=='.", "Missing semicolon.", "Don't use reserved keywords.",
    "Don't use a TypeScript specific language construct in JavaScript.",
    "Unexpected output of the 'typeof'-operator.", "Semicolon instead of block.", "Function inside loop.",
    "Function with lowercase name used as constructor.", "Looks for mistyped triple-slash references.",
    "Unused local variable.", "Unused local function.", "Unused private member.",
    "Don't spare the return-type annotation for functions."
  ]
});