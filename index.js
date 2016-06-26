/**
 * @author bmcclure
 */

var use = require('use-plugin')({
  module: module,
  prefix: 'deploytool',
  builtin: 'lib'
});

var deploytoolEnvironment = require('./lib/environment');

function usePlugin(pluginName) {
  var pluginDescription = use(pluginName);

  pluginDescription.init();

  return pluginDescription;
}

function deploy(environment, commit, callback) {
  environment = deploytoolEnvironment.init(environment, {
    type: '',
    branch: ''
  });

  environment.validate(['type', 'branch'], function (error) {
    if (error) {
      callback(error);

      return;
    }

    var plugin = usePlugin(environment.config.type);

    require(plugin.requirepath).deploy(environment, commit, callback);
  });
}

module.exports = {
  cmd: require('./lib/cmd'),
  cmdList: require('./lib/cmd-list'),
  deploy: deploy,
  environment: deploytoolEnvironment,
  firstCommit: require('./lib/first-commit'),
  previousCommit: require('./lib/previous-commit'),
  use: usePlugin
};
