document.cookie = "orderId=" + 0 + ",counter=" + 0;

let httpRequest = new XMLHttpRequest();
let jsonArray;
let method = "GET";
let jsonRequestURL = "https://5d76bf96515d1a0014085cf9.mockapi.io/order";

httpRequest.open(method, jsonRequestURL, true);
httpRequest.onreadystatechange = function () {
  if (httpRequest.readyState === 4 && httpRequest.status === 200) {
    jsonArray = JSON.parse(httpRequest.responseText);
    console.log(jsonArray);
    let newOrderId = jsonArray.length + 1;
    let orderDetails = {
      id: newOrderId,
      amount: document.getElementById("toth4").innerText.split(": ")[1],
      product: document.cookie.split(",")[0].split("=")[1].trim().split(" ")
    };
    console.log(orderDetails);
    httpRequest.open("POST", jsonRequestURL, true);
    httpRequest.setRequestHeader("Content-Type", "application/json");
    httpRequest.send(JSON.stringify(orderDetails));
  }
};
httpRequest.send(null);