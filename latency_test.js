// Measure latency
const { performance, PerformanceObserver } = require('perf_hooks');
const distribution = require('./distribution')

const obs = new PerformanceObserver((items) => {
    const duration = items.getEntries()[0].duration;
    totalDuration += duration;
    performance.clearMarks();
    if (items.getEntries().length === 10) {
        console.log('Average duration:', totalDuration / 10);
    }    performance.clearMarks();
    });

obs.observe({ entryTypes: ['measure'] });

let totalDuration = 0;
for (let i = 0; i < 10; i++) {
    performance.mark('A');
    const num = 12;
    const serialized = distribution.util.serialize(num);
    const deserialized = distribution.util.deserialize(serialized);
    performance.mark('B');
    performance.measure('A to B', 'A', 'B');
}

