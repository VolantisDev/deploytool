/**
 * @bmcclure
 *
 * An environment is a managed configuration set defining how a deployment should work in a given scenario
 */

var objectAssign = require('object-assign');
var yaml_config = require('node-yaml-config');

module.exports = DeployToolEnvironment;

function DeployToolEnvironment(id, config) {
  var defaults = { branch: 'master', remote: 'origin', name: id };

  this.id = id;
  this.config = objectAssign(defaults, config);
}

DeployToolEnvironment.initialize = function (idOrEnv, defaults) {
  var environment = idOrEnv;

  if (typeof environment === 'string') {
    environment = DeployToolEnvironment.load(environment);
  }

  if (defaults) {
    environment.applyDefaults(defaults);
  }

  return environment;
};

DeployToolEnvironment.load = function(id, configFile, defaults, configDir) {
  configDir = configDir || __dirname;
  configFile = configFile || '.deploytool.yml';

  var path = configDir + '/' + configFile;
  var config = yaml_config.load(path);

  if (!config) {
    return new Error("Environment configuration could not be loaded from " + path);
  }

  return new DeployToolEnvironment(id, config, defaults);
};

DeployToolEnvironment.create = function(id, config, defaults) {
  return new DeployToolEnvironment(id, config, defaults);
};

DeployToolEnvironment.applyDefaults = function(defaults) {
  this.config = objectAssign(defaults, this.config);
};
