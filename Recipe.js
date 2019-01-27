/**
 * Created by Hunter on 11/18/2018.
 */

class Recipe {
    constructor(title) {
        if(!title || title === '')
            throw new TypeError('Argument to `Recipe` constructor must be a non-empty string');

        this._created = false;
        this._modified = false;

        this.title = title;
        this.ingredients = [];
        this.instructions = [];
    }

    static fromJSON(jobj) {
        let inst = new Recipe(jobj.title);

        inst._created = jobj._created;
        if(jobj._modified)
            inst._modified = jobj._modified;

        for(let ingd of jobj.ingredients) {
            inst.ingredients.push(Ingredient.fromJSON(ingd));
        }
        inst.ingredients.sort((a,b) => a.title > b.title ? 1 : -1);

        for(let inst of jobj.instructions) {
            inst.instructions.push(inst);
        }

        return inst;
    }

    get id() {
        return this._created;
    }

    addIngredient(ingd) {
        if(!(ingd instanceof Ingredient))
            throw new TypeError(`Argument to addIngredient() must be an Ingredient instance -- received ${ingd}`);

        if(this.ingredients.indexOf(ingd) >= 0)
            throw new Error(`Ingredient ${ingd} cannot be added twice to recipe ${this}`);
        else if(this.ingredients.findIndex(a => a.name === ingd.name) >= 0)
            console.warn(`An ingredient with the name ${ingd} has already been added to recipe ${this}`);

        this.ingredients.push(ingd);
        return this.ingredients.length;
    }
    addInstruction(inst) {
        if(typeof inst !== 'string')
            throw new TypeError(`Argument to addInstruction() must be an string -- received ${inst}`);

        if(this.instructions.indexOf(inst) >= 0)
            throw new Error(`Instruction ${inst} cannot be added twice to recipe ${this}`);

        this.instructions.push(inst);
        return this.instructions.length;
    }

    toString() {
        return `Recipe:{"${this.title}"}`;
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

        let ingredients = [];
        this.ingredients.forEach(val => ingredients.push(val.toJSON()));

        let instructions = [];
        this.instructions.forEach(val => instructions.push(val.toJSON()));

        let jobj = {
            _created: this._created,
            title: replacer(this.title),
            ingredients: ingredients,
            instructions: instructions
        };
        if(this._modified)
            jobj._modified = this._modified;

        return jobj;
    }
}