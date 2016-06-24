/**
 * @author bmcclure
 *
 * A deployment module for logging into a server via SSH and deploying code via Git
 */

var deploytoolEnvironment = require('./environment');

module.exports = function (environment, commit, callback) {
  if (typeof environment === 'string') {
    environment = deploytoolEnvironment.load(environment);
  }

  environment.applyDefaults({
    type: ''
  });

  var config = environment.config;

  if (!config.type) {
    callback(new Error('Environment type is unknown'));

    return;
  }

  var module = 'deploytool-' + config.type;

  try {
    require.resolve(module);
  } catch (e) {
    callback(new Error('Deployment module deploytool-' + module + ' not found'));

    return;
  }

  var deployment = require(module);

  return deployment.deploy(environment, commit, callback);
};
