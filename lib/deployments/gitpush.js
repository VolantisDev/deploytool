/**
 * @author bmcclure
 *
 * A deployment module for pushing to a remote repository with Git
 */

var exec = require('child_process').exec;
var async = require('async');

function execute(cmd, callback) {
  console.log('Executing command "' + cmd + '"');

  exec(cmd, { cwd: __dirname }, function (error, stdout, stderr) {
    console.log(stdout);

    if (error != null) {
      console.error('There was an error', error);

      callback(error, stdout, stderr);
      return;
    }

    console.log('Finished executing "' + cmd + '"');

    callback(null, stdout, stderr);
  });
}

module.exports = function (environment, commit) {
  var defaults = {
    type: 'gitpush',
    remote: 'origin'
  };

  if (environment.type !== 'gitpush') {
    return new Error('Loaded environment is of type ' + environment.type + ', not gitpush');
  }

  var config = environment.getConfig(defaults);
  var ref = config.branch;

  if (commit) {
    ref = commit + ':' + ref;
  }

  Console.log('Deploying environment "' + config.name + '" via git push');

  async.series([
    async.apply(execute, 'git fetch'),
    async.apply(execute, 'git push ' + config.remote + ' ' + ref)
  ], function (err, results) {
    console.log('Command output:');
    console.log(results);

    if (err) {
      console.error('There was an error', err);
      console.log('Deployment of environment ' + config.name + ' was unsuccessful.');
    } else {
      console.log('Completed deployment of environment ' + config.name);
    }
  });
};
