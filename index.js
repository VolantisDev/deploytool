/**
 * @author bmcclure
 */

var pluginManager = require('./lib/plugin-manager')

pluginManager.scan()

module.exports = {
  plugins: pluginManager,
  cmd: require('./lib/cmd'),
  deploy: require('./lib/deploy'),
  environment: require('./lib/environment'),
  error: require('./lib/error'),
  source: require('./lib/source'),
  version: require('./lib/version')
}
