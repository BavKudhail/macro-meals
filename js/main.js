// submit button event listner
$("#user-form").on("submit", generateUserSummary);

// generate user summary
function generateUserSummary(event) {
  event.preventDefault();
  console.log("submitted form");

  // assigning user values
  var formContainer = $("#form-container");
  var age = $("#age").val();
  var gender = $("#gender").val();
  var height = $("#height").val();
  var weight = $("#weight").val();
  var userGoal = $("#goal").val();
  var activitylevel = $("#activity-level").val();

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
        "x-rapidapi-key": "2a61fe40cdmshb25b8249e993d82p1d55cejsn5658af22a824",
      },
    }
  )
    .then(function (res) {
      return res.json();
    })
    .then(function (data) {
      console.log(data);
      // function that makes the users summary visible in a chart
      //   renderUserData(data);
      saveToLocal(data);
      renderUserDataRefresh();
      removeForm();
      generateMeals();
      if (localStorage.getItem("calories")) {
        $(".meal-section").removeClass("meal-section");
      }
    })
    .catch(function (error) {
      console.log("error fetching fitness API data");
    });
}

if (localStorage.getItem("calories")) {
  $(".meal-section").removeClass("meal-section");
}

function removeForm() {
  $("#form-container").addClass("form-none");
}

// function renderUserData(userData) {
//   console.log(userData.data);

//   // Declaring variables for recommended macros
//   var protein = Math.round(userData.data.balanced.protein);
//   var fat = Math.round(userData.data.balanced.fat);
//   var carbs = Math.round(userData.data.balanced.carbs);
//   var calories = Math.round(userData.data.calorie);

//   var userCard = $(`
//   <div class="flex justify-center">
//   <h1 class="font-semibold"> Target Calories: </h1>
//   <p>${calories}</p>
//   </div>
//   <div class="flex justify-center">
//   <div class="block p-6 rounded-lg shadow-lg bg-white max-w-sm">
//     <h5 class="text-gray-900 text-xl leading-tight font-medium mb-2">Balanced Diet</h5>
//       <canvas class="p-10" id="chartDoughnut"></canvas>
//   </div>
//   </div>
//    `);

//   $("#userCard").append(userCard);

//   const dataDoughnut = {
//     labels: [`Protein ${protein}g`, `Fat ${fat}g`, `Carbs ${carbs}g`],
//     datasets: [
//       {
//         label: "Nutrition",
//         data: [protein, fat, carbs],
//         backgroundColor: [
//           "rgb(133, 105, 241)",
//           "rgb(164, 101, 241)",
//           "rgb(101, 143, 241)",
//         ],
//         hoverOffset: 4,
//       },
//     ],
//   };

//   const configDoughnut = {
//     type: "doughnut",
//     data: dataDoughnut,
//     options: {},
//   };

//   var chartBar = new Chart(
//     document.getElementById("chartDoughnut"),
//     configDoughnut
//   );
// }

function renderUserDataRefresh() {
  $("#backBtn").addClass("flex");

  var userCard = $(`
    <div class="flex mx-10 mt-1 mb-5 justify-center inline-block px-3 py-3 bg-purple-custom text-white font-medium text-sm leading-tight uppercase rounded shadow-md hover:bg-purple-700 hover:shadow-lg focus:bg-purple-700 focus:shadow-lg">
    <h1 class="font-semibold"> Target Calories: </h1>
    <p>${localStorage.getItem("calories")}</p>
    </div>
    <div class="flex justify-center">
    <div class="block p-6 rounded-lg shadow-lg bg-pink-custom  max-w-sm ">
      <h5 class="text-gray-600 text-8-xl leading-tight font-medium mb-2">Balanced Diet</h5>
        <canvas class="p-3 " id="chartDoughnut"></canvas>
    </div>
    </div>
      `);

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

if (localStorage.getItem("calories")) {
  renderUserDataRefresh();
  removeForm();
}

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

// recipe Searcher Api

function generateBreakfast() {
  var totalCalories = localStorage.getItem("calories");
  var breakfastCalories = Math.floor(totalCalories * 0.2);
  var breakfastCaloriesMin = breakfastCalories - 100;
  //breakfast API
  var breakfastSearchAPI =
    "https://api.edamam.com/api/recipes/v2?type=public&app_id=bc5cbaa0&app_key=381962b6de0bc353997fbbf9824d4794&q=%20&mealType=breakfast&diet=balanced&imageSize=LARGE&calories=" +
    breakfastCaloriesMin +
    "-" +
    breakfastCalories;

  // fetching breakfast API data
  fetch(breakfastSearchAPI).then(function (res) {
    return res.json().then(function (data) {
      console.log(data);
      // breakfast card
      var breakfastRandom = Math.floor(Math.random() * 19);

      $("#breakfast-image").attr(
        "src",
        data.hits[breakfastRandom].recipe.images.LARGE.url
      );
      $("#breakfast-protein").text(
        Math.floor(
          data.hits[breakfastRandom].recipe.totalNutrients.PROCNT.quantity /
            data.hits[breakfastRandom].recipe.yield
        ) + "g"
      );
      $("#breakfast-fats").text(
        Math.floor(
          data.hits[breakfastRandom].recipe.totalNutrients.FAT.quantity /
            data.hits[breakfastRandom].recipe.yield
        ) + "g"
      );
      $("#breakfast-carbs").text(
        Math.floor(
          data.hits[breakfastRandom].recipe.totalNutrients.CHOCDF.quantity /
            data.hits[breakfastRandom].recipe.yield
        ) + "g"
      );
      $("#breakfast-recipe-name").text(data.hits[breakfastRandom].recipe.label);
      $("#breakfast-url").attr("href", data.hits[breakfastRandom].recipe.url);
      console.log(data.hits[breakfastRandom].recipe);
      console.log(data.hits[breakfastRandom].recipe.yield);
      $("#break-fast-calories").text(
        Math.floor(
          data.hits[breakfastRandom].recipe.calories /
            data.hits[breakfastRandom].recipe.yield
        )
      );
      $("#saveBreakfast").on("click", function (e) {
        e.preventDefault();
        saveRecipe("Breakfast", data, breakfastRandom);
      });
    });
  });
}

function generateLunch() {
  var totalCalories = localStorage.getItem("calories");
  var lunchCalories = Math.floor(totalCalories * 0.3);
  var lunchCaloriesMin = lunchCalories - 100;
  // lunch
  var lunchSearchAPI =
    "https://api.edamam.com/api/recipes/v2?type=public&app_id=bc5cbaa0&app_key=381962b6de0bc353997fbbf9824d4794&q=%20&mealType=lunch&diet=balanced&dishType=Salad&dishType=Sandwiches&dishType=Side%20dish&dishType=Starter&imageSize=LARGE&calories=" +
    lunchCaloriesMin +
    "-" +
    lunchCalories;

  fetch(lunchSearchAPI).then(function (res) {
    return res.json().then(function (data) {
      var lunchRandom = Math.floor(Math.random() * 19);
      console.log(data);
      // lunch card
      $("#lunch-image").attr(
        "src",
        data.hits[lunchRandom].recipe.images.LARGE.url
      );
      $("#lunch-recipe-name").text(data.hits[lunchRandom].recipe.label);
      $("#lunch-url").attr("href", data.hits[lunchRandom].recipe.url);

      // lunch nutrition values
      $("#lunch-calories").text(
        Math.floor(
          data.hits[lunchRandom].recipe.calories /
            data.hits[lunchRandom].recipe.yield
        )
      );
      $("#lunch-protein").text(
        Math.floor(
          data.hits[lunchRandom].recipe.totalNutrients.PROCNT.quantity /
            data.hits[lunchRandom].recipe.yield
        ) + "g"
      );
      $("#lunch-fats").text(
        Math.floor(
          data.hits[lunchRandom].recipe.totalNutrients.FAT.quantity /
            data.hits[lunchRandom].recipe.yield
        ) + "g"
      );
      $("#lunch-carbs").text(
        Math.floor(
          data.hits[lunchRandom].recipe.totalNutrients.CHOCDF.quantity /
            data.hits[lunchRandom].recipe.yield
        ) + "g"
      );
      $("#saveLunch").on("click", function (e) {
        e.preventDefault();
        saveRecipe("Lunch", data, lunchRandom);
      });
    });
  });
}

function generateDinner() {
  var totalCalories = localStorage.getItem("calories");
  var dinnerCalories = Math.floor(totalCalories * 0.5);
  var dinnerCaloriesMin = dinnerCalories - 100;
  // dinner
  var dinnerSearchAPI =
    "https://api.edamam.com/api/recipes/v2?type=public&app_id=bc5cbaa0&app_key=381962b6de0bc353997fbbf9824d4794&q=%20&mealType=dinner&diet=balanced&dishType=main%20course&imageSize=LARGE&calories=" +
    dinnerCaloriesMin +
    "-" +
    dinnerCalories;
  var dinnerRandom = Math.floor(Math.random() * 19);

  fetch(dinnerSearchAPI).then(function (res) {
    return res.json().then(function (data) {
      console.log(data);
      // dinner card
      $("#dinner-image").attr(
        "src",
        data.hits[dinnerRandom].recipe.images.LARGE.url
      );
      $("#dinner-recipe-name").text(data.hits[dinnerRandom].recipe.label);
      $("#dinner-url").attr("href", data.hits[dinnerRandom].recipe.url);
      // nutrition
      // lunch nutrition values
      console.log(dinnerRandom);
      $("#dinner-calories").text(
        Math.floor(
          data.hits[dinnerRandom].recipe.calories /
            data.hits[dinnerRandom].recipe.yield
        )
      );
      $("#dinner-protein").text(
        Math.floor(
          data.hits[dinnerRandom].recipe.totalNutrients.PROCNT.quantity /
            data.hits[dinnerRandom].recipe.yield
        ) + "g"
      );
      $("#dinner-fats").text(
        Math.floor(
          data.hits[dinnerRandom].recipe.totalNutrients.FAT.quantity /
            data.hits[dinnerRandom].recipe.yield
        ) + "g"
      );
      $("#dinner-carbs").text(
        Math.floor(
          data.hits[dinnerRandom].recipe.totalNutrients.CHOCDF.quantity /
            data.hits[dinnerRandom].recipe.yield
        ) + "g"
      );
      $("#saveDinner").on("click", function (e) {
        e.preventDefault();
        saveRecipe("Dinner", data, dinnerRandom);
      });
      // calling parameterised function to generate dinner card for tues
      renderWeekdayDinner(
        "#tues-dinner-image",
        data,
        "#tues-dinner-recipe-name",
        "#tues-lunch-url",
        "#tues-dinner-calories",
        "#tues-dinner-protein",
        "#tues-dinner-fats",
        "#tues-dinner-carbs",
        "#tues-saveDinner"
      );
    });
  });
}
// parameterised function that will generate dinner cards for any weekday
function renderWeekdayDinner(
  weekdayImage,
  data,
  weekdayRecipeName,
  weekdayUrl,
  weekdayCals,
  weekdayProtein,
  weekdayFats,
  weekdayCarbs,
  weekdaySaveDinner
) {
  var weekdayDinnerRandom = Math.floor(Math.random() * 19);
  $(weekdayImage).attr(
    "src",
    data.hits[weekdayDinnerRandom].recipe.images.LARGE.url
  );
  $(weekdayRecipeName).text(data.hits[weekdayDinnerRandom].recipe.label);
  $(weekdayUrl).attr("href", data.hits[weekdayDinnerRandom].recipe.url);
  // nutrition
  // lunch nutrition values

  $(weekdayCals).text(
    Math.floor(
      data.hits[weekdayDinnerRandom].recipe.calories /
        data.hits[weekdayDinnerRandom].recipe.yield
    )
  );
  $(weekdayProtein).text(
    Math.floor(
      data.hits[weekdayDinnerRandom].recipe.totalNutrients.PROCNT.quantity /
        data.hits[weekdayDinnerRandom].recipe.yield
    ) + "g"
  );
  $(weekdayFats).text(
    Math.floor(
      data.hits[weekdayDinnerRandom].recipe.totalNutrients.FAT.quantity /
        data.hits[weekdayDinnerRandom].recipe.yield
    ) + "g"
  );
  $(weekdayCarbs).text(
    Math.floor(
      data.hits[weekdayDinnerRandom].recipe.totalNutrients.CHOCDF.quantity /
        data.hits[weekdayDinnerRandom].recipe.yield
    ) + "g"
  );
  $(weekdaySaveDinner).on("click", function (e) {
    e.preventDefault();
    saveRecipe("Dinner", data, weekdayDinnerRandom);
  });
}

function generateMeals() {
  generateBreakfast();
  generateLunch();
  generateDinner();
}

$("#backBtn").on("click", function () {
  localStorage.clear();
  location.reload();
  $("#backBtn").removeClass("flex");
});

// save recipe functionality, needs to be called in each generate meals function and each weekday
function saveRecipe(mealtime, data, index) {
  savedRecipes = JSON.parse(localStorage.getItem("savedRecipes"));
  console.log(savedRecipes);
  if (savedRecipes == null) {
    savedRecipes = [];
  }
  var mealObj = {
    meal: mealtime,
    title: data.hits[index].recipe.label,
    image: data.hits[index].recipe.images.LARGE.url,
    url: data.hits[index].recipe.url,
  };
  savedRecipes.push(mealObj);
  localStorage.setItem("savedRecipes", JSON.stringify(savedRecipes));
  console.log(mealObj);
}
