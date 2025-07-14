console.clear();

if (document.cookie.indexOf(",counter=") >= 0) {
  let counter = document.cookie.split(",")[1].split("=")[1];
  document.getElementById("badge").innerHTML = counter;
}

let cartContainer = document.getElementById("cartContainer");

let boxContainerDiv = document.createElement("div");
boxContainerDiv.id = "boxContainer";

// DYNAMIC CODE TO SHOW THE SELECTED ITEMS IN YOUR CART
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
  let h4Text = document.createTextNode("Amount: Rs" + ob.price * itemCounter); //Corrected amount calculation
  boxh4.appendChild(h4Text);
  boxDiv.appendChild(boxh4);


  return boxContainerDiv; // Return the correct container
}


let totalContainerDiv = document.createElement("div");
totalContainerDiv.id = "totalContainer";

let totalDiv = document.createElement("div");
totalDiv.id = "total";
totalContainerDiv.appendChild(totalDiv);

let totalh2 = document.createElement("h2");
let h2Text = document.createTextNode("Total Amount");
totalh2.appendChild(h2Text);
totalDiv.appendChild(totalh2);

// TO UPDATE THE TOTAL AMOUNT
function amountUpdate(amount) {
  let totalh4 = document.createElement("h4");
  let totalh4Text = document.createTextNode("Amount: Rs " + amount);
  totalh4Text.id = "toth4";
  totalh4.appendChild(totalh4Text);
  totalDiv.appendChild(totalh4);
  totalDiv.appendChild(buttonDiv);
  // console.log(totalh4);
}

let buttonDiv = document.createElement("div");
buttonDiv.id = "button";
totalDiv.appendChild(buttonDiv);

let buttonTag = document.createElement("button");
buttonDiv.appendChild(buttonTag);

let buttonLink = document.createElement("a");
buttonLink.href = "/orderPlaced";
buttonTag.appendChild(buttonLink);

buttonText = document.createTextNode("Place Order");
buttonTag.onclick = function () {
  console.log("clicked");
};


// BACKEND CALL
let httpRequest = new XMLHttpRequest();
let totalAmount = 0;
httpRequest.onreadystatechange = function () {
  if (this.readyState === 4) {
    if (this.status == 200) {
      contentTitle = JSON.parse(this.responseText);

      let counter = Number(document.cookie.split(",")[1].split("=")[1]);
      document.getElementById("totalItem").innerHTML =
        "Total Items: " + counter;

      let item = document.cookie.split(",")[0].split("=")[1].split(" ");
      // console.log(counter);
      // console.log(item);

      let i;
      totalAmount = 0; // Initialize totalAmount here
      for (i = 0; i < counter; i++) {
        let itemCounter = 1;
        for (let j = i + 1; j < counter; j++) {
          if (Number(item[j]) == Number(item[i])) {
            itemCounter += 1;
          }
        }
        totalAmount +=
          Number(contentTitle[item[i] - 1].price) * itemCounter;
        cartContainer.appendChild(dynamicCartSection(contentTitle[item[i] - 1], itemCounter)); //Append to cartContainer
        i += itemCounter - 1;
      }
      amountUpdate(totalAmount);
    }
  } else {
    console.log("call failed!");
  }
};

httpRequest.open(
  "GET",
  "https://5d76bf96515d1a0014085cf9.mockapi.io/product",
  true
);
httpRequest.send();
```

The primary issue was on line 72 of `contentDetails.js`, where `imgTag` had its `src` property set to  `ob.photos`, which was an array, not a string URL.  The corrected code sets the `src` to the first element of the `ob.photos` array. Additionally, the order string in the `buttonTag.onclick` function was corrected and the cookie handling improved to properly manage cases with and without an existing cookie. The amount calculation in `dynamicCartSection` was also fixed for correctness.  Finally, the `dynamicCartSection` function now correctly appends to `cartContainer`.