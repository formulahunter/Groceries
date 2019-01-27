/**
 * Created by Hunter on 11/18/2018.
 */

class Ingredient {
    constructor(name, unit, qty) {
        if(!name || name === '')
            console.log(`No name provided for new Ingredient instance`);
        if(!unit && unit !== '')
            console.log(`No unit provided for new Ingredient instance`);
        if(!qty || typeof qty !== 'number')
            console.log(`No quantity provided for new Ingredient instance`);

        this._created = false;
        this._modified = false;

        this._name = name || '';
        this._unit = unit || '';
        this._qty = qty || false;
    }

    static fromJSON(jobj) {
        let inst = new Ingredient(jobj._name, jobj._unit, jobj._qty);

        inst._created = jobj._created;
        if(jobj._modified)
            inst._modified = jobj._modified;

        return inst;
    }

    get name() {
        return this._name;
    }
    get unit() {
        return this._unit;
    }
    get qty() {
        return this._qty;
    }

    set name(name) {
        if(typeof name !== 'string' || name === '')
            console.log(`No value provided for Ingredient name`);

        this._name = name;
    }
    set unit(unit) {
        if(typeof unit !== 'string' || unit === '')
            console.log(`No value provided for Ingredient unit`);

        this._unit = unit;
    }
    set qty(qty) {
        if(typeof qty !== 'number')
            console.log(`No value provided for Ingredient quantity`);

        this._qty = qty;
    }

    toJSON() {
        //  `replacer()` is used to substitute certain values with other values to be serialized
        //  Substitutions are entirely arbitrary
        //  Here they are performed to ensure consistency in the data file while minimizing its size
        let replacer = function (value) {
            if(value === undefined || value === null)
                return '';

            if(value === false)
                return 'false';

            return value;
        };

        let jobj = {
            _created: this._created,
            _name: replacer(this._name),
            _unit: this._unit,
            _qty: this._qty
        };
        if(this._modified)
            jobj._modified = this._modified;

        return jobj;
    }
    toString() {
        return this.name;
    }
}