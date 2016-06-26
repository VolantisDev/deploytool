/**
 * Created by Ben on 6/25/2016.
 */

var use = require('use-plugin')({ prefix: 'deploytool', module: module.parent });

module.exports = function (pluginName) {
  var pluginDescription = use(pluginName);

  pluginDescription.init();
};
