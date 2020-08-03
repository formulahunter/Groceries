const fs = require('fs/promises');

async function saveNewReceipt(req, res, next) {
    let dataFile = null;
    let data = null;
    try {
        dataFile = await fs.open('../data/receipts.json', 'r+');
        data = await dataFile.readFile('utf-8');
        data.receipts.push(req.body);
    }
    catch(er) {
        console.error(`error reading data file: ${er.toString()}`);
        return 'internal_error';
    }

    let jstr = JSON.stringify(data, null, '  ');
    let result;
    try {
        result = dataFile.writeFile(jstr, 'utf-8');
        dataFile.close();
    }
    catch(er) {
        console.error(`error writing data file: ${er.toString()}`);
        return 'internal_error'
    }

    return result;
}