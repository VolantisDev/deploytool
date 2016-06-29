/**
 * Created by Ben on 6/27/2016.
 */
var deploytool = require('../');

module.exports = {
  deploy: function (environment, commit, callback) {
    environment = deploytool.environment.init(environment, {
      type: 'git-push',
      remote: 'origin'
    });

    var config = environment.config;

    var ref = config.branch;

    if (commit) {
      ref = commit + ':' + ref;
    }

    var commands = [
      'git fetch',
      'git push ' + config.remote + ' ' + ref
    ];

    deploytool.cmd.cmdList(commands, callback);
  }
};
