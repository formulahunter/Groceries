/**
 * Created by Hunter on 11/21/2018.
 *
 *  ABSTRACT
 *      This class will conduct initialization and provide data storage interface
 */

class MealPlan {
    constructor() {
        /*this.ingredients = [];
        this.recipes = [];
        this.meals = [];
        this.groceryList = [];
        this.groceryReceipts = [];*/

        //  Define the meal calendar
        this.calendar = new MealCalendar();

        //  Define the recipe index
        this.index = new RecipeIndex();

        //  Define the recipe input
        this.input = new RecipeInput();
    }


    /** Initialization
     *    Compare local & remote hashes
     *    Attempt to reconcile data if hashes do not match
     *    Inform user if reconciliation is unsuccessful
     */
    initialize() {
        let dispInit = new Promise(this.displayInit.bind(this)).catch(function(reason) {
            console.log(`Display init failed with reason:\n${reason}`);
            throw reason;
        });

        let dataInit = new Promise(this.dataInit.bind(this)).catch(function(reason) {
            console.log(`Data loading failed with reason:\n${reason}`);
            return Promise.reject(reason);
        });

        //  The following .then() function executes once all instances provided to Promise.all() have resolved successfully
        return Promise.all([dispInit, dataInit]).then(function() {
            console.log('Data and display initialized');
            // //  Load data into display
            // display.activate(dataInit);  //  'dataInit' resolves to the value of the fetched data
        })
        .catch(function(reason) {
            console.log(`Initialization failed: ${reason}`);
        });
    }
    displayInit(resolve, reject) {
        this.container = document.createElement('div');
        this.container.className = 'content';
        document.body.appendChild(this.container);

        this.container.appendChild(this.calendar.container);
        this.container.appendChild(this.index.container);
        this.container.appendChild(this.input.container);

        //  Initialize the calendar and index
        // alert('CALENDAR INIT');
        plan.calendar.init(new Date());
        plan.index.init();

        console.info('Display initialized');

        resolve();
    }
    dataInit(resolve, reject) {
        //  Sync data
        try {
            this.data.sync();
        }
        catch(er) {
            // if(er instanceof DataReconcileError) {
                console.error(`Data initialization error: ${er}`);
                reject(er);
            // }

            // console.warn(er);
        }

        //  Load data from local storage
        let data = this.data.parse(this.data.read(`${DataStorage.key}-data`));
        for(let ingredient of data.ingredients) {

        }
        for(let recipe of data.recipes) {
            this.index.addEntry(Recipe.fromJSON(recipe));
        }
        for(let meal of data.meals) {

        }

        console.info('Data initialized');

        resolve(data);
    }

    saveRecipe(recipe) {
        if(!(recipe instanceof Recipe))
            throw new TypeError(`saveRecipe() expects a Recipe argument but received ${recipe}`);

        //  ASSUME ALL INGREDIENTS MUST BE SAVED AS WELL
        //  SKIP ANY THAT THROW A 'ALREADY-EXISTS' EXCEPTION

        console.debug(`Saving recipe '${recipe.title}'`);

        recipe._created = Date.now();
        console.debug(`Recipe timestamp: ${recipe._created}`);

        //  Add recipe to the Index
        let ind = this.index.addEntry(recipe);

        //  THE CALL TO 'write()' SHOULD HANDLE BOTH THE LOCAL DATA STORAGE WRITE AS WELL AS THE XHR POST TO SERVER

        //  Save recipe to local storage
        let str = this.dataString;
        let localHash = Promise.resolve(this.data.write(`${DataStorage.key}-data`, str));

        //  Save recipe to server
        // let data = {
        //     query: 'add',
        //     type: 'recipe',
        //     ind: ind,
        //     recipe: recipe
        // };
        let data = {
            recipe: recipe,
            ind: ind
        };
        // let url = 'query.php';
        let url = 'newRecipe.php';
        let headers = [{
            header: 'content-type',
            value: 'application/json;charset=UTF-8'
        }];
        let serverHash = this.data.xhrPost(data, url, headers);

        //  RECONCILE BOTH RESULTS
        Promise.all([localHash, serverHash]).then(function([local, server]) {
            this.data.sync().then(function(result) {
                if(!result) {
                    console.warn('Unable to save recipe -- check data file integrity');
                    alert('Failed to save new recipe -- refresh the page and try again');
                }

                console.log(`${recipe} saved`);
            });
        }.bind(this))
        .catch(function(reason) {
            alert(`Error saving recipe: ${reason}`);
        });
    }

    get dataString() {
        let jobj = {
            ingredients: [],
            recipes: this.data.recipes,
            meals: [],
            shoppingLists: []
        };

        return this.data.serialize(jobj);
    }
}