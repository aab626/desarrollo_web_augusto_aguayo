from flask import Flask, request, render_template, redirect, url_for
from database import db
from utils.validations import validate_listing
from werkzeug.utils import secure_filename
import hashlib
import filetype
from pathlib import Path
import utils.fieldnames.new_listing as listingFields

UPLOAD_FOLDER = 'static/uploads'
LISTINGS_IN_INDEX = 5

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = Path(UPLOAD_FOLDER)

# Routes

# Home view (index)
@app.route('/', methods=['GET'])
def index():
    if request.method == 'GET':
        last_listings = db.get_last_listings(LISTINGS_IN_INDEX)
        last_listings_photo = {l.get('id'): db.get_first_photo_by_listing_id(l.get('id')) for l in last_listings}
        return render_template('index.html', listings=last_listings, photo_dict=last_listings_photo)
    
# New post form
@app.route('/new_listing', methods=['GET'])
def new_listing():
    if request.method == 'GET':
        return render_template('new_listing.html',
                               regions_data=db.get_regions_data()
                               )
    
# POST method that receives a form, tries to validate and save it into the db
@app.route('/add_listing', methods=['POST'])
def add_listing():
    print('FORM:', request.form)
    print('FILES:', request.files)
    if validate_listing(request.form, request.files):
        img_filenames = []
        for field, upload in request.files.items():
            if not upload or not upload.filename:
                continue

            _filename = hashlib.sha256(secure_filename(upload.filename).encode('utf-8')).hexdigest()
            _extension = filetype.guess(upload).extension
            img_filename = f'{_filename}.{_extension}'

            # Save image into file system
            upload.save(app.config['UPLOAD_FOLDER'] / img_filename)
            img_filenames.append(img_filename)

        # Store listing, photos and contact methods into db
        new_listing_id = db.create_listing(request.form)
        for img_filename in img_filenames:
            db.create_photo(app.config['UPLOAD_FOLDER'], img_filename, new_listing_id)

        for field_method, field_id in listingFields.FIELD_CONTACT_INPUTS:
            contact_method_value = request.form.get(field_method)
            if not contact_method_value:
                break

            db.create_contact_method(contact_method_value, request.form.get(field_id), new_listing_id)

    # After processing, redirect to index
    return redirect(url_for("index"))

# List posts
@app.route('/listings', methods=['GET'])
def listings():
    if request.method == 'GET':
        return render_template('listings.html')

# Statistics (placeholder)
@app.route('/statistics', methods=['GET'])
def statistics():
    if request.method == 'GET':
        return render_template('statistics.html')
    

@app.route('/test', methods=['GET'])
def test_id(id=None):
    return "test"

# Execute application
if __name__ == '__main__':
    app.run(debug=True)
