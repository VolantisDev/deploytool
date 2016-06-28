/**
 * Created by Ben on 6/27/2016.
 */

var cmdList = require('../cmd/cmd-list');
var objectAssign = require('object-assign');

module.exports = function (config, commit, callback) {
  config = objectAssign({ remote: 'origin' }, config);
  
  var ref = config.branch;

  if (commit) {
    ref = commit + ':' + ref;
  }

  var commands = [
    'git fetch',
    'git push ' + config.remote + ' ' + ref
  ];

  cmdList(commands, callback);
};
