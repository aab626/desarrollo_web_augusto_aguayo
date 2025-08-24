// Navigation buttons
let navBtnIndex = document.getElementById("btn-nav-inicio");
let navBtnAddPost = document.getElementById("btn-nav-addpost");
let navBtnListings = document.getElementById("btn-nav-listings");
let navBtnStatistics = document.getElementById("btn-nav-statistics");

// Event linking
navBtnIndex.addEventListener("click", (event) => {
    window.location.href = "index.html"
});

navBtnAddPost.addEventListener("click", (event) => {
    window.location.href = "newpost.html"
});

navBtnListings.addEventListener("click", (event) => {
    window.location.href = "listings.html"
});

navBtnStatistics.addEventListener("click", (event) => {
    window.location.href = "statistics.html"
});