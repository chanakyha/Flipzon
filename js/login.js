function ValidateEmail(input) {
  var validRegex =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
  if (input.value.match(validRegex)) {
    return true;
  } else {
    return false;
  }
}

function addToast(id, title, message, bg) {
  const toastHtml =
    `<div class="toast" id="` +
    id +
    `" role="alert" aria-live="assertive" aria-atomic="true" data-bs-delay="3500">
    <div class="toast-header text-light bg-` +
    bg +
    `">
      <strong class="me-auto">` +
    title +
    `</strong>
      <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
    </div>
    <div class="toast-body">
      ` +
    message +
    `
    </div>
  </div>`;

  document.getElementById("error-toast-container").innerHTML = toastHtml;
}

document.getElementById("submit").onclick = function () {
  let emailAddress = document.getElementById("email");
  let password = document.getElementById("password");
  let emptyFileds = "";

  if (emailAddress.value == "") {
    emptyFileds += "<p>The Email Address field is required!</p>";
  }
  if (password.value == "") {
    emptyFileds += "<p>The Password field is required!</p>";
  }

  if (emptyFileds != "") {
    addToast(
      "empty-fields",
      "The below mentioned fileds are required",
      "<strong>" + emptyFileds + "</strong>",
      "danger"
    );
    $("#empty-fields").toast("show");
  } else {
    let errors = "";
    if (!ValidateEmail(emailAddress)) {
      errors +=
        "<p>The Email Address you have entered is not in the right format</p>";
    }

    if (errors != "") {
      addToast(
        "error-fields",
        "Please rectify the below mentioned errors",
        "<strong>" + errors + "</strong>",
        "danger"
      );
      $("#error-fields").toast("show");
    } else {
      let userExists = false;
      for (let i = 0; i < customerDetails.length; i++) {
        if (customerDetails[i].email == emailAddress.value) {
          userExists = true;
          document.cookie =
            "userid=" +
            customerDetails[i].id +
            "; expires=" +
            new Date("2022-12-31") +
            " ;path=/";
          location.href = "../index.html";
          break;
        }
        if (!userExists) {
          addToast(
            "user-not-exist",
            "User is not registered",
            "<b><p>The Email Address you have entered is already registered with FlipZon, please use the login page to login</p></b>",
            "danger"
          );
          $("#user-exist").toast("show");
        }
      }
    }
  }
};

document.getElementById("signup").onclick = function () {
  location.href = "../pages/signup.html";
};
