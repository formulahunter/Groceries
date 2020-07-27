/**
 * Created by Hunter on 11/25/2018.
 */

class DataStorage {
    /** Constructor
     *
     * @param {string} key
     * @param {string[]} types
     *
     * @returns {DataStorage}
     */
    constructor(key, types) {
        this.key = key;

        this.types = {};
        for(let key of types) {
            this.types[key] = [];
        }

        this.deleted = {};
        for(let key of types) {
            this.deleted[key] = [];
        }

        this._maxID = 0;
    }


    /** For consistently retrieving a single string with all project data
     *
     * @returns {string}
     */
    get dataString() {
        console.log('types = %o', this.types);
        try {
            return this.serialize(this.types);
        }
        catch(er) {
            throw new Error(`Error serializing data in memory:\n${er}`);
        }
    }


    /** Get timestamp of the most recent successful sync
     *
     * @returns {number}
     */
    get lastSync() {
        try {
            let sync = localStorage.getItem(`${this.key}-sync`);
            if(sync === null)
                return 0;

            return Number(this.decrypt(sync));
        }
        catch(er) {
            throw new Error(`Error reading last-sync parameter from local storage:\n${er}`);
        }
    }

    /** Set timestamp of the most recent successful sync
     *
     * @param {number} sync
     */
    set lastSync(sync) {
        try {
            if(sync === true || sync === false || sync === undefined || sync === null)
                throw new TypeError('.lastSync cannot be `true`, `false`, `undefined`, or `null`');
            if(Array.isArray(sync))
                throw new TypeError('.lastSync cannot be an array');
            if(Number.isNaN(Number(sync)) || !Number.isInteger(Number(sync)))
                throw new TypeError('.lastSync must be an integer, or a string that can be parsed to an integer');

            localStorage.setItem(`${this.key}-sync`, this.encrypt(sync.toString()));
        }
        catch(er) {
            throw new Error(`Error writing last-sync parameter ${sync} to local storage:\n${er}`);
        }
    }

    /** Ensure that no two data instances are assigned the same id during batch saves
     *
     * @returns {number}
     */
    newID() {
        let id = Date.now();
        if(id <= this._maxID)
            id = this._maxID + 1;

        this._maxID = id;

        return id;
    }


    /** Sync data automatically and return parsed JSON data objects
     *
     * @returns {object}
     */
    init() {
        return this.sync()
            .then((function(result) {
                return Promise.resolve({
                    sync: result.sync,
                    hash: result.hash,
                    resolve: result.resolve,
                });
            }).bind(this));
    }


    /** For incremental data instance additions
     *
     * @param {string} type
     * @param {Object} inst
     *
     * @returns {Promise}
     */
    save(type, inst) {
        //  Make sure `type` is in the plural form
        if(!this.types[type])
            if(this.types[`${type}s`])
                type = `${type}s`;

        if(!this.types[type] || !Array.isArray(this.types[type]))
            throw new Error(`Unknown data type ${type} cannot be saved to data file`);

        //  Check if instance has already been added
        //  If so, return its index
        let ind = this.types[type].indexOf(inst);
        if(ind >= 0) {
            console.info(`${type} instance ${inst} has already been added to the data file - it will not be added again`);
            return Promise.resolve(ind);
        }

        //  Sync data before write
        return this.sync()
            .catch(function(reason) {
                return Promise.reject(`Could not sync data before write:\n${reason}`);
            })
            .then((function(result) {
                console.info(`Data synchronized in preparation for save '${type}'`);

                //  Assign a new ID
                //  If this method is used for saving modified instances:
                //    - Set `_created` if it isn't already defined
                //    - Otherwise set `_modified`
                inst._created = this.newID();
                console.debug(`${type} timestamp: ${inst._created}`);

                //  Add instance to the type's container array
                this.types[type].push(inst);

                //  Sort the container array using the standard sort algorithm
                this.types[type].sort((a, b) => a._created > b._created ? 1 : -1);

                //  Get the index of the new data instance
                ind = this.types[type].indexOf(inst);
                console.log(`index: ${ind}`);

                //  Write the new instance to local data cache
                let local = this.write(`${this.key}-data`, this.dataString);

                //  Write the new instance to remote data file
                let data = {
                    query: 'add',
                    type: type,
                    instance: inst,
                    index: ind
                };
                let url = 'query.php';
                let headers = [{
                    header: 'content-type',
                    value: 'application/json;charset=UTF-8'
                }];
                let remote = this.xhrPost(data, url, headers);

                //  Confirm both data files are still in sync
                return Promise.all([local, remote]).then((function([localHash, remoteHash]) {
                    console.debug(`local: ${localHash}\nremote: ${remoteHash}`);
                    return this.sync(localHash, remoteHash)
                        .then(function(result) {
                            return Promise.resolve(ind);
                        });
                }).bind(this))
                    .catch(function(reason) {
                        return Promise.reject(`Error saving new data:\n${reason}`);
                    });
            }));
    }


    /** For local storage access
     *    Returns `null` if data in local storage is not truthy
     *    Otherwise returns result of decrypt()
     *
     * @param {string} key
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

        if(str === null) {
            let loadRemote = confirm(`No data stored locally under default data key ${key}\n\nLoad data file from server?`);
            if(loadRemote) {
                //  Load remote data file and save locally

                //  Resolve to `true` if load/save was successful
                //  Else reject with reason to indicate why sync failed
                return Promise.reject('Loading remote data failed');
            }

            //  Reject with reason to indicate why sync failed
            return Promise.reject('User elected to leave local data cache empty');
        }

        return this.decrypt(str);
    }
    /** For local storage access
     *
     * @param {string} key
     * @param {object} data
     */
    write(key, data) {
        let str = this.encrypt(data);

        try {
            this.setLocal(key, str);
        }
        catch(er) {
            alert(`Error writing data to local storage:\n${er}`);
            console.error(`Error writing data to local storage:\n${er}`);
            throw er;
        }

        return this.hash()
            .catch(function(reason) {
                return Promise.reject(`Error during write operation:\n${reason}\nAborting write to key ${key}`);
            });
    }




    /** Sync local data with server
     *    Compare hash digests from both sources
     *    Initiate reconciliation if digests don't match
     *
     *    On success, return a Promise resolving to 'true'
     *    Throw an exception on failure
     *
     */
    sync(local, remote) {
        console.debug('Syncing local and remote data files');

        //  Remote hash
        if(!remote) {
            let data = {query: 'hash'};
            let url = 'query.php';
            let headers = [{
                header: 'content-type',
                value: 'application/json;charset=UTF-8'
            }];
            remote = this.xhrPost(data, url, headers)
                .then(function(result) {
                    console.debug(`Remote data hash: ${result}`);
                    return Promise.resolve(result);
                });
        }
        // console.debug('remote hash:');
        // console.debug(remote);

        //  Local hash
        if(!local) {
            local = this.hash()
                .then(function(result) {
                    console.debug(`Local data hash: ${result}`);
                    return Promise.resolve(result);
                });
        }
        // console.debug('local hash:');
        // console.debug(local);

        return Promise.all([remote, local])
        .then(this.checkForDiscrepancy.bind(this))
        .then(this.resolve.bind(this))
        .then(this.evaluateSyncResult.bind(this))
        .catch(function(reason) {
            return Promise.reject(new Error(`Error encountered while synchronizing local and server data files:\n${reason}`));
        });
    }
    checkForDiscrepancy([remote, local]) {
        //  If the two hash values match, then resolve with the value of the hash digest
        //  If they don't match, attempt to reconcile the data files
        if(local === remote)
            return Promise.resolve({hash: remote});

        console.info('Data discrepancy found -- attempting to reconcile');
        console.debug(`local: ${local}\nremote: ${remote}`);

        //  Initiate data reconciliation
        //  Pass the local hash on to the reconcile method in case no new data is received from server
        //  The reconcile method will always receive a new hash from the server, regardless of whether or not that data file changes
        return this.reconcile(local);
    }
    evaluateSyncResult(result) {
        //  If sync/reconcile was successful, result will be an object with the property `hash`
        if(!result.hash)
            return Promise.reject(new Error(`Unknown data reconciliation result: ${result.toString()}`));

        let now = new Date;
        let time = now.getTime();
        this.lastSync = time;
        console.info('Local and remote data synchronized');
        console.debug(`Successful sync on ${now.toLocaleString()}\nTimestamp: ${time}`);

        //  Define the `sync` property on `result` and resolve the `sync()`
        result.sync = time;
        return Promise.resolve(result);
    }


    /** Data reconciliation
     *    `reconcile()` returns a Promise that is either rejected with an Error or resolves to an object literal
     *      - If no new data was received from the server, this object has one property, `hash`, equal to the hash of the server's data file
     *      - If the server returned new data to be saved locally, this object has one property, `reconcile`, that is an index by type of the data instances to be saved locally
     *
     * @param {string} localHash
     * @returns {Promise<T | never>}
     */
    reconcile(localHash) {
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
        //  Reject with reason if inequal
        //  return true
        //  NOTE THAT THIS METHOD PRESENTLY ONLY DOWNLOADS NEW DATA TO MATCH SERVER FILE
        //  DATA STORED LOCALLY THAT HAS NOT YET BEEN SYNCED TO SERVER WILL NOT BE RECONCILED

        /**  Query local storage for most recent successful sync
         */
        let lastSync = this.lastSync;

        /**  Compile local changes since last sync
         *   - To allow greater flexibility in extending DataStorage, this method will check members of every array defined on an own-property key
         *   - It is assumed that members of such arrays are data instances managed by the DatStorage instance
         */
        let instances = {};
        for(let key in this.types) {
            //  Iterate over own properties only
            if(!this.types.hasOwnProperty(key))
                continue;

            /*  No longer needed as of definition of `types` property
            //  Skip properties that aren't arrays
            if(!Array.isArray(this[key]))
                continue;

            //  Skip the `deleted` key
            if(key === 'deleted')
                continue;
            */

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
            for(let inst of this.types[key]) {
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

        console.info('Data to be sent to reconciliation script: %o', data);
        // alert(`Data to be sent to reconciliation script: \n${JSON.stringify(data)}`);
        return this.xhrPost(data, url, headers)
            .then((function(response) {
                //  Parse JSON text returned by server
                let data;
                try {
                    data = this.parse(response);
                }
                catch(er) {
                    return Promise.reject(new Error(`Error parsing server's reconcile response: ${response}`));
                }

                //  If server returned updated data instances, use them as the resolved value
                //  Server will always return an object with the `hash` property
                let keys = Object.keys(data);
                if(keys.length > 1) {
                    //  New data was received from the server
                    //    - If there are any data conflicts:
                    //      - Resolve them with a GUI interface
                    //      - For now just reject the promise
                    //    - Otherwise:
                    //      - Save this data locally
                    //      - Compute new local hash and compare to result.reconcile.hash
                    //      - If they don't match, reject the promise
                    //      - If they do, define result.hash

                    return Promise.resolve({resolve: data, remote: data.hash, local: localHash});
                }

                //  At this point, the automatic reconciliation algorithm has run and the server did not return any new data
                //  If the hashes match now, fulfill the Promise for a successful sync
                //  If they don't match, there are at least two possibilities:
                //    - There may be a data discrepancy before `last-sync` that cannot be resolved automatically
                //    - One of the data files may be corrupt/improperly formatted
                if(localHash === data.hash)
                    return Promise.resolve({hash: data.hash});
                else
                    return Promise.reject(new Error(`Unable to reconcile local and remote data files\nServer response JSON: ${data}`));
            }).bind(this))
            .catch(function(reason) {
                return Promise.reject(new Error(`Error processing server's reconciliation response:\n${reason}`));
            });
    }
    resolve(result) {
        if(!result.resolve)
            return Promise.resolve({'hash': result.hash});

        console.info('Server reconcile result: %o', result);
        // return Promise.reject(new Error('DataStorage.resolve() method not yet implemented to handle server\'s reconcile result'));

        //  `result.resolve` contains an object with the structure {type->rank->id->instance} where:
        //    - `type` is one of the data types defined in `types[]`
        //    - `rank` is one of 'new', 'modified', 'deleted', or 'conflicts'
        //    - `id` is the string encoding of the data instance's `_created` property
        //    - `instance` is the raw data object
        for(let type in result.resolve) {
            if(type === 'deleted' || type === 'hash')
                continue;

            if(!result.resolve.hasOwnProperty(type))
                continue;

            let constructor;
            switch(type) {
                case 'ingredients':
                    constructor = Ingredient;
                    break;
                case 'recipes':
                    constructor = Recipe;
                    break;
                case 'meals':
                    constructor = Meal;
                    break;
                case 'lists':
                    // constructor = List;
                    // break;
                case 'receipts':
                    // constructor = Receipt;
                    // break;
                    console.warn(`Resolution of ${type} is not yet implemented in DataStorage.resolve()`);
                    continue;
                default:
                    return Promise.reject(new Error(`Unrecognized data type received from server reconciliation: ${type}`));
            }

            if(result.resolve[type].new && Object.keys(result.resolve[type].new).length > 0) {
                for(let id in result.resolve[type].new) {
                    if(!result.resolve[type].new.hasOwnProperty(id))
                        continue;

                    let data = result.resolve[type].new[id];
                    let inst = constructor.fromJSON(data);

                    //  Add instance to the type's container array
                    this.types[type].push(inst);

                    //  Sort the container array using the standard sort algorithm
                    this.types[type].sort((a, b) => a._created > b._created ? 1 : -1);
                }
            }
            if(result.resolve[type].modified && Object.keys(result.resolve[type].modified).length > 0) {
                for(let id in result.resolve[type].modified) {
                    if(!result.resolve[type].modified.hasOwnProperty(id))
                        continue;

                    let data = result.resolve[type].modified[id];
                    let inst = constructor.fromJSON(data);

                    //  Replace the existing index in the container array with the new instance
                    //  No need to resort if the sort algorithm is based on _created values
                    let ind = this.types[type].findIndex(el => el.id === inst.id);
                    if(ind < 0)
                        return Promise.reject(new Error(`Unable to replace ${type.slice(0, -1)} ${inst.id} -- no existing ${type} with the same id were found in local storage`));
                    this.types.splice(ind, 1, inst);
                }
            }
            if(result.resolve.deleted && result.resolve.deleted[type] && result.resolve.deleted[type].length > 0) {
                Promise.reject(new Error(`Processing of deleted instances from server reconciliation not yet implemented in DataStorage.resolve()`));
            }
            if(result.resolve[type].conflicts && Object.keys(result.resolve[type].conflicts).length > 0) {
                Promise.reject(new Error(`Processing of conflicting instances from server reconciliation not yet implemented in DataStorage.resolve()`));
            }
        }

        //  Compare the server hash to the new local hash and resolve/reject accordingly
        //    - This will look very similar to `sync()` but must not invoke that method again to prevent recursion

        //  If conflicts were resolved manually, POST them to the server's resolve() function
        //  Otherwise use the server's hash given in `result.hash`
        let remote = Promise.resolve(result.remote);

        //  Write the new instance to local data cache
        let local = this.write(`${this.key}-data`, this.dataString);

        return Promise.all([remote, local])
            .then(function([localHash, remoteHash]) {
                //  If the two hash values match, then resolve with the value of the hash digest
                //  If they don't match, reject with an unresolved error
                if(local === remote)
                    return Promise.resolve({hash: remote});
                else
                    return Promise.reject(new Error(`Unable to resolve reconciliation results\nResult from server: ${result.resolve}`));
            })
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
            str = this.read(`${this.key}-data`);

        // console.debug(`Compute hash digest of ${typeof str === 'string' ? `string (length ${str.length})` : `${typeof str}`} using ${alg} algorithm\nvalue: ${str}`);

        //  SubtleCrypto.digest() returns a Promise, so this function needs only to return that promise
        let buf = new TextEncoder('utf-8').encode(str);

        return crypto.subtle.digest(alg, buf)
            .then(res => Promise.resolve(this.getString(res)))
            .catch(function(reason) {
                return Promise.reject(new Error(`Error computing hash digest:\n${reason}`));
            });
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
                console.warn(`Data file GET request for ${url} encountered an error: ${er}`);
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
                    reject(new Error(`GET request encountered an error:\n${request.response}`));
                }
            };
        })
        .catch(function(reason) {
            return Promise.reject(new Error(`Error executing XHR GET:\n${reason}`));
        });;
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
                reject(new Error(`POST request encountered an error: ${er}`));
            };

            // console.debug(`POST request body: ${body}`);

            // console.debug(`Sending POST request: ${request}`);
            request.send(body);
        })
        .catch(function(reason) {
            return Promise.reject(new Error(`Error executing XHR POST:\n${reason}`));
        });
    }


    /** Cryptography methods
     *    Convenience methods
     *    Presently just aliases for SJCL.encrypt() and SJCL.decrypt()
     *
     */
    encrypt(data, password = 'password') {
        try {
            return sjcl.encrypt(password, data);
        }
        catch(er) {
            throw new Error(`SJCL encrypt() error:\n${er}`);
        }
    }
    decrypt(cipher, password = 'password') {
        try {
            return sjcl.decrypt(password, cipher);
        }
        catch(er) {
            throw new Error(`SJCL encrypt() error:\n${er}`);
        }
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
        try {
            return JSON.parse(jstr, reviver);
        }
        catch(er) {
            throw new Error(`JSON parse() error:\n${er}`);
        }
    }
    serialize(val, replacer) {
        try{
            return JSON.stringify(val, replacer);
        }
        catch(er) {
            throw new Error(`JSON stringify() error:\n${er}`);
        }
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
            throw new Error(`Error writing data to local storage:\n${er}`);
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
            throw new Error(`Error deleting data from local storage:\n${er}`);
        }
    }
}