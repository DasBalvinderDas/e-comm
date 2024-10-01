import requests
from flask import Flask, g, render_template, request, flash, jsonify, redirect, url_for
import sqlite3

app = Flask(__name__)
app.secret_key = 'your_secret_key'  # Replace with a strong secret key

# Path to the SQLite database
DATABASE = 'users.db'

# Function to get a database connection
def get_db():
    db = getattr(g, '_database', None)
    if db is None:
        db = g._database = sqlite3.connect(DATABASE)
    return db

# Function to close the database connection after each request
@app.teardown_appcontext
def close_connection(exception):
    db = getattr(g, '_database', None)
    if db is not None:
        db.close()

# Initialize the database with a schema
def init_db():
    with app.app_context():
        db = get_db()
        with app.open_resource('schema.sql', mode='r') as f:
            db.cursor().executescript(f.read())
        db.commit()

# Command to initialize the database
@app.cli.command('initdb')
def initdb_command():
    """Initializes the database."""
    init_db()
    print('Initialized the database.')

# API route to get shipping options
@app.route('/shipping_options')
def get_shipping_options():
    """API endpoint to return shipping options."""
    shipping_options = [
        {'id': 0, 'name': 'Standard'},
        {'id': 2, 'name': 'Express'}
    ]
    return jsonify(shipping_options)

# Home route serving the main index.html
@app.route('/')
def home():
    return render_template('index.html')

# User form route handling both GET and POST requests
@app.route('/userform', methods=['GET', 'POST'])
def userform():
    if request.method == 'POST':
        # Collect user form data
        name = request.form['name']
        email = request.form['email']
        address = request.form['address']
        city = request.form['city']
        state = request.form['state']
        zip_code = request.form['zip_code']

        # Fetch shipping options from the API
        response = requests.get(url_for('get_shipping_options', _external=True))
        
        # Print the response status and content for debugging
        print(response.status_code)
        print(response.text)

        shipping_options = response.json()

        # Get the selected shipping option ID from the form
        selected_shipping_id = int(request.form.get('shipping', 0))

        # Find the matching shipping method by ID
        selected_shipping_method = next(
            (option['name'] for option in shipping_options if option['id'] == selected_shipping_id),
            None
        )
        print(selected_shipping_method)
        
        # Insert user details and selected shipping option into the database
        conn = get_db()
        cursor = conn.cursor()
        cursor.execute(
            'INSERT INTO users (name, email, address, city, state, zip_code, shipping)'
            ' VALUES (?, ?, ?, ?, ?, ?, ?)',
            (name, email, address, city, state, zip_code, selected_shipping_method)
        )
        conn.commit()
        conn.close()

        # Flash success message and redirect back to the form
        flash('User details added successfully!', 'success')
        return redirect(url_for('userform'))

    return render_template('userform.html')

# Fetch product list from mock API
def fetch_products():
    response = requests.get('https://5d76bf96515d1a0014085cf9.mockapi.io/product')
    return response.json()

# Search for a product by name and return the product's ID
@app.route('/search', methods=['GET'])
def search_product():
    query = request.args.get('q', '').lower()  # Get search query from request
    if not query:
        return "Please enter a valid search query.", 400
    
    products = fetch_products()  # Fetch the products from the mock API
    for product in products:
        if query in product['name'].lower():  # Search for product by name (case-insensitive)
            product_id = product['id']
            # Redirect to the existing content_details route
            return redirect(url_for('content_details', id=product_id))

    return "Product not found.", 404  # If no product found, return 404

# Original content details route for a static ID-based view
@app.route('/contentDetails/<int:id>')
def content_details(id):
    print(f"ID passed to content_details route: {id}")
    return render_template('contentDetails.html', item_id=id)

# Route to display order placed page
@app.route('/orderPlaced')
def order_placed():
    return render_template('orderPlaced.html')

# Serve the header, footer, and other content pages
@app.route('/header')
def header():
    return render_template('header.html')

@app.route('/footer')
def footer():
    return render_template('footer.html')

@app.route('/slider')
def slider():
    return render_template('slider.html')

@app.route('/content')
def content():
    return render_template('content.html')

# Additional routes for clothing, accessories, and cart pages
@app.route('/clothing')
def clothing():
    return render_template('clothing.html')

@app.route('/accessories')
def accessories():
    return render_template('accessories.html')

@app.route('/cart')
def cart():
    return render_template('cart.html')

# Main application entry point
if __name__ == '__main__':
    app.run(debug=True)