const { EventEmitter } = require('events');

const ProcessPool = require('./processPool');

const workers = new ProcessPool();

class SubsetSum extends EventEmitter {
    constructor(num) {
        super();
        this.number = num;
    }

    async start() {
        let worker;

        try {
            worker = await workers.acquire();
            worker.send(this.number);

            worker.once('message', (msg) => this.emit(msg.event, msg.data));
        } finally {
            workers.release(worker);
        }
    }
}

module.exports = SubsetSum;
