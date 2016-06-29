/**
 * Created by Ben on 6/24/2016.
 */

var exec = require('child_process').exec

module.exports = function (cmd, callback) {
  console.log('Executing command "' + cmd + '"')

  exec(cmd, {cwd: __dirname}, function (error, stdout, stderr) {
    console.log(stdout)

    if (error) {
      console.error('There was an error executing "' + cmd + '"', error)
    }

    callback(error, stdout, stderr)
  })
}
