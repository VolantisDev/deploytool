/**
 * Created by Ben on 6/27/2016.
 */

var deploytool = require('../')
var objectAssign = require('object-assign')
var File = require('vinyl')

var defaults = {
  deployString: '',
  branch: 'master',
  remote: 'origin',
  commit: '',
  directory: __dirname
}

module.exports = {
  /**
   * @param {{commit:string}} config
   * @param callback
     */
  currentVersion: function (config, callback) {
    config = objectAssign(defaults, config)

    var error = config.commit ? null : new Error('Could not find commit')

    callback(error, config.commit)
  },

  /**
   * @param {{branch:string}} config
   * @param callback
     */
  firstVersion: function (config, callback) {
    config = objectAssign(defaults, config)

    deploytool.cmd.exec('git rev-list --max-parents=0 ' + config.branch, callback)
  },

  /**
   * @param {{directory:string}} config
   * @returns {File}
     */
  getVinyl: function (config) {
    config = objectAssign(defaults, config)
    return new File({ cwd: config.directory })
  }
}
