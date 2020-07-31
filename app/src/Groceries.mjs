/**
 * Created by Hunter on 8/11/2018.
 */

import DataStorage from '../../node_modules/@formulahunter/datastorage/src/index.mjs';

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
    configureInputTable();
    inputTable.tFoot.dispatchEvent(new Event("click"));
    document.getElementById("date").focus();

    fetchData();
}
function configureInputTable() {
    inputTable = document.getElementById("input");
    historyTable = document.getElementById("history");

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
    accountCell.colSpan = 2;

    let accountInput = accountCell.appendChild(document.createElement("input"));
    accountInput.id = "account";
    accountInput.title = "account";
    accountInput.type = "account";
    accountInput.value = 'Checking';
    accountInput.addEventListener("focus", deselectAll, false);

    let inputFooter = inputTable.createTFoot().insertRow(-1);
    let addCell = inputFooter.insertCell(-1);
    addCell.colSpan = 9;

    let addLabel = addCell.appendChild(document.createElement("span"));
    addLabel.textContent = "ADD DEPARTMENT";

    inputTable.tFoot.addEventListener("click", addDepartment, false);
}

function addDepartment(ev) {
    ev.stopPropagation();
    ev.preventDefault();

    let newDept = document.createElement("tbody");
    inputTable.insertBefore(newDept, ev.currentTarget);

    //  DEPARTMENT ROW
    let deptRow = newDept.insertRow(-1);
    deptRow.className = "department";

    let deptDelCell = deptRow.insertCell(-1);
    let deptDelLabel = deptDelCell.appendChild(document.createElement("span"));
    deptDelLabel.textContent = "(-)";
    deptDelLabel.addEventListener("click", deleteDepartment, false);

    let deptCell = deptRow.insertCell(-1);
    deptCell.colSpan = 8;

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
    addCell.colSpan = 9;

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
    skuLabel.addEventListener("blur", populate.bind(skuLabel, "SKU"), false);
    skuLabel.addEventListener("keydown", checkSKUIndex.bind(skuLabel), false);

    let descCell = newProd.insertCell(-1);
    let descLabel = descCell.appendChild(document.createElement("span"));
    descLabel.textContent = "DESCRIPTION";
    descLabel.contentEditable = true;
    descLabel.addEventListener("focus", selectInput, false);
    descLabel.addEventListener("blur", populate.bind(descLabel, "DESCRIPTION"), false);

    let qtyCell = newProd.insertCell(-1);
    let qtyLabel = qtyCell.appendChild(document.createElement("span"));
    qtyLabel.textContent = "QTY";
    qtyLabel.contentEditable = true;
    qtyLabel.addEventListener("focus", selectInput, false);
    qtyLabel.addEventListener("blur", populate.bind(qtyLabel, "QTY"), false);

    let unitCell = newProd.insertCell(-1);
    let unitLabel = unitCell.appendChild(document.createElement("span"));
    unitLabel.textContent = "UNIT";
    unitLabel.contentEditable = true;
    unitLabel.addEventListener("focus", selectInput, false);
    unitLabel.addEventListener("blur", populate.bind(unitLabel, "UNIT"), false);

    let priceCell = newProd.insertCell(-1);
    let priceLabel = priceCell.appendChild(document.createElement("span"));
    priceLabel.textContent = "PRICE";
    priceLabel.contentEditable = true;
    priceLabel.addEventListener("focus", selectInput, false);
    priceLabel.addEventListener("blur", populate.bind(priceLabel, "PRICE"), false);

    let codeCell = newProd.insertCell(-1);
    let codeLabel = codeCell.appendChild(document.createElement("span"));
    codeLabel.textContent = "CODE";
    codeLabel.contentEditable = true;
    codeLabel.addEventListener("focus", selectInput, false);
    codeLabel.addEventListener("blur", populate.bind(codeLabel, "CODE"), false);

    let taxCell = newProd.insertCell(-1);
    let taxLabel = taxCell.appendChild(document.createElement("span"));
    taxLabel.textContent = "TAXED";
    taxLabel.contentEditable = true;
    taxLabel.addEventListener("focus", selectInput, false);
    taxLabel.addEventListener("blur", populate.bind(taxLabel, "TAXED"), false);

    let discCell = newProd.insertCell(-1);
    let discLabel = discCell.appendChild(document.createElement("span"));
    discLabel.textContent = "DISCOUNT";
    discLabel.contentEditable = true;
    discLabel.addEventListener("focus", selectInput, false);
    discLabel.addEventListener("blur", populate.bind(discLabel, "DISCOUNT"), false);

    skuLabel.focus();
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

function fetchData() {
    let request = new XMLHttpRequest();
    request.onreadystatechange = function() {
        if(this.readyState === 4 && this.statusText === "OK") {
            purchases = parseXML(this.responseXML);
            populateHistory(purchases);
        }
    };

    let now = new Date(0);
    request.open("GET", "data.xml");
    request.setRequestHeader("If-Modified-Since", now.toUTCString());
    request.send();
}
function parseXML(doc) {
    //  Create index of SKU's to be used for auto-fill
    //  Create a chronological index of purchases to populate history table
    let prch = [];

    let lists = doc.getElementsByTagName("purchase");
    for (let purcEl of lists) {
        let dateTxt = purcEl.getElementsByTagName("date")[0].textContent;
        let timeTxt = purcEl.getElementsByTagName("time")[0].textContent;
        let purc = {
            date: new Date(dateTxt),
            time: new Date(`1970-01-01 ${timeTxt}`),
            location: purcEl.getElementsByTagName("location")[0].textContent,
            account: purcEl.getElementsByTagName("account")[0].textContent,
            total: 0,
            departments: []
        };
        purc.date.setHours(purc.date.getHours()+purc.date.getTimezoneOffset()/60)
        prch.push(purc);

        let departments = purcEl.getElementsByTagName("department");
        for(let deptEl of departments) {
            let dept = {
                name: deptEl.getAttribute("name"),
                products: []
            };
            purc.departments.push(dept);

            let products = deptEl.getElementsByTagName("product");
            for(let prodEl of products) {
                let prod = {
                    sku: String(prodEl.getElementsByTagName("sku")[0].textContent),
                    desc: prodEl.getElementsByTagName("description")[0].textContent,
                    qty: prodEl.getElementsByTagName("quantity")[0].textContent,
                    unit: prodEl.getElementsByTagName("unit")[0].textContent,
                    price: prodEl.getElementsByTagName("price")[0].textContent,
                    code: prodEl.getElementsByTagName("code")[0].textContent,
                    tax: prodEl.getElementsByTagName("taxed")[0].textContent,
                    disc: prodEl.getElementsByTagName("discount")[0].textContent,
                };
                dept.products.push(prod);
                //  There could potentially be some optimization for memory done here to avoid creating redundant objects for a single SKU, but it may well be worth waiting to see if a single SKU's product description price, etc. remain constant in the long term. Even if a product's price changes over time, a different approach would be necessary for this optimization.

                //  Sum purchase price
                //  Check accuracy of this calculation
                if(prod.tax === "Y") {
                    let tax = 1.08;
                    purc.total += Math.round(Number(prod.price)*Number(prod.qty)*100*tax)/100;
                }
                else {
                    purc.total += Math.round(Number(prod.price)*Number(prod.qty)*100)/100;
                }
                if(dateTxt === '2018-04-04')
                    console.log(`${prod.desc}\n${prod.qty} @ ${prod.price} = ${prod.price*prod.qty}\n${purc.total}`);

                if(!skuIndex[prod.sku]) {
                    skuIndex[prod.sku] = prod;
                    skuList.push(prod);
                    prod.count = 1;
                }
                else {
                    skuIndex[prod.sku].count++;
                }
                //  Notice that the skuIndex only keeps track of the first object defined for a given SKU. If the same SKU appears again in a subsequent purchase, the purchases entry will refer to a new object instantiated for the second appearance though the skuIndex will maintain reference only to the first index, and its count will be incremented. The counts are in fact the reason for this apparent inconsistency -- defining the count on each instance would be self-defeating as each instance would have count of 1. As noted above, there is likely some optimization to be realized here, but that is left for a later date.
            }
        }

        //  Convert purchase total to USDollar instance for display
        purc.total = new USDollar(purc.total);
    }

    //  Sort the skuList by frequency
    skuList.sort((a,b)=>b.count-a.count);

    //  Return a data structure to populate history table
    prch.sort((a, b)=>{if(b.date===a.date){return b.time-a.time}else{return b.date-a.date}});
    return prch;
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
        timeLabel.textContent = purc.time.toLocaleTimeString();

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

function saveList() {
    let str = getXMLString().replace(/&/g, "#amp#").replace("$", "&dollar;");

    let httpRequest = new XMLHttpRequest();
    httpRequest.onreadystatechange = function() {
        if(httpRequest.readyState === XMLHttpRequest.DONE) {
            if(httpRequest.statusText === "OK") {
                let text = httpRequest.responseText;
                let bytes = Number(text);
                if(!Number.isNaN(bytes)) {
                    console.log(`${str.length} string characters -> ${bytes} bytes`);
                    alert(`List recorded successfully`);
                    clearInput();

                    // finance.display.log.addTransaction(txn);
                }
                else if(text === "false") {
                    alert(`Error recording the list: 'fail' response received from server`);
                }
                else {
                    alert(`Error recording the list: unrecognized response received from server:\n${text}`);
                }
            }
            else {
                alert(`Error recording the list: XMLHttpRequest status code: ${httpRequest.status}`);
            }
        }
    };
    httpRequest.open("POST", "saveList.php");
    httpRequest.setRequestHeader("content-type", "application/x-www-form-urlencoded");
    httpRequest.send(`xmlStr=${str}`);
}
function getXMLString() {
    let xmlString = `<purchase>\n`;

    let date = document.getElementById("date").value;
    xmlString += `<date>${date}</date>\n`;

    let time = document.getElementById("time").value;
    xmlString += `<time>${time}</time>\n`;

    let location = document.getElementById("location").value;
    xmlString += `<location>${location}</location>\n`;

    let account = document.getElementById("account").value;
    xmlString += `<account>${account}</account>\n`;

    for(let dept of inputTable.tBodies) {
        let name = dept.rows[0].cells[1].children[0].textContent;
        xmlString += `<department name="${name}">\n`;

        for(let prod of dept.rows) {
            if(prod.className === "department" || prod.className === "add") {
                continue;
            }
            xmlString += `<product>\n`;

            let sku = prod.cells[1].children[0].textContent;
            xmlString += `<sku>${sku}</sku>\n`;

            let desc = prod.cells[2].children[0].textContent;
            xmlString += `<description>${desc}</description>\n`;

            let qty = prod.cells[3].children[0].textContent;
            xmlString += `<quantity>${qty}</quantity>\n`;

            let unit = prod.cells[4].children[0].textContent;
            xmlString += `<unit>${unit}</unit>\n`;

            let price = prod.cells[5].children[0].textContent;
            xmlString += `<price>${price}</price>\n`;

            let code = prod.cells[6].children[0].textContent;
            xmlString += `<code>${code}</code>\n`;

            let tax = prod.cells[7].children[0].textContent;
            xmlString += `<taxed>${tax}</taxed>\n`;

            let disc = prod.cells[8].children[0].textContent;
            xmlString += `<discount>${disc}</discount>\n`;

            xmlString += `</product>\n`;
        }

        xmlString += `</department>\n`;
    }

    xmlString += `</purchase>\n`;

    return xmlString;
}

function clearInput() {
    for(let dept of inputTable.tBodies) {
        inputTable.removeChild(dept);
    }

    inputTable.tFoot.dispatchEvent(new Event("click"));
}


main();