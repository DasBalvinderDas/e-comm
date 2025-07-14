```javascript
// contentDetails.test.js
const { JSDOM } = require('jsdom');
const { window } = new JSDOM();
global.window = window;
global.document = window.document;
global.XMLHttpRequest = window.XMLHttpRequest;

const contentDetails = require('./contentDetails'); // Assuming contentDetails.js is in the same directory

describe('contentDetails', () => {
  beforeEach(() => {
    // Mock window.location.pathname for testing different IDs
    Object.defineProperty(window, 'location', {
      value: {
        pathname: '/product/123'
      },
      writable: true
    });
    document.cookie = ""; //clear cookies before each test
    document.body.innerHTML = '<div id="containerProduct"></div><span id="badge"></span>';

  });


  it('should extract ID from URL correctly', () => {
    Object.defineProperty(window, 'location', {
      value: {
        pathname: '/product/456'
      },
      writable: true
    });
    const urlParts = window.location.pathname.split("/");
    const id = urlParts[urlParts.length - 1];
    expect(id).toBe('456');
  });


  it('should display counter from cookie if exists', () => {
    document.cookie = "orderId=123,counter=5";
    contentDetails();
    expect(document.getElementById("badge").innerHTML).toBe("5");
  });

  it('should not display counter if cookie does not contain counter', () => {
    document.cookie = "orderId=123";
    contentDetails();
    expect(document.getElementById("badge").innerHTML).toBe("");
  });

  it('should create and append elements correctly in dynamicContentDetails', () => {
    const mockOb = {
      name: 'Test Product',
      brand: 'Test Brand',
      price: 100,
      description: 'This is a test product.',
      photos: ['image1.jpg', 'image2.jpg']
    };

    contentDetails.dynamicContentDetails(mockOb);

    expect(document.getElementById('containerD')).toBeDefined();
    expect(document.getElementById('imgDetails').src).toBe(mockOb.photos[0]);
    expect(document.getElementById('containerProduct').childElementCount).toBe(1);
    expect(document.querySelector('#productDetails h1').textContent).toBe(mockOb.name);
    expect(document.querySelectorAll('#productPreview img').length).toBe(2);
    expect(document.getElementById("button")).toBeDefined();
  });

  it('should handle click event on preview images', () => {
    const mockOb = {
      name: 'Test Product',
      brand: 'Test Brand',
      price: 100,
      description: 'This is a test product.',
      photos: ['image1.jpg', 'image2.jpg']
    };
    contentDetails.dynamicContentDetails(mockOb);
    const previewImages = document.querySelectorAll('#productPreview img');
    previewImages[1].click();
    expect(document.getElementById('imgDetails').src).toBe(mockOb.photos[1]);
  });


  it('should update cookie and counter on button click', () => {
    const mockOb = {
      name: 'Test Product',
      brand: 'Test Brand',
      price: 100,
      description: 'This is a test product.',
      photos: ['image1.jpg']
    };
    contentDetails.dynamicContentDetails(mockOb);
    document.querySelector('#button button').click();
    expect(document.cookie.includes('orderId=123')).toBe(true);
    expect(document.cookie.includes('counter=1')).toBe(true);
    expect(document.getElementById("badge").innerHTML).toBe("1");

    document.querySelector('#button button').click();
    expect(document.cookie.includes('counter=2')).toBe(true);
    expect(document.getElementById("badge").innerHTML).toBe("2");
  });

  it('should handle existing order in cookie', () => {
    document.cookie = "orderId=111,counter=3";
    const mockOb = {
      name: 'Test Product',
      brand: 'Test Brand',
      price: 100,
      description: 'This is a test product.',
      photos: ['image1.jpg']
    };
    contentDetails.dynamicContentDetails(mockOb);
    document.querySelector('#button button').click();
    expect(document.cookie.includes('orderId=111 123')).toBe(true);
    expect(document.cookie.includes('counter=4')).toBe(true);
  });


  it('should handle invalid counter in cookie', () => {
      document.cookie = "orderId=111,counter=abc";
      const mockOb = {
          name: 'Test Product',
          brand: 'Test Brand',
          price: 100,
          description: 'This is a test product.',
          photos: ['image1.jpg']
      };
      contentDetails.dynamicContentDetails(mockOb);
      document.querySelector('#button button').click();
      expect(document.cookie.includes('orderId=111 123')).toBe(true);
      expect(document.cookie.includes('counter=1')).toBe(true);
  });

  //Add more tests to cover edge cases and error handling  as needed.  For example, test what happens when the mock API call fails.

});

```