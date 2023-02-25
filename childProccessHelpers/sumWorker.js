const sumTo = (n) => (n * (n + 1)) / 2;

process.on('message', (msg) => {
    const sum = sumTo(msg);
    process.send({ event: 'done', data: sum });
});

process.send('ready');
