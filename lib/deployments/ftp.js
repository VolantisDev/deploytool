/**
 * @author bmcclure
 *
 * A deployment module for uploading files via (S)FTP. Optionally, you can track the last uploaded commit and only
 *  upload the files which have been added, modified, or removed.
 */

module.exports = function (environment, commit) {
  var defaults = {
    type: 'ftp'
  };

  if (environment.type !== 'ftp') {
    return new Error('Loaded environment is of type ' + environment.type + ', not ftp');
  }

  var config = environment.getConfig(defaults);

  // Deploy it here
};
