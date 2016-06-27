/**
 * Created by Ben on 6/27/2016.
 */

var deploytool = require('../');

module.exports = {
  "name": "deploy",
  "tag": "deployment",
  "init": function () {

  },
  "deploy": function (environment, commit, callback) {
    environment = deploytool.environment.init(environment, {
      "type": '',
      "branch": ''
    });

    environment.validate(['type', 'branch'], function (error) {
      if (error) {
        callback(error);

        return;
      }

      var plugin = deploytool.use(environment.config.type);

      if (plugin.err) {
        callback(err);

        return;
      }

      if (plugin.tag != 'deployment') {
        callback(new Error('Loaded plugin is not of type "deployment"'));

        return;
      }

      require(plugin.requirepath).deploy(environment, commit, callback);
    });
  }
};
