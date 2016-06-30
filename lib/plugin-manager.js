/**
 * Created by Ben on 6/28/2016.
 */

var Promise = require('bluebird')
var path = require('path')
var Plugins = require('js-plugins')

Promise.promisifyAll(Plugins);
var pluginManager = new Plugins()

var host = require('../')
var extensionTypes = ['source', 'versioning', 'deployment', 'config', 'notify']

module.exports = {
  scan: function () {
    pluginManager.scanSubdirs([path.join(__dirname, '../plugin')])
    pluginManager.scan()
  },
  loadAll: function (names, extensionType) {
    return new Promise(function (resolve, reject) {
      module.exports
        .connectSingle(extensionType, false)
        .then(function (plugins, pluginNames) {
          var results = {};

          if (names) {
            names.forEach(function (name) {
              var idx = pluginNames.indexOf(name)

              if (idx >= 0) {
                results[name] = plugins[idx]
              }
            });
          } else {
            results = plugins
          }

          resolve(results)
        })
      })
  },
  load: function (name, extensionType) {
    return new Promise(function (resolve, reject) {
      module.exports.connectSingle(extensionType, false).then(function (plugins, names) {
        var idx = names.indexOf(name)

        if (idx >= 0) {
          resolve(plugins[idx])
        } else {
          reject(new Error('Could not load plugin ' + name))
        }
      })
    })
  },
  connect: function (extensionType, multi) {
    if (extensionType.constructor !== Array) {
      return module.exports.connectSingle(extensionType, multi)
    }

    return new Promise(function (resolve, reject) {
      extensionType = extensionType || extensionTypes

      var results = {}

      Promise
        .each(extensionType, function (type) {
          return module.exports.connectSingle(type, multi)
            .then(function (result) {
              results[type] = result;
            })
        })
        .then(function () {
          resolve(results)
        })
        .catch(function (error) {
          reject(error)
        })
    })
  },
  connectSingle: function (extensionType, multi) {
    if (extensionType.constructor === Array) {
      return module.exports.connect(extensionType, multi)
    }

    //noinspection JSUnresolvedFunction
    return pluginManager.connectAsync(host, 'deploytool:' + extensionType, { multi: (multi) })
  }
}
