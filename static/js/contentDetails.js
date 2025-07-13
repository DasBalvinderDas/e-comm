console.clear();

let urlParts = window.location.pathname.split("/");
let id = urlParts[urlParts.length - 1];

console.log("Extracted ID:", id);

if (document.cookie.indexOf(",counter=") >= 0) {
  let counter = document.cookie.split(",")[1].split("=")[1];
  document.getElementById("badge").innerHTML = counter;
}

function dynamicContentDetails(ob) {
  let mainContainer = document.createElement("div");
  mainContainer.id = "containerD";
  document.getElementById("containerProduct").appendChild(mainContainer);

  let imageSectionDiv = document.createElement("div");
  imageSectionDiv.id = "imageSection";
  let imgTag = document.createElement("img");
  imgTag.id = "imgDetails";
  imgTag.src = ob.photos[0]; // Use the first image as default
  imageSectionDiv.appendChild(imgTag);
  mainContainer.appendChild(imageSectionDiv);


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
  let buttonText = document.createTextNode("Add to Cart");
  buttonTag.appendChild(buttonText);
  buttonDiv.appendChild(buttonTag);

  buttonTag.onclick = function () {
    let order = id + " ";
    let counter = 1;
    if (document.cookie.indexOf(",counter=") >= 0) {
      let cookieParts = document.cookie.split(",");
      let existingOrder = cookieParts[0].split("=")[1].trim();
      counter = Number(cookieParts[1].split("=")[1]);
      if (!isNaN(counter)) {
        counter += 1;
      } else {
        counter = 1;
      }
      order = existingOrder + " " + id;
    }
    document.cookie = "orderId=" + order + ",counter=" + counter + ";path=/";
    document.getElementById("badge").innerHTML = counter;
    console.log(document.cookie);
  };
  

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


let httpRequest = new XMLHttpRequest();
httpRequest.onreadystatechange = function () {
  if (this.readyState === 4 && this.status == 200) {
    let contentDetails = JSON.parse(this.responseText);
    dynamicContentDetails(contentDetails);
  }
};

httpRequest.open(
  "GET",
  "https://5d76bf96515d1a0014085cf9.mockapi.io/product/" + id,
  true
);
httpRequest.send();