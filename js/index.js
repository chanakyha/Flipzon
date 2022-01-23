// Checking wether the user id is saved in cookies i.e it is checking is the logined earlier
if (!document.cookie) {
  location.href = "./pages/login.html";
}

document.getElementById("h1").innerText = "The ID is " + document.cookie;
