// nav bar JS for opening menu in mobile view
function toggleMobileMenu(menu) {
  menu.classList.toggle("open");
}

const sendData = (uri, data) => {
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      send: true,
      content: data,
    }),
  };

  fetch(uri, options);
};

const RecieveData = async (uri) => {
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      send: false,
      data: undefined,
    }),
  };

  const response = await fetch(uri, options);
  const data = await response.json();
  return data;
};

$(".update-profile").css("display", "none");
$(".update-profile").click(() => {
  $(".edit-profile").css("display", "inline");
  $(".update-profile").css("display", "none");

  $(".name").attr("readonly", true);
  $(".email").attr("readonly", true);
  $(".number").attr("readonly", true);
  $(".age").attr("readonly", true);
  $(".address").attr("readonly", true);
});

$(".edit-profile").click(() => {
  $(".update-profile").css("display", "inline");
  $(".edit-profile").css("display", "none");

  $(".name").attr("readonly", false);
  $(".email").attr("readonly", false);
  $(".number").attr("readonly", false);
  $(".age").attr("readonly", false);
  $(".address").attr("readonly", false);
});

const addToast = (id, title, message, bg) => {
  const toastHtml = `<div class="toast" id="${id}" role="alert" aria-live="assertive" aria-atomic="true" data-bs-delay="3500">
    <div class="toast-header text-light bg-${bg}">
      <strong class="me-auto">${title}</strong>
      <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
    </div>
    <div class="toast-body">
      ${message}
    </div>
  </div>`;

  document.getElementById("error-toast-container").innerHTML = toastHtml;
};

$(".join-prime").click(() => {
  addToast(
    "joined-prime",
    "Unlocked Prime",
    "<b>Thank you for joining the prime membership, Level Up ++</b>",
    "info"
  );

  $("#joined-prime").toast("show");
});

//for user authentication
if (document.cookie.includes("userid")) {
  $(".accountdetails").css("display", "block");
  $(".signinbtn").css("display", "none");

  const cookies = document.cookie.split("; ");

  if (document.cookie.includes("G_ENABLED_IDPS")) {
    cookieUserId = cookies[1];
  } else {
    cookieUserId = cookies[0];
  }

  RecieveData("/customers").then((data) => {
    let allCustomers = data;
    for (let i = 0; i < allCustomers.length; i++) {
      if (
        allCustomers[i].id.toString() === cookieUserId.replace("userid=", "")
      ) {
        document.getElementById("cart-items").innerText =
          allCustomers[i].cart.length;

        allCustomers[i].prime &&
          $(".join-prime").text("You are already a Prime Member") &&
          $(".join-prime").attr("disabled", true);

        let hisCards = data[i].cards;
        let hisOrders = data[i].orders;

        const addCard = (type, bank, fourDigits) => {
          html = `
          <div class="card-outer-box">
            <div class="card-container">
            <img src="../img/cardsvg.svg" width="150rem">
              <div id="card-info">
                  <h6 id="type">${type}</h6>
                  <h4 id="card-bank">${bank}<h6><sub>with number ending in</sub></h6>
                  </h4>
                  <h1 id="card-end-number">${fourDigits}</h1>
                  <button type="button" class="btn btn-warning">Change card Info</button>
              </div>
            </div>
          </div>`;

          $(".cardbox-container").html($(".cardbox-container").html() + html);
        };

        const addOrders = (date, product, pin, address, status) => {
          html = `
          <div class="order-outer-box">
            <div class="order-container">
                <div style="text-align: center; ">
                    <img src="../img/order_illustration.svg" alt="order image" width="200rem">
                    <p><b>${product}</b></p>
                </div>
                <div class="order-info">
                    <p>Your order will be delivered by:</p>
                    <h2>${date}</h2>
                    <p>Your secret delivery PIN (please give only to delivery person):</p>
                    <h3>${pin}</h3>
                </div>
                <div class="order-info">
                    <p>Delivery address: </p>
                    <h6>${address}</h6>
                    <p>Delivery Status: <b>${status}</b></p>
                    <button type="button" class="btn btn-danger"> Cancel Order</button>
                    <button type="button" class="btn btn-warning"> Change Address </button>
                </div>
            </div>
          </div>`;

          $(".orders-container").html($(".orders-container").html() + html);
        };

        hisCards.map((card) => {
          addCard(card.type, card.bank, card.number.toString().slice(12, 16));
        });

        hisOrders.map((order) => {
          addOrders(
            order.deliveryDate,
            order.products[0].prouctName,
            order.pin,
            order.address,
            order.status
          );
        });

        $(".name").attr("readonly", true);
        $(".email").attr("readonly", true);
        $(".number").attr("readonly", true);
        $(".age").attr("readonly", true);
        $(".address").attr("readonly", true);

        $(".name").val(allCustomers[i].name);
        $(".email").val(allCustomers[i].email);
        $(".number").val(allCustomers[i].number);
        $(".age").val(allCustomers[i].age);
        $(".address").val(allCustomers[i].address);
      }
    }
  });
} else {
  $(".accountdetails").css("display", "none");
  $(".signinbtn").css("display", "block");
}

document.getElementById("signout").onclick = function () {
  document.cookie = "userid=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  location.href = "../index.html";
};
document.getElementById("cart").onclick = function () {
  location.href = "../pages/cart.html";
};

//for opening of sub menus using navigation buttons
let accOrder = document.getElementById("acc-order");
let accProfile = document.getElementById("acc-profile");
let accPayment = document.getElementById("acc-payment");
let accPrime = document.getElementById("acc-prime");

document.getElementById("order-btn").onclick = function showorder() {
  accOrder.style.display = "block";
  accProfile.style.display = "none";
  accPayment.style.display = "none";
  accPrime.style.display = "none";
};
document.getElementById("profile-btn").onclick = function showprofile() {
  accProfile.style.display = "block";
  accOrder.style.display = "none";
  accPayment.style.display = "none";
  accPrime.style.display = "none";
};
document.getElementById("payment-btn").onclick = function showpayment() {
  accPayment.style.display = "block";
  accOrder.style.display = "none";
  accProfile.style.display = "none";
  accPrime.style.display = "none";
};
document.getElementById("prime-btn").onclick = function showprime() {
  accPrime.style.display = "block";
  accOrder.style.display = "none";
  accPayment.style.display = "none";
  accProfile.style.display = "none";
};

document.getElementById("profile-btn").click();
