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

  const cookies = document.cookie.split("; ");

  $.getJSON("../json/customer-details.json", function (data) {
    if (!document.cookie.includes("G_ENABLED_IDPS")) {
      cookieUserId = cookies[0];
    } else {
      cookieUserId = cookies[1];
    }
    for (let i = 0; i < data.length; i++) {
      if (data[i].id.toString() === cookieUserId.replace("userid=", "")) {
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
