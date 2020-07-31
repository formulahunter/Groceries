/**
 * Created by Hunter on 11/18/2018.
 */

export default class Ingredient {
    constructor(name, unit, qty) {
        if(!name || name === '')
            console.log(`No name provided for new Ingredient instance`);
        if(!unit && unit !== '')
            console.log(`No unit provided for new Ingredient instance`);
        if(!qty || typeof qty !== 'number')
            console.log(`No quantity provided for new Ingredient instance`);

        this._name = name || '';
        this._unit = unit || '';
        this._qty = qty || false;
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

    toString() {
        return this.name;
    }
}