// const distribution = require("@brown-ds/distribution");

const status = function(config) {
  const context = {};
  context.gid = config.gid || 'all';

  return {
    get: (configuration, callback) => {
      callback = callback || function() { };

      let remote = {service: 'status', method: 'get'};
      let message = [configuration];

      

        const groupName = context.gid;
        global.distribution[groupName].comm.send(message, remote, (e, v) => {

          if (configuration === 'counts' || configuration === 'heapUsed' || configuration === 'heapTotal') {
            let sum = 0;
            for (const nodeID in v) {
              if (v[nodeID].error) {
                callback(v[nodeID].error, null);
                return;
              }
              sum += v[nodeID].value;
            }
            callback(e, sum);
            return;
          }

          callback(e, v);
          return;
        });
      
    },

    spawn: (configuration, callback) => {
      callback = callback || function() { };

      // Spawns a new node and adds it to the group for all nodes
      global.distribution.local.status.spawn(configuration, (e, v) => {

      // Add the new node to the group
      let remote = {service: 'groups', method: 'add'};
      let groupName = context.gid;
      let message = [groupName, configuration]

      global.distribution[groupName].comm.send(message, remote, (e2, v2) => {
      

        for (const nodeID in v2) {
          if (v2[nodeID].error) {
            callback(v2[nodeID].error, null);
            return;
          }
        }

        callback(null, true);
        return;
      });
    });
    },

    stop: (callback) => {
      callback = callback || function() { };

      let remote = {service: 'status', method: 'stop'};
      let message = ['stop'];

      let groupName = context.gid;
      global.distribution[groupName].comm.send (message, remote, (e, v) => {
        if (e) {
          callback(e, null);
          return;
        }

        for (const nodeID in v) {
          if (v[nodeID].error) {
            callback(v[nodeID].error, null);
            return;
          }
        }

        global.distribution.local.status.stop((e, v) => {
          if (e) {
            callback(e, null);
            return;
          }
        });

        callback(null, true);
        return

        
      });
    },
  };
};

module.exports = status;
