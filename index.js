/**
 * @author bmcclure
 */

module.exports = {
  cmdList: require('./lib/cmd-list'),
  deploy: require('./lib/deploy'),
  environment: require('./lib/environment'),
  execute: require('./lib/execute'),
  firstCommit: require('./lib/first-commit'),
  previousCommit: require('./lib/previous-commit')
};
