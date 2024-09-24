from flask import Flask, render_template

app = Flask(__name__)

# Serve the main index.html file
@app.route('/')
def home():
    return render_template('index.html')

# Serve the header.html file
@app.route('/header')
def header():
    return render_template('header.html')

# Serve the slider.html file
@app.route('/slider')
def slider():
    return render_template('slider.html')

# Serve the content.html file
@app.route('/content')
def content():
    return render_template('content.html')

# Serve the footer.html file
@app.route('/footer')
def footer():
    return render_template('footer.html')

# Add the route for clothing
@app.route('/clothing')
def clothing():
    return render_template('clothing.html')

# Add other necessary routes
@app.route('/accessories')
def accessories():
    return render_template('accessories.html')

# Add the cart route
@app.route('/cart')
def cart():
    return render_template('cart.html')

if __name__ == '__main__':
    app.run(debug=True)