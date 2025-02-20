# non-distribution

This milestone aims (among others) to refresh (and confirm) everyone's
background on developing systems in the languages and libraries used in this
course.

By the end of this assignment you will be familiar with the basics of
JavaScript, shell scripting, stream processing, Docker containers, deployment
to AWS, and performance characterization—all of which will be useful for the
rest of the project.

Your task is to implement a simple search engine that crawls a set of web
pages, indexes them, and allows users to query the index. All the components
will run on a single machine.

## Getting Started

To get started with this milestone, run `npm install` inside this folder. To
execute the (initially unimplemented) crawler run `./engine.sh`. Use
`./query.js` to query the produced index. To run tests, do `npm run test`.
Initially, these will fail.

### Overview

The code inside `non-distribution` is organized as follows:

```
.
├── c            # The components of your search engine
├── d            # Data files like the index and the crawled pages
├── s            # Utility scripts for linting and submitting your solutions
├── t            # Tests for your search engine
├── README.md    # This file
├── crawl.sh     # The crawler
├── index.sh     # The indexer
├── engine.sh    # The orchestrator script that runs the crawler and the indexer
├── package.json # The npm package file that holds information like JavaScript dependencies
└── query.js     # The script you can use to query the produced global index
```

### Submitting

To submit your solution, run `./scripts/submit.sh` from the root of the stencil. This will create a
`submission.zip` file which you can upload to the autograder.

# M0: Setup & Centralized Computing

* name: `Ahad Bashir`
* email: `ahad_bashir@brown.edu`
* cslogin: `abashir2`


## Summary

> Summarize your implementation, including the most challenging aspects; remember to update the `report` section of the `package.json` file with the total number of hours it took you to complete M0 (`hours`), the total number of JavaScript lines you added, including tests (`jsloc`), the total number of shell lines you added, including for deployment and testing (`sloc`).


My implementation consists of 6 components addressing T1--8. The most challenging aspect was working on process because I honestly have a really weak understanding of bash commands and had to really familiarize myself with them, while also struggling with the fact that I was doing something wrong for a while that caused an issue. I also found writing the tests to be challenging for the same reason.


## Correctness & Performance Characterization


> Describe how you characterized the correctness and performance of your implementation.


To characterize correctness, we developed 8 tests that test the following cases: For combine, we tested a different set of words. For getting text, we tested it on a different website url. For getting URLs, we tested that it could handle both full URLs and relative URLs. For invert, we added different text with modifications to whitespace to see if it handled it fine. For merge, we created our own files, including an empty one and one with mishapen inputs, to determine if it could handle different edge cases. For process, we tested it with non-ASCII characters to see what would occur. For query, we tested a 2-gram, as the original test only tested a 1-gram. For stem, we tested some different words to see that they match acceptable stemming behavior (i.e. king doesn't have the "ing" removed).


*Performance*: The throughput of various subsystems is described in the `"throughput"` portion of package.json. The characteristics of my development machines are summarized in the `"dev"` portion of package.json.


## Wild Guess

> How many lines of code do you think it will take to build the fully distributed, scalable version of your search engine? Add that number to the `"dloc"` portion of package.json, and justify your answer below.

I put a pretty high number because I feel like the process where distributing the load gets involved probably adds up in terms of code complexity, but I honestly have no clue.
