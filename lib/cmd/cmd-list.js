/**
 * @author bmcclure
 *
 * A deployment module for pushing to a remote repository with Git
 */

var Promise = require('bluebird')
var execute = require('./execute')
var notify = require('../notify')

module.exports = function (commands) {
  return new Promise(function (resolve, reject) {
    notify.info('Executing "' + commands.length + '" commands')

    var results = []

    Promise.each(commands, function (command, index) {
      return execute(command)
        .then(function (result) {
          results[index] = result
        })
    }).then(function () {
      resolve(results)
    }).catch(function (error) {
      reject(error)
    })
  })
}
