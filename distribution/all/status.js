const distribution = require("@brown-ds/distribution");

const status = function(config) {
  const context = {};
  context.gid = config.gid || 'all';

  return {
    get: (configuration, callback) => {
      callback = callback || function() { };

      if (configuration === 'nid') {
        distribution.gid.comm.send()
      }
    },

    spawn: (configuration, callback) => {
    },

    stop: (callback) => {
    },
  };
};

module.exports = status;
