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

        let hisCards = data[i].cards;

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

        hisCards.map((card) => {
          addCard(card.type, card.bank, card.number.toString().slice(12, 16));
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
