```python
import unittest
import sqlite3

class TestSchema(unittest.TestCase):

    def setUp(self):
        self.conn = sqlite3.connect(':memory:')
        cursor = self.conn.cursor()
        cursor.execute('''
            CREATE TABLE users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                email TEXT NOT NULL,
                address TEXT NOT NULL,
                city TEXT NOT NULL,
                state TEXT NOT NULL,
                zip_code TEXT NOT NULL,
                shipping TEXT NOT NULL
            );
        ''')
        self.conn.commit()

    def tearDown(self):
        self.conn.close()

    def test_table_creation(self):
        cursor = self.conn.cursor()
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='users';")
        table_exists = cursor.fetchone()
        self.assertIsNotNone(table_exists)

    def test_column_names(self):
        cursor = self.conn.cursor()
        cursor.execute("PRAGMA table_info(users);")
        columns = cursor.fetchall()
        expected_columns = {
            'id', 'name', 'email', 'address', 'city', 'state', 'zip_code', 'shipping'
        }
        actual_columns = {col[1] for col in columns}
        self.assertEqual(actual_columns, expected_columns)

    def test_column_types(self):
        cursor = self.conn.cursor()
        cursor.execute("PRAGMA table_info(users);")
        columns = cursor.fetchall()
        expected_types = {
            'id': 'INTEGER', 'name': 'TEXT', 'email': 'TEXT', 'address': 'TEXT',
            'city': 'TEXT', 'state': 'TEXT', 'zip_code': 'TEXT', 'shipping': 'TEXT'
        }
        actual_types = {col[1]: col[2] for col in columns}
        self.assertEqual(actual_types, expected_types)

    def test_primary_key(self):
        cursor = self.conn.cursor()
        cursor.execute("PRAGMA table_info(users);")
        columns = cursor.fetchall()
        primary_key_column = next((col for col in columns if col[5] == 1), None)
        self.assertIsNotNone(primary_key_column)
        self.assertEqual(primary_key_column[1], 'id')

    def test_not_null_constraints(self):
        cursor = self.conn.cursor()
        cursor.execute("PRAGMA table_info(users);")
        columns = cursor.fetchall()
        not_null_columns = {col[1] for col in columns if col[3]}
        expected_not_null = {'name', 'email', 'address', 'city', 'state', 'zip_code', 'shipping'}
        self.assertEqual(not_null_columns, expected_not_null)

    def test_autoincrement(self):
        cursor = self.conn.cursor()
        cursor.execute("PRAGMA table_info(users);")
        columns = cursor.fetchall()
        autoincrement_column = next((col for col in columns if col[1] == 'id'),None)
        self.assertTrue(autoincrement_column[5] ==1) # Check if the 6th column has the value 1 which implies AUTOINCREMENT



if __name__ == '__main__':
    unittest.main()
```