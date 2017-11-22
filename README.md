# @conga/stopwatch

## Installation

Install the bundle in your project directory:

```shell
$ npm install --save @conga/stopwatch
```

## Introduction

The stopwatch provides functionality for you to profile runtime operations, 
by gathering microtime and memory consumption into grouped sections 
and events.

Just like with a real stopwatch, you can start an event, and you can log lap times 
for the same event.  Additionally, you can group events into sections.

Each time you start or lap an event, it will create a new "period".  A period logs 
the current memory consumption, the starting microtime of the period, 
the finishing microtime of the period, and the duration in microtime for this period. 

The memory usage for each period is retrieved by calling `process.memoryUsage`.

See the [documentation](/docs) for more information and usage examples.

