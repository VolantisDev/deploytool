/**
 * @author bmcclure
 *
 * A deployment module for logging into a server via SSH and deploying code via Git
 */

var ssh_key = require('./ssh-key');
var ssh = require('./deployments/ssh');

module.exports = function (environment, commit) {
  var defaults = {
    type: 'ssh'
  };

  if (!environment.type) {
    return new Error('Environment type is unknown');
  }

  var deployment = require('./' + environment.type);

  if (!deployment) {
    return new Error('Deployment type ' + environment.type + ' was not found')
  }

  return deployment.deploy(environment, commit);
};
