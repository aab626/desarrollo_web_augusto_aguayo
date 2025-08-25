// Constants
const DEFAULT_OPTION_REGION = "--- SELECCIONE REGIÓN ---";
const DEFAULT_OPTION_COMMUNE = "--- SELECCIONE COMUNA ---";
const DEFAULT_OPTION_CONTACT_METHOD = '--- SELECCIONE MÉTODO ---';
const CONTACT_METHODS = [DEFAULT_OPTION_CONTACT_METHOD, 'WhatsApp', 'Telegram', 'X', 'Instagram', 'TikTok', 'Otra'];
const PET_TYPES = ["perro", "gato"];
const PET_AGE_UNITS = ['meses', 'annos'];
const MIN_DELIVERY_TIME = new Date(Date.now() + (3 * 60 * 60 * 1000));;

// Fetch region/commune data
let regionSelect = document.getElementById("form-region-select");
let communeSelect = document.getElementById("form-commune-select");

let regionsDataURL = 'https://gist.githubusercontent.com/juanbrujo/0fd2f4d126b3ce5a95a7dd1f28b3d8dd/raw/b8575eb82dce974fd2647f46819a7568278396bd/comunas-regiones.json'
let regionsData = null;

fetch(regionsDataURL)
    .then(response => response.json())
    .then(data => {
        regionsData = data.regiones;

        // Place region options
        let option = document.createElement('option');
        option.textContent = DEFAULT_OPTION_REGION;
        option.value = "";
        option.disabled = true;
        option.selected = true;
        regionSelect.appendChild(option);

        regionsData.forEach(region => {
            option = document.createElement('option');
            option.textContent = region.region;
            option.value = region.region;
            regionSelect.appendChild(option);
        });

        // Update commune options
        communeSelect.disabled = true;
        let startOption = document.createElement('option');
        startOption.textContent = DEFAULT_OPTION_REGION;
        startOption.value = "";
        startOption.disabled = true;
        startOption.selected = true;
        communeSelect.appendChild(startOption);

        regionSelect.addEventListener("change", (event) => {
            // Default selected
            communeSelect.innerHTML = '';
            let communes = regionsData.find((r) => {return r.region == event.target.value}).comunas;
            let option = document.createElement('option');
            option.textContent = DEFAULT_OPTION_COMMUNE;
            option.value = "";
            option.disabled = true;
            option.selected = true;
            communeSelect.appendChild(option);
        
            communes.forEach((commune) => {
                option = document.createElement('option');
                option.textContent = commune;
                option.value = commune;
                communeSelect.appendChild(option);
            });

            communeSelect.disabled = false;

        });

    })
    .catch(error => {
        console.error('Error al descargar data de regiones:', error);
    });

// Add contact method inputs
let contactMethodContainer = document.getElementById("form-contact-methods-container");
for (let i = 0; i < 5; i++) {
    // Contact Method container
    let div = document.createElement('div');
    div.className = 'contact-method-row';
    if (i > 0) {div.hidden = true;};
    div.id = `form-contact-method-${i}`;
    
    // Contact Method label
    let label = document.createElement('label');
    label.className = 'form-label';
    label.htmlFor = `form-contact-method-${i}-select`;
    label.textContent = `Método ${i+1}`;
    div.appendChild(label);

    // Contact Method select element
    let select = document.createElement('select');
    select.className = 'form-input';
    select.id = `form-contact-method-${i}-select`;
    select.name = `contact-method-${i}`;
    CONTACT_METHODS.forEach((contactMethod) => {
        let option = document.createElement('option');
        option.textContent = contactMethod;
        option.value = contactMethod;
        select.appendChild(option);
    });

    // Make first element (placeholder) unselectable
    select.childNodes[0].disabled = true;
    select.childNodes[0].selected = true;
    select.childNodes[0].value = '';

    // Hide/show the input field when a contact method is selected
    select.addEventListener('change', (event) => {
        let thisInput = document.getElementById(`form-contact-method-${i}-input`);
        thisInput.hidden = false;
    });

    div.appendChild(select);

    // Contact method input field
    let input = document.createElement('input');
    input.className = 'form-input';
    input.id = `form-contact-method-${i}-input`;
    input.name = `contact-id-${i}`;
    input.hidden = true;
    input.minLength = '4'
    input.maxLength = '50';
    input.placeholder = 'Número, ID o URL';
    input.required = i>0 ? false : true;
    div.appendChild(input);

    // Contact method plus/minus buttons container
    let divControls = document.createElement('div');
    divControls.className = 'contact-method-controls';
    divControls.id = `form-contact-method-${i}-controls`;
    div.appendChild(divControls);

    // Plus button, only for the first 4 contact methods
    if (i < 4) {
        let plusButton = document.createElement('button');
        plusButton.className = 'btn btn-small btn-add';
        plusButton.type = 'button';
        plusButton.textContent = '+';
        plusButton.id = `btn-method-${i}-plus`;
        divControls.appendChild(plusButton);
    }

    // Minus button, only for the last 4 contact methods
    if (i > 0) {
        let minusButton = document.createElement('button');
        minusButton.className = 'btn btn-small btn-remove';
        minusButton.type = 'button';
        minusButton.textContent = '-';
        minusButton.id = `btn-method-${i}-minus`;

        

        divControls.appendChild(minusButton);
    }
    
    contactMethodContainer.appendChild(div);
}

// After creating all contact method elements, add functionality to the plus/minus buttons
// Plus buttons
for (let i = 0; i < 4; i++) {
    plusButton = document.getElementById(`btn-method-${i}-plus`);
    plusButton.addEventListener('click', (event) => {
        // Show next method div
        let nextDiv = document.getElementById(`form-contact-method-${i + 1}`);
        nextDiv.hidden = false;

        // Hide this method div minus button
        if (i > 0) {
            let thisMinusButton = document.getElementById(`btn-method-${i}-minus`);
            thisMinusButton.hidden = true;
        }

        // Make next input field required
        let nextInput = document.getElementById(`form-contact-method-${i + 1}-input`);
        nextInput.required = true;
    });
}

// Minus buttons
for (let i = 1; i < 5; i++) {
    minusButton = document.getElementById(`btn-method-${i}-minus`);
    minusButton.addEventListener('click', (event) => {
        // Clean this contact method
        let thisSelect = document.getElementById(`form-contact-method-${i}-select`);
        let thisInput = document.getElementById(`form-contact-method-${i}-input`);

        thisSelect.value = '';
        thisInput.value = '';

        // Hide this div method and this input field
        let thisDiv = document.getElementById(`form-contact-method-${i}`);
        thisDiv.hidden = true;
        thisInput.hidden = true;

        // Make this input field not required
        thisInput.required = false

        // Show previous method div minus button
        if (i > 1) {
            let previousMinusButton = document.getElementById(`btn-method-${i-1}-minus`);
            previousMinusButton.hidden = false;
        }
    });
}

// Helper function to format local time as a string suitable for <input type="datetime-local"> fields (YYYY-MM-DDTHH:MM)
function formatLocalDateTime(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    
    return `${year}-${month}-${day}T${hours}:${minutes}`;
}

// Set the starting value of the delivery time field to now plus 3 hours
let deliveryTimeInput = document.getElementById('form-deliverytime');
// let timeStart = new Date(Date.now() + (3 * 60 * 60 * 1000));
deliveryTimeInput.value = formatLocalDateTime(MIN_DELIVERY_TIME);

// Add photo buttons
let photosContainer = document.getElementById("form-photos-container");
for (i = 0; i < 5; i++) {
    let div = document.createElement('div');
    div.className = 'photo-row';
    div.id = `form-photo-${i}`;
    div.hidden = i > 0 ? true : false;

    let label = document.createElement('label');
    label.className = 'form-label';
    label.htmlFor = `form-photo-${i}-input`;
    label.textContent = `Foto ${i+1}`;
    div.appendChild(label);

    let selectFileInput = document.createElement('input');
    selectFileInput.type = "file";
    selectFileInput.className = 'form-input photo-input';
    selectFileInput.id = `form-photo-${i}-input`;
    selectFileInput.name = `photo-${i}`;
    selectFileInput.accept = "image/*";
    div.appendChild(selectFileInput);

    if (i < 4) {
        let morePhotosButton = document.createElement('button');
        morePhotosButton.className = 'btn btn-secondary btn-small';
        morePhotosButton.id = `form-photo-${i}-more-button`;
        morePhotosButton.type = 'button';
        morePhotosButton.hidden = true;
        morePhotosButton.textContent = 'Agregar otra foto';
        div.appendChild(morePhotosButton);
    }

    photosContainer.appendChild(div);
}

// Add functionality to morePhotosButtons
for (let i = 0; i < 4; i++) {
    // Show/hide this divs more photos button based on selection
    let selectFileInput = document.getElementById(`form-photo-${i}-input`);
    selectFileInput.addEventListener('change', (event) => {
        let thisMorePhotosButton = document.getElementById(`form-photo-${i}-more-button`);
        thisMorePhotosButton.hidden = event.target.value == '' ? true : false;
    });

    // More photos button functionality
    let thisMorePhotosButton = document.getElementById(`form-photo-${i}-more-button`);
    thisMorePhotosButton.addEventListener('click', (event) => {
        // Show next container
        let nextPhotosDiv = document.getElementById(`form-photo-${i+1}`);
        nextPhotosDiv.hidden = false;

        // Hide this more photos button
        thisMorePhotosButton.hidden = true;
    });
}


// Helper function to append error messages in the form
const addErrorMsg = (errorMsg) => {
    let errorDiv = document.getElementById("form-error");
    let errorParagraph = document.createElement('p');

    errorParagraph.className = 'error-text';
    errorParagraph.textContent = errorMsg;
    errorDiv.appendChild(errorParagraph);
}

// Function that validates the form
const validateForm = () => {
    let validForm = true;

    // Clean previous error msg
    let errorDiv = document.getElementById('form-error');
    errorDiv.innerHTML = '';

    let erroredElements = document.querySelectorAll('.form-error-indicator');
    console.log(erroredElements);
    erroredElements.forEach(element => {
        element.classList.remove('form-error-indicator');
    });
    
    // Validate region
    let regionSelect = document.getElementById("form-region-select");
    if (!regionsData.map((r) => {return r.region;}).includes(regionSelect.value))  {
        addErrorMsg("Región inválida.")
        regionSelect.classList.add('form-error-indicator');
        validForm = false;
    }

    // Validate commune
    let allComunnes = regionsData.map((x) => { return x.comunas; }).flat();
    let communeSelect = document.getElementById("form-commune-select");
    if (!allComunnes.includes(communeSelect.value)) {
        addErrorMsg("Comuna inválida.")
        communeSelect.classList.add('form-error-indicator');
        validForm = false;
    }

    // Validate region-commune combination
    if (!regionsData.find((r) => { return r.region == regionSelect.value; }).comunas.includes(communeSelect.value)) {
        addErrorMsg("Comuna no pertenece a Región.")
        regionsData.classList.add('form-error-indicator');
        regionSelect.classList.add('form-error-indicator');
        validForm = false;
    }

    // Sector validation
    let sectorInput = document.getElementById("form-sector-input");
    if (sectorInput.value.length > 100) {
        addErrorMsg("Nombre de sector muy largo, no debe exceder 100 caractéres.")
        sectorInput.classList.add('form-error-indicator');
        validForm = false;
    }

    // Name validation
    let nameInput = document.getElementById("form-name");
    if (nameInput.value.length < 3 || nameInput.value.length > 200) {
        addErrorMsg("Nombre debe contener entre 3 y 200 caractéres.");
        nameInput.classList.add('form-error-indicator');
        validForm = false;
    }

    // Email validation
    let emailInput = document.getElementById("form-email");
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailInput.value.length == 0 || !emailRegex.test(emailInput.value)) {
        addErrorMsg("Email inválido.");
        emailInput.classList.add('form-error-indicator');
        validForm = false;
    }

    // Phone number validation
    let phoneInput = document.getElementById("form-phone");
    const phoneRegex = /^\+\d{3}\.\d{8}$/;
    if (!phoneRegex.test(phoneInput.value)) {
        addErrorMsg("Número de teléfono inválido.");
        phoneInput.classList.add('form-error-indicator');
        validForm = false;
    }

    // Contact method validation
    // At least one contact method must be present
    let contactMethod1Select = document.getElementById(`form-contact-method-0-select`);
    if (contactMethod1Select.value == "") {
        addErrorMsg("Al menos un método de contacto es necesario.");
        contactMethod1Select.classList.add('form-error-indicator');
        validForm = false;
    }

    // Validate ID/URL field
    for (let i = 0; i < 5; i++) {
        // Only validate shown contact methods
        let contactDiv = document.getElementById(`form-contact-method-${i}`);
        if (!contactDiv.hidden) {
            let inputField = document.getElementById(`form-contact-method-${i}-input`);
            if (inputField.value.length < 3 || inputField.value.length > 200) {
                addErrorMsg(`Método de contacto (${i+1}) inválido, debe contener entre 3 y 200 caractéres.`);
                inputField.classList.add('form-error-indicator');
                validForm = false;
            }
        }
    }

    // Pet type validation
    let petTypeSelect = document.getElementById('form-type');
    if (!PET_TYPES.includes(petTypeSelect.value)) {
        addErrorMsg("Tipo de mascota inválido.");
        petTypeSelect.classList.add('form-error-indicator');
        validForm = false;
    }

    // Pet quantity validation
    let petQuantity = document.getElementById("form-quantity");
    if (isNaN(petQuantity.value) || petQuantity.value < 1) {
        addErrorMsg("Cantidad de mascota inválida, debe ser un número mayor o igual a 1.");
        petQuantity.classList.add('form-error-indicator');
        validForm = false;
    }

    // Pet age quantity validation
    let petAgeQuantity = document.getElementById('form-age-quantity');
    if (isNaN(petAgeQuantity.value) || petAgeQuantity.value < 1) {
        addErrorMsg("Edad de mascota inválida, debe ser un número mayor o igual a 1.");
        petAgeQuantity.classList.add('form-error-indicator');
        validForm = false;
    }

    // Pet age unit validation
    let petAgeUnit = document.getElementById('form-age-units');
    if (!PET_AGE_UNITS.includes(petAgeUnit.value)) {
        addErrorMsg("Unidad de edad inválida.");
        petAgeUnit.classList.add('form-error-indicator');
        validForm = false;
    }

    // Delivery time validation
    let deliveryTimeInput = document.getElementById('form-deliverytime');
    let deliveryTime = new Date(deliveryTimeInput.value);
    if (deliveryTime < MIN_DELIVERY_TIME) {
        addErrorMsg(`Fecha de entrega inválida, debe ser despúes de: ${MIN_DELIVERY_TIME.toLocaleString()}`);
        deliveryTimeInput.classList.add('form-error-indicator');
        validForm = false;
    }

    // Description validation
    let description = document.getElementById("form-description");
    if (description.value.length < 30) {
        addErrorMsg(`Descripción muy corta, por favor comenta algo más de la mascota.`);
        description.classList.add('form-error-indicator');
        validForm = false;
    }

    // Photo upload validation
    let nPhotos = 0;
    for (let i = 0; i < 5; i++) {
        let photoDiv = document.getElementById(`form-photo-${i}`);
        let photoInput = document.getElementById(`form-photo-${i}-input`);

        if (!photoDiv.hidden && photoInput.files.length > 0) {
            nPhotos += 1;
            let file = photoInput.files[0];

            // Validate file type
            if (!file.type.startsWith('image/')) {
                addErrorMsg(`Foto ${i+1} inválida, debe ser una imágen.`);
                photoInput.classList.add('form-error-indicator');
                validForm = false;
            }
        }
    }

    // At least one photo to validate
    let photoDiv = document.getElementById('form-photos-container');
    if (nPhotos < 1) {
        addErrorMsg(`Ingresa al menos una foto.`)
        photoDiv.classList.add('form-error-indicator');
        validForm = false;
    }

    // All validations passed
    if (validForm) {
        return true;
    } else {
        let errorDiv = document.getElementById("form-error");
        errorDiv.hidden = false;
        return false
    }
        
};

// Assign event to submit button
let form = document.getElementById('form-newpost') ;
form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (validateForm()) {
        let errorDiv = document.getElementById("form-error");
        errorDiv.hidden = true;
        openModal();
    }
});


// Confirmation modal functions
const openModal = () => {
    let modal = document.getElementById("form-confirmation-modal");
    modal.hidden = false;
};

const closeModal = () => {
    let modal = document.getElementById("form-confirmation-modal");
    modal.hidden = true;
};

// Assign event to modal/post confirmation buttons
let modalYesButton = document.getElementById("btn-form-modal-yes");
let modalNoButton = document.getElementById("btn-form-modal-no");

modalYesButton.addEventListener("click", (event) => {
    // Close modal and hide error message
    closeModal();

    // Show success message
    let successDiv = document.getElementById("form-success");
    let successParagraph = document.getElementById("form-success-msg");
    
    successDiv.hidden = false;
    successParagraph.textContent = "Hemos recibido la información de adopción, muchas gracias y suerte!";

    // Show go back to index button
    let goBackButton = document.getElementById("form-btn-goback");
    goBackButton.hidden = false;
});

modalNoButton.addEventListener('click', (event) => {
    closeModal();
});

let goBackButton = document.getElementById("form-btn-goback");
goBackButton.addEventListener('click', (event) => {
    window.location.href = "index.html"
});