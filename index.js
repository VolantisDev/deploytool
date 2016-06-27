/**
 * @author bmcclure
 */

var use = require('use-plugin')({
  "module": module,
  "prefix": 'deploytool',
  "builtin": './plugins'
});

var plugins = {};

module.exports = {};

function usePlugin(pluginName) {
  if (plugins[pluginName]) {
    return plugins[pluginName];
  }

  var pluginDescription = use(pluginName);

  pluginDescription.init();

  plugins[pluginName] = pluginDescription;

  return pluginDescription;
}

// Set up exposed utility functions
module.exports.use = usePlugin;
module.exports.cmd = require('./lib/cmd');
module.exports.cmdList = require('./lib/cmd-list');
module.exports.deployed = require('./lib/deployed');
module.exports.cmdList = require('./lib/environment');
module.exports.firstCommit = require('./lib/first-commit');

// Load core plugins
var deployPlugin = usePlugin("deploy");
module.exports.deploy = require(deployPlugin.requirepath).deploy;
