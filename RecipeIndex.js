/**
 * Created by Hunter on 11/18/2018.
 */

class RecipeIndex {
    constructor() {
        this.container = document.createElement('div');
        this.container.className = 'index';

        this.title = document.createElement('h2');
        this.title.className = 'title';
        this.title.innerHTML = 'Recipe Index';
        this.container.appendChild(this.title);

        this.table = document.createElement('table');
        this.container.appendChild(this.table);
    }

    addEntry(recipe) {
        //  Check if recipe was already added and if so return its index
        let ind = this.data.recipes.indexOf(recipe);
        if(ind >= 0) {
            console.info(`${recipe} has already been added to the index - it will not be added again`);
            return ind;
        }

        ind = this.data.recipes.findIndex(a => a.title === recipe.title);
        if(ind >= 0) {
            console.debug(`Recipe title ${recipe.title} has multiple entries in the index`);
        }

        //  Add recipe to index array
        this.data.recipes.push(recipe);

        //  Sort the index and get the position of the new recipe
        this.data.recipes.sort(RecipeIndex.sortFun);
        ind = this.data.recipes.indexOf(recipe);

        //  Create a new table row at the same position
        let titleRow = this.table.insertRow(ind);

        //  Add the recipe title to a cell in the title row
        titleRow.insertCell(0).innerHTML = recipe.title;
        titleRow.cells[0].className = "recipe";

        //  Return the new recipe's position in the index array
        return ind;
    }

    serialize() {
        return JSON.stringify(this.data.recipes);
    }

    init() {
        //  Fetch data from storage/server

        //  Populate display
    }
}
RecipeIndex.sortFun = (a, b) => (a.title > b.title ? 1 : (a.title < b.title ? -1 : 0));