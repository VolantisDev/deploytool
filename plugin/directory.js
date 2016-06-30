/**
 * Created by Ben on 6/28/2016.
 */

var objectAssign = require('object-assign')
var File = require('vinyl')

var defaults = { directory: __dirname }

module.exports = {
  /**
   * @param {{directory:string}} config
   * @returns {File}
     */
  getVinyl: function (config) {
    config = objectAssign(defaults, config)

    return new File({ cwd: config.directory })
  }
}
