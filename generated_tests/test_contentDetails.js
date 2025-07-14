```javascript
// contentDetails.test.js
const { JSDOM } = require('jsdom');

// Mock the XMLHttpRequest object for testing purposes.
global.XMLHttpRequest = jest.fn(() => ({
  open: jest.fn(),
  send: jest.fn(),
  readyState: 4, // Simulate ready state 4
  status: 200, // Simulate successful response
  responseText: JSON.stringify({
    "id": 1,
    "name": "Product 1",
    "brand": "Brand A",
    "price": 19.99,
    "description": "This is a sample product.",
    "photos": ["image1.jpg", "image2.jpg"]
  })
}));


describe('contentDetails.js', () => {

  let dom;
  beforeEach(() => {
    dom = new JSDOM(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Test</title>
        </head>
        <body>
          <div id="containerProduct"></div>
          <span id="badge"></span>
        </body>
      </html>
    `);
    global.window = dom.window;
    global.document = dom.window.document;
    global.window.location = { pathname: '/product/123' }; // Mock the URL for ID extraction

  });


  afterEach(() => {
      global.window = undefined;
      global.document = undefined;
  });


  it('should extract ID from URL', () => {
    const urlParts = window.location.pathname.split("/");
    const id = urlParts[urlParts.length - 1];
    expect(id).toBe('123');
  });


  it('should display counter from cookie if available', () => {
    document.cookie = "orderId=abc,counter=5;path=/";
    const script = require('./contentDetails'); // Assuming contentDetails.js is in the same directory
    expect(document.getElementById('badge').innerHTML).toBe('5');

  });

  it('should not display counter if cookie is missing', () => {
    const script = require('./contentDetails');
    expect(document.getElementById('badge').innerHTML).toBe('');
  });

  it('should create and append elements correctly in dynamicContentDetails', () => {
    const mockObject = {
      "id": 1,
      "name": "Product 1",
      "brand": "Brand A",
      "price": 19.99,
      "description": "This is a sample product.",
      "photos": ["image1.jpg", "image2.jpg"]
    };
    const container = dynamicContentDetails(mockObject);

    expect(container.id).toBe('containerD');
    expect(container.querySelector('#imgDetails').src).toBe('image1.jpg');
    expect(container.querySelector('h1').textContent).toBe('Product 1');
    expect(container.querySelector('h4').textContent).toBe('Brand A');
    expect(container.querySelector('#details h3:first-of-type').textContent).toBe('Rs 19.99');
    expect(container.querySelector('#details p').textContent).toBe('This is a sample product.');
    expect(container.querySelectorAll('#productPreview img').length).toBe(2);
  });

  it('should handle button click and update cookie correctly', () => {
    const mockObject = {
      "id": 1,
      "name": "Product 1",
      "brand": "Brand A",
      "price": 19.99,
      "description": "This is a sample product.",
      "photos": ["image1.jpg", "image2.jpg"]
    };
    dynamicContentDetails(mockObject);
    const button = document.querySelector('#button button');
    button.click();

    //Difficult to directly test cookie manipulation,  assertions would depend on how you are accessing the cookie in your testing environment
    //Instead of testing the cookie directly, you can test the side effects, such as the counter update.
    expect(document.getElementById('badge').innerHTML).toBe('1'); //check counter updated
    // Add more assertions based on your cookie manipulation
  });

  it('should handle preview image clicks', () => {
      const mockObject = {
          "id": 1,
          "name": "Product 1",
          "brand": "Brand A",
          "price": 19.99,
          "description": "This is a sample product.",
          "photos": ["image1.jpg", "image2.jpg"]
      };
      dynamicContentDetails(mockObject);
      const previewImages = document.querySelectorAll('#productPreview img');
      previewImages[1].click(); // Click the second preview image
      expect(document.getElementById('imgDetails').src).toBe('image2.jpg');
  });


  it('should handle network errors gracefully', () => {
    // Mock a failed request
    global.XMLHttpRequest = jest.fn(() => ({
      open: jest.fn(),
      send: jest.fn(),
      readyState: 4,
      status: 500,
      responseText: ''
    }));
    const script = require('./contentDetails'); // Rerun script with mocked request
    expect(console.log).toHaveBeenCalledWith("not connected!"); // Check for error message
  });
});


const dynamicContentDetails = require('./contentDetails').dynamicContentDetails; // Assuming dynamicContentDetails is exported

```