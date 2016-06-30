/**
 * Created by Ben on 6/29/2016.
 */

/**
 * Created by Ben on 6/28/2016.
 */

var Promise = require('bluebird')
var objectAssign = require('object-assign')
var pluginManager = require('./plugin-manager')

module.exports = DeploytoolConfig

/**
 * @param config
 * @property config
 * @constructor
 */
function DeploytoolConfig(config) {
  this.config = config
}

DeploytoolConfig.prototype.loadConfig = function (configPlugin) {
  var self = this

  pluginManager.loadAll(configPlugin, 'config')
    .then(function (plugins) {
      var loadedConfig = {}

      Promise.each(plugins, function (plugin) {
        loadedConfig = objectAssign(loadedConfig, plugin.loadConfig(self.config))
      }).then(function () {
        return loadedConfig
      })
    })
}
