/** @typedef {import("../types").Callback} Callback */

// const distribution = require("@brown-ds/distribution");

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

    // console.log("HELLO YELLO")

    error = {};
    results = {};


    // First, get the nodes in the group
    distribution.local.groups.get(context.gid, (e, v) => {
      if (e) {
        console.log("All Comm Error: ", e);
        callback(e, null);
        return;
      }

      // console.log("THIS DA RESULT: ", v);

      let pending = Object.keys(v).length;
      // Loop through the nodes and send the message
      for (const nodeID in v) {
        const node = v[nodeID];
        const remote = {node: node, service: configuration.service, method: configuration.method};

        // Send the message
        distribution.local.comm.send(message, remote, (e2, v2) => {
          if (e2) {
            error[nodeID] = e2;
          }
          else {
            results[nodeID] = v2;
          }
          pending--;
          console.log("Comm Results: ", error, results);

          if (pending === 0) {
            console.log("This is v: ", v);
            console.log("This is e: ", e);
            console.log("This is v2:", v2);
            console.log("This is e2:", e2);
            console.log("All Comm Results: ", results);
            console.log("All Comm Error: ", error);
            callback(error, results);
          }
        });
      }

      if (pending === 0) {
        // console.log("All Comm Results: ", results);
        console.log("THE OTHER ONE HAPPENED: ", results);
        callback(error, results);
      }
      
    });

    
  }

  return {send};
};

module.exports = comm;
