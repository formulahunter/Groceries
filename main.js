function main() {
    //  Global parameters
    window.weekdayNames = ['Sun', 'Mon', 'Tues', 'Wed', 'Thurs', 'Fri', 'Sat'];
    window.BREAKFAST = 0, window.BRUNCH = 1, window.LUNCH = 2, window.SNACK = 3, window.DINNER = 4, window.WORKOUT = 5;

    MealPlan.prototype.data = new DataStorage();
    MealPlan.endi = endianness();

    window.plan = new MealPlan();
    plan.initialize().then(function() {
        saveData();
    });

    // saveData();
}

function saveData() {
    //  Copy from previous Recipes.html main() function

    //  Sunday 11/4
    let eggRadishesToast = new Recipe('Egg &amp; Radishes on Crisp Bread');
    let spinachApricotSalad = new Recipe('Spinach Apricot Salad');
    let spicyHoneyRoastedChickpeas = new Recipe('Spicy Honey-Roasted Chickpeas');

    let plans = [{
        date: new Date(2018, 10, 4),
        snack: eggRadishesToast,
        dinner: spinachApricotSalad,
        workout: spicyHoneyRoastedChickpeas
    }];


    //  Monday 11/5
    let appleNutQuark = new Recipe('Apple &amp; Nut Quark');
    let chickpeaGrapefruitSalad = new Recipe('Chickpea Grapefruit Salad');
    chickpeaGrapefruitSalad.addIngredient(new Ingredient('cooked chickpeas', 'oz', 10.5));
    chickpeaGrapefruitSalad.addIngredient(new Ingredient('grapefruit', '', 1));
    chickpeaGrapefruitSalad.addIngredient(new Ingredient('slices bulb of fennel', '', 1));
    chickpeaGrapefruitSalad.addIngredient(new Ingredient('water-packed artichoke hearts', 'oz', 3.5));
    chickpeaGrapefruitSalad.addIngredient(new Ingredient('virgin olive oil', 'tsp', 4));
    chickpeaGrapefruitSalad.addIngredient(new Ingredient('balsamic vinegar', 'tsp', 2));

    let turkeyTomatoSlices = new Recipe('Turkey Breast Tomato Slices');
    let avocadoCeviche = new Recipe('Avocado Ceviche');
    let carrotCucumberShake = new Recipe('Carrot &amp; Cucumber Shake');
    carrotCucumberShake.addIngredient(new Ingredient('carrot juice (unsweetened)', 'cups', 1));
    carrotCucumberShake.addIngredient(new Ingredient('cucumbers', '', 0.5));
    carrotCucumberShake.addIngredient(new Ingredient('roasted soybeans', 'oz', 1.75));
    carrotCucumberShake.addIngredient(new Ingredient('grated ginger', 'oz', 0.4));
    carrotCucumberShake.addIngredient(new Ingredient('low-fat quark', 'oz', 5.25));
    carrotCucumberShake.addIngredient(new Ingredient('water', 'cups', 0.67));
    carrotCucumberShake.addIngredient(new Ingredient('ground cumin', 'tsp', 0.5));

    plans.push({
        date: new Date(2018, 10, 5),
        breakfast: eggRadishesToast,
        brunch: appleNutQuark,
        lunch: chickpeaGrapefruitSalad,
        snack: turkeyTomatoSlices,
        dinner: avocadoCeviche,
        workout: carrotCucumberShake
    });


    //  Tuesday 11/6
    let snickersPorridge = new Recipe('Snickers Porridge');
    let oatsBlackberryJam = new Recipe('Oats with Blackberry Jam');
    oatsBlackberryJam.addIngredient(new Ingredient('fine oats', 'oz', 1.33));
    oatsBlackberryJam.addIngredient(new Ingredient('soy yogurt', 'oz', 5.25));
    oatsBlackberryJam.addIngredient(new Ingredient('blackberries', 'oz', 2.67));
    oatsBlackberryJam.addIngredient(new Ingredient('chia seeds', 'tbsp', 1.5));
    oatsBlackberryJam.addIngredient(new Ingredient('lemons', '', 0.5));
    oatsBlackberryJam.addIngredient(new Ingredient('honey', 'tbsp', 1));

    let cauliflowerCurry = new Recipe('Cauliflower Curry');
    let chaoticSalmon = new Recipe('Chaotic Salmon');
    let chickenSate = new Recipe('Chicken Sat&eacute;');
    let cucumberCottageCheeseSandwiches = new Recipe('Cucumber Cottage Cheese Sandwiches');

    plans.push({
        date: new Date(2018, 10, 6),
        breakfast: snickersPorridge,
        brunch: oatsBlackberryJam,
        lunch: cauliflowerCurry,
        snack: chaoticSalmon,
        dinner: chickenSate,
        workout: cucumberCottageCheeseSandwiches
    });


    //  Wednesday 11/7
    let friedSpinachCottageCheese = new Recipe('Fried Spinach with Cottage Cheese');
    let appleAlmondButterSnack = new Recipe('Sliced Apple &amp; Almond Butter');
    let cauliflowerRiceTofu = new Recipe('Cauliflower Rice wth Tofu');
    let crispMozzarellaSlices = new Recipe('Crisp Mozzarella Slices');
    crispMozzarellaSlices.addIngredient(new Ingredient('crisp (whole-grain) bread', 'slices', 7));
    crispMozzarellaSlices.addIngredient(new Ingredient('low-fat mozzarella', 'oz', 4.33));
    crispMozzarellaSlices.addIngredient(new Ingredient('alfalfa sprouts', 'oz', 1.33));

    let roastedQuinoaButternutSalad = new Recipe('Roasted Quinoa Butternut Salad');

    plans.push({
        date: new Date(2018, 10, 7),
        breakfast: friedSpinachCottageCheese,
        brunch: appleAlmondButterSnack,
        lunch: cauliflowerRiceTofu,
        snack: crispMozzarellaSlices,
        dinner: roastedQuinoaButternutSalad,
        workout: carrotCucumberShake
    });


    //  Thursday 11/8
    let scrambledEggBreadChives = new Recipe('Scrambled Egg on Bread with Chives');
    let beetrootCarpaccio = new Recipe('Beetroot Carpaccio');
    let applePeanutButter = new Recipe('Apple & Peanut Butter');
    let quinoaSaladPrawns = new Recipe('Quinoa Salad with Prawns');
    quinoaSaladPrawns.addIngredient(new Ingredient('quinoa', 'oz', 2));
    quinoaSaladPrawns.addIngredient(new Ingredient('organic wild prawns', 'oz', 3.5));
    quinoaSaladPrawns.addIngredient(new Ingredient('garlic', 'cloves', 1));
    quinoaSaladPrawns.addIngredient(new Ingredient('red bell peppers', '', 0.5));
    quinoaSaladPrawns.addIngredient(new Ingredient('cherry tomatoes', '', 3));
    quinoaSaladPrawns.addIngredient(new Ingredient('spring onion', '', 1));
    quinoaSaladPrawns.addIngredient(new Ingredient('fresh parsley', 'bunches', 0.25));
    quinoaSaladPrawns.addIngredient(new Ingredient('virgin olive oil', 'tbsp', 1));
    quinoaSaladPrawns.addIngredient(new Ingredient('balsamic vinegar', 'tsp', 1));
    quinoaSaladPrawns.addIngredient(new Ingredient('turmeric powder', 'pinches', 1));

    let bananaQuark = new Recipe('Banana Quark');
    bananaQuark.addIngredient(new Ingredient('low-fat quark', 'oz', 12.67));
    bananaQuark.addIngredient(new Ingredient('bananas', '', 2));
    bananaQuark.addIngredient(new Ingredient('water', 'cups', 0.75));

    plans.push({
        date: new Date(2018, 10, 8),
        breakfast: scrambledEggBreadChives,
        brunch: oatsBlackberryJam,
        lunch: beetrootCarpaccio,
        snack: applePeanutButter,
        dinner: quinoaSaladPrawns,
        workout: bananaQuark
    });


    //  Friday 11/9
    let chocolateMintLatte = new Recipe('Chocolate Mint Latte');
    chocolateMintLatte.addIngredient(new Ingredient('almond milk', 'cups', 0.75));
    chocolateMintLatte.addIngredient(new Ingredient('bananas', '', 1));
    chocolateMintLatte.addIngredient(new Ingredient('ripe avocados', '', 1));
    chocolateMintLatte.addIngredient(new Ingredient('medjool dates', '', 3));
    chocolateMintLatte.addIngredient(new Ingredient('de-oiled coco powder', 'tsp', 2));
    chocolateMintLatte.addIngredient(new Ingredient('fresh mint', 'bunches', 2));

    let kiwiVanillaOats = new Recipe('Kiwi Vanilla Oats');
    kiwiVanillaOats.addIngredient(new Ingredient('fine oats', 'oz', 1.33));
    kiwiVanillaOats.addIngredient(new Ingredient('soy yogurt', 'oz', 5.25));
    kiwiVanillaOats.addIngredient(new Ingredient('ripe kiwis', '', 2));
    kiwiVanillaOats.addIngredient(new Ingredient('chia seeds', 'tbsp', 2));
    kiwiVanillaOats.addIngredient(new Ingredient('honey', 'tbsp', 1));
    kiwiVanillaOats.addIngredient(new Ingredient('fresh vanilla', 'tsp', 0.5));

    let chickenQuinoaBowlBeetrootHummus = new Recipe('Chicken Quinoa Bowl with Beetroot Hummus');
    let tofuTomatoSlices = new Recipe('Tofu Tomato Slices');
    tofuTomatoSlices.addIngredient(new Ingredient('crisp whole-grain bread', 'slices', 4));
    tofuTomatoSlices.addIngredient(new Ingredient('smoked tofu', 'oz', 3.5));
    tofuTomatoSlices.addIngredient(new Ingredient('tomato', '', 1));
    tofuTomatoSlices.addIngredient(new Ingredient('fresh basil', 'leaves', 8));

    let savryPorridgeSunnyEgg = new Recipe('Savory Porridge with Sunny Egg');
    let mangoLassi = new Recipe('Mango Lassi');

    plans.push({
        date: new Date(2018, 10, 9),
        breakfast: chocolateMintLatte,
        brunch: kiwiVanillaOats,
        lunch: chickenQuinoaBowlBeetrootHummus,
        snack: tofuTomatoSlices,
        dinner: savryPorridgeSunnyEgg,
        workout: mangoLassi
    });


    //  Saturday 11/10
    let onePotChickenKorma = new Recipe('One Pot Chicken Korma');
    let bircherMuesli = new Recipe('Bircher Muesli');
    bircherMuesli.addIngredient(new Ingredient('fine oats', 'oz', 1));
    bircherMuesli.addIngredient(new Ingredient('apples', '', 0.5));
    bircherMuesli.addIngredient(new Ingredient('raisins', 'oz', 0.75));
    bircherMuesli.addIngredient(new Ingredient('ground flaxseeds', 'tbsp', 0.5));
    bircherMuesli.addIngredient(new Ingredient('chopped almonds', 'tbsp', 0.5));
    bircherMuesli.addIngredient(new Ingredient('soy yogurt', 'oz', 2.67));
    bircherMuesli.addIngredient(new Ingredient('soy milk', 'cups', 0.3));
    bircherMuesli.addIngredient(new Ingredient('lemons', '', 0.25));

    let friedFishCurriedSpinach = new Recipe('Fried Fish with Curried Spinach');

    plans.push({
        date: new Date(2018, 10, 10),
        breakfast: oatsBlackberryJam,
        brunch: appleNutQuark,
        lunch: onePotChickenKorma,
        snack: bircherMuesli,
        dinner: friedFishCurriedSpinach,
        workout: null
    });


    //  Sunday 11/11
    let cinnamonBananaShake = new Recipe('Cinnamon Banana Shake');
    cinnamonBananaShake.addIngredient(new Ingredient('almond milk', 'cup', 1));
    cinnamonBananaShake.addIngredient(new Ingredient('soy yogurt', 'oz', 10.5));
    cinnamonBananaShake.addIngredient(new Ingredient('banana', '', 0.5));
    cinnamonBananaShake.addIngredient(new Ingredient('natural almond butter', 'tbsp', 1));
    cinnamonBananaShake.addIngredient(new Ingredient('cinnamon powder', 'tsp', 0.5));

    let quickZucchiniParmesanHash = new Recipe('Quick Zucchini &amp; Parmesan Hash');

    let whiteBeanSoupSmokedTofu = new Recipe('White Bean Soup with Smoked Tofu');
    whiteBeanSoupSmokedTofu.addIngredient(new Ingredient('white beans (canned)', 'oz', 3.5));
    whiteBeanSoupSmokedTofu.addIngredient(new Ingredient('whole-grain pasta', 'oz', 1.75));
    whiteBeanSoupSmokedTofu.addIngredient(new Ingredient('organic vegetable stock', 'cups', 1.67));
    whiteBeanSoupSmokedTofu.addIngredient(new Ingredient('diced tomato', '', 1));
    whiteBeanSoupSmokedTofu.addIngredient(new Ingredient('diced red onion', '', 0.5));
    whiteBeanSoupSmokedTofu.addIngredient(new Ingredient('smoked tofu', 'oz', 1.75));
    whiteBeanSoupSmokedTofu.addIngredient(new Ingredient('mixed Italian herbs', 'tsp', 0.5));
    whiteBeanSoupSmokedTofu.addIngredient(new Ingredient('virgin olive oil', 'tsp', 2));

    plans.push({
        date: new Date(2018, 10, 11),
        breakfast: snickersPorridge,
        brunch: cinnamonBananaShake,
        lunch: chaoticSalmon,
        snack: quickZucchiniParmesanHash,
        dinner: whiteBeanSoupSmokedTofu,
        workout: null
    });


    //  Monday 11/12
    let mustardDeviledEggs = new Recipe('Mustard Deviled Eggs');
    mustardDeviledEggs.addIngredient(new Ingredient('hard-boiled eggs', '', 4));
    mustardDeviledEggs.addIngredient(new Ingredient('Dijon mustard', 'tsp', 2));
    mustardDeviledEggs.addIngredient(new Ingredient('cottage cheese', 'oz', 3.5));
    mustardDeviledEggs.addIngredient(new Ingredient('chopped dill', 'tbsp', 2));

    let pineappleMangoSmoothie = new Recipe('Pineapple Mango Smoothie');
    pineappleMangoSmoothie.addIngredient(new Ingredient('mango', '', 0.5));
    pineappleMangoSmoothie.addIngredient(new Ingredient('fresh pineapple', 'oz', 3.5));
    pineappleMangoSmoothie.addIngredient(new Ingredient('coconut water', 'cups', 0.67));
    pineappleMangoSmoothie.addIngredient(new Ingredient('low-fat coconut milk', 'cups', 0.2));
    pineappleMangoSmoothie.addIngredient(new Ingredient('natural cashew butter', 'tbsp', 1));

    let mintyWatermelonFetaSalad = new Recipe('Minty Watermelon Feta Salad');
    mintyWatermelonFetaSalad.addIngredient(new Ingredient('seedless watermelon', 'oz', 15.75));
    mintyWatermelonFetaSalad.addIngredient(new Ingredient('low-fat feta cheese', 'oz', 5.25));
    mintyWatermelonFetaSalad.addIngredient(new Ingredient('fresh mint', 'bunches', 0.5));
    mintyWatermelonFetaSalad.addIngredient(new Ingredient('roasted pine nuts', 'oz', 1));
    mintyWatermelonFetaSalad.addIngredient(new Ingredient('lime', '', 1));
    mintyWatermelonFetaSalad.addIngredient(new Ingredient('virgin olive oil', 'tsp', 1.5));

    let sweetSpicyWildRice = new Recipe('Sweet & Spicy Wild Rice');
    sweetSpicyWildRice.addIngredient(new Ingredient('wile rice', 'oz', 1.75));
    sweetSpicyWildRice.addIngredient(new Ingredient('mango', '', 0.5));
    sweetSpicyWildRice.addIngredient(new Ingredient('cooked beetroot', 'oz', 1.75));
    sweetSpicyWildRice.addIngredient(new Ingredient('cashews', 'oz', 1));
    sweetSpicyWildRice.addIngredient(new Ingredient('lime', '', 0.5));
    sweetSpicyWildRice.addIngredient(new Ingredient('sliced chili peppers', '', 0.5));
    sweetSpicyWildRice.addIngredient(new Ingredient('fresh cilantro', 'bunches', 0.25));
    sweetSpicyWildRice.addIngredient(new Ingredient('fresh mint', 'bunches', 0.25));
    sweetSpicyWildRice.addIngredient(new Ingredient('low-sodium soy sauce', 'tbsp', 1));
    sweetSpicyWildRice.addIngredient(new Ingredient('cayenne pepper', 'pinch', 1));

    let mintyQuarkShake = new Recipe('Minty Quark Shake');
    mintyQuarkShake.addIngredient(new Ingredient('low-fat quark', 'oz', 14));
    mintyQuarkShake.addIngredient(new Ingredient('cucumber', '', 1));
    mintyQuarkShake.addIngredient(new Ingredient('fresh mint', 'bunches', 1));
    mintyQuarkShake.addIngredient(new Ingredient('low-fat milk', 'cups', 0.75));
    mintyQuarkShake.addIngredient(new Ingredient('water', 'cups', 1.25));

    plans.push({
        date: new Date(2018, 10, 12),
        breakfast: mustardDeviledEggs,
        brunch: pineappleMangoSmoothie,
        lunch: mintyWatermelonFetaSalad,
        snack: crispMozzarellaSlices,
        dinner: sweetSpicyWildRice,
        workout: mintyQuarkShake
    });


    //  Tuesday 11/13
    let berryApricotMuesli = new Recipe('Berry Apricot Muesli');

    plans.push({
        date: new Date(2018, 10, 13),
        breakfast: cinnamonBananaShake,
        brunch: tofuTomatoSlices,
        lunch: sweetSpicyWildRice,
        snack: berryApricotMuesli,
        dinner: chickenQuinoaBowlBeetrootHummus,
        workout: bananaQuark
    });


    //  Wednesday 11/14
    let peanutButterOvernightOats = new Recipe('Peanut Butter Overnight Oats');
    let blueberryBomb = new Recipe('Blueberry Bomb');
    blueberryBomb.addIngredient(new Ingredient('blueberries', 'oz', 8.75));
    blueberryBomb.addIngredient(new Ingredient('banana', '', 1));
    blueberryBomb.addIngredient(new Ingredient('soy yogurt', 'oz', 14));
    blueberryBomb.addIngredient(new Ingredient('maple syrup', 'tsp', 2));

    plans.push({
        date: new Date(2018, 10, 14),
        breakfast: peanutButterOvernightOats,
        brunch: kiwiVanillaOats,
        lunch: whiteBeanSoupSmokedTofu,
        snack: eggRadishesToast,
        dinner: spinachApricotSalad,
        workout: blueberryBomb
    });


    //  Thursday 11/15
    let crayfishAvocadoBread = new Recipe('Crayfish Avocado Bread');
    crayfishAvocadoBread.addIngredient(new Ingredient('whole-grain bread', 'slices', 2));
    crayfishAvocadoBread.addIngredient(new Ingredient('avocados', '', 0.5));
    crayfishAvocadoBread.addIngredient(new Ingredient('crayfish (cooked and peeled)', 'oz', 4.33));

    let greenVegetablesFetaCheese = new Recipe('Green Vegetables with Feta Cheese');
    let greekFetaWrap = new Recipe('Greek Feta Wrap');
    greekFetaWrap.addIngredient(new Ingredient('whole-grain wraps', '', 2));
    greekFetaWrap.addIngredient(new Ingredient('iceberg lettuce', 'oz', 0.75));
    greekFetaWrap.addIngredient(new Ingredient('kidney beans', 'oz', 2.75));
    greekFetaWrap.addIngredient(new Ingredient('low-fat feta cheese', 'oz', 2));
    greekFetaWrap.addIngredient(new Ingredient('cucumbers', 'slices', 10));
    greekFetaWrap.addIngredient(new Ingredient('low-fat yogurt', 'tbsp', 2));

    let lemonHerbChicken = new Recipe('Lemon Herb Chicken');

    plans.push({
        date: new Date(2018, 10, 15),
        breakfast: crayfishAvocadoBread,
        brunch: greenVegetablesFetaCheese,
        lunch: chickpeaGrapefruitSalad,
        snack: greekFetaWrap,
        dinner: lemonHerbChicken,
        workout: carrotCucumberShake
    });


    //  Friday 11/16
    let chiliCarne = new Recipe('Chili con Carne');
    chiliCarne.addIngredient(new Ingredient('ground lean beef', 'oz', 7));
    chiliCarne.addIngredient(new Ingredient('kidney beans', 'oz', 3.5));
    chiliCarne.addIngredient(new Ingredient('chopped tomatoes', '', 2));
    chiliCarne.addIngredient(new Ingredient('sliced carrots', '', 2));
    chiliCarne.addIngredient(new Ingredient('diced onion', '', 1));
    chiliCarne.addIngredient(new Ingredient('chopped garlic', 'cloves', 1));
    chiliCarne.addIngredient(new Ingredient('grated ginger', 'oz', 0.4));
    chiliCarne.addIngredient(new Ingredient('water', 'cups', 0.75));
    chiliCarne.addIngredient(new Ingredient('chili flakes', 'tsp', 0.5));
    chiliCarne.addIngredient(new Ingredient('coconut oil', 'tsp', 1));
    chiliCarne.addIngredient(new Ingredient('cilantro (coriander)', 'bunches', 0.5));

    let honeyQuark = new Recipe('Honey Quark');
    let ovenBakedPotatoesShrimp = new Recipe('Oven Baked Potatoes with Shrimp');

    plans.push({
        date: new Date(2018, 10, 16),
        breakfast: bircherMuesli,
        brunch: cinnamonBananaShake,
        lunch: chiliCarne,
        snack: honeyQuark,
        dinner: tofuTomatoSlices,
        workout: ovenBakedPotatoesShrimp
    });


    //  Saturday 11/17
    let oatmealEnergyShake = new Recipe('Oatmeal Energy Shake');
    let riceCrackerEggApple = new Recipe('Rice Cracker with Egg and Apple');
    let sweetSpicyCarrotSalad = new Recipe('Sweet and Spicy Carrot Salad');

    plans.push({
        date: new Date(2018, 10, 17),
        breakfast: honeyQuark,
        brunch: oatmealEnergyShake,
        lunch: riceCrackerEggApple,
        snack: oatsBlackberryJam,
        dinner: sweetSpicyCarrotSalad,
    });


    //  Sunday 11/18
    let vanillaChiaPudding = new Recipe('Vanilla Chia Pudding');
    let healthierQuesadilla = new Recipe('Healthier Quesadilla');
    healthierQuesadilla.addIngredient(new Ingredient('whole-grain tortilla', '', 2));
    healthierQuesadilla.addIngredient(new Ingredient('low-fat yogurt', 'tbsp', 2));
    healthierQuesadilla.addIngredient(new Ingredient('tomatoes', '', 1));
    healthierQuesadilla.addIngredient(new Ingredient('jalapenos', '', 1.5));
    healthierQuesadilla.addIngredient(new Ingredient('spring onions', '', 2));
    healthierQuesadilla.addIngredient(new Ingredient('low-fat cheddar cheese', 'oz', 1.33));
    healthierQuesadilla.addIngredient(new Ingredient('roasted sunflower seeds', 'tsp', 4));

    plans.push({
        date: new Date(2018, 10, 18),
        breakfast: vanillaChiaPudding,
        brunch: savryPorridgeSunnyEgg,
        lunch: beetrootCarpaccio,
        snack: berryApricotMuesli,
        dinner: healthierQuesadilla
    });


    //  Sunday 11/25
    let whiteBeansCreamySauce = new Recipe('White Beans with Creamy Sauce');
    whiteBeansCreamySauce.addIngredient(new Ingredient('white beans', 'oz', 5.25));
    whiteBeansCreamySauce.addIngredient(new Ingredient('cooked chickpeas', 'oz', 3.5));
    whiteBeansCreamySauce.addIngredient(new Ingredient('cottage cheese', 'oz', 7));
    whiteBeansCreamySauce.addIngredient(new Ingredient('diced cherry tomatoes', 'oz', 3.5));
    whiteBeansCreamySauce.addIngredient(new Ingredient('lemons', '', 0.5));
    whiteBeansCreamySauce.addIngredient(new Ingredient('chopped dill', 'bunches', 0.5));
    whiteBeansCreamySauce.addIngredient(new Ingredient('parsley', 'bunches', 0.5));

    plans.push({
        date: new Date(2018, 10, 25),
        dinner: whiteBeansCreamySauce
    });


    //  Monday 11/26
    let tunaCornWrap = new Recipe('Tuna-Corn Wrap');
    tunaCornWrap.addIngredient(new Ingredient('whole-grain tortilla', '', 2));
    tunaCornWrap.addIngredient(new Ingredient('water-packed tuna', 'oz', 5.25));
    tunaCornWrap.addIngredient(new Ingredient('eggs', '', 2));
    tunaCornWrap.addIngredient(new Ingredient('yellow corn', 'oz', 3, 5));
    tunaCornWrap.addIngredient(new Ingredient('whole yogurt', 'tbsp', 4));
    tunaCornWrap.addIngredient(new Ingredient('Dijon mustard', 'tsp', 2));

    plans.push({
        date: new Date(2018, 10, 26),
        breakfast: kiwiVanillaOats,
        brunch: bircherMuesli,
        lunch: tunaCornWrap,
        dinner: healthierQuesadilla,
        workout: bananaQuark
    });


    //  Tuesday 11/27
    let coconutQuinoaMuesli = new Recipe('Coconut Quinoa Muesli');
    coconutQuinoaMuesli.addIngredient(new Ingredient('quinoa', 'oz', 1.75));
    coconutQuinoaMuesli.addIngredient(new Ingredient('almond milk', 'cups', 0.67));
    coconutQuinoaMuesli.addIngredient(new Ingredient('low-fat quark', 'oz', 7));
    coconutQuinoaMuesli.addIngredient(new Ingredient('coconut flakes', 'tsp', 4));
    coconutQuinoaMuesli.addIngredient(new Ingredient('red currants', 'oz', 3.5));
    coconutQuinoaMuesli.addIngredient(new Ingredient('water', 'cups', 0.2));

    let apricotPorridge = new Recipe('Apricot Porridge');
    apricotPorridge.addIngredient(new Ingredient('oats', 'oz', 1.25));
    apricotPorridge.addIngredient(new Ingredient('almond milk', 'cups', 0.67));
    apricotPorridge.addIngredient(new Ingredient('bananas', '', 0.5));
    apricotPorridge.addIngredient(new Ingredient('dried apricots', '', 2));
    apricotPorridge.addIngredient(new Ingredient('roasted sunflower seeds', 'oz', 0.5));
    apricotPorridge.addIngredient(new Ingredient('unrefined salt', 'pinch', 1));

    let quickChickpeaVeggieSoup = new Recipe('Quick Chickpea Veggie Soup');
    quickChickpeaVeggieSoup.addIngredient(new Ingredient('cooked chickpeas', 'oz', 8.75));
    quickChickpeaVeggieSoup.addIngredient(new Ingredient('carrots', '', 1));
    quickChickpeaVeggieSoup.addIngredient(new Ingredient('tomatoes', '', 1));
    quickChickpeaVeggieSoup.addIngredient(new Ingredient('green beans', 'oz', 3.5));
    quickChickpeaVeggieSoup.addIngredient(new Ingredient('vegetable stock', 'cups', 1.25));
    quickChickpeaVeggieSoup.addIngredient(new Ingredient('grated Parmesean cheese', 'oz', 1.33));
    quickChickpeaVeggieSoup.addIngredient(new Ingredient('whole-grain bread', 'slices', 2));

    let simpleBananaMuffins = new Recipe('Simple Banana Muffins');
    simpleBananaMuffins.addIngredient(new Ingredient('eggs', '', 3));
    simpleBananaMuffins.addIngredient(new Ingredient('bananas', '', 1.5));
    simpleBananaMuffins.addIngredient(new Ingredient('raspberries', 'oz', 5.25));
    simpleBananaMuffins.addIngredient(new Ingredient('coconut oil', 'tsp', 1.5));

    let indianPotatoSalad = new Recipe('Indian Potato Salad');
    indianPotatoSalad.addIngredient(new Ingredient('small potatoes', 'oz', 14));
    indianPotatoSalad.addIngredient(new Ingredient('red onions', '', 0.5));
    indianPotatoSalad.addIngredient(new Ingredient('limes', '', 0.5));
    indianPotatoSalad.addIngredient(new Ingredient('chopped cilantro', 'tbsp', 1));
    indianPotatoSalad.addIngredient(new Ingredient('parsley', 'tbsp', 1));
    indianPotatoSalad.addIngredient(new Ingredient('curry powder', 'pinch', 1));
    indianPotatoSalad.addIngredient(new Ingredient('turmeric powder', 'pinch', 1));
    indianPotatoSalad.addIngredient(new Ingredient('cayenne papper', 'pinch', 1));
    indianPotatoSalad.addIngredient(new Ingredient('ground cumin', 'pinch', 1));
    indianPotatoSalad.addIngredient(new Ingredient('black sesame', 'tbsp', 1));
    indianPotatoSalad.addIngredient(new Ingredient('virgin olive oil', 'tbsp', 1));

    plans.push({
        date: new Date(2018, 10, 27),
        breakfast: coconutQuinoaMuesli,
        brunch: apricotPorridge,
        lunch: quickChickpeaVeggieSoup,
        snack: simpleBananaMuffins,
        dinner: indianPotatoSalad,
        workout: whiteBeansCreamySauce
    });


    //  Wednesday 11/28
    let stuffedMedjoolDates = new Recipe('Stuffed Medjool Dates');
    stuffedMedjoolDates.addIngredient(new Ingredient('medjool dates', '', 6));
    stuffedMedjoolDates.addIngredient(new Ingredient('almond butter', 'tsp', 6));

    let mediterraneanPastaSalad = new Recipe('Mediterranean Pasta Salad');
    mediterraneanPastaSalad.addIngredient(new Ingredient('whole-grain pasta', 'oz', 2));
    mediterraneanPastaSalad.addIngredient(new Ingredient('low-fat mozzarella', 'oz', 3.5));
    mediterraneanPastaSalad.addIngredient(new Ingredient('sun-dried tomatoes', 'oz', 1));
    mediterraneanPastaSalad.addIngredient(new Ingredient('arugula', 'oz', 1));
    mediterraneanPastaSalad.addIngredient(new Ingredient('dried oregano', 'tsp', 1));
    mediterraneanPastaSalad.addIngredient(new Ingredient('balsamic vinegar', 'tsp', 1));

    plans.push({
        date: new Date(2018, 10, 28),
        breakfast: bircherMuesli,
        brunch: oatsBlackberryJam,
        lunch: sweetSpicyWildRice,
        snack: stuffedMedjoolDates,
        dinner: mediterraneanPastaSalad,
        workout: bananaQuark
    });


    //  Thursday 11/29
    let sweetQuinoaCreamyAvocado = new Recipe('Sweet Quinoa with Creamy Avocado');
    sweetQuinoaCreamyAvocado.addIngredient(new Ingredient('quinoa', 'oz', 1.75));
    sweetQuinoaCreamyAvocado.addIngredient(new Ingredient('avocados', '', 0.5));
    sweetQuinoaCreamyAvocado.addIngredient(new Ingredient('fresh vanilla', 'tsp', 0.5));
    sweetQuinoaCreamyAvocado.addIngredient(new Ingredient('honey', 'tsp', 1));
    sweetQuinoaCreamyAvocado.addIngredient(new Ingredient('almond milk', 'cups', 0.4));
    sweetQuinoaCreamyAvocado.addIngredient(new Ingredient('pomegranates', '', 0.5));

    let redLentilDaal = new Recipe('Red Lentil Daal');
    redLentilDaal.addIngredient(new Ingredient('red lentils', 'oz', 5.25));
    redLentilDaal.addIngredient(new Ingredient('red onion', '', 1));
    redLentilDaal.addIngredient(new Ingredient('garlic', 'cloves', 1.5));
    redLentilDaal.addIngredient(new Ingredient('ginger', 'oz', 0.5));
    redLentilDaal.addIngredient(new Ingredient('low-fat coconut milk', 'cups', 0.67));
    redLentilDaal.addIngredient(new Ingredient('water', 'cups', 1));
    redLentilDaal.addIngredient(new Ingredient('ground cumin', 'pinch', 1));
    redLentilDaal.addIngredient(new Ingredient('turmeric powder', 'pinch', 1));
    redLentilDaal.addIngredient(new Ingredient('ground coriander', 'pinch', 1));
    redLentilDaal.addIngredient(new Ingredient('cayennne pepper', 'pinch', 1));
    redLentilDaal.addIngredient(new Ingredient('bay leaves', '', 3));

    let potatoBellPepperPanMushrooms = new Recipe('Potato Bell Pepper Pan with Mushrooms');
    potatoBellPepperPanMushrooms.addIngredient(new Ingredient('cooked potatoes', 'oz', 8.75));
    potatoBellPepperPanMushrooms.addIngredient(new Ingredient('red bell peppers', '', 1));
    potatoBellPepperPanMushrooms.addIngredient(new Ingredient('garlic', 'cloves', 1));
    potatoBellPepperPanMushrooms.addIngredient(new Ingredient('brown mushrooms', '', 6));
    potatoBellPepperPanMushrooms.addIngredient(new Ingredient('chopped tomatoes', 'oz', 8.75));
    potatoBellPepperPanMushrooms.addIngredient(new Ingredient('virgin olive oil', 'tsp', 1.5));

    plans.push({
        date: new Date(2018, 10, 29),
        breakfast: sweetQuinoaCreamyAvocado,
        brunch: kiwiVanillaOats,
        lunch: redLentilDaal,
        snack: crayfishAvocadoBread,
        dinner: potatoBellPepperPanMushrooms,
        workout: blueberryBomb
    });


    //  Friday 11/30
    let appleCelerySnack = new Recipe('Apple Celery Snack');
    appleCelerySnack.addIngredient(new Ingredient('cottage cheese', 'oz', 10.5));
    appleCelerySnack.addIngredient(new Ingredient('celery', 'stalks', 2));
    appleCelerySnack.addIngredient(new Ingredient('apple', '', 1));
    appleCelerySnack.addIngredient(new Ingredient('curry powder', 'tsp', 0.5));
    appleCelerySnack.addIngredient(new Ingredient('parsely', 'bunches', 0.5));

    let veganBeetrootSalad = new Recipe('Vegan Beetroot Salad');
    veganBeetrootSalad.addIngredient(new Ingredient('cooked beetroot', 'oz', 0.5));
    veganBeetrootSalad.addIngredient(new Ingredient('kohlrabi', '', 1));
    veganBeetrootSalad.addIngredient(new Ingredient('diced apples', '', 1.5));
    veganBeetrootSalad.addIngredient(new Ingredient('cooked chickpeas', 'oz', 7));
    veganBeetrootSalad.addIngredient(new Ingredient('natural almond butter', 'tbsp', 1));
    veganBeetrootSalad.addIngredient(new Ingredient('virgin olive oil', 'tbsp', 1));

    let wholeGrainPizzaSlices = new Recipe('Whole-Grain Pizza Slices');
    wholeGrainPizzaSlices.addIngredient(new Ingredient('whole-grain bread', 'slices', 3));
    wholeGrainPizzaSlices.addIngredient(new Ingredient('tomato puree', 'tsp', 2));
    wholeGrainPizzaSlices.addIngredient(new Ingredient('brown mushroom', '', 1));
    wholeGrainPizzaSlices.addIngredient(new Ingredient('lean ham (slices)', 'oz', 1.75));
    wholeGrainPizzaSlices.addIngredient(new Ingredient('low-fat mozzarella', 'oz', 3.5));

    plans.push({
            date: new Date(2018, 10, 30),
            breakfast: oatsBlackberryJam,
            brunch: appleCelerySnack,
            lunch: veganBeetrootSalad,
            snack: bircherMuesli,
            dinner: chiliCarne,
            workout: wholeGrainPizzaSlices
        });


    //  Sunday 12/2
    let texMexPotatoPan = new Recipe('Tex-Mex Potato Pan');
    texMexPotatoPan.addIngredient(new Ingredient('potatoes', 'oz', 10.5));
    texMexPotatoPan.addIngredient(new Ingredient('tomatoes', '', 1));
    texMexPotatoPan.addIngredient(new Ingredient('red onion', '', 1));
    texMexPotatoPan.addIngredient(new Ingredient('yellow corn (canned)', 'oz', 2));
    texMexPotatoPan.addIngredient(new Ingredient('kidney beans', 'oz', 2));
    texMexPotatoPan.addIngredient(new Ingredient('jalapeno', '', 1));
    texMexPotatoPan.addIngredient(new Ingredient('low-fat cheddar cheese', 'oz', 1.33));
    texMexPotatoPan.addIngredient(new Ingredient('virgin olive oil', 'tsp', 3));

    plans.push({
        date: new Date(2018, 11, 2),
        dinner: texMexPotatoPan
    });


    //  Monday 12/3
    plans.push({
        date: new Date(2018, 11, 3),
        breakfast: bircherMuesli,
        brunch: crispMozzarellaSlices,
        lunch: sweetSpicyWildRice,
        snack: chocolateMintLatte,
        dinner: quinoaSaladPrawns,
        workout: bananaQuark
    });


    //  Tuesday 12/4
    let mangoOvernightOats = new Recipe('Mango Overnight Oats');
    mangoOvernightOats.addIngredient(new Ingredient('fine oats', 'oz', 0.75));
    mangoOvernightOats.addIngredient(new Ingredient('ground flaxseeds', 'tbsp', 2));
    mangoOvernightOats.addIngredient(new Ingredient('diced mangoes', '', 0.5));
    mangoOvernightOats.addIngredient(new Ingredient('banana', '', 1));
    mangoOvernightOats.addIngredient(new Ingredient('low-fat milk', 'cups', 0.67));

    let beefQuinoaBowlCoconutTomatoSauce = new Recipe('Beef Quinoa Bowl with Coconut Tomato Sauce');
    beefQuinoaBowlCoconutTomatoSauce.addIngredient(new Ingredient('lean beef (steak or fillet)', 'oz', 5.25));
    beefQuinoaBowlCoconutTomatoSauce.addIngredient(new Ingredient('quinoa', 'oz', 2.67));
    beefQuinoaBowlCoconutTomatoSauce.addIngredient(new Ingredient('cooked chickpeas', 'oz', 2.67));
    beefQuinoaBowlCoconutTomatoSauce.addIngredient(new Ingredient('hummus', 'oz', 1.75));
    beefQuinoaBowlCoconutTomatoSauce.addIngredient(new Ingredient('low-fat coconut milk', 'cups', 0.2));
    beefQuinoaBowlCoconutTomatoSauce.addIngredient(new Ingredient('halved cherry tomatoes', '', 3));
    beefQuinoaBowlCoconutTomatoSauce.addIngredient(new Ingredient('ground cumin', 'tsp', 0.5));
    beefQuinoaBowlCoconutTomatoSauce.addIngredient(new Ingredient('spring onion', '', 1));
    beefQuinoaBowlCoconutTomatoSauce.addIngredient(new Ingredient('coconut oil', 'tsp', 0.5));

    let eggSandwiches = new Recipe('Egg Sandwiches');
    eggSandwiches.addIngredient(new Ingredient('whole-grain bread', 'slices', 3));
    eggSandwiches.addIngredient(new Ingredient('low-fat cream cheese', 'oz', 1.75));
    eggSandwiches.addIngredient(new Ingredient('eggs', '', 2));
    eggSandwiches.addIngredient(new Ingredient('red radishes', '', 3));

    let fruityTurkeyBreastCrispBread = new Recipe('Fruity Turkey Breast on Crisp Bread');
    fruityTurkeyBreastCrispBread.addIngredient(new Ingredient('crisp bread', 'slices', 8));
    fruityTurkeyBreastCrispBread.addIngredient(new Ingredient('cold cuts turkey breast', 'oz', 4.25));
    fruityTurkeyBreastCrispBread.addIngredient(new Ingredient('peach', '', 1));
    fruityTurkeyBreastCrispBread.addIngredient(new Ingredient('alfalfa sprouts', 'oz', 1.33));

    let bakedOatmealDriedFigs = new Recipe('Baked Oatmeal with Dried Figs');
    bakedOatmealDriedFigs.addIngredient(new Ingredient('fine oats', 'oz', 1.75));
    bakedOatmealDriedFigs.addIngredient(new Ingredient('almond milk', 'cups', 0.2));
    bakedOatmealDriedFigs.addIngredient(new Ingredient('egg whites', '', 3));
    bakedOatmealDriedFigs.addIngredient(new Ingredient('dried figs', '', 4));
    bakedOatmealDriedFigs.addIngredient(new Ingredient('honey', 'tsp', 1));
    bakedOatmealDriedFigs.addIngredient(new Ingredient('coconut oil', 'tsp', 1));

    plans.push({
        date: new Date(2018, 11, 4),
        breakfast: mangoOvernightOats,
        brunch: bircherMuesli,
        lunch: beefQuinoaBowlCoconutTomatoSauce,
        snack: eggSandwiches,
        dinner: fruityTurkeyBreastCrispBread,
        workout: bakedOatmealDriedFigs
    });


    //  Wednesday 12/5
    let quinoaGrilledChickenSalad = new Recipe('Quinoa and Grilled Chicken Salad');
    quinoaGrilledChickenSalad.addIngredient(new Ingredient('grilled chicken breast', 'oz', 5.25));
    quinoaGrilledChickenSalad.addIngredient(new Ingredient('quinoa', 'oz', 1.75));
    quinoaGrilledChickenSalad.addIngredient(new Ingredient('diced tomato', '', 1));
    quinoaGrilledChickenSalad.addIngredient(new Ingredient('diced cucumber', '', 0.5));
    quinoaGrilledChickenSalad.addIngredient(new Ingredient('sliced spring onion', '', 3));
    quinoaGrilledChickenSalad.addIngredient(new Ingredient('fresh parsley', 'bunches', 0.5));
    quinoaGrilledChickenSalad.addIngredient(new Ingredient('fresh mint', 'bunches', 0.5));
    quinoaGrilledChickenSalad.addIngredient(new Ingredient('water', 'cups', 0.4));
    quinoaGrilledChickenSalad.addIngredient(new Ingredient('virgin olive oil', 'tsp', 2));

    plans.push({
        date: new Date(2018, 11, 5),
        breakfast: crayfishAvocadoBread,
        brunch: appleCelerySnack,
        lunch: chickpeaGrapefruitSalad,
        snack: greekFetaWrap,
        dinner: quinoaGrilledChickenSalad,
        workout: carrotCucumberShake
    });


    //  Monday 1/7
    let easyBananaBreadForOne = new Recipe('Easy Banana Bread for One');
    easyBananaBreadForOne.addIngredient(new Ingredient('bananas', '', 0.5));
    easyBananaBreadForOne.addIngredient(new Ingredient('eggs', '', 1));
    easyBananaBreadForOne.addIngredient(new Ingredient('fat-free Greek yogurt', 'oz', 1.75));
    easyBananaBreadForOne.addIngredient(new Ingredient('fine oats', 'oz', 1));
    easyBananaBreadForOne.addIngredient(new Ingredient('ground almonds', 'tbsp', 1));
    easyBananaBreadForOne.addIngredient(new Ingredient('de-oiled cocoa powder', 'tsp', 0.5));
    easyBananaBreadForOne.addIngredient(new Ingredient('maple syrup', 'tsp', 1));
    easyBananaBreadForOne.addIngredient(new Ingredient('coconut oil', 'tsp', 0.5));
    easyBananaBreadForOne.addIngredient(new Ingredient('coconut flakes', 'tsp', 0.5));

    plans.push({
        date: new Date(2019, 0, 7),
        breakfast: kiwiVanillaOats,
        lunch: sweetSpicyWildRice,
        snack: stuffedMedjoolDates,
        dinner: healthierQuesadilla,
        workout: bananaQuark
    });
    plan.saveRecipe(kiwiVanillaOats);


    //  Tuesday 1/8
    let applesauceOvernightOats = new Recipe('Applesauce Overnight Oats');
    applesauceOvernightOats.addIngredient(new Ingredient('oats', 'oz', 2));
    applesauceOvernightOats.addIngredient(new Ingredient('natural applesauce', 'oz', 4.25));
    applesauceOvernightOats.addIngredient(new Ingredient('chia seeds', 'tbsp', 1));
    applesauceOvernightOats.addIngredient(new Ingredient('honey', 'tbsp', 1));
    applesauceOvernightOats.addIngredient(new Ingredient('chopped almonds', 'oz', 0.5));
    applesauceOvernightOats.addIngredient(new Ingredient('cinnamon powder', 'tsp', 0.5));

    let sarasVeganBurgers = new Recipe('Sara\'s Vegan Burgers');
    sarasVeganBurgers.addIngredient(new Ingredient('sweet potatoes', '', 2));
    sarasVeganBurgers.addIngredient(new Ingredient('chickpeas', 'cups', 2));
    sarasVeganBurgers.addIngredient(new Ingredient('rolled oats', 'cups', 1.5));
    sarasVeganBurgers.addIngredient(new Ingredient('bell pepper', 'cups', 1));
    sarasVeganBurgers.addIngredient(new Ingredient('diced onion', 'cups', 1));
    sarasVeganBurgers.addIngredient(new Ingredient('celery', 'cups', 0.25));
    sarasVeganBurgers.addIngredient(new Ingredient('olive oil', 'tsp', 2));
    sarasVeganBurgers.addIngredient(new Ingredient('garlic', 'cloves', 2));
    sarasVeganBurgers.addIngredient(new Ingredient('eggs', '', 1));
    sarasVeganBurgers.addIngredient(new Ingredient('cajun seasoning', 'tbsp', 1.5));
    sarasVeganBurgers.addIngredient(new Ingredient('garlic powder', 'tsp', 0.25));
    sarasVeganBurgers.addIngredient(new Ingredient('cayenne pepper', 'tsp', 0.25));
    sarasVeganBurgers.addIngredient(new Ingredient('avocado', '', 1));
    sarasVeganBurgers.addIngredient(new Ingredient('burger buns', '', 5));

    let bakedPumpkinKaleBreadChips = new Recipe('Baked Pumpkin on Kale with Bread Chips');
    bakedPumpkinKaleBreadChips.addIngredient(new Ingredient('hokkaido squash', 'oz', 7));
    bakedPumpkinKaleBreadChips.addIngredient(new Ingredient('kale', 'oz', 3.5));
    bakedPumpkinKaleBreadChips.addIngredient(new Ingredient('goat cream cheese', 'oz', 2.75));
    bakedPumpkinKaleBreadChips.addIngredient(new Ingredient('pomegranates', '', 0.25));
    bakedPumpkinKaleBreadChips.addIngredient(new Ingredient('whole-grain bread', 'slices', 0.5));
    bakedPumpkinKaleBreadChips.addIngredient(new Ingredient('chopped hazlenuts', 'oz', 0.4));
    bakedPumpkinKaleBreadChips.addIngredient(new Ingredient('lemons', '', 0.5));
    bakedPumpkinKaleBreadChips.addIngredient(new Ingredient('honey', 'tsp', 0.5));
    bakedPumpkinKaleBreadChips.addIngredient(new Ingredient('Dijon mustard', 'tsp', 0.5));
    bakedPumpkinKaleBreadChips.addIngredient(new Ingredient('hazlenut oil', 'tsp', 0.5));

    plans.push({
        date: new Date(2019, 0, 8),
        breakfast: applesauceOvernightOats,
        brunch: fruityTurkeyBreastCrispBread,
        lunch: sarasVeganBurgers,
        snack: oatsBlackberryJam,
        dinner: bakedPumpkinKaleBreadChips,
        workout: blueberryBomb
    });


    //  Wednesday 1/9
    let raspberryAmaranthMuesli = new Recipe('Raspberry Amaranth Muesli');
    raspberryAmaranthMuesli.addIngredient(new Ingredient('popped amaranth', 'oz', 1.75));
    raspberryAmaranthMuesli.addIngredient(new Ingredient('raspberries', 'oz', 5.25));
    raspberryAmaranthMuesli.addIngredient(new Ingredient('soy yogurt', 'oz', 5.25));
    raspberryAmaranthMuesli.addIngredient(new Ingredient('coconut flakes', 'tbsp', 1));
    raspberryAmaranthMuesli.addIngredient(new Ingredient('honey', 'tsp', 2));

    let veganChili = new Recipe('Vegan Chili');
    veganChili.addIngredient(new Ingredient('wild rice', 'oz', 2.67));
    veganChili.addIngredient(new Ingredient('water', 'cups', 0.67));
    veganChili.addIngredient(new Ingredient('carrots', '', 1));
    veganChili.addIngredient(new Ingredient('garlic', 'cloves', 1));
    veganChili.addIngredient(new Ingredient('black beans', 'oz', 5.25));
    veganChili.addIngredient(new Ingredient('kidney beans', 'oz', 3.5));
    veganChili.addIngredient(new Ingredient('chopped tomatoes (canned)', 'oz', 5.25));
    veganChili.addIngredient(new Ingredient('tomato puree', 'tbsp', 1));
    veganChili.addIngredient(new Ingredient('chili flakes', 'tsp', 0.5));
    veganChili.addIngredient(new Ingredient('cayenne pepper', 'tsp', 0.25));
    veganChili.addIngredient(new Ingredient('virgin olive oil', 'tsp', 1.5));

    let pestoFishCaserole = new Recipe('Pesto Fish Caserole');
    pestoFishCaserole.addIngredient(new Ingredient('white fish fillet', 'oz', 6.33));
    pestoFishCaserole.addIngredient(new Ingredient('fennel', 'bulbs', 1));
    pestoFishCaserole.addIngredient(new Ingredient('onion', '', 1));
    pestoFishCaserole.addIngredient(new Ingredient('cherry tomatoes', 'oz', 8.75));
    pestoFishCaserole.addIngredient(new Ingredient('green pesto', 'tbsp', 2));
    pestoFishCaserole.addIngredient(new Ingredient('grated Parmesan cheese', 'oz', 0.75));
    pestoFishCaserole.addIngredient(new Ingredient('water', 'cups', 0.4));

    let sarasChickpeaWalnutTacos = new Recipe('Sara\'s Chickpea Walnut Tacos');
    sarasChickpeaWalnutTacos.addIngredient(new Ingredient('chickpeas', 'can', 1));
    sarasChickpeaWalnutTacos.addIngredient(new Ingredient('onion', '', 1));
    sarasChickpeaWalnutTacos.addIngredient(new Ingredient('walnuts', 'cups', 1));
    sarasChickpeaWalnutTacos.addIngredient(new Ingredient('tortillas', 'bag', 1));
    sarasChickpeaWalnutTacos.addIngredient(new Ingredient('sour cream', 'oz', 6));

    plans.push({
        date: new Date(2019, 0, 9),
        lunch: veganChili,
        snack: bircherMuesli,
        dinner: sarasChickpeaWalnutTacos,
        workout: tunaCornWrap
    });


    //  Thursday 1/10
    plans.push({
        date: new Date(2019, 0, 10),
        breakfast: bakedOatmealDriedFigs,
        brunch: chickpeaGrapefruitSalad,
        lunch: sarasVeganBurgers,
        snack: crayfishAvocadoBread,
        dinner: beefQuinoaBowlCoconutTomatoSauce,
        workout: mangoLassi
    });


    //  Friday 1/11
    plans.push({
        date: new Date(2019, 0, 11),
        breakfast: eggSandwiches,
        brunch: pineappleMangoSmoothie,
        lunch: veganBeetrootSalad,
        snack: snickersPorridge,
        dinner: beetrootCarpaccio
    });

    //  These loops aggregate ingredients over a given time period and print sums to the console
    let shoppingList = [];
    let week = {
        start: new Date(2019, 0, 6),
        end: new Date(2019, 0, 9)
    };
    for(let i=0; i<plans.length; i++) {
        let d = plans[i].date;
        if(plans[i].breakfast) {
            plan.index.addEntry(plans[i].breakfast);
            plan.calendar.addRecipe(plans[i].breakfast, d, BREAKFAST);

            if(d >= week.start && d < week.end)
                shoppingList = shoppingList.concat(plans[i].breakfast.ingredients);
        }
        if(plans[i].brunch) {
            plan.index.addEntry(plans[i].brunch);
            plan.calendar.addRecipe(plans[i].brunch, d, BRUNCH);

            if(d >= week.start && d < week.end)
                shoppingList = shoppingList.concat(plans[i].brunch.ingredients);
        }
        if(plans[i].lunch) {
            plan.index.addEntry(plans[i].lunch);
            plan.calendar.addRecipe(plans[i].lunch, d, LUNCH);

            if(d >= week.start && d < week.end)
                shoppingList = shoppingList.concat(plans[i].lunch.ingredients);
        }
        if(plans[i].snack) {
            plan.index.addEntry(plans[i].snack);
            plan.calendar.addRecipe(plans[i].snack, d, SNACK);

            if(d >= week.start && d < week.end)
                shoppingList = shoppingList.concat(plans[i].snack.ingredients);
        }
        if(plans[i].dinner) {
            plan.index.addEntry(plans[i].dinner);
            plan.calendar.addRecipe(plans[i].dinner, d, DINNER);

            if(d >= week.start && d < week.end)
                shoppingList = shoppingList.concat(plans[i].dinner.ingredients);
        }
        if(plans[i].workout) {
            plan.index.addEntry(plans[i].workout);
            plan.calendar.addRecipe(plans[i].workout, d, WORKOUT);

            if(d >= week.start && d < week.end)
                shoppingList = shoppingList.concat(plans[i].workout.ingredients);
        }
    }
    let i=0, j=0;
    while(i<shoppingList.length) {
        j=i+1;
        while(j<shoppingList.length) {
            if(shoppingList[i].name === shoppingList[j].name && shoppingList[i].unit === shoppingList[j].unit) {
                shoppingList[i].qty += shoppingList[j].qty;
                shoppingList.splice(j, 1);
            }
            j++;
        }
        i++;
    }
    shoppingList.sort((a,b) => {if(a.name === b.name){return a.unit > b.unit} return a.name.toLowerCase() > b.name.toLowerCase()});
    console.log(`shopping list for ${week.start.toLocaleDateString()} through ${week.end.toLocaleDateString()}:`);

    // let str = 'ingredient,unit,qty\n';
    // for(let item of shoppingList)
    //     str += `${item.name},${item.unit},${item.qty}\n`;
    // downloadCSV(str);

    //  The following loops *attempt* to save recipes to the index and meals to the calendar
    //  The recently implemented DataStorage class has not yet been tested -- this will be its first use case
    // for(let recipe of plan.index.index)
    //     console.log(recipe.title);
}

class Pantry {
    constructor() {
        this.ingredients = [];
    }

    addIngredient(ingd) {
        //  Check if ingredient was already added and if so return its index
        let ind = this.ingredients.findIndex(el => el.name === ingd.name);
        if(ind >= 0) {
            console.info(`${ingd} has already been added to the pantry - it will not be added again`);
            return ind;
        }

        ind = this.ingredients.findIndex(a => a.name === ingd.name);
        if(ind >= 0) {
            console.debug(`Recipe title ${ingd.title} has multiple entries in the pantry`);
        }

        //  Add recipe to index array
        this.ingredients.push(ingd);

        //  Sort the index and get the position of the new ingredient
        this.ingredients.sort(Pantry.sortFun);
        ind = this.ingredients.indexOf(ingd);

        //  Return the new recipe's position in the index array
        return ind;
    }
}
Pantry.sortFun = (a, b) => (a.name > b.name? 1 : -1);

function downloadCSV(csv) {
    let filename = 'shopping list.csv';

    if (!csv.match(/^data:text\/csv/i)) {
        csv = 'data:text/csv;charset=utf-8,' + csv;
    }
    let data = encodeURI(csv);

    let link = document.createElement('a');
    link.setAttribute('href', data);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function endianness() {
    let b = new ArrayBuffer(4);
    let a = new Uint32Array(b);
    let c = new Uint8Array(b);
    a[0] = 0xdeadbeef;
    if (c[0] === 0xef) return false;
    if (c[0] === 0xde) return true;
    throw new Error('unknown endianness');
}