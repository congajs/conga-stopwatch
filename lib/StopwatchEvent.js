/*
 * This file is part of the conga-stopwatch module.
 *
 * (c) Anthony Matarazzo <email@anthonymatarazzo.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

// local libs
const StopwatchPeriod = require('./StopwatchPeriod');

/**
 * The stopwatch event holds start and end times for multiple periods
 */
class StopwatchEvent {
    /**
     * @param {String} [name] The name of the event
     * @param {String} [category] The category name, if any
     */
    constructor(name = null, category = null) {
        this.id = StopwatchPeriod.microtime() + '' + Math.random();
        this.name = name;
        this.category = category;
        this.started = [];
        this.periods = [];
    }

    /**
     * See if this event has been started
     * @returns {Boolean}
     */
    isStarted() {
        return this.started.length !== 0;
    }

    /**
     * Start a new period in the event
     * @returns {StopwatchEvent}
     */
    start() {
        this.started.push( StopwatchPeriod.microtime() );
        return this;
    }

    /**
     * Lap the event (stop the last period and start a new one)
     * @returns {StopwatchEvent}
     */
    lap() {
        return this.stop().start();
    }

    /**
     * Stop the last known existing period in this event and add it to our collection
     * @returns {StopwatchEvent}
     */
    stop() {
        if (this.started.length === 0) {
            return this;
        }
        this.periods.push( new StopwatchPeriod(this.started.pop(), StopwatchPeriod.microtime()) );
        return this;
    }

    /**
     * Make sure all periods are stopped
     * @returns {StopwatchEvent}
     */
    ensureStopped() {
        while (this.started.length !== 0) {
            this.stop();
        }
        return this;
    }

    /**
     * Get a JSON (plain object) representation of this instance
     * @return {Object}
     */
    toJSON() {
        return {
            id: this.id,
            name: this.name,
            category: this.category,
            periods: this.periods.map(period => period.toJSON())
        };
    }
}

module.exports = StopwatchEvent;