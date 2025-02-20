# distribution

This is the distribution library. When loaded, distribution introduces functionality supporting the distributed execution of programs. To download it:

## Installation

```sh
$ npm i '@brown-ds/distribution'
```

This command downloads and installs the distribution library.

## Testing

There are several categories of tests:
  *	Regular Tests (`*.test.js`)
  *	Scenario Tests (`*.scenario.js`)
  *	Extra Credit Tests (`*.extra.test.js`)
  * Student Tests (`*.student.test.js`) - inside `test/test-student`

### Running Tests

By default, all regular tests are run. Use the options below to run different sets of tests:

1. Run all regular tests (default): `$ npm test` or `$ npm test -- -t`
2. Run scenario tests: `$ npm test -- -c` 
3. Run extra credit tests: `$ npm test -- -ec`
4. Run the `non-distribution` tests: `$ npm test -- -nd`
5. Combine options: `$ npm test -- -c -ec -nd -t`

## Usage

To import the library, be it in a JavaScript file or on the interactive console, run:

```js
let distribution = require("@brown-ds/distribution");
```

Now you have access to the full distribution library. You can start off by serializing some values. 

```js
let s = distribution.util.serialize(1); // '{"type":"number","value":"1"}'
let n = distribution.util.deserialize(s); // 1
```

You can inspect information about the current node (for example its `sid`) by running:

```js
distribution.local.status.get('sid', console.log); // 8cf1b
```

You can also store and retrieve values from the local memory:

```js
distribution.local.mem.put({name: 'nikos'}, 'key', console.log); // {name: 'nikos'}
distribution.local.mem.get('key', console.log); // {name: 'nikos'}
```

You can also spawn a new node:

```js
let node = { ip: '127.0.0.1', port: 8080 };
distribution.local.status.spawn(node, console.log);
```

Using the `distribution.all` set of services will allow you to act 
on the full set of nodes created as if they were a single one.

```js
distribution.all.status.get('sid', console.log); // { '8cf1b': '8cf1b', '8cf1c': '8cf1c' }
```

You can also send messages to other nodes:

```js
distribution.all.comm.send(['sid'], {node: node, service: 'status', method: 'get'}, console.log); // 8cf1c
```

# Results and Reflections

# M1: Serialization / Deserialization

## Summary



My implementation comprises two software components, totaling ~100 lines of code. Key challenges included making the objects work recursively, which took most of my time. It turned out to be a very minor issue where I was just naming my variable instead of stating 'let' which didn't error for some reason, but caused really weird behavior in terms of the recursion.

## Correctness & Performance Characterization


*Correctness*: I wrote 5 tests; these tests take 0.05s to execute. This includes triple nested objects, testing NaN in JS, Infinity in JS, arrays with missing indices, and an object with some weird values.

*Performance*: The latency of various subsystems is described in the `"latency"` portion of package.json. The characteristics of my development machines are summarized in the `"dev"` portion of package.json. The latency is formated as [number, function, object].

# M2: Actors and Remote Procedure Calls (RPC)

## Summary

> Summarize your implementation, including key challenges you encountered. Remember to update the `report` section of the `package.json` file with the total number of hours it took you to complete each task of M2 (`hours`) and the lines of code per task.

My implementation comprises 4 software components, totaling ~200 lines of code. Key challenges included resolving how to get comm and node js to work in general. The problem was admittedly a bit exacerbated by being unsure what the packet was saying the roles of comm and node separately were supposed to be.

## Correctness & Performance Characterization

> Describe how you characterized the correctness and performance of your implementation

*Correctness*: I wrote 5 tests; these tests take ~5 seconds to execute.

*Performance*: I characterized the performance of comm and RPC by sending 1000 service requests in a tight loop. Average throughput and latency is recorded in `package.json`.

## Key Feature

> How would you explain the implementation of `createRPC` to someone who has no background in computer science — i.e., with the minimum jargon possible?
 - Suppose there is a Person A who's job is to solve problems for people and he can be reached over the phone. Now, suppose Person B wanted a problem of his solved by this person - normally, he would need to call the person and explain the problem and all of its details and then the person on the other end would complete the task at hand and send back the results. Now, this could get very unnecessarily tedious if Person B solves the same problem every day and has to explain the instructions to Person A every day (since Person A gets a lot of calls, he doesn't remember the instructions). However, CreateRPC is the equivalent of creating an automatic way for Person A to instantly solve the problem without Person B having to personally talk them the actual unique problem eveery single time - meaning that Person B can now use this automatic method to instantly solve the problem instead of having to call Person A again and completely re-explain the problem. This means that it's faster for Person B to solve the problem, it takes less work in terms of explaining the problem, and it feels like Person B just presses a button or something and the problem is solved instantly - even though Person A is still technically solving it.