function ValidateEmail(input) {
  var validRegex =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
  if (input.value.match(validRegex)) {
    return true;
  } else {
    return false;
  }
}

function sendmail(to, subject, body) {
  Email.send({
    Host: "smtp.gmail.com",
    Username: "chanakyha.coder@gmail.com",
    Password: "wmhnyccipclicdxr",
    To: to,
    From: "admin@FlipZon.com",
    Subject: subject,
    Body: body,
  }).then(function (message) {
    console.log(message);
  });
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
  } else {
    let errors = "";
    if (!ValidateEmail(emailAddress)) {
      errors += "<p>The Email You have Entered in not in correct format</p>";
    }
    if (age.value < 18) {
      errors +=
        "<p>You must be atlease 18 years old to create an account with FlipZon</p>";
    }
    if (mobile.value.length != 10) {
      errors += "<p>The Mobile Number you have entered is Invalid</p>";
    }
    if (password.value != rePass.value) {
      errors += "<p>The Password is not matched!</p>";
    }

    if (errors != "") {
      addToast(
        "error-fields",
        "Please Rectify the below errors",
        "<strong>" + errors + "</strong>",
        "danger"
      );
      $("#error-fields").toast("show");
    } else {
      otp_gen = Math.floor(Math.random() * (999999 - 111111 + 1)) + 111111;
      console.log(otp_gen);
      // sendmail(
      //   emailAddress.value,
      //   "FlipZon: OTP Verification Process",
      //   "Your One Time Verification Pin for registering FlipZon is " + otp_gen
      // );
      mail_otp = prompt("Enter the Otp that is sent to your mail");
      while (otp_gen != mail_otp) {
        mail_otp = prompt("Otp is Invalid, Please try again");
      }
    }
  }
};

document.getElementById("signin").onclick = function () {
  location.href = "../pages/login.html";
};
