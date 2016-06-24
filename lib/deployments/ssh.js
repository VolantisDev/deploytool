/**
 * @author bmcclure
 *
 * A deployment module for logging into a server via SSH and deploying code via Git
 */

var ssh_key = require('./../ssh-key');
var sequest = require('sequest');

module.exports = function (environment, commit) {
  var defaults = {
    type: 'ssh',
    remoteBranch: environment.branch,
    remote: 'origin',
    host: '',
    remoteDir: '',
    ssh: {
      privateKey: ssh_key(environment)
    }
  };

  if (environment.type !== 'ssh') {
    return new Error('Loaded environment is of type ' + environment.type + ', not ssh');
  }

  if (!environment.host) {
    return new Error('remoteDir must be specified');
  }

  if (!environment.remoteDir) {
    return new Error('remoteDir must be specified');
  }

  var config = environment.getConfig(defaults);

  if (!config.ssh.privateKey) {
    config.ssh.splice('privateKey', 1);
  }

  var checkoutCommand = commit || '-B ' + config.branch + ' ' + config.remote + '/' + config.branch;

  var commands = [
    'git -C "' + config.dir + '" fetch',
    'git -C "' + config.dir + '" checkout ' + checkoutCommand
  ];

  console.log('Starting ssh deployment for environment ' + config.name);

  var seq = sequest(config.host, config.ssh);

  seq.pipe(process.stdout); // Send output to console

  for (var cmd in commands) {
    if (commands.hasOwnProperty(cmd)) {
      console.log('Running command "' + cmd + ' on ' + config.host);

      seq.write(cmd);
    }
  }

  seq.end();

  console.log('Finished ssh deployment for environment ' + config.name);
};
