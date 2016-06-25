/**
 * @author bmcclure
 *
 * A deployment module for logging into a server via SSH and deploying code via Git
 */

var deploytoolEnvironment = require('./environment');

module.exports = function (environment, commit, callback) {
  environment = deploytoolEnvironment.initialize(environment, {
    type: '',
    branch: ''
  });

  var config = environment.config;

  if (!config.type) {
    callback(new Error('Environment type is unknown'));

    return;
  }

  if (!config.branch) {
    callback(new Error('Branch is not defined'));

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
