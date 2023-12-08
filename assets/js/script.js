// event listener for recipes
let inputEL = document.querySelector("#input");
let formEL = $("#form");
let dietInputEL = document.querySelector("#dietInput");
let ingredientsInputEL = document.querySelector("#ingredientsInput");
let cardHolderEL = $("#object");

// function for event listener for recipe button
let inputListener = function(event){
    event.preventDefault();
    let inputValue = inputEL.value.trim();
    let dietInput = dietInputEL.value;
    
    if(!dietInput){
        takeRecipe(inputValue);
        console.log(inputValue);
    } else {
        takeRecipeWDiet(inputValue, dietInput);
        console.log(inputValue, dietInput);
    }
};
// function for recipe api
function takeRecipeWDiet(value, diet){
    let recipeURL = `https://api.edamam.com/api/recipes/v2?type=public&q=${value}&app_id=44de2717&app_key=14618b6281e3b3df95ee06e6cda63a8d&imageSize=SMALL&diet=${diet}`;

    fetch(recipeURL)
    .then(function(response){
        return response.json();
    }).then(function(data){
        recipesCardPrint(data);
        console.log(data);
        console.log(data.hits[0].recipe.calories)
    })
};

function takeRecipe(value){
    let recipeURL = `https://api.edamam.com/api/recipes/v2?type=public&q=${value}&app_id=44de2717&app_key=14618b6281e3b3df95ee06e6cda63a8d&imageSize=SMALL`;

    fetch(recipeURL)
    .then(function(response){
        return response.json();
    }).then(function(data){
        console.log(data);
    })
};
// function for event listener for ingredients button
let ingredientsListener = function(event) {
    event.preventDefault();
    let ingredientsValue = ingredientsInputEL.value.trim();
    console.log(ingredientsValue);
    takeIngerdients(ingredientsValue);
};
// function for ingerdients 
function takeIngerdients(value){
    let ingerdientsURL = `https://api.edamam.com/api/food-database/v2/parser?app_id=5751213b&app_key=ae5681efc5888ec628f12482de9399ed&ingr=${value}&nutrition-type=cooking`;
    fetch(ingerdientsURL)
    .then(function(response){
        return response.json();
    }).then(function(data){
        console.log(data);
    })
};
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
// event listener for submit button
formEL.on("click", "#recipe-button", inputListener);
formEL.on("click", "#ingredients-button",ingredientsListener);
// takeRecipe();



