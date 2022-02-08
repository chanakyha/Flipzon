// nav bar JS for opening menu in mobile view
function toggleMobileMenu(menu) {
  menu.classList.toggle("open");
}

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

  for (let i = 0; i < customerDetails.length; i++) {
    if (
      customerDetails[i].id.toString() === cookieUserId.replace("userid=", "")
    ) {
      document.getElementById("cart-items").innerText =
        customerDetails[i].cart.length;
    }
  }
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
