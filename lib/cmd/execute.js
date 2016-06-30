/**
 * Created by Ben on 6/24/2016.
 */

var exec = require('child-process-promise').exec
var notify = require('../notify')

module.exports = function (cmd) {
  notify.info('Executing command "' + cmd + '"')

  return exec(cmd, {cwd: __dirname})
}
