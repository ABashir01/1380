/*
    In this file, add your own test cases that correspond to functionality introduced for each milestone.
    You should fill out each test case so it adequately tests the functionality you implemented.
    You are left to decide what the complexity of each test case should be, but trivial test cases that abuse this flexibility might be subject to deductions.

    Imporant: Do not modify any of the test headers (i.e., the test('header', ...) part). Doing so will result in grading penalties.
*/

const local = require('@brown-ds/distribution/distribution/local/local.js');
const distribution = require('../../config.js');

test('(1 pts) student test', (done) => {
  // Test routes put, call to that function, and then counts - 3 instances of comm.send, 1 instance of routes.put, 1 instance of routes.get, and 1 instance of status.get
  const node = distribution.node.config;

  const remote = {node: node, service: 'routes', method: 'put'};
  const functionExample = () => {};
  const message = [functionExample, 'functionExample']; 

  distribution.local.comm.send(message, remote, (e, v) => {
    try {
      expect(e).toBeFalsy();
      expect(v).toBe('functionExample');
      
    } catch (error) {
      done(error);
    }
  });

  const remote2 = {node: node, service: 'routes', method: 'get'};
  const message2 = ['functionExample'];
  distribution.local.comm.send(message2, remote2, (e, v) => {
    try {
      expect(e).toBeFalsy();
      expect(v).toBeInstanceOf(Function);
    } catch (error) {
      done(error);
    }
  });

  const remote3 = {node: node, service: 'status', method: 'get'};
  const message3 = ['counts'];
  distribution.local.comm.send(message3, remote, (e, v) => {
    try {
      expect(e).toBeFalsy();
      expect(v === 2);
      done();
    } catch (error) {
      done(error);
    }
  });
});


test('(1 pts) student test', (done) => {
  // Test nested function with local routes - 1 instance of routes.get and 1 of routes.put
  const nestedService = {};
  nestedService.nested = () => {
    return () => {
      return 'Hello World!';
    };
  };

  distribution.local.routes.put(nestedService, 'nested', (e, v) => {
    distribution.local.routes.get('nested', (e, v) => {
      try {
        expect(e).toBeFalsy();
        expect(v.nested()()).toBe('Hello World!');
        done();
      } catch (error) {
        done(error);
      }
    });
  });
});


test('(1 pts) student test', (done) => {
  // Test whether routes remove works + errors on removing nothing - 4 instances of comm.send, 1 instance of routes.put, 2 instance of routes.remove, and 1 instance of routes.get
  
  const functionExampleService = {};
  functionExampleService.functionExample = () => {
    return 'functionExample';
  };

  distribution.local.routes.put(functionExampleService, 'functionExample', (e, v) => {
    distribution,local.routes.get('functionExample', (e, v) => {
      try {
        expect(e).toBeFalsy();
        expect(v.functionExample()).toBe('functionExample');
      } catch (error) {
        done(error);
      }
    });

    distribution.local.routes.remove('functionExample', (e, v) => {
      try {
        expect(e).toBeFalsy();
        expect(v).toBe('functionExample');
      } catch (error) {
        done(error);
      }

      distribution.local.routes.get('functionExample', (e, v) => {
        try {
          expect(e).toBeTruthy();
          expect(e).toBeInstanceOf(Error);
          expect(v).toBeFalsy();
        } catch (error) {
          done(error);
        }
      });

      distribution.local.routes.remove('functionExample', (e, v) => {
        try {
          expect(e).toBeTruthy();
          expect(e).toBeInstanceOf(Error);
          expect(v).toBeFalsy();
          done();
        } catch (error) {
          done(error);
        }
      });
    });
  });
});

test('(1 pts) student test', (done) => {
  // Test status heap after creating a large array - 1 instance of status.get
  distribution.local.status.get('heapUsed', (e, v) => {
    const arr = new Array(1000000);
    try {
      expect(e).toBeFalsy();
      expect(v).toBeLessThan(process.memoryUsage().heapUsed);
      done();
    } catch (error) {
      done(error);
    }
  });
});

test('(1 pts) student test', (done) => {
  // Error handling for invalid comm.sends - 3 instances of comm.send
  const node = distribution.node.config;
  const remote = {node: node, service: 'status', method: 'get'};
  const message = ['invalid'];

  distribution.local.comm.send(message, remote, (e, v) => {
    try {
      expect(e).toBeTruthy();
      expect(e).toBeInstanceOf(Error);
      expect(v).toBeFalsy();
      done();
    } catch (error) {
      done(error);
    }
  });

  const remote2 = {node: node, service: 'invalid', method: 'get'};
  const message2 = ['sid'];

  distribution.local.comm.send(message2, remote2, (e, v) => {
    try {
      expect(e).toBeTruthy();
      expect(e).toBeInstanceOf(Error);
      expect(v).toBeFalsy();
      done();
    } catch (error) {
      done(error);
    }
  });

  const remote3 = {node: node, service: 'status', method: 'invalid'};
  const message3 = ['sid'];

  distribution.local.comm.send(message3, remote3, (e, v) => {
    try {
      expect(e).toBeTruthy();
      expect(e).toBeInstanceOf(Error);
      expect(v).toBeFalsy();
      done();
    } catch (error) {
      done(error);
    }
  });
  
});

/* Test infrastructure */

let localServer = null;

beforeAll((done) => {
  distribution.node.start((server) => {
    localServer = server;
    console.log(`Server started on ${global.nodeConfig.ip}:${global.nodeConfig.port}`);
    done();
  });
});

afterAll((done) => {
  localServer.close();
  done();
});