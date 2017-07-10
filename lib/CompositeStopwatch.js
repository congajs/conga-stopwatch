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
 * The composite stopwatch is a single stopwatch-unit that implements the stopwatch "interface"
 */
class CompositeStopwatch {
    /**
     * @param {String} [name] The name of the section
     */
    constructor(name = null) {
        this.id = StopwatchPeriod.microtime() + '' + Math.random();
        this.name = name;
        this.sections = [];
    }

    /**
     * Create a new section
     * @param {String} [name] The name of the section (optional)
     * @returns {CompositeStopwatch}
     */
    section(name = null) {
        const section = new this.constructor(name);
        this.sections.push(section);
        return section;
    }

    /**
     * Remove a section
     * @param {CompositeStopwatch} section The section to remove
     * @returns {CompositeStopwatch}
     */
    removeSection(section) {
        const idx = this.sections.indexOf(section);
        if (idx !== -1) {
            this.sections.splice(idx, 1);
        }
        return this;
    }

    /**
     * Get a previously opened section by name
     * @param {String} name
     * @returns {CompositeStopwatch|null}
     */
    getSection(name) {
        for (let section of this.sections) {
            if (section.name === name) {
                return section;
            }
        }
        return null;
    }

    /**
     * Start (and create) new events and add them to the current section
     * @param {String} [name] The event name
     * @param {String} [category] The category this event belongs to (if any)
     * @returns {StopwatchEvent}
     */
    start(name = null, category = null) {
        // start a new event on the last section
        const section = this.sections[ this.sections.length - 1 ];
        if (section instanceof CompositeStopwatch) {
            return section.start(name, category);
        }
        // create a new section and start a new event
        return this.section().start(name, category);
    }

    /**
     * Stop the last known event in the last known section, or stop a specific event working backwards
     * from the last section up.
     *
     * @param {String} [name] The name of the event to stop
     * @returns {StopwatchEvent|null}
     */
    stop(name = null) {
        if (!name) {
            // stop the last known event on the last known section
            let section = this.sections[this.sections.length - 1];
            if (section instanceof CompositeStopwatch) {
                return section.stop();
            }
            return null;
        }
        for (let i = this.sections.length - 1; i >= 0; i--) {
            if (this.sections[i].hasEvent(name)) {
                return this.sections[i].stop(name);
            }
        }
        return null;
    }

    /**
     * Lap the last known event in the last known section, or a specific event working backwards
     * from the last known section up.
     *
     * @param {String} [name] The name of the event to lap (optional)
     * @returns {StopwatchEvent|null}
     */
    lap(name = null) {
        const evt = this.stop(name);
        if (evt) {
            return evt.start();
        }
        return null;
    }

    /**
     * Get an event by name from our sections
     * @param {String} name The event name to check for
     * @returns {StopwatchEvent|null}
     */
    getEvent(name) {
        let section;
        for (section of this.sections) {
            if (section.hasEvent(name)) {
                return section.getEvent(name);
            }
        }
        return null;
    }

    /**
     * See if a section has an event by name
     * @param {String} name The event name to check for
     * @returns {boolean}
     */
    hasEvent(name) {
        for (let section of this.sections) {
            if (section.hasEvent(name)) {
                return true;
            }
        }
        return false;
    }

    /**
     * Ensure that all events in all sections are stopped
     * @returns {CompositeStopwatch}
     */
    ensureStopped() {
        for (let i = this.sections.length - 1; i >= 0; i--) {
            this.sections[i].ensureStopped();
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
            sections: this.sections.map(section => section.toJSON())
        };
    }
}

module.exports = CompositeStopwatch;