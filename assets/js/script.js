// event listener for recipes
let inputEL = document.querySelector("#input");
let formEL = $("#form");
let dietInputEL = document.querySelector("#dietInput");
let ingredientsInputEL = document.querySelector("#ingredientsInput");
let cardHolderEL = $("#object");
let recipeArray = [];
let favoriteArray = ['empty'];

// function for event listener for recipe button
let inputListener = function (event) {
    event.preventDefault();
    let inputValue = inputEL.value.trim();
    let dietInput = dietInputEL.value;

    // local storage
    recipeArray.push(inputValue);
    localStorage.setItem("recipeValue", JSON.stringify(recipeArray));
    // recipesFromLocalStorage();

    if (!dietInput) {
        takeRecipe(inputValue, updateRightSidebar); // Should pass the updateRightSidebar function as a callback - Evan.
    } else {
        takeRecipeWDiet(inputValue, dietInput, updateRightSidebar); // Should pass the updateRightSidebar function as a callback - Evan.
    }
    openRightNav(); // When user inputs recipe and selects diet, right nav should appear - Evan.
};

// function for recipe api
function takeRecipeWDiet(value, diet, updateRightSidebar) {
    let recipeURL = `https://api.edamam.com/api/recipes/v2?type=public&q=${value}&app_id=44de2717&app_key=14618b6281e3b3df95ee06e6cda63a8d&imageSize=SMALL&diet=${diet}`;

    fetch(recipeURL)
        .then(function (response) {
            return response.json();
        }).then(function (data) {
            cardDelete();
            recipesCardPrint(data);
            updateRightSidebar(data.hits[0]); // Should pass the first recipe to the callback - Evan.
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
            updateRightSidebar(data.hits[0]); // Pass the first recipe to the callback - Evan.
        });
}

function updateRightSidebar(data) {
    const rightSidebar = document.getElementById("rightSidebar");
    rightSidebar.innerHTML = "";
    const exElement = document.createElement("a")
    exElement.setAttribute("href", "javascript:void(0)");
    exElement.setAttribute("class", "closebtn");
    exElement.setAttribute("onclick", "closeRightNav()");
    exElement.textContent = `✖`;
    // Should create element to display ❤ button - Mykhailo
    const heartElement = document.createElement("button");
    heartElement.setAttribute("id", "save-btn");
    
    heartElement.textContent = `❤`;

    let storedFavorites = JSON.parse(localStorage.getItem("favoriteRecipe"));
    
    if(storedFavorites !== null){
        for(let i = 0; i < storedFavorites.length; i ++){
            if(storedFavorites[i] == data.recipe.label){
                heartElement.removeAttribute("id", "save-btn");
                heartElement.setAttribute("class", "saved-btn");
                break;
            }
    }
    }
    // Should create elements to display recipe details - Evan.
    const recipeNameElement = document.createElement("h3");
    recipeNameElement.textContent = data.recipe.label;
    recipeNameElement.setAttribute("id", "recipe-name");

    // Should create an image element - Evan.
    const imageElement = document.createElement("img");
    imageElement.setAttribute("id","sidebar-img");
    imageElement.src = data.recipe.image;
    imageElement.alt = data.recipe.label; // alternative text - Evan.

    // Append elements to the right sidebar

    rightSidebar.appendChild(exElement);
    rightSidebar.appendChild(recipeNameElement);
    rightSidebar.appendChild(heartElement);
    rightSidebar.appendChild(imageElement);

    // Create card for ingredients - New section - Kenny
    if (data.recipe.ingredientLines && data.recipe.ingredientLines.length > 0) {
        const ingredientsCard = document.createElement("div");
        ingredientsCard.className = "sidebar-card my-2 mx-1 px-2 rounded align-self-center";

        const ingredientsCardBody = document.createElement("div");
        ingredientsCardBody.className = "sidebar-card";

        // Add ingredients to the card - Kenny
        const ingredientsTitle = document.createElement("h4");
        ingredientsTitle.textContent = "Ingredients";
        ingredientsTitle.className = "text-center";
        ingredientsCardBody.appendChild(ingredientsTitle);
        const ingredientsList = document.createElement("ul")
        ingredientsCardBody.appendChild(ingredientsList);

        for (const ingredient of data.recipe.ingredientLines) {
            const ingredientElement = document.createElement("li");
            ingredientElement.textContent = ingredient;
            ingredientsList.appendChild(ingredientElement);
        }

        // Append ingredients card - Kenny
        ingredientsCard.appendChild(ingredientsCardBody);
        rightSidebar.appendChild(ingredientsCard);
    } else {
        const noIngredientsCard = document.createElement("div");
        noIngredientsCard.className = "sidebar-card text-center mb-3";

        const noIngredientsCardBody = document.createElement("div");
        noIngredientsCardBody.className = "sidebar-card";

        noIngredientsCardBody.innerHTML = "<p>No ingredients available.</p>";

        noIngredientsCard.appendChild(noIngredientsCardBody);
        rightSidebar.appendChild(noIngredientsCard);
    }

// Create card for nutrition facts - Kenny
if (data.recipe.totalNutrients && Object.keys(data.recipe.totalNutrients).length > 0) {
    const nutritionCard = document.createElement("div");
    nutritionCard.className = "sidebar-card my-2 mx-1 px-2 rounded";

        // Create title element for nutrition facts - Kenny
        const nutritionTitle = document.createElement("h4");
        nutritionTitle.textContent = "Nutrition Facts";
        nutritionTitle.className = "text-center";
        nutritionCard.appendChild(nutritionTitle);

        const nutritionCardBody = document.createElement("div");
        nutritionCardBody.className = "grid-container sidebar-card";   
        
        const instructionCard = document.createElement("div");
        instructionCard.className = "sidebar-card my-2 mx-1 px-2 rounded align-self-center";

        const instructionsTitle = document.createElement("h4");
        instructionsTitle.textContent = "Cooking Instructions";
        instructionsTitle.className = "text-center";
        instructionCard.appendChild(instructionsTitle);

        // Add nutrition facts to the card - Kenny
        for (const nutrient of Object.values(data.recipe.totalNutrients)) {
            const nutrientElement = document.createElement("div");
            nutrientElement.className = "grid-x align-spacecd my-2 border-bottom";
            // nutrientElement.textContent = `${nutrient.label}: ${nutrient.quantity.toFixed(2)} ${nutrient.unit}`;
            const nutrientLabelEl = document.createElement("div")
            nutrientLabelEl.className = "cell small-6"
            nutrientLabelEl.textContent =  `${nutrient.label}`;
            const nutrientValueEl = document.createElement("div");
            nutrientValueEl.className = "cell small-6 text-right"
            nutrientValueEl.textContent = `${nutrient.quantity.toFixed(2)} ${nutrient.unit}`
            nutrientElement.appendChild(nutrientLabelEl);
            nutrientElement.appendChild(nutrientValueEl);
            nutritionCardBody.appendChild(nutrientElement);
        }
        // Add instructions to the card
        for(let i = 0; i < data.recipe.instructionLines.length; i++){
            const instructionElement = document.createElement("p");
            instructionElement.textContent = data.recipe.instructionLines[i];
            instructionCard.appendChild(instructionElement);
        }
        // Append nutrition card - Kenny
        nutritionCard.appendChild(nutritionCardBody);
        rightSidebar.appendChild(nutritionCard);
        rightSidebar.appendChild(instructionCard);
    }


    saveBtnFnc();
}

formEL.on("click", "#ingredients-button", ingredientsListener);

// Function for event listener for ingredients button
function ingredientsListener(event) {
    event.preventDefault();
    let ingredientsValue = ingredientsInputEL.value.trim();
    // let dietInput = dietInputEL.value;

    takeIngredients(ingredientsValue, updateRightSidebarForIngredients);
}

// Function for handling ingredients - Evan.
function takeIngredients(value, updateRightSidebar) {
    let ingredientsURL = `https://api.edamam.com/api/food-database/v2/parser?app_id=5751213b&app_key=ae5681efc5888ec628f12482de9399ed&ingr=${value}&nutrition-type=cooking`;


    fetch(ingredientsURL)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            cardDelete();
            ingredientsCardPrint(data);
            if (updateRightSidebar) {
                // Checks the type of data and calls the appropriate function - Evan.
                if (data.hints && data.hints.length > 0) {
                    updateRightSidebar(data.hints[0]); // Passes the first ingredient to the rightsidebar - Evan.
                } else {
                    console.error("No hints data found for ingredients.");
                }
            }
        
        });
}

function updateRightSidebarForIngredients(data) {
    console.log("Data for right sidebar (ingredients):", data);
    const rightSidebar = document.getElementById("rightSidebar");

    rightSidebar.innerHTML = "";
    const exElement = document.createElement("a")
    exElement.setAttribute("href", "javascript:void(0)");
    exElement.setAttribute("class", "closebtn");
    exElement.setAttribute("onclick", "closeRightNav()");
    exElement.textContent = `✖`;

    const ingredientNameElement = document.createElement("h3");
    ingredientNameElement.textContent = data.food.label;
    ingredientNameElement.setAttribute("id", "recipe-name");

    const dietTypeElement = document.createElement("p");
    const imageElement = document.createElement("img");

    if (data.food) {
        ingredientNameElement.textContent = data.food.label;
        imageElement.src = data.food.image;
        imageElement.alt = data.food.label;
 
         // Nutrition facts card - Kenny
         const nutritionCard = document.createElement("div");
         nutritionCard.className = "sidebar-card my-2 mx-1 px-2 rounded align-center";
 
         const nutritionCardBody = document.createElement("div");
         nutritionCardBody.className = "sidebar-card";

        
        for(let i = 0; i < 6; i++){
            const nutritionEl = document.createElement("p");
            nutritionEl.setAttribute("class", "text-center my-2 border-bottom");
            if(i === 0){
                nutritionEl.textContent = `Energy: ${data.food.nutrients.ENERC_KCAL} KCal`;
                nutritionCardBody.appendChild(nutritionEl);
            }
            if(i === 1){
                nutritionEl.textContent = `Carbohydrates: ${data.food.nutrients.CHOCDF} g`;
                nutritionCardBody.appendChild(nutritionEl);
            }
            if(i === 2){
                nutritionEl.textContent = `Fat: ${data.food.nutrients.FAT} g`;
                nutritionCardBody.appendChild(nutritionEl);
            }
            if(i === 3){
                nutritionEl.textContent = `Fiber: ${data.food.nutrients.FIBTG} g`;
                nutritionCardBody.appendChild(nutritionEl);
            }
            if(i === 4){
                nutritionEl.textContent = `Protein: ${data.food.nutrients.PROCNT} g`;
                nutritionCardBody.appendChild(nutritionEl);
            }
            if(i === 5){
                nutritionEl.textContent = `Weight: 100 g`;
                nutritionCardBody.appendChild(nutritionEl);
            }
            openRightNav();
        }   

        // Favorites button - Mykhailo
        const heartElement = document.createElement("button");
        heartElement.setAttribute("id", "save-btn");
        heartElement.textContent = `❤`;
        // Appends elements to the right sidebar for ingredients - Evan.
        rightSidebar.appendChild(exElement);
        rightSidebar.appendChild(ingredientNameElement);
        rightSidebar.appendChild(heartElement);
        rightSidebar.appendChild(dietTypeElement);
        rightSidebar.appendChild(imageElement);
        rightSidebar.appendChild(nutritionCard);
        nutritionCard.appendChild(nutritionCardBody);

        saveBtnFnc();
    }
}



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
function recipesCardPrint(value) {
    for (let i = 0; i < value.hits.length; i++) {
        let cardBody = $("<div>");
        cardBody.attr("class", "card recipe-card text-center cell small-auto medium-6 bg-light my-2 px-2 rounded align-self-center")
        cardBody.on("click", function () {
            updateRightSidebar(value.hits[i]); // Allows card body to be clicked and display clicked recipe on rightsidebar - Evan.
            openRightNav();
        });
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
function ingredientsCardPrint(value) {
    for (let i = 0; i < 4; i++) {
        let cardBody = $("<section>");
        cardBody.attr("class", "card ingredient-card text-center cell small-auto medium-6 bg-light my-2 px-2 rounded align-self-center")
        cardBody.on("click", function () {
            updateRightSidebarForIngredients(value.hints[i]); // Allows card body to be clicked and display clicked recipe on rightsidebar - Evan.
        });
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
function cardDelete() {
    let cardArrayEL = document.querySelectorAll(".card");
    for (let i = 0; i < cardArrayEL.length; i++) {
        cardArrayEL[i].remove();
    }
}
// event listener for submit button
formEL.on("click", "#recipe-button", inputListener);
formEL.on("click", "#ingredients-button", ingredientsListener);
// takeRecipe();


/* What Kenny added */

/* Set the width of the sidebar and the left margin */
function openNav() {
    document.getElementById("mySidebar").style.width = "250px";
    document.getElementById("main").style.marginLeft = "250px";
}

/* Set the width of the sidebar and the left margin */
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
    if (storedRecipes !== null) {
        recipeArray = storedRecipes;
        for (let i = 0; i < storedRecipes.length; i++) {
            let sideBtnEL = $("<button>");
            sideBtnEL.text(storedRecipes[i]);
            sideBtnEL.attr("class", "side-btn");
            $("#history").append(sideBtnEL);
        }
    }
}
recipesFromLocalStorage();

// event listener for clear history button
let clear = document.querySelector("#clear-btn");
clear.addEventListener("click", function () {
    let empty = [];
    localStorage.setItem("recipeValue", JSON.stringify(empty));
    // localStorage.setItem("favoriteRecipe", JSON.stringify(empty));chickenduck
    let sideBtnArreyEL = document.querySelectorAll(".side-btn");
    for (let i = 0; i < sideBtnArreyEL.length; i++) {
        sideBtnArreyEL[i].remove();
    }
});

// function for side bar printing
let sideBarPrint = function (data) {
    // event.preventDefault();
    document.getElementById("recipe-name").textContent = `${data.hits[0].recipe.label}`;
}
// function for save button
function saveBtnFnc() {
    let saveButtonEL = document.querySelector("#save-btn");
    let savedButtonEL = document.querySelector("#saved-btn");
    let recipeNameEL = document.querySelector("#recipe-name");

    if(saveButtonEL){
        if (recipeNameEL) { //Checks if element is not null, I was getting a null console error - Evan.
            saveButtonEL.addEventListener("click", function (event) {
                event.preventDefault();
                let recipeName = recipeNameEL.innerText.trim();
                favoriteArray.push(recipeName);
                localStorage.setItem("favoriteRecipe", JSON.stringify(favoriteArray));
            });
        }
    } 
}

// function to print favorite recipes from local storage
function favoritesFromLocalStorage() {
    let storedFavorites = JSON.parse(localStorage.getItem("favoriteRecipe"));
    if (storedFavorites !== null) {
        favoriteArray = storedFavorites;
        for (let i = 1; i < storedFavorites.length; i++) {
            let sideBtnEL = $("<button>");
            let xBtnEl = $("<button>");
            xBtnEl.attr("class", "favorite-delete-btn");
            sideBtnEL.text(storedFavorites[i]);
            sideBtnEL.attr("class", "favorite-btn");
            sideBtnEL.append(xBtnEl);
            $("#favorites").append(sideBtnEL);

        }
    }
}
favoritesFromLocalStorage();

// event listener for X button to remove item from favorites
$(".favorite-btn").on("click", ".favorite-delete-btn", function (event) {
    let storedFavorites = JSON.parse(localStorage.getItem("favoriteRecipe"));
    if (storedFavorites !== null) {
        favoriteArray = storedFavorites;
        let stringArray = favoriteArray.toString();
        let newStringArray = stringArray.replace(`,${event.target.parentElement.innerText}`, "");
        let newFavoriteArray = newStringArray.split(",");
        localStorage.setItem("favoriteRecipe", JSON.stringify(newFavoriteArray));
        event.target.parentElement.remove();
    }
})

// event listener for favorite buttons
$("#favorites").on("click", ".favorite-btn", function (event) {
    favoriteAPIFunc(event.target.innerText);
    closeNav();
})
// function for favorite button listener
function favoriteAPIFunc(value) {
    let recipeURL = `https://api.edamam.com/api/recipes/v2?type=public&q=${value}&app_id=44de2717&app_key=14618b6281e3b3df95ee06e6cda63a8d&imageSize=SMALL`;

    fetch(recipeURL)
        .then(function (response) {
            return response.json();
        }).then(function (data) {
            updateRightSidebar(data.hits[0]);
            openRightNav();
        });
}

// event listener for history button
$("#history").on("click", ".side-btn", function (event) {
    let selectedRecipe = event.target.innerText;
    takeRecipe(selectedRecipe, updateRightSidebar);
    openRightNav();
    closeNav();
});

// functions for left side bar 
function openNav() {
    document.getElementById("mySidebar").classList.add("show");
    document.getElementById("main").style.marginLeft = "250px";
    document.getElementById("open-btn").style.display = "none";
  }

  function closeNav() {
    document.getElementById("mySidebar").classList.remove("show");
    document.getElementById("main").style.marginLeft = "0";
    document.getElementById("open-btn").style.display = "block";
  }