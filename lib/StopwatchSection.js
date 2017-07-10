/*
 * This file is part of the conga-stopwatch module.
 *
 * (c) Anthony Matarazzo <email@anthonymatarazzo.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

// local libs
const CompositeStopwatch = require('./CompositeStopwatch');
const StopwatchEvent = require('./StopwatchEvent');

/**
 * The StopwatchSection contains multiple events and child sections
 */
class StopwatchSection extends CompositeStopwatch {
    /**
     * {@inheritDoc}
     */
    constructor(name = null) {
        super(name);
        this.events = [];
        this.eventMap = {};
    }

    /**
     * Start a known event or create a new event and start it
     * @param {String} name The event name
     * @param {String} [category] The event category name (if any)
     * @returns {StopwatchEvent}
     * @throws Error for not providing a name
     */
    start(name, category = null) {
        if (!name) {
            throw new Error('LogicError: Stopwatch events must have a name.');
        }
        // if (this.eventMap[name] instanceof StopwatchEvent) {
        //     return this.eventMap[name].start();
        // }
        const event = new StopwatchEvent(name, category);
        this.events.push( event );
        this.eventMap[ name ] = event;
        return event.start();
    }

    /**
     * Stop the last known event, or stop an even by name
     * @param {String} [name] The event name to stop, omit to stop the last event
     * @returns {StopwatchEvent|null}
     */
    stop(name = null) {
        let event;
        if (!name) {
            event = this.events[ this.events.length - 1 ];
        } else if (name in this.eventMap) {
            event = this.eventMap[name];
        }
        if (event instanceof StopwatchEvent) {
            return event.stop();
        }
        // if we don't have the event, see if a child section does
        return super.stop(...arguments);
    }

    /**
     * {@inheritDoc}
     */
    getEvent(name) {
        return this.eventMap[name];
    }

    /**
     * {@inheritDoc}
     */
    hasEvent(name) {
        if (name in this.eventMap) {
            return this.eventMap[name] instanceof StopwatchEvent;
        }
        // see if a child section has the event
        return super.hasEvent(...arguments);
    }

    /**
     * {@inheritDoc}
     */
    ensureStopped() {
        // ensure child sections are stopped
        super.ensureStopped();

        // make sure our events are stopped
        for (let i = this.events.length - 1; i >= 0; i--) {
            this.events[i].stop();
        }

        return this;
    }

    /**
     * {@inheritDoc}
     */
    toJSON() {
        return Object.assign(super.toJSON(), {
            events: this.events.map(event => event.toJSON())
        });
    }
}

module.exports = StopwatchSection;