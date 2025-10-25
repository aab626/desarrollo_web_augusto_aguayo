from flask import Flask, request, render_template, redirect, url_for, jsonify
from database import db
from utils.validations import validate_listing, validate_comment
from werkzeug.utils import secure_filename
import hashlib
import filetype
from pathlib import Path
import utils.fieldnames.new_listing as listingFields
import locale


UPLOAD_FOLDER = 'static/uploads'
LISTINGS_IN_INDEX = 5
LISTINGS_PER_PAGE = 5

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = Path(UPLOAD_FOLDER)

# Set locale to Chilean Spanish
locale.setlocale(locale.LC_ALL, 'es_CL.UTF-8')


# Routes

# Home view (index)
@app.route('/', methods=['GET'])
def index():
    if request.method == 'GET':
        try:
            listing_success = bool(int(request.args.get('listing_success')))
        except (ValueError, TypeError):
            listing_success = False

        last_listings = db.get_last_listings(LISTINGS_IN_INDEX)
        last_listings_photo = {l.id: db.get_first_photo_by_listing_id(l.id) for l in last_listings}
        return render_template('index.html.j2', listings=last_listings, photo_dict=last_listings_photo, listing_success=listing_success)
    
# New post form
@app.route('/new_listing', methods=['GET'])
def new_listing():
    if request.method == 'GET':
        return render_template('new_listing.html.j2',
                               regions_data=db.get_regions_data(),
                               failed_form={},
                               failed_files={},
                               failed_validations=[],
                               disable_selected_default=False
                               )
    
# POST method that receives a form, tries to validate and save it into the db
@app.route('/add_listing', methods=['GET', 'POST'])
def add_listing():
    if request.method == 'POST':
        valid_status, failed_validations = validate_listing(request.form, request.files)
        if valid_status:
            img_filenames = []
            for _field, upload in request.files.items():
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

            # After processing, redirect to index indicating a success in the operation
            return redirect(url_for('index', listing_success=1))
        
        # If not valid, show errors along with the form
        else:
            # print('FORM:', request.form)
            # print('FILES:', request.files)
            # print("valid status:", valid_status)
            # print('failed:', failed_validations)
            return render_template('new_listing.html.j2', 
                            regions_data=db.get_regions_data(),
                            failed_form=request.form.to_dict(),
                            failed_files={k: v.filename for k, v in request.files.items() if v and v.filename},
                            failed_validations=failed_validations,
                            disable_selected_default=True
                            )
    
    elif request.method == 'GET':
        return render_template('new_listing.html.j2', regions_data=db.get_regions_data())

# List posts
@app.route('/listings', methods=['GET'])
def listings():
    if request.method == 'GET':
        try:
            page = int(request.args.get('page', 1))
        except Exception:
            page = 1
        
        page_data = db.get_listings_by_page(page, LISTINGS_PER_PAGE)
        return render_template('listings.html.j2', page_data=page_data)

# Statistics (placeholder)
@app.route('/statistics', methods=['GET'])
def statistics():
    if request.method == 'GET':
        return render_template('statistics.html.j2')\
        

@app.route('/adoption_listing/<int:listing_id>', methods=['GET'])
def listing(listing_id: int):
    # if request.method == 'POST':
    #     valid_status, failed_validations = validate_comment(request.form)
    #     if valid_status:
    #         db.create_comment(listing_id, request.form)
    #         return redirect(url_for('listing', listing_id=listing_id))
        
    #     # If not valid
    #     else:
    #         listing_data = db.get_listing_by_id(listing_id)
    #         return render_template('listing.html.j2', 
    #             listing=listing_data,
    #             failed_form=request.form.to_dict(),
    #             failed_files={k: v.filename for k, v in request.files.items() if v and v.filename},
    #         )
    

    if request.method == 'GET':
        listing_data = db.get_listing_by_id(listing_id)
        return render_template('listing.html.j2', listing=listing_data)
    

# Statistics API
@app.route('/statistics/per-day', methods=['GET'])
def statistics_per_day():
    try:
        data = db.get_statistics_by_day()
        return jsonify({"status": "ok", "data": data})
    except Exception:
        return jsonify({"status": "error", "data": []})
    

@app.route('/statistics/per-type', methods=['GET'])
def statistics_per_type():
    try:
        data = db.get_statistics_by_type()
        return jsonify({'status': 'ok', 'data': data})
    except Exception:
        return jsonify({"status": "error", "data": []})
    

@app.route('/statistics/per-month', methods=['GET'])
def statistics_per_month():
    try:
        data = db.get_statistics_monthly_by_type()
        return jsonify({'status': 'ok', 'data': data})
    except Exception:
        return jsonify({"status": "error", "data": []})


@app.route('/comments/<int:listing_id>', methods=['GET'])
def get_comments_by_listing_id(listing_id):
    try:
        data = db.get_comments(listing_id)
        return jsonify({'status': 'ok', 'data': data})
    except Exception:
        return jsonify({"status": "error", "data": []})
    
@app.route('/comments/<int:listing_id>', methods=['POST'])
def add_comment(listing_id):
    if request.method == 'POST':
        valid_status, failed_validations = validate_comment(request.get_json())
        print(valid_status, failed_validations)
        if valid_status:
            try:
                db.create_comment(listing_id, request.get_json())
                return jsonify(
                    {
                        'status': 'ok', 
                        'message': 'Comment added succesfully.'
                    }
                )
            except Exception as e:
                return jsonify(
                    {
                        'status': 'error',
                        'message': f'{e}'
                    }
                ), 500
        else:
            return jsonify(
                {
                    'status': 'error', 
                    'message': 'Validation failed',
                    'errors': failed_validations
                }
            ), 400

# @app.route('/test', methods=['GET'])
# def test_id(id=None):
#     return render_template('test.html.j2')

# Execute application
if __name__ == '__main__':
    app.run(debug=True)
