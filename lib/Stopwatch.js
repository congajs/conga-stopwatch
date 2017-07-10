/*
 * This file is part of the conga-stopwatch module.
 *
 * (c) Anthony Matarazzo <email@anthonymatarazzo.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

// local libs
const StopwatchSection = require('./StopwatchSection');
const CompositeStopwatch = require('./CompositeStopwatch');

/**
 * The stopwatch service provides an easy way to measure execution time of specific
 * parts of code, so that dealing with microtime is abstracted
 */
class Stopwatch extends CompositeStopwatch {
    /**
     * {@inheritDoc}
     */
    section(name = null) {
        const section = new StopwatchSection(name);
        this.sections.push(section);
        return section;
    }
}

module.exports = Stopwatch;