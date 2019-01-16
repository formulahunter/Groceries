/**
 * Created by Hunter on 11/21/2018.
 *
 *  ABSTRACT
 *      This class will conduct initialization and provide data storage interface
 */

class MealPlan extends Control {
    constructor() {
        super();
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
            // //  Load data into display
            console.log(dataInit);
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

        resolve();
    }
    dataInit(resolve, reject) {
        //  Sync data
        try {
            this.data.sync();
        }
        catch(er) {
            if(er instanceof DataReconcileError) {
                console.error(er);
                reject(er);
            }

            console.warn(er);
        }

        //  Load data from local storage
        let data = this.data.read('mealPlan');
        resolve(data);
    }

    saveRecipe(recipe) {
        //  Add recipe to the Index
        let ind = this.index.addEntry(recipe);

        //  Save recipe to local storage
        let str = this.dataString;
        let localHash = Promise.resolve(this.data.write('mealPlan', str));

        //  Save recipe to server
        let data = {
            recipe: recipe,
            ind: ind
        };
        let url = 'newRecipe.php';
        let headers = [{
            header: 'content-type',
            value: 'application/json;charset=UTF-8'
        }];
        let serverHash = this.data.xhrPost(data, url, headers);

        //  RECONCILE BOTH RESULTS
        Promise.all([localHash, serverHash]).then(function([local, server]) {
            console.log(`Local hash: ${local}\nServer hash: ${server}`);
            let success = local === server;

            if(!success) {
                throw new Error('Uh oh...\nError recording new recipe: local and server data files don\'t match');
            }

        }).catch(function(reason) {
            alert(`Error saving transaction: ${reason}`);
        });
    }

    get dataString() {
        let jobj = {
            ingredients: [],
            recipes: this.index.index,
            meals: [],
            shoppingLists: []
        };

        return this.data.serialize(jobj);
    }
}