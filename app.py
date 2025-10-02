from flask import Flask, request, render_template, redirect, url_for, jsonify
from database import db
from utils.validations import validate_listing

UPLOAD_FOLDER = 'static/uploads'
LISTINGS_IN_INDEX = 5

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Routes

# Home view (index)
@app.route('/', methods=['GET'])
def index():
    if request.method == 'GET':
        listings = db.get_last_listings(LISTINGS_IN_INDEX)
        return render_template('index.html', listings=listings)
    
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
    print(request.form)
    if validate_listing(request.form):
        print('form ok!')


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
