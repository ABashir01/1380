/** @typedef {import("../types").Callback} Callback */

// const distribution = require("@brown-ds/distribution");
const path = require('path');

const routes = {}

routes["status"] = require(path.join(__dirname, 'status'));
routes["comm"] = require(path.join(__dirname, 'comm'));
routes["groups"] = require(path.join(__dirname, 'groups'));
routes["mem"] = require(path.join(__dirname, 'mem'));
routes["store"] = require(path.join(__dirname, 'store'));


// TODO: It should probably error if we ttry to overwrite one of the built-in routes (i.e. status, routes, comm)
/**
 * @param {string} configuration
 * @param {Callback} callback
 * @return {void}
 */
function get(configuration, callback) {
    callback = callback || function() { };

    // console.log("THESE ARE THE ROUTES: ", routes);
    // console.log("THIS IS THE CONFIGURATION: ", configuration.toString());
    // console.log("THIS IS THE TYPE OF CONFIGURATION: ", typeof configuration);

    if (typeof configuration === 'object') {
        let service = configuration.service;
        let gid = configuration.gid || 'local';

        if (!(configuration.service in routes)) {
            const rpc = global.toLocal[configuration.service];
            if (rpc) {
                 callback(null, { call: rpc });
             } else {
                 callback(new Error(`Service ${configuration.service} not found!`));
              }
          }

        if (!service) {
            callback(Error('Invalid configuration'), null);
            return;
        }

        // console.log("THIS IS THE SERVICE: ", service);
        // console.log("THIS IS THE GID: ", gid);
        // console.log("THIS IS THE GLOBAL DISTRIBUTION: ", global.distribution);

        // Local case
        if (gid === 'local') {
            if (!(service in routes)) {
                const rpc = global.toLocal[service];
                if (rpc) {
                     callback(null, { call: rpc });
                     return;
                 } else {
                     callback(new Error(`Service ${service} not found!`));
                     return;
                  }
              }
    
            if (routes[service]) {
                callback(null, routes[service]);
            } else {
                callback(Error(`Status key ${service} not found`), null);
            }
        }



        if (global.distribution[gid][service]) {
            callback(null, global.distribution[gid][service]);
        }
        else {
            callback(Error('Service key not found'), null);
        }

    } else {

        // console.log("Inshallah, we ballin");

        if (!(configuration in routes)) {
            const rpc = global.toLocal[configuration];
            if (rpc) {
                 callback(null, { call: rpc });
                 return;
             } else {
                 callback(new Error(`Service ${configuration} not found!`));
                 return;
              }
          }

        if (routes[configuration]) {
            callback(null, routes[configuration]);
        } else {
            callback(Error('Status key not found'), null);
        }
    }
    
}

/**
 * @param {object} service
 * @param {string} configuration
 * @param {Callback} callback
 * @return {void}
 */
function put(service, configuration, callback) {
    callback = callback || function() { };

    if (!configuration || !service) {
        callback(Error('Invalid configuration or service'), null);
        return;
    }

    if (routes[configuration]) {
        callback(Error('Route already exists'), null);
        return;
    }

    routes[configuration] = service;
    // console.log("Can you feel it:", routes);
    callback(null, configuration);
}

/**
 * @param {string} configuration
 * @param {Callback} callback
 */
function rem(configuration, callback) {
    callback = callback || function() { };

    if (!routes[configuration]) {
        callback(Error('Route does not exist'), null);
        return;
    }

    delete routes[configuration];
    callback(null, configuration);
};

module.exports = {get, put, rem};
routes["routes"] = require(path.join(__dirname, 'routes'));
