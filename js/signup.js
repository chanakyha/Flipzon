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

  document.getElementById("error-toast-container").innerHTML += toastHtml;
}

document.getElementById("submit").onclick = function () {
  let emailAddress = document.getElementById("email");
  let password = document.getElementById("password");

  if (!ValidateEmail(emailAddress)) {
    addToast(
      "email-error",
      "Email Address Invalid!",
      "The Email Address entered is invalid",
      "danger"
    );
    $("#email-error").toast("show");
  } else if (password.value === "") {
    addToast(
      "password-blank",
      "The Password Filed is Blank",
      "The Password field is Required!",
      "danger"
    );
    $("#password-blank").toast("show");
  } else {
    $.getJSON("../json/customer-details.json", function (data) {
      let idExists = false;
      for (var i = 0; i < data.length; i++) {
        if (emailAddress.value === data[i].email) {
          idExists = true;
          if (password.value === data[i].password) {
            console.log(data[i].name + " is Logged in");
            document.cookie =
              "userid=" +
              data[i].id +
              "; expires=" +
              new Date("2022-12-31") +
              " ;path=/";
            location.href = "../index.html";
          } else {
            addToast(
              "pass-error",
              "Invalid Password",
              "The Password you have entered is incorrect",
              "danger"
            );
            $("#pass-error").toast("show");
          }
        }
      }

      if (!idExists) {
        addToast(
          "user-not-found",
          "User Not found",
          "The Entered email address is not registered with FlipZon, Please register it",
          "danger"
        );
        $("#user-not-found").toast("show");
      }
    });
  }
};

document.getElementById("signin").onclick = function () {
  location.href = "../pages/login.html";
};
