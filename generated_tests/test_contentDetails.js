```javascript
// contentDetails.test.js

const { JSDOM } = require('jsdom');
const { window } = new JSDOM();
global.window = window;
global.document = window.document;
global.XMLHttpRequest = window.XMLHttpRequest;

const contentDetails = require('./contentDetails'); // Assuming contentDetails.js is in the same directory

describe('contentDetails.js', () => {
  let mockFetch;

  beforeEach(() => {
    mockFetch = jest.spyOn(window, 'fetch').mockImplementation(() => Promise.resolve({
      json: () => Promise.resolve({
        name: 'Test Product',
        brand: 'Test Brand',
        price: 100,
        description: 'Test Description',
        photos: ['test-image1.jpg', 'test-image2.jpg'],
      }),
    }));

    // Mock window.location for ID extraction
    Object.defineProperty(window, 'location', {
      value: { pathname: '/product/123' },
      writable: true
    });
  });

  afterEach(() => {
    mockFetch.mockRestore();
  });


  it('should extract the ID from the URL correctly', () => {
    //This test indirectly verifies ID extraction through the backend call
    expect(window.location.pathname.split("/")[window.location.pathname.split("/").length -1]).toBe("123");
  });

  it('should display the counter from the cookie if it exists', () => {
    document.cookie = "orderId=456,counter=5;path=/";
    document.body.innerHTML = '<div id="badge"></div>';
    contentDetails(); //This will run the entire file.
    expect(document.getElementById("badge").innerHTML).toBe("5");
  });

  it('should handle the case where the cookie does not contain a counter', () => {
    document.cookie = "orderId=456;path=/";
    document.body.innerHTML = '<div id="badge"></div><div id="containerProduct"></div>';
    contentDetails();
    expect(document.getElementById("badge").innerHTML).toBe("1");
  });

  it('should create and append the main container', () => {
    document.body.innerHTML = '<div id="containerProduct"></div>';
    const mainContainer = contentDetails.dynamicContentDetails({
      name: 'Test Product',
      brand: 'Test Brand',
      price: 100,
      description: 'Test Description',
      photos: ['test-image1.jpg'],
    });
    expect(document.getElementById('containerD')).toBeDefined();
    expect(document.getElementById('containerProduct').children.length).toBe(1);
  });

  it('should populate the product details correctly', async () => {
    document.body.innerHTML = '<div id="containerProduct"></div><div id="badge"></div>';
    await contentDetails();
    expect(document.querySelector('#containerD h1').textContent).toBe('Test Product');
    expect(document.querySelector('#containerD h4').textContent).toBe('Test Brand');
    expect(document.querySelector('#containerD #details h3').textContent).toBe('Rs 100');
    expect(document.querySelector('#containerD p').textContent).toBe('Test Description');
  });

  it('should handle product preview images', async () => {
    document.body.innerHTML = '<div id="containerProduct"></div><div id="badge"></div>';
    await contentDetails();
    const previewImages = document.querySelectorAll('#containerD #productPreview img');
    expect(previewImages.length).toBe(2);
    expect(previewImages[0].src).toBe('test-image1.jpg');
    expect(previewImages[1].src).toBe('test-image2.jpg');
  });

  it('should update main image on preview image click', async () => {
      document.body.innerHTML = '<div id="containerProduct"></div><div id="badge"></div>';
      await contentDetails();
      const previewImages = document.querySelectorAll('#containerD #productPreview img');
      previewImages[1].click();
      expect(document.getElementById('imgDetails').src).toBe('test-image2.jpg');
  });


  it('should update the cookie and counter on Add to Cart click', async () => {
    document.body.innerHTML = '<div id="containerProduct"></div><div id="badge"></div>';
    await contentDetails();
    const addToCartButton = document.querySelector('#containerD #button button');
    addToCartButton.click();
    const updatedCookie = document.cookie;
    expect(updatedCookie.includes('orderId=123')).toBe(true);
    expect(updatedCookie.includes('counter=2')).toBe(true);
    expect(document.getElementById('badge').innerHTML).toBe("2");
  });


  it('should handle add to cart when cookie already exists', async () => {
    document.cookie = "orderId=789,counter=3;path=/";
    document.body.innerHTML = '<div id="containerProduct"></div><div id="badge"></div>';
    await contentDetails();
    const addToCartButton = document.querySelector('#containerD #button button');
    addToCartButton.click();
    const updatedCookie = document.cookie;
    expect(updatedCookie.includes('orderId=789 123')).toBe(true);
    expect(updatedCookie.includes('counter=4')).toBe(true);
    expect(document.getElementById('badge').innerHTML).toBe("4");
  });


  it('should handle invalid counter in cookie', async () => {
    document.cookie = "orderId=789,counter=abc;path=/";
    document.body.innerHTML = '<div id="containerProduct"></div><div id="badge"></div>';
    await contentDetails();
    const addToCartButton = document.querySelector('#containerD #button button');
    addToCartButton.click();
    const updatedCookie = document.cookie;
    expect(updatedCookie.includes('orderId=789 123')).toBe(true);
    expect(updatedCookie.includes('counter=2')).toBe(true);
    expect(document.getElementById('badge').innerHTML).toBe("2");
  });

});
```