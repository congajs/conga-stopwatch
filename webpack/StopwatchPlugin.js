// core libs
const path = require('path');
const fs = require('fs');

/**
 * The StopwatchPlugin assists loading a version of the stopwatch lib in the browser
 * without having two copies of the library
 */
class StopwatchPlugin {
    /**
     *
     * @param {{dir:<String>, force:<Boolean>, logging:<Boolean>}} options
     */
    constructor(options) {
        this.options = options;
    }

    /**
     * Print a log message
     * @param {String} str
     * @returns {void}
     */
    log(str) {
        if (this.options.logging === undefined || this.options.logging) {
            console.log('>>> [ StopwatchPlugin ]', ...arguments);
        }
    }

    /**
     *
     * @param {Compiler} compiler
     */
    apply(compiler) {
        compiler.plugin('before-compile', (compilation, done) => {

            const dir = this.options.dir.replace(/\/+$/g, '') + '/';

            fs.stat(dir, (err, stats) => {
                if (err) {
                    console.error(err);
                    this.log('Errors were found!');
                    done();
                    return;
                }

                if (!stats.isDirectory()) {
                    this.log('Not a directory:', dir);
                    done();
                    return;
                }

                this.log('Valid directory:', dir);

                const copyDir = __dirname + '/../lib/';
                const overwriteDir = __dirname + '/lib/';

                // get a list of files in the dir we are copying from
                fs.readdir(copyDir, (err, files) => {

                    if (err) {
                        console.error(err);
                        this.log('Errors were found!');
                        done();
                        return;
                    }

                    const p = [];
                    for (const file of files) {
                        p.push(new Promise((resolve, reject) => {

                            // for each file, see if we have an overwrite copy
                            fs.stat(overwriteDir + file, (err, stats) => {
                                // if there's an overwrite copy, use that instead
                                let copyPath = overwriteDir + file;
                                if (err) {
                                    copyPath = copyDir + file;
                                }

                                const copyFile = (file, done) => {
                                    const read = fs.createReadStream(copyPath, {
                                        flags: 'r',
                                        encoding: 'binary'
                                    });
                                    const write = fs.createWriteStream(dir + file, {
                                        flags: 'w',
                                        encoding: 'binary'
                                    });
                                    read.on('error', err => {
                                        console.error(err);
                                        done();
                                    });
                                    write.on('error', err => {
                                        console.error(err);
                                        done();
                                    });
                                    write.on('pipe', src => {
                                        this.log('Writing file:', dir + file);
                                    });
                                    write.on('close', () => done());
                                    read.pipe(write);
                                };

                                // see if the destination file already exists
                                fs.stat(dir + file, (err, stats) => {
                                    if (err) {
                                        copyFile(file, () => resolve());
                                        return;
                                    }
                                    if (!this.options.force) {
                                        this.log('Skip existing file', copyPath);
                                        resolve();
                                        return;
                                    }
                                    this.log('Delete existing file', dir + file);
                                    fs.unlink(dir + file, err => {
                                        if (err) {
                                            console.error(err);
                                            resolve();
                                            return;
                                        }
                                        copyFile(file, () => resolve());
                                    });
                                });
                            });
                        }));
                    }

                    // wait for everything to finish and then report
                    Promise.all(p).then(() => {
                        this.log('Finished Copying Stopwatch Library');
                        done();
                    });

                });
            });

        });
    }
}

module.exports = StopwatchPlugin;