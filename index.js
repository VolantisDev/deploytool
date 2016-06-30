/**
 * @author bmcclure
 */

var debug = process.env.DEBUG || false
var verbose = process.env.VERBOSE || false
var pluginManager = require('./lib/plugin-manager')

var Notify = require('./lib/notify')
Notify.setDefaults(process.env.NOTIFY_PLUGIN.split(',') || ['console'])

module.exports = {
  debug: debug,
  verbose: verbose,
  plugins: pluginManager,
  cmd: require('./lib/cmd'),
  deploy: require('./lib/deploy'),
  environment: require('./lib/environment'),
  notify: new Notify(),
  source: require('./lib/source'),
  version: require('./lib/version')
}

pluginManager.scan()
