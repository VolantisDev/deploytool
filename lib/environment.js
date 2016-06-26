/**
 * @bmcclure
 *
 * An environment is a managed configuration set defining how a deployment should work in a given scenario
 */

// Private
var objectAssign = require('object-assign');
var yaml_config = require('node-yaml-config');

// Public
module.exports = DeploytoolEnvironment;

function DeploytoolEnvironment(id, config, defaults) {
  defaults = objectAssign({
    branch: 'master',
    remote: 'origin',
    name: id
  }, defaults || {});

  this.id = id;
  this.config = objectAssign(defaults, config);
}

DeploytoolEnvironment.prototype.applyDefaults = function (defaults) {
  this.config = objectAssign(defaults, this.config);

  return env.config;
};

DeploytoolEnvironment.prototype.validate = function (required, callback) {
  var error = null;

  required.forEach(function (key) {
    if (!this.config[key]) {
      error = new Error('Environment key ' + key + ' is required but not set');
    }
  }, this);

  callback(error, !error);
};

DeploytoolEnvironment.init = function (idOrEnv, defaults) {
  var environment = idOrEnv;

  if (typeof environment === 'string') {
    environment = DeploytoolEnvironment.load(environment);
  }

  if (defaults) {
    environment.applyDefaults(defaults);
  }

  return environment;
};

DeploytoolEnvironment.load = function (id, options) {
  options = objectAssign({
    configFile: '.deploytool.yml',
    configDir: __dirname,
    defaults: {}
  }, options);

  var path = options.configDir + '/' + options.configFile;
  var config = yaml_config.load(path);

  if (!config) {
    return new Error("Environment configuration could not be loaded from " + path);
  }

  return new DeploytoolEnvironment(id, config, options.defaults);
};
