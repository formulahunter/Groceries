const express = require('express');
const path = require('path');

const host = '127.0.0.1';
const port = 8055;

const server = express();

//  designated landing pages
const pages = /\/?(Groceries|Meals|Recipes)/i;

//  check request for designated landing page
server.use((req, res, next) => {
    if(req.path.search(pages) >= 0) {
        res.sendFile(`${req.path}.html`, {root: path.join(__dirname, 'app')});
        return;
    }
    next();
});
//  check request for node package
server.use('/node_modules', express.static(path.join(__dirname, 'node_modules')));
server.use(express.static(path.join(__dirname, 'app')));

server.listen(port, host, () => {
    console.log(`serving files on ${host}:${port}`);
});