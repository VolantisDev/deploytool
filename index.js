/**
 * @author bmcclure
 */

var debug = process.env.DEBUG || false // Change to false for production
var verbose = process.env.VERBOSE || false
var pluginManager = require('./lib/plugin-manager')

module.exports = {
  debug: debug,
  verbose: verbose,
  plugins: pluginManager,
  cmd: require('./lib/cmd'),
  deploy: require('./lib/deploy'),
  environment: require('./lib/environment'),
  notify: require('./lib/notify'),
  source: require('./lib/source'),
  version: require('./lib/version')
}

pluginManager.scan()