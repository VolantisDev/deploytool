/**
 * Created by Ben on 6/24/2016.
 */

module.exports = function (config, callback) {
  var commit = '';

  exec('git rev-list --max-parents=0 ' + config.branch, { cwd: __dirname}, function (error, stdout) {
    if (!error) {
      commit = stdout;
    }

    callback((commit) ? true : null, commit);
  });
};
