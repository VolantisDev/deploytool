/**
 * Created by Ben on 6/27/2016.
 */

var deploytool = require('../')

module.exports = {
  requires: {
    source: "git"
  },
  deploy: function (environment) {
    environment = deploytool.environment.init(environment, {
      type: 'git-push'
    })

    var ref = environment.config.branch

    if (environment.config.commit) {
      ref = environment.config.commit + ':' + ref
    }

    var commands = [
      'git fetch',
      'git push ' + environment.config.remote + ' ' + ref
    ]

    return deploytool.cmd.cmdList(commands)
  }
}
