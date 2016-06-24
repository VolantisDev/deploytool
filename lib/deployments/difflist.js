/**
 * @author bmcclure
 *
 * A base deployment method that simply returns an array of files that have changes since a given previous commit
 */

module.exports = function (environment, commit) {
  var defaults = {
    type: 'difflist',
    deployedCommit: '',
    deployedFile: __dirname + '/.deployed'
  };

  var config = environment.getConfig(defaults);


};
