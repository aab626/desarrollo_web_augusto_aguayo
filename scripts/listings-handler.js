// Add click functionality to table rows
let tableRows = document.querySelectorAll('.table-row');
tableRows.forEach(row => {
    row.addEventListener('click', (event) => {
        window.location.href = 'post.html';
    });
});
