from flask import Flask, request, render_template

UPLOAD_FOLDER = 'static/uploads'

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Routes

# Home view (index)
@app.route('/', methods=['GET'])
def index():
    if request.method == 'GET':
        return render_template('index.html')
    
# New post form
@app.route('/add_post', methods=['GET'])
def add_post():
    if request.method == 'GET':
        return render_template('add_post.html')

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


# Execute application
if __name__ == '__main__':
    app.run(debug=True)
