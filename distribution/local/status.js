const log = require('../util/log');

const status = {};

global.moreStatus = {
  sid: global.distribution.util.id.getSID(global.nodeConfig),
  nid: global.distribution.util.id.getNID(global.nodeConfig),
  counts: 0,
};

status.get = function(configuration, callback) {
  callback = callback || function() { };
  // TODO: implement remaining local status items
  if (configuration === 'nid') {
    callback(null, global.moreStatus.nid);
    return;
  }

  if (configuration === 'sid') {
    callback(null, global.moreStatus.sid);
    return;
  }

  if (configuration === 'ip') {
    callback(null, global.nodeConfig.ip);
    return;
  }

  if (configuration === 'port') {
    callback(null, global.nodeConfig.port);
    return;
  }

  if (configuration === 'counts') {
    callback(null, global.moreStatus.counts);
    return;
  }

  if (configuration === 'heapTotal') {
    callback(null, process.memoryUsage().heapTotal);
    return;
  }
  if (configuration === 'heapUsed') {
    callback(null, process.memoryUsage().heapUsed);
    return;
  }
  callback(Error('Status key not found'), null);
};


status.spawn = function(configuration, callback) {
};

status.stop = function(callback) {
};

module.exports = status;
