const express = require('express');

const host = '127.0.0.1';
const port = 8055;

const server = express();
server.use(express.static('app'));

server.listen(port, host, () => {
    console.log(`serving files on ${host}:${port}`);
})