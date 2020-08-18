/**
 * Created by Hunter on 8/11/2018.
 */

import USDollar from './USDollar.mjs';
import GroceryReceipt from './GroceryReceipt.mjs';
// import DataStorage from '../../node_modules/@formulahunter/datastorage/src/index.mjs';
// const data = new DataStorage('groceries');

//  SKU's are parsed into an index by using their string representation as an index
//  When matching input, this index will have to be looped and all possible matches pushed too an array
//  This array should then be sorted by frequency, and the SKU with the most occurrences should be suggested first
//  If multiple SKUs match the pattern and have equal number of occurrences, there should be no preference for one or the other
const skuIndex = {};
const skuList = [];
let purchases = [];
let inputTable = null;
let historyTable = null;
function main() {
    inputTable = document.getElementById("input");
    historyTable = document.getElementById("history");

    configureInputTable();

    document.getElementById('date').focus();
    document.querySelectorAll('input[type="button"]')
            .forEach(el => el.addEventListener('click', saveList.bind(null, undefined)));

    fetchData();
}
function configureInputTable() {

    //     <tfoot>
    //         <tr class="add">
    //         <td colspan="9"><span>ADD DEPARTMENT</span></td>
    //     </tr>
    //     </tfoot>

    let inputHeader = inputTable.createTHead().insertRow(-1);
    let dateCell = inputHeader.insertCell(-1);
    dateCell.colSpan = 2;

    let dateInput = dateCell.appendChild(document.createElement("input"));
    dateInput.id = "date";
    dateInput.title = "date";
    dateInput.type = "date";
    dateInput.addEventListener("focus", deselectAll, false);

    let timeCell = inputHeader.insertCell(-1);

    let timeInput = timeCell.appendChild(document.createElement("input"));
    timeInput.id = "time";
    timeInput.title = "time";
    timeInput.type = "time";
    timeInput.addEventListener("focus", deselectAll, false);

    let locationCell = inputHeader.insertCell(-1);
    locationCell.colSpan = 5;

    let locationInput = locationCell.appendChild(document.createElement("input"));
    locationInput.id = "location";
    locationInput.title = "location";
    locationInput.type = "location";
    locationInput.value = 'ACME - 2nd & Girard';
    locationInput.addEventListener("focus", deselectAll, false);

    let accountCell = inputHeader.insertCell(-1);
    accountCell.colSpan = 3;

    let accountInput = accountCell.appendChild(document.createElement("input"));
    accountInput.id = "account";
    accountInput.title = "account";
    accountInput.type = "account";
    accountInput.value = 'Checking';
    accountInput.addEventListener("focus", deselectAll, false);

    let inputFooter = inputTable.createTFoot();
    let addRow = inputFooter.insertRow(-1);
    let addCell = addRow.insertCell(-1);
    addCell.colSpan = 10;

    let addLabel = addCell.appendChild(document.createElement("span"));
    addLabel.textContent = "ADD DEPARTMENT";

    let subtotalRow = inputFooter.insertRow(-1);
    subtotalRow.className = 'summary';

    let subtotalLabelCell = subtotalRow.insertCell(-1);
    subtotalLabelCell.colSpan = 8;

    let subtotalLabel = subtotalLabelCell.appendChild(document.createElement('span'));
    subtotalLabel.textContent = 'SUBTOTAL';

    let subtotalValueCell = subtotalRow.insertCell(-1);
    subtotalValueCell.className = 'cost';
    subtotalValueCell.colSpan = 2;

    let subtotalCurrencySymbol = subtotalValueCell.appendChild(document.createElement('span'));
    subtotalCurrencySymbol.textContent = '$';

    let subtotalValue = subtotalValueCell.appendChild(document.createElement('span'));
    subtotalValue.id = 'form-subtotal';
    subtotalValue.name = 'subtotal';
    subtotalValue.textContent = '0.00';

    let taxRow = inputFooter.insertRow(-1);
    taxRow.className = 'summary';

    let taxLabelCell = taxRow.insertCell(-1);
    taxLabelCell.colSpan = 8;

    let taxLabel = taxLabelCell.appendChild(document.createElement('span'));
    taxLabel.textContent = 'TAX';

    let taxValueCell = taxRow.insertCell(-1);
    taxValueCell.className = 'cost';
    taxValueCell.colSpan = 2;

    let taxCurrencySymbol = taxValueCell.appendChild(document.createElement('span'));
    taxCurrencySymbol.textContent = '$';

    let taxValue = taxValueCell.appendChild(document.createElement('span'));
    taxValue.id = 'form-tax';
    taxValue.name = 'tax';
    taxValue.textContent = '0.00';

    let totalRow = inputFooter.insertRow(-1);
    totalRow.className = 'summary';

    let totalLabelCell = totalRow.insertCell(-1);
    totalLabelCell.colSpan = 8;

    let totalLabel = totalLabelCell.appendChild(document.createElement('span'));
    totalLabel.textContent = 'TOTAL';

    let totalValueCell = totalRow.insertCell(-1);
    totalValueCell.className = 'cost';
    totalValueCell.colSpan = 2;

    let totalCurrencySymbol = totalValueCell.appendChild(document.createElement('span'));
    totalCurrencySymbol.textContent = '$';

    let totalValue = totalValueCell.appendChild(document.createElement('span'));
    totalValue.id = 'form-total';
    totalValue.name = 'total';
    totalValue.textContent = '0.00';

    addRow.addEventListener("click", addDepartment, false);
    addRow.dispatchEvent(new Event('click'));
}

function addDepartment(ev) {
    ev.stopPropagation();
    ev.preventDefault();

    let newDept = document.createElement("tbody");
    inputTable.insertBefore(newDept, inputTable.tFoot);

    //  DEPARTMENT ROW
    let deptRow = newDept.insertRow(-1);
    deptRow.className = "department";

    let deptDelCell = deptRow.insertCell(-1);
    let deptDelLabel = deptDelCell.appendChild(document.createElement("span"));
    deptDelLabel.textContent = "(-)";
    deptDelLabel.addEventListener("click", deleteDepartment, false);

    let deptCell = deptRow.insertCell(-1);
    deptCell.colSpan = 9;

    let deptLabel = deptCell.appendChild(document.createElement("span"));
    deptLabel.textContent = "DEPARTMENT";
    deptLabel.contentEditable = true;
    deptLabel.addEventListener("focus", selectInput, false);
    deptLabel.addEventListener("blur", populate.bind(deptLabel, "DEPARTMENT"), false);

    //  ADD ROW
    let addRow = newDept.insertRow(-1);
    addRow.className = "add";
    addRow.addEventListener("click", addProduct, false);

    let addCell = addRow.insertCell(-1);
    addCell.colSpan = 10;

    let addLabel = addCell.appendChild(document.createElement("span"));
    addLabel.textContent = "ADD PRODUCT";

    addRow.dispatchEvent(new Event("click"));

    deptLabel.focus();
}
function addProduct(ev) {
    ev.stopPropagation();
    ev.preventDefault();

    let newProd = document.createElement("tr");
    let parent = ev.currentTarget.parentElement;
    parent.insertBefore(newProd, ev.currentTarget);

    let delCell = newProd.insertCell(-1);
    let delLabel = delCell.appendChild(document.createElement("span"));
    delLabel.textContent = "(-)";
    delLabel.addEventListener("click", deleteProduct, false);

    let skuCell = newProd.insertCell(-1);
    let skuLabel = skuCell.appendChild(document.createElement("span"));
    skuLabel.textContent = "SKU";
    skuLabel.contentEditable = true;
    skuLabel.addEventListener("focus", selectInput, false);
    // skuLabel.addEventListener("blur", populate.bind(skuLabel, "SKU"), false);
    skuLabel.addEventListener("keydown", checkSKUIndex.bind(skuLabel), false);

    let descCell = newProd.insertCell(-1);
    let descLabel = descCell.appendChild(document.createElement("span"));
    descLabel.textContent = "DESCRIPTION";
    descLabel.contentEditable = true;
    descLabel.addEventListener("focus", selectInput, false);
    descLabel.addEventListener("blur", populate.bind(descLabel, "DESCRIPTION"), false);

    let qtyCell = newProd.insertCell(-1);
    let qtyLabel = qtyCell.appendChild(document.createElement("span"));
    qtyLabel.className = 'qty';
    qtyLabel.textContent = "QTY";
    qtyLabel.contentEditable = true;
    qtyLabel.addEventListener("focus", selectInput, false);
    qtyLabel.addEventListener("blur", populate.bind(qtyLabel, "QTY"), false);
    qtyLabel.addEventListener('input', updateExtProductCost);

    let unitCell = newProd.insertCell(-1);
    let unitLabel = unitCell.appendChild(document.createElement("span"));
    unitLabel.textContent = "UNIT";
    unitLabel.contentEditable = true;
    unitLabel.addEventListener("focus", selectInput, false);
    unitLabel.addEventListener("blur", populate.bind(unitLabel, "UNIT"), false);

    let priceCell = newProd.insertCell(-1);
    let priceLabel = priceCell.appendChild(document.createElement("span"));
    priceLabel.className = 'price';
    priceLabel.textContent = "PRICE";
    priceLabel.contentEditable = true;
    priceLabel.addEventListener("focus", selectInput, false);
    priceLabel.addEventListener("blur", populate.bind(priceLabel, "PRICE"), false);
    priceLabel.addEventListener('input', updateExtProductCost);

    let codeCell = newProd.insertCell(-1);
    let codeLabel = codeCell.appendChild(document.createElement("span"));
    codeLabel.textContent = "CODE";
    codeLabel.contentEditable = true;
    codeLabel.addEventListener("focus", selectInput, false);
    codeLabel.addEventListener("blur", populate.bind(codeLabel, "CODE"), false);

    let taxCell = newProd.insertCell(-1);
    let taxLabel = taxCell.appendChild(document.createElement("span"));
    taxLabel.className = 'taxed';
    taxLabel.textContent = "TAXED";
    taxLabel.contentEditable = true;
    taxLabel.addEventListener("focus", selectInput, false);
    taxLabel.addEventListener("blur", populate.bind(taxLabel, "TAXED"), false);
    taxLabel.addEventListener('input', updateExtProductCost);

    let discCell = newProd.insertCell(-1);
    let discLabel = discCell.appendChild(document.createElement("span"));
    discLabel.textContent = "DISCOUNT";
    discLabel.contentEditable = true;
    discLabel.addEventListener("focus", selectInput, false);
    discLabel.addEventListener("blur", populate.bind(discLabel, "DISCOUNT"), false);

    let extCell = newProd.insertCell(-1);
    let extCurrencyLabel = extCell.appendChild(document.createElement('span'));
    extCurrencyLabel.textContent = '$';

    let extLabel = extCell.appendChild(document.createElement("span"));
    extLabel.className = 'ext';
    extLabel.textContent = '-.--';
    extLabel.addEventListener('input', updateTotalCost);

    newProd.addEventListener('keypress', addRowsOnEnter);

    skuLabel.focus();
}

function addRowsOnEnter(ev) {
    if(ev.key.toUpperCase() === 'ENTER') {
        ev.stopPropagation();
        ev.preventDefault();

        if(ev.shiftKey) {
            //  emulate a click on the 'ADD DEPARTMENT' row
            inputTable.tFoot.rows[0].dispatchEvent(new Event('click'));
        }
        else {
            //  emulate a click on the 'ADD PRODUCT' row in the current <tbody>
            let tbody = ev.currentTarget.parentElement;
            tbody.rows[tbody.rows.length - 1].dispatchEvent(new Event('click'));
        }
    }
}

function updateExtProductCost(ev) {
    let prodRow = ev.target.closest('tr');
    let qty = Number(prodRow.querySelector('span.qty').textContent);
    let price = Number(prodRow.querySelector('span.price').textContent);
    let taxed = prodRow.querySelector('span.taxed').textContent === 'Y';

    if(isNaN(qty) || isNaN(price)) {
        prodRow.querySelector('span.ext').textContent = '-.--';
        return;
    }

    let ext = qty * price;
    if(taxed) {
        ext *= 1.08;
    }
    ext = Math.round(ext * 100).toFixed(0);
    prodRow.querySelector('span.ext').textContent = `${ext.substring(0, ext.length - 2)}.${ext.substring(ext.length - 2)}`;

    updateTotalCost();
}
function updateTotalCost(ev) {

    let total = 0;
    for(let tbody of inputTable.querySelectorAll('tbody')) {
        for(let row of tbody.rows) {
            let extLabel = row.querySelector('span.ext');
            if(extLabel === null) {
                continue;
            }
            let ext = Number(extLabel.textContent.replace('$', ''));
            if(!isNaN(ext)) {
                total += ext;
            }
        }
    }

    total = Math.round(total * 100).toFixed(0);
    inputTable.querySelector('#form-total').textContent = `${total.substring(0, total.length - 2)}.${total.substring(total.length - 2)}`;
}

function selectInput(ev) {
    let range = document.createRange();
    range.selectNodeContents(ev.target);

    let sel = deselectAll();
    sel.addRange(range);
}
function deselectAll() {
    let sel = window.getSelection();
    sel.removeAllRanges();
    return sel;
}
function populate(val, ev) {

    if(this.textContent === "") {
        this.textContent = val;
        return false;
    }

    if(val !== 'SKU')
        return false;

    input = [{char: '', matches: skuList}];

    let prod = skuIndex[this.textContent];
    if(!prod)
        return false;

    let row = this.parentNode.parentNode;
    row.cells[2].childNodes[0].textContent = prod.desc;
    row.cells[3].childNodes[0].textContent = prod.qty;
    row.cells[4].childNodes[0].textContent = prod.unit;
    row.cells[5].childNodes[0].textContent = prod.price;
    row.cells[6].childNodes[0].textContent = prod.code;
    row.cells[7].childNodes[0].textContent = prod.tax;
    row.cells[8].childNodes[0].textContent = prod.disc;

    return false;
}

let input = [{char: '', matches: skuList}];
function checkSKUIndex(ev) {
    //  Don't interfere with ctrl, shift, alt, meta keys
    if(ev.ctrlKey || ev.shiftKey || ev.altKey || ev.metaKey)
        return false;

    //  Don't interfere with tab key (advance to next input field)
    if(ev.key.toLowerCase() === 'tab')
        return false;

    //  At this point, only three valid cases:
    //   1) Numeric key - add digit to input array, search index for new suggestion, and reset selection accordingly
    //   2) Backspace - remove the last character from the input array and reset the selection without searching index for new suggestion
    //   3) Delete - Clear suggested text from input field and set cursor at the end of the manually typed input

    //  Take full control of the keydown operation
    ev.stopPropagation();
    ev.preventDefault();

    let filter = new RegExp('[0-9]');
    if(filter.test(ev.key)) {
        //  Create new input entry for the keyed digit
        let entry = {char: ev.key, matches: []};

        //  Add entry to input array
        input.push(entry);

        //  Compile manually typed characters into a string
        let sku = input.reduce((accum, curr) => {return accum + curr.char}, '');

        //  Filter matches from the previous entry
        // let regex = RegExp(str);
        entry.matches = input[sku.length-1].matches.filter((el)=>el.sku.search(sku) === 0);

        //  Determine suggested SKU and populate input
        if(entry.matches.length > 0)
            sku += entry.matches[0].sku.slice(sku.length);

        this.textContent = sku;
    }
    else if(ev.key.toLowerCase() === 'backspace') {
        //  Pop last character off input array and adjust selection, but don't re-check index

        //  If input is empty, do nothing
        if(input.length === 1)
            return false;

        //  Remove last digit from input array
        input.pop();
    }
    else if(ev.key.toLowerCase() === 'delete') {
        //  Leave input intact but clear suggested text and simply set cursor at end of input
        let sel = window.getSelection();
        sel.deleteFromDocument();
        return false;
    }
    else {
        return false;
    }

    //  Reset selection based on contents of input array so that the suggested portion of the SKU is highlighted
    let range = document.createRange();
    range.setStart(this.childNodes[0], input.length-1);
    range.setEnd(this.childNodes[0], this.textContent.length);

    let sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);

    return false;
}

function deleteDepartment(ev) {
    let dept = ev.target.parentElement.parentElement.parentElement;
    if(confirm("Delete " + dept.rows[0].cells[1].children[0].textContent + "?")) {
        inputTable.removeChild(dept);
    }
}
function deleteProduct(ev) {
    let prod = ev.target.parentElement.parentElement;
    let tbody = prod.parentElement;
    if(confirm("Delete " + prod.cells[2].children[0].textContent + "?")) {
        tbody.removeChild(prod);
    }
}

async function fetchData() {

    let res = await fetch('data/receipts.json', {
        method: 'GET',
        headers: {
            'Accept': 'application/json'
        }
    });
    let json = await res.json();
    purchases = json.receipts.map(dat => {
        let receipt = new GroceryReceipt();
        receipt.date = new Date(dat.date);
        receipt.location = dat.location;
        receipt.account = dat.account;
        receipt.departments = dat.departments;

        //  calculate the total cost of the purchase
        let total = 0;
        for(let dept of receipt.departments) {
            for(let prod of dept.products) {
                let inc = prod.qty * prod.price;
                if(prod.tax === 'Y') {
                    inc *= 1.08;
                }
                inc = Math.round(inc * 100) / 100;
                total += inc;
            }
        }
        receipt.total = new USDollar(total);

        return receipt;
    });
    populateHistory(purchases);
}
function populateHistory(data) {
    //  Show a table with summary data for each purchase, with ability to expand each one to show all details
    let tbody = historyTable.tBodies[0];

    for(let purc of data) {
        let row = tbody.insertRow(-1);
        row.className = "purchase";

        let dateCell = row.insertCell(-1);
        let dateLabel = dateCell.appendChild(document.createElement("span"));
        dateLabel.textContent = purc.date.toDateString();

        let timeCell = row.insertCell(-1);
        let timeLabel = timeCell.appendChild(document.createElement("span"));
        timeLabel.textContent = purc.date.toLocaleTimeString();

        let locationCell = row.insertCell(-1);
        let locationLabel = locationCell.appendChild(document.createElement("span"));
        locationLabel.textContent = purc.location;

        let totalCell = row.insertCell(-1);
        totalCell.style.textAlign = 'right';
        totalCell.style.paddingRight = '.5em';
        let totalLabel = totalCell.appendChild(document.createElement("span"));
        totalLabel.textContent = purc.total;

        let accountCell = row.insertCell(-1);
        let accountLabel = accountCell.appendChild(document.createElement("span"));
        accountLabel.textContent = purc.account;
    }
}

/** `POST` a `GroceryReceipt` object to be saved on the server
 *
 * **Note**: the `receipt` argument is included so that this function may be
 * called as a utility in addition to being used as the 'Save' button event
 * handler. In the latter case, the event listener must be added by passing this
 * function using bind(null, undefined); the second argument displaces the event
 * argument passed to handlers by default, ensuring that the event itself is not
 * erroneously `POST`ed to the server as the receipt
 *
 * @param {GroceryReceipt?} receipt - (optional) receipt to be saved. if not
 *                          provided, one will be constructed by parsing the
 *                          input table
 * @returns {Promise<{bytesWritten: Number}>}
 */
async function saveList(receipt) {

    if(!confirm('Save receipt as entered?')) {
        return;
    }

    // console.log('saving receipt');
    if(receipt === undefined) {
        receipt = parseInput();
    }
    // console.log('saving receipt: %o', receipt);

    let response = await fetch('saveReceipt', {
        port: 8055,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(receipt)
    });
    let result = await response.json();
    if(!result.bytesWritten) {
        console.debug('server response: %o', response);
        console.debug('json result: %o', result);
        throw new Error('error saving receipt: invalid response received from server');
    }

    return result;
}
function parseInput() {

    let receipt = new GroceryReceipt();

    let dateText = document.getElementById("date").value
    let timeText = document.getElementById("time").value;
    receipt.date = new Date(`${dateText} ${timeText}`);

    receipt.location = document.getElementById("location").value;
    receipt.account = document.getElementById("account").value;
    receipt.departments = [];

    for(let deptRow of inputTable.tBodies) {

        let department = {
            name: deptRow.rows[0].cells[1].children[0].textContent,
            products: []
        };

        for(let prodRow of deptRow.rows) {
            //  skip department and "add" rows
            if(prodRow.className === "department" || prodRow.className === "add") {
                continue;
            }

            department.products.push({
                sku: prodRow.cells[1].children[0].textContent,
                desc: prodRow.cells[2].children[0].textContent,
                qty: Number(prodRow.cells[3].children[0].textContent),
                unit: prodRow.cells[4].children[0].textContent,
                price: Number(prodRow.cells[5].children[0].textContent),
                code: prodRow.cells[6].children[0].textContent,
                tax: prodRow.cells[7].children[0].textContent,
                disc: prodRow.cells[8].children[0].textContent
            });
        }

        receipt.departments.push(department);
    }

    return receipt;
}

function clearInput() {
    for(let dept of inputTable.tBodies) {
        inputTable.removeChild(dept);
    }

    inputTable.tFoot.dispatchEvent(new Event("click"));
}


main();