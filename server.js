const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs/promises');
const path = require('path');

const host = '127.0.0.1';
const port = 8055;

const server = express();

//  designated landing pages
const pages = /\/?(Groceries|Meals|Recipes)$/i;

//  parse POST request bodies and process as new data to be saved
server.post('/saveReceipt',
    bodyParser.urlencoded({ extended: false }),
    bodyParser.json(),
    async (req, res, next) => {
        // console.log(`POST request for: ${path.join(__dirname, 'app/src', req.url)}`);
        // console.log(`request body: ${JSON.stringify(req.body, null, ' ')}`);
        let result = await saveNewReceipt(req, res, next);
        if(result === 'internal_error') {
            res.sendStatus(500);
            return;
        }
        res.send({bytesWritten: result.bytesWritten});
    }
);
server.use((req, res, next) => {
    //  serve landing pages from app/
    if(req.path.search(pages) >= 0) {
        res.sendFile(`${req.path}.html`, {root: path.join(__dirname, 'app')});
        return;
    }
    next();
});
//  check request for node package
server.use('/node_modules',
    //  serve static files from node_modules/
    express.static(path.join(__dirname, 'node_modules')));
server.use(
    //  serve static files from app/
    express.static(path.join(__dirname, 'app'))
);

server.listen(port, host, () => {
    console.log(`serving files on ${host}:${port}`);
});



async function saveNewReceipt(req, res, next) {
    let dataFile = null;
    let data = null;
    try {
        dataFile = await fs.open('./app/data/receipts.json', 'r+');
        data = JSON.parse(await dataFile.readFile('utf-8'));
        data.receipts.push(req.body);
    }
    catch(er) {
        console.error(`error reading data file: ${er.toString()}`);
        if(dataFile !== null) {
            dataFile.close();
        }
        return 'internal_error';
    }

    let jstr = JSON.stringify(data, null, '  ');
    let result;
    try {
        result = dataFile.write(jstr, 0, 'utf-8');
    }
    catch(er) {
        console.error(`error writing data file: ${er.toString()}`);
        return 'internal_error'
    }
    finally {
        dataFile.close();
    }

    return result;
}