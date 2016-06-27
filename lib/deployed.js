/**
 * Created by BMcClure on 6/27/2016.
 */

var fs = require('fs');
var isStream = require('is-stream');
var firstCommit = require('./first-commit');
var objectAssign = require('object-assign');

module.exports = Deployed;

function Deployed(config, readStream, writeStream) {
  this['config'] = objectAssign({
    deployedCommit: '',
    deployedFile: __dirname + '/.deployed'
  }, config);

  this['readStream'] = readStream || null;
  this['writeStream'] = writeStream || null;
}

Deployed.prototype.getReadStream = function () {
  var stream = this.readStream;

  if (!isStream(stream)) {
    if (this.config.deployedFile) {
      stream = fs.createReadStream(this.config.deployedFile);
    }
  }

  return stream;
};

Deployed.prototype.getWriteStream = function () {
  var stream = this.writeStream;

  if (!isStream(stream)) {
    if (this.config.deployedFile) {
      stream = fs.createWriteStream(this.config.deployedFile, {flags: 'w'});
    }
  }
};

Deployed.prototype.read = function (callback) {
  var ref = '';

  if (this.config.deployedCommit) {
    ref = this.config.deployedCommit;
  } else {
    var readStream = this.getReadStream();

    if (isStream(readStream)) {
      ref = this.getReadStream().toString();
    }
  }

  if (ref) {
    callback(null, ref);
  } else {
    firstCommit(this.config, callback);
  }
};

Deployed.prototype.write = function (callback) {
  var error = null;

  if (this.config.deployedCommit) {
    var writeStream = this.getWriteStream();

    writeStream.write(this.config.deployedCommit);
    writeStream.end();
  } else {
    error = new Error('Could not determine deployed commit to write');
  }

  callback(error, this.config.deployedCOmmit);
};
