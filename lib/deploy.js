/**
 * Created by Ben on 6/27/2016.
 */

var Promise = require('bluebird')
var environment = require('./environment')
var Version = require('./version')
var pluginManager = require('./plugin-manager')

module.exports = function (environment, commit, callback) {
  environment = environment.init(environment, {
    "type": '',
    "branch": ''
  })

  environment.validate(['type', 'branch'], function (error) {
    if (error) {
      callback(error)

      return
    }

    pluginManager.load(environment.config.type, 'deployment', function (error, plugin) {
      if (error) {
        console.error('Deployment type ' + environment.config.type + ' could not be loaded')
        callback(error)
        return
      }

      console.log('Starting deployment to environment ' + environment.config.name)

      plugin.deploy(environment, function (error, result) {
        if (!error) {
          var version = new Version(environment.config)

          version.writeDeployed(function (err, ref) {
            if (err) {
              console.error('Could not save deployed version number')
            }

            console.log('Successfully deployed version ' + ref + ' to environment ' + environment.config.name)

            callback(error, result)
          })
        } else {
          console.error('Error deploying to environment ' + environment.config.name)
          callback(error, result)
        }
      })
    })
  })
}
