/**
 * @author bmcclure
 */

var use = require('use-plugin')({
  "module": module,
  "prefix": 'deploytool',
  "builtin": './plugins'
});

var plugins = {};

module.exports.use = function (pluginName) {
  if (plugins[pluginName]) {
    return plugins[pluginName];
  }

  var pluginDescription = use(pluginName);

  pluginDescription.init();

  plugins[pluginName] = pluginDescription;

  return pluginDescription;
};

// Set up exposed utility functions
module.exports.cmd = require('./lib/cmd');
module.exports.deployed = require('./lib/deployed');
module.exports.cmdList = require('./lib/environment');
module.exports.git = require('./lib/git');

// This file contains a circular reference to deploytool to access deploytool.use, so load it last
module.exports.deploy = require('./lib/deploy');
