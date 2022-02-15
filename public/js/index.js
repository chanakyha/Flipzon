// nav bar JS for opening menu in mobile view
function toggleMobileMenu(menu) {
  menu.classList.toggle("open");
}

$(".search-box").keypress(function (event) {
  var keycode = event.keyCode ? event.keyCode : event.which;
  if (keycode == "13") {
    location.href = "../pages/product.html";
  }
});

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

// document.getElementById("h1").innerText =
//   "The ID is " + document.cookie.replace("userid=", "");

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
  window.signedIn = false;
  RecieveData("/customers").then((data) => {
    $(".sign-in-index").css("display", "none");
    $(".view-profile").css("display", "none");
    let allCustomers = data;
    var signedIn = false;
    for (let i = 0; i < allCustomers.length; i++) {
      if (
        allCustomers[i].id.toString() === cookieUserId.replace("userid=", "")
      ) {
        $(".view-profile").css("display", "inline");
        signedIn = true;
        document.getElementById("cart-items").innerText =
          allCustomers[i].cart.length;
        break;
      }
    }

    !signedIn && $(".sign-in-index").css("display", "inline");
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
