# Macro-Meals

## The Problem
There is an endless amount of dieting information out there. What diet should I go on? Should I cut or bulk? How many calories should I aim for? And then... what recipes can I make in order to meet my goals. For a busy individual, this process can be tedious. We have taken the problem away. The user simply inputs their health goals and information about themselves, macro meals will convert this with a meal-plan and calorie requirements for you.

## The Goal
Create an app / website that takes in user values, and generates a daily calorie requirement based on the users desired health goal.
Present the user with recipes that will allow the user to meet their daily calorie requirement.
Create a virtual dashboard allowing the user to test, randomise and save their recipes.


## User Story
```
AS a user, I want to know the required calorie intake in order to meet my health goal.
I want to receive a custom meal plan, based on my personal requirements.
I want to be able to refresh recipes I dislike and store recipes I like.

```

## Acceptance Criteria 

```
AS a user, I want to receive a custom meal plan, based on my personal requirements.

WHEN I input my age, gender, weight, height, goal, and activity level
THEN I should receive a custom meal plan, showing breakfast, lunch and dinner, for a total of five days ✅

WHEN I view the meal plan
THEN I can clearly see relevant information such as calories, and macro-nutrient values for each meal, and can click on a link that will take me to the recipe ✅

WHEN I view a recipe that I like, 
THEN I can save it to my virtual “cookbook”, so that I can access it later ✅

WHEN I view a recipe that I don’t like,
THEN I can refresh it and be presented with a new recipe ✅

WHEN I view a full days meal plan
Then at the bottom of the screen, I can view how many calories I would have left over for snacks if I were to follow that meal plan ✅

WHEN I refresh the page, my user details should be saved and the recipes I saved to my cookbook should persist so that I can continue to view and use them ✅

```

## Technology Used
* HTML
* CSS
* JAVASCRIPT
* JQUERY
* TAILWIND CSS
* https://rapidapi.com/malaaddincelik/api/fitness-calculator/
* https://developer.edamam.com/edamam-recipe-api


## Task / Role Breakdowns
### Phase One
#### The Concept
* Deciding API and concept
* Creating user-story
* Creating wire-frames 

### Phase Two
#### The Core Logic
* Take in user input and generate daily calorie requirements (using fitness API) 
* Use data to create a nutrition summary on user dashboard
* Search for recipes that will allow the user to meet their calorie requirements (using edamam API)
* Display the data on screen in a user friendly format

### Phase Three
#### Additional Functionality
* Randomise meals
* Excess calories
* Virtual cookbook
* Alerts
* Refactoring code
* Polishing UI with Tailwind CSS

### The Project Team
* [Bav](https://github.com/BavKudhail)
* [Grant](https://github.com/GrantRT)
* [Laura](https://github.com/laurawalters1)

## Obstacles
* Thinking of a project concept that uses 2 APIs
* Fetch limits
* Using Jquery
* Add a lot of general programming issues!!

### The learning loop
* Agile development 
* Collaboration
* Using Github projects
* Template literals
* Tailwind CSS

## Future Developments
* Show recipes based on diet preferences (keto, veg, paleo)
* Search for recipes via dish / ingredient
* Save weekly meal plan to local storage
* Enable multiple user functionality
* Ability to input weight after a period of time and check progress
* Start-up plan to increase fetch requests


## Application Screenshots

![Macro-meals-screenshot-1](https://user-images.githubusercontent.com/93915846/153621185-1c09aa76-cc44-4d66-a4b4-06885bce7dae.JPG)
![Macro-meals-screenshot-2](https://user-images.githubusercontent.com/93915846/153621217-0dd467f6-69fb-4222-aae8-f2e8c14be7ea.JPG)
![Macro-meals-screenshot-3](https://user-images.githubusercontent.com/93915846/153621252-20ec2309-9289-4150-b88f-d05fc272bc95.JPG)
![Macro-meals-screenshot-4](https://user-images.githubusercontent.com/93915846/153621263-ad80b7f8-dee5-4c3d-82ed-e7616ea10adf.JPG)



## Deployed link:
https://bavkudhail.github.io/macro-meals/


## Repository Link:
https://github.com/BavKudhail/macro-meals


