console.clear();

let urlParts = window.location.pathname.split("/");
let id = urlParts[urlParts.length - 1]; // The ID is the last part of the path

console.log("Extracted ID:", id);

// Function to dynamically create and display product details
function dynamicContentDetails(ob) {
  let mainContainer = document.createElement("div");
  mainContainer.id = "containerD";
  document.getElementById("containerProduct").appendChild(mainContainer);

  let imageSectionDiv = document.createElement("div");
  imageSectionDiv.id = "imageSection";

  let imgTag = document.createElement("img");
  imgTag.id = "imgDetails";
  imgTag.src = ob.preview;

  imageSectionDiv.appendChild(imgTag);

  let productDetailsDiv = document.createElement("div");
  productDetailsDiv.id = "productDetails";

  let h1 = document.createElement("h1");
  let h1Text = document.createTextNode(ob.name);
  h1.appendChild(h1Text);

  let h4 = document.createElement("h4");
  let h4Text = document.createTextNode(ob.brand);
  h4.appendChild(h4Text);

  let detailsDiv = document.createElement("div");
  detailsDiv.id = "details";

  let h3DetailsDiv = document.createElement("h3");
  let h3DetailsText = document.createTextNode("Rs " + ob.price);
  h3DetailsDiv.appendChild(h3DetailsText);

  let h3 = document.createElement("h3");
  let h3Text = document.createTextNode("Description");
  h3.appendChild(h3Text);

  let para = document.createElement("p");
  let paraText = document.createTextNode(ob.description);
  para.appendChild(paraText);

  let productPreviewDiv = document.createElement("div");
  productPreviewDiv.id = "productPreview";

  let h3ProductPreviewDiv = document.createElement("h3");
  let h3ProductPreviewText = document.createTextNode("Product Preview");
  h3ProductPreviewDiv.appendChild(h3ProductPreviewText);
  productPreviewDiv.appendChild(h3ProductPreviewDiv);

  for (let i = 0; i < ob.photos.length; i++) {
    let imgTagProductPreviewDiv = document.createElement("img");
    imgTagProductPreviewDiv.id = "previewImg";
    imgTagProductPreviewDiv.src = ob.photos[i];
    imgTagProductPreviewDiv.onclick = function (event) {
      imgTag.src = ob.photos[i];
      document.getElementById("imgDetails").src = this.src;
    };
    productPreviewDiv.appendChild(imgTagProductPreviewDiv);
  }

  let buttonDiv = document.createElement("div");
  buttonDiv.id = "button";

  let buttonTag = document.createElement("button");
  buttonDiv.appendChild(buttonTag);

  let buttonText = document.createTextNode("Add to Cart");
  buttonTag.onclick = function () {
    let order = id + " ";
    let counter = 1;

    if (document.cookie.indexOf(",counter=") >= 0) {
      order = id + " " + document.cookie.split(",")[0].split("=")[1];
      counter = Number(document.cookie.split(",")[1].split("=")[1]) + 1;
    }

    // Setting the orderId and counter cookies with path="/"
    document.cookie = "orderId=" + order + "; path=/";
    document.cookie = "counter=" + counter + "; path=/";

    document.getElementById("badge").innerHTML = counter;
    console.log(document.cookie);
  };
  buttonTag.appendChild(buttonText);

  mainContainer.appendChild(imageSectionDiv);
  mainContainer.appendChild(productDetailsDiv);
  productDetailsDiv.appendChild(h1);
  productDetailsDiv.appendChild(h4);
  productDetailsDiv.appendChild(detailsDiv);
  detailsDiv.appendChild(h3DetailsDiv);
  detailsDiv.appendChild(h3);
  detailsDiv.appendChild(para);
  productDetailsDiv.appendChild(productPreviewDiv);
  productDetailsDiv.appendChild(buttonDiv);

  return mainContainer;
}

// BACKEND CALLING

let httpRequest = new XMLHttpRequest();
{
  httpRequest.onreadystatechange = function () {
    if (this.readyState === 4 && this.status == 200) {
      console.log("connected!!");
      let contentDetails = JSON.parse(this.responseText);
      dynamicContentDetails(contentDetails);
    } else {
      console.log("not connected!");
    }
  };
}

httpRequest.open(
  "GET",
  "https://5d76bf96515d1a0014085cf9.mockapi.io/product/" + id,
  true
);
httpRequest.send();
