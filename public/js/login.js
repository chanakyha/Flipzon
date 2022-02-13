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

function ValidateEmail(input) {
  var validRegex =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
  if (input.value.match(validRegex)) {
    return true;
  } else {
    return false;
  }
}

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
      RecieveData("/customers").then((data) => {
        let allCustomers = data;
        let userExists = false;

        for (let i = 0; i < allCustomers.length; i++) {
          if (allCustomers[i].email == emailAddress.value) {
            userExists = true;
            break;
          }
        }

        if (!userExists) {
          addToast(
            "user-not-found",
            "The User is not found",
            "<b><p>There is no account registered with this email address, Use create account page to create an account</p></b>",
            "danger"
          );

          $("#user-not-found").toast("show");
        } else {
          for (let i = 0; i < allCustomers.length; i++) {
            if (allCustomers[i].email == emailAddress.value) {
              if (allCustomers[i].password == password.value) {
                addToast(
                  "logged-in",
                  "You are Logged in",
                  "<p><b>Thank you for Logging in</b></p>",
                  "success"
                );
                $("#logged-in").toast("show");

                document.cookie = `userid=${allCustomers[i].id}; expires=${Date(
                  "31-12-2022"
                )}; path=/`;

                location.href = "/";
              } else {
                addToast(
                  "password-error",
                  "Incorrect Password",
                  "<b><p>The Password you have entered for the email address is invalid</p></b>",
                  "danger"
                );
                $("#password-error").toast("show");
              }
            }
          }
        }
      });
    }
  }
};

document.getElementById("signup").onclick = function () {
  location.href = "../pages/signup.html";
};
