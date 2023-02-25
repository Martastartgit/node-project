const { Transform } = require('stream');

class TransformAmount extends Transform {
    constructor(opts) {
        super({ objectMode: true, ...opts });
    }

    _transform(chunk, enc, cb) {
        this.push({
            ...chunk,
            amount: chunk.amount * 100
        });
        cb();
    }
}
const transformAmount = new TransformAmount();
module.exports = transformAmount;
