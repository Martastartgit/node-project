const { Transform } = require('stream');
const { User } = require('../database');

class WriteDataToDb extends Transform {
    constructor(options = {}) {
        options.objectMode = true;
        super(options);
        this.users = [];
    }

    _transform(record, enc, cb) {
        this.users.push(record);
        cb();
    }

    _flush = async (cb) => {
        try {
            await User.bulkCreate(this.users);
            cb();
        } catch (err) {
            console.log(err);
        }
    };
}

const writeDataToDb = new WriteDataToDb();
module.exports = writeDataToDb;
