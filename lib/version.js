/**
 * Created by BMcClure on 6/27/2016.
 */

var Promise = require('bluebird');
var fs = Promise.promisifyAll(require('fs'));
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
  var self = this

  return pluginManager.load(self.config.versioning, 'versioning')
    .then(function (plugin) {
      return plugin.currentVersion(self.config)
    })
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


Version.prototype.readDeployed = function () {
  var self = this

  return new Promise(function (resolve, reject) {
    if (self.config.deployedString) {
      resolve(self.config.deployedString)
    } else {
      var ref = ''

      var readStream = self.getReadStream()

      if (isStream(readStream)) {
        ref = readStream.toString()
      }

      if (ref) {
        resolve(ref)
      }

      if (self.config.versioning) {
        var config = self.config

        pluginManager.load(config.versioning, 'versioning').then(function (plugin) {
          plugin.firstVersion(config).then(function (ref) {
            resolve(ref)
          })
        }).catch(function (error) {
          reject(error)
        })
      }

      reject(new Error('Could not determine deployed version'))
    }
  })
}

/**
 *
 * @param version
 * @returns {*}
 * @private
 */
Version.prototype._writeDeployed = function (version) {
  var self = this

  return new Promise(function (resolve, reject) {
    var writeStream = self.getWriteStream()

    if (isStream(writeStream)) {
      writeStream.write(version)
      writeStream.end()

      resolve(version)
    } else {
      reject(new Error('Could not write new version information'))
    }
  })
}

Version.prototype.writeDeployed = function () {
  var self = this

  if (self.config.deployedString) {
    return self._writeDeployed(self.config.deployedString)
  }

  return new Promise(function (resolve, reject) {
    pluginManager.load(self.config.versioning, 'versioning').then(function (plugin) {
      plugin.currentVersion(self.config).then(function (version) {
        self._writeDeployed(version).then(function (version) {
          resolve(version)
        })
      })
    }).catch(reject)
  })
}
