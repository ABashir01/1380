/** @typedef {import("../types").Callback} Callback */

const distribution = require("@brown-ds/distribution");

/**
 * NOTE: This Target is slightly different from local.all.Target
 * @typdef {Object} Target
 * @property {string} service
 * @property {string} method
 */

/**
 * @param {object} config
 * @return {object}
 */
function comm(config) {
  const context = {};
  context.gid = config.gid || 'all';

  /**
   * @param {Array} message
   * @param {object} configuration
   * @param {Callback} callback
   */
  function send(message, configuration, callback) {
    callback = callback || function() { };

    results = {};

    // First, get the nodes in the group
    distribution.local.groups.get(context.gid, (e, v) => {
      if (e) {
        callback(e, null);
        return;
      }

      // Loop through the nodes and send the message
      for (const nodeID in v) {
        const node = v[nodeID];
        const remote = {node: node, service: configuration.service, method: configuration.method};

        // Send the message
        distribution.local.comm.send(message, remote, (e, v) => {
          if (e) {
            results[nodeID] = e;
          }
        });
      }
    });

    callback(null, results); 
  }

  return {send};
};

module.exports = comm;
