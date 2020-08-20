const express = require('express');
const bodyParser = require('body-parser');
const crypto = require('crypto');
const fs = require('fs/promises');
const path = require('path');

const host = '127.0.0.1';
const port = 8055;

const server = express();

const routes = {
    node_modules: express.Router(),
    groceries: express.Router()
};

//  the data file directory
const DATA_DIR = path.join(__dirname, 'app', 'data');
const FILE_PATH = path.join(DATA_DIR, 'groceries.json');

//  serve static files from /node_modules
routes.node_modules.get('/', (req, res) => {
    express.static(path.join(__dirname, 'node_modules'));
});

//  return groceries landing page for GET request to top-level '/groceries' dir
routes.groceries.get('/', (req, res) => {
    console.log('serving groceries landing page');
    res.sendFile('Groceries.html', {root: path.join(__dirname, 'app')});
});
//  return json data file (presently receipts.json) for GET request to /groceries/data
routes.groceries.get('/data', (req, res) => {
    console.log('serving groceries data file');
    res.sendFile('groceries.json', {root: DATA_DIR});
});

//  insert a body-parsing middleware function since all remaining methods carry payload
routes.groceries.use(express.json());

//  create/update a receipt record
routes.groceries.put('/receipt', async (req, res) => {

    try {
        //  get json object from request body
        const record = req.body; //  thanks to express.json()

        //  load json data file
        const data = await parseJsonFile(FILE_PATH);

        //  note whether a matching record already exists
        //  if so, save it in the 'last_overwrite.json' file
        const overwrite = data.receipts.findIndex(el => el.date === record.date);
        if (overwrite < 0) {
            data.receipts.unshift(record);
            data.receipts.sort(sortReceipts);
        } else {
            const oldRecord = data.receipts.splice(overwrite, 1, record)[0];
            await writeJsonFile(path.join(DATA_DIR, 'deleted_receipt.json'), oldRecord);
        }

        //  write new data to file
        const content = await writeJsonFile(FILE_PATH, data);

        //  compute hash digest of new file contents
        const hash = crypto.createHash('sha256');
        hash.update(content);
        const digest = hash.digest('hex');

        //  configure & send the response
        //  201: "CREATED" if new record created
        //  200: "OK" if existing record overwritten
        res.status(overwrite < 0 ? 201 : 200);
        res.json({hash: digest});
    }
    catch(er) {
        console.log(`error saving new receipt: ${er.toString()}`);
        console.log(er.stack);
        res.status(500).end();
    }
});
//  create/update a product record
routes.groceries.put('/product', (req, res) => {

});
//  create/update a department record
routes.groceries.put('/department', (req, res) => {

});
//  create/update a account record
routes.groceries.put('/account', (req, res) => {

});
//  create/update a location record
routes.groceries.put('/location', (req, res) => {

});

server.use('/node_modules', routes.node_modules);
server.use('/groceries', routes.groceries);


async function parseJsonFile(absolutePath) {
    try {
        return JSON.parse(await fs.readFile(absolutePath, 'utf8'));
    }
    catch(er) {
        er.message = `cannot parse json data file at: ${absolutePath}\n${er.message}`;
        throw er;
    }
}
async function writeJsonFile(absolutePath, content) {
    try {
        if(typeof content !== 'string') {
            content = JSON.stringify(content);
        }

        await fs.writeFile(absolutePath, content, 'utf8');
        return content;
    }
    catch(er) {
        er.message = `cannot write json data file at: ${absolutePath}\n${er.message}`;
        throw er;
    }
}

function sortReceipts(a, b) {
    return new Date(b.date) - new Date(a.date);
}


//  serve static files from app/
server.use(
    express.static(path.join(__dirname, 'app'))
);

server.listen(port, host, () => {
    console.log(`serving files on ${host}:${port}`);
});
