/**
 * Created by Ben on 6/27/2016.
 */

var Promise = require('bluebird')
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
     */
  currentVersion: function (config) {
    return new Promise(function (resolve, reject) {
      config = objectAssign(defaults, config)

      if (config.commit) {
        resolve(config.commit)
      } else {
        reject(new Error('Could not find current commit'))
      }
    })
  },

  /**
   * @param {{branch:string}} config
     */
  firstVersion: function (config) {
    config = objectAssign(defaults, config)

    return deploytool.cmd.execute('git rev-list --max-parents=0 ' + config.branch)
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
