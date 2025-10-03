// Navigation buttons
let navBtnIndex = document.getElementById("btn-nav-inicio");
let navBtnAddPost = document.getElementById("btn-nav-addpost");
let navBtnListings = document.getElementById("btn-nav-listings");
let navBtnStatistics = document.getElementById("btn-nav-statistics");

// Event linking
navBtnIndex.addEventListener("click", (event) => {
    window.location.href = "/"
});

navBtnAddPost.addEventListener("click", (event) => {
    window.location.href = "/new_listing"
});

navBtnListings.addEventListener("click", (event) => {
    window.location.href = "/listings"
});

navBtnStatistics.addEventListener("click", (event) => {
    window.location.href = "/statistics"
});
