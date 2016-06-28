/**
 * Created by Ben on 6/27/2016.
 */

var deploytool = require('../index');
var Deployed = require('./deployed');

module.exports = function (environment, commit, callback) {
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

    require(plugin.requirepath).deploy(environment, commit, function (error, result) {
      if (!error && commit) {
        var deployed = new Deployed(environment.config);

        deployed.write(function (err, ref) {
          if (err) {
            console.error('Could not write .Deployed file');
          }

          callback(error, result);
        });
      } else {
        callback(error, result);
      }
    });
  });
};