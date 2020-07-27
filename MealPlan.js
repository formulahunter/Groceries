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

        //  Define the pantry
        this.pantry = new Pantry();

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
            return Promise.reject(`Display init failed:\n${reason}`);
        });

        let dataInit = this.dataInit().catch(function(reason) {
            return Promise.reject(`Data loading failed:\n${reason}`);
        });

        //  The following .then() function executes once all instances provided to Promise.all() have resolved successfully
        return Promise.all([dispInit, dataInit]).then(function() {
            console.log('Data and display initialized');
            plan.calendar.init(new Date());
            // //  Load data into display
            // display.activate(dataInit);  //  'dataInit' resolves to the value of the fetched data
        })
        .catch(function(reason) {
            console.log(`Initialization failed:\n${reason}`);
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
        // plan.calendar.init(new Date());
        plan.index.init();

        console.info('Display initialized');

        resolve();
    }
    dataInit() {
        return this.data.init()
        .then((function(data) {
            // Sync was successful
            // `data.init()` returns parsed JSON data objects
            if(data.resolve) {
                for(let ingredient of data.ingredients) {
                    this.pantry.addIngredient(Ingredient.fromJSON(ingredient));
                }
                for(let recipe of data.recipes) {
                    this.index.addEntry(Recipe.fromJSON(recipe));
                }
                for(let meal of data.meals) {
                    this.calendar.addRecipe(meal.recipe, meal.date, meal.time);
                }
            }

            console.info('Data initialized');

            return Promise.resolve(true);
        }).bind(this))
        .catch(function(reason) {
            //  Sync was not successful
            console.error(`Data initialization error:\n${reason}`);
            return Promise.reject(reason);
        });
    }

    saveIngredient(ingd) {
        if(!(ingd instanceof Ingredient))
            throw new TypeError(`saveIngredient() expects a Ingredient argument but received ${ingd}`);

        console.debug(`Saving ingredient '${ingd.name}'`);

        ingd._created = this.data.newID();
        console.debug(`Ingredient timestamp: ${ingd._created}`);

        //  Add ingredient to the pantry
        let ind = this.pantry.addIngredient(ingd);

        //  Save ingredient to local storage
        let str = this.data.dataString;
        let localHash = this.data.write(`${this.data.key}-data`, str);

        let data = {
            query: 'add',
            type: 'ingredients',
            index: ind,
            instance: ingd
        };
        let url = 'query.php';
        let headers = [{
            header: 'content-type',
            value: 'application/json;charset=UTF-8'
        }];
        let serverHash = this.data.xhrPost(data, url, headers);

        console.log(this.data.types);
        //  RECONCILE BOTH RESULTS
        return Promise.all([localHash, serverHash])
            .then((function(result) {
                return this.data.sync(localHash, serverHash);
            }).bind(this))
            .then(function(result) {
                if(!result) {
                    console.warn('Unable to save ingredient -- check data file integrity');
                    alert('Failed to save new ingredient -- check data file integrity');
                    return Promise.reject(new Error('Unable to save ingredient -- check data file integrity'))
                }

                console.log(`${ingd} saved`);
                return Promise.resolve(true);
            })
            .catch(function(reason) {
                alert(`Error saving ingredient:\n${reason}`);
                return Promise.reject(new Error(`Error saving ingredient:\n${reason}`))
            });
    }
    saveRecipe(recipe) {
        if(!(recipe instanceof Recipe))
            throw new TypeError(`saveRecipe() expects a Recipe argument but received ${recipe}`);

        console.debug(`Saving recipe '${recipe.title}'`);

        //  Check `DataStorage` for each ingredient
        //  If not present, save the ingredient first
        let saves = Promise.resolve();
        for(let ingd of recipe.ingredients)
            if(!this.data.types.ingredients.find(val => val.name === ingd.name))
                saves = saves.then(this.saveIngredient.bind(this, ingd));

        return saves.catch(function(reason) {
            return Promise.reject(`Error saving ingredient: ${reason}`);
        })
        .then((function(result) {
            //  Save recipe to local & remote files
            return this.data.save('recipe', recipe)
                .then((function(result) {
                    //  Confirm success
                    console.log(`${recipe} saved`);

                    //  Add recipe to the Index
                    this.index.addEntry(recipe, result);

                    //  Resolve to true
                    return Promise.resolve(true);
                }).bind(this));
        }).bind(this))
        .catch(function(reason) {
            console.error(reason);
            return Promise.reject(new Error(`Error saving recipe:\n${reason}`));
        });
    }

    get dataString() {
        let jobj = {
            ingredients: this.data.types.ingredients,
            recipes: this.data.types.recipes,
            meals: [],
            lists: [],
            receipts: []
        };

        return this.data.serialize(jobj);
    }
}