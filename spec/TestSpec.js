const {
    Stopwatch,
    StopwatchSection,
    StopwatchEvent,
    StopwatchPeriod
} = require('../index');

describe("@conga/stopwatch", () => {

    describe('- interface', () => {

        it('should create a named event with no periods', done => {

            const stopwatch = new Stopwatch();

            let event = stopwatch.start('my_event');
            expect(stopwatch.sections.length).toEqual(1);
            expect(stopwatch.sections[0]).toEqual(jasmine.any(StopwatchSection));
            expect(event).toEqual(jasmine.any(StopwatchEvent));
            expect(event.name).toEqual('my_event');
            expect(event.periods).toEqual(jasmine.any(Array));
            expect(event.periods.length).toEqual(0);
            done();

        });

        it('should create a new period when stop is called', done => {
            const stopwatch = new Stopwatch();

            let event = stopwatch.start('my_event');
            expect(stopwatch.sections.length).toEqual(1);
            expect(stopwatch.sections[0]).toEqual(jasmine.any(StopwatchSection));
            expect(event).toEqual(jasmine.any(StopwatchEvent));
            expect(event.name).toEqual('my_event');
            expect(event.periods).toEqual(jasmine.any(Array));
            expect(event.periods.length).toEqual(0);

            // stop through the stopwatch interface, not the event
            stopwatch.stop();

            // check the event instance for periods
            expect(event.periods.length).toEqual(1);
            expect(event.periods[0]).toEqual(jasmine.any(StopwatchPeriod));

            done();
        });

        it('should lap the current event', done => {
            const stopwatch = new Stopwatch();

            let event = stopwatch.start('my_event');
            expect(stopwatch.sections.length).toEqual(1);
            expect(stopwatch.sections[0]).toEqual(jasmine.any(StopwatchSection));
            expect(event).toEqual(jasmine.any(StopwatchEvent));
            expect(event.name).toEqual('my_event');
            expect(event.periods).toEqual(jasmine.any(Array));
            expect(event.periods.length).toEqual(0);

            // lap through the stopwatch interface, not the event
            stopwatch.lap();

            // check the event instance for periods
            expect(event.periods.length).toEqual(1);
            expect(event.periods[0]).toEqual(jasmine.any(StopwatchPeriod));

            // stop through the stopwatch interface, not the event
            stopwatch.stop();

            // check the event instance for periods
            expect(event.periods.length).toEqual(2);
            expect(event.periods[1]).toEqual(jasmine.any(StopwatchPeriod));

            done();
        });

        it('should start multiple events without periods until stop is called', done => {
            const stopwatch = new Stopwatch();

            stopwatch.start();
            expect(stopwatch.sections.length).toEqual(1);
            expect(stopwatch.sections[0]).toEqual(jasmine.any(StopwatchSection));

            const section = stopwatch.sections[0];
            expect(section.events.length).toEqual(1);
            expect(section.events[0].periods.length).toEqual(0);

            stopwatch.start();
            expect(stopwatch.sections.length).toEqual(1);
            expect(section.events.length).toEqual(2);
            expect(section.events[0].periods.length).toEqual(0);
            expect(section.events[1].periods.length).toEqual(0);

            stopwatch.start();
            expect(stopwatch.sections.length).toEqual(1);
            expect(section.events.length).toEqual(3);
            expect(section.events[0].periods.length).toEqual(0);
            expect(section.events[1].periods.length).toEqual(0);
            expect(section.events[2].periods.length).toEqual(0);

            stopwatch.stop();
            expect(stopwatch.sections.length).toEqual(1);
            expect(section.events.length).toEqual(3);
            expect(section.events[0].periods.length).toEqual(0);
            expect(section.events[1].periods.length).toEqual(0);
            expect(section.events[2].periods.length).toEqual(1);

            stopwatch.stop();
            expect(stopwatch.sections.length).toEqual(1);
            expect(section.events.length).toEqual(3);
            expect(section.events[0].periods.length).toEqual(0);
            expect(section.events[1].periods.length).toEqual(1);
            expect(section.events[2].periods.length).toEqual(1);

            stopwatch.stop();
            expect(stopwatch.sections.length).toEqual(1);
            expect(section.events.length).toEqual(3);
            expect(section.events[0].periods.length).toEqual(1);
            expect(section.events[1].periods.length).toEqual(1);
            expect(section.events[2].periods.length).toEqual(1);

            done();
        });
    });

    describe('- section', () => {
        it('should create a named, empty stopwatch section', done => {

            const stopwatch = new Stopwatch();

            const section = stopwatch.section('test');
            expect(section).toEqual(jasmine.any(StopwatchSection))
            expect(section.name).toEqual('test');
            expect(section.events).toEqual(jasmine.any(Array));
            expect(section.events.length).toEqual(0);
            done();

        });
    });

    describe('- period', () => {

        it('should get the current microtime', done => {
            let d = new Date();
            let now = StopwatchPeriod.microtime();

            expect(now).toEqual(jasmine.any(Number));
            expect(d.getTime() < now).toBeTruthy();
            expect(d.getTime()).toEqual(parseInt(now / 1000, 10));

            let greater = 0;
            let equal = 0;

            for (let i = 0; i < 15000; i++) {
                let time = StopwatchPeriod.microtime();
                expect(time >= now).toBeTruthy();
                time > now && ++greater;
                time === now && ++equal;
                now = time;
            }

            expect(greater > equal).toBeTruthy();

            done();
        });

    });

});
