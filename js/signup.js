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
  let name = document.getElementById("name");
  let age = document.getElementById("age");
  let mobile = document.getElementById("mobile");
  let emailAddress = document.getElementById("email");
  let password = document.getElementById("password");
  let rePass = document.getElementById("re-password");

  let blanksFileds = "";
  let errors = "";

  if (name.value == "") {
    blanksFileds += "<p>The Name field is required!</p>";
  }
  if (age.value == "") {
    blanksFileds += "<p>The Age field is required!</p>";
  }
  if (mobile.value == "") {
    blanksFileds += "<p>The Mobile Number field is required!</p>";
  }
  if (emailAddress.value == "") {
    blanksFileds += "<p>The Email Address field is required!</p>";
  }
  if (password.value == "") {
    blanksFileds += "<p>The Password field is required!</p>";
  }
  if (rePass.value == "") {
    blanksFileds += "<p>The ReEnter Password field is required!</p>";
  }

  if (blanksFileds != "") {
    addToast(
      "blank-fields",
      "Please fill these Blank fields",
      "<strong>" + blanksFileds + "</strong>",
      "danger"
    );
    $("#blank-fields").toast("show");
  }
};

document.getElementById("signin").onclick = function () {
  location.href = "../pages/login.html";
};
