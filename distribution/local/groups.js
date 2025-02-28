// const distribution = require("@brown-ds/distribution");
const { id } = require("../util/util");
const { string } = require("yargs");

const groups = {};

groups.all = {};



groups.get = function(name, callback) {
    callback = callback || function() { };

    if (!(name in groups)) {
        callback(Error('Group not found'), null);
        return;
    }

    
    callback(null, groups[name]);
};

groups.put = function(config, group, callback) {
    callback = callback || function() { };

    let hashVal = null;

    if (typeof config === 'object') {

        if ('hash' in config) {
            hashVal = config.hash;
        }

        config = config.gid;
    } else if (typeof config === 'string') {
        config = config;
    } else {
        callback(Error('Invalid configuration - must be object or string'), null);
        return;
    }

    /* Initialize distribution object */
    global.distribution[config] = {};
    global.distribution[config].status =
        require('../all/status')({gid: config});
    global.distribution[config].comm =
        require('../all/comm')({gid: config});
    global.distribution[config].gossip =
        require('../all/gossip')({gid: config});
    global.distribution[config].groups =
        require('../all/groups')({gid: config});
    global.distribution[config].routes =
        require('../all/routes')({gid: config});
    global.distribution[config].mem =
        require('../all/mem')({gid: config, hash: hashVal});
    global.distribution[config].store =
        require('../all/store')({gid: config, hash: hashVal});

    // console.log("Distribution object keys: ", Object.keys(global.distribution));

    for (const nodeID in group) {
        if (!(nodeID in groups['all'])) {
            groups['all'][nodeID] = group[nodeID];
        }
    }
    
    groups[config] = group;
    // console.log(groups);
    callback(null, group);
};

groups.del = function(name, callback) {
    callback = callback || function() { };

    if (!(name in groups)) {
        callback(Error('Group not found'), null);
        return;
    }

    // Remove from distribution object
    // delete distribution[name];
 
    let returnVal = groups[name];
    delete groups[name];
    // console.log(groups);
    callback(null, returnVal);
};

groups.add = function(name, node, callback) {
    callback = callback || function() { };

    let nodeID = id.getSID(node);

    // Default to no-ops
    if (!(name in groups)) {
        callback(null, null);
        return;
    }

    // Add to all if not already present
    if (!(nodeID in groups['all'])) {
        groups['all'][nodeID] = node;
    }
    
    groups[name][nodeID] = node;
    // console.log(groups);
    callback(null, node);
};

groups.rem = function(name, node, callback) {
    callback = callback || function() { };

    // Default to no-ops
    if (!(name in groups) || !(node in groups[name])) {
        callback(null, null);
        return;
    }

    // Remove from all if present
    // if (node in groups['all']) {
    //     delete groups['all'][node];
    // }
      
    delete groups[name][node];
    // console.log(groups);
    callback(null, node);
};

module.exports = groups;
