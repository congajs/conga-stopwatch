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

// external libs
const microtime = require('microtime');

/**
 * The environment helper assists with tasks across environments and can be overloaded
 */
module.exports = {
    /**
     * Returns memory usage for the current environment
     * @returns {Object}
     */
    getMemoryUsage() {
        return process.memoryUsage();
    },

    /**
     * Get the current microtime
     * @returns {number}
     */
    getMicrotime() {
        return microtime.now();
    }
};