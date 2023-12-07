// event listener for recipes
let inputEL = document.querySelector("#input");
let formEL = $("#form");
let dietInputEL =document.querySelector("#dietInput");
let inputListener = function(event){
    event.preventDefault();
    let inputValue = inputEL.value.trim();
    let dietInput = dietInputEL.value;
    console.log(inputValue, dietInput);
    takeRecipe(inputValue, dietInput);
 
}

function takeRecipe(value, diet){
    let recipeURL = `https://api.edamam.com/api/recipes/v2?type=public&q=${value}&app_id=44de2717&app_key=14618b6281e3b3df95ee06e6cda63a8d&imageSize=SMALL&diet=${diet}`;

    fetch(recipeURL)
    .then(function(response){
        return response.json();
    }).then(function(data){
        console.log(data);
    })
}

function showDietOptions() {
    document.getElementById("dietOptions").style.display = "block";
}

function selectDiet(diet) {
    document.getElementById("dietInput").value = diet;
    document.getElementById("dietOptions").style.display = "none";
}

// Closes diet options when clicking outside the options
document.addEventListener("mouseup", function (e) {
    var dietOptions = document.getElementById("dietOptions");
    if (dietOptions.style.display === "block" && !dietOptions.contains(e.target) && e.target.id !== "dietInput") {
        dietOptions.style.display = "none";
    }
});

formEL.on("click", "#recipe-button", inputListener);

// formEL.on("click", ".btn", inputListener);
// takeRecipe();



