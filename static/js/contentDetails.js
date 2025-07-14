console.clear();

let urlParts = window.location.pathname.split("/");
let id = urlParts[urlParts.length - 1]; // The ID is the last part of the path

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
  mainContainer.appendChild(imageSectionDiv);

  let imgTag = document.createElement("img");
  imgTag.id = "imgDetails";
  imgTag.src = ob.photos[0]; // Set initial image source
  imageSectionDiv.appendChild(imgTag);

  let productDetailsDiv = document.createElement("div");
  productDetailsDiv.id = "productDetails";
  mainContainer.appendChild(productDetailsDiv);

  let h1 = document.createElement("h1");
  let h1Text = document.createTextNode(ob.name);
  h1.appendChild(h1Text);
  productDetailsDiv.appendChild(h1);

  let h4 = document.createElement("h4");
  let h4Text = document.createTextNode(ob.brand);
  h4.appendChild(h4Text);
  productDetailsDiv.appendChild(h4);

  let detailsDiv = document.createElement("div");
  detailsDiv.id = "details";
  productDetailsDiv.appendChild(detailsDiv);

  let h3DetailsDiv = document.createElement("h3");
  let h3DetailsText = document.createTextNode("Rs " + ob.price);
  h3DetailsDiv.appendChild(h3DetailsText);
  detailsDiv.appendChild(h3DetailsDiv);

  let h3 = document.createElement("h3");
  let h3Text = document.createTextNode("Description");
  h3.appendChild(h3Text);
  detailsDiv.appendChild(h3);

  let para = document.createElement("p");
  let paraText = document.createTextNode(ob.description);
  para.appendChild(paraText);
  detailsDiv.appendChild(para);

  let productPreviewDiv = document.createElement("div");
  productPreviewDiv.id = "productPreview";
  productDetailsDiv.appendChild(productPreviewDiv);

  let h3ProductPreviewDiv = document.createElement("h3");
  let h3ProductPreviewText = document.createTextNode("Product Preview");
  h3ProductPreviewDiv.appendChild(h3ProductPreviewText);
  productPreviewDiv.appendChild(h3ProductPreviewDiv);


  let i;
  for (i = 0; i < ob.photos.length; i++) {
    let imgTagProductPreviewDiv = document.createElement("img");
    imgTagProductPreviewDiv.id = "previewImg";
    imgTagProductPreviewDiv.src = ob.photos[i];
    imgTagProductPreviewDiv.addEventListener("click", function(event) {
      console.log("clicked" + this.src);
      imgTag.src = this.src; // Correctly reference imgTag
    });
    productPreviewDiv.appendChild(imgTagProductPreviewDiv);
  }

  let buttonDiv = document.createElement("div");
  buttonDiv.id = "button";
  productDetailsDiv.appendChild(buttonDiv);

  let buttonTag = document.createElement("button");
  buttonDiv.appendChild(buttonTag);

  buttonText = document.createTextNode("Add to Cart");
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

      order = existingOrder + " " + id; // Corrected order string concatenation
    }

    document.cookie = "orderId=" + order + ",counter=" + counter + ";path=/";
    document.getElementById("badge").innerHTML = counter;
    console.log(document.cookie);
  };
  buttonTag.appendChild(buttonText);

  return mainContainer;
}

let httpRequest = new XMLHttpRequest();
httpRequest.onreadystatechange = function () {
  if (this.readyState === 4 && this.status == 200) {
    console.log("connected!!");
    let contentDetails = JSON.parse(this.responseText);
    dynamicContentDetails(contentDetails);
  } else {
    console.log("not connected!");
  }
};

httpRequest.open(
  "GET",
  "https://5d76bf96515d1a0014085cf9.mockapi.io/product/" + id,
  true
);
httpRequest.send();
```

```html