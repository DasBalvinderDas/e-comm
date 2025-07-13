let contentTitle;
let containerClothing = document.getElementById("containerClothing");
let containerAccessories = document.getElementById("containerAccessories");

function dynamicClothingSection(ob) {
  let boxDiv = document.createElement("div");
  boxDiv.id = "box";

  let boxLink = document.createElement("a");
  boxLink.href = "/contentDetails/" + ob.id;

  let imgTag = document.createElement("img");
  imgTag.src = ob.preview;

  let detailsDiv = document.createElement("div");
  detailsDiv.id = "details";

  let h3 = document.createElement("h3");
  let h3Text = document.createTextNode(ob.name);
  h3.appendChild(h3Text);

  let h4 = document.createElement("h4");
  let h4Text = document.createTextNode(ob.brand);
  h4.appendChild(h4Text);

  let h2 = document.createElement("h2");
  let h2Text = document.createTextNode("Rs " + ob.price);
  h2.appendChild(h2Text);

  boxLink.appendChild(imgTag);
  boxLink.appendChild(detailsDiv);
  detailsDiv.appendChild(h3);
  detailsDiv.appendChild(h4);
  detailsDiv.appendChild(h2);
  boxDiv.appendChild(boxLink);

  return boxDiv;
}

let httpRequest = new XMLHttpRequest();

httpRequest.onreadystatechange = function () {
  if (this.readyState === 4) {
    if (this.status === 200) {
      contentTitle = JSON.parse(this.responseText);
      for (let i = 0; i < contentTitle.length; i++) {
        if (contentTitle[i].isAccessory) {
          containerAccessories.appendChild(dynamicClothingSection(contentTitle[i]));
        } else {
          containerClothing.appendChild(dynamicClothingSection(contentTitle[i]));
        }
      }
    }
  }
};

httpRequest.open(
  "GET",
  "https://5d76bf96515d1a0014085cf9.mockapi.io/product",
  true
);
httpRequest.send();