/**
 * @bmcclure
 *
 * An environment is a managed configuration set defining how a deployment should work in a given scenario
 */

// Private
var Promise = require('bluebird')
var objectAssign = require('object-assign')
var Config = require('./config')

// Public
module.exports = DeploytoolEnvironment

/**
 *
 * @param id
 * @param config
 * @param defaults
 * @constructor
 */
function DeploytoolEnvironment(id, config, defaults) {
  this.config = config
    ? objectAssign({id: id, name: id}, defaults || {}, config)
    : DeploytoolEnvironment.load(id).config
}

DeploytoolEnvironment.prototype.applyDefaults = function (defaults) {
  this.config = objectAssign(defaults, this.config)

  return this.config
}

DeploytoolEnvironment.prototype.validate = function (required) {
  return new Promise(function (resolve, reject) {
    var missing = []

    Promise
      .each(required, function (key) {
        if (!this.config[key]) {
          missing.push(key);
        }
      })
      .then(function () {
        if (missing) {
          reject('The following environment key(s) are required but not set: ' + missing.join(', '))
        } else {
          resolve()
        }
      })
  })
}

DeploytoolEnvironment.init = function (idOrEnv, defaults) {
  var environment = idOrEnv

  if (typeof environment === 'string') {
    environment = DeploytoolEnvironment.load(environment)
  }

  if (defaults) {
    environment.applyDefaults(defaults)
  }

  return environment
}

DeploytoolEnvironment.load = function (id, options) {
  options = objectAssign({
    defaults: {},
    configPlugin: null
  }, options)

  var config = new Config(options);

  return new DeploytoolEnvironment(id, config.loadConfig(), options.setDefaults)
}
