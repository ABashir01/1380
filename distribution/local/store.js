/* Notes/Tips:

- Use absolute paths to make sure they are agnostic to where your code is running from!
  Use the `path` module for that.
*/

const path = require('path');
const fs = require('fs');

const storePath = path.resolve(__dirname, '..', '..', 'store');

function put(state, configuration, callback) {
  try {
    distribution.local.status.get('nid', (e, v) => {
      if (e) {
        callback(e, null);
      } else {
        const nodeID = v;
      
        let key = configuration;

        // null configuration case
        if (configuration === null) {
          key = distribution.util.id.getID(state);
        }

        if (fs.existsSync(path.join(storePath, nodeID)) === false) {
          fs.mkdirSync(path.join(storePath, nodeID));
        }

        let pathKey = path.join(storePath, nodeID, key);

        // Object configuration case - for distributed/all version
        if (typeof configuration === 'object') {
          key = configuration.key;
          let gid = configuration.gid;

          if (fs.existsSync(path.join(storePath, nodeID, gid)) === false) {
            fs.mkdirSync(path.join(storePath, nodeID, gid));
          }

          pathKey = path.join(storePath, nodeID, gid, key);
        }
    
        fs.writeFile(pathKey, distribution.util.serialize(state), (err) => {
          if (err) {
            callback(Error(err), null);
          } else {
            callback(null, state);
          }
        });
      }
    });    
  } catch (e) {
    callback(Error(e), null);
  }
}

function get(configuration, callback) {
  try {
    distribution.local.status.get('nid', (e, v) => {
      if (e) {
        callback(e, null);
      } else {
        const nodeID = v;
        
        let key = configuration;

        // null configuration case
        if (configuration === null) {
          fs.readdir(path.join(storePath, nodeID), (err, files) => {
            if (err) {
              callback(Error(err), null);
            } else {
              callback(null, files);
            }
          });
          return
        }

        let pathKey = path.join(storePath, nodeID, key);

        // Object configuration case - for distributed/all version
        if (typeof configuration === 'object') {
          key = configuration.key;
          let gid = configuration.gid;
          pathKey = path.join(storePath, nodeID, gid, key);
        }

        fs.readFile(pathKey, (err, data) => {
          if (err) {
            callback(Error(err), null);
          } else {
            callback(null, distribution.util.deserialize(data));
          }
        });

      }
    });
  } catch (e) {
    callback(Error(e), null);
  }
}

function del(configuration, callback) {
  try {
    distribution.local.status.get('nid', (e, v) => {
      if (e) {
        callback(e, null);
      } else {
        const nodeID = v;
        
        let key = configuration;

        let pathKey = path.join(storePath, nodeID, key);

        // Object configuration case - for distributed/all version
        if (typeof configuration === 'object') {
          key = configuration.key;
          let gid = configuration.gid;
          pathKey = path.join(storePath, nodeID, gid, key);
        }

        fs.readFile(pathKey, (err, data) => {
          if (err) {
            callback(Error(err), null);
          } else {
            fs.unlink(pathKey, (err2) => {
              if (err2) {
                callback(Error(err2), null);
              } else {
                callback(null, distribution.util.deserialize(data));
              }
            });
          }
        });
      }
    });

    
  } catch (e) {
    callback(Error(e), null);
  }
}

module.exports = {put, get, del};
