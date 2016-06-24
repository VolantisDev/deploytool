/**
 * @author bmcclure
 */

var objectAssign = require('object-assign');

module.exports = DeployTool;

function DeployTool(config) {
    this.config = objectAssign({
        parallel: 3,
        maxConnections: config.parallel || 5,
        log: null,
        timeOffset: 0,
        idleTimeout: 100,
        password: config.password || config.pass,
        reload: false
    }, config);

    // connection pool
    this.queue = [];
    this.connectionCount = 0;
    this.idle = [];
    this.idleTimer = null;
}

DeployTool.create = function (config) {
    return new DeployTool(config);

};

objectAssign(
    DeployTool.prototype,
    require('./lib/deployments/ftp'),
    require('./lib/deployments/ssh')
);
