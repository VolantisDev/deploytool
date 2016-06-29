/**
 * Created by Ben on 6/27/2016.
 */

var deploytool = require('../');
var objectAssign = require('object-assign');
var File = require('vinyl');

var defaults = { deployString: '', branch: 'master', commit: '' };

module.exports = {
  currentVersion: function (config, callback) {
    config = objectAssign(defaults, config);

    var error = config.commit ? null : new Error('Could not find commit');

    callback(error, config.commit);
  },
  firstVersion: function (config, callback) {
    config = objectAssign(defaults, config);

    deploytool.cmd.exec('git rev-list --max-parents=0 ' + config.branch, callback);
  },
  getVinyl: function (config) {
    return new File({ cwd: __dirname });
  }
};
