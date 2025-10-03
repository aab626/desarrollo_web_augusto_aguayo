// Make rows clickable, each one should redirect to the corresponding listing
let listingRows = document.querySelectorAll('.listing-row');
listingRows.forEach((element) => {
    element.addEventListener('click', (event) => {
        const listingId = element.dataset.listingId;
        if (listingId) {
            window.location.href = `/adoption_listing/${listingId}`
        }
    });
});