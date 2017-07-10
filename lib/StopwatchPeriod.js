/*
 * This file is part of the conga-stopwatch module.
 *
 * (c) Anthony Matarazzo <email@anthonymatarazzo.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

// core libs
const process = require('process');
const microtime = require('microtime');

/**
 * The StopwatchPeriod records 'periods' that happen during / between events
 */
class StopwatchPeriod {
    /**
     * Get the current microtime
     * @returns {number}
     */
    static microtime() {
        return microtime.now();
    }

    /**
     * @param {number} start The starting time (timestamp) of this period
     * @param {number} end The ending time (timestamp) of this period
     * @param {Boolean} [lap] Whether or not we are stopping for a lap or just stopping
     */
    constructor(start, end, lap = false) {
        /**
         * The starting microtime of this period
         * @type {Array}
         */
        this.start = start;

        /**
         * The ending microtime of this period
         * @type {Array}
         */
        this.end = end;

        /**
         * The duration (microtime) of this period
         * @type {number}
         */
        this.duration = end - start;

        /**
         * The memory at the end of this period
         */
        this.memory = process.memoryUsage();

        /**
         * Know if we went another lap or not
         * @type {Boolean}
         */
        this.isLap = lap;
    }

    /**
     * Get a JSON (plain object) representation of this instance
     * @return {Object}
     */
    toJSON() {
        return {
            start: this.start,
            end: this.end,
            duration: this.duration,
            memory: this.memory
        };
    }
}

module.exports = StopwatchPeriod;