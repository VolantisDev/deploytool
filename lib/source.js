/**
 * Created by Ben on 6/28/2016.
 */

var objectAssign = require('object-assign')
var pluginManager = require('./plugin-manager')

module.exports = DeploytoolSource

var defaults = { source: "directory", directory: __dirname }

function DeploytoolSource(config) {
  this.config = objectAssign(defaults, config)
}

DeploytoolSource.prototype.getVinyl = function (callback) {
  var self = this

  pluginManager.load(self.config.source, 'source', function (error, plugin) {
    if (error) {
      console.error('Deployment source ' + self.config.source + ' could not be loaded')
      callback(error)
      return
    }

    var file = plugin.getVinyl(self.config)

    error = (!file) ? new Error('Could not get Vinyl object from source ' + self.config.source) : null

    callback(error, file)
  })
}
