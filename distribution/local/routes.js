/** @typedef {import("../types").Callback} Callback */

const routes = {}

routes["status"] = require("./status");
routes["routes"] = require("./routes");
routes["comm"] = require("./comm");

// TODO: It should probably error if we ttry to overwrite one of the built-in routes (i.e. status, routes, comm)
/**
 * @param {string} configuration
 * @param {Callback} callback
 * @return {void}
 */
function get(configuration, callback) {
    callback = callback || function() { };

    if (routes[configuration]) {
        callback(null, routes[configuration]);
    } else {
        callback(Error('Status key not found'), null);
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
