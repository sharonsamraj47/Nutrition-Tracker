function findMyMacros() {
    alert('Find my macros clicked');
}

function findMyNextMeal() {
    alert('Find my next meal clicked');
}

function showBMRContainer() {
    // Remove existing BMR container if any
    var existingBMRContainer = document.querySelector('.bmr-container');
    if (existingBMRContainer) {
        existingBMRContainer.remove();
    }

    var ele = document.querySelector('.body')

    // Create BMR container
    var bmrContainer = document.createElement('div');
    bmrContainer.classList.add('bmr-container');
    bmrContainer.classList.add('container');

    // Create input fields for weight, height, and age
    var weightInput = document.createElement('input');
    weightInput.type = 'number';
    weightInput.placeholder = 'Weight (kg)';
    weightInput.classList.add('input-field');
    var v = document.createElement('br');
    var heightInput = document.createElement('input');
    heightInput.type = 'number';
    heightInput.placeholder = 'Height (cm)';
    heightInput.classList.add('input-field');
    var ageInput = document.createElement('input');
    ageInput.type = 'number';
    ageInput.placeholder = 'Age';
    ageInput.classList.add('input-field');


    // Create radio buttons for gender selection
    var genderLabel = document.createElement('label');
    genderLabel.textContent = 'Gender:';
    var maleRadio = document.createElement('input');
    maleRadio.type = 'radio';
    maleRadio.name = 'gender';
    maleRadio.value = 'male';
    var maleLabel = document.createElement('label');
    maleLabel.textContent = 'Male';
    maleLabel.setAttribute('for', 'male');
    var femaleRadio = document.createElement('input');
    femaleRadio.type = 'radio';
    femaleRadio.name = 'gender';
    femaleRadio.value = 'female';
    var femaleLabel = document.createElement('label');
    femaleLabel.textContent = 'Female';
    femaleLabel.setAttribute('for', 'female');

    // Create a dropdown for activity factor
    var activityLabel = document.createElement('label');
    activityLabel.textContent = 'Activity Level:';
    var activitySelect = document.createElement('select');
    var activityLevels = [
        { text: 'Sedentary (little to no exercise)', value: 1.2 },
        { text: 'Lightly active (light exercise/sports 1-3 days a week)', value: 1.375 },
        { text: 'Moderately active (moderate exercise/sports 3-5 days a week)', value: 1.55 },
        { text: 'Very active (hard exercise/sports 6-7 days a week)', value: 1.725 },
        { text: 'Extra active (very hard exercise/sports & physical job or training twice a day)', value: 1.9 }
    ];
    activityLevels.forEach(function (level) {
        var option = document.createElement('option');
        option.value = level.value;
        option.textContent = level.text;
        activitySelect.appendChild(option);
    });

    // Create a button to calculate BMR
    var calculateButton = document.createElement('button');
    calculateButton.textContent = 'Calculate BMR';
    calculateButton.onclick = calculateBMR;

    // Create a paragraph to display the result
    var bmrResult = document.createElement('p');
    bmrResult.classList.add('bmr-result');

    // Append input fields, radio buttons, button, and result to the BMR container
    bmrContainer.appendChild(weightInput);
    bmrContainer.appendChild(v.cloneNode());
    bmrContainer.appendChild(heightInput);
    bmrContainer.appendChild(v.cloneNode());
    bmrContainer.appendChild(ageInput);
    bmrContainer.appendChild(v.cloneNode());
    bmrContainer.appendChild(genderLabel);
    bmrContainer.appendChild(v.cloneNode());
    bmrContainer.appendChild(maleRadio);
    bmrContainer.appendChild(maleLabel);
    bmrContainer.appendChild(femaleRadio);
    bmrContainer.appendChild(femaleLabel);
    bmrContainer.appendChild(v.cloneNode());
    bmrContainer.appendChild(activityLabel);
    bmrContainer.appendChild(activitySelect);
    bmrContainer.appendChild(v.cloneNode());
    bmrContainer.appendChild(calculateButton);
    bmrContainer.appendChild(v.cloneNode());
    bmrContainer.appendChild(bmrResult);

    // Append BMR container to body
    ele.appendChild(bmrContainer);
}

function calculateBMR() {
    var weight = parseFloat(document.querySelector('.bmr-container .input-field:nth-of-type(1)').value);
    var heightCM = parseFloat(document.querySelector('.bmr-container .input-field:nth-of-type(2)').value);
    var age = parseInt(document.querySelector('.bmr-container .input-field:nth-of-type(3)').value);
    var gender = document.querySelector('.bmr-container input[name="gender"]:checked').value;
    var activityFactor = parseFloat(document.querySelector('.bmr-container select').value);

    // Check if weight, height, age, gender, and activity factor are provided
    if (!isNaN(weight) && !isNaN(heightCM) && !isNaN(age) && gender && !isNaN(activityFactor)) {
        var heightM = heightCM / 100; // Convert cm to meters
        var bmr;
        if (gender === 'male') {
            bmr = (10 * weight) + (6.25 * heightCM) - (5 * age) + 5;
        } else if (gender === 'female') {
            bmr = (10 * weight) + (6.25 * heightCM) - (5 * age) - 161;
        }

        var dailyMaintenanceCalories = bmr * activityFactor;
        var weightLossCalories = dailyMaintenanceCalories - 300;
        var weightGainCalories = dailyMaintenanceCalories + 300;
        var proteinIntake = weight*2;
        var carboIntake = ((dailyMaintenanceCalories/2)/4);

        var bmrResult = document.querySelector('.bmr-container .bmr-result');
        bmrResult.innerHTML = `
            BMR: ${bmr.toFixed(0)} kcal/day<br>
            Daily Maintenance Calories: ${dailyMaintenanceCalories.toFixed(0)} kcal/day<br>
            Weight Loss Calories: ${weightLossCalories.toFixed(0)} kcal/day<br>
            Weight Gain Calories: ${weightGainCalories.toFixed(0)} kcal/day<br>
            Protein Intake: ${proteinIntake.toFixed(0)} grams<br>
            Carbohydrate Intake ${carboIntake.toFixed(0)} grams<br><br>

            Check Your Weight Once Every Week To See Any Change In Your Weight.<br>
            If there is loss or gain, use the daily intake calculator again to view the change in your daily calorie intake according to your BMR.
        `;
    } else {
        alert('Please enter weight, height, age, and select gender and activity level.');
    }
}
