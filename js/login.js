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
  } else {
    addToast(
      "pass-error",
      "Password is InCorrect",
      "The Pass Address entered is invalid",
      "danger"
    );
    $("#email-error").toast("hide");
    $("#pass-error").toast("show");
  }
};
