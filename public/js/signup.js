function ValidateEmail(input) {
  var validRegex =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
  if (input.value.match(validRegex)) {
    return true;
  } else {
    return false;
  }
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

  fetch(uri, options).then((response) => {});
};

const RecieveData = async (uri) => {
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      send: false,
      data: "",
    }),
  };

  const response = await fetch(uri, options);
  const data = await response.json();
  return data;
};

const addCust = (
  e_name,
  e_photo,
  e_age,
  e_number,
  e_email,
  e_password,
  e_prime
) => {
  RecieveData("/customers").then((allCustomers) => {
    data = [
      {
        id: allCustomers.length + 1,
        avatar: e_photo,
        name: e_name,
        age: e_age,
        address: "",
        number: e_number,
        email: e_email,
        password: e_password,
        cart: [],
        cards: [],
        orders: [],
        prime: e_prime,
      },
    ];
    sendData("/customers", JSON.stringify(data, null, 2), true);
  });
};

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
  const toastHtml = `<div class="toast" id="${id}" role="alert" aria-live="assertive" aria-atomic="true" data-bs-delay="3500">
      <div class="toast-header text-light bg-${bg}">
        <strong class="me-auto">${title}</strong>
        <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
      </div>
      <div class="toast-body">${message}</div>
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

    custExists = false;
    RecieveData("/customers").then((allCustomers) => {
      for (let i = 0; i < allCustomers.length; i++) {
        if (allCustomers[i].email == emailAddress.value) {
          custExists = true;
          break;
        }
      }
    });

    if (custExists) {
      errors =
        "<p>The Email Address you have entered is already exists, please use the login page to login into FlipZon</p>";
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
      addToast(
        "success-reg",
        "Success",
        "Thank you for registering with FlipZon, After 5sec the Page will refresh and will redirect to the login page",
        "success"
      );

      $("#success-reg").toast("show");

      addCust(
        name.value,
        "",
        age.value,
        mobile.value,
        emailAddress.value,
        password.value,
        false
      );

      alert(
        "Thank you for Registering with us & This Page will be redirected to login page to login"
      );
      location.href = "./login.html";
    }
  }
};

document.getElementById("signin").onclick = function () {
  location.href = "../pages/login.html";
};
