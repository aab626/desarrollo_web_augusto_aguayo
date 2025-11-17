const FLASK_URL = 'http://localhost:5000';
const SPRING_URL = 'http://localhost:5001';

// Navigation buttons
let navBtnIndex = document.getElementById("btn-nav-inicio");
let navBtnAddPost = document.getElementById("btn-nav-addpost");
let navBtnListings = document.getElementById("btn-nav-listings");
let navBtnStatistics = document.getElementById("btn-nav-statistics");
let navBtnRate = document.getElementById("btn-nav-rate");

// Event linking - Navigate to Flask pages
navBtnIndex.addEventListener("click", (event) => {
    window.location.href = FLASK_URL + "/"
});

navBtnAddPost.addEventListener("click", (event) => {
    window.location.href = FLASK_URL + "/new_listing"
});

navBtnListings.addEventListener("click", (event) => {
    window.location.href = FLASK_URL + "/listings"
});

navBtnStatistics.addEventListener("click", (event) => {
    window.location.href = FLASK_URL + "/statistics"
});

// Navigate to Spring Boot rating page
navBtnRate.addEventListener("click", (event) => {
    window.location.href = SPRING_URL + "/rate_listings"
});
