/** @typedef {import("../types").Callback} Callback */

function routes(config) {
  const context = {};
  context.gid = config.gid || 'all';

  /**
   * @param {object} service
   * @param {string} name
   * @param {Callback} callback
   */
  function put(service, name, callback = () => { }) {
    callback = callback || function() { };

    let remote = {service: 'routes', method: 'put'};
    let groupName = context.gid;
    let message = [service, name];
    // console.log("Routes Put", groupName, message);

    global.distribution[groupName].comm.send(message, remote, (e, v) => {
      callback(e, v);
      return;
    });
  }

  /**
   * @param {object} service
   * @param {string} name
   * @param {Callback} callback
   */
  function rem(service, name, callback = () => { }) {
  }

  return {put, rem};
}

module.exports = routes;
