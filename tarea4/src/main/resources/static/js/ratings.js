const API_URL = 'http://localhost:5001/api';

// Gets all ratings for specific listing fromt he api
const fetchListingRatings = async (listingId) => {
    try {
        const response = await fetch(`${API_URL}/listings/${listingId}/ratings`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const ratings = await response.json();
        return ratings;
    } catch (error) {
        console.error(`Error fetching ratings for listing ${listingId}:`, error);
        return [];
    }
}


// Submits a new rating for a listing and validates the rating, 1-7 as integer
const submitRating = async (listingId, nota) => {
    // Validate rating is an integer between 1 and 7
    if (!Number.isInteger(nota) || nota < 1 || nota > 7 || ![1,2,3,4,5,6,7].includes(nota)) {
        throw new Error('La calificación debe ser un número entero entre 1 y 7');
    }
    
    try {
        const response = await fetch(`${API_URL}/listings/${listingId}/ratings`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ nota: nota })
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error(`Error submitting rating for listing ${listingId}:`, error);
        throw error;
    }
}

// Helper function to calculate the average rating 
const calculateAverage = (ratings) => {
    if (!ratings || ratings.length === 0) {
        return null;
    }
    
    const sum = ratings.reduce((acc, rating) => acc + rating.nota, 0);
    const average = sum / ratings.length;
    
    // Returns rounded to 1 decimal place
    return average.toFixed(1);
}

// Updates the displayed rating for a specific listing
const updateListingRating = async (listingId, ratingElement) => {
    const ratings = await fetchListingRatings(listingId);
    const average = calculateAverage(ratings);
    
    if (average !== null) {
        ratingElement.textContent = average;
    } else {
        ratingElement.textContent = '-';
    }
}

// Loads and displays ratings for all listings
const loadAllRatings = async () => {
    const ratingCells = document.querySelectorAll('.rating-cell');
    
    for (const cell of ratingCells) {
        const row = cell.closest('tr');
        const listingId = row.querySelector('.table-cell').textContent.trim();
        const ratingDisplay = cell.querySelector('div');
        
        await updateListingRating(listingId, ratingDisplay);
    }
}

// Helper function to open the rating modal
const showRatingModal = async (listingId, ratingDisplay) => {
    const modal = document.getElementById('rating-modal');
    const ratingButtons = document.querySelectorAll('.rating-option');
    const errorElement = document.getElementById('rating-error');
    
    // Clear any previous error messages
    if (errorElement) {
        errorElement.style.display = 'none';
        errorElement.textContent = '';
    }
    
    // Remove previous event listeners
    ratingButtons.forEach(button => {
        const newButton = button.cloneNode(true);
        button.parentNode.replaceChild(newButton, button);
    });
    
    // Add new event listeners
    document.querySelectorAll('.rating-option').forEach(button => {
        button.addEventListener('click', async function() {
            const ratingValue = this.dataset.rating;
            const errorElement = document.getElementById('rating-error');
            
            // Validate the value is exactly an integer string before parsing
            if (!/^[1-7]$/.test(ratingValue)) {
                if (errorElement) {
                    errorElement.textContent = 'Valor de calificación inválido';
                    errorElement.style.display = 'block';
                }
                return;
            }
            const nota = parseInt(ratingValue);
            
            try {
                await submitRating(listingId, nota);
                await updateListingRating(listingId, ratingDisplay);
                closeModal();
            } catch (error) {
                if (errorElement) {
                    errorElement.textContent = 'Error al enviar la calificación. Por favor, intenta nuevamente.';
                    errorElement.style.display = 'block';
                }
            }
        });
    });
    
    modal.style.display = 'flex';
}

// Helper function to close the rating modal
const closeModal = () => {
    const modal = document.getElementById('rating-modal');
    modal.style.display = 'none';
}

// Load ratings when page is ready
document.addEventListener('DOMContentLoaded', function() {
    loadAllRatings();
    
    // Add event listeners to all Evaluar buttons
    document.querySelectorAll('.evaluar-btn').forEach(button => {
        button.addEventListener('click', function() {
            const row = this.closest('tr');
            const listingId = row.querySelector('.table-cell').textContent.trim();
            const ratingDisplay = row.querySelector('.rating-cell div');
            
            showRatingModal(listingId, ratingDisplay);
        });
    });
    
    // Close modal when clicking the close button
    const closeBtn = document.querySelector('.modal-close-text');
    if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
    }
    
    // Close modal when clicking outside
    const modal = document.getElementById('rating-modal');
    if (modal) {
        modal.addEventListener('click', function(event) {
            if (event.target === modal) {
                closeModal();
            }
        });
    }
});


