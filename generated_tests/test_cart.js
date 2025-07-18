```javascript
// cart.test.js
const { JSDOM } = require('jsdom');
const { window } = new JSDOM();
global.document = window.document;
global.window = window;
global.XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest; // for mocking

const cart = require('./cart'); // Assuming your file is named cart.js

describe('cart.js', () => {


  describe('dynamicCartSection', () => {
    it('should create and append elements correctly', () => {
      const ob = { preview: 'image.jpg', name: 'Product A', price: 10 };
      const itemCounter = 2;
      const cartContainer = document.createElement('div');
      cartContainer.id = "cartContainer";
      document.body.appendChild(cartContainer);
      const result = cart.dynamicCartSection(ob, itemCounter);

      expect(result.querySelector('#boxContainer')).not.toBeNull();
      expect(result.querySelector('#box img').src).toBe(ob.preview);
      expect(result.querySelector('#box h3').textContent).toBe('Product A × 2');
      expect(result.querySelector('#box h4').textContent).toBe('Amount: Rs20');
    });
  });

  describe('amountUpdate', () => {
    it('should update the total amount correctly', () => {
      const amount = 50;
      cart.amountUpdate(amount);
      const totalh4Text = document.getElementById("toth4");

      expect(totalh4Text.textContent).toBe('Amount: Rs 50');
    });
  });

  describe('httpRequest.onreadystatechange', () => {
    it('should handle successful response and update cart', () => {
      const mockResponse = '[{"id": 1, "name": "Product A", "price": 10, "preview": "preview1.jpg"}, {"id": 2, "name": "Product B", "price": 20, "preview": "preview2.jpg"}]';
      const mockRequest = new XMLHttpRequest();
      mockRequest.open = jest.fn();
      mockRequest.send = jest.fn();
      mockRequest.readyState = 4;
      mockRequest.status = 200;
      mockRequest.responseText = mockResponse;

      document.cookie = "item=1 2,counter=2";
      const originalXMLHttpRequest = global.XMLHttpRequest;
      global.XMLHttpRequest = jest.fn(() => mockRequest);

      cart.httpRequest.onreadystatechange(); // Call the function with the mocked request


      expect(document.getElementById("totalItem").textContent).toBe("Total Items: 2");
      expect(document.querySelectorAll('#box').length).toBe(2);
      expect(document.querySelector('#toth4').textContent).toBe("Amount: Rs 30");

      global.XMLHttpRequest = originalXMLHttpRequest;
    });


    it('should handle unsuccessful response', () => {
      const mockRequest = new XMLHttpRequest();
      mockRequest.open = jest.fn();
      mockRequest.send = jest.fn();
      mockRequest.readyState = 4;
      mockRequest.status = 404;
      const originalXMLHttpRequest = global.XMLHttpRequest;
      global.XMLHttpRequest = jest.fn(() => mockRequest);

      console.error = jest.fn();
      cart.httpRequest.onreadystatechange();
      expect(console.error).toHaveBeenCalledWith("call failed!");
      global.XMLHttpRequest = originalXMLHttpRequest;
    });
  });


  it('should update badge count from cookies if available', () => {
    document.body.innerHTML = '<span id="badge"></span>';
    document.cookie = 'item=1,counter=5';
    // Simulate the cart.js running
    const script = document.createElement('script');
    script.textContent = `
    if (document.cookie.indexOf(",counter=") >= 0) {
      let counter = document.cookie.split(",")[1].split("=")[1];
      document.getElementById("badge").innerHTML = counter;
    }`;
    document.body.appendChild(script);
    expect(document.getElementById('badge').innerHTML).toBe('5');

  });

  it('should not update badge if cookie not available', () => {
    document.body.innerHTML = '<span id="badge"></span>';
    document.cookie = '';
    const script = document.createElement('script');
    script.textContent = `
    if (document.cookie.indexOf(",counter=") >= 0) {
      let counter = document.cookie.split(",")[1].split("=")[1];
      document.getElementById("badge").innerHTML = counter;
    }`;
    document.body.appendChild(script);
    expect(document.getElementById('badge').innerHTML).toBe('');
  });

});

```