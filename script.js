/*  GREETING */

function greeting() {
    const currDate = new Date();
    const hours = currDate.getHours();
    let greet = "";
    if (hours >= 5 && hours <= 11)
        greet = "Good Morning! 🌅 ";
    else if (hours >= 12 && hours <= 16)
        greet = "Good Afternoon! ☀️";
    else if (hours >= 17 && hours <= 20)
        greet = "Good Evening! 🌇";
    else
        greet = "Good Night! 🌃";
    document.querySelector(".greeting-text").innerHTML = greet;
}
greeting();


/* CLOCK */

function updateClock() {

    const now = new Date();

    let hours = now.getHours();
    let minutes = now.getMinutes();
    let seconds = now.getSeconds();

    const amPm = hours >= 12 ? "PM" : "AM";

    hours = hours % 12;
    hours = hours ? hours : 12;

    hours = String(hours).padStart(2, "0");
    minutes = String(minutes).padStart(2, "0");
    seconds = String(seconds).padStart(2, "0");

    document.getElementById("digital-clock").innerHTML =
        `${hours}:${minutes}:${seconds} ${amPm}`;

}

updateClock();
setInterval(updateClock, 1000);


/* DATE */

document.getElementById("date").innerHTML =
    new Date().toDateString();


/* LOAD FROM LOCAL STORAGE */

let goals =
    JSON.parse(localStorage.getItem("goals")) || [];

let completedScore =
    JSON.parse(localStorage.getItem("completedScore")) || 0;


/* DAILY RESET */

function checkNewDay() {

    const today = new Date().toDateString();

    const savedDate =
        localStorage.getItem("savedDate");

    if (savedDate !== today) {

        goals = [];
        completedScore = 0;

        localStorage.setItem("savedDate", today);

        saveToStorage();

    }

}

checkNewDay();


/* SAVE TO LOCAL STORAGE */

function saveToStorage() {

    localStorage.setItem(
        "goals",
        JSON.stringify(goals)
    );

    localStorage.setItem(
        "completedScore",
        JSON.stringify(completedScore)
    );

}


/* ADD GOAL */

function addGoal() {

    const inputElement =
        document.querySelector(".goal-input");

    const value =
        inputElement.value.trim();

    if (value === "")
        return;

    goals.push(value);

    inputElement.value = "";

    saveToStorage();

    renderGoals();

}


/* DELETE GOAL */

function deleteGoal(index) {

    goals.splice(index, 1);

    completedScore++;

    saveToStorage();

    renderGoals();

}


/* PRODUCTIVITY CARD */

function updateProductivity() {

    const remainingScore =
        goals.length;

    const totalScore =
        remainingScore + completedScore;

    let percentage = 0;

    if (totalScore > 0) {

        percentage =
            (completedScore / totalScore) * 100;

    }

    document.querySelector(".total").textContent =
        totalScore;

    document.querySelector(".completed").textContent =
        completedScore;

    document.querySelector(".remain").textContent =
        remainingScore;

    document.querySelector(".percent").textContent =
        `${percentage.toFixed(0)}%`;
    
    document.querySelector(".progress-bar").style.width = `${percentage}%`;

    const bar = document.querySelector(".progress-bar");

    if(percentage < 30){

       bar.style.background="#ef4444";

    }
    else if(percentage < 70){

        bar.style.background="#f59e0b";

    }
    else{

        bar.style.background="#22c55e";

    }
    let message="";

    if(percentage==0)
        message="Let's get started! 🚀";

    else if(percentage<50)
        message="Nice beginning! 🌱";

    else if(percentage<80)
        message="Halfway there! 💪";

    else if(percentage<100)
        message="Almost done! 🔥";

    else
        message="Amazing! 🎉";

    document.querySelector(".message").textContent = message;
}


/* RENDER GOALS */

function renderGoals() {

    let goalsHTML = "";

    for (let i = 0; i < goals.length; i++) {

        goalsHTML += `

        <div class="goal">

            <p class="goal-text">
                ${goals[i]}
            </p>

            <button
                class="delete-button"
                onclick="deleteGoal(${i})">

                DONE

            </button>

        </div>

        `;

    }

    document.querySelector(".goal-list").innerHTML =
        goalsHTML;

    updateProductivity();

}


/* INITIAL RENDER */

renderGoals();

async function getQuote(){

    try{

        const response =
            await fetch("https://dummyjson.com/quotes/random");

        if(!response.ok){

    throw new Error("Failed to fetch quote.");

}
        const data =
            await response.json();

        document.querySelector(".quote").textContent =
            data.quote;

        document.querySelector(".author").textContent =
            `— ${data.author}`;

    }

    catch(error){

        console.log(error);

    }

}

getQuote();

/* WEATHER (SURAT) */

const weatherCodes = {
    0: "☀️ Clear Sky",
    1: "🌤️ Mainly Clear",
    2: "⛅ Partly Cloudy",
    3: "☁️ Overcast",
    45: "🌫️ Fog",
    48: "🌫️ Dense Fog",
    51: "🌦️ Light Drizzle",
    53: "🌦️ Moderate Drizzle",
    55: "🌧️ Heavy Drizzle",
    61: "🌧️ Light Rain",
    63: "🌧️ Moderate Rain",
    65: "🌧️ Heavy Rain",
    71: "❄️ Light Snow",
    73: "❄️ Snow",
    75: "❄️ Heavy Snow",
    80: "🌦️ Rain Showers",
    81: "🌦️ Heavy Showers",
    82: "⛈️ Violent Showers",
    95: "⛈️ Thunderstorm"
};

async function getWeather() {

    try {

        const response = await fetch(
            "https://api.open-meteo.com/v1/forecast?latitude=21.1702&longitude=72.8311&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code"
        );

        if (!response.ok) {

            throw new Error("Failed to fetch weather.");

        }

        const data = await response.json();

        const current = data.current;

        document.querySelector(".weather-temp").textContent =
            `${Math.round(current.temperature_2m)}°C`;

        document.querySelector(".humidity").textContent =
            `${current.relative_humidity_2m}%`;

        document.querySelector(".wind").textContent =
            `${current.wind_speed_10m} km/h`;

        document.querySelector(".weather-condition").textContent =
            weatherCodes[current.weather_code] || "🌍 Unknown Weather";

    }

    catch(error){

        console.error(error);

        document.querySelector(".weather-condition").textContent =
            "Unable to load weather";

    }

}

getWeather();

/* DAILY LANDSCAPE */

function fetchLandscape() {

    // Same image for the whole day
    const imageURL =
        `https://picsum.photos/1200/700?random=${new Date().getDate()}`;

    document.getElementById("landscape-img").src =
        imageURL;

}

// Load image when page opens
fetchLandscape();


/* SURPRISE ME BUTTON */

document.getElementById("new-image-btn")
.addEventListener("click", () => {

    const imageURL =
        `https://picsum.photos/1200/700?random=${Date.now()}`;

    document.getElementById("landscape-img").src =
        imageURL;

});

/* DARK MODE */

const themeBtn = document.querySelector(".theme-btn");

const savedTheme =
    localStorage.getItem("theme");

if (savedTheme === "dark") {

    document.body.classList.add("dark");

    themeBtn.textContent = "☀️";

}

else {

    themeBtn.textContent = "🌙";

}

themeBtn.addEventListener("click", () => {

    document.body.classList.toggle("dark");

    if (document.body.classList.contains("dark")) {

        themeBtn.textContent = "☀️";

        localStorage.setItem("theme", "dark");

    }

    else {

        themeBtn.textContent = "🌙";

        localStorage.setItem("theme", "light");

    }

});