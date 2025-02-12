/** @typedef {import("../types").Callback} Callback */

const routes = {}

routes["status"] = require("./status");
routes["routes"] = require("./routes");
routes["comm"] = require("./comm");


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

    routes[configuration] = service;
    callback(null, configuration);
}

/**
 * @param {string} configuration
 * @param {Callback} callback
 */
function rem(configuration, callback) {
    callback = callback || function() { };

    delete routes[configuration];
    callback(null, configuration);
};

module.exports = {get, put, rem};
