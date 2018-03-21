/*
 * This file is part of the conga-stopwatch module.
 *
 * (c) Anthony Matarazzo <email@anthonymatarazzo.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

/**
 * The environment helper assists with tasks across environments and can be overloaded
 */
module.exports = {
    /**
     * The performance object
     * @type {Performance}
     */
    performance: null,

    /**
     * Time to adjustment
     * @type {Number}
     */
    fixTime: null,

    /**
     * Browser start time
     * @type {Number}
     */
    startTime: null,

    /**
     * Get the browser's performance object
     * @returns {Performance|null}
     */
    getBrowserPerformanceObject() {
        if (!this.performance) {
            this.performance = (typeof window !== 'undefined' && (
                window.performance ||
                window.webkitPerformance ||
                window.mozPerformance ||
                window.msPerformance
            ));
        }
        return this.performance;
    },

    /**
     * Returns memory usage for the current environment
     * @returns {Object}
     */
    getMemoryUsage() {
        const perf = this.getBrowserPerformanceObject();
        return perf && perf.memory || null;
    },

    // https://github.com/medikoo/microtime-x/blob/master/index.js
    /**
     * Get the performance timing start time
     * @param {Boolean} [refresh] true to refresh the times
     * @returns {number|null}
     */
    getStartTime(refresh = false) {
        if (!this.startTime || refresh) {
            const perf = this.getBrowserPerformanceObject();
            this.startTime = (
                perf &&
                perf.timing &&
                perf.timing.navigationStart ||
                Date.now()
            );
            this.fixTime = -((this.startTime + perf.now()) - Date.now());
            setInterval(() => {
                this.fixTime = -((this.startTime + perf.now()) - Date.now());
            }, 1000);
        }
        return this.startTime;
    },

    /**
     * Get the current microtime
     * @returns {number}
     */
    getMicrotime() {
        const perf = this.getBrowserPerformanceObject();
        if (perf) {
            return Math.round(this.getStartTime() + perf.now() + this.fixTime) * 1000;
        }
        return Date.now() * 1000;
    }
};