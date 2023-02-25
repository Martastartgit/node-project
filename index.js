const express = require('express');

const { SubsetSum } = require('./childProccessHelpers');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/sumAmount', ((req, res) => {
    const number = parseInt(req.body.number, 10);

    if (!Number.isFinite(number)) {
        return res.status(400).send('Value should be number');
    }

    const sum = new SubsetSum(number);

    sum.on('done', (data) => {
        res.send(`Sum: ${data}`);
    });

    sum.start();
}));

app.listen(5000, () => console.log('App listen 5000'));
