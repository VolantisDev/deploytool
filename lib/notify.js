/**
 * Created by Ben on 6/27/2016.
 */

var Promise = require('bluebird')
var pluginManager = require('./plugin-manager')

module.exports = DeploytoolNotify

var notifyPlugins = ['console']

/**
 * @property plugins
 * @param plugins
 * @constructor
 */
function DeploytoolNotify(plugins) {
  if (this instanceof DeploytoolNotify) {
    this.plugins = plugins || notifyPlugins
  } else {
    DeploytoolNotify.setDefaults(plugins)
  }
}

DeploytoolNotify.prototype.send = function (message, type) {
  return pluginManager
    .loadAll(this.plugins, 'notify')
    .then(function (plugins) {
      return Promise.each(plugins, function (plugin) {
        plugin.notify(message, type || 'info')
      })
    })
}

DeploytoolNotify.prototype.error = function (error) {
  this.send(error, 'error')
}

DeploytoolNotify.prototype.info = function (message) {
  this.send(message, 'info')
}

DeploytoolNotify.setDefaults = function (plugins) {
  notifyPlugins = plugins
}

DeploytoolNotify.global = new DeploytoolNotify();

DeploytoolNotify.info = function (message) {
  return this.global.info(message)
}

DeploytoolNotify.error = function (error) {
  return this.global.error(error)
}
