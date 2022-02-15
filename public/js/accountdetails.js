// nav bar JS for opening menu in mobile view
function toggleMobileMenu(menu) {
  menu.classList.toggle("open");
}

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

        const addCard = (number, type, bank, fourDigits) => {
          html = `
          <div class="card-outer-box">
            <div class="card-container">
            <img src="../img/cardsvg.svg" width="150rem">
              <div id="card-info">
                  <h6 id="type">${type}</h6>
                  <h4 id="card-bank">${bank}<h6><sub>with number ending in</sub></h6>
                  </h4>
                  <h1 id="card-end-number">${fourDigits}</h1>
                  <button type="button" class="btn btn-danger remove-card ${number}">Remove <i class="fas fa-times-circle"></i></button>
              </div>
            </div>
          </div>`;

          $(".cardbox-container").html($(".cardbox-container").html() + html);
        };

        $(".new-card-box").css("display", "none");
        $(".close-new-card").css("display", "none");

        $(".close-new-card").click(() => {
          $(".new-card-box").css("display", "none");
          $(".close-new-card").css("display", "none");
          $(".new-card").css("display", "inline");
        });

        $(".new-card").click(() => {
          $(".close-new-card").css("display", "inline");
          $(".new-card-box").css("display", "block");
          $(".new-card").css("display", "none");
          $(".add-new-card").click(() => {
            let cardNumber = $(".enter-card-number").val();
            let cardType = $(".enter-card-type").val();
            let bankName = $(".enter-bank-name").val();
            let holderName = $(".enter-holder-name").val();

            if (
              !cardNumber ||
              cardType == "Select Card Type" ||
              !bankName ||
              !holderName
            ) {
              addToast(
                "card-error",
                "Blank Fields",
                "<b>Some of the fields are left blank please enter it</b>",
                "danger"
              );

              $("#card-error").toast("show");
            } else if (cardNumber.length != 16) {
              addToast(
                "card-number-error",
                "Invalid Card",
                "<b>The Card Number you have entered is invalid</b>",
                "danger"
              );

              $("#card-number-error").toast("show");
            } else {
              allCustomers[i].cards = allCustomers[i].cards.concat([
                {
                  number: parseInt(cardNumber),
                  type: cardType,
                  bank: bankName,
                  holderName: holderName,
                },
              ]);

              sendData(
                "/customers",
                JSON.stringify(allCustomers, null, 2),
                false
              );

              addCard(cardNumber, cardType, bankName, cardNumber.slice(12, 16));

              $(".enter-card-number").val("");
              $(".enter-card-type").val("Select Card Type");
              $(".enter-bank-name").val("");
              $(".enter-holder-name").val("");
              $(".new-card-box").css("display", "none");

              addToast(
                "success-card-added",
                "Card Added",
                "<b>Your Card is successfully added",
                "success"
              );

              $("#success-card-added").toast("show");
            }
          });
        });

        $(document).ready(() => {
          $("button.remove-card").each(function () {
            $(this).click(() => {
              let cardNumber = $(this).attr("class").split(" ").reverse()[0];
              console.log("Clicking");
              for (let j = 0; j < allCustomers[i].cards.length; j++) {
                console.log(allCustomers[i].cards[j].number.toString());
                if (allCustomers[i].cards[j].number.toString() == cardNumber) {
                  console.log("Record Exits");
                  delete allCustomers[i].cards.splice(j, 1);
                  alert(
                    `The Card Number ending with ${cardNumber.slice(
                      12,
                      16
                    )} has been removed successfully`
                  );

                  sendData(
                    "/customers",
                    JSON.stringify(allCustomers, null, 2),
                    false
                  );
                  location.reload();
                  break;
                }
              }
            });
          });
        });

        $(".join-prime").click(() => {
          addToast(
            "joined-prime",
            "Unlocked Prime",
            "<b>Thank you for joining the prime membership, Level Up ++</b>",
            "info"
          );

          $("#joined-prime").toast("show");

          allCustomers[i].prime = true;
          sendData("/customers", JSON.stringify(allCustomers, null, 2), false);

          $(".join-prime").text("You are already a Prime Member") &&
            $(".join-prime").attr("disabled", true);
        });

        const addOrders = (id, date, product, pin, address, status) => {
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
                    <h6 class="delivery-address ${id}">${address}</h6>
                    <p>Delivery Status: <b id="${id}">${status}</b></p>
                    <button type="button" class="btn btn-danger cancel-order ${id}"> Cancel Order</button>
                    <button type="button" class="btn btn-warning change-address ${id}"> Change Address </button>
                </div>
            </div>
          </div>`;

          $(".orders-container").html($(".orders-container").html() + html);
        };

        hisCards.map((card) => {
          addCard(
            card.number,
            card.type,
            card.bank,
            card.number.toString().slice(12, 16)
          );
        });

        $(document).ready(() => {
          $("button.cancel-order").each(function () {
            for (let x = 0; x < allCustomers[i].orders.length; x++) {
              if (
                $(this).attr("class").toString().split(" ").reverse()[0] ==
                allCustomers[i].orders[x].id.toString()
              ) {
                if (allCustomers[i].orders[x].status == "Cancelled") {
                  $("button.cancel-order." + allCustomers[i].orders[x].id).attr(
                    "disabled",
                    true
                  );
                  $(
                    "button.change-address." + allCustomers[i].orders[x].id
                  ).attr("disabled", true);
                }
                $(this).click(() => {
                  allCustomers[i].orders[x].status = "Cancelled";
                  console.log("#" + allCustomers[i].orders[x].id);
                  $("#" + allCustomers[i].orders[x].id).text("Cancelled");
                  $("button.cancel-order." + allCustomers[i].orders[x].id).attr(
                    "disabled",
                    true
                  );
                  $(
                    "button.change-address." + allCustomers[i].orders[x].id
                  ).attr("disabled", true);
                  sendData(
                    "/customers",
                    JSON.stringify(allCustomers, null, 2),
                    false
                  );
                });

                break;
              }
            }
          });
          $("button.change-address").each(function () {
            for (let x = 0; x < allCustomers[i].orders.length; x++) {
              if (
                $(this).attr("class").toString().split(" ").reverse()[0] ==
                allCustomers[i].orders[x].id.toString()
              ) {
                $(this).click(() => {
                  let newAddress = prompt("Enter New Delivery address");
                  newAddress ||
                    (newAddress = allCustomers[i].orders[x].address);
                  $(".delivery-address." + allCustomers[i].orders[x].id).text(
                    newAddress
                  );
                  allCustomers[i].orders[x].address = newAddress;
                  sendData(
                    "/customers",
                    JSON.stringify(allCustomers, null, 2),
                    false
                  );
                });

                break;
              }
            }
          });
        });

        hisOrders.map((order) => {
          addOrders(
            order.id,
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

        $(".update-profile").css("display", "none");
        $(".update-profile").click(() => {
          alert("Your Profile has been updated successfully");
          $(".edit-profile").css("display", "inline");
          $(".update-profile").css("display", "none");

          allCustomers[i].name = $(".name").val();
          allCustomers[i].email = $(".email").val();
          allCustomers[i].number = parseInt($(".number").val());
          allCustomers[i].age = parseInt($(".age").val());
          allCustomers[i].address = $(".address").val();

          $(".name").attr("readonly", true);
          $(".email").attr("readonly", true);
          $(".number").attr("readonly", true);
          $(".age").attr("readonly", true);
          $(".address").attr("readonly", true);

          sendData("/customers", JSON.stringify(allCustomers, null, 2), false);
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
