// Checking wether the user id is saved in cookies i.e it is checking is the logined earlier
if (!document.cookie) {
  window.location.href = "./pages/login.html";
}
