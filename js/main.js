// submit button event listner
$('#user-form').on('submit', generateUserSummary);

// generate user summary
function generateUserSummary(event) {
  event.preventDefault();
  console.log('submitted form');

  // assigning user values
  var formContainer = $('#form-container');
  var age = $('#age').val();
  console.log(age);
  var gender = $('#gender').val();
  console.log(gender);
  var height = $('#height').val();
  console.log(height);
  var weight = $('#weight').val();
  console.log(weight);
  var userGoal = $('#goal').val();
  console.log(userGoal);
  var activitylevel = $('#activity-level').val();
  console.log(activitylevel);

  // fetching fitness API data
  fetch(
    // "https://fitness-calculator.p.rapidapi.com/macrocalculator?age=26&gender=male&height=180&weight=70&activitylevel=4&goal=maintain",
    'https://fitness-calculator.p.rapidapi.com/macrocalculator?age=' + age + '&gender=' + gender + '&height=' + height + '&weight=' + weight + '&activitylevel=' + activitylevel + '&goal=' + userGoal,
    {
      method: 'GET',
      headers: {
        'x-rapidapi-host': 'fitness-calculator.p.rapidapi.com',
        'x-rapidapi-key': '2a61fe40cdmshb25b8249e993d82p1d55cejsn5658af22a824',
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
  $('#form-container').addClass('form-none');
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
  <h1 class="font-extrabold"> Target Calories: </h1>
  <p>${calories}</p>
  </div>
  <div class="flex justify-center">
  <div class="block p-6 rounded-lg shadow-lg bg-white max-w-sm">
    <h5 class="text-gray-900 text-xl leading-tight font-medium mb-2">Balanced Diet</h5>
      <canvas class="p-10" id="chartDoughnut"></canvas>
  </div>     
  </div>
   `);

  $('#userCard').append(userCard);

  const dataDoughnut = {
    labels: [`Protein ${protein}g`, `Fat ${fat}g`, `Carbs ${carbs}g`],
    datasets: [
      {
        label: 'Nutrition',
        data: [protein, fat, carbs],
        backgroundColor: ['rgb(133, 105, 241)', 'rgb(164, 101, 241)', 'rgb(101, 143, 241)'],
        hoverOffset: 4,
      },
    ],
  };

  const configDoughnut = {
    type: 'doughnut',
    data: dataDoughnut,
    options: {},
  };

  var chartBar = new Chart(document.getElementById('chartDoughnut'), configDoughnut);
}

console.log(localStorage.getItem('calories'));

function renderUserDataRefresh() {
  var userCard = $(`
    <div class="flex justify-center">
    <h1 class="font-extrabold"> Target Calories: </h1>
    <p>${localStorage.getItem('calories')}</p>
    </div>
    <div class="flex justify-center">
    <div class="block p-6 rounded-lg shadow-lg bg-white max-w-sm">
      <h5 class="text-gray-900 text-xl leading-tight font-medium mb-2">Balanced Diet</h5>
        <canvas class="p-10" id="chartDoughnut"></canvas>
    </div>
    </div>
      `);

  $('#userCard').append(userCard);

  const dataDoughnut = {
    labels: [`Protein ${localStorage.getItem('protein')}g`, `Fat ${localStorage.getItem('fat')}g`, `Carbs ${localStorage.getItem('carbs')}g`],
    datasets: [
      {
        label: 'Nutrition',
        data: [localStorage.getItem('protein'), localStorage.getItem('fat'), localStorage.getItem('carbs')],
        backgroundColor: ['rgb(133, 105, 241)', 'rgb(164, 101, 241)', 'rgb(101, 143, 241)'],
        hoverOffset: 4,
      },
    ],
  };

  const configDoughnut = {
    type: 'doughnut',
    data: dataDoughnut,
    options: {},
  };

  var chartBar = new Chart(document.getElementById('chartDoughnut'), configDoughnut);
}
if (localStorage.getItem('calories')) {
  renderUserDataRefresh();
  removeForm();
}

function saveToLocal(userData) {
  var protein = Math.round(userData.data.balanced.protein);
  var fat = Math.round(userData.data.balanced.fat);
  var carbs = Math.round(userData.data.balanced.carbs);
  var calories = Math.round(userData.data.calorie);

  localStorage.setItem('protein', protein);
  localStorage.setItem('fat', fat);
  localStorage.setItem('carbs', carbs);
  localStorage.setItem('calories', calories);
}
