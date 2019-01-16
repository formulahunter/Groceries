/**
 * Created by Hunter on 11/18/2018.
 */

class MealCalendar {
    constructor() {
        this.container = document.createElement('div');
        this.container.className = 'meal-plan';

        this.title = document.createElement('h2');
        this.title.className = 'title';
        this.container.appendChild(this.title);

        this.table = document.createElement('table');
        this.container.appendChild(this.table);

        this.header = this.table.insertRow(0);
        let weekdayNames = ['Sun', 'Mon', 'Tues', 'Wed', 'Thurs', 'Fri', 'Sat'];
        for(let i=0; i<7; i++) {
            let cell = this.header.insertCell(i);
            cell.innerHTML = `${weekdayNames[i]} - `;
            cell.className = 'header';
        }

        this.mealRows = [];
        for(let i=0; i<6; i++) {
            this.mealRows[i] = this.table.insertRow(this.table.rows.length);
            this.mealRows[i].className = 'schedule';
            for (let j=0; j<7; j++)
                this.mealRows[i].insertCell(j);
        }

        this.week = false;
        this.meals = [];
    }

    getMealPlanFor(week) {
        //  Starting on date indicated, get all meals planned for next 7 days
        let d = new Date(week);

        //  `meals` is an array of 7 arrays -- one for each day of the week
        let meals = [];
        for(let i=0; i<7; i++) {
            meals.push(this.getMealsOn(d));
            d.setDate(d.getDate() + 1);
        }

        return meals;
    }
    getMealsOn(day) {
        return this.meals.filter(m => (m.date.getFullYear() === day.getFullYear() && m.date.getMonth() === day.getMonth() && m.date.getDate() === day.getDate()));
    }

    setWeek(week) {
        //  Set a new date `d` to midnight on the Sunday of the week in which the argument `week` falls
        let d = new Date(week.getFullYear(), week.getMonth(), week.getDate() - week.getDay());
        console.debug(`Set calendar to display the week beginning ${d.toLocaleDateString()}`);

        //  If the indicated week is already displayed, do nothing
        if(d === this.week) {
            console.info(`The week of ${d.toLocaleDateString()} is already displayed on the calendar`);
            return false;
        }

        //  Reset the title to reflect the new week
        this.title.innerHTML = `Meal Plan - Week of ${d.toLocaleDateString()}`;

        //  Retain the calculated value of `d` for reference
        this.week = new Date(d);

        //  Retrieve meal plan for selected week
        let meals = this.getMealPlanFor(d);
        console.info(`There are ${meals.flat().length} meals planned for the week`);

        //  Update data in table
        for(let i=0; i<7; i++) {
            //  Add the date to the header row
            this.header.cells[i].innerHTML = `${weekdayNames[i]} ${d.getDate()}`;

            //  Clear previous recipes from the schedule
            for(let j=0; j<6; j++)
                for (let k=0; k<7; k++)
                    this.mealRows[j].cells[k].innerHTML = '';

            //  Add new recipes to the schedule
            for(let j=0; j<meals[i].length; j++)
                this.addRecipe(meals[i][j]);

            //  Advance `d` by 1 day
            d.setDate(d.getDate() + 1);
        }
    }
    advanceWeek(count = 1) {
        let d = new Date(this.week.getTime() + count * 7*24*60*60*1000);
        this.setWeek(d);
    }

    addRecipe(recipe, day, meal) {
        let d = new Date(day.getFullYear(), day.getMonth(), day.getDate());
        if(d < this.week || d >= this.week + 7*24*60*60*1000) {
            console.info(`${d.toLocaleDateString()} is outside of current calendar date range`);
            console.info(this.week);
            return false;
        }

        console.info(`List ${recipe.title} on ${d.toLocaleDateString()}`);

        let cell = this.mealRows[meal].cells[d.getDay()];
        let event = cell.appendChild(document.createElement('div'));
        event.className = 'meal';
        event.innerHTML = recipe.title;

        return event;
    }

    init(week) {
        //  Fetch data from storage/server


        //  Populate display
        this.setWeek(week);
    }
}