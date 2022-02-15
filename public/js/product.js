// nav bar JS for opening menu in mobile view
function toggleMobileMenu(menu) {
  menu.classList.toggle("open");
}

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

  fetch(uri, options).then((response) => {});
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

RecieveData("/mobiles").then((mobileData) => {
  const addMobile = (img, name, rating, toLink, price) => {
    let html = `
    <div class="col-4">
      <a href="../pages/product-desc.html#${toLink}" class="phone-link-${toLink}">
          <img src="../img/productimg/${img}">
          <h4>${name}</h4>
      </a>
      <h4>&#8377; ${price}</h4>
      <div class="rating">
          ${'<i class="fa fa-star"></i> '.repeat(rating)}
      </div>
    </div>`;

    $(".mobile-phones").html($(".mobile-phones").html() + html);
  };

  mobileData.map((mobile) => {
    addMobile(mobile.img, mobile.name, mobile.rating, mobile.id, mobile.mrp);
  });
});

$(".searchbar_container > input").keypress(function (event) {
  var keycode = event.keyCode ? event.keyCode : event.which;
  if (keycode == "13") {
    location.href = "../pages/product.html";
  }
});
