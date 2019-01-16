/**
 * Created by Hunter on 11/18/2018.
 */

class RecipeInput {
    constructor() {
        this.container = document.createElement('div');
        this.container.className = 'meal-input';

        this.title = document.createElement('h2');
        this.title.className = 'input';
        this.title.innerHTML = 'Recipe Input';
        this.container.appendChild(this.title);

        this.form = document.createElement('form');
        this.container.appendChild(this.form);

        this.saveButton = this.form.appendChild(document.createElement('input'));
        this.saveButton.type = 'button';
        this.saveButton.value = 'Save recipe';
        this.saveButton.addEventListener('click', this.saveRecipe.bind(this), false);

        this.titleInput = document.createElement('input');
        this.titleInput.type = 'text';
        this.form.appendChild(this.titleInput);

        this.ingdTable = document.createElement('table');
        this.ingdTable.className = 'ingredients';
        this.form.appendChild(this.ingdTable);

        //  Container array for ingredient element wrappers
        this.ingredients = [];

        let ingdHeader = this.ingdTable.insertRow(0);
        ingdHeader.appendChild(document.createElement('th')).innerTML = 'Qty';
        ingdHeader.appendChild(document.createElement('th')).innerTML = 'Unit';
        ingdHeader.appendChild(document.createElement('th')).innerTML = 'Ingredient';

        this.addIngd();

        this.addIngdButton = this.form.appendChild(document.createElement('input'));
        this.addIngdButton.type = 'button';
        this.addIngdButton.value = 'Add Ingredient';
        this.addIngdButton.addEventListener('click', this.addIngd.bind(this), false);

        //  Container array for instruction element wrappers
        this.instructions = [];

        let instHeader = document.createElement('h4');
        instHeader.innerTML = 'Instructions';
        this.form.appendChild(instHeader);

        this.instList = document.createElement('ol');
        this.instList.className = 'instructions';
        this.form.appendChild(this.instList);

        this.addInst();

        this.addInstButton = this.form.appendChild(document.createElement('input'));
        this.addInstButton.type = 'button';
        this.addInstButton.value = 'Add Instruction';
        this.addInstButton.addEventListener('click', this.addInst.bind(this), false);
    }

    saveRecipe() {
        let recipe = new Recipe(this.titleInput.value);

        for(let ingd of this.ingredients) {
            recipe.addIngredient(new Ingredient(ingd.nameInput.value, ingd.unitInput.value, Number(ingd.qtyInput.value)));
        }
        for(let inst of this.instructions) {
            recipe.addInstruction(inst.input.value);
        }

        // RecipeIndex.saveRecipe(recipe);
    }

    addIngd() {
        let row = this.ingdTable.insertRow(this.ingdTable.rows.length);
        let newIngd = {
            row: row,
            qtyInput: row.insertCell(0).appendChild(document.createElement('input')),
            unitInput: row.insertCell(1).appendChild(document.createElement('input')),
            nameInput: row.insertCell(2).appendChild(document.createElement('input'))
        };

        this.ingredients.push(newIngd);
        return newIngd;
    }
    removeIngd(ingd) {
        if(typeof ingd === 'number')
            ingd = this.ingdTable.rows[ingd];
        else if(typeof ingd.row !== 'undefined')
            ingd = ingd.row;
        else
            throw new TypeError(`Cannot locate ingredient ${ingd} for removal from ingredient input table`);

        let ind = this.ingredients.findIndex(el => el.row === ingd);
        this.ingredients.splice(ind, 1);

        return this.ingdTable.removeChild(ingd);
    }

    addInst() {
        let item = this.instList.appendChild(document.createElement('li'));
        let newInst = {
            item: item,
            input: item.appendChild(document.createElement('textarea'))
        };

        this.instructions.push(newInst);
        return newInst;
    }
    removeInst(inst) {
        if(typeof inst === 'number')
            inst = this.ingdTable.rows[ingd];
        else if(typeof inst.item !== 'undefined')
            inst = inst.item;
        else
            throw new TypeError(`Cannot locate instruction ${inst} for removal from instruction input table`);

        let ind = this.instructions.findIndex(el => el.item === inst);
        this.instructions.splice(ind, 1);

        return this.instList.removeChild(inst);
    }
}