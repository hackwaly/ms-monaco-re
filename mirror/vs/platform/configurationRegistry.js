define("vs/platform/configurationRegistry", ["require", "exports", "vs/nls!vs/editor/editor.main",
  "vs/platform/platform"
], function(e, t, n, i) {
  t.Extensions = {
    Configuration: "base.contributions.configuration"
  };
  var o = function() {
    function e() {
      this.configurationContributors = [];

      this.masterConfiguration = {
        id: "configurationFile",
        title: n.localize("vs_platform_configurationRegistry", 0),
        description: n.localize("vs_platform_configurationRegistry", 1),
        type: "object",
        properties: {
          type: {
            type: "string",
            description: n.localize("vs_platform_configurationRegistry", 2)
          },
          languages: {
            type: "object",
            description: n.localize("vs_platform_configurationRegistry", 3),
            properties: {}
          }
        }
      };
    }
    e.prototype.registerConfiguration = function(e) {
      this.configurationContributors.push(e);

      this.registerConfigurationNode(this.masterConfiguration, e.id.split("/"), e.id);
    };

    e.prototype.registerConfigurationNode = function(e, t, n) {
      if (1 === t.length) e.properties[t[0]] = {
        type: "ref",
        $ref: n
      };
      else {
        var i = t.shift();
        e.properties[i] || (e.properties[i] = {
          type: "object",
          properties: {}
        });

        this.registerConfigurationNode(e.properties[i], t, n);
      }
    };

    e.prototype.getConfigurations = function() {
      return this.configurationContributors.slice(0);
    };

    e.prototype.getConfigurationSchemas = function() {
      var e = this.getConfigurations();
      e.push(this.masterConfiguration);

      return e;
    };

    return e;
  }();
  i.Registry.add(t.Extensions.Configuration, new o);
});