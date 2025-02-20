/** @typedef {import("../types").Callback} Callback */
/** @typedef {import("../types").Node} Node */

const http = require('node:http');

const serialize = require('@brown-ds/distribution/distribution/util/util').serialize;
const deserialize = require('@brown-ds/distribution/distribution/util/util').deserialize;


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
    
    const serialized_message = serialize(message);

    

    let url = `http://${remote.node.ip}:${remote.node.port}/local/${remote.service}/${remote.method}`;

    // Distributed case
    if (remote.gid && remote.gid !== 'local') {
        url = `http://${remote.node.ip}:${remote.node.port}/${remote.gid}/${remote.service}/${remote.method}`;
    }
    // console.log("URL:", url);

    const options = {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
    }

    // console.log("Options:", options);
    // console.log("Serialized Message:", serialized_message);

    const request = http.request(url, options, (response) => {
        let body = '';

        response.on('data', (chunk) => {
            body += chunk;
        });

        response.on('end', () => {
            // console.log("Response:", body);
            let data = null;
            try {
                data = deserialize(body);
                // console.log("Data:", data);
            } catch (e) {
                callback(Error(e), null);
            }

            if (response.statusCode !== 200) {
                callback(data, null);
                return;
            }

            console.log("SHAPE THE FUTURE:", data, remote.gid);

            // Distributed case 
            if (remote.gid && remote.gid !== 'local') {
                callback(data.error, data.result);
                return;
            }

            callback(null, data);
        });
        
    });

    request.on('error', (error) => {
        callback(Error(error), null);
    });

    request.write(serialized_message);
    request.end();

}

module.exports = {send};
