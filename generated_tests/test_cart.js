```javascript
// Test cases for cart.js

describe("cart.js", () => {

  beforeEach(() => {
    // Mock the DOM elements for testing
    document.body.innerHTML = `
      <div id="badge"></div>
      <div id="cartContainer"></div>
      <div id="totalItem"></div>
    `;
  });


  it("should update the badge with the counter from cookies", () => {
    document.cookie = "itemId=1 2,counter=2";
    // Simulate the script running
    eval(cartJS); // Assuming cart.js content is in cartJS variable.

    expect(document.getElementById("badge").innerHTML).toBe("2");
  });

  it("should handle cases with no counter in cookies", () => {
    document.cookie = "itemId=1 2";
    //Simulate the script running
    eval(cartJS); // Assuming cart.js content is in cartJS variable.
    expect(document.getElementById("badge").innerHTML).toBe("");
  });

  it("should create and append elements to the cart dynamically", () => {
      document.cookie = "itemId=1 2,counter=2";
      // Mock the XMLHttpRequest response
      const mockResponse = '[{"id": 1, "name": "Product 1", "price": 10, "preview": "preview1.jpg"}, {"id": 2, "name": "Product 2", "price": 20, "preview": "preview2.jpg"}]';
      const mockXMLHttpRequest = {
          readyState: 4,
          status: 200,
          responseText: mockResponse
      };

      // Spy on the XMLHttpRequest object
      spyOn(window, 'XMLHttpRequest').and.returnValue(mockXMLHttpRequest);

      // Simulate the script running
      eval(cartJS); // Assuming cart.js content is in cartJS variable.

      expect(document.getElementById("cartContainer").querySelectorAll("#box").length).toBe(2);
      expect(document.getElementById("totalItem").textContent).toContain("Total Items: 2");
      expect(document.querySelector("#box h3").textContent).toContain("Product 1");
  });

  it("should calculate and display the total amount correctly", () => {
      document.cookie = "itemId=1 1,counter=2";
      const mockResponse = '[{"id": 1, "name": "Product 1", "price": 10, "preview": "preview1.jpg"}]';
      const mockXMLHttpRequest = {
          readyState: 4,
          status: 200,
          responseText: mockResponse
      };
      spyOn(window, 'XMLHttpRequest').and.returnValue(mockXMLHttpRequest);
      eval(cartJS); // Assuming cart.js content is in cartJS variable.
      expect(document.querySelector("#toth4").textContent).toContain("Amount: Rs 20");
  });


  it("dynamicCartSection should create the correct elements", () => {
    const ob = { preview: "test.jpg", name: "Test Product", price: 15 };
    const itemCounter = 2;
    const result = dynamicCartSection(ob, itemCounter);

    expect(result.id).toBe("boxContainer");
    expect(result.querySelector("img").src).toBe("test.jpg");
    expect(result.querySelector("h3").textContent).toBe("Test Product × 2");
    expect(result.querySelector("h4").textContent).toBe("Amount: Rs30");
  });

  it("amountUpdate should update the total amount display", () => {
    amountUpdate(50);
    expect(document.getElementById("toth4").textContent).toBe("Amount: Rs 50");
  });

    it("button click should log to console", () => {
        spyOn(console, 'log');
        document.body.innerHTML += '<div id="total"><div id="button"><button><a href="/orderPlaced"></a></button></div></div>';
        eval(cartJS);
        document.querySelector('button').click();
        expect(console.log).toHaveBeenCalledWith("clicked");
    });


});


//This needs to be replaced with the actual content of your cart.js file.
let cartJS = `
console.clear();

if (document.cookie.indexOf(",counter=") >= 0) {
  let counter = document.cookie.split(",")[1].split("=")[1];
  document.getElementById("badge").innerHTML = counter;
}

let cartContainer = document.getElementById("cartContainer");
let boxContainerDiv = document.createElement("div");
boxContainerDiv.id = "boxContainer";
let totalContainerDiv = document.createElement("div");
totalContainerDiv.id = "totalContainer";
let totalDiv = document.createElement("div");
totalDiv.id = "total";
totalContainerDiv.appendChild(totalDiv);
let totalh2 = document.createElement("h2");
let h2Text = document.createTextNode("Total Amount");
totalh2.appendChild(h2Text);
totalDiv.appendChild(totalh2);
let buttonDiv = document.createElement("div");
buttonDiv.id = "button";
totalDiv.appendChild(buttonDiv);
let buttonTag = document.createElement("button");
buttonDiv.appendChild(buttonTag);
let buttonLink = document.createElement("a");
buttonLink.href = "/orderPlaced";
buttonTag.appendChild(buttonLink);
let buttonText = document.createTextNode("Place Order");
buttonTag.onclick = function () {
  console.log("clicked");
};

function dynamicCartSection(ob, itemCounter) {
  let boxDiv = document.createElement("div");
  boxDiv.id = "box";
  boxContainerDiv.appendChild(boxDiv);

  let boxImg = document.createElement("img");
  boxImg.src = ob.preview;
  boxDiv.appendChild(boxImg);

  let boxh3 = document.createElement("h3");
  let h3Text = document.createTextNode(ob.name + " × " + itemCounter);
  boxh3.appendChild(h3Text);
  boxDiv.appendChild(boxh3);

  let boxh4 = document.createElement("h4");
  let h4Text = document.createTextNode("Amount: Rs" + ob.price * itemCounter);
  boxh4.appendChild(h4Text);
  boxDiv.appendChild(boxh4);
  return boxContainerDiv;
}


function amountUpdate(amount) {
  let totalh4 = document.createElement("h4");
  let totalh4Text = document.createTextNode("Amount: Rs " + amount);
  totalh4Text.id = "toth4";
  totalh4.appendChild(totalh4Text);
  totalDiv.appendChild(totalh4);
  totalDiv.appendChild(buttonDiv);
}

let httpRequest = new XMLHttpRequest();
let totalAmount = 0;
httpRequest.onreadystatechange = function () {
  if (this.readyState === 4) {
    if (this.status == 200) {
      contentTitle = JSON.parse(this.responseText);

      let counter = Number(document.cookie.split(",")[1].split("=")[1]);
      document.getElementById("totalItem").innerHTML = "Total Items: " + counter;

      let item = document.cookie.split(",")[0].split("=")[1].split(" ");
      let i;
      totalAmount = 0;
      for (i = 0; i < counter; i++) {
          let itemCounter = 1;
          for (let j = i + 1; j < counter; j++) {
              if (Number(item[j]) == Number(item[i])) {
                  itemCounter += 1;
              }
          }
          totalAmount += Number(contentTitle[item[i] - 1].price) * itemCounter;
          cartContainer.appendChild(dynamicCartSection(contentTitle[item[i]-1], itemCounter));
          i += itemCounter - 1;
      }
      amountUpdate(totalAmount);
      cartContainer.appendChild(totalContainerDiv);
    }
  }
};

httpRequest.open(
  "GET",
  "https://5d76bf96515d1a0014085cf9.mockapi.io/product",
  true
);
httpRequest.send();
`;
```