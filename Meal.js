/**
 * Created by Hunter on 11/18/2018.
 */

class Meal {
    constructor(date, time, recipe) {
        this.date = date;
        this.time = time;
        this.recipe = recipe;
    }

    static fromJSON(jobj) {
        let inst = new Meal(new Date(jobj.date), jobj.time, jobj.recipe);
    }

    toJSON() {

    }
    toString() {
        return `Meal:{"${this.title}"}`;
    }
}