/**
 * Created by Ben on 6/28/2016.
 */

var Promise = require('bluebird')
var objectAssign = require('object-assign')
var pluginManager = require('./plugin-manager')
var notify = require('./notify')

var defaults = {
  source: "directory",
  directory: __dirname
}

module.exports = DeploytoolSource

/**
 * @param config
 * @property config
 * @constructor
 */
function DeploytoolSource(config) {
  this.config = objectAssign(defaults, config)
}

DeploytoolSource.prototype.getVinyl = function () {
  var self = this

  return pluginManager.load(self.config.source, 'source')
    .then(function (plugin) {
      return plugin.getVinyl(self.config)
    })
}
