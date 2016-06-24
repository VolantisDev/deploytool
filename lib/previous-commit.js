/**
 * @author bmcclure
 *
 * A deployment module for pushing to a remote repository with Git
 */

var async = require('async');
var firstCommit = require('./first-commit');

module.exports = function (config, callback) {
  console.log('Finding previous commit SHA');

  var lastRef = config.deployedCommit;

  if (!lastRef) {
    async.series([
      async.apply(fs.readFile, config.deployedFile, 'utf8'),
      async.apply(firstCommit, config)
    ], function (error, lastRef) {
      if (error === true) {
        error = null;
      }

      callback(error, lastRef);
    });
  } else {
    callback(null, lastRef);
  }
};
