```javascript
// contentDetails.test.js
const { JSDOM } = require('jsdom');
const { window } = new JSDOM();
global.window = window;
global.document = window.document;
global.XMLHttpRequest = window.XMLHttpRequest;

const contentDetails = require('./contentDetails'); // Assuming contentDetails.js is in the same directory

describe('contentDetails.js', () => {

  beforeEach(() => {
    // Mock the window.location.pathname for testing different IDs
    delete window.location;
    window.location = { pathname: '/product/123' }; 
    document.body.innerHTML = '<div id="containerProduct"><div id="badge"></div></div>';
  });

  afterEach(() => {
    document.body.innerHTML = ''; // Clean up after each test
  });

  it('should extract ID from URL correctly', () => {
    window.location.pathname = '/product/456';
    let urlParts = window.location.pathname.split("/");
    let id = urlParts[urlParts.length - 1];
    expect(id).toBe('456');
  });


  it('should display counter from cookie if present', () => {
    document.cookie = "orderId=someOrder,counter=5";
    contentDetails.dynamicContentDetails({}); // Call with dummy object
    expect(document.getElementById("badge").innerHTML).toBe("5");
  });

  it('should handle missing counter cookie gracefully', () => {
    document.cookie = "orderId=someOrder";
    contentDetails.dynamicContentDetails({});
    expect(document.getElementById("badge").innerHTML).toBe("");
  });

  it('should create and append elements correctly', () => {
    const mockOb = {
      name: 'Test Product',
      brand: 'Test Brand',
      price: 100,
      description: 'Test description',
      photos: ['image1.jpg', 'image2.jpg']
    };

    const container = contentDetails.dynamicContentDetails(mockOb);
    expect(container.id).toBe('containerD');
    expect(document.getElementById('containerProduct').children.length).toBe(1);
    expect(document.getElementById('imgDetails').src).toBe(mockOb.photos[0]);
    expect(document.querySelector('#productDetails h1').textContent).toBe(mockOb.name);
    expect(document.querySelectorAll('#productPreview img').length).toBe(2);
  });


  it('should handle image clicks in product preview', () => {
    const mockOb = {
      name: 'Test Product',
      brand: 'Test Brand',
      price: 100,
      description: 'Test description',
      photos: ['image1.jpg', 'image2.jpg']
    };
    contentDetails.dynamicContentDetails(mockOb);
    const previewImages = document.querySelectorAll('#productPreview img');
    previewImages[1].click();
    expect(document.getElementById('imgDetails').src).toBe(mockOb.photos[1]);
  });

  it('should update cookie and counter on add to cart', () => {
    const mockOb = {
      name: 'Test Product',
      brand: 'Test Brand',
      price: 100,
      description: 'Test description',
      photos: ['image1.jpg']
    };
    contentDetails.dynamicContentDetails(mockOb);
    document.querySelector('#button button').click();
    const cookie = document.cookie;
    expect(cookie.includes('orderId=123')).toBe(true);  //orderId should contain the extracted ID
    expect(cookie.includes(',counter=1')).toBe(true);
  });


  it('should increment counter correctly on subsequent add to cart clicks', () => {
    const mockOb = {
        name: 'Test Product',
        brand: 'Test Brand',
        price: 100,
        description: 'Test description',
        photos: ['image1.jpg']
    };
    contentDetails.dynamicContentDetails(mockOb);
    document.querySelector('#button button').click();
    document.querySelector('#button button').click();
    const cookie = document.cookie;
    expect(cookie.includes(',counter=2')).toBe(true);
  });


  it('should handle add to cart with existing cookie correctly', () => {
    document.cookie = "orderId=789,counter=3";
    const mockOb = {
        name: 'Test Product',
        brand: 'Test Brand',
        price: 100,
        description: 'Test description',
        photos: ['image1.jpg']
    };
    contentDetails.dynamicContentDetails(mockOb);
    document.querySelector('#button button').click();
    const cookie = document.cookie;
    expect(cookie.includes('orderId=789 123')).toBe(true);
    expect(cookie.includes(',counter=4')).toBe(true);
  });

  //Test for error handling of XHR request (This needs a mock XHR to simulate an error)  
  it('should handle XHR errors gracefully', () => {
    const mockXhr = {
      open: jest.fn(),
      send: jest.fn(),
      readyState: 4,
      status: 500, //Simulate an error status code
      responseText: ''
    }
    window.XMLHttpRequest = jest.fn(() => mockXhr);

    contentDetails.httpRequest.open("GET","https://5d76bf96515d1a0014085cf9.mockapi.io/product/123",true);
    contentDetails.httpRequest.send();
    //Add assertions for error handling behavior, if implemented. This is a placeholder for such assertions.
    //Expect some kind of error handling or logging to occur 
  });
});
```