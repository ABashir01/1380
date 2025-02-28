
let memObj = {};

function put(state, configuration, callback) {
    callback = callback || function () {};

    try {

        console.log("Putting: ", state, configuration);
        let key = configuration;

        // Null put case
        if (configuration === null) {
            key = distribution.util.id.getID(state);
            console.log(key);
        }

        // Object configuration case - for distributed/all version
        else if (typeof configuration === 'object') {
            key = configuration.key;

            if (configuration.key === null) {
                key = distribution.util.id.getID(state);
                console.log(key);
            }

            let gid = configuration.gid;
            if (memObj[gid] === undefined) {
                memObj[gid] = {};
            }
            memObj[gid][key] = state;
            console.log("HELL: ", memObj);
            callback(null, state);
            return;
        }

        memObj[key] = state;
        console.log("CLEAN: ", memObj);
        
        callback(null, state);
    } catch (e) {
        callback(e, null);
    }

};

function get(configuration, callback) {
    callback = callback || function () {};

    try {

        // Null get case
        if (configuration === null) {
            const keys = Object.keys(memObj);
            callback(null, keys);
            return;
        }

        // Object configuration case - for distributed/all version
        else if (typeof configuration === 'object') {
            const gid = configuration.gid;
            const key = configuration.key;

            if (configuration.key === null) {
                const keys = Object.keys(memObj[gid]);
                callback(null, keys);
                return;
            }

            console.log("PANIC FANCY: ", memObj);
            const result = memObj[gid][key];
            console.log("HOLY: ", result);
            if (result === undefined) {
                throw new Error('Key not found');
            }
            callback(null, result);
            return;
        }

        const result = memObj[configuration];
        if (result === undefined) {
            throw new Error('Key not found');
        }
        callback(null, result);
    } catch (e) {
        callback(e, null);
    }
}

function del(configuration, callback) {
    // TODO: Is there supposed to be a null del case?? Does everything get deleted???
    callback = callback || function () {};

    try {

        // Object configuration case - for distributed/all version
        if (typeof configuration === 'object') {
            const gid = configuration.gid;
            const key = configuration.key;

            if (configuration.key === null) {
                key = distribution.util.id.getID(state);
                console.log(key);
            }


            const result = memObj[gid][key];
            if (result === undefined) {
                throw new Error('Key not found');
            }
            delete memObj[gid][key];
            callback(null, result);
            return;
        }

        result = memObj[configuration];
        if (result === undefined) {
            throw new Error('Key not found');
        }
        delete memObj[configuration];
        callback(null, result);
    } catch (e) {
        callback(e, null);
    }
};

module.exports = {put, get, del};
