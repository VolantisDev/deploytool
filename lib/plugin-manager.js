/**
 * Created by Ben on 6/28/2016.
 */

var path = require('path');
var Plugins = require('js-plugins');
var async = require("async");
var pluginManager = new Plugins();

var host = {
  debug: false
};

var extensionTypes = ['source', 'versioning', 'deployment'];

module.exports = {
  scan: function () {
    pluginManager.scanSubdirs([path.join(__dirname, '../plugin')]);
    pluginManager.scan();
  },
  load: function (name, extensionType, callback) {
    module.exports.connectSingle(extensionType, false, function (error, plugins, names) {
      var idx = names.indexOf(name);
      var name = (idx >= 0) ? names[idx] : null;
      var err = (idx >= 0) ? new Error('Could not load plugin ' + name) : error;

      callback(err, name);
    });
  },
  connect: function (extensionType, multi, callback) {
    if (!extensionType) {
      extensionType = extensionTypes;
    }

    if (extensionType.constructor !== Array) {
      return module.exports.connectSingle(extensionType, multi);
    }

    var types = [];

    var results = {};

    extensionType.forEach(function (type) {
      types.push(function (callback) {
        module.exports.connectSingle(type, multi, function (error, result) {
          if (!error) {
            results[type] = result;
          }

          callback(error, result);
        });
      })
    });

    async.each(extensionType, types, function (error) {
      callback(error, results);
    });
  },
  connectSingle: function (extensionType, multi, callback) {
    if (extensionType.constructor === Array) {
      module.exports.connect(extensionType, multi, callback);

      return;
    }

    pluginManager.connect(host, 'deploytool:' + extensionType, { multi: (multi) }, function (error, plugins, pluginNames) {
      callback(error, plugins, pluginNames);
    });
  },
  register: function (extensionType, name) {
    pluginManager.register('deploytool.' + extensionType, name, pluginFactory);
  }
};
