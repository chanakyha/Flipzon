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
          let finalPrice = 0;
          let cartDetailsId = allCustomers[i].cart;
          for (let i = 0; i < cartDetailsId.length; i++) {
            htmlTable += `<tr>
              <td>${i + 1}</td>
              <td>${cartDetailsId[i].id}</td>
              <td>${cartDetailsId[i].name}</td>
              <td>x${cartDetailsId[i].quantity}</td>
              <td>${toIndianRuppe(cartDetailsId[i].mrp)}</td>
              <td>${toIndianRuppe(
                cartDetailsId[i].mrp * cartDetailsId[i].quantity
              )}</td>
              <td><button class="btn btn-danger remove-cart-item ${
                cartDetailsId[i].id
              }">Remove <i class="fad fa-times-circle"></i></button> </td>
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
                  finalPrice = (5 / 100) * totalPrice + totalPrice;
                  $(".apply-coupon").css("display", "none");
                  $(".remove-coupon").css("display", "inline");
                  foundCoupon = true;
                }

                if (!foundCoupon && $(".entered-coupon").val() != "") {
                  addToast(
                    "coupon-error",
                    "Invalid Coupon Code",
                    "<b>The Coupon Code you have entered is Invalid</b>",
                    "danger"
                  );
                  $("#coupon-error").toast("show");
                }
              }
            });
          });

          $(".proceed-payment").click(() => {
            let cardsHtml = ``;
            for (let x = 0; x < allCustomers[i].cards.length; x++) {
              cardsHtml += `
              <option value="${allCustomers[i].cards[x].number}">${
                allCustomers[i].cards[x].type
              }: XX ${allCustomers[i].cards[x].number
                .toString()
                .slice(12, 16)}</option>
              `;
            }

            $(".checkout-pay").click(() => {
              let Name = $("#NameOnCard").val();
              let CardNumber = $("#CardNumber").val();
              let Expiry = $("#ExpiryDate").val();
              let CVV = $("#SecurityCode").val();
              let zipcode = $("#ZIPCode").val();

              if (!Name || !CardNumber || !Expiry || !CVV || !zipcode) {
                addToast(
                  "checkout-error",
                  "You Have Blank Fields",
                  "Please enter all the fiels in order to checkout",
                  "danger"
                );
                $("#checkout-error").toast("show");
              } else {
                console.log("Checkout Done");
              }
            });

            $(".saved-cards-display").on("change", (e) => {
              if ($(".saved-cards-display").val() == "none") {
                $("#NameOnCard").val("");
                $("#CardNumber").val("");
              } else {
                for (let x = 0; x < allCustomers[i].cards.length; x++) {
                  if (
                    $(".saved-cards-display").val() ==
                    allCustomers[i].cards[x].number.toString()
                  ) {
                    $("#NameOnCard").val(allCustomers[i].cards[x].holderName);
                    $("#CardNumber").val(allCustomers[i].cards[x].number);
                    break;
                  }
                }
              }
            });

            $(".add-card-above").click();

            $("#final-price-modal").html(toIndianRuppe(finalPrice));
            $(".saved-cards-display").html(
              $(".saved-cards-display").html() + cardsHtml
            );
            $("#PaymentModal").modal("show");
          });

          $(document).ready(() => {
            $("button.remove-cart-item").each(function () {
              $(this).click(() => {
                let productId = $(this).attr("class").split(" ").reverse()[0];

                for (let j = 0; j < allCustomers[i].cart.length; j++) {
                  if (productId == allCustomers[i].cart[j].id.toString()) {
                    allCustomers[i].cart.splice(j, 1);
                    alert("Deleted an item");
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
            finalPrice = (5 / 100) * totalPrice + totalPrice;
          });

          $(".cart-table-body").html(htmlTable);
          $(".total-mrp").html("&nbsp;" + toIndianRuppe(totalPrice));
          $(".price-reduced").html(toIndianRuppe(0));
          $(".tax-percentage").html("5%");
          $(".final-price-1").html(
            toIndianRuppe((5 / 100) * totalPrice + totalPrice)
          );

          console.log(totalPrice);

          finalPrice = (5 / 100) * totalPrice + totalPrice;
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
