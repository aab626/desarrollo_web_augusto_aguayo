from database import db
import utils.fieldnames.new_listing as listingFields
import re
from datetime import datetime, timedelta
import filetype

# Constants
EMAIL_REGEX = re.compile(r'^[^\s@]+@[^\s@]+\.[^\s@]+$')
PHONE_REGEX = re.compile(r'^\+\d{3}\.\d{8}$')

VALID_PET_TYPES = ['gato', 'perro']
VALID_IMAGE_EXTENSIONS = ['png', 'jpg', 'jpeg', 'gif']
VALID_IMAGE_MIMETYPES = ['image/png', 'image/jpeg', 'image/gif']


# Validators
def validate_region(form):
    return form.get(listingFields.FIELD_REGION) in [r.nombre for r in db.get_all_regions()]


def validate_municipality(form):
    return form.get(listingFields.FIELD_MUNICIPALITY) in [m.nombre for m in db.get_all_municipalities_by_region_name(form.get(listingFields.FIELD_REGION))]


def validate_sector(form):
    return len(form.get(listingFields.FIELD_SECTOR)) <= 100


def validate_name(form):
    return 3 <= len(form.get(listingFields.FIELD_PERSON_NAME)) <= 100


def validate_email(form):
    return EMAIL_REGEX.fullmatch(form.get(listingFields.FIELD_PERSON_EMAIL))


def validate_phone(form):
    return PHONE_REGEX.fullmatch(form.get(listingFields.FIELD_PERSON_PHONE))


def validate_contact_method(form):
    # At least one contact method must be present and for every contact method present its contact id must be present
    contact_methods = 0
    for method_field, id_field in listingFields.FIELD_CONTACT_INPUTS:
        method_value = form.get(method_field)
        if not method_value:
            break
        
        contact_methods += 1
        id_value = form.get(id_field)
        if not id_value or not (3 <= len(id_value) <= 200):
            return False

    return contact_methods > 0


def validate_pet_type(form):
    return form.get(listingFields.FIELD_PET_TYPE) in VALID_PET_TYPES


def validate_pet_age(form):
    try:
        age = int(form.get(listingFields.FIELD_PET_AGE))
    except (TypeError, ValueError):
        return False
    
    return age > 1


def validate_delivery_time(form):
    delivery_value = form.get(listingFields.FIELD_DELIVERY_TIME)
    if not delivery_value:
        return False

    try:
        delivery_dt = datetime.fromisoformat(delivery_value)
    except (TypeError, ValueError):
        return False

    return delivery_dt > datetime.now() + timedelta(hours=3)

def validate_description(form):
    description_value = form.get(listingFields.FIELD_DESCRIPTION)
    if not description_value:
        return False
    
    return len(description_value) >= 30

def validate_images(files):
    images = 0
    for photo_field in listingFields.FIELDS_PHOTO:
        # At least one image must be uploaded (and valid)
        photo_value = files.get(photo_field)
        if not photo_value or not photo_value.filename:
            break

        images += 1
        
        # Check empty filename
        if photo_value.filename == '':
            return False
        
        # Check extension and mimetype
        ftype_guess = filetype.guess(photo_value)
        if not ftype_guess:
            return False
        
        if ftype_guess.extension not in VALID_IMAGE_EXTENSIONS:
            return False
        
        if ftype_guess.mime not in VALID_IMAGE_MIMETYPES:
            return False
        
    return images > 0


def validate_listing(form, files):
    form_validators = (
        validate_region,
        validate_municipality,
        validate_sector,
        validate_name,
        validate_email,
        validate_phone,
        validate_contact_method,
        validate_pet_type,
        validate_pet_age,
        validate_delivery_time,
        validate_description,
    )

    files_validators = (
        validate_images,
    )

    # Debugging
    failed_f = [fv.__name__ for fv in form_validators if not fv(form)]
    failed_i = [fv.__name__ for fv in files_validators if not fv(files)]
    if len(failed_f) > 0:
        print('Failed/F:', failed_f)
    if len(failed_i) > 0:
        print('Failed/I:', failed_i)

    return all(fv(form) for fv in form_validators) and all(fv(files) for fv in files_validators)
