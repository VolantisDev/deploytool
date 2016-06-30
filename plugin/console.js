/**
 * Created by Ben on 6/30/2016.
 */

module.exports = {
  notify: function (message, type) {
    if (type == 'error') {
      console.error(message)
    } else {
      console.log(message)
    }
  }
}
