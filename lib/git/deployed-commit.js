/**
 * Created by Ben on 6/27/2016.
 */

var firstCommit = require('./first-commit');
var Deployed = require('../deployed');

module.exports = function (commit, config, readStream, writeStream, callback) {
  config.deployedString = config.deployedString || commit;

  if (config.deployedString) {
    callback(null, new Deployed(config, readStream, writeStream));
  } else {
    firstCommit(config, function (error, ref) {
      if (!error) {
        config.deployedString = ref;
      }

      callback(error, new Deployed(config, readStream, writeStream));
    });
  }
};
