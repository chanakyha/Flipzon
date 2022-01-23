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
    `" role="alert" aria-live="assertive" aria-atomic="true" data-bs-autohide="false">
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
            alert("You are logged in");
          } else {
            addToast(
              "pass-error",
              "Password is InCorrect",
              "The Pass Address entered is invalid",
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
