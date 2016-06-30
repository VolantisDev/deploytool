/**
 * Created by Ben on 6/24/2016.
 */

var Promise = require('bluebird')
var exec = require('child-process-promise').exec
var notify = require('../notify')

module.exports = function (cmd) {
  return new Promise(function (resolve, reject) {
    notify.info('Executing command "' + cmd + '"')

    exec(cmd, {cwd: __dirname})
      .then(resolve)
      .catch(reject)
  })
}
