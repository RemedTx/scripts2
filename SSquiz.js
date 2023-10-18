
// Remove submit with enter
$(document).keypress(
    function(event){
    if (event.which == '13') {
        event.preventDefault();
    }
});

// FORM DIVS BUILD
const questions = document.getElementsByClassName("form-question");
const sliderContainer = document.getElementById("slider");

// Add necessary slides & append tags
const hiddenSlide = document.getElementsByClassName("w-slide")[1];
for (let i = 0; i < questions.length - 2; i++) {
    let slideCopy = hiddenSlide.cloneNode( true );
    sliderContainer.appendChild(slideCopy);
};
let slides = Array.from(document.getElementsByClassName("w-slide"));
Array.from(questions).forEach((question, index) => {
    slides[index].setAttribute("aria-label", `${index+1} of ${questions.length}`);
    slides[index].lastChild.innerHTML = question.innerHTML;
});

// Hide long form
document.getElementById("form-to-hide").remove();

// FORM CUSTOMIZATION
slides = Array.from(document.getElementsByClassName("w-slide"));
const rightArrow = document.getElementById("next-slide");
const leftArrow = document.getElementById("previous-slide");

const logoContainer = document.getElementById("logo-container");
const barContainer = document.getElementById("bar-container");
const progressBar = document.getElementById("progress-bar");
const logo = document.getElementById("logo");

// Remove invisible form element
const hiddenElements = document.getElementsByClassName("w-condition-invisible");
Array.from(hiddenElements).forEach(element => {
    element.parentNode.removeChild(element);
    });

// Add attributes to checkbox and radioinputs
for (let i = 0; i < slides.length; i++) {
    const slide = slides[i];

    // RADIOS
    const radioInputs = slide.querySelectorAll('input[type="radio"]');
    radioInputs.forEach(input => {
    input.setAttribute("data-name", `${i}`);
    input.setAttribute("name", `${i}`);
    text = input.parentNode.getElementsByClassName("w-form-label")[0].textContent;
    input.setAttribute("value", text); 
    });

    // CHECKBOXES
    const checkboxInputs = slide.querySelectorAll('input[type="checkbox"]');
    checkboxInputs.forEach(input => {
    let value = input.parentNode.getElementsByClassName("w-form-label")[0].textContent;
    input.setAttribute("data-name", value);
    input.setAttribute("name", value);
    input.setAttribute("value", value);
    });

    // NUMBER INPUTS
    slide.querySelector("input[type='number']")?.setAttribute("data-name", `${i}`);
    slide.querySelector("input[type='number']")?.setAttribute("name", `${i}`);
}


function getCurrentSlideIndex() {
    const currentSlide = document.querySelector(".w-slide:not([aria-hidden])");
    return parseInt(currentSlide.getAttribute("aria-label").split(" ")[0]);
}


// Show logo if feedback slide
const feedbackSlides = [4, 12, 15, 16, 20, 23, 25, 26, 32, 33, 34, 35, 36, 37];
function changeHeader() {
    const currentSlideIndex = getCurrentSlideIndex();
    if (feedbackSlides.includes(currentSlideIndex)) {
        
        // display logo
        logo.style.display = 'block';
        title.style.display = 'none';
        progressBar.style.display = 'none';

        // change header color
        document.querySelector('body').style.backgroundColor = "#f6f4ef";
        document.querySelector('#form-header').style.borderColor = "#D4D4D2";
        document.querySelector('#form-header').style.borderWidth = "0px 0px 1px 0px"
    } else {
        logo.style.display = 'none';
        title.style.display = 'block';
        progressBar.style.display = 'block';

        document.querySelector('body').style.backgroundColor = "#ffffff";
        document.querySelector('#form-header').style.borderWidth = "0px 0px 0px 0px"
    }
}
// Initially put the logo
changeHeader();

function changeTitle(title) {
    document.getElementById("title").innerHTML = title;
}

function updateLoadingBar() {
    const currentSlideIndex = getCurrentSlideIndex();
    // Between 1-13 : 50 - 75% -> 13 ELEMENTS
    const percentage = Math.round(
        0 + currentSlideIndex * 100 / 37
    )
    document.getElementById('loading-bar').setAttribute("style",`display:flex;width:${percentage}%`);
    document.getElementById('loading-bar').style.width=`${percentage}%`;
}

// Initialize loading bar
updateLoadingBar();

function submitForm() {
    console.log("Submitting Form...");
    document.forms[0].submit();
};

// Automate next slide
const goToNextSlide = function() {
    let currentSlideIndex = getCurrentSlideIndex();
    if (currentSlideIndex == slides.length) {
        console.log("Submitting Form...");
        submitForm();
        return;
    } else {
        rightArrow.click();
    };
    updateLoadingBar();
    changeHeader();

};

    // Automate next slide
const goToPreviousSlide = function() {
    const currentSlideIndex = getCurrentSlideIndex() - 1;
    if (currentSlideIndex == 0) {
    return ;
    } else {
        leftArrow.click();
    }
    updateLoadingBar();
    changeHeader();
};


// Add event listeners to buttons
$('.next-button').on('click', function(){
    let error = "";
    const inputs = $('input:not([aria-hidden])');

    // Checkboxes
    const checkboxes = $(inputs).filter('[type="checkbox"]').toArray();
    if (checkboxes.length > 0 && !checkboxes.some((el) => $(el).is(':checked'))) {
          error = "Please choose at least one checkbox!";
    }
    
    // Number Inputs
    const numberInputs = $(inputs).filter('[type="number"]').toArray();
    if (numberInputs.length > 0 && numberInputs.some((el) => $(el).val() < 0)) {
        error = "Please enter a positive number";
    } else if (numberInputs.length > 0 && numberInputs.some((el) => $(el).val() == "")) {
        error = "Please enter a number";
    }

    const textInputs = $(inputs).filter('[type="text"]').toArray();
    if (textInputs.length > 0 && textInputs.some((el) => $(el).val() == "")) {
        error = "Please fill in the blank";
    }

    error? alert(error) : goToNextSlide();
});

$('.previous-button').on('click', function(){
    goToPreviousSlide(this);
});

$('input[type="radio"]').on('tap', function(){
    goToNextSlide();
    this.checked = true;
});

// Add conditions
$('input[type="number"]').attr("min", "0");

// Focus on next if enter is clicked
const numberInputs = document.querySelectorAll('input[type="number"]');
numberInputs.forEach(input => {
    input.addEventListener("keypress", (e) => checkKey(e, input));
    input.addEventListener("input", (e) => validateNumberInput(e, input));
    let nextButton = input.parentNode.parentNode.getElementsByTagName("a")[0];
    nextButton.style.backgroundColor = "#dfdfdf";
    nextButton.setAttribute("disabled", "disabled");
});

function validateNumberInput(e, input) {
    let nextButton = input.parentNode.parentNode.getElementsByTagName("a")[0];
    if (input.value === '') {
    nextButton.style.backgroundColor = "#dfdfdf";
    nextButton.setAttribute("disabled", "disabled");
    } else {
    nextButton.style.backgroundColor = "#0b2889";
    nextButton.removeAttribute("disabled");
    }
}
function checkKey(e, input) {
    if (e.key == "Enter") {
    goToNextSlide();
    }
};

// Post function
async function postRequest(url, data) {
    const response = await fetch(url, {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(data)});
}

function sendSlack(submitted, email) {
    let data = {
        userName: email,
        warningType: 'QUIZ 2',
        warningContent: submitted? 'Someone submitted the second form!' : 'Someone went to the final question!',
        emoji: ':ghost:',
        redirectUrl: 'https://www.moonalisa.co',
    };
    postRequest(slackUrl, data);
}

// Function to change the title based on the current slide
function changeTitle(title) {
    document.getElementById("title").innerHTML = title;
}

// Function to update the title based on the current slide
function updateTitle() {
    const currentSlideIndex = getCurrentSlideIndex();
    if (currentSlideIndex >= 10) {
        changeTitle("Sleep Profile");
    } else {
        changeTitle("Demographic Profile");
    }
}

// Add an event listener to update the title when the slide changes
sliderContainer.addEventListener("transitionend", updateTitle);

// Initialize the title based on the initial slide
updateTitle();

// Function to hide the arrow on the first slide
function hideArrowOnFirstSlide() {
    const currentSlideIndex = getCurrentSlideIndex();
    const arrowElement = document.getElementById("previous-button");
    
    if (currentSlideIndex === 1 ) { // Check if it's the first slide
        arrowElement.style.display = "none"; // Hide the arrow
    } else {
        arrowElement.style.display = "block"; // Show the arrow for other slides
    }
}

// Add an event listener to check and hide the arrow when the slide changes
sliderContainer.addEventListener("transitionend", hideArrowOnFirstSlide);

// Initialize the arrow visibility based on the initial slide
hideArrowOnFirstSlide();

// Add attributes to checkbox and radioinputs
for (let i = 0; i < slides.length; i++) {
    const slide = slides[i];

    // RADIOS
    const radioInputs = slide.querySelectorAll('input[type="radio"]');
    radioInputs.forEach((input, index) => {
        input.setAttribute("data-name", `${i}`);
        input.setAttribute("name", `${i}`);
        input.setAttribute("value", index ); // Setting numerical values
    });

}

// Function to calculate the sleep score based on user choices from slides 5 to 11
function calculateSleepScore() {
    const scoreElements = document.querySelectorAll('input[type="radio"]:checked');
    let sleepScore = 0;

    // Adjust the index range to slides 5 to 11 (inclusive)
    if (getCurrentSlideIndex() >= 5 && getCurrentSlideIndex() <= 11) {
        scoreElements.forEach(element => {
            // Adjust the scoring logic based on specific choices
            const choiceValue = parseInt(element.value);

            // Ensure that the choiceValue is a number and within the expected range
            if (!isNaN(choiceValue) && choiceValue >= 0 && choiceValue <= 4) {
                sleepScore += choiceValue;
            }
        });

        console.log("Sleep score calculated: ", sleepScore);
    }

    return sleepScore;
}

// Function to update the sleep score display on slide 12
function updateSleepScoreDisplay() {
    const currentSlideIndex = getCurrentSlideIndex();
    const sleepScore = calculateSleepScore();
    const sleepScoreDisplay = document.getElementById("sleep-score-display");

    if (sleepScoreDisplay && currentSlideIndex === 12) {
        sleepScoreDisplay.textContent = `${sleepScore}`;
        console.log("Sleep score display updated with: ", sleepScore);
    }
}

// Add an event listener to calculate and update the sleep score when the slide changes
sliderContainer.addEventListener("transitionend", function () {
    console.log("Slide transition detected");
    const currentSlideIndex = getCurrentSlideIndex();
    
    // Check if the current slide is within the range of slides for calculating the sleep score
    if (currentSlideIndex >= 5 && currentSlideIndex <= 11) {
        updateSleepScoreDisplay();
    }
});


// Post function
async function postRequest(url, data) {
    try {
        return await fetch(url, {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(data)});
    } catch (error) {
        return error;
    }
}

function sendSlack(submitted, email) {
    const slackUrl = "https://europe-west1-test-firebase-1240d.cloudfunctions.net/postSlackMessage";
    let data = {
        userName: email,
        warningType: 'QUIZ',
        warningContent: submitted? 'Someone submitted the Stellar Sleep form!' : 'Someone went to the final question!',
        emoji: '🐶',
        redirectUrl: 'https://www.moonalisa.co',
    };
    postRequest(slackUrl, data);
}
// After email input
$('.email-next-button').on('click', validateEmailForm);

function validateEmailForm() {
    const formPushUrl = "https://europe-west1-test-firebase-1240d.cloudfunctions.net/sleepQuiz";

    // Check for errors
    let error = "";
    const inputs = $('input:not([aria-hidden])');
    const emailInputs = $(inputs).filter('[type="email"]').toArray();
    if (emailInputs.length > 0 && !emailInputs.some((el) => $(el).val().indexOf('@') !== -1 && $(el).val().indexOf('.') !== -1)) {
        error = "Please enter a valid email";
    }
    // If not error -> submit form
    if (!error) {
        sendSlack(true, emailInputs[0].value);
        try {
            navigator.sendBeacon(formPushUrl, JSON.stringify({sheet: 1, data: {"email": emailInputs[0].value}}));
        } catch (err) {
            console.log(err);
        }
        error = "";
        goToNextSlide(this);
    }
     
     else {
     alert(error);
     }
}
const lottieSrc = "https://lottie.host/186d5b64-22b9-4c26-9068-8d0b40cbef57/UC2tpZmJA6.json"

// Just before last view : progress bar animation
$('#lottie-container').html(`<lottie-player autoplay mode="normal" speed=1 style="width: 400px"></lottie-player>`);
$('#final-button').on('click', function() {
    // Display animation container
    let loaderContainer = document.getElementById("final-progress");
    loaderContainer.style.display = 'block';
   // Hide the previous arrow
    leftArrow.style.display = 'none';

    
    // Play animation
    const player = document.querySelector("lottie-player");
    player.load(lottieSrc);
    setTimeout(() => {
        loaderContainer.style.display = 'none';
        leftArrow.style.display = 'block'; // Show the previous arrow
        goToNextSlide(); // Call the function to go to the next slide
    }, 15000);
})
