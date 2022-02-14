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

const getProduct = (price, name, frontImage, images, description) => {
  let imagess = "";

  for (let i = 0; i < images.length; i++) {
    imagess += `<div class="small-img-col">
      <img src="../img/productimg/${images[i]}" width="100%">
    </div>`;
  }

  // description = JSON.parse(description);
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
