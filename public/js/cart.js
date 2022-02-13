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

const toIndianRuppe = (number) => {
  let transformed = number.toLocaleString("en-IN", {
    maximumFractionDigits: 2,
    style: "currency",
    currency: "INR",
  });

  return transformed;
};

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
        if (allCustomers[i].cart.length == 0) {
          $(".cart-table").html(
            "<div class='alert bg-danger text-light'><p>No items in your cart</p></div>"
          );
        } else {
          let totalPrice = 0;
          let htmlTable = "";
          let cartDetailsId = allCustomers[i].cart;
          for (let i = 0; i < cartDetailsId.length; i++) {
            htmlTable += `<tr>
              <td>${i + 1}</td>
              <td>${cartDetailsId[i].id}</td>
              <td>${cartDetailsId[i].name}</td>
              <td><a href="#">More Details...</a></td>
              <td>x${cartDetailsId[i].quantity}</td>
              <td>${toIndianRuppe(cartDetailsId[i].mrp)}</td>
              <td>${toIndianRuppe(
                cartDetailsId[i].mrp * cartDetailsId[i].quantity
              )}</td>
            </tr>`;
            totalPrice += cartDetailsId[i].mrp * cartDetailsId[i].quantity;
          }

          $(".remove-coupon").css("display", "none");
          $(".entered-coupon").keyup(() => {
            $(".entered-coupon").val($(".entered-coupon").val().toUpperCase());
          });

          let beforeCouponPrice = totalPrice;

          $(".apply-coupon").click(() => {
            RecieveData("/coupons").then((coupon) => {
              let entertedCoupon = $(".entered-coupon").val();
              let foundCoupon = false;
              for (let i = 0; i < coupon.length; i++) {
                if (coupon[i].tag == entertedCoupon) {
                  $(".entered-coupon").attr("disabled", true);
                  $(".price-reduced").html(
                    toIndianRuppe(totalPrice * (coupon[i].percentage / 100)) +
                      ` (${coupon[i].percentage}%)`
                  );
                  totalPrice -= totalPrice * (coupon[i].percentage / 100);
                  $(".final-price-1").html(
                    toIndianRuppe((5 / 100) * totalPrice + totalPrice)
                  );
                  $(".apply-coupon").css("display", "none");
                  $(".remove-coupon").css("display", "inline");
                  foundCoupon = true;
                }

                if (!foundCoupon && $(".entered-coupon").val() != "") {
                  addToast(
                    "coupon-error",
                    "Invalid Coupon Code",
                    "The Coupon Code you have entered is Invalid",
                    "danger"
                  );
                  $("#coupon-error").toast("show");
                }
              }
            });
          });

          $(".remove-coupon").click(() => {
            totalPrice = beforeCouponPrice;
            console.log($(".price-reduced").html());
            $(".price-reduced").html(toIndianRuppe(0));
            $(".final-price-1").html(
              toIndianRuppe((5 / 100) * totalPrice + totalPrice)
            );
            $(".entered-coupon").val("");
            $(".entered-coupon").attr("disabled", false);
            $(".apply-coupon").css("display", "inline");
            $(".remove-coupon").css("display", "none");
          });

          $(".cart-table-body").html(htmlTable);
          $(".total-mrp").html("&nbsp;" + toIndianRuppe(totalPrice));
          $(".price-reduced").html(toIndianRuppe(0));
          $(".tax-percentage").html("5%");
          $(".final-price-1").html(
            toIndianRuppe((5 / 100) * totalPrice + totalPrice)
          );

          console.log(totalPrice);
        }
        document.getElementById("cart-items").innerText =
          allCustomers[i].cart.length;
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
