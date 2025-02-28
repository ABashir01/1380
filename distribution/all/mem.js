
function mem(config) {
  const context = {};
  context.gid = config.gid || 'all';
  context.hash = config.hash || global.distribution.util.id.naiveHash;

  /* For the distributed mem service, the configuration will
          always be a string */
  return {
    get: (configuration, callback) => {
      callback = callback || function() { };

      try {
        let groupName = context.gid;

        global.distribution.local.groups.get(groupName, (e, v) => {

          if (e) {
            callback(e, null);
            return;
          }

          if (configuration === null) {
            // TODO: FILL THIS IN
          }

                    

          let hashResult = context.hash(global.distribution.util.id.getID(configuration), Object.keys(v));
          
          console.log("configurationGet: ", configuration);
          console.log("hashResultGet: ", hashResult);
          console.log("Hope Waits Get: ", v);

          let remote = {node: v[hashResult], service: 'mem', method: 'get'};
          let configurationObject = {key: configuration, gid: groupName};
          let message = [configurationObject];

          // if (configuration === null) {
          //   global.distribution[groupName].comm.send(message, remote, (e2, v2) => {
          //       callback(e2, v2);
          //       return;
          //     }
          //   );
          // }

          global.distribution.local.comm.send(message, remote, (e2, v2) => {
            callback(e2, v2);
          });
        });
      } catch (e) {
        callback(e, null);
      }
    },

    put: (state, configuration, callback) => {
      callback = callback || function() { };

      try {
        let groupName = context.gid;

        global.distribution.local.groups.get(groupName, (e, v) => {
          if (e) {
            callback(e, null);
            return;
          }

          let configToHash = configuration;
          if (configuration === null) {
            configToHash = global.distribution.util.id.getID(state);
          }

          let hashResult = context.hash(global.distribution.util.id.getID(configToHash), Object.keys(v));

          console.log("statePut: ", state);
          console.log("configurationPut: ", configuration);
          console.log("hashResultPut: ", hashResult);
          console.log("Hope waits put: ", v);

          // Get the node to send the message to from the NID returned in hashResult



          let remote = {node: v[hashResult], service: 'mem', method: 'put'};
          let configurationObject = {key: configuration, gid: groupName};
          let message = [state, configurationObject];

          global.distribution.local.comm.send(message, remote, (e2, v2) => {
            callback(e2, v2);
          });
        });
      } catch (e) {
        callback(e, null);
      }
    },

    del: (configuration, callback) => {
      callback = callback || function() { };

      try {
        let groupName = context.gid;

        global.distribution.local.groups.get(groupName, (e, v) => {
          if (e) {
            callback(e, null);
            return;
          }

          let hashResult = context.hash(global.distribution.util.id.getID(configuration), Object.keys(v));

          let remote = {node: v[hashResult], service: 'mem', method: 'del'};
          let configurationObject = {key: configuration, gid: groupName};
          let message = [configurationObject];

          global.distribution.local.comm.send(message, remote, (e2, v2) => {
            callback(e2, v2);
          });
        });
      } catch (e) {
        callback(e, null);
      }
    },

    reconf: (configuration, callback) => {
    },
  };
};

module.exports = mem;
