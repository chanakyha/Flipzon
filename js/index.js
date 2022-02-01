// nav bar JS for opening menu in mobile view
function toggleMobileMenu(menu) {
  menu.classList.toggle("open");
}

document.getElementById("h1").innerText =
  "The ID is " + document.cookie.replace("userid=", "");

console.log(document.getElementsByName("accountdetails"));

if (document.cookie.includes("userid")) {
  $(".accountdetails").css("display", "block");
  $(".signinbtn").css("display", "none");
} else {
  $(".accountdetails").css("display", "none");
  $(".signinbtn").css("display", "block");
}
