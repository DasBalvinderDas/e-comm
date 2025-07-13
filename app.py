from flask import Flask, g, render_template, request, flash, jsonify, redirect, url_for
import sqlite3
import requests

app = Flask(__name__)
app.secret_key = 'your_secret_key'  # Replace with a strong secret key

DATABASE = 'users.db'

def get_db():
    db = getattr(g, '_database', None)
    if db is None:
        db = g._database = sqlite3.connect(DATABASE)
    return db

@app.teardown_appcontext
def close_connection(exception):
    db = getattr(g, '_database', None)
    if db is not None:
        db.close()

def init_db():
    with app.app_context():
        db = get_db()
        with app.open_resource('schema.sql', mode='r') as f:
            db.cursor().executescript(f.read())
        db.commit()

@app.cli.command('initdb')
def initdb_command():
    """Initializes the database."""
    init_db()
    print('Initialized the database.')

@app.route('/shipping_options')
def get_shipping_options():
    """API endpoint to return shipping options."""
    shipping_options = [
        {'id': 1, 'name': 'Standard'},
        {'id': 2, 'name': 'Custom'}
    ]
   
    return jsonify(shipping_options)

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/userform', methods=['GET', 'POST'])
def userform():
    if request.method == 'POST':
        name = request.form['name']
        email = request.form['email']
        address = request.form['address']
        city = request.form['city']
        state = request.form['state']
        zip_code = request.form['zip_code']

        response = requests.get(url_for('get_shipping_options', _external=True))
        shipping_options = response.json()

        selected_shipping_id = request.form.get('shipping')
        if selected_shipping_id is None:
            flash('Please select a shipping option.', 'error')
            return redirect(url_for('userform'))
        selected_shipping_id = int(selected_shipping_id)

        selected_shipping_method = next(
            (option['name'] for option in shipping_options if option['id'] == selected_shipping_id),
            None
        )
        if selected_shipping_method is None:
            flash('Invalid shipping option selected.', 'error')
            return redirect(url_for('userform'))

        conn = get_db()
        cursor = conn.cursor()
        cursor.execute(
            'INSERT INTO users (name, email, address, city, state, zip_code, shipping)'
            ' VALUES (?, ?, ?, ?, ?, ?, ?)',
            (name, email, address, city, state, zip_code, selected_shipping_method)
        )
        conn.commit()
        #conn.close() # Connection is closed in teardown_appcontext

        flash('User details added successfully!', 'success')
        return redirect(url_for('userform'))

    return render_template('userform.html')

def fetch_products():
    response = requests.get('https://5d76bf96515d1a0014085cf9.mockapi.io/product')
    return response.json()

@app.route('/search', methods=['GET'])
def search_product():
    query = request.args.get('q', '').lower()
    if not query:
        return "Please enter a valid search query.", 400
    
    products = fetch_products()
    for product in products:
        if query in product['name'].lower():
            product_id = product['id']
            return redirect(url_for('content_details', id=product_id))

    return "Product not found.", 404

@app.route('/contentDetails/<int:id>')
def content_details(id):
    print(f"ID passed to content_details route: {id}")
    product = next((p for p in fetch_products() if p['id'] == id), None)
    if product is None:
        return "Product not found.", 404
    return render_template('contentDetails.html', item=product)

@app.route('/orderPlaced')
def order_placed():
    return render_template('orderPlaced.html')

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

@app.route('/clothing')
def clothing():
    return render_template('clothing.html')

@app.route('/accessories')
def accessories():
    return render_template('accessories.html')

@app.route('/cart')
def cart():
    return render_template('cart.html')

if __name__ == '__main__':
    app.run(debug=True)