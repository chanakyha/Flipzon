// nav bar JS for opening menu in mobile view
function toggleMobileMenu(menu) {
  menu.classList.toggle("open");
}

let signedIn = false;

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
        signedIn = true;

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

const getProduct = (price, name, frontImage, images, description) => {
  let imagess = "";

  for (let i = 0; i < images.length; i++) {
    imagess += `<div class="small-img-col">
      <img src="../img/productimg/${images[i]}" width="100%">
    </div>`;
  }

  let alldecHTML = "";

  for (let i in description) {
    alldecHTML += `
    <tr>
      <th>${i.toUpperCase()}</th>
      <td>${description[i]}</td>
    </tr>`;
  }

  $(".small-img-row").html(imagess);
  $(".product-description").html(alldecHTML);
  $(".price-product").text(price);
  $(".main-mobile-img").attr("src", `../img/productimg/${frontImage}`);
  $(".product-name").text(name);
};

!window.location.href.includes("#") &&
  (location.href = "../pages/product.html");

let theProduct = window.location.href.split("#").reverse()[0];
RecieveData("/mobiles").then((mobiles) => {
  for (let i = 0; i < mobiles.length; i++) {
    if (mobiles[i].id.toString() == theProduct) {
      getProduct(
        mobiles[i].mrp,
        mobiles[i].name,
        mobiles[i].img,
        mobiles[i].insideImages,
        mobiles[i].specs
      );
    }
  }
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

RecieveData("/customers").then((customers) => {
  for (let i = 0; i < customers.length; i++) {
    if (customers[i].id.toString() == cookieUserId.replace("userid=", "")) {
      for (let j = 0; j < customers[i].cart.length; j++) {
        if (customers[i].cart[j].id.toString() == theProduct) {
          $(".add-to-cart").html(`<i class="fas fa-check"></i> Added to card`);
          $(".add-to-cart").attr("class", "add-to-cart btn btn-warning");
          $(".add-to-cart").attr("disabled", true);
          break;
        }
      }

      break;
    }
  }
});

$(".searchbar_container > input").keypress(function (event) {
  var keycode = event.keyCode ? event.keyCode : event.which;
  if (keycode == "13") {
    location.href = "../pages/product.html";
  }
});

$(".add-to-cart").click(() => {
  if (!signedIn) {
    alert("You have to login first");
    location.href = "../pages/login.html";
  } else {
    $(".add-to-cart").html(`<i class="fas fa-check"></i> Added to card`);
    $(".add-to-cart").attr("class", "add-to-cart btn btn-warning");
    $(".add-to-cart").attr("disabled", true);
    RecieveData("/customers").then((data) => {
      for (let i = 0; i < data.length; i++) {
        if (data[i].id.toString() == cookieUserId.replace("userid=", "")) {
          $("#cart-items").text(data[i].cart.length + 1);
          data1 = data;
          console.log(data1);
          data1[i].cart = data1[i].cart.concat([
            {
              id: theProduct,
              name: $(".product-name").text(),
              quantity: $(".quantity").val(),
              mrp: parseFloat($(".price-product").text()),
              coupon: false,
            },
          ]);
          sendData("/customers", JSON.stringify(data1, null, 2), false);
        }
      }
    });
  }
});
