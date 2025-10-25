const formatDate = (date) => {
    const months = [
        'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
        'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
    ];

    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${day} de ${month} de ${year}, ${hours}:${minutes}`;
};

const container = document.getElementById('comments-container');
const addComment = (nameText, dateText, textText) => {
    let div = document.createElement('div');
    div.className = 'comment';

    let header = document.createElement('div');
    header.className = 'comment-header';
    div.appendChild(header);

    let name = document.createElement('p');
    name.className = 'comment-name';
    name.textContent = nameText;
    header.appendChild(name);

    let date = document.createElement('p');
    date.className = 'comment-date';
    date.textContent = dateText;
    header.appendChild(date);

    let contents = document.createElement('div');
    contents.className = 'comment-contents';
    div.appendChild(contents)

    let text = document.createElement('p');
    text.className = 'comment-text';
    text.textContent = textText;
    contents.appendChild(text);

    container.appendChild(div);
}

// Show existing comments
const listingIdFromURL = (new URL(window.location.href)).pathname.split('/').pop();
console.log(`${window.origin}/comments/${listingIdFromURL}`);

fetch(`${window.origin}/comments/${listingIdFromURL}`)
.then((response) => {
    if (!response.ok) {
        throw new Error('Error de la respuesta de red.');
    }

    return response.json();
})
.then((data) => {
    data.data.forEach(element => {
        addComment(element.nombre, element.fecha, element.texto);
    });
});

// Handle comment submission
const form = document.getElementById('comment-form');
const nombreInput = document.getElementById('form-comment-nombre');
const textoInput = document.getElementById('form-comment-texto');
const btn = document.getElementById('form-btn-submit');
const listingId = form.dataset.listingId || listingIdFromURL;
const errorsDiv = document.getElementById('comment-errors-container');

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    errorsDiv.innerHTML = '';
    errorsDiv.hidden = true;
    
    // Validations
    const nombre = nombreInput.value.trim();
    const texto = textoInput.value.trim();
    const listingId = form.dataset.listingId;
    const errors = [];

    if (nombre.length < 3 || nombre.length > 80) {
        errors.push('El nombre debe tener entre 3 y 80 caracteres.');
    }
    if (texto.length < 5 || texto.length > 300) {
        errors.push('El comentario debe tener entre 5 y 300 caracteres.');
    }

    if (errors.length == 0) {
        fetch(`${window.origin}/comments/${listingId}`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({nombre, texto})
        })
        .then((response) => {
            if (!response.ok) {
                throw new Error('Error de la respuesta de la red.');
            }
    
            return response.json();
        })
        .then((data) => {
            if (data.status == 'ok') {
                const dateStr = formatDate(new Date());
                addComment(nombre, dateStr, texto);
            } else {
                console.error('Error al agregar comentario.')
            }
        })
        .catch((error) => {
            console.error(error);
        });

        // Finally, clear form
        nombreInput.value = '';
        textoInput.value = '';
    }

    // Display validation errors
    errors.forEach((error) => {
        let p = document.createElement('p');
        p.className = 'comment-error';
        p.textContent = error;
        errorsDiv.appendChild(p);
        errorsDiv.hidden = false;
    })
});
