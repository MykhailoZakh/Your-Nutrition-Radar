// event listener for recipes
let inputEL = document.querySelector("#input");
let formEL = $("#form");
let dietInputEL = document.querySelector("#dietInput");
let ingredientsInputEL = document.querySelector("#ingredientsInput");
let cardHolderEL = $("#object");
let recipeArray = [];


// function for event listener for recipe button
let inputListener = function (event) {
    event.preventDefault();
    let inputValue = inputEL.value.trim();
    let dietInput = dietInputEL.value;

    // local storage
    recipeArray.push(inputValue);
    console.log(recipeArray);
    localStorage.setItem("recipeValue",JSON.stringify(recipeArray));
    // recipesFromLocalStorage();

    if (!dietInput) {
        takeRecipe(inputValue);
        console.log(inputValue);
    } else {
        takeRecipeWDiet(inputValue, dietInput);
        console.log(inputValue, dietInput);
    }
    openRightNav(); // When user inputs recipe and selects diet, right nav should appear - Evan.
};
// function for recipe api
function takeRecipeWDiet(value, diet) {
    let recipeURL = `https://api.edamam.com/api/recipes/v2?type=public&q=${value}&app_id=44de2717&app_key=14618b6281e3b3df95ee06e6cda63a8d&imageSize=SMALL&diet=${diet}`;

    fetch(recipeURL)
        .then(function (response) {
            return response.json();
        }).then(function (data) {
        cardDelete();
            recipesCardPrint(data);
            console.log(data);
            console.log(data.hits[0].recipe.calories)
        })
};

function takeRecipe(value) {
    let recipeURL = `https://api.edamam.com/api/recipes/v2?type=public&q=${value}&app_id=44de2717&app_key=14618b6281e3b3df95ee06e6cda63a8d&imageSize=SMALL`;

    fetch(recipeURL)
        .then(function (response) {
            return response.json();
        }).then(function (data) {
        cardDelete();
        recipesCardPrint(data);
        
            console.log(data);
        })
};
// function for event listener for ingredients button - Evan.
let ingredientsListener = function (event) {
    event.preventDefault();
    let ingredientsValue = ingredientsInputEL.value.trim();
    let dietInput = dietInputEL.value;
    console.log(ingredientsValue);

    if (ingredientsValue && dietInput) {
        // If both conditions are met, the right sidebar should open - Evan.
        openRightNav();
    }
    takeIngredients(ingredientsValue);
};// function for ingredients 
function takeIngredients(value) {
    let ingredientsURL = `https://api.edamam.com/api/food-database/v2/parser?app_id=5751213b&app_key=ae5681efc5888ec628f12482de9399ed&ingr=${value}&nutrition-type=cooking`;
    fetch(ingredientsURL)
        .then(function (response) {
            return response.json();
        }).then(function (data) {
        cardDelete();
        ingredientsCardPrint(data);
            console.log(data);
        })
}
// Event listener, when ingredients button is submitted, right sidebar nav is event is executed - Evan. 
formEL.on("click", "#ingredients-button", ingredientsListener);

function showDietOptions() {
    document.getElementById("dietOptions").style.display = "block";
};

function selectDiet(diet) {
    document.getElementById("dietInput").value = diet;
    document.getElementById("dietOptions").style.display = "none";
};

// Closes diet options when clicking outside the options
document.addEventListener("mouseup", function (e) {
    var dietOptions = document.getElementById("dietOptions");
    if (dietOptions.style.display === "block" && !dietOptions.contains(e.target) && e.target.id !== "dietInput") {
        dietOptions.style.display = "none";
    }
});

// function for print card with object
function recipesCardPrint(value){
    for (let i = 0; i < 4; i++){
        let cardBody = $("<div>");
        cardBody.attr("class", "card text-center cell small-auto medium-6 bg-light my-2 px-2 rounded align-self-center")
        let recipeName = $("<h3>");
        recipeName.attr("class", "card-title");
        let image = $("<img>");
        image.attr("src", `${value.hits[i].recipe.images.REGULAR.url}`)
        image.attr("class", "header-icon border-dark rounded");
        let dietType = $("<p>");
        dietType.attr("class", "card-text");
        recipeName.text(`${value.hits[i].recipe.label}`);
        dietType.text(`${value.hits[i].recipe.dietLabels}`);
        cardHolderEL.append(cardBody);
        cardBody.append(recipeName);
        cardBody.append(dietType);
        cardBody.append(image);
    };
}

// function for ingredients card printer
function ingredientsCardPrint(value){
    for (let i = 0; i < 4; i++){
        let cardBody = $("<section>");
        cardBody.attr("class", "card text-center cell small-auto medium-6 bg-light my-2 px-2 rounded align-self-center")
        let ingredientName = $("<h3>");
        ingredientName.attr("class", "card-title");
        let image = $("<img>");
        image.attr("src", `${value.hints[i].food.image}`)
        image.attr("class", "header-icon border-dark rounded");
        let weight = $("<p>");
        let kCal = $("<p>")
        kCal.attr("class", "card-text");
        kCal.text(`${value.hints[i].food.nutrients.ENERC_KCAL} KCal`);
        weight.attr("class", "card-text");
        ingredientName.text(`${value.hints[i].food.label}`);
        weight.text(`0.${value.hints[i].measures[0].weight} pounds`);
        cardHolderEL.append(cardBody);
        cardBody.append(ingredientName);
        cardBody.append(image);
        cardBody.append(kCal);
        cardBody.append(weight);
    };
}
// function to delete card after click
function cardDelete(){
    let cardArrayEL = document.querySelectorAll(".card");
    console.log(cardArrayEL);
    for(let i = 0; i < cardArrayEL.length; i++){
        cardArrayEL[i].remove();
    }
}
// event listener for submit button
formEL.on("click", "#recipe-button", inputListener);
formEL.on("click", "#ingredients-button", ingredientsListener);
// takeRecipe();


/* What Kenny added

/* Set the width of the sidebar to 250px and the left margin of the page content to 250px */
function openNav() {
    document.getElementById("mySidebar").style.width = "250px";
    document.getElementById("main").style.marginLeft = "250px";
}

/* Set the width of the sidebar to 0 and the left margin of the page content to 0 */
function closeNav() {
    document.getElementById("mySidebar").style.width = "0";
    document.getElementById("main").style.marginLeft = "0";
}

// New right sidebar functions - Evan.
function openRightNav() {
    document.getElementById("rightSidebar").classList.add("show");
    document.body.style.overflow = "hidden"; // Prevents scrolling when the right sidebar is open - Evan.
}

function closeRightNav() {
    document.getElementById("rightSidebar").classList.remove("show");
    document.body.style.overflow = ""; // Enables scrolling when the right sidebar is closed - Evan.
}

// function to retrieve information from local storage and print it at sidebar
function recipesFromLocalStorage() {
    let storedRecipes = JSON.parse(localStorage.getItem("recipeValue"));
    if(storedRecipes !== null){
        recipeArray = storedRecipes;
        for(let i = 0; i < storedRecipes.length; i++){
            let sideBtnEL = $("<button>");
            sideBtnEL.text(storedRecipes[i]);
            sideBtnEL.attr("class", "side-btn");
            $("#mySidebar").append(sideBtnEL);
        }
    }
}
recipesFromLocalStorage();

// event listener for clear history button
let clear = document.querySelector("#clear-btn");
clear.addEventListener("click", function(){
    let empty = [];
    localStorage.setItem("recipeValue",JSON.stringify(empty));
    let sideBtnArreyEL = document.querySelectorAll(".side-btn");
    for(let i = 0; i < sideBtnArreyEL.length; i++){
        sideBtnArreyEL[i].remove();
    }
})