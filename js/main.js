// submit button event listner
$("#user-form").on("submit", generateUserSummary);

// generate user summary
function generateUserSummary(event) {
  event.preventDefault();
  console.log("submitted form");

  // assigning user values
  var formContainer = $("#form-container");
  var age = $("#age").val();
  console.log(age);
  var gender = $("#gender").val();
  console.log(gender);
  var height = $("#height").val();
  console.log(height);
  var weight = $("#weight").val();
  console.log(weight);
  var userGoal = $("#goal").val();
  console.log(userGoal);
  var activitylevel = $("#activity-level").val();
  console.log(activitylevel);

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
      renderUserData(data);
      saveToLocal(data);
      removeForm();
    });
}

function removeForm() {
  $("#form-container").addClass("form-none");
}

function renderUserData(userData) {
  console.log(userData.data);

  // Declaring variables for recommended macros
  var protein = Math.round(userData.data.balanced.protein);
  var fat = Math.round(userData.data.balanced.fat);
  var carbs = Math.round(userData.data.balanced.carbs);
  var calories = Math.round(userData.data.calorie);

  var userCard = $(`
  <div class="flex justify-center">
  <h1 class="font-semibold"> Target Calories: </h1>
  <p>${calories}</p>
  </div>
  <div class="flex justify-center">
  <div class="block p-6 rounded-lg shadow-lg bg-white max-w-sm">
    <h5 class="text-gray-900 text-xl leading-tight font-medium mb-2">Balanced Diet</h5>
      <canvas class="p-10" id="chartDoughnut"></canvas>
  </div>     
  </div>
   `);

  $("#userCard").append(userCard);

  const dataDoughnut = {
    labels: [`Protein ${protein}g`, `Fat ${fat}g`, `Carbs ${carbs}g`],
    datasets: [
      {
        label: "Nutrition",
        data: [protein, fat, carbs],
        backgroundColor: [
          "rgb(133, 105, 241)",
          "rgb(164, 101, 241)",
          "rgb(101, 143, 241)",
        ],
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
}

console.log(localStorage.getItem("calories"));

function renderUserDataRefresh() {
  var userCard = $(`
    <div class="flex justify-center">
    <h1 class="font-semibold"> Target Calories: </h1>
    <p>${localStorage.getItem("calories")}</p>
    </div>
    <div class="flex justify-center">
    <div class="block p-6 rounded-lg shadow-lg bg-white max-w-sm">
      <h5 class="text-gray-900 text-xl leading-tight font-medium mb-2">Balanced Diet</h5>
        <canvas class="p-10" id="chartDoughnut"></canvas>
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
        backgroundColor: [
          "rgb(133, 105, 241)",
          "rgb(164, 101, 241)",
          "rgb(101, 143, 241)",
        ],
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

// breakfast
var breakfastSearchAPI =
  "https://api.edamam.com/api/recipes/v2?type=public&app_id=bc5cbaa0&app_key=381962b6de0bc353997fbbf9824d4794&q=%20&mealType=breakfast&diet=balanced&imageSize=LARGE";

fetch(breakfastSearchAPI).then(function (res) {
  return res.json().then(function (data) {
    console.log(data);
    // breakfast card
    $("#breakfast-image").attr("src", data.hits[6].recipe.images.LARGE.url);
    $("#breakfast-recipe-name").text(data.hits[2].recipe.label);
    $("#breakfast-url").attr("href", data.hits[2].recipe.url);
  });
});

// lunch
var lunchSearchAPI =
  "https://api.edamam.com/api/recipes/v2?type=public&app_id=bc5cbaa0&app_key=381962b6de0bc353997fbbf9824d4794&q=%20&mealType=lunch&diet=balanced&dishType=Salad&dishType=Sandwiches&dishType=Side%20dish&dishType=Starter&imageSize=LARGE";

fetch(lunchSearchAPI).then(function (res) {
  return res.json().then(function (data) {
    console.log(data);
    // lunch card
    console.log(data.hits[2].recipe.images.LARGE.url);
    console.log(data.hits[2].recipe.images.REGULAR.url);
    $("#lunch-image").attr("src", data.hits[2].recipe.images.LARGE.url);
    $("#lunch-recipe-name").text(data.hits[2].recipe.label);
    $("#lunch-url").attr("href", data.hits[2].recipe.url);
  });
});

// dinner
var dinnerSearchAPI =
  "https://api.edamam.com/api/recipes/v2?type=public&app_id=bc5cbaa0&app_key=381962b6de0bc353997fbbf9824d4794&q=%20&mealType=dinner&diet=balanced&dishType=main%20course&imageSize=LARGE";

fetch(dinnerSearchAPI).then(function (res) {
  return res.json().then(function (data) {
    console.log(data.hits);
    console.log(data.hits[0].recipe);

    // dinner card
    $("#dinner-image").attr("src", data.hits[2].recipe.images.LARGE.url);
    $("#dinner-recipe-name").text(data.hits[2].recipe.label);
    $("#dinner-url").attr("href", data.hits[2].recipe.url);
  });
});
