```python
import unittest
from unittest import mock
from flask import Flask, url_for
from app import app, get_db, init_db, get_shipping_options, userform, search_product, content_details, fetch_products
import sqlite3

# Mocking external API calls
@mock.patch('app.requests.get')
class TestApp(unittest.TestCase):

    def setUp(self):
        app.config['TESTING'] = True
        self.app = app.test_client()
        self.app.testing = True
        init_db()


    @mock.patch('app.requests.get')
    def test_get_shipping_options(self, mock_get):
        mock_get.return_value.json.return_value = [
            {'id': 1, 'name': 'Standard'},
            {'id': 2, 'name': 'Custom'}
        ]
        response = self.app.get('/shipping_options')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json, [
            {'id': 1, 'name': 'Standard'},
            {'id': 2, 'name': 'Custom'}
        ])


    @mock.patch('app.requests.get')
    def test_userform_post(self, mock_get):
        mock_get.return_value.json.return_value = [
            {'id': 1, 'name': 'Standard'},
            {'id': 2, 'name': 'Custom'}
        ]
        with app.test_request_context():
            with self.app:
                response = self.app.post('/userform', data={'name': 'Test', 'email': 'test@example.com', 'address': '123 Main St', 'city': 'Anytown', 'state': 'CA', 'zip_code': '90210', 'shipping': '1'})
                self.assertEqual(response.status_code, 302) #redirect

    def test_userform_post_no_shipping(self, mock_get):
        mock_get.return_value.json.return_value = [{'id': 1, 'name': 'Standard'}]
        with app.test_request_context():
            with self.app:
                response = self.app.post('/userform', data={'name': 'Test', 'email': 'test@example.com', 'address': '123 Main St', 'city': 'Anytown', 'state': 'CA', 'zip_code': '90210'})
                self.assertEqual(response.status_code, 302) #redirect
                self.assertIn(b'Please select a shipping option.', response.data)

    @mock.patch('app.requests.get')
    def test_userform_post_invalid_shipping(self, mock_get):
        mock_get.return_value.json.return_value = [{'id': 1, 'name': 'Standard'}]
        with app.test_request_context():
            with self.app:
                response = self.app.post('/userform', data={'name': 'Test', 'email': 'test@example.com', 'address': '123 Main St', 'city': 'Anytown', 'state': 'CA', 'zip_code': '90210', 'shipping': '3'})
                self.assertEqual(response.status_code, 302)  # redirect
                self.assertIn(b'Invalid shipping option selected.', response.data)


    @mock.patch('app.fetch_products')
    def test_search_product_found(self, mock_fetch_products):
        mock_fetch_products.return_value = [{'id': 1, 'name': 'Test Product'}]
        response = self.app.get('/search?q=test')
        self.assertEqual(response.status_code, 302)

    @mock.patch('app.fetch_products')
    def test_search_product_not_found(self, mock_fetch_products):
        mock_fetch_products.return_value = [{'id': 1, 'name': 'Test Product'}]
        response = self.app.get('/search?q=notfound')
        self.assertEqual(response.status_code, 404)
        self.assertEqual(response.data.decode(), "Product not found.")

    @mock.patch('app.fetch_products')
    def test_search_product_empty_query(self, mock_fetch_products):
        mock_fetch_products.return_value = [{'id': 1, 'name': 'Test Product'}]
        response = self.app.get('/search?q=')
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.data.decode(), "Please enter a valid search query.")

    @mock.patch('app.fetch_products')
    def test_content_details_found(self, mock_fetch_products):
        mock_fetch_products.return_value = [{'id': 1, 'name': 'Test Product'}]
        response = self.app.get('/contentDetails/1')
        self.assertEqual(response.status_code, 200)

    @mock.patch('app.fetch_products')
    def test_content_details_not_found(self, mock_fetch_products):
        mock_fetch_products.return_value = [{'id': 1, 'name': 'Test Product'}]
        response = self.app.get('/contentDetails/2')
        self.assertEqual(response.status_code, 404)
        self.assertEqual(response.data.decode(), "Product not found.")

    def test_get_db(self):
        db = get_db()
        self.assertIsInstance(db, sqlite3.Connection)
        self.assertEqual(db.cursor().execute('SELECT name FROM sqlite_master WHERE type="table"').fetchone()[0], 'users')

    def tearDown(self):
        with app.app_context():
            db = get_db()
            db.execute('DELETE FROM users')
            db.commit()

if __name__ == '__main__':
    unittest.main()
```