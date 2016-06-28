/**
 * Created by Ben on 6/24/2016.
 */

var cmd = require('./../cmd/execute');

module.exports = function (config, callback) {
  var commit = '';

  cmd('git rev-list --max-parents=0 ' + config.branch, callback);
};
