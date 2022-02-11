// Global variables for API keys
var fitnessApiKey = "2a61fe40cdmshb25b8249e993d82p1d55cejsn5658af22a824";

// Bavs API key
// var edAppId = "3b5faff5";
// var edAppKey = "d238cce08ac349a419e8f92b7bc5bc99";

// Grant API key
// var edAppId = "c579d9d3";
// var edAppKey = "eddd63f4bfe096f4a9662f17302fd0fe";

// Laura API key
var edAppId = "67e33c99";
var edAppKey = "58ed3e82ebe79a928c46d37385426a4b";

// submit button event listner
$("#user-form").on("submit", generateUserSummary);

var errorUrl = "./error.html";

// ---------- USER DATA LOGIC ----------

// fetch user health data
function generateUserSummary(event) {
  event.preventDefault();
  console.log("submitted form");

  // assigning user values
  var formContainer = $("#form-container");
  var age = $("#age").val().trim();
  var gender = $("#gender").val();
  var height = $("#height").val().trim();
  var weight = $("#weight").val().trim();
  var userGoal = $("#goal").val();
  var activitylevel = $("#activity-level").val();

  var day1Calories = 0;

  // alert modal event listener
  $("#alert-ok-btn").on("click", function () {
    $("#alert-modal-container").addClass("form-none");
  });

  // input form conditional logic
  if (age < 18 || age > 80) {
    // alert("Please enter an age between 10-80");
    $("#alert-modal-container").removeClass("form-none");
    $("#alert-text").text("Please enter an age between 18-80");
  } else if (height < 130 || height > 230) {
    $("#alert-modal-container").removeClass("form-none");
    $("#alert-text").text("Please enter a height between 130cm - 230cm");
  } else if (weight < 40 || weight > 160) {
    $("#alert-modal-container").removeClass("form-none");
    $("#alert-text").text("Please enter a weight between 40kg - 160kg");
  } else {
    // fetching fitness API data
    fetch(
      "https://fitness-calculator.p.rapidapi.com/macrocalculator?age=" +
        age +
        "&gender=" +
        gender +
        "&height=" +
        height +
        "&weight=" +
        weight +
        "&activitylevel=" +
        activitylevel +
        "&goal=" +
        userGoal,
      {
        method: "GET",
        headers: {
          "x-rapidapi-host": "fitness-calculator.p.rapidapi.com",
          "x-rapidapi-key": fitnessApiKey,
        },
      }
    )
      .then(function (res) {
        return res.json();
      })
      .then(function (data) {
        console.log(data);
        // function that makes the users summary visible in a chart
        saveToLocal(data);
        renderUserDataRefresh();
        removeForm();
      })
      .catch(function (error) {
        console.log("error fetching fitness API data");
        console.log(error);
        document.location.replace(errorUrl);
      });
  }
}

// remove input form from screen
function removeForm() {
  $("#form-container").addClass("form-none");
  // display cookbook and back button
  $("#cookBookBtn").removeClass("form-none");
  $("#backBtn").addClass("flex");
}

// create | ammend | append userCard
function renderUserDataRefresh() {
  var userCard = $(`
    <div class="flex mx-10 mt-1 mb-5 justify-center content-center items-center inline-block px-3 py-3 bg-purple-custom text-white font-medium text-sm leading-tight uppercase rounded shadow-md target-border">
    <h1 class="font-semibold content-center"> Target Calories: </h1>
    <p class="px-5 text-2xl content-center" >${localStorage.getItem(
      "calories"
    )}</p>
    </div>
    <div class="flex justify-center">
    <div class="block p-6 rounded-lg shadow-lg bg-pink-custom  max-w-sm">
      <h5 class="text-gray-600 text-8-xl leading-tight font-medium mb-2">Balanced Diet</h5>
        <canvas class="p-3 " id="chartDoughnut"></canvas>
    </div>
    </div>
      `);

  // create doughnut chart
  $("#userCard").append(userCard);
  const dataDoughnut = {
    labels: [
      `Protein ${localStorage.getItem("protein")}g`,
      `Fat ${localStorage.getItem("fat")}g`,
      `Carbs ${localStorage.getItem("carbs")}g`,
    ],
    datasets: [
      {
        label: "Nutrition",
        data: [
          localStorage.getItem("protein"),
          localStorage.getItem("fat"),
          localStorage.getItem("carbs"),
        ],
        backgroundColor: ["#F5458A", "#70F2AC", "#50BDFA"],
        hoverOffset: 4,
      },
    ],
  };

  const configDoughnut = {
    type: "doughnut",
    data: dataDoughnut,
    options: {},
  };

  var chartBar = new Chart(
    document.getElementById("chartDoughnut"),
    configDoughnut
  );
  generateMeals();
}

// ---------- WEEKDAY MEAL LOGIC ----------
// logic incase of previously stored values
if (localStorage.getItem("calories")) {
  renderUserDataRefresh();
  removeForm();
}

// get day 1 calories from local storage
day1Calories = localStorage.getItem("calories");

// save user data macro values to local storage
function saveToLocal(userData) {
  var protein = Math.round(userData.data.balanced.protein);
  var fat = Math.round(userData.data.balanced.fat);
  var carbs = Math.round(userData.data.balanced.carbs);
  var calories = Math.round(userData.data.calorie);

  localStorage.setItem("protein", protein);
  localStorage.setItem("fat", fat);
  localStorage.setItem("carbs", carbs);
  localStorage.setItem("calories", calories);
}

// weekday meals tab colour
if ($("#monday-tab-btn").attr("aria-selected") === "true") {
  $("#monday-tab-btn").addClass("inactive-tab");
  $("#monday-tab-btn").addClass("purple-tab");
}

$(".tab").each(function () {
  $(".tab").on("click", function () {
    $("#monday-tab-btn").removeClass("inactive-tab");
    $("#monday-tab-btn").removeClass("purple-tab");
  });
});

// generate breakfast
function generateBreakfast() {
  var totalCalories = localStorage.getItem("calories");
  var breakfastCalories = Math.floor(totalCalories * 0.2);
  var breakfastCaloriesMin = breakfastCalories - 100;
  //breakfast API
  var breakfastSearchAPI =
    "https://api.edamam.com/api/recipes/v2?type=public&app_id=" +
    edAppId +
    "&app_key=" +
    edAppKey +
    "&q=%20&mealType=breakfast&diet=balanced&imageSize=LARGE&calories=" +
    breakfastCaloriesMin +
    "-" +
    breakfastCalories;

  // fetching breakfast API data
  return fetch(breakfastSearchAPI).then(function (res) {
    return res.json().then(function (data) {
      console.log(data);
      // breakfast card

      // render meals for all weekdays
      renderWeekdayMeals(
        "#day1-breakfast-image",
        data,
        "#day1-breakfast-recipe-name",
        "#day1-breakfast-url",
        "#day1-break-fast-calories",
        "#day1-breakfast-protein",
        "#day1-breakfast-fats",
        "#day1-breakfast-carbs",
        "#day1-breakfast-refresh-btn",
        "breakfastDayOneCalories"
      );

      renderWeekdayMeals(
        "#day2-breakfast-image",
        data,
        "#day2-breakfast-recipe-name",
        "#day2-breakfast-url",
        "#day2-break-fast-calories",
        "#day2-breakfast-protein",
        "#day2-breakfast-fats",
        "#day2-breakfast-carbs",
        "#day2-breakfast-refresh-btn",
        "breakfastDayTwoCalories"
      );
      renderWeekdayMeals(
        "#day3-breakfast-image",
        data,
        "#day3-breakfast-recipe-name",
        "#day3-breakfast-url",
        "#day3-break-fast-calories",
        "#day3-breakfast-protein",
        "#day3-breakfast-fats",
        "#day3-breakfast-carbs",
        "#day3-breakfast-refresh-btn",
        "breakfastDayThreeCalories"
      );
      renderWeekdayMeals(
        "#day4-breakfast-image",
        data,
        "#day4-breakfast-recipe-name",
        "#day4-breakfast-url",
        "#day4-break-fast-calories",
        "#day4-breakfast-protein",
        "#day4-breakfast-fats",
        "#day4-breakfast-carbs",
        "#day4-breakfast-refresh-btn",
        "breakfastDayFourCalories"
      );
      renderWeekdayMeals(
        "#day5-breakfast-image",
        data,
        "#day5-breakfast-recipe-name",
        "#day5-breakfast-url",
        "#day5-break-fast-calories",
        "#day5-breakfast-protein",
        "#day5-breakfast-fats",
        "#day5-breakfast-carbs",
        "#day5-breakfast-refresh-btn",
        "breakfastDayFiveCalories"
      );
    });
  });
}

var breakfastCalsNum = $("#day1-break-fast-calories").text;
console.log($("#day1-break-fast-calories").text);

day1Calories -= parseInt($(breakfastCalsNum).text);
console.log(day1Calories);

// generate lunch
function generateLunch() {
  var totalCalories = localStorage.getItem("calories");
  var lunchCalories = Math.floor(totalCalories * 0.3);
  var lunchCaloriesMin = lunchCalories - 100;
  // lunch
  var lunchSearchAPI =
    "https://api.edamam.com/api/recipes/v2?type=public&app_id=" +
    edAppId +
    "&app_key=" +
    edAppKey +
    "&q=%20&mealType=lunch&diet=balanced&dishType=Salad&dishType=Sandwiches&dishType=Side%20dish&dishType=Starter&imageSize=LARGE&calories=" +
    lunchCaloriesMin +
    "-" +
    lunchCalories;

  return fetch(lunchSearchAPI).then(function (res) {
    return res.json().then(function (data) {
      var lunchRandom = Math.floor(Math.random() * 19);
      console.log(data);

      renderWeekdayMeals(
        "#day1-lunch-image",
        data,
        "#day1-lunch-recipe-name",
        "#day1-lunch-url",
        "#day1-lunch-calories",
        "#day1-lunch-protein",
        "#day1-lunch-fats",
        "#day1-lunch-carbs",
        "#day1-lunch-refresh-btn",
        "lunchDayOneCalories"
      );
      renderWeekdayMeals(
        "#day2-lunch-image",
        data,
        "#day2-lunch-recipe-name",
        "#day2-lunch-url",
        "#day2-lunch-calories",
        "#day2-lunch-protein",
        "#day2-lunch-fats",
        "#day2-lunch-carbs",
        "#day2-lunch-refresh-btn",
        "lunchDayTwoCalories"
      );
      renderWeekdayMeals(
        "#day3-lunch-image",
        data,
        "#day3-lunch-recipe-name",
        "#day3-lunch-url",
        "#day3-lunch-calories",
        "#day3-lunch-protein",
        "#day3-lunch-fats",
        "#day3-lunch-carbs",
        "#day3-lunch-refresh-btn",
        "lunchDayThreeCalories"
      );
      renderWeekdayMeals(
        "#day4-lunch-image",
        data,
        "#day4-lunch-recipe-name",
        "#day4-lunch-url",
        "#day4-lunch-calories",
        "#day4-lunch-protein",
        "#day4-lunch-fats",
        "#day4-lunch-carbs",
        "#day4-lunch-refresh-btn",
        "lunchDayFourCalories"
      );
      renderWeekdayMeals(
        "#day5-lunch-image",
        data,
        "#day5-lunch-recipe-name",
        "#day5-lunch-url",
        "#day5-lunch-calories",
        "#day5-lunch-protein",
        "#day5-lunch-fats",
        "#day5-lunch-carbs",
        "#day5-lunch-refresh-btn",
        "lunchDayfiveCalories"
      );
    });
  });
}

// generate dinner
function generateDinner() {
  var totalCalories = localStorage.getItem("calories");
  var dinnerCalories = Math.floor(totalCalories * 0.5);
  var dinnerCaloriesMin = dinnerCalories - 100;
  // dinner
  var dinnerSearchAPI =
    "https://api.edamam.com/api/recipes/v2?type=public&app_id=" +
    edAppId +
    "&app_key=" +
    edAppKey +
    "&q=%20&mealType=dinner&diet=balanced&dishType=main%20course&imageSize=LARGE&calories=" +
    dinnerCaloriesMin +
    "-" +
    dinnerCalories;
  var dinnerRandom = Math.floor(Math.random() * 19);

  return fetch(dinnerSearchAPI).then(function (res) {
    return res.json().then(function (data) {
      console.log(data);
      // dinner card

      renderWeekdayMeals(
        "#day1-dinner-image",
        data,
        "#day1-dinner-recipe-name",
        "#day1-dinner-url",
        "#day1-dinner-calories",
        "#day1-dinner-protein",
        "#day1-dinner-fats",
        "#day1-dinner-carbs",
        "#day1-dinner-refresh-btn",
        "dinnerDayOneCalories"
      );
      renderWeekdayMeals(
        "#day2-dinner-image",
        data,
        "#day2-dinner-recipe-name",
        "#day2-dinner-url",
        "#day2-dinner-calories",
        "#day2-dinner-protein",
        "#day2-dinner-fats",
        "#day2-dinner-carbs",
        "#day2-dinner-refresh-btn",
        "dinnerDayTwoCalories"
      );
      renderWeekdayMeals(
        "#day3-dinner-image",
        data,
        "#day3-dinner-recipe-name",
        "#day3-dinner-url",
        "#day3-dinner-calories",
        "#day3-dinner-protein",
        "#day3-dinner-fats",
        "#day3-dinner-carbs",
        "#day3-dinner-refresh-btn",
        "dinnerDayThreeCalories"
      );
      renderWeekdayMeals(
        "#day4-dinner-image",
        data,
        "#day4-dinner-recipe-name",
        "#day4-dinner-url",
        "#day4-dinner-calories",
        "#day4-dinner-protein",
        "#day4-dinner-fats",
        "#day4-dinner-carbs",
        "#day4-dinner-refresh-btn",
        "dinnerDayFourCalories"
      );
      renderWeekdayMeals(
        "#day5-dinner-image",
        data,
        "#day5-dinner-recipe-name",
        "#day5-dinner-url",
        "#day5-dinner-calories",
        "#day5-dinner-protein",
        "#day5-dinner-fats",
        "#day5-dinner-carbs",
        "#day5-dinner-refresh-btn",
        "dinnerDayFiveCalories"
      );
    });
  });
}

// generate meals
function generateMeals() {
  Promise.all([generateBreakfast(), generateLunch(), generateDinner()])
    .then(() => {
      $(".meal-section").fadeIn(".show");
      callRemainingFunction();
    })
    .catch(function (error) {
      $("#alert-modal-container").removeClass("form-none");
      $("#alert-text").text(
        "Sorry, your meals failed to load. Please try again in 60 seconds."
      );
      $("#alert-ok-btn")
        .attr("disabled", "disabled")
        .addClass("cursor-not-allowed")
        .removeClass("hover:bg-gray-50")
        .text("Try again");
      setTimeout(function () {
        $("#alert-ok-btn")
          .removeAttr("disabled")
          .removeClass("cursor-not-allowed")
          .addClass("hover:bg-gray-50");
      }, 60000);
      $("#alert-ok-btn").on("click", function () {
        $("#alert-modal-container").addClass("form-none");
        generateMeals();
      });
    });
}

// COOK BOOK LOGIC

var cookbookArray = [];
// you have * recipes saved in your cookbook
if (localStorage.getItem("savedRecipes")) {
  $("#cookbook-number").text(
    JSON.parse(localStorage.getItem("savedRecipes")).length
  );
} else {
  $("#cookbook-number").text("");
}

// cookbook back button
$("#cookbookBackBtn").on("click", function () {
  $("#cookBookContainer").removeClass("flex justify-center");
  $(".recipe-item").remove();
});

// when I click heart, execute saveRecipeBook()
$(".heartBtn").on("click", saveRecipeBook);
// when I click on my cook book, execute showCookBook()
$("#cookBookBtn").on("click", displayRecipeBook);

// local storage cook book
function saveRecipeBook() {
  savedRecipes = JSON.parse(localStorage.getItem("savedRecipes"));
  if (savedRecipes == null) {
    savedRecipes = [];
  }
  console.log(savedRecipes);
  // create recipe variables based on the card clicked
  var mealType = $(this).parent().find(".meal-type").text();
  var recipeName = $(this).parent().find(".recipe-name").text();
  var calories = $(this).parent().find(".calories").text();
  var imageUrl = $(this).parent().find(".recipe-image").attr("src");
  var recipeURL = $(this).parent().find(".recipe-url").attr("href");

  var recipeObject = {
    mealType: mealType,
    recipeName: recipeName,
    calories: calories,
    imageURL: imageUrl,
    recipeURL: recipeURL,
  };
  savedRecipes.push(recipeObject);
  localStorage.setItem("savedRecipes", JSON.stringify(savedRecipes));

  cookbookArray.push(recipeObject);
  console.log(cookbookArray);
  $("#cookbook-number").text(
    JSON.parse(localStorage.getItem("savedRecipes")).length
  );
}

function displayRecipeBook() {
  // show cookbook modal
  $("#cookBookContainer").addClass("flex justify-center");

  // for each recipe in array create a card
  savedRecipes = JSON.parse(localStorage.getItem("savedRecipes"));
  savedRecipes.forEach(function (recipe) {
    var cookbookRecipe = $(`
    <div class="recipe-item flex justify-center m-5 ">
                <div class="rounded-lg shadow-lg bg-white">
                
                  <div class="p-6">
                    <div><img class="rounded-lg meal-image h-28" src="${recipe.imageURL}" alt=""/></div>
                    <h2 class="text-gray-900 text-l font-medium mb-2">${recipe.mealType}</h2>
                    <h5 class="text-gray-900 text-xl font-medium mb-2">${recipe.recipeName}</h5>
                    
                    <div class="flex">
                      <div class="">
                      Calories: <span class="text-purple-400 m-3 calories px-1">${recipe.calories}</span>
                      </div>
                      <a target="blank" class="text-white bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mb-2 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-900" href="${recipe.recipeURL}">GET RECIPE</a>
                    </div>
                      </div>
                    </div>
              </div>
  `);

    $(".cookbookRecipes").append(cookbookRecipe);
  });
}

function renderWeekdayMeals(
  recipeImage,
  data,
  recipeName,
  recipeUrl,
  recipeCalories,
  recipeProtein,
  recipeFats,
  recipeCarbs,
  refreshBtn,
  calories
) {
  recipeRandomNum = Math.floor(Math.random() * 19);

  $(recipeImage).attr(
    "src",
    data.hits[recipeRandomNum].recipe.images.LARGE.url
  );
  $(recipeName).text(data.hits[recipeRandomNum].recipe.label);
  $(recipeUrl).attr("href", data.hits[recipeRandomNum].recipe.url);
  // nutrition
  // lunch nutrition values
  $(recipeCalories).text(
    Math.floor(
      data.hits[recipeRandomNum].recipe.calories /
        data.hits[recipeRandomNum].recipe.yield
    )
  );
  $(recipeProtein).text(
    Math.floor(
      data.hits[recipeRandomNum].recipe.totalNutrients.PROCNT.quantity /
        data.hits[recipeRandomNum].recipe.yield
    ) + "g"
  );
  $(recipeFats).text(
    Math.floor(
      data.hits[recipeRandomNum].recipe.totalNutrients.FAT.quantity /
        data.hits[recipeRandomNum].recipe.yield
    ) + "g"
  );
  $(recipeCarbs).text(
    Math.floor(
      data.hits[recipeRandomNum].recipe.totalNutrients.CHOCDF.quantity /
        data.hits[recipeRandomNum].recipe.yield
    ) + "g"
  );
  localStorage.setItem(
    calories,
    Math.floor(
      data.hits[recipeRandomNum].recipe.calories /
        data.hits[recipeRandomNum].recipe.yield
    )
  );
  $(refreshBtn).on("click", function () {
    renderWeekdayMeals(
      recipeImage,
      data,
      recipeName,
      recipeUrl,
      recipeCalories,
      recipeProtein,
      recipeFats,
      recipeCarbs,
      refreshBtn,
      calories
    );
    callRemainingFunction();
  });
}

// go back to homepage
$("#backBtn").on("click", function () {
  localStorage.clear();
  location.reload();
  $("#backBtn").removeClass("flex");
});

// remove recipes from local storage
$("#cookBookReset").on("click", function () {
  console.log("reset cookbook");
  localStorage.removeItem("savedRecipes");
  $("#cookBookContainer").removeClass("flex justify-center");
  removeRecipes();
});

function removeRecipes() {
  $(".cookbookRecipes").html("");
  $("#cookbook-number").text("0");
}

if (!localStorage.getItem("savedRecipes")) {
  $("#cookbook-number").text("0");
}

function remainingCals(total, breakfast, lunch, dinner) {
  console.log(total);
  console.log(breakfast);
  console.log(lunch);
  console.log(dinner);
  var bld = breakfast + lunch + dinner;
  var remaining = total - bld;
  return remaining;
}

console.log(
  remainingCals(
    JSON.parse(localStorage.getItem("calories")),
    JSON.parse(localStorage.getItem("breakfastDayOneCalories")),
    JSON.parse(localStorage.getItem("lunchDayOneCalories")),
    JSON.parse(localStorage.getItem("dinnerDayOneCalories"))
  )
);

function callRemainingFunction() {
  $("#remainingCalsMon").text(
    remainingCals(
      JSON.parse(localStorage.getItem("calories")),
      JSON.parse(localStorage.getItem("breakfastDayOneCalories")),
      JSON.parse(localStorage.getItem("lunchDayOneCalories")),
      JSON.parse(localStorage.getItem("dinnerDayOneCalories"))
    )
  );
  $("#remainingCalsTue").text(
    remainingCals(
      JSON.parse(localStorage.getItem("calories")),
      JSON.parse(localStorage.getItem("breakfastDayTwoCalories")),
      JSON.parse(localStorage.getItem("lunchDayTwoCalories")),
      JSON.parse(localStorage.getItem("dinnerDayTwoCalories"))
    )
  );
  $("#remainingCalsWed").text(
    remainingCals(
      JSON.parse(localStorage.getItem("calories")),
      JSON.parse(localStorage.getItem("breakfastDayThreeCalories")),
      JSON.parse(localStorage.getItem("lunchDayThreeCalories")),
      JSON.parse(localStorage.getItem("dinnerDayThreeCalories"))
    )
  );
  $("#remainingCalsThurs").text(
    remainingCals(
      JSON.parse(localStorage.getItem("calories")),
      JSON.parse(localStorage.getItem("breakfastDayFourCalories")),
      JSON.parse(localStorage.getItem("lunchDayFourCalories")),
      JSON.parse(localStorage.getItem("dinnerDayFourCalories"))
    )
  );
  $("#remainingCalsFri").text(
    remainingCals(
      JSON.parse(localStorage.getItem("calories")),
      JSON.parse(localStorage.getItem("breakfastDayFiveCalories")),
      JSON.parse(localStorage.getItem("lunchDayfiveCalories")),
      JSON.parse(localStorage.getItem("dinnerDayFiveCalories"))
    )
  );
}
