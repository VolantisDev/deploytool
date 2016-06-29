/**
 * Created by BMcClure on 6/27/2016.
 */

var fs = require('fs')
var isStream = require('is-stream')
var objectAssign = require('object-assign')
var pluginManager = require('./plugin-manager')

module.exports = Version

/**
 *
 * @param {{deployedFile:string,deployedString:string,branch:string,commit:string}} config
 * @param readStream
 * @param writeStream
 * @property {{deployedFile:string,deployedString:string,branch:string,commit:string}} config
 * @constructor
 */
function Version(config, readStream, writeStream) {
  this['config'] = objectAssign({
    deployedString: "_DEF",
    deployedFile: __dirname + '/.deployed',
    versioning: 'git'
  }, config)

  this['readStream'] = readStream || null
  this['writeStream'] = writeStream || null

  if (this.config.deployedString == "_DEF") {
    this.config.deployedString = this.resolveCurrentVersion(config)
  }
}

/**
 *
 */
Version.prototype.resolveCurrentVersion = function () {
  // TODO: Use a promise to return the current version from a plugin
}

/**
 *
 * @returns {*|null}
 */
Version.prototype.getReadStream = function () {
  var stream = this.readStream

  if (!isStream(stream) && this.config.deployedFile) {
    stream = fs.createReadStream(this.config.deployedFile)
  }

  return stream
}

/**
 *
 * @returns {*|null}
 */
Version.prototype.getWriteStream = function () {
  var stream = this.writeStream

  if (!isStream(stream)) {
    if (this.config.deployedFile) {
      stream = fs.createWriteStream(this.config.deployedFile, {flags: 'w'})
    }
  }

  return stream
}


/**
 * @param callback
 */
Version.prototype.readDeployed = function (callback) {
  var ref = ''
  var err = null

  if (this.config.deployedString) {
    callback(err, this.config.deployedString)
    return
  }

  var readStream = this.getReadStream()

  if (isStream(readStream)) {
    ref = readStream.toString()
  }

  if (ref) {
    callback(err, ref)
    return
  }

  if (this.config.versioning) {
    var config = this.config

    pluginManager.load(config.versioning, 'versioning', function (error, plugin) {
      if (error) {
        console.error('Versioning method ' + config.versioning + ' could not be loaded')
        callback(error)
        return
      }

      plugin.firstVersion(config, callback)
    })
  }

  callback(new Error('Could not determine deployed version'), null)
}

/**
 *
 * @param version
 * @returns {*}
 * @private
 */
Version.prototype._writeDeployed = function (version) {
  var writeStream = this.getWriteStream()
  writeStream.write(version)
  writeStream.end()

  return version
}

/**
 *
 * @param callback
 */
Version.prototype.writeDeployed = function (callback) {
  var error = null

  if (this.config.deployedString) {
    this._writeDeployed(this.config.deployedString)

    callback(error, this.config.deployedString)
    return
  }

  var config = this.config
  var self = this

  pluginManager.load(config.versioning, 'versioning', function (error, plugin) {
    if (error) {
      console.error('Versioning method ' + config.versioning + ' could not be loaded')
      callback(error)
      return;
    }

    plugin.currentVersion(config, function (error, version) {
      if (error) {
        console.error('Versioning method ' + config.versioning + ' could not determine current version')
      } else {
        self._writeDeployed(version)
      }

      callback(error, version)
    })
  })
}
