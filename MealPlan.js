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
            console.log(`Display init failed with reason:\n${reason}`);
            throw reason;
        });

        let dataInit = this.dataInit().catch(function(reason) {
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
    dataInit() {
        return this.data.sync()
        .catch((function(reason) {
            //  Evaluate exception thrown/reason for rejection
            switch(reason.prompt) {
                case 'LOCAL_DATA_NULL':
                    let loadRemote = confirm('No data stored locally under default data key\n\nLoad data file from server?');
                    if(loadRemote) {
                        //  Load remote data file and save locally

                        //  Return true if load/save was successful
                        //  Else return false to indicate sync failed
                        return Promise.reject('Loading remote data failed');
                    }

                    //  Return false to indicate sync failed
                    return Promise.reject('User elected to leave local data cache empty');
                case 'EVALUATE_RECONCILED_DATA':
                    //  If the server returns updated data instances, process them here
                    //    - Implement an interface for resolving data conflicts
                    //    - Relay conflict resolutions back to server
                    let data;
                    try {
                        data = JSON.parse(reason.data);
                    }
                    catch(er) {
                        console.warn(er);
                        throw er;
                    }

                    //  Process reconciled data returned from server
                    if(data.ingredients) {
                        if(data.ingredients.new) {
                            for(let ingd of data.ingredients.new) {
                                ingd = Ingredient.fromJSON(ingd);
                                this.pantry.addIngredient(ingd);
                            }
                        }

                        if(data.ingredients.modified) {
                            for(let ingd of data.ingredients.modified) {
                                ingd = Ingredient.fromJSON(ingd);
                                // this.pantry.updateIngredient(ingd);
                            }
                        }

                        if(data.ingredients.deleted) {

                        }
                        if(data.ingredients.conflicts) {

                        }
                    }
                    if(data.recipes) {
                        if(data.recipes.new) {
                            for(let recipe of data.recipes.new) {
                                recipe = Recipe.fromJSON(recipe);
                                this.index.addEntry(new Recipe(recipe.title));
                                for(let ingd of recipe.ingredients) {
                                    this.pantry.addIngredient(ingd)
                                }
                            }
                        }
                        if(data.recipes.modified) {
                            for(let recipe of data.recipes.modified) {
                                // this.index.updateEntry(ingd);
                            }
                        }
                        if(data.recipes.deleted) {

                        }
                        if(data.recipes.conflicts) {

                        }
                    }
                    if(data.meals) {
                        if(data.meals.new) {

                        }
                        if(data.meals.modified) {

                        }
                        if(data.meals.deleted) {

                        }
                        if(data.meals.conflicts) {

                        }
                    }
                    if(data.shoppingLists) {
                        if(data.shoppingLists.new) {

                        }
                        if(data.shoppingLists.modified) {

                        }
                        if(data.shoppingLists.deleted) {

                        }
                        if(data.shoppingLists.conflicts) {

                        }
                    }

                    return Promise.resolve(true);
            }
        }).bind(this))
        .then((function(result) {
            //  Sync was successful
            //  Load data from local storage
            let data = this.data.parse(this.data.read(`${DataStorage.key}-data`));
            for(let ingredient of data.ingredients) {
                this.pantry.addIngredient(Ingredient.fromJSON(ingredient));
            }
            for(let recipe of data.recipes) {
                this.index.addEntry(Recipe.fromJSON(recipe));
            }
            for(let meal of data.meals) {

            }

            console.info('Data initialized');

            return Promise.resolve(data);
        }).bind(this))
        .catch(function(reason) {
            //  Sync was not successful
            console.error(`Data initialization error: ${reason}`);
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
        let str = this.dataString;
        let localHash = Promise.resolve(this.data.write(`${DataStorage.key}-data`, str));

        let data = {
            query: 'add',
            type: 'ingredient',
            index: ind,
            instance: ingd
        };
        let url = 'query.php';
        let headers = [{
            header: 'content-type',
            value: 'application/json;charset=UTF-8'
        }];
        let serverHash = this.data.xhrPost(data, url, headers);

        //  RECONCILE BOTH RESULTS
        return Promise.all([localHash, serverHash]).then(this.data.sync().bind(this)).then(function(result) {
            if(!result) {
                console.warn('Unable to save ingredient -- check data file integrity');
                alert('Failed to save new ingredient -- refresh the page and try again');
            }

            console.log(`${ingd} saved`);
        })
        .catch(function(reason) {
            alert(`Error saving ingredient: ${reason}`);
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
            if(!this.data.ingredients.find(val => val.name === ingd.name))
                saves = saves.then(this.saveIngredient.bind(this, ingd));

        return saves.catch(function(reason){
            return Promise.reject(`Error saving ingredient: ${reason}`);
        })
        .then((function(result) {
            recipe._created = this.data.newID();
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
            return Promise.all([localHash, serverHash]);
        }).bind(this))
        .then(function([local, server]) {
            this.data.sync().then(function(result) {
                if(!result) {
                    console.warn('Unable to save recipe -- check data file integrity');
                    alert('Failed to save new recipe -- refresh the page and try again');

                    return Promise.resolve(false);
                }

                console.log(`${recipe} saved`);
                return Promise.resolve(true);
            });
        }.bind(this))
        .catch(function(reason) {
            alert(`Error saving recipe: ${reason}`);
            return Promise.reject(false);
        });
    }

    get dataString() {
        let jobj = {
            ingredients: this.data.ingredients,
            recipes: this.data.recipes,
            meals: [],
            shoppingLists: []
        };

        return this.data.serialize(jobj);
    }
}