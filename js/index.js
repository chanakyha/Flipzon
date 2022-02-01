// nav bar JS for opening menu in mobile view
function toggleMobileMenu(menu) {
  menu.classList.toggle("open");
}

document.getElementById("h1").innerText =
  "The ID is " + document.cookie.replace("userid=", "");
//for user authentication
if (document.cookie.includes("userid")) {
  $(".accountdetails").css("display", "block");
  $(".signinbtn").css("display", "none");

  $.getJSON("./json/customer-details.json", function (data) {
    for (let i = 0; i < data.length; i++) {
      if (data[i].id.toString() === document.cookie.replace("userid=", "")) {
        document.getElementById("cart-items").innerText = data[i].cart.length;
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
