// Measure latency
const { performance, PerformanceObserver } = require('perf_hooks');
// const distribution = require('./distribution')
// const distribution = require('@brown-ds/distribution');

const obs = new PerformanceObserver((items) => {
    const duration = items.getEntries()[0].duration;
    totalDuration += duration;
    performance.clearMarks();
    if (items.getEntries().length === 10) {
        console.log('Average duration:', totalDuration / 10);
    } else if (items.getEntries().length === 1000) {
        console.log('Average duration:', totalDuration / 1000);
    }
    
    performance.clearMarks();
    });

obs.observe({ entryTypes: ['measure'] });

// M1 Latency Measure
// let totalDuration = 0;
// for (let i = 0; i < 10; i++) {
//     performance.mark('A');
//     const num = {a: 1, b: 2, c: 3};
//     const serialized = distribution.util.serialize(num);
//     const deserialized = distribution.util.deserialize(serialized);
//     performance.mark('B');
//     performance.measure('A to B', 'A', 'B');
// }

// M2 Latency Measure
// const node = distribution.node.config;
// const remote = {node: node, service: 'status', method: 'get'};
// const message = ['nid'];

// let totalDuration = 0;
// for (let i=0; i<1000; i++) {
//     performance.mark('A');
//     distribution.local.comm.send(message, remote, (e, v) => {
//         performance.mark('B');
//         performance.measure('A to B', 'A', 'B');
//     });
// }

// M3 Scenario 1 Latency Measure - Latency was 0.00010908299999999826 seconds
// const config = { "ip": "127.0.0.1",
//     "port": 8080,
//     "onStart": (server) => console.log('hi!') };
    
// const distribution = require('@brown-ds/distribution')(config);
    
// let totalDuration = 0;
// for (let i=0; i<1000; i++) {
//     performance.mark('A');
//     let new_config = {ip: "127.0.0.1", port: (8080 + i)};
//     let cb = () => void
//     distribution.local.spawn(new_config, cb);
//     performance.mark('B');
//     performance.measure('A to B', 'A', 'B');
// }

// M3 Scenario 1 Throughput Measure - 400.91536997272146 requests completed per second
const config = { "ip": "127.0.0.1",
    "port": 8080,
    "onStart": (server) => console.log('hi!') };
    
const distribution = require('@brown-ds/distribution')(config);
    
const startTime = performance.now();


for (let i = 0; i < 1000; i++) {
    performance.mark('A');
    let new_config = { ip: "127.0.0.1", port: (8080 + i) };
    let cb = () => void
    distribution.local.spawn(new_config, cb);
}

const endTime = performance.now();
const duration = endTime - startTime;

console.log('End Time:', endTime);
console.log('Start Time:', startTime);
console.log('Duration:', duration);

console.log('Throughput:', 1000 / (duration));