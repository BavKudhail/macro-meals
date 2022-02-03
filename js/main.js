// submit button event listner
$("#user-form").on("submit", generateUserSummary);

// generate user summary
function generateUserSummary(event) {
  event.preventDefault();
  console.log("submitted form");

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
    // "https://fitness-calculator.p.rapidapi.com/macrocalculator?age=26&gender=male&height=180&weight=70&activitylevel=4&goal=maintain",
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
    });
}
