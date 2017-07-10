conga-stopwatch
===============

The stopwatch provides functionality for you to profile runtime operations, 
by gathering microtime and memory consumption into grouped sections 
and events.

Just like with a real stopwatch, you can start an event, and you can log lap times 
for the same event.  Additionally, you can group events into sections.

Each time you start or lap an event, it will create a new "period".  A period logs 
the current memory consumption, the starting microtime of the period, 
the finishing microtime of the period, and the duration in microtime for this period. 

The memory usage for each period is retrieved by calling `process.memoryUsage`.

Simple Example:

```
const { Stopwatch } = require('conga-stopwatch');
 
const stopwatch = new Stopwatch();
 
// start the event
stopwatch.start('my_event');
 
/* do something */
 
stopwatch.lap();
 
/* do something else */
 
stopwatch.lap();
 
// stop the event
stopwatch.stop();
```

When you call `start` it will return an event object.  You do not have to capture this 
object, as any subsequent call to `lap` or `stop` will affect the current event.  However,
given the asynchronous nature of Node, you should be aware of your lifecycle and use the 
instances that get returned so you do not run into concurrency issues.

```
const { Stopwatch } = require('conga-stopwatch');
 
const stopwatch = new Stopwatch();
 
// start the event
const event = stopwatch.start('my_event');
 
/* do something */
 
event.lap();
 
/* do something else */
 
event.lap();
 
// stop the event
event.stop();
```

The following code will have three overlapping events.

```
const { Stopwatch } = require('conga-stopwatch');
 
const stopwatch = new Stopwatch();
 
stopwatch.start('first_event');
 
/* do something */
 
stopwatch.start('second_event');
 
/* do something */
 
stopwatch.lap(); // laps second_event
 
/* do something */
 
stopwatch.start*('third_event');
 
/* do something */
 
stopwatch.stop(); // stops third_event
 
/* do something */
 
stopwatch.stop(); // stops second_event
 
/* do something */
 
stopwatch.stop(); // stops first_event
```

Example using the stopwatch in a loop:

```
const { Stopwatch } = require('conga-stopwatch');
 
class MyClass {
    constructor(data) {
        this.data = data;
        this.stopwatch = new Stopwatch();
    }
 
    function run() {
        const len = this.data.length,
              event = this.stopwatch.start('my_event', 'my_event_category');
 
        for (let [ idx, node ] of data.entries()) {
            
            /** do something **/
            
            if (idx < len) {
                // if we have more data, start a new event period (lap)
                event.lap();
            }
        }
        event.stop();
    }
}
 
const obj = new MyClass(new Array(20));
obj.run();
 
console.log(obj.stopwatch);
```

Example using sections:

```
const { Stopwatch } = require('conga-stopwatch');
 
const stopwatch = new Stopwatch();
 
// start the section
stopwatch.section('my_section');
 
// start the event
stopwatch.start('my_event');
 
// stop the event
stopwatch.stop();
```

Sections, like events, return their own instance that you can capture and reuse, or you can work with 
the stopwatch instance directly and it will find the last opened section.

```
const { Stopwatch } = require('conga-stopwatch');
 
const stopwatch = new Stopwatch();
 
// start the section
const section = stopwatch.section('my_section');
 
// start the event
const event = section.start('my_event');
 
// stop the event
event.stop();
```
