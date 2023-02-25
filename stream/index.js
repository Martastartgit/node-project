const { createReadStream } = require('fs');
const { parse } = require('csv-parse');
const { pipeline, PassThrough } = require('stream');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

const { transformAmount, writeDataToDb } = require('./helpers');

const csvParser = parse({ columns: true });

const contentStream = new PassThrough({ objectMode: true });

pipeline(
    createReadStream('emails.csv'),
    csvParser,
    transformAmount,
    contentStream,
    writeDataToDb,
    (err) => {
        if (err) {
            console.error(err);
            process.exit(1);
        }
    }
);
