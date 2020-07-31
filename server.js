const express = require('express');
const path = require('path');

const host = '127.0.0.1';
const port = 8055;

const server = express();

//  designated landing pages
const pages = /\/?(Groceries|Meals|Recipes)/i;

server.use((req, res, next) => {
    //  if the request is for one of the designated landing pages, serve it
    if(req.path.search(pages) >= 0) {
        res.sendFile(`${req.path}.html`, {root: path.join(__dirname, 'app')});
        return;
    }
    next();
});
server.use(express.static(path.join(__dirname, 'app')));

server.listen(port, host, () => {
    console.log(`serving files on ${host}:${port}`);
});