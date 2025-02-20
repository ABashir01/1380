const groups = function(config) {
  const context = {};
  context.gid = config.gid || 'all';

  return {
    put: (config, group, callback) => {
      callback = callback || function() { };

      let remote = {service: 'groups', method: 'put'};
      let groupName = context.gid;
      let message = [config, group];

      global.distribution[groupName].comm.send(message, remote, (e, v) => {
        

        callback(e, v);
        return;
      });
    },

    del: (name, callback) => {
      callback = callback || function() { };

      let remote = {service: 'groups', method: 'del'};
      let groupName = context.gid;
      let message = [name];

      global.distribution[groupName].comm.send(message, remote, (e, v) => {
        

        callback(e, v);
        return;
      });
    },

    get: (name, callback) => {
      callback = callback || function() { };

      let remote = {service: 'groups', method: 'get'};
      let groupName = context.gid;
      let message = [name];

      global.distribution[groupName].comm.send(message, remote, (e, v) => {
        

        callback(e, v);
        return;
      });
    },

    add: (name, node, callback) => {
      callback = callback || function() { };

      let remote = {service: 'groups', method: 'add'};
      let groupName = context.gid;
      let message = [name, node];

      global.distribution[groupName].comm.send(message, remote, (e, v) => {
       

        callback(e, v);
        return;
      });
    },

    rem: (name, node, callback) => {
      callback = callback || function() { };

      let remote = {service: 'groups', method: 'rem'};
      let groupName = context.gid;
      let message = [name, node];

      global.distribution[groupName].comm.send(message, remote, (e, v) => {
        

        callback(e, v);
        return;
      });
    },
  };
};

module.exports = groups;
