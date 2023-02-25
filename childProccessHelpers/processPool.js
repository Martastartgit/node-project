const childProcess = require('child_process');
const os = require('os');
const path = require('path');

class ProcessPool {
    constructor() {
        this.maxParallel = os.cpus().length;
        this.pool = [];
        this.active = [];
        this.waiting = [];
    }

    acquire() {
        return new Promise((resolve, reject) => {
            let worker;

            if (this.pool.length > 0) {
                worker = this.pool.pop();

                this.active.push(worker);

                resolve(worker);
                return;
            }

            if (this.active.length >= this.maxParallel) {
                this.waiting.push({ resolve, reject });
                return;
            }

            worker = childProcess.fork(path.resolve('childProccessHelpers', './sumWorker.js'));

            worker.once('message', (message) => {
                if (message === 'ready') {
                    this.active.push(worker);
                    return resolve(worker);
                }
                worker.kill();
                reject(new Error('Improper process start'));
            });
            worker.once('exit', (code) => {
                console.log(`Worker exited with code ${code}`);
                this.active = this.active.filter((w) => worker !== w);
                this.pool = this.pool.filter((w) => worker !== w);
            });
        });
    }

    release(worker) {
        if (this.waiting.length > 0) {
            const { resolve } = this.waiting.shift();
            return resolve(worker);
        }

        this.active = this.active.filter((w) => worker !== w);
        this.pool.push(worker);
    }
}
module.exports = ProcessPool;
