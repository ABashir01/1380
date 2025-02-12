// Measure latency
const { performance, PerformanceObserver } = require('perf_hooks');
const distribution = require('./distribution')

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
const node = distribution.node.config;
const remote = {node: node, service: 'status', method: 'get'};
const message = ['nid'];

let totalDuration = 0;
for (let i=0; i<1000; i++) {
    performance.mark('A');
    distribution.local.comm.send(message, remote, (e, v) => {
        performance.mark('B');
        performance.measure('A to B', 'A', 'B');
    });
}