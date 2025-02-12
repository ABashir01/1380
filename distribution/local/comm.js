/** @typedef {import("../types").Callback} Callback */
/** @typedef {import("../types").Node} Node */

const http = require('node:http');

/**
 * @typedef {Object} Target
 * @property {string} service
 * @property {string} method
 * @property {Node} node
 */

/**
 * @param {Array} message
 * @param {Target} remote
 * @param {Callback} [callback]
 * @return {void}
 */
function send(message, remote, callback) {
    callback = callback || function() { };
    
    const serialized_message = distribution.util.serialize(message);

    const url = `http://local/${remote.service}/${remote.method}`;

    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: serialized_message,
    }

    const request = http.request(url, options, (response) => {
        let body = '';

        response.on('data', (chunk) => {
            body += chunk;
        });

        response.on('end', () => {
            let data = null;
            try {
                data = distribution.util.deserialize(body);
            } catch (e) {
                callback(Error(e), null);
            }

            callback(null, data);
        });
        
    });

    request.on('error', (error) => {
        callback(Error(error), null);
    });

    request.end();

}

module.exports = {send};
