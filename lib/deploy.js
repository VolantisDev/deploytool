/**
 * Created by Ben on 6/27/2016.
 */

var Promise = require('bluebird')
var environment = require('./environment')
var Version = require('./version')
var pluginManager = require('./plugin-manager')
var notify = require('./notify')

module.exports = function (environment) {
  return new Promise(function (resolve, reject) {
    environment = environment.init(environment, {
      "type": '',
      "branch": ''
    })

    environment
      .validate(['type', 'branch'])
      .then(function () {
        return pluginManager.load(environment.config.type, 'deployment')
      })
      .then(function (plugin) {
        notify.info('Starting deployment to environment ' + environment.config.name)

        return plugin.deploy(environment)
      })
      .then(function (result) {
        var version = new Version(environment.config)

        return version.writeDeployed().then(function (ref) {
          console.log('Successfully deployed version ' + ref + ' to environment ' + environment.config.name)

          resolve(result)
        })
      })
      .catch(function (error) {
        notify.error('Deployment type ' + environment.config.type + ' could not be loaded')

        reject(error);
      })
  })
}
