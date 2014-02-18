define(["require", "exports", "vs/nls", "vs/platform/platform", "vs/platform/configurationRegistry",
  "vs/editor/modes/modesExtensions"
], function(a, b, c, d, e, f) {
  var g = c;

  var h = d;

  var i = e;

  var j = f;

  var k = h.Registry.as(j.Extensions.EditorModes);
  k.registerMode(["text/javascript"], new h.DeferredDescriptor("vs/languages/javascript/javascript", "JSVSMode"));
  var l = h.Registry.as(i.Extensions.Configuration);
  l.registerConfiguration({
    path: [j.LANGUAGE_CONFIGURATION, "vs.languages.javascript"],
    configuration: {
      id: "jsConfiguration",
      type: "object",
      title: g.localize("jsConfigurationTitle", "JavaScript configuration"),
      description: g.localize("jsConfigurationDescription", "This is used to configure the JavaScript language."),
      properties: {
        predef: {
          type: "array",
          description: g.localize("predef", "additional predefined symbols"),
          items: {
            type: "string"
          }
        },
        asi: {
          type: "boolean",
          "default": "true",
          description: g.localize("asi", "if automatic semicolon insertion should be tolerated")
        },
        lastsemic: {
          type: "boolean",
          description: g.localize("lastsemic",
            "if semicolons may be ommitted for the trailing statements inside of a one-line blocks.")
        },
        bitwise: {
          type: "boolean",
          "default": "true",
          description: g.localize("bitwise", "if bitwise operators should not be allowed")
        },
        browser: {
          type: "boolean",
          "default": "true",
          description: g.localize("browser", "if the standard browser globals should be predefined")
        },
        debug: {
          type: "boolean",
          "default": "true",
          description: g.localize("debug", "if debugger statements should be allowed")
        },
        devel: {
          type: "boolean",
          "default": "true",
          description: g.localize("devel", "if logging globals should be predefined (console, // alert, etc.)")
        },
        eqeqeq: {
          type: "boolean",
          description: g.localize("eqeqeq", "if === should be required")
        },
        es5: {
          type: "boolean",
          "default": "true",
          description: g.localize("es5", "if ES5 syntax should be allowed")
        },
        forin: {
          type: "boolean",
          "default": "true",
          description: g.localize("forin", "if for in statements must filter")
        },
        globalstrict: {
          type: "boolean",
          "default": "true",
          description: g.localize("globalstrict", "if global  should be allowed (also // enables 'strict')")
        },
        jquery: {
          type: "boolean",
          "default": "true",
          description: g.localize("jquery", "if jQuery globals should be predefined")
        },
        latedef: {
          type: "boolean",
          description: g.localize("latedef", "if the use before definition should not be tolerated")
        },
        newcap: {
          type: "boolean",
          "default": "true",
          description: g.localize("newcap", "if constructor names must be capitalized")
        },
        noarg: {
          type: "boolean",
          "default": "true",
          description: g.localize("noarg", "if arguments.caller and arguments.callee should be  disallowed")
        },
        node: {
          type: "boolean",
          "default": "true",
          description: g.localize("node", "if the Node.js environment globals should be predefined")
        },
        noempty: {
          type: "boolean",
          "default": "true",
          description: g.localize("noempty", "if empty blocks should be disallowed")
        },
        nonew: {
          type: "boolean",
          "default": "true",
          description: g.localize("nonew", "if using `new` for side-effects should be disallowed")
        },
        nonstandard: {
          type: "boolean",
          "default": "true",
          description: g.localize("nonstandard",
            "if non-standard (but widely adopted) globals should be predefined")
        },
        proto: {
          type: "boolean",
          "default": "true",
          description: g.localize("proto", "if the `__proto__` property should be disallowed")
        },
        undef: {
          type: "boolean",
          "default": "true",
          description: g.localize("undef", "if variables should be declared before used")
        },
        scripturl: {
          type: "boolean",
          "default": "true",
          description: g.localize("scripturl", "if script-targeted URLs should be tolerated")
        },
        strict: {
          type: "boolean",
          description: g.localize("strict", "require the  pragma")
        },
        sub: {
          type: "boolean",
          "default": "true",
          description: g.localize("sub", "if all forms of subscript notation are tolerated")
        },
        supernew: {
          type: "boolean",
          "default": "true",
          description: g.localize("supernew", "if `new function () { ... };` and `new Object; should be tolerated")
        },
        laxcomma: {
          type: "boolean",
          "default": "true",
          description: g.localize("laxcomma", "This option suppresses warnings about comma-first coding style")
        },
        smarttabs: {
          type: "boolean",
          "default": "true",
          description: g.localize("smarttabs", "Tolerate mixed spaces and tabs when used for alignment")
        },
        validthis: {
          type: "boolean",
          "default": "true",
          description: g.localize("validthis", "if 'this' inside a non-constructor function is valid")
        }
      }
    }
  });
});