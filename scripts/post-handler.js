// Image modal functions
const openImageModal = (imageSrc, imageAlt) => {
    let modal = document.getElementById("imageModal");
    let modalImage = document.getElementById("modalImage");
    
    modalImage.src = imageSrc;
    modalImage.alt = imageAlt;
    modal.hidden = false;
};

const closeImageModal = () => {
    let modal = document.getElementById("imageModal");
    modal.hidden = true;
};

// Add event listeners to photo thumbnails
let thumbnails = document.querySelectorAll('.photo-thumbnail');
thumbnails.forEach(thumbnail => {
    thumbnail.addEventListener('click', (event) => {
        let fullsizeUrl = event.target.getAttribute('data-fullsize');
        let altText = event.target.getAttribute('alt');
        openImageModal(fullsizeUrl, altText);
    });
});

// Add event listeners to close elements
let closeElements = document.querySelectorAll('.modal-close');
closeElements.forEach(element => {
    element.addEventListener('click', (event) => {
        closeImageModal();
    });
});


// Page footer buttons
let footerListingsButton = document.getElementById('btn-footer-nav-listings');
let footerIndexButton = document.getElementById('btn-footer-nav-index');


footerListingsButton.addEventListener("click", (event) => {
    window.location.href = "listings.html";
});

footerIndexButton.addEventListener("click", (event) => {
    window.location.href = "index.html";
});
