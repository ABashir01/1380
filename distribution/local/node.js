const http = require('http');
const url = require('url');
const log = require('../util/log');


const routes = require('../all/routes');
const distribution = require('@brown-ds/distribution');
// const distribution = require('../../distribution');
const node = require('@brown-ds/distribution/distribution/local/node');


/*
    The start function will be called to start your node.
    It will take a callback as an argument.
    After your node has booted, you should call the callback.
*/


const start = function(callback) {
  const server = http.createServer((req, res) => {
    /* Your server will be listening for PUT requests. */
    // console.log("Req:", req);

    // TODO: Change this
    if (req.method !== 'PUT') {
      // console.log("Method not allowed");
      res.statusCode = 400;
      res.end();
      return;
    }

    /*
      The path of the http request will determine the service to be used.
      The url will have the form: http://node_ip:node_port/service/method
    */


    const requestURL = url.parse(req.url, true);
    const group = requestURL.pathname.split('/')[1];
    const service = requestURL.pathname.split('/')[2];
    const method = requestURL.pathname.split('/')[3];
    // console.log("Service", service);
    // console.log("Method", method);


    /*

      A common pattern in handling HTTP requests in Node.js is to have a
      subroutine that collects all the data chunks belonging to the same
      request. These chunks are aggregated into a body variable.

      When the req.on('end') event is emitted, it signifies that all data from
      the request has been received. Typically, this data is in the form of a
      string. To work with this data in a structured format, it is often parsed
      into a JSON object using JSON.parse(body), provided the data is in JSON
      format.

      Our nodes expect data in JSON format.
  */

    let body = '';

    req.on('data', (chunk) => {
      body += chunk;
    });

    

    req.on('end', () => {
      let data = null;
      console.log("Body", body);
      // console.log("body type:", typeof body);
      try {
        data = distribution.util.deserialize(body);
        console.log("Data", data);
      } catch (e) {
        console.log("Error", e);
        res.statusCode = 400;
        res.end();
        return;
      }
    

      /* Here, you can handle the service requests.
      Use the local routes service to get the service you need to call.
      You need to call the service with the method and arguments provided in the request.
      Then, you need to serialize the result and send it back to the caller.
      */

      if (group === 'local') {

        distribution.local.routes.get(service, (error, serviceName) => {
          if (error) {
            // console.log("Routes Error", error);
            res.statusCode = 400;
            res.write(distribution.util.serialize(error));
            res.end();
            return;
          }

          serviceName[method](...data, (error, result) => {
            if (error) {
              // console.log("Service Error", error);
              res.statusCode = 400;
              res.write(distribution.util.serialize(error));
              res.end();
              return;
            }

            // console.log("Result", result);
            res.statusCode = 200;
            res.write(distribution.util.serialize(result));
            res.end();
          });
        });
      } else {
        distribution.local.routes.get({service: service, gid: group}, (error, serviceName) => {
          if (error) {
            // console.log("Routes Error", error);
            res.statusCode = 400;
            res.write(distribution.util.serialize(error));
            res.end();
            return;
          }

          serviceName[method](...data, (error, result) => {
            if (error) {
              // console.log("Service Error", error);
              res.statusCode = 400;
              res.write(distribution.util.serialize(error));
              res.end();
              return;
            }

            // console.log("Result", result);
            res.statusCode = 200;
            res.write(distribution.util.serialize(result));
            res.end();
          });
        }
        );
      }
    });
  });


  /*
    Your server will be listening on the port and ip specified in the config
    You'll be calling the `callback` callback when your server has successfully
    started.

    At some point, we'll be adding the ability to stop a node
    remotely through the service interface.
  */

  server.listen(global.nodeConfig.port, global.nodeConfig.ip, () => {
    log(`Server running at http://${global.nodeConfig.ip}:${global.nodeConfig.port}/`);
    global.distribution.node.server = server;
    callback(server);
  });

  server.on('error', (error) => {
    // server.close();
    log(`Server error: ${error}`);
    throw error;
  });
};

module.exports = {
  start: start,
};
