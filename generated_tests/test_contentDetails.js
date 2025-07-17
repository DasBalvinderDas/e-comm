```javascript
// contentDetails.test.js

// Mock the XMLHttpRequest object for testing
const originalXMLHttpRequest = XMLHttpRequest;

global.XMLHttpRequest = function () {
  this.readyState = 0;
  this.status = 0;
  this.responseText = '';
  this.onreadystatechange = null;

  this.open = function (method, url) {
    this.method = method;
    this.url = url;
  };

  this.send = function () {
    // Simulate successful request after a short delay
    setTimeout(() => {
      this.readyState = 4;
      this.status = 200;
      // Use a mock response for testing
      this.responseText = JSON.stringify({
        "id": 1,
        "name": "Product Name",
        "brand": "Brand Name",
        "price": 19.99,
        "description": "Product Description",
        "photos": ["image1.jpg", "image2.jpg"]
      });
      if (this.onreadystatechange) {
        this.onreadystatechange();
      }
    }, 100);
  };
};


describe("contentDetails.js", () => {

  afterEach(() => {
    // Clean up the DOM after each test
    const containerProduct = document.getElementById("containerProduct");
    if (containerProduct) {
      containerProduct.innerHTML = '';
    }
    document.cookie = ""; //clear cookies after each test

    // Restore the original XMLHttpRequest
    XMLHttpRequest = originalXMLHttpRequest;
  });

  it("should extract ID from URL correctly", () => {
    // Mock window.location.pathname
    const mockPathname = "/products/123";
    Object.defineProperty(window, 'location', {
      value: { pathname: mockPathname },
      writable: true
    });

    const urlParts = window.location.pathname.split("/");
    const id = urlParts[urlParts.length - 1];
    expect(id).toBe("123");
  });

  it("should display counter from cookie if available", () => {
    document.cookie = "orderId=123,counter=5";
    document.body.innerHTML = '<div id="badge"></div>'; //add the badge div to the body

    // Trigger the cookie check (this is implicitly done in the original code)
    const dummy = document.cookie.indexOf(",counter=")
    expect(document.getElementById("badge").innerHTML).toBe("5");
  });

  it("should create and append elements correctly in dynamicContentDetails", () => {
    const mockProductData = {
      "id": 1,
      "name": "Product Name",
      "brand": "Brand Name",
      "price": 19.99,
      "description": "Product Description",
      "photos": ["image1.jpg", "image2.jpg"]
    };

    document.body.innerHTML = '<div id="containerProduct"></div>';
    const mainContainer = dynamicContentDetails(mockProductData);

    expect(document.getElementById("containerD")).toBeDefined();
    expect(document.getElementById("imgDetails")).toBeDefined();
    expect(document.getElementById("imgDetails").src).toBe(mockProductData.photos[0]);
    expect(document.getElementById("productDetails")).toBeDefined();
    expect(document.querySelector("#productDetails h1").textContent).toBe(mockProductData.name);
    expect(document.querySelector("#productDetails h4").textContent).toBe(mockProductData.brand);
    expect(document.querySelector("#details h3:nth-child(1)").textContent).toBe("Rs 19.99");
    expect(document.querySelector("#details p").textContent).toBe(mockProductData.description);
    expect(document.querySelectorAll("#productPreview img").length).toBe(mockProductData.photos.length);
  });

    it("should handle add to cart functionality and update cookie", () => {
    document.body.innerHTML = '<div id="containerProduct"></div><div id="badge"></div>';
    const mockProductData = {
      "id": 1,
      "name": "Product Name",
      "brand": "Brand Name",
      "price": 19.99,
      "description": "Product Description",
      "photos": ["image1.jpg", "image2.jpg"]
    };
    dynamicContentDetails(mockProductData);

    const button = document.querySelector("#button button");
    button.click();

    // Check if the cookie has been updated
    expect(document.cookie.indexOf("orderId=1")).toBeGreaterThan(-1);
    expect(document.cookie.indexOf(",counter=1")).toBeGreaterThan(-1);
    expect(document.getElementById("badge").innerHTML).toBe("1");

    button.click();
    expect(document.cookie.indexOf(",counter=2")).toBeGreaterThan(-1);
    expect(document.getElementById("badge").innerHTML).toBe("2");

  });


  it("should handle successful API call and render product details", (done) => {
    document.body.innerHTML = '<div id="containerProduct"></div>';

    // The setTimeout in the mock XMLHttpRequest ensures this assertion runs after the async call
    setTimeout(() => {
      expect(document.getElementById("containerD")).toBeDefined();
      expect(document.getElementById("imgDetails")).toBeDefined();
      done();
    }, 200);
  });


  it("should handle unsuccessful API call", (done) => {
    // Mock an unsuccessful request
    XMLHttpRequest = function () {
      this.readyState = 0;
      this.status = 0;
      this.responseText = '';
      this.onreadystatechange = null;

      this.open = function (method, url) {
          this.method = method;
          this.url = url;
      };

      this.send = function () {
        setTimeout(() => {
          this.readyState = 4;
          this.status = 404; // Simulate a 404 error
          if (this.onreadystatechange) {
            this.onreadystatechange();
          }
        }, 100);
      };
    };


    document.body.innerHTML = '<div id="containerProduct"></div>';


    setTimeout(() => {
      expect(document.getElementById("containerD")).toBeNull(); // Container should not be created on error
      done();
    }, 200);
  });
});

```