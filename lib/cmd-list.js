/**
 * @author bmcclure
 *
 * A deployment module for pushing to a remote repository with Git
 */

var async = require('async');
var execute = require('./execute');

module.exports = function (commands, callback) {
  console.log('Executing "' + commands.length + '" commands');

  var cmdList = [];

  commands.forEach(function (command) {
    cmdList.push(async.apply(execute, command));
  });

  async.series(cmdList, function (err, results) {
    if (err) {
      console.error('There was an error executing the commands', err);
    } else {
      console.log('All commands were executed successfully')
    }

    callback(err, results);
  });
};
