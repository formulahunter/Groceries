/**
 * Created by Hunter on 11/25/2018.
 */

class DataStorage {
    constructor() {
        this.ingredients = [];
        this.recipes = [];
        this.meals = [];
        this.groceryList = [];
        this.groceryReceipts = [];

        this.deleted = {};
        for(let key in this) {
            if(this.hasOwnProperty(key) && Array.isArray(this[key])) {
                this.deleted[key] = [];
            }
        }
    }


    /** For local storage access
     *    Returns `null` if data in local storage is not truthy
     *    Otherwise returns result of decrypt()
     */
    read(key) {
        //  All local data is encrypted
        let str;
        try {
            str = localStorage.getItem(key);
        }
        catch(er) {
            alert(`Error retrieving data from local storage: ${er}`);
            console.error(`Error retrieving data from local storage:\n${er}`);
        }

        if(str === null)
            return null;

        return this.decrypt(str);
    }
    /** For local storage access
     *    No return value
     */
    write(/* string */ key, /* string */ data) {
        //  Sync data before write
        try {
            // this.sync().then(function(result) {
            //     if(result === false)
            //         Promise.reject(`Unable to sync data -- aborting write to key '${key}'`);
            //
            // });
            this.sync();
            console.info(`Data synchronized in preparation for write to key '${key}'`);
        }
        catch (er) {
            // if (er instanceof DataReconcileError) {
                console.error(er);
                throw er;
            // }

            // console.warn(er);
        }

        let str = plan.data.encrypt(data);

        try {
            this.setLocal(key, str);
        }
        catch(er) {
            alert(`Error writing data to local storage: ${er}`);
            console.error(`Error writing data to local storage:\n${er}`);
            throw er;
        }

        return this.hash();
    }




    /** Sync local data with server
     *    Compare hash digests from both sources
     *    Initiate reconciliation if digests don't match
     *
     *    On success, return a Promise resolving to 'true'
     *    Throw an exception on failure
     *
     */
    sync() {
        console.info('Syncing local and remote data files');

        //  Remote hash
        let data = {query: 'hash'};
        let url = 'query.php';
        let headers = [{
            header: 'content-type',
            value: 'application/json;charset=UTF-8'
        }];
        let remote = this.xhrPost(data, url, headers)
            .then(function(result) {console.debug(`Remote data hash: ${result}`); return result;});
        // console.debug('remote hash:');
        // console.debug(remote);

        //  Local hash
        let local = this.hash()
            .then(function(result) {console.debug(`Local data hash: ${result}`); return result;});
        // console.debug('local hash:');
        // console.debug(local);

        return Promise.all([remote, local]).then((function([remote, local]) {
            if(local === remote) {
                let now = new Date;
                this.setLocal(`${DataStorage.key}-sync`, now.getTime().toString());
                console.info('Local and remote data synchronized');
                console.debug(`Successful sync on ${now.toLocaleString()}\nTimestamp: ${now.getTime()}`);

                return Promise.resolve(true);
            }

            //  Initiate data reconciliation
            console.info('Data discrepancy found -- attempting to reconcile');
            return this.reconcile().then(function(result) {
                if(!result) {
                    console.warn('Unable to reconcile data discrepancy');
                    return Promise.reject(false);
                }

                console.info('Data discrepancy resolved');
                console.info('Local and remote data synchronized');
                return Promise.resolve(true);
            });
        }).bind(this))
        .catch(function(reason) {
            console.warn(`Error encountered while synchronizing local and server data files: ${reason}`);
            throw (reason);
        });
    }
    reconcile() {
        //  Compile changes since lasySync: adds and edits, not deletes (not stored locally)

        //  Send to server resolve script
        //   - Server selects all activity since lastSync
        //   - Checks transmitted vs. selected activity for ID conflict
        //      - Resolve or return error code
        //   - Save new client activity to disk
        //   - Compute new server hash
        //   - Return selected activity and new hash
        //  Process returned adds & edits
        //    - Add server activity to data structure
        //   - Compute new local hash
        //  Calculate new hash and compare with server
        //  return false if inequal
        //  return true
        //  NOTE THAT THIS METHOD PRESENTLY ONLY DOWNLOADS NEW DATA TO MATCH SERVER FILE
        //  DATA STORED LOCALLY THAT HAS NOT YET BEEN SYNCED TO SERVER WILL NOT BE RECONCILED

        /**  Query local storage for most recent successful sync
         */
        let lastSync = Number(this.read(`${DataStorage.key}-sync`));

        /**  Compile local changes since last sync
         *   - To allow greater flexibility in extending DataStorage, this method will check members of every array defined on an own-property key
         *   - It is assumed that members of such arrays are data instances managed by the DatStorage instance
         */
        let instances = {};
        for(let key in this) {
            //  Iterate over own properties only
            if(!this.hasOwnProperty(key))
                continue;

            //  Skip properties that aren't arrays
            if(!Array.isArray(this[key]))
                continue;

            //  Skip the `deleted` key
            if(key === 'deleted')
                continue;

            //  Associate data instances with the key they are defined on
            //  Organization of data in the remote repository depends on this association
            //  Object literals are used as associative arrays to simplify some server-side operations
            //    - Object properties are the `.id` value of the instance referred to (equal to its `._created` value)
            instances[key] = {
                new: {},
                modified: {},
                deleted: {}
            };

            //  Add new and modified instances to the appropriate container array
            //  Note that instances that have been created *and* modified since last sync will be sent to the server as "new"
            //  Deleted instances will always be sent as "deleted"
            for(let inst of this[key]) {
                if(inst._created > lastSync)
                    instances[key].new[inst.id] = inst;
                else if(inst._modified > lastSync)
                    instances[key].modified[inst.id] = inst;
            }
            for(let inst of this.deleted[key]) {
                if(inst._deleted > lastSync)
                    instances[key].deleted[inst._created] = inst;
            }

            //  Clean up `instances` to minimize unnecessary data transmission
            //  Also prevents server from having to iterate over empty data sets
            let newCount = Object.keys(instances[key].new).length;
            let modCount = Object.keys(instances[key].modified).length;
            let delCount = Object.keys(instances[key].deleted).length;
            if(newCount === 0 && modCount === 0 && delCount === 0) {
                delete instances[key];
            }
            else {
                if(newCount === 0)
                    delete instances[key].new;
                if(modCount === 0)
                    delete instances[key].modified;
                if(delCount === 0)
                    delete instances[key].deleted;
            }
        }

        /** Query server for any changes since last sync
         *  - New and modified but not deleted (?)
         *  - Server will return changes and new hash value (after adding local changes sent with request)
         */
        let data = {
            query: 'reconcile',
            data: {
                lastSync: lastSync,
                instances: instances
            }
        };
        let url = 'query.php';
        let headers = [{
            header: 'content-type',
            value: 'application/json;charset=UTF-8'
        }];

        /*return this.xhrPost(data, url, headers).then(function(response) {
            //  Parse JSON text returned by server
            let data = JSON.parse(response);

            //  Add new transactions
            data.new.forEach(function(newTxn) {
                // let txn = Transaction.fromJSON(newTxn);
                // try {
                //     Finance.addTransaction(txn);
                // }
                // catch(er) {
                //     alert(`Error adding new transaction: ${er}`);
                // }
                // alert(txn.title);
            });

            //  Replace modified transactions
            data.modified.forEach(function(modTxn) {
                // let txn = Transaction.fromJSON(modTxn);
                // Finance.replaceTransaction(txn);
            });

            //  Remove deleted transactions
            data.deleted.forEach(function(created) {
                // Finance.removeTransaction(created);
            });

            //	Sort transactions most recent first (lower index)
            // Finance.sortTransactions();

            //  Compare the new local and remote hashes
            //  Assume both have changed
            return this.hash() === data.hash;
        }.bind(this));*/
        console.warn('Data to be sent to reconciliation script: %o', data);
        alert(`Data to be sent to reconciliation script: \n${JSON.stringify(data)}`);
    }




    /** For computing hash digest of string values
     *    String to be hashed may be provided
     *    If not, data in local storage is serialized and hashed
     *    Algorithm may be specified; defaults to SHA-256
     *
     *    Adopted from MDN SubtleCrypto.digest() reference:
     *    https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/digest#Example
     *
     */
    hash(str, alg = 'SHA-256') {
        if(!str)
            str = this.read(`${DataStorage.key}-data`);

        // console.debug(`Compute hash digest of ${typeof str === 'string' ? `string (length ${str.length})` : `${typeof str}`} using ${alg} algorithm\nvalue: ${str}`);

        //  SubtleCrypto.digest() returns a Promise, so this function needs only to return that promise
        let buf = new TextEncoder('utf-8').encode(str);

        return crypto.subtle.digest(alg, buf).then((function(cipherBuf) {
            return new Promise((function(resolve, reject) {
                resolve(this.getString(cipherBuf));
            }).bind(this));
        }).bind(this));
    }




    /** For network requests
     *    Arguments are string URL and optional array of key-value objects as request headers
     *    Returns a Promise which resolves to network response if successful
     */
    //  Issue GET request to a given URL with optional header(s)
    //  Return a Promise which resolves to the response to the request or an indication of why it failed
    xhrGet(url, headers = []) {
        return new Promise(function(resolve, reject) {
            //  Open a new XHR request
            let request = new XMLHttpRequest();

            request.onerror = function(er) {
                console.warn(`Data file GET request for ${filename} encountered an error: ${er}`);
            };

            //  Notice that the request is opened before the `load` event handler is defined
            //  This is done to simplify the onload handler
            request.open('GET', url);

            //  Set headers if provided
            headers.forEach(function({header: header, value: value}) {
                request.setRequestHeader(header, value);
            });

            //  Define the onload handler
            //  Since this function is defined after the request is opened, it does not need to check the readyState property of the request
            //   - Opening a request causes the onload event to fire a few times, at which point the readyState property reflects an earlier phase of the request cycle
            request.onload = function () {
                if (this.statusText === 'OK') {
                    let response;
                    if(request.responseXML !== null)
                        response = request.responseXML;
                    else
                        response = request.responseText;

                    resolve(response);
                }
                else {
                    reject(new Error(request.response));
                }
            };
        });
    }

    //  Issue a POST request with given data to a given URL with an optional header(s)
    //  Return a Promise which resolves to the response to the request or an indication of why it failed
    xhrPost(data, url, headers = []) {
        let body = this.serialize(data);

        return new Promise(function(resolve, reject) {
            //  Open a new XHR request
            //  Notice that the request is opened immediately
            //  This is done to simplify the onload handler
            let request = new XMLHttpRequest();
            request.open('POST', url);

            //  Set request headers if provided
            headers.forEach(function({header: header, value: value}) {
                request.setRequestHeader(header, value);
            });

            //  The onload event handler fires only once the full response has been received (i.e. readystate===4 and statusText===OK)
            request.onload = function () {
                if (this.statusText === 'OK') {
                    let response;
                    if(request.responseXML !== null) {
                        response = request.responseXML;
                    }
                    else {
                        response = request.responseText;
                    }

                    resolve(response);
                }
                else {
                    reject(new Error(request.response));
                }
            };

            //  Also monitor for network errors (different from bad request status checked in 'onload')
            //  e.g. poor network connection and no response received, a.k.a. 'request timed out'
            request.onerror = function(er) {
                console.debug(`POST request encountered an error: ${er}`);
                reject(new Error(`Network error: ${er}`));
            };

            // console.debug(`POST request body: ${body}`);

            // console.debug(`Sending POST request: ${request}`);
            request.send(body);
        });
    }


    /** Cryptography methods
     *    Convenience methods
     *    Presently just aliases for SJCL.encrypt() and SJCL.decrypt()
     *
     */
    encrypt(data, password = 'password') {
        return sjcl.encrypt(password, data);
    }
    decrypt(cipher, password = 'password') {
        return sjcl.decrypt(password, cipher);
    }

    getString(buff) {
        let view = new Uint8Array(buff);
        return view.reduce((prev, curr) => {return prev.concat(curr.toString(16).padStart(2, '0'))}, '');
    }




    /** JSON conversion methods
     *    Convenience methods
     *    Presently just aliases for JSON.parse() and JSON.stringify()
     *
     */
    parse(jstr, reviver) {
        return JSON.parse(jstr, reviver);
    }
    serialize(val, replacer) {
        return JSON.stringify(val, replacer);
    }




    /** `setLocal()` abstracts the call to `localStorage.setItem()` from the `sync()` performed by `write()`
     *    This is important because the `sync()` itself writes data to `localStorage` (`lastSync` property)
     *    If `sync()` were to invoke `write()` an infinite recursion would result, as `write()` in turn invokes `sync()`
     *
     */
    setLocal(key, value) {
        try {
            localStorage.setItem(key, value);
        }
        catch(er) {
            alert(`Error writing data to local storage: ${er}`);
            console.error(`Error writing data to local storage:\n${er}`);
        }
    }
    /** For local storage access
     *    No return value
     */
    remove(key) {
        try {
            localStorage.removeItem(key);
        }
        catch(er) {
            alert(`Error deleting data from local storage: ${er}`);
            console.error(`Error deleting data from local storage:\n${er}`);
        }
    }
}
DataStorage.key = 'mealplan';